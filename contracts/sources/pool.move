/// Module: yume::pool
///
/// Implements the Hybrid Liquidity Pool for the Yume lending protocol.
/// This is the key differentiator: passive liquidity pools that automatically
/// inject capital into the on-chain Order Book.
///
/// # Architecture — The Hybrid Model
/// Traditional lending protocols use EITHER pools (Aave) OR order books (Morpho).
/// Yume is hybrid: passive LPs deposit into a pool, and the pool algorithmically
/// places lend orders on the OrderBook using a linear rate curve.
///
/// ```
/// ┌──────────────────────────────┐
/// │   Passive LP                 │
/// │   deposits 100,000 USDC      │
/// └──────────┬───────────────────┘
///            │ deposit()
///            ▼
/// ┌──────────────────────────────┐
/// │   LiquidityPool<USDC>        │
/// │   min_rate: 300 (3%)         │
/// │   max_rate: 800 (8%)         │
/// │   num_buckets: 6             │
/// └──────────┬───────────────────┘
///            │ rebalance()
///            ▼
/// ┌──────────────────────────────┐
/// │   OrderBook<USDC, SUI>       │
/// │                              │
/// │   Ask @ 3.00%: 16,666 USDC  │
/// │   Ask @ 4.00%: 16,666 USDC  │
/// │   Ask @ 5.00%: 16,666 USDC  │
/// │   Ask @ 6.00%: 16,666 USDC  │
/// │   Ask @ 7.00%: 16,666 USDC  │
/// │   Ask @ 8.00%: 16,666 USDC  │
/// └──────────────────────────────┘
/// ```
///
/// When a borrower takes one of these orders, the pool's capital is
/// deployed as a fixed-rate loan. On repayment, interest flows back
/// to the pool, increasing the value of LP shares.
///
/// # Dependencies
/// - yume::orderbook (order placement, deposit management)
/// - sui::balance, sui::coin (fund management)
/// - sui::dynamic_field (LP shares, available balance)
///
/// # Consumers
/// - yume::market (create_pool entry function)
/// - Frontend pool management UI
#[allow(unused_mut_parameter, lint(self_transfer))]
module yume::pool;

use sui::balance::{Self, Balance};
use sui::coin::{Self, Coin};
use sui::clock::{Self, Clock};
use sui::dynamic_field;
use sui::event;
use yume::orderbook::{Self, OrderBook};

// ============================================================
// Error Constants
// ============================================================

/// Abort: Pool is not accepting deposits
const EPoolInactive: u64 = 600;
/// Abort: Insufficient LP shares for withdrawal
const EInsufficientShares: u64 = 601;
/// Abort: Caller is not the pool admin
const EUnauthorized: u64 = 603;
/// Abort: Invalid pool configuration (min_rate >= max_rate or buckets < 2)
const EInvalidConfig: u64 = 604;
/// Abort: Zero-value deposit not allowed
const EZeroDeposit: u64 = 605;

// ============================================================
// Dynamic Field Keys
// ============================================================

/// Key for the pool's available BASE balance.
/// Stored as a dynamic field to keep BASE phantom on the struct.
public struct BalanceKey has copy, drop, store {}

/// Key for tracking LP shares per depositor.
/// Each LP's shares are stored as u64 in a dynamic field.
public struct ShareKey has copy, drop, store {
    lp: address,
}

// ============================================================
// Events
// ============================================================

/// Emitted when a new LiquidityPool is created
public struct PoolCreated has copy, drop {
    pool_id: ID,
    book_id: ID,
    admin: address,
    min_rate: u64,
    max_rate: u64,
    num_buckets: u64,
}

/// Emitted when an LP deposits into the pool
public struct LiquidityDeposited has copy, drop {
    pool_id: ID,
    lp: address,
    amount: u64,
    shares_minted: u64,
}

/// Emitted when an LP withdraws from the pool
public struct LiquidityWithdrawn has copy, drop {
    pool_id: ID,
    lp: address,
    amount: u64,
    shares_burned: u64,
}

/// Emitted when the pool rebalances its order book positions
public struct PoolRebalanced has copy, drop {
    pool_id: ID,
    orders_cancelled: u64,
    orders_placed: u64,
    total_deployed: u64,
}

// ============================================================
// Main Struct
// ============================================================

