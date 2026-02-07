/// Module: yume::market
///
/// Entry point module for the Yume lending protocol.
/// Provides user-facing functions for market creation, order management,
/// the Hot Potato settlement flow with real Coin transfers, and loan repayment.
///
/// # Architecture Notes
/// - `entry` functions for standalone PTB commands (create, place, cancel, repay)
/// - `public` functions for composable PTB commands (match + settle)
/// - All sensitive state changes use `entry` or the Hot Potato pattern
/// - Lenders deposit `Coin<BASE>` when placing orders (funds locked in OrderBook)
/// - Borrowers provide `Coin<COLLATERAL>` during settlement
/// - Collateral is escrowed in the CollateralVault until repayment
///
/// # PTB Construction (Frontend) — Settlement Flow
/// ```typescript
/// const tx = new Transaction();
/// // Split borrower's collateral coin to exact amount
/// const [collateral] = tx.splitCoins(borrowerCoin, [tx.pure.u64(collateralRequired)]);
/// // Command 1: Match orders (returns MatchReceipt — Hot Potato)
/// const [receipt] = tx.moveCall({
///     target: `${PKG}::market::match_orders`,
///     typeArguments: [baseType, collateralType],
///     arguments: [tx.object(bookId), tx.pure.u64(takerId), tx.pure.u64(makerId), tx.object('0x6')],
/// });
/// // Command 2: Settle (consumes Hot Potato, transfers coins, creates positions)
/// tx.moveCall({
///     target: `${PKG}::market::settle`,
///     typeArguments: [baseType, collateralType],
///     arguments: [receipt, collateral, tx.object(bookId), tx.object(vaultId), tx.object('0x6')],
/// });
/// ```
///
/// # Dependencies
/// - yume::orderbook (order storage, matching logic, deposit management)
/// - yume::position (MatchReceipt, LoanPosition creation)
/// - yume::vault (CollateralVault for collateral escrow)
///
/// # Consumers
/// - Frontend hooks (usePlaceLendOrder, usePlaceBorrowOrder, useSettle, useRepay)
/// - Off-chain keepers (liquidation bots — Phase 3)
#[allow(unused_mut_parameter, lint(self_transfer))]
module yume::market;

use sui::clock::{Self, Clock};
use sui::coin::{Self, Coin};
use sui::event;
use yume::orderbook::{Self, OrderBook};
use yume::position::{Self, MatchReceipt, LoanPosition};
use yume::vault::{Self, CollateralVault};

// ============================================================
// Constants
// ============================================================

/// Order side: Lending (offering capital)
const ORDER_SIDE_LEND: u8 = 0;
/// Order side: Borrowing (requesting capital)
const ORDER_SIDE_BORROW: u8 = 1;

/// Position status: Loan has been repaid
const STATUS_REPAID: u8 = 1;

/// Basis points denominator (100% = 10,000 bps)
const BPS_DENOMINATOR: u64 = 10000;

// ============================================================
// Error Constants
// ============================================================

/// Abort: Collateral coin value is less than required
const EInsufficientCollateral: u64 = 300;
/// Abort: Repayment coin value is less than total due
const EInsufficientRepayment: u64 = 301;
/// Abort: Position is not a borrower position (must be side=1)
const ENotBorrowerPosition: u64 = 302;

// ============================================================
// Events
// ============================================================

/// Emitted when a loan is fully repaid
public struct LoanRepaid has copy, drop {
    loan_id: ID,
    borrower: address,
    lender: address,
    principal: u64,
    interest: u64,
    total_repaid: u64,
}

// ============================================================
// Entry Functions — Market Administration
// ============================================================

/// Creates a new lending market (OrderBook + CollateralVault) as shared objects.
///
/// Anyone can create a market. Each market is uniquely defined by its
/// type parameters (BASE/COLLATERAL) and configuration (duration, risk tier).
/// Both the OrderBook and CollateralVault are shared for parallel access.
///
/// # Type Parameters
/// - `BASE`: The lending asset type (e.g., USDC)
/// - `COLLATERAL`: The collateral asset type (e.g., SUI)
///
/// # Parameters
/// - `duration_bucket`: Loan duration in seconds
///   - `0`: Open term (variable rate, callable)
///   - `604800`: 7-day fixed
///   - `2592000`: 30-day fixed
///   - `7776000`: 90-day fixed
/// - `risk_tier`: Risk classification (0 = Tier A, 1 = Tier B)
/// - `max_ltv_bps`: Maximum Loan-to-Value in basis points (e.g., 9000 = 90%)
entry fun create_market<BASE, COLLATERAL>(
    duration_bucket: u64,
    risk_tier: u8,
    max_ltv_bps: u64,
    ctx: &mut TxContext,
) {
    let book = orderbook::new<BASE, COLLATERAL>(
        duration_bucket,
        risk_tier,
        max_ltv_bps,
        ctx,
    );
    let vault_obj = vault::new<COLLATERAL>(ctx);

    orderbook::share(book);
    vault::share(vault_obj);
}

