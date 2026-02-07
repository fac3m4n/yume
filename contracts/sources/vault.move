/// Module: yume::vault
///
/// Manages collateral escrow for active loans in the Yume lending protocol.
/// Each CollateralVault is a shared object created alongside an OrderBook,
/// holding borrower collateral for all active loans in that market.
///
/// # Architecture Notes
/// - Uses Sui dynamic fields to store `Balance<COLLATERAL>` keyed by loan_id
/// - This avoids making COLLATERAL non-phantom on the struct (preserving type-level tagging)
/// - One vault per market (created with the OrderBook in create_market)
///
/// # Dependencies
/// - sui::dynamic_field (collateral storage)
/// - sui::balance (Balance<T> for holding funds)
///
/// # Consumers
/// - yume::market (settle deposits collateral, repay withdraws it)
module yume::vault;

use sui::balance::{Self, Balance};
use sui::dynamic_field;
use sui::event;

// ============================================================
// Error Constants
// ============================================================

/// Abort: No collateral found for the given loan_id
const ECollateralNotFound: u64 = 200;
/// Abort: No loan info found for the given loan_id
const ELoanInfoNotFound: u64 = 201;

// ============================================================
// Structs
// ============================================================

/// Dynamic field key for storing loan collateral.
/// Each loan's collateral is stored as a dynamic field on the vault,
/// keyed by the loan_id (which is the lender's LoanPosition object ID).
public struct CollateralKey has copy, drop, store {
    loan_id: ID,
}

/// Dynamic field key for storing loan metadata.
/// Stored alongside collateral so liquidators can check maturity
/// without needing access to owned LoanPosition objects.
public struct LoanInfoKey has copy, drop, store {
    loan_id: ID,
}

/// Loan metadata stored in the vault for liquidation checks.
/// This allows third-party liquidators to verify loan expiry
/// using only the shared CollateralVault (no owned objects needed).
public struct LoanInfo has store, drop, copy {
    /// The lender's address (receives collateral on liquidation)
    lender: address,
    /// The borrower's address (receives surplus on liquidation)
    borrower: address,
    /// Principal amount in base asset units
    principal: u64,
    /// Interest rate in basis points
    rate: u64,
    /// Clock timestamp (ms) when the loan matures
    maturity_time: u64,
    /// Collateral amount locked
    collateral_amount: u64,
}

/// Holds all collateral for active loans in a specific lending market.
/// Created alongside the OrderBook and shared as a Sui shared object.
///
/// Collateral balances are stored as dynamic fields (not struct fields)
/// to keep the COLLATERAL type parameter phantom. This means the vault's
/// binary layout is independent of the collateral type.
///
/// # Type Parameters
/// - `COLLATERAL`: The collateral asset type (phantom — only used in dynamic field values)
///
/// # Abilities
/// - `key`: Shared object in Sui's global storage
public struct CollateralVault<phantom COLLATERAL> has key {
    id: UID,
    /// Total number of active collateral positions
    active_loans: u64,
    /// Total collateral value locked (in collateral asset units)
    total_locked: u64,
}

// ============================================================
// Events
// ============================================================

/// Emitted when collateral is deposited into the vault during settlement
public struct CollateralDeposited has copy, drop {
    loan_id: ID,
    amount: u64,
}

/// Emitted when collateral is withdrawn from the vault (repayment or liquidation)
public struct CollateralWithdrawn has copy, drop {
    loan_id: ID,
    amount: u64,
}

// ============================================================
// Constructor
// ============================================================

/// Creates a new empty CollateralVault.
/// Only callable within the yume package.
///
/// # Returns
/// A new `CollateralVault<COLLATERAL>` with zero active loans
public(package) fun new<COLLATERAL>(ctx: &mut TxContext): CollateralVault<COLLATERAL> {
    CollateralVault {
        id: object::new(ctx),
        active_loans: 0,
        total_locked: 0,
    }
}

/// Shares a CollateralVault as a Sui shared object.
/// Must be called from within the yume package (transfer::share_object
/// is restricted to the defining module).
public(package) fun share<COLLATERAL>(vault_obj: CollateralVault<COLLATERAL>) {
    transfer::share_object(vault_obj);
}

// ============================================================
// Collateral Management
// ============================================================

/// Deposits collateral for a newly created loan.
/// Called during settlement to escrow the borrower's collateral.
///
/// The collateral `Balance<COLLATERAL>` is stored as a dynamic field
/// on the vault, keyed by the loan_id. This allows O(1) lookup
/// and withdrawal during repayment or liquidation.
///
/// # Parameters
/// - `vault`: Mutable reference to the CollateralVault
/// - `loan_id`: The loan identifier (lender's LoanPosition object ID)
/// - `collateral`: The collateral balance to deposit
///
/// # Abort Conditions
/// - None (dynamic_field::add aborts if key already exists)
public(package) fun deposit<COLLATERAL>(
    vault: &mut CollateralVault<COLLATERAL>,
    loan_id: ID,
    collateral: Balance<COLLATERAL>,
) {
    let amount = balance::value(&collateral);

    dynamic_field::add(
        &mut vault.id,
        CollateralKey { loan_id },
        collateral,
    );

    vault.active_loans = vault.active_loans + 1;
    vault.total_locked = vault.total_locked + amount;

    event::emit(CollateralDeposited { loan_id, amount });
}