/// The Hybrid Liquidity Pool — a shared object that bridges
/// passive LP capital with the active Order Book.
///
/// # Design Decisions
/// - `phantom BASE`: Balance stored via dynamic field (BalanceKey)
/// - LP shares tracked per-address via dynamic field (ShareKey)
/// - Pool admin controls rebalance timing and rate parameters
/// - Orders placed with admin as owner (positions go to admin)
///
/// # Type Parameters
/// - `BASE`: The lending asset type (e.g., USDC). Phantom — only
///   used in the dynamic field value (Balance<BASE>).
public struct LiquidityPool<phantom BASE> has key {
    id: UID,
    /// Pool administrator (controls rebalance, receives matched positions)
    admin: address,
    /// Reference to the OrderBook this pool injects liquidity into
    book_id: ID,
    /// Total LP shares outstanding (for pro-rata calculations)
    total_shares: u64,
    /// Minimum interest rate for order placement (basis points)
    min_rate: u64,
    /// Maximum interest rate for order placement (basis points)
    max_rate: u64,
    /// Number of rate levels to distribute orders across
    num_buckets: u64,
    /// Total capital currently deployed as active lend orders
    deployed_balance: u64,
    /// Order IDs placed by this pool (for tracking and cancellation)
    placed_order_ids: vector<u64>,
    /// Whether the pool accepts new deposits
    is_active: bool,
}

// ============================================================
// Constructor
// ============================================================

/// Creates a new LiquidityPool.
/// Only callable within the yume package (via market::create_pool).
///
/// # Parameters
/// - `admin`: Address that controls rebalance and receives matched positions
/// - `book_id`: ID of the OrderBook to inject liquidity into
/// - `min_rate`: Lowest rate for the linear curve (bps, e.g., 300 = 3%)
/// - `max_rate`: Highest rate for the linear curve (bps, e.g., 800 = 8%)
/// - `num_buckets`: Number of rate levels (>= 2)
///
/// # Abort Conditions
/// - `EInvalidConfig` (604): min_rate >= max_rate or num_buckets < 2
public(package) fun new<BASE>(
    admin: address,
    book_id: ID,
    min_rate: u64,
    max_rate: u64,
    num_buckets: u64,
    ctx: &mut TxContext,
): LiquidityPool<BASE> {
    assert!(min_rate < max_rate, EInvalidConfig);
    assert!(num_buckets >= 2, EInvalidConfig);

    let mut pool = LiquidityPool {
        id: object::new(ctx),
        admin,
        book_id,
        total_shares: 0,
        min_rate,
        max_rate,
        num_buckets,
        deployed_balance: 0,
        placed_order_ids: vector::empty(),
        is_active: true,
    };

    // Initialize empty balance as dynamic field
    dynamic_field::add(&mut pool.id, BalanceKey {}, balance::zero<BASE>());

    event::emit(PoolCreated {
        pool_id: object::id(&pool),
        book_id,
        admin,
        min_rate,
        max_rate,
        num_buckets,
    });

    pool
}

/// Shares a LiquidityPool as a Sui shared object.
/// Must be called from within the yume package.
public(package) fun share<BASE>(pool: LiquidityPool<BASE>) {
    transfer::share_object(pool);
}

// ============================================================
// LP Operations
// ============================================================

/// Deposits BASE tokens into the pool and mints LP shares.
///
/// Share calculation:
/// - First deposit: 1:1 ratio (shares = amount)
/// - Subsequent: shares = amount * total_shares / total_pool_value
///
/// Total pool value = available_balance + deployed_balance
/// This means LP shares appreciate as deployed capital earns interest.
///
/// # Parameters
/// - `pool`: Mutable reference to the LiquidityPool
/// - `deposit_coin`: Coin<BASE> to deposit
///
/// # Abort Conditions
/// - `EPoolInactive` (600): Pool is not accepting deposits
/// - `EZeroDeposit` (605): Deposit amount is zero
entry fun deposit<BASE>(
    pool: &mut LiquidityPool<BASE>,
    deposit_coin: Coin<BASE>,
    ctx: &mut TxContext,
) {
    assert!(pool.is_active, EPoolInactive);

    let amount = coin::value(&deposit_coin);
    assert!(amount > 0, EZeroDeposit);

    // Calculate shares: first deposit is 1:1, subsequent are pro-rata
    let shares = if (pool.total_shares == 0) {
        amount
    } else {
        let total_value = get_available_balance(pool) + pool.deployed_balance;
        (amount * pool.total_shares) / total_value
    };

    // Add deposit to pool's available balance
    let pool_balance = dynamic_field::borrow_mut<BalanceKey, Balance<BASE>>(
        &mut pool.id,
        BalanceKey {},
    );
    balance::join(pool_balance, coin::into_balance(deposit_coin));

    // Update LP shares
    pool.total_shares = pool.total_shares + shares;
    let lp = tx_context::sender(ctx);

    if (dynamic_field::exists_(&pool.id, ShareKey { lp })) {
        let existing = dynamic_field::borrow_mut<ShareKey, u64>(
            &mut pool.id,
            ShareKey { lp },
        );
        *existing = *existing + shares;
    } else {
        dynamic_field::add(&mut pool.id, ShareKey { lp }, shares);
    };

    event::emit(LiquidityDeposited {
        pool_id: object::id(pool),
        lp,
        amount,
        shares_minted: shares,
    });
}

