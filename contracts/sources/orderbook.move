/// Module: yume::orderbook
///
/// Implements the Central Limit Order Book (CLOB) for the Yume lending protocol.
/// Each OrderBook is a shared object representing a specific lending market
/// defined by asset pair (BASE/COLLATERAL), duration bucket, and risk tier.
///
/// # Architecture Notes
/// - OrderBook is a shared object for parallel access (Sui's parallel execution)
/// - Orders are stored in a `Table<u64, Order>` for O(1) lookup by sequential ID
/// - Events are emitted for off-chain indexing (frontends read events to build book state)
/// - Within a market, matching is purely on Interest Rate (bucketing reduces 3D to 1D)
///
/// # Dimensional Bucketing Strategy (from Yume paper)
/// - Duration: Open | 7-Day | 30-Day | 90-Day
/// - Risk: Tier A (blue-chip, 90% LTV) | Tier B (volatile, 50% LTV)
/// - Rate: Sorted within each bucket (Phase 2: Crit-bit or Red-Black tree)
///
/// # Dependencies
/// - sui::table (order storage)
/// - sui::event (off-chain indexing)
///
/// # Consumers
/// - yume::market (entry functions for order placement and matching)
module yume::orderbook;

use sui::table::{Self, Table};
use sui::balance::Balance;
use sui::dynamic_field;
use sui::event;

// ============================================================
// Constants — Order Sides
// ============================================================

/// Order side: Lending (offering capital, "Ask" side of the book)
const ORDER_SIDE_LEND: u8 = 0;
/// Order side: Borrowing (requesting capital, "Bid" side of the book)
const ORDER_SIDE_BORROW: u8 = 1;

// ============================================================
// Constants — Duration Buckets (seconds)
// ============================================================

/// Open-term (variable rate, callable at any time)
const DURATION_OPEN: u64 = 0;
/// 7-day fixed term
const DURATION_7_DAY: u64 = 604800;
/// 30-day fixed term
const DURATION_30_DAY: u64 = 2592000;
/// 90-day fixed term
const DURATION_90_DAY: u64 = 7776000;

// ============================================================
// Constants — Risk Tiers
// ============================================================

/// Risk Tier A: Blue-chip collateral (SUI, USDC). High LTV (90%).
const RISK_TIER_A: u8 = 0;
/// Risk Tier B: Volatile collateral (meme coins, NFTs). Low LTV (50%).
const RISK_TIER_B: u8 = 1;

// ============================================================
// Constants — Configuration
// ============================================================

/// Default minimum order amount in base asset units
const DEFAULT_MIN_ORDER: u64 = 1000;
/// Basis points denominator (100% = 10,000 bps)
const BPS_DENOMINATOR: u64 = 10000;

// ============================================================
// Error Constants
// ============================================================

/// Abort: Invalid order side (must be ORDER_SIDE_LEND or ORDER_SIDE_BORROW)
const EInvalidSide: u64 = 100;
/// Abort: Invalid duration bucket (must be 0, 604800, 2592000, or 7776000)
const EInvalidDuration: u64 = 101;
/// Abort: Invalid interest rate (must be > 0 and <= BPS_DENOMINATOR)
const EInvalidRate: u64 = 102;
/// Abort: Order amount below minimum
const EInvalidAmount: u64 = 103;
/// Abort: Order ID does not exist in the book
const EOrderNotFound: u64 = 104;
/// Abort: Caller is not authorized (not the order owner)
const EUnauthorized: u64 = 105;
/// Abort: Order is already inactive (cancelled or filled)
const EOrderNotActive: u64 = 106;
/// Abort: Market is not accepting new orders
const EMarketInactive: u64 = 107;
/// Abort: Cannot match orders from the same address
const ESelfMatch: u64 = 108;
/// Abort: Lender's rate exceeds borrower's maximum rate
const ERateMismatch: u64 = 109;
/// Abort: Invalid risk tier (must be RISK_TIER_A or RISK_TIER_B)
const EInvalidRiskTier: u64 = 110;