// ============================================================
// Entry Functions — Order Management
// ============================================================

/// Places a lend order and locks the lender's funds in the OrderBook.
///
/// The lender deposits their `Coin<BASE>` which is stored as a dynamic field
/// on the OrderBook (keyed by order_id). The order amount is derived from
/// the coin value. Funds remain locked until settlement or cancellation.
///
/// # Type Parameters
/// - `BASE`: Must match the OrderBook's base asset type
/// - `COLLATERAL`: Must match the OrderBook's collateral asset type
///
/// # Parameters
/// - `book`: The OrderBook shared object
/// - `deposit`: The lender's `Coin<BASE>` to deposit (determines order amount)
/// - `rate`: Interest rate in basis points (1 bp = 0.01%, range: 1-10000)
/// - `clock`: Sui shared Clock object (address: 0x6)
///
/// # Abort Conditions
/// - `EMarketInactive` (107): Market is paused
/// - `EInvalidAmount` (103): Coin value below minimum
/// - `EInvalidRate` (102): Rate is 0 or exceeds 10000
entry fun place_lend_order<BASE, COLLATERAL>(
    book: &mut OrderBook<BASE, COLLATERAL>,
    deposit: Coin<BASE>,
    rate: u64,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    let amount = coin::value(&deposit);
    let timestamp = clock::timestamp_ms(clock);
    let sender = tx_context::sender(ctx);

    let order_id = orderbook::add_order(
        book,
        ORDER_SIDE_LEND,
        amount,
        rate,
        timestamp,
        sender,
    );

    // Store lender's funds as a dynamic field on the OrderBook
    orderbook::store_deposit<BASE, COLLATERAL>(
        book,
        order_id,
        coin::into_balance(deposit),
    );
}

/// Places a borrow order (no deposit required).
///
/// Borrowers specify the amount they wish to borrow and their maximum
/// acceptable interest rate. No funds are locked at order time — the
/// borrower provides collateral during settlement.
///
/// # Type Parameters
/// - `BASE`: Must match the OrderBook's base asset type
/// - `COLLATERAL`: Must match the OrderBook's collateral asset type
///
/// # Parameters
/// - `book`: The OrderBook shared object
/// - `amount`: Amount to borrow in base asset units
/// - `rate`: Maximum interest rate willing to pay (basis points)
/// - `clock`: Sui shared Clock object (address: 0x6)
///
/// # Abort Conditions
/// - `EMarketInactive` (107): Market is paused
/// - `EInvalidAmount` (103): Amount below minimum
/// - `EInvalidRate` (102): Rate is 0 or exceeds 10000
entry fun place_borrow_order<BASE, COLLATERAL>(
    book: &mut OrderBook<BASE, COLLATERAL>,
    amount: u64,
    rate: u64,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    let timestamp = clock::timestamp_ms(clock);
    let sender = tx_context::sender(ctx);

    orderbook::add_order(
        book,
        ORDER_SIDE_BORROW,
        amount,
        rate,
        timestamp,
        sender,
    );
}

/// Cancels an existing order. Only the order owner can cancel.
///
/// If the order is a lend order with a locked deposit, the deposit
/// is returned to the caller as a `Coin<BASE>`.
///
/// # Parameters
/// - `book`: The OrderBook shared object
/// - `order_id`: The sequential ID of the order to cancel
///
/// # Abort Conditions
/// - `EOrderNotFound` (104): Order doesn't exist
/// - `EUnauthorized` (105): Caller is not the order owner
/// - `EOrderNotActive` (106): Order is already inactive
entry fun cancel_order<BASE, COLLATERAL>(
    book: &mut OrderBook<BASE, COLLATERAL>,
    order_id: u64,
    ctx: &mut TxContext,
) {
    let sender = tx_context::sender(ctx);

    // Read the order side before removing (borrow checker requires this order)
    let side = orderbook::order_side(orderbook::borrow_order(book, order_id));

    // Mark order as inactive (validates ownership and active status)
    orderbook::remove_order(book, order_id, sender);

    // Refund lender's deposit if this was a lend order
    if (side == ORDER_SIDE_LEND && orderbook::has_deposit<BASE, COLLATERAL>(book, order_id)) {
        let deposit = orderbook::withdraw_deposit<BASE, COLLATERAL>(book, order_id);
        let refund_coin = coin::from_balance(deposit, ctx);
        transfer::public_transfer(refund_coin, sender);
    };
}

// ============================================================
// Public Functions — Hot Potato Settlement Flow
// ============================================================