/// Withdraws BASE tokens from the pool by burning LP shares.
///
/// Withdrawal amount = shares_to_burn * available_balance / total_shares
///
/// Note: Only available (undeployed) balance can be withdrawn.
/// Deployed capital (in active orders) becomes available after
/// rebalance cancels the orders.
///
/// # Parameters
/// - `pool`: Mutable reference to the LiquidityPool
/// - `shares_to_burn`: Number of LP shares to redeem
///
/// # Abort Conditions
/// - `EInsufficientShares` (601): LP doesn't have enough shares
entry fun withdraw<BASE>(
    pool: &mut LiquidityPool<BASE>,
    shares_to_burn: u64,
    ctx: &mut TxContext,
) {
    let lp = tx_context::sender(ctx);
    assert!(
        dynamic_field::exists_(&pool.id, ShareKey { lp }),
        EInsufficientShares,
    );

    // Read shares and available balance before any mutable borrows
    let current_shares = *dynamic_field::borrow<ShareKey, u64>(
        &pool.id,
        ShareKey { lp },
    );
    assert!(current_shares >= shares_to_burn, EInsufficientShares);

    // Pro-rata share of available (undeployed) balance
    let available = get_available_balance(pool);
    let withdraw_amount = (shares_to_burn * available) / pool.total_shares;

    // Burn shares (now safe to mutably borrow)
    let lp_shares = dynamic_field::borrow_mut<ShareKey, u64>(
        &mut pool.id,
        ShareKey { lp },
    );
    *lp_shares = *lp_shares - shares_to_burn;
    pool.total_shares = pool.total_shares - shares_to_burn;

    // Split withdrawal from pool balance
    let pool_balance = dynamic_field::borrow_mut<BalanceKey, Balance<BASE>>(
        &mut pool.id,
        BalanceKey {},
    );
    let withdrawn = balance::split(pool_balance, withdraw_amount);
    let withdrawn_coin = coin::from_balance(withdrawn, ctx);

    transfer::public_transfer(withdrawn_coin, lp);

    event::emit(LiquidityWithdrawn {
        pool_id: object::id(pool),
        lp,
        amount: withdraw_amount,
        shares_burned: shares_to_burn,
    });
}

// ============================================================
// Rebalance — The Core Hybrid Model Function
// ============================================================