// ============================================================
// Structs
// ============================================================

/// Dynamic field key for storing lender deposits on the OrderBook.
/// When a lender places an order, their `Coin<BASE>` is converted to
/// `Balance<BASE>` and stored as a dynamic field keyed by order_id.
/// This avoids making BASE non-phantom in the OrderBook struct.
public struct DepositKey has copy, drop, store {
    order_id: u64,
}

/// An order in the order book.
///
/// Stored inside the OrderBook's `Table<u64, Order>`, keyed by sequential ID.
/// Does not need `key` ability since it's not a top-level Sui object —
/// it lives inside the OrderBook's Table.
///
/// # Abilities
/// - `store`: Required for Table storage
/// - `drop`: Allows discarding cancelled orders
/// - `copy`: Enables reading order data during matching without moving
public struct Order has store, drop, copy {
    /// Sequential order ID within this book (0-indexed)
    order_id: u64,
    /// The address that placed this order
    owner: address,
    /// ORDER_SIDE_LEND (0) = offering capital, ORDER_SIDE_BORROW (1) = requesting capital
    side: u8,
    /// Amount in base asset units (e.g., 1_000_000 = 1 USDC with 6 decimals)
    amount: u64,
    /// Interest rate in basis points (1 bp = 0.01%, e.g., 500 = 5.00% APY)
    rate: u64,
    /// Clock timestamp (ms) when order was placed
    timestamp: u64,
    /// Whether the order is still active (can be matched or cancelled)
    is_active: bool,
}

/// The central Order Book — a shared object.
///
/// Each OrderBook represents a specific lending market defined by:
/// - Asset pair (BASE/COLLATERAL) via type parameters
/// - Duration bucket (e.g., 7-day, 30-day fixed term)
/// - Risk tier (Tier A = blue-chip collateral, Tier B = volatile)
///
/// Within this market, orders are matched purely on Interest Rate,
/// reducing the multi-dimensional matching problem to a 1D sort.
///
/// # Type Parameters
/// - `BASE`: The lending asset type (e.g., `0x...::usdc::USDC`)
/// - `COLLATERAL`: The collateral asset type (e.g., `0x2::sui::SUI`)
///
/// # Abilities
/// - `key`: Shared object in Sui's global storage, allowing parallel access
///
/// # Data Structure Choice
/// Uses `Table<u64, Order>` for O(1) order lookup by ID.
/// Phase 2 will add sorted indexing (Crit-bit tree) for efficient matching.
/// Off-chain indexers read OrderPlaced/OrderCancelled events to build sorted views.
public struct OrderBook<phantom BASE, phantom COLLATERAL> has key {
    id: UID,
    /// Duration bucket for this market (seconds): 0 | 604800 | 2592000 | 7776000
    duration_bucket: u64,
    /// Risk tier: RISK_TIER_A (0) or RISK_TIER_B (1)
    risk_tier: u8,
    /// Maximum Loan-to-Value ratio in basis points (e.g., 9000 = 90%)
    max_ltv_bps: u64,
    /// All orders stored by sequential ID
    orders: Table<u64, Order>,
    /// Next order ID to assign (monotonically increasing)
    next_order_id: u64,
    /// Number of active bids (borrow requests)
    total_bids: u64,
    /// Number of active asks (lend offers)
    total_asks: u64,
    /// Minimum order amount in base asset units
    min_order_amount: u64,
    /// Whether this market is accepting new orders
    is_active: bool,
}

// ============================================================
// Events
// ============================================================

/// Emitted when a new order is placed in the book.
/// Off-chain indexers use this to build the sorted order book view.
public struct OrderPlaced has copy, drop {
    book_id: ID,
    order_id: u64,
    owner: address,
    side: u8,
    amount: u64,
    rate: u64,
    timestamp: u64,
}