/// Matches two orders and returns a MatchReceipt (Hot Potato).
///
/// This function MUST be followed by a call to `settle()` in the same PTB.
/// The MatchReceipt cannot be stored, dropped, or transferred — it must
/// be consumed. This is the Hot Potato pattern.
///
/// # Safety
/// This function is `public` (not `entry`) to enable PTB composition.
/// The MatchReceipt's lack of abilities (no drop/store/key/copy) provides
/// the security guarantee that settlement MUST occur atomically.
///
/// # Matching Logic
/// - Validates both orders exist, are active, and on opposite sides
/// - Checks rate compatibility (lend_rate <= borrow_rate)
/// - Matches at maker's rate (price improvement for taker)
/// - Matched amount = min(taker_amount, maker_amount)
/// - Computes collateral requirement from book's LTV ratio
///
/// # Parameters
/// - `book`: The OrderBook shared object (mutated to deactivate matched orders)
/// - `taker_order_id`: The taker's order ID (being actively matched)
/// - `maker_order_id`: The maker's order ID (was resting in the book)
/// - `clock`: Sui shared Clock object (address: 0x6)
///
/// # Returns
/// `MatchReceipt` — Hot Potato that MUST be consumed by `settle()`
public fun match_orders<BASE, COLLATERAL>(
    book: &mut OrderBook<BASE, COLLATERAL>,
    taker_order_id: u64,
    maker_order_id: u64,
    clock: &Clock,
): MatchReceipt {
    let (
        matched_amount,
        rate,
        lend_order_id,
        borrow_order_id,
        lender,
        borrower,
        collateral_required,
    ) = orderbook::execute_match(book, taker_order_id, maker_order_id);

    let duration = orderbook::duration_bucket(book);

    // Record match timestamp for auditing
    let _match_time = clock::timestamp_ms(clock);

    position::new_match_receipt(
        object::id(book),
        lend_order_id,
        borrow_order_id,
        matched_amount,
        rate,
        duration,
        collateral_required,
        lender,
        borrower,
    )
}

/// Settles a matched order by consuming the MatchReceipt (Hot Potato).
///
/// Performs the following atomic operations:
/// 1. Validates the borrower's collateral coin meets requirements
/// 2. Withdraws the lender's deposit from the OrderBook
/// 3. Consumes the MatchReceipt and creates LoanPosition NFTs
/// 4. Stores collateral in the CollateralVault (keyed by loan_id)
/// 5. Transfers principal (Coin<BASE>) to the borrower
/// 6. Transfers LoanPosition NFTs to lender and borrower
/// 7. Returns any excess collateral to the transaction sender
///
/// # Hot Potato Pattern
/// ```
/// ┌─────────────────────────────────────────────────────────────┐
/// │  Programmable Transaction Block (PTB)                       │
/// │                                                             │
/// │  Cmd 1: match_orders(book, ...) ──→ MatchReceipt           │
/// │                                        │ (no drop)          │
/// │  Cmd 2: settle(receipt, collateral, book, vault, ...) ←────┘│
/// │           │                                                 │
/// │           ├──→ Coin<BASE> ──→ borrower (principal)          │
/// │           ├──→ Balance<COLLATERAL> ──→ vault (escrowed)     │
/// │           ├──→ LoanPosition (Lender) ──→ transfer           │
/// │           └──→ LoanPosition (Borrower) ──→ transfer         │
/// │                                                             │
/// │  If Cmd 2 missing → MatchReceipt undropped → ABORT         │
/// └─────────────────────────────────────────────────────────────┘
/// ```
///
/// # Parameters
/// - `receipt`: The MatchReceipt from `match_orders()` (consumed)
/// - `collateral_coin`: Borrower's `Coin<COLLATERAL>` (>= collateral_required)
/// - `book`: The OrderBook (to withdraw lender's deposit)
/// - `vault_obj`: The CollateralVault (to escrow collateral)
/// - `clock`: Sui shared Clock for timestamp
public fun settle<BASE, COLLATERAL>(
    receipt: MatchReceipt,
    mut collateral_coin: Coin<COLLATERAL>,
    book: &mut OrderBook<BASE, COLLATERAL>,
    vault_obj: &mut CollateralVault<COLLATERAL>,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    let current_time = clock::timestamp_ms(clock);

    // Read receipt data before consuming
    let lender_addr = position::receipt_lender(&receipt);
    let borrower_addr = position::receipt_borrower(&receipt);
    let matched_amount = position::receipt_matched_amount(&receipt);
    let collateral_required = position::receipt_collateral_required(&receipt);
    let lend_order_id = position::receipt_lend_order_id(&receipt);

    // Validate collateral
    assert!(
        coin::value(&collateral_coin) >= collateral_required,
        EInsufficientCollateral,
    );

    // Withdraw lender's full deposit from the OrderBook
    // (may be larger than matched_amount if order was partially filled)
    let principal_balance = orderbook::withdraw_deposit<BASE, COLLATERAL>(
        book,
        lend_order_id,
    );
    let mut principal_coin = coin::from_balance(principal_balance, ctx);

    // Split exact matched amount for borrower (remainder goes back to lender)
    let borrower_principal = coin::split(&mut principal_coin, matched_amount, ctx);

    // Split exact collateral amount for vault
    let exact_collateral = coin::split(&mut collateral_coin, collateral_required, ctx);

    // Consume the Hot Potato and create LoanPosition NFTs
    let (lender_position, borrower_position) = position::settle_receipt(
        receipt,
        current_time,
        ctx,
    );

    // Get loan_id from the lender position (used as vault key)
    let loan_id = position::loan_id(&lender_position);

    // Store collateral in vault (keyed by loan_id for repayment lookup)
    vault::deposit(vault_obj, loan_id, coin::into_balance(exact_collateral));

    // Transfer matched principal to borrower
    transfer::public_transfer(borrower_principal, borrower_addr);

    // Transfer position NFTs to respective parties
    transfer::public_transfer(lender_position, lender_addr);
    transfer::public_transfer(borrower_position, borrower_addr);

    // Return unmatched lender deposit remainder (if any)
    if (coin::value(&principal_coin) > 0) {
        transfer::public_transfer(principal_coin, lender_addr);
    } else {
        coin::destroy_zero(principal_coin);
    };

    // Return excess collateral to the transaction sender
    if (coin::value(&collateral_coin) > 0) {
        transfer::public_transfer(collateral_coin, tx_context::sender(ctx));
    } else {
        coin::destroy_zero(collateral_coin);
    };
}

