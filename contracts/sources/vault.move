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

use sui::object::{Self, UID, ID};
use sui::balance::{Self, Balance};
use sui::dynamic_field;
use sui::tx_context::TxContext;
use sui::event;

// ============================================================
// Error Constants
// ============================================================

/// Abort: No collateral found for the given loan_id
const ECollateralNotFound: u64 = 200;

// ============================================================
// Structs
// ============================================================

/// Dynamic field key for storing loan collateral.
/// Each loan's collateral is stored as a dynamic field on the vault,
/// keyed by the loan_id (which is the lender's LoanPosition object ID).
public struct CollateralKey has copy, drop, store {
    loan_id: ID,
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