/// Emitted when an order is cancelled by its owner.
public struct OrderCancelled has copy, drop {
    book_id: ID,
    order_id: u64,
    owner: address,
}

/// Emitted when two orders are successfully matched.
public struct OrderMatched has copy, drop {
    book_id: ID,
    lend_order_id: u64,
    borrow_order_id: u64,
    matched_amount: u64,
    rate: u64,
    lender: address,
    borrower: address,
}

// ============================================================
// Constructor
// ============================================================

/// Creates a new OrderBook for a specific market.
///
/// Only callable within the yume package. The `market::create_market()`
/// entry function calls this and shares the resulting object.
///
/// # Parameters
/// - `duration_bucket`: Loan duration in seconds (must be a valid bucket)
/// - `risk_tier`: 0 = Tier A (blue-chip), 1 = Tier B (volatile)
/// - `max_ltv_bps`: Maximum LTV in basis points (e.g., 9000 = 90%)
///
/// # Abort Conditions
/// - `EInvalidDuration` (101): Duration is not a recognized bucket value
/// - `EInvalidRiskTier` (110): Risk tier is not 0 or 1
public(package) fun new<BASE, COLLATERAL>(
    duration_bucket: u64,
    risk_tier: u8,
    max_ltv_bps: u64,
    ctx: &mut TxContext,
): OrderBook<BASE, COLLATERAL> {
    // Validate duration bucket is one of the supported values
    assert!(
        duration_bucket == DURATION_OPEN
            || duration_bucket == DURATION_7_DAY
            || duration_bucket == DURATION_30_DAY
            || duration_bucket == DURATION_90_DAY,
        EInvalidDuration,
    );

    // Validate risk tier
    assert!(
        risk_tier == RISK_TIER_A || risk_tier == RISK_TIER_B,
        EInvalidRiskTier,
    );

    OrderBook {
        id: object::new(ctx),
        duration_bucket,
        risk_tier,
        max_ltv_bps,
        orders: table::new(ctx),
        next_order_id: 0,
        total_bids: 0,
        total_asks: 0,
        min_order_amount: DEFAULT_MIN_ORDER,
        is_active: true,
    }
}

/// Shares an OrderBook as a Sui shared object.
/// Must be called from within the yume package (transfer::share_object
/// is restricted to the defining module).
public(package) fun share<BASE, COLLATERAL>(book: OrderBook<BASE, COLLATERAL>) {
    transfer::share_object(book);
}

// ============================================================
// Order Management
// ============================================================

/// Adds a new limit order to the book.
///
/// Creates an Order struct and stores it in the book's Table.
/// Emits an `OrderPlaced` event for off-chain indexing.
///
/// # Parameters
/// - `book`: Mutable reference to the OrderBook
/// - `side`: ORDER_SIDE_LEND (0) or ORDER_SIDE_BORROW (1)
/// - `amount`: Order amount in base asset units
/// - `rate`: Interest rate in basis points (1-10000)
/// - `timestamp`: Current clock timestamp in milliseconds
/// - `owner`: Address placing the order
///
/// # Returns
/// The assigned sequential order ID
///
/// # Abort Conditions
/// - `EMarketInactive` (107): Market is paused or closed
/// - `EInvalidSide` (100): Side is not 0 or 1
/// - `EInvalidAmount` (103): Amount below min_order_amount
/// - `EInvalidRate` (102): Rate is 0 or exceeds 10000 bps
public(package) fun add_order<BASE, COLLATERAL>(
    book: &mut OrderBook<BASE, COLLATERAL>,
    side: u8,
    amount: u64,
    rate: u64,
    timestamp: u64,
    owner: address,
): u64 {
    assert!(book.is_active, EMarketInactive);
    assert!(side == ORDER_SIDE_LEND || side == ORDER_SIDE_BORROW, EInvalidSide);
    assert!(amount >= book.min_order_amount, EInvalidAmount);
    assert!(rate > 0 && rate <= BPS_DENOMINATOR, EInvalidRate);

    let order_id = book.next_order_id;
    book.next_order_id = book.next_order_id + 1;

    let order = Order {
        order_id,
        owner,
        side,
        amount,
        rate,
        timestamp,
        is_active: true,
    };

    table::add(&mut book.orders, order_id, order);

    // Update active order counters
    if (side == ORDER_SIDE_LEND) {
        book.total_asks = book.total_asks + 1;
    } else {
        book.total_bids = book.total_bids + 1;
    };

    // Emit event for off-chain indexing
    event::emit(OrderPlaced {
        book_id: object::id(book),
        order_id,
        owner,
        side,
        amount,
        rate,
        timestamp,
    });

    order_id
}

