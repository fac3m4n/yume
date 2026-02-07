/// Module: yume::market
///
/// Entry point module for the Yume lending protocol.
/// Provides user-facing functions for market creation, order management,
/// and the Hot Potato settlement flow.
///
/// # Architecture Notes
/// - `entry` functions for standalone PTB commands (create, place, cancel)
/// - `public` functions for composable PTB commands (match + settle)
/// - All sensitive state changes use `entry` or the Hot Potato pattern
/// - Transaction logic is designed for PTB construction from the frontend
///
/// # PTB Construction (Frontend)
/// ```typescript
/// const tx = new Transaction();
/// // Command 1: Match orders (returns MatchReceipt)
/// const [receipt] = tx.moveCall({
///     target: `${PACKAGE_ID}::market::match_orders`,
///     typeArguments: [usdcType, suiType],
///     arguments: [tx.object(bookId), tx.pure.u64(takerId), tx.pure.u64(makerId), tx.object('0x6')],
/// });
/// // Command 2: Settle (consumes MatchReceipt — Hot Potato)
/// tx.moveCall({
///     target: `${PACKAGE_ID}::market::settle`,
///     arguments: [receipt, tx.object('0x6')],
/// });
/// ```
///
/// # Dependencies
/// - yume::orderbook (order storage and matching logic)
/// - yume::position (MatchReceipt, LoanPosition creation)
///
/// # Consumers
/// - Frontend hooks (useLend, useBorrow, useMatch)
/// - Off-chain keepers (liquidation bots)
module yume::market;

use sui::clock::{Self, Clock};
use sui::object;
use sui::transfer;
use sui::tx_context;
use yume::orderbook::{Self, OrderBook};
use yume::position::{Self, MatchReceipt};

// ============================================================
// Entry Functions — Market Administration
// ============================================================

/// Creates a new lending market (OrderBook) as a shared object.
///
/// Anyone can create a market. Each market is uniquely defined by its
/// type parameters (BASE/COLLATERAL) and configuration (duration, risk tier).
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
/// - `risk_tier`: Risk classification
///   - `0`: Tier A — Blue-chip collateral (high LTV)
///   - `1`: Tier B — Volatile collateral (low LTV)
/// - `max_ltv_bps`: Maximum Loan-to-Value in basis points (e.g., 9000 = 90%)
///
/// # Abort Conditions
/// - `EInvalidDuration` (101): Duration is not a recognized bucket
/// - `EInvalidRiskTier` (110): Risk tier is not 0 or 1
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
    // Share the OrderBook so it's accessible by all users
    transfer::share_object(book);
}

// ============================================================
// Entry Functions — Order Management
// ============================================================

/// Places a limit order in the order book.
///
/// This is a standalone PTB command. The order is stored in the book's Table
/// and an `OrderPlaced` event is emitted for off-chain indexing.
///
/// # Type Parameters
/// - `BASE`: Must match the OrderBook's base asset type
/// - `COLLATERAL`: Must match the OrderBook's collateral asset type
///
/// # Parameters
/// - `book`: The OrderBook shared object
/// - `side`: 0 = Lend (offering capital), 1 = Borrow (requesting capital)
/// - `amount`: Amount in base asset units
/// - `rate`: Interest rate in basis points (1 bp = 0.01%, range: 1-10000)
/// - `clock`: Sui shared Clock object (address: 0x6)
///
/// # Abort Conditions
/// - `EMarketInactive` (107): Market is paused
/// - `EInvalidSide` (100): Side is not 0 or 1
/// - `EInvalidAmount` (103): Amount below minimum
/// - `EInvalidRate` (102): Rate is 0 or exceeds 10000
entry fun place_limit_order<BASE, COLLATERAL>(
    book: &mut OrderBook<BASE, COLLATERAL>,
    side: u8,
    amount: u64,
    rate: u64,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    let timestamp = clock::timestamp_ms(clock);
    let sender = tx_context::sender(ctx);

    orderbook::add_order(book, side, amount, rate, timestamp, sender);
}

/// Cancels an existing order. Only the order owner can cancel.
///
/// Marks the order as inactive and emits an `OrderCancelled` event.
/// The order data remains in the Table for historical reference.
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
    orderbook::remove_order(book, order_id, sender);
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
///
/// # Abort Conditions
/// - `EOrderNotFound` (104): Either order doesn't exist
/// - `EOrderNotActive` (106): Either order is inactive
/// - `ESelfMatch` (108): Both orders from same address
/// - `EInvalidSide` (100): Orders on same side
/// - `ERateMismatch` (109): Lend rate > borrow rate
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

    // TODO: Phase 2 — Use clock for order freshness validation
    //       (reject stale orders that have been sitting too long)
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
/// Creates LoanPosition NFTs for both lender and borrower, then transfers
/// them to the respective addresses. This is the ONLY way to destroy
/// a MatchReceipt — if not called, the entire PTB transaction reverts.
///
/// # Hot Potato Pattern
/// ```
/// ┌─────────────────────────────────────────────────────┐
/// │  Programmable Transaction Block (PTB)                │
/// │                                                      │
/// │  Cmd 1: match_orders(book, ...) ──→ MatchReceipt    │
/// │                                        │ (no drop)   │
/// │  Cmd 2: settle(receipt, ...) ←─────────┘             │
/// │           │                                          │
/// │           ├──→ LoanPosition (Lender) ──→ transfer    │
/// │           └──→ LoanPosition (Borrower) ──→ transfer  │
/// │                                                      │
/// │  If Cmd 2 missing → MatchReceipt undropped → ABORT  │
/// └─────────────────────────────────────────────────────┘
/// ```
///
/// # Phase 1 (Current)
/// Creates position NFTs and transfers them. No actual coin transfers.
///
/// # Phase 2 (TODO)
/// Will accept `Coin<BASE>` and `Coin<COLLATERAL>` parameters:
/// ```
/// public fun settle<BASE, COLLATERAL>(
///     receipt: MatchReceipt,
///     principal: Coin<BASE>,        // From lender
///     collateral: Coin<COLLATERAL>, // From borrower
///     clock: &Clock,
///     ctx: &mut TxContext,
/// )
/// ```
/// Will verify coin amounts match receipt, escrow collateral, and transfer principal.
///
/// # Parameters
/// - `receipt`: The MatchReceipt from `match_orders()` (consumed)
/// - `clock`: Sui shared Clock for timestamp
public fun settle(
    receipt: MatchReceipt,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    let current_time = clock::timestamp_ms(clock);
    let lender = position::receipt_lender(&receipt);
    let borrower = position::receipt_borrower(&receipt);

    // Consume the Hot Potato and create LoanPosition NFTs
    let (lender_position, borrower_position) = position::settle_receipt(
        receipt,
        current_time,
        ctx,
    );

    // Transfer position NFTs to respective parties
    // Lender gets the "bond" (right to claim principal + interest)
    transfer::public_transfer(lender_position, lender);
    // Borrower gets the "obligation" (repayment burden + collateral lock)
    transfer::public_transfer(borrower_position, borrower);
}