/// Algorithmically places lend orders on the Order Book.
///
/// This is the heart of the Hybrid Model — passive LP capital is
/// automatically converted into active order book liquidity.
///
/// # Linear Curve Distribution
/// Orders are placed at rates linearly interpolated between
/// `min_rate` and `max_rate`:
///
/// ```
/// rate_i = min_rate + i * (max_rate - min_rate) / (num_buckets - 1)
/// amount_i = available_balance / num_buckets
/// ```
///
/// # Flow
/// 1. Cancel existing pool orders (recover unmatched deposits)
/// 2. Calculate per-bucket allocation from available balance
/// 3. Place lend orders at each rate level
/// 4. Store deposits alongside orders
///
/// # Parameters
/// - `pool`: Mutable reference to the LiquidityPool
/// - `book`: Mutable reference to the OrderBook
/// - `clock`: Sui shared Clock for timestamps
///
/// # Abort Conditions
/// - `EUnauthorized` (603): Caller is not the pool admin
public fun rebalance<BASE, COLLATERAL>(
    pool: &mut LiquidityPool<BASE>,
    book: &mut OrderBook<BASE, COLLATERAL>,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    assert!(tx_context::sender(ctx) == pool.admin, EUnauthorized);

    let current_time = clock::timestamp_ms(clock);
    let admin = pool.admin;

    // ── Step 1: Cancel existing pool orders and recover deposits ──
    let mut orders_cancelled: u64 = 0;
    let mut i = 0;
    let len = vector::length(&pool.placed_order_ids);

    while (i < len) {
        let order_id = *vector::borrow(&pool.placed_order_ids, i);

        // Only cancel if the order is still active (not already matched)
        if (orderbook::has_active_order(book, order_id)) {
            // Cancel the order (admin is the owner)
            orderbook::remove_order(book, order_id, admin);
            orders_cancelled = orders_cancelled + 1;

            // Recover the deposit if it exists
            if (orderbook::has_deposit(book, order_id)) {
                let recovered = orderbook::withdraw_deposit<BASE, COLLATERAL>(
                    book,
                    order_id,
                );
                let pool_balance = dynamic_field::borrow_mut<BalanceKey, Balance<BASE>>(
                    &mut pool.id,
                    BalanceKey {},
                );
                balance::join(pool_balance, recovered);
            };
        };

        i = i + 1;
    };

    // Reset tracking
    pool.placed_order_ids = vector::empty();
    pool.deployed_balance = 0;

    // ── Step 2: Calculate available capital and per-bucket allocation ──
    let available = get_available_balance(pool);
    if (available == 0) {
        event::emit(PoolRebalanced {
            pool_id: object::id(pool),
            orders_cancelled,
            orders_placed: 0,
            total_deployed: 0,
        });
        return
    };

    let per_bucket = available / pool.num_buckets;
    if (per_bucket == 0) {
        event::emit(PoolRebalanced {
            pool_id: object::id(pool),
            orders_cancelled,
            orders_placed: 0,
            total_deployed: 0,
        });
        return
    };

    // ── Step 3: Place orders at each rate level ──
    let mut bucket = 0;
    let mut total_deployed: u64 = 0;
    let rate_spread = pool.max_rate - pool.min_rate;

    while (bucket < pool.num_buckets) {
        // Linear interpolation:
        // rate = min_rate + bucket * (max_rate - min_rate) / (num_buckets - 1)
        let rate = pool.min_rate + (bucket * rate_spread) / (pool.num_buckets - 1);

        // Split balance for this order
        let pool_balance = dynamic_field::borrow_mut<BalanceKey, Balance<BASE>>(
            &mut pool.id,
            BalanceKey {},
        );
        let order_balance = balance::split(pool_balance, per_bucket);

        // Place lend order on the book (pool admin is the order owner)
        let order_id = orderbook::add_order(
            book,
            0, // ORDER_SIDE_LEND
            per_bucket,
            rate,
            current_time,
            admin,
        );

        // Store the deposit alongside the order
        orderbook::store_deposit<BASE, COLLATERAL>(book, order_id, order_balance);

        // Track the order for future rebalance
        vector::push_back(&mut pool.placed_order_ids, order_id);
        total_deployed = total_deployed + per_bucket;

        bucket = bucket + 1;
    };

    pool.deployed_balance = total_deployed;

    event::emit(PoolRebalanced {
        pool_id: object::id(pool),
        orders_cancelled,
        orders_placed: pool.num_buckets,
        total_deployed,
    });
}

// ============================================================
// Internal Helpers
// ============================================================

/// Returns the available (undeployed) balance in the pool
fun get_available_balance<BASE>(pool: &LiquidityPool<BASE>): u64 {
    let b = dynamic_field::borrow<BalanceKey, Balance<BASE>>(
        &pool.id,
        BalanceKey {},
    );
    balance::value(b)
}

// ============================================================
// Accessor Functions
// ============================================================

/// Returns the pool admin address
public fun pool_admin<BASE>(pool: &LiquidityPool<BASE>): address { pool.admin }
/// Returns the associated OrderBook ID
public fun book_id<BASE>(pool: &LiquidityPool<BASE>): ID { pool.book_id }
/// Returns total LP shares outstanding
public fun total_shares<BASE>(pool: &LiquidityPool<BASE>): u64 { pool.total_shares }
/// Returns the minimum rate (bps)
public fun min_rate<BASE>(pool: &LiquidityPool<BASE>): u64 { pool.min_rate }
/// Returns the maximum rate (bps)
public fun max_rate<BASE>(pool: &LiquidityPool<BASE>): u64 { pool.max_rate }
/// Returns the number of rate buckets
public fun num_buckets<BASE>(pool: &LiquidityPool<BASE>): u64 { pool.num_buckets }
/// Returns capital currently deployed as orders
public fun deployed_balance<BASE>(pool: &LiquidityPool<BASE>): u64 { pool.deployed_balance }
/// Returns whether the pool is active
public fun is_active<BASE>(pool: &LiquidityPool<BASE>): bool { pool.is_active }
/// Returns the available (undeployed) balance
public fun available_balance<BASE>(pool: &LiquidityPool<BASE>): u64 {
    get_available_balance(pool)
}
/// Returns the number of orders currently placed by this pool
public fun num_placed_orders<BASE>(pool: &LiquidityPool<BASE>): u64 {
    vector::length(&pool.placed_order_ids)
}

/// Returns an LP's share count (0 if no shares held)
public fun lp_shares<BASE>(pool: &LiquidityPool<BASE>, lp: address): u64 {
    if (dynamic_field::exists_(&pool.id, ShareKey { lp })) {
        *dynamic_field::borrow<ShareKey, u64>(&pool.id, ShareKey { lp })
    } else {
        0
    }
}