/// Removes an order from the book (cancellation).
///
/// Marks the order as inactive and decrements the appropriate counter.
/// Only the order owner can cancel their order.
///
/// # Parameters
/// - `book`: Mutable reference to the OrderBook
/// - `order_id`: The sequential ID of the order to cancel
/// - `caller`: Address requesting the cancellation
///
/// # Abort Conditions
/// - `EOrderNotFound` (104): Order ID doesn't exist in the Table
/// - `EUnauthorized` (105): Caller is not the order owner
/// - `EOrderNotActive` (106): Order is already inactive
public(package) fun remove_order<BASE, COLLATERAL>(
    book: &mut OrderBook<BASE, COLLATERAL>,
    order_id: u64,
    caller: address,
) {
    assert!(table::contains(&book.orders, order_id), EOrderNotFound);

    let order = table::borrow_mut(&mut book.orders, order_id);
    assert!(order.owner == caller, EUnauthorized);
    assert!(order.is_active, EOrderNotActive);

    // Mark as inactive (order stays in table for historical reference)
    order.is_active = false;

    // Update active order counters
    if (order.side == ORDER_SIDE_LEND) {
        book.total_asks = book.total_asks - 1;
    } else {
        book.total_bids = book.total_bids - 1;
    };

    // Emit event for off-chain indexing
    event::emit(OrderCancelled {
        book_id: object::id(book),
        order_id,
        owner: caller,
    });
}

