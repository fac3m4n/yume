/// Module: yume::liquidation
///
/// Handles liquidation of expired loans in the Yume lending protocol.
/// Any address can trigger a liquidation when a loan is past maturity,
/// acting as a "keeper" or liquidation bot.
///
/// # Architecture Notes
/// - Liquidation uses only shared objects (CollateralVault) — no owned objects needed
/// - Loan metadata (LoanInfo) stored in the vault during settlement enables
///   third-party liquidators to verify maturity and claim collateral
/// - Phase 3 (current): Direct collateral transfer to lender as compensation
/// - Production: Will route collateral through DeepBook V3 for market sell,
///   pay lender principal + interest from proceeds, return surplus to borrower
///
/// # DeepBook Integration (Production TODO)
/// ```
/// PTB Flow:
///   1. liquidate() → seize collateral Balance<COLLATERAL>
///   2. deepbook::place_market_order() → sell collateral for BASE
///   3. Split proceeds: lender gets (principal + interest), borrower gets surplus
/// ```
///
/// # Dependencies
/// - yume::vault (collateral storage, loan metadata)
///
/// # Consumers
/// - Off-chain keeper bots (monitor expired loans and trigger liquidation)
/// - Frontend liquidation dashboard (Phase 4)
#[allow(unused_mut_parameter, lint(self_transfer))]
module yume::liquidation;

use sui::clock::{Self, Clock};
use sui::coin;
use sui::event;
use yume::vault::{Self, CollateralVault};

// ============================================================
// Error Constants
// ============================================================

/// Abort: Loan has not yet expired (maturity_time not reached)
const ELoanNotExpired: u64 = 400;
/// Abort: No collateral exists for this loan (already liquidated or repaid)
const EAlreadyLiquidated: u64 = 401;

// ============================================================
// Events
// ============================================================

/// Emitted when a loan is liquidated.
/// Used by off-chain indexers to track liquidation activity
/// and by frontends to update position status.
public struct LoanLiquidated has copy, drop {
    /// The loan identifier
    loan_id: ID,
    /// Address that triggered the liquidation (keeper/liquidator)
    liquidator: address,
    /// Lender's address (receives collateral)
    lender: address,
    /// Borrower's address (lost collateral)
    borrower: address,
    /// Principal amount that was borrowed
    principal: u64,
    /// Collateral amount seized
    collateral_seized: u64,
    /// Clock timestamp when liquidation occurred
    liquidation_time: u64,
}

// ============================================================
// Entry Functions
// ============================================================

/// Liquidates an expired loan by seizing collateral from the vault.
///
/// Anyone can call this function (permissionless liquidation).
/// The function verifies the loan has passed its maturity time using
/// the Sui Clock, then seizes the collateral and transfers it to
/// the lender as compensation.
///
/// # Phase 3 (Current) — Simplified Liquidation
/// Collateral is directly transferred to the lender. This is a
/// simplified model suitable for the hackathon demo. In production,
/// the collateral would be routed through DeepBook for market sell.
///
/// # Production Enhancement (DeepBook CPI)
/// ```move
/// // Future: Route through DeepBook for fair market liquidation
/// public fun liquidate_via_deepbook<BASE, COLLATERAL>(
///     vault_obj: &mut CollateralVault<COLLATERAL>,
///     deepbook_pool: &mut Pool<COLLATERAL, BASE>,
///     loan_id: ID,
///     clock: &Clock,
///     ctx: &mut TxContext,
/// ) {
///     // 1. Seize collateral
///     // 2. Place market sell on DeepBook
///     // 3. Split proceeds: lender gets principal+interest, borrower gets surplus
/// }
/// ```
///
/// # Parameters
/// - `vault_obj`: CollateralVault shared object (holds collateral + loan metadata)
/// - `loan_id`: The loan identifier to liquidate
/// - `clock`: Sui shared Clock object (address: 0x6)
///
/// # Abort Conditions
/// - `EAlreadyLiquidated` (401): No collateral exists for this loan_id
/// - `ELoanNotExpired` (400): Current time <= maturity time
/// - `ELoanInfoNotFound` (201): No loan info exists (from vault module)
entry fun liquidate<COLLATERAL>(
    vault_obj: &mut CollateralVault<COLLATERAL>,
    loan_id: ID,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    // Verify collateral still exists (not already liquidated or repaid)
    assert!(vault::has_collateral(vault_obj, loan_id), EAlreadyLiquidated);

    // Read loan metadata from vault
    let info = vault::get_loan_info(vault_obj, loan_id);

    // Verify loan is past maturity
    let current_time = clock::timestamp_ms(clock);
    assert!(current_time > vault::loan_info_maturity_time(&info), ELoanNotExpired);

    let lender_addr = vault::loan_info_lender(&info);
    let borrower_addr = vault::loan_info_borrower(&info);
    let principal = vault::loan_info_principal(&info);

    // Seize collateral from vault
    let collateral_seized = vault::loan_info_collateral_amount(&info);
    let collateral_balance = vault::withdraw(vault_obj, loan_id);
    let collateral_coin = coin::from_balance(collateral_balance, ctx);

    // Remove loan metadata (loan is now closed)
    vault::remove_loan_info(vault_obj, loan_id);

    // Phase 3: Transfer full collateral to lender as compensation
    // Production: Would route through DeepBook, pay lender principal+interest,
    //             return surplus to borrower
    transfer::public_transfer(collateral_coin, lender_addr);

    // Emit liquidation event
    event::emit(LoanLiquidated {
        loan_id,
        liquidator: tx_context::sender(ctx),
        lender: lender_addr,
        borrower: borrower_addr,
        principal,
        collateral_seized,
        liquidation_time: current_time,
    });
}