/// Withdraws collateral for a loan (on repayment or liquidation).
/// Returns the full collateral balance to the caller.
///
/// # Parameters
/// - `vault`: Mutable reference to the CollateralVault
/// - `loan_id`: The loan identifier to withdraw collateral for
///
/// # Returns
/// The full `Balance<COLLATERAL>` that was escrowed for this loan
///
/// # Abort Conditions
/// - `ECollateralNotFound` (200): No collateral exists for this loan_id
public(package) fun withdraw<COLLATERAL>(
    vault: &mut CollateralVault<COLLATERAL>,
    loan_id: ID,
): Balance<COLLATERAL> {
    assert!(
        dynamic_field::exists_(&vault.id, CollateralKey { loan_id }),
        ECollateralNotFound,
    );

    let collateral: Balance<COLLATERAL> = dynamic_field::remove(
        &mut vault.id,
        CollateralKey { loan_id },
    );

    let amount = balance::value(&collateral);
    vault.active_loans = vault.active_loans - 1;
    vault.total_locked = vault.total_locked - amount;

    event::emit(CollateralWithdrawn { loan_id, amount });

    collateral
}

/// Checks if collateral exists for a given loan_id.
public fun has_collateral<COLLATERAL>(
    vault: &CollateralVault<COLLATERAL>,
    loan_id: ID,
): bool {
    dynamic_field::exists_(&vault.id, CollateralKey { loan_id })
}

// ============================================================
// Accessor Functions
// ============================================================

/// Returns the number of active collateral positions
public fun active_loans<COLLATERAL>(vault: &CollateralVault<COLLATERAL>): u64 {
    vault.active_loans
}

/// Returns the total collateral value locked
public fun total_locked<COLLATERAL>(vault: &CollateralVault<COLLATERAL>): u64 {
    vault.total_locked
}

// ============================================================
// Loan Info Management (for Liquidation)
// ============================================================

/// Stores loan metadata alongside collateral.
/// Called during settlement so liquidators can check loan terms
/// without needing owned position objects.
public(package) fun store_loan_info<COLLATERAL>(
    vault: &mut CollateralVault<COLLATERAL>,
    loan_id: ID,
    lender: address,
    borrower: address,
    principal: u64,
    rate: u64,
    maturity_time: u64,
    collateral_amount: u64,
) {
    let info = LoanInfo {
        lender,
        borrower,
        principal,
        rate,
        maturity_time,
        collateral_amount,
    };
    dynamic_field::add(&mut vault.id, LoanInfoKey { loan_id }, info);
}

/// Reads loan metadata from the vault.
/// Used by the liquidation module to check maturity and addresses.
///
/// # Abort Conditions
/// - `ELoanInfoNotFound` (201): No loan info exists for this loan_id
public fun get_loan_info<COLLATERAL>(
    vault: &CollateralVault<COLLATERAL>,
    loan_id: ID,
): LoanInfo {
    assert!(
        dynamic_field::exists_(&vault.id, LoanInfoKey { loan_id }),
        ELoanInfoNotFound,
    );
    *dynamic_field::borrow(&vault.id, LoanInfoKey { loan_id })
}

/// Removes loan metadata from the vault.
/// Called after repayment or liquidation.
public(package) fun remove_loan_info<COLLATERAL>(
    vault: &mut CollateralVault<COLLATERAL>,
    loan_id: ID,
) {
    let _info: LoanInfo = dynamic_field::remove(
        &mut vault.id,
        LoanInfoKey { loan_id },
    );
}

/// Checks if loan info exists for a given loan_id.
public fun has_loan_info<COLLATERAL>(
    vault: &CollateralVault<COLLATERAL>,
    loan_id: ID,
): bool {
    dynamic_field::exists_(&vault.id, LoanInfoKey { loan_id })
}

// ============================================================
// LoanInfo Accessor Functions
// ============================================================

/// Returns the lender address from loan info
public fun loan_info_lender(info: &LoanInfo): address { info.lender }
/// Returns the borrower address from loan info
public fun loan_info_borrower(info: &LoanInfo): address { info.borrower }
/// Returns the principal amount from loan info
public fun loan_info_principal(info: &LoanInfo): u64 { info.principal }
/// Returns the interest rate from loan info
public fun loan_info_rate(info: &LoanInfo): u64 { info.rate }
/// Returns the maturity timestamp from loan info
public fun loan_info_maturity_time(info: &LoanInfo): u64 { info.maturity_time }
/// Returns the collateral amount from loan info
public fun loan_info_collateral_amount(info: &LoanInfo): u64 { info.collateral_amount }