/// Validates and executes a match between a taker and a maker order.
///
/// The off-chain indexer identifies potential matches by reading events.
/// This function validates the match on-chain and deactivates both orders.
///
/// # Matching Rules
/// - Taker and maker must be on opposite sides (one lend, one borrow)
/// - Lender's rate must be <= borrower's rate (rate compatibility)
/// - Matched amount = min(taker_amount, maker_amount)
/// - Matched rate = maker's rate (price improvement for taker)
/// - Collateral = matched_amount * BPS_DENOMINATOR / max_ltv_bps
///
/// # Parameters
/// - `book`: Mutable reference to the OrderBook
/// - `taker_order_id`: The taker's order (being matched actively)
/// - `maker_order_id`: The maker's order (was resting in the book)
///
/// # Returns
/// Tuple: (matched_amount, rate, lend_order_id, borrow_order_id, lender, borrower, collateral_required)
///
/// # Abort Conditions
/// - `EOrderNotFound` (104): Either order doesn't exist
/// - `EOrderNotActive` (106): Either order is inactive
/// - `ESelfMatch` (108): Both orders belong to the same address
/// - `EInvalidSide` (100): Orders are on the same side
/// - `ERateMismatch` (109): Lend rate > borrow rate (incompatible)
public(package) fun execute_match<BASE, COLLATERAL>(
    book: &mut OrderBook<BASE, COLLATERAL>,
    taker_order_id: u64,
    maker_order_id: u64,
): (u64, u64, u64, u64, address, address, u64) {
    // Validate both orders exist and are active
    assert!(table::contains(&book.orders, taker_order_id), EOrderNotFound);
    assert!(table::contains(&book.orders, maker_order_id), EOrderNotFound);

    // Copy order data for validation (Order has `copy` ability)
    let taker = *table::borrow(&book.orders, taker_order_id);
    let maker = *table::borrow(&book.orders, maker_order_id);

    assert!(taker.is_active, EOrderNotActive);
    assert!(maker.is_active, EOrderNotActive);

    // Cannot self-match (wash trading prevention)
    assert!(taker.owner != maker.owner, ESelfMatch);

    // Must be opposite sides (lend vs borrow)
    assert!(taker.side != maker.side, EInvalidSide);

    // Determine which is lender and which is borrower
    let (lend_order, borrow_order) = if (taker.side == ORDER_SIDE_LEND) {
        (taker, maker)
    } else {
        (maker, taker)
    };

    // Rate compatibility: lender's ask rate must be <= borrower's bid rate
    // (The borrower is willing to pay at least what the lender demands)
    assert!(lend_order.rate <= borrow_order.rate, ERateMismatch);

    // Matched amount is the minimum of both orders
    // TODO: Phase 2 — Support partial fills (reduce larger order's amount instead of deactivating)
    let matched_amount = if (lend_order.amount < borrow_order.amount) {
        lend_order.amount
    } else {
        borrow_order.amount
    };

    // Use maker's rate (standard order book convention: price improvement for taker)
    let matched_rate = maker.rate;

    // Calculate collateral required based on LTV ratio
    // Formula: collateral = principal * BPS_DENOMINATOR / max_ltv_bps
    // Example: 100,000 * 10,000 / 9,000 = 111,111 (for 90% LTV)
    // TODO: Phase 3 — Integrate price oracle for cross-asset collateral calculation
    let collateral_required = (matched_amount * BPS_DENOMINATOR) / book.max_ltv_bps;

    // Deactivate both orders
    // TODO: Phase 2 — Partial fills: only deactivate fully filled orders,
    //       reduce remaining amount for partially filled orders
    let taker_mut = table::borrow_mut(&mut book.orders, taker_order_id);
    taker_mut.is_active = false;

    let maker_mut = table::borrow_mut(&mut book.orders, maker_order_id);
    maker_mut.is_active = false;

    // Decrement counters (one bid and one ask consumed per match)
    book.total_asks = book.total_asks - 1;
    book.total_bids = book.total_bids - 1;

    // Emit match event
    event::emit(OrderMatched {
        book_id: object::id(book),
        lend_order_id: lend_order.order_id,
        borrow_order_id: borrow_order.order_id,
        matched_amount,
        rate: matched_rate,
        lender: lend_order.owner,
        borrower: borrow_order.owner,
    });

    (
        matched_amount,
        matched_rate,
        lend_order.order_id,
        borrow_order.order_id,
        lend_order.owner,
        borrow_order.owner,
        collateral_required,
    )
}

// ============================================================
// Accessor Functions — OrderBook
// ============================================================

/// Returns the duration bucket (seconds) for this market
public fun duration_bucket<BASE, COLLATERAL>(book: &OrderBook<BASE, COLLATERAL>): u64 {
    book.duration_bucket
}

/// Returns the risk tier (0 = Tier A, 1 = Tier B)
public fun risk_tier<BASE, COLLATERAL>(book: &OrderBook<BASE, COLLATERAL>): u8 {
    book.risk_tier
}

/// Returns the maximum LTV in basis points
public fun max_ltv_bps<BASE, COLLATERAL>(book: &OrderBook<BASE, COLLATERAL>): u64 {
    book.max_ltv_bps
}

/// Returns the number of active bids (borrow requests)
public fun total_bids<BASE, COLLATERAL>(book: &OrderBook<BASE, COLLATERAL>): u64 {
    book.total_bids
}

/// Returns the number of active asks (lend offers)
public fun total_asks<BASE, COLLATERAL>(book: &OrderBook<BASE, COLLATERAL>): u64 {
    book.total_asks
}

/// Returns whether the market is accepting orders
public fun is_active<BASE, COLLATERAL>(book: &OrderBook<BASE, COLLATERAL>): bool {
    book.is_active
}