// ============================================================
// Entry Functions — Loan Lifecycle
// ============================================================

/// Repays an active loan, returning collateral to the borrower.
///
/// The borrower (or whoever owns the borrower position) provides
/// `Coin<BASE>` covering principal + interest. The function:
/// 1. Calculates total due (principal + interest for the term)
/// 2. Transfers repayment to the lender's address
/// 3. Withdraws collateral from the vault
/// 4. Returns collateral to the caller
/// 5. Updates position status to Repaid
///
/// # Interest Calculation
/// Interest = principal * rate / BPS_DENOMINATOR
/// (Simple interest for the full loan term, not prorated)
///
/// # Parameters
/// - `position`: Borrower's LoanPosition (mutated to update status)
/// - `repayment`: `Coin<BASE>` covering principal + interest
/// - `vault_obj`: CollateralVault to withdraw collateral from
/// - `clock`: Sui shared Clock (for future maturity checks)
///
/// # Abort Conditions
/// - `ENotBorrowerPosition` (302): Position is not a borrower position
/// - `EInsufficientRepayment` (301): Coin value < total due
/// - `EInvalidStatus` (1): Position is not active (from position::set_status)
entry fun repay<BASE, COLLATERAL>(
    position: &mut LoanPosition,
    mut repayment: Coin<BASE>,
    vault_obj: &mut CollateralVault<COLLATERAL>,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    // Verify this is a borrower position
    assert!(position::side(position) == ORDER_SIDE_BORROW, ENotBorrowerPosition);

    // Future: check maturity with clock
    let _current_time = clock::timestamp_ms(clock);

    // Calculate total repayment due
    let principal_amount = position::principal(position);
    let rate = position::rate(position);
    let interest = (principal_amount * rate) / BPS_DENOMINATOR;
    let total_due = principal_amount + interest;

    // Validate repayment amount
    assert!(coin::value(&repayment) >= total_due, EInsufficientRepayment);

    // Split exact repayment amount
    let exact_repayment = coin::split(&mut repayment, total_due, ctx);

    // Transfer repayment to lender
    let lender_addr = position::lender(position);
    transfer::public_transfer(exact_repayment, lender_addr);

    // Withdraw collateral from vault and return to caller
    let loan_id = position::loan_id(position);
    let collateral_balance = vault::withdraw(vault_obj, loan_id);
    let collateral_coin = coin::from_balance(collateral_balance, ctx);
    let caller = tx_context::sender(ctx);
    transfer::public_transfer(collateral_coin, caller);

    // Update position status
    position::set_status(position, STATUS_REPAID);

    // Return any excess repayment to caller
    if (coin::value(&repayment) > 0) {
        transfer::public_transfer(repayment, caller);
    } else {
        coin::destroy_zero(repayment);
    };

    // Emit repayment event
    event::emit(LoanRepaid {
        loan_id,
        borrower: caller,
        lender: lender_addr,
        principal: principal_amount,
        interest,
        total_repaid: total_due,
    });
}