/// Returns the next order ID that will be assigned
public fun next_order_id<BASE, COLLATERAL>(book: &OrderBook<BASE, COLLATERAL>): u64 {
    book.next_order_id
}

/// Returns the minimum order amount for this market
public fun min_order_amount<BASE, COLLATERAL>(book: &OrderBook<BASE, COLLATERAL>): u64 {
    book.min_order_amount
}

/// Returns a reference to an order by its sequential ID.
///
/// # Abort Conditions
/// - `EOrderNotFound` (104): Order ID doesn't exist
public fun borrow_order<BASE, COLLATERAL>(
    book: &OrderBook<BASE, COLLATERAL>,
    order_id: u64,
): &Order {
    assert!(table::contains(&book.orders, order_id), EOrderNotFound);
    table::borrow(&book.orders, order_id)
}

// ============================================================
// Accessor Functions — Order
// ============================================================

/// Returns the order's sequential ID
public fun order_id(order: &Order): u64 { order.order_id }
/// Returns the order owner's address
public fun order_owner(order: &Order): address { order.owner }
/// Returns the order side (0 = Lend, 1 = Borrow)
public fun order_side(order: &Order): u8 { order.side }
/// Returns the order amount in base asset units
public fun order_amount(order: &Order): u64 { order.amount }
/// Returns the order's interest rate in basis points
public fun order_rate(order: &Order): u64 { order.rate }
/// Returns the order's placement timestamp (ms)
public fun order_timestamp(order: &Order): u64 { order.timestamp }
/// Returns whether the order is still active
public fun order_is_active(order: &Order): bool { order.is_active }

/// Checks if an order exists AND is still active.
/// Used by the pool module during rebalance to skip already-matched orders.
public fun has_active_order<BASE, COLLATERAL>(
    book: &OrderBook<BASE, COLLATERAL>,
    order_id: u64,
): bool {
    if (!table::contains(&book.orders, order_id)) { return false };
    let order = table::borrow(&book.orders, order_id);
    order.is_active
}

// ============================================================
// Deposit Management (Dynamic Fields)
// ============================================================

/// Stores a lender's deposit as a dynamic field on the OrderBook.
/// Called when a lender places an order with their Coin<BASE>.
///
/// The deposit is stored as `Balance<BASE>` keyed by `DepositKey { order_id }`.
/// This keeps the OrderBook's BASE type parameter phantom.
///
/// # Parameters
/// - `book`: Mutable reference to the OrderBook
/// - `order_id`: The order ID to key the deposit by
/// - `deposit`: The lender's balance to store
public(package) fun store_deposit<BASE, COLLATERAL>(
    book: &mut OrderBook<BASE, COLLATERAL>,
    order_id: u64,
    deposit: Balance<BASE>,
) {
    dynamic_field::add(&mut book.id, DepositKey { order_id }, deposit);
}

/// Checks if a deposit exists for a given order.
///
/// # Returns
/// `true` if a deposit is stored for this order_id
public fun has_deposit<BASE, COLLATERAL>(
    book: &OrderBook<BASE, COLLATERAL>,
    order_id: u64,
): bool {
    dynamic_field::exists_(&book.id, DepositKey { order_id })
}

/// Withdraws a lender's deposit from the OrderBook.
/// Called during settlement (to transfer principal to borrower)
/// or during cancellation (to refund the lender).
///
/// # Parameters
/// - `book`: Mutable reference to the OrderBook
/// - `order_id`: The order ID whose deposit to withdraw
///
/// # Returns
/// The `Balance<BASE>` that was deposited by the lender
///
/// # Abort Conditions
/// - Aborts if no dynamic field exists for this order_id
public(package) fun withdraw_deposit<BASE, COLLATERAL>(
    book: &mut OrderBook<BASE, COLLATERAL>,
    order_id: u64,
): Balance<BASE> {
    dynamic_field::remove(&mut book.id, DepositKey { order_id })
}
