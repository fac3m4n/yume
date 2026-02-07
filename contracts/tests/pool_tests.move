/// Module: yume::pool_tests
///
/// Tests for Phase 4 — Hybrid Liquidity Pools.
/// Covers pool creation, LP deposits/withdrawals, rebalance mechanics,
/// and the full lifecycle of pool-injected liquidity.
#[test_only]
module yume::pool_tests;

use sui::test_scenario;
use sui::clock;
use sui::coin;
use yume::market;
use yume::orderbook::{Self, OrderBook};
use yume::pool::{Self, LiquidityPool};
use yume::vault::CollateralVault;

// ============================================================
// Test types (witness patterns for generic coin types)
// ============================================================

public struct USDC has drop {}
public struct WSUI has drop {}

// ============================================================
// Test addresses
// ============================================================

const ADMIN: address = @0xAD;
const LP_ALICE: address = @0xA1;
const LP_BOB: address = @0xB0;
const BORROWER: address = @0xBB;

// ============================================================
// Market constants (must match orderbook module)
// ============================================================

const DURATION_7_DAY: u64 = 604800;
const RISK_TIER_A: u8 = 0;
const LTV_TIER_A: u64 = 9000;

// ============================================================
// Tests
// ============================================================

#[test]
/// Creates a pool for an existing market and verifies initial state.
fun test_create_pool() {
    let mut scenario = test_scenario::begin(ADMIN);

    // Create the market (OrderBook + Vault)
    {
        market::create_market<USDC, WSUI>(
            DURATION_7_DAY,
            RISK_TIER_A,
            LTV_TIER_A,
            test_scenario::ctx(&mut scenario),
        );
    };

    // Create the pool for that market
    test_scenario::next_tx(&mut scenario, ADMIN);
    {
        let book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::create_pool<USDC, WSUI>(
            &book,
            300, // min_rate: 3%
            800, // max_rate: 8%
            6,   // num_buckets
            test_scenario::ctx(&mut scenario),
        );
        test_scenario::return_shared(book);
    };

    // Verify pool state
    test_scenario::next_tx(&mut scenario, ADMIN);
    {
        let pool = test_scenario::take_shared<LiquidityPool<USDC>>(&scenario);

        assert!(pool::pool_admin(&pool) == ADMIN);
        assert!(pool::total_shares(&pool) == 0);
        assert!(pool::min_rate(&pool) == 300);
        assert!(pool::max_rate(&pool) == 800);
        assert!(pool::num_buckets(&pool) == 6);
        assert!(pool::deployed_balance(&pool) == 0);
        assert!(pool::available_balance(&pool) == 0);
        assert!(pool::is_active(&pool) == true);

        test_scenario::return_shared(pool);
    };

    test_scenario::end(scenario);
}

#[test]
/// LP deposits into the pool and receives shares (1:1 for first deposit).
fun test_pool_deposit() {
    let mut scenario = test_scenario::begin(ADMIN);

    // Setup: create market + pool
    {
        market::create_market<USDC, WSUI>(
            DURATION_7_DAY,
            RISK_TIER_A,
            LTV_TIER_A,
            test_scenario::ctx(&mut scenario),
        );
    };
    test_scenario::next_tx(&mut scenario, ADMIN);
    {
        let book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::create_pool<USDC, WSUI>(&book, 300, 800, 6, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };

    // Alice deposits 100,000 USDC
    test_scenario::next_tx(&mut scenario, LP_ALICE);
    {
        let mut pool = test_scenario::take_shared<LiquidityPool<USDC>>(&scenario);
        let deposit = coin::mint_for_testing<USDC>(100_000, test_scenario::ctx(&mut scenario));
        pool::deposit(&mut pool, deposit, test_scenario::ctx(&mut scenario));

        // First deposit: 1:1 shares
        assert!(pool::total_shares(&pool) == 100_000);
        assert!(pool::lp_shares(&pool, LP_ALICE) == 100_000);
        assert!(pool::available_balance(&pool) == 100_000);

        test_scenario::return_shared(pool);
    };

    // Bob deposits 50,000 USDC (pool has 100k, shares = 100k)
    // Bob's shares = 50,000 * 100,000 / 100,000 = 50,000
    test_scenario::next_tx(&mut scenario, LP_BOB);
    {
        let mut pool = test_scenario::take_shared<LiquidityPool<USDC>>(&scenario);
        let deposit = coin::mint_for_testing<USDC>(50_000, test_scenario::ctx(&mut scenario));
        pool::deposit(&mut pool, deposit, test_scenario::ctx(&mut scenario));

        assert!(pool::total_shares(&pool) == 150_000);
        assert!(pool::lp_shares(&pool, LP_BOB) == 50_000);
        assert!(pool::available_balance(&pool) == 150_000);

        test_scenario::return_shared(pool);
    };

    test_scenario::end(scenario);
}

#[test]
/// LP withdraws from pool and receives pro-rata share of available balance.
fun test_pool_withdraw() {
    let mut scenario = test_scenario::begin(ADMIN);

    // Setup: create market + pool + deposit
    {
        market::create_market<USDC, WSUI>(
            DURATION_7_DAY,
            RISK_TIER_A,
            LTV_TIER_A,
            test_scenario::ctx(&mut scenario),
        );
    };
    test_scenario::next_tx(&mut scenario, ADMIN);
    {
        let book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::create_pool<USDC, WSUI>(&book, 300, 800, 6, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };
    test_scenario::next_tx(&mut scenario, LP_ALICE);
    {
        let mut pool = test_scenario::take_shared<LiquidityPool<USDC>>(&scenario);
        let deposit = coin::mint_for_testing<USDC>(100_000, test_scenario::ctx(&mut scenario));
        pool::deposit(&mut pool, deposit, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(pool);
    };

    // Alice withdraws 40,000 shares
    // Amount = 40,000 * 100,000 / 100,000 = 40,000 USDC
    test_scenario::next_tx(&mut scenario, LP_ALICE);
    {
        let mut pool = test_scenario::take_shared<LiquidityPool<USDC>>(&scenario);
        pool::withdraw(&mut pool, 40_000, test_scenario::ctx(&mut scenario));

        assert!(pool::total_shares(&pool) == 60_000);
        assert!(pool::lp_shares(&pool, LP_ALICE) == 60_000);
        assert!(pool::available_balance(&pool) == 60_000);

        test_scenario::return_shared(pool);
    };

    // Verify Alice received 40,000 USDC
    test_scenario::next_tx(&mut scenario, LP_ALICE);
    {
        let withdrawn = test_scenario::take_from_sender<coin::Coin<USDC>>(&scenario);
        assert!(coin::value(&withdrawn) == 40_000);
        test_scenario::return_to_sender(&scenario, withdrawn);
    };

    test_scenario::end(scenario);
}

#[test]
/// Rebalance places orders at correct rates across the linear curve.
/// With min=300 (3%), max=800 (8%), 6 buckets:
/// Rates: 300, 400, 500, 600, 700, 800
fun test_pool_rebalance() {
    let mut scenario = test_scenario::begin(ADMIN);
    let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));

    // Setup: create market + pool + deposit
    {
        market::create_market<USDC, WSUI>(
            DURATION_7_DAY,
            RISK_TIER_A,
            LTV_TIER_A,
            test_scenario::ctx(&mut scenario),
        );
    };
    test_scenario::next_tx(&mut scenario, ADMIN);
    {
        let book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::create_pool<USDC, WSUI>(&book, 300, 800, 6, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };
    test_scenario::next_tx(&mut scenario, LP_ALICE);
    {
        let mut pool = test_scenario::take_shared<LiquidityPool<USDC>>(&scenario);
        let deposit = coin::mint_for_testing<USDC>(120_000, test_scenario::ctx(&mut scenario));
        pool::deposit(&mut pool, deposit, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(pool);
    };

    // Admin triggers rebalance
    test_scenario::next_tx(&mut scenario, ADMIN);
    {
        let mut pool = test_scenario::take_shared<LiquidityPool<USDC>>(&scenario);
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);

        market::rebalance_pool<USDC, WSUI>(
            &mut pool,
            &mut book,
            &clock,
            test_scenario::ctx(&mut scenario),
        );

        // 120,000 / 6 = 20,000 per bucket
        assert!(pool::deployed_balance(&pool) == 120_000);
        assert!(pool::available_balance(&pool) == 0);
        assert!(pool::num_placed_orders(&pool) == 6);

        // Verify 6 lend orders were placed on the book
        assert!(orderbook::total_asks(&book) == 6);

        // Verify individual order rates (bucket 0..5)
        // Rate[0] = 300 + 0 * 500 / 5 = 300
        let order_0 = orderbook::borrow_order(&book, 0);
        assert!(orderbook::order_rate(order_0) == 300);
        assert!(orderbook::order_amount(order_0) == 20_000);
        assert!(orderbook::order_owner(order_0) == ADMIN);

        // Rate[1] = 300 + 1 * 500 / 5 = 400
        let order_1 = orderbook::borrow_order(&book, 1);
        assert!(orderbook::order_rate(order_1) == 400);

        // Rate[2] = 300 + 2 * 500 / 5 = 500
        let order_2 = orderbook::borrow_order(&book, 2);
        assert!(orderbook::order_rate(order_2) == 500);

        // Rate[3] = 300 + 3 * 500 / 5 = 600
        let order_3 = orderbook::borrow_order(&book, 3);
        assert!(orderbook::order_rate(order_3) == 600);

        // Rate[4] = 300 + 4 * 500 / 5 = 700
        let order_4 = orderbook::borrow_order(&book, 4);
        assert!(orderbook::order_rate(order_4) == 700);

        // Rate[5] = 300 + 5 * 500 / 5 = 800
        let order_5 = orderbook::borrow_order(&book, 5);
        assert!(orderbook::order_rate(order_5) == 800);

        test_scenario::return_shared(pool);
        test_scenario::return_shared(book);
    };

    clock::destroy_for_testing(clock);
    test_scenario::end(scenario);
}

#[test]
/// Rebalance after a pool order has been matched.
/// Verifies the pool recovers unmatched deposits and re-deploys.
fun test_pool_rebalance_after_match() {
    let mut scenario = test_scenario::begin(ADMIN);
    let mut clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
    clock::set_for_testing(&mut clock, 1_000_000);

    // Setup: create market + pool + deposit + rebalance
    {
        market::create_market<USDC, WSUI>(
            DURATION_7_DAY,
            RISK_TIER_A,
            LTV_TIER_A,
            test_scenario::ctx(&mut scenario),
        );
    };
    test_scenario::next_tx(&mut scenario, ADMIN);
    {
        let book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::create_pool<USDC, WSUI>(&book, 300, 800, 6, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };
    test_scenario::next_tx(&mut scenario, LP_ALICE);
    {
        let mut pool = test_scenario::take_shared<LiquidityPool<USDC>>(&scenario);
        let deposit = coin::mint_for_testing<USDC>(120_000, test_scenario::ctx(&mut scenario));
        pool::deposit(&mut pool, deposit, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(pool);
    };
    test_scenario::next_tx(&mut scenario, ADMIN);
    {
        let mut pool = test_scenario::take_shared<LiquidityPool<USDC>>(&scenario);
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::rebalance_pool<USDC, WSUI>(
            &mut pool,
            &mut book,
            &clock,
            test_scenario::ctx(&mut scenario),
        );
        test_scenario::return_shared(pool);
        test_scenario::return_shared(book);
    };

    // Borrower places a borrow order and matches against pool order #0 (rate 300)
    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::place_borrow_order<USDC, WSUI>(
            &mut book,
            20_000,
            500, // borrower willing to pay up to 5%
            &clock,
            test_scenario::ctx(&mut scenario),
        );
        test_scenario::return_shared(book);
    };

    // Match pool order #0 (lend @ 3%) with borrow order #6
    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let mut vault_obj = test_scenario::take_shared<CollateralVault<WSUI>>(&scenario);
        let collateral = coin::mint_for_testing<WSUI>(25_000, test_scenario::ctx(&mut scenario));
        let receipt = market::match_orders<USDC, WSUI>(&mut book, 0, 6, &clock);
        market::settle<USDC, WSUI>(
            receipt,
            collateral,
            &mut book,
            &mut vault_obj,
            &clock,
            test_scenario::ctx(&mut scenario),
        );
        test_scenario::return_shared(book);
        test_scenario::return_shared(vault_obj);
    };

    // Now rebalance again — should recover 5 unmatched orders (100k)
    // and re-deploy 100k across 6 new orders
    test_scenario::next_tx(&mut scenario, ADMIN);
    {
        let mut pool = test_scenario::take_shared<LiquidityPool<USDC>>(&scenario);
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);

        // Before rebalance: 5 orders still active, 1 matched
        assert!(orderbook::total_asks(&book) == 5);

        market::rebalance_pool<USDC, WSUI>(
            &mut pool,
            &mut book,
            &clock,
            test_scenario::ctx(&mut scenario),
        );

        // After rebalance: 100k available (5 * 20k recovered)
        // Re-deployed: 100k / 6 = 16,666 per bucket (with rounding)
        assert!(pool::deployed_balance(&pool) == 99_996); // 16,666 * 6
        assert!(pool::num_placed_orders(&pool) == 6);

        // Old 5 orders cancelled + 6 new = 6 active
        assert!(orderbook::total_asks(&book) == 6);

        test_scenario::return_shared(pool);
        test_scenario::return_shared(book);
    };

    clock::destroy_for_testing(clock);
    test_scenario::end(scenario);
}

#[test]
#[expected_failure(abort_code = pool::EUnauthorized)]
/// Only the pool admin can trigger rebalance.
fun test_rebalance_unauthorized() {
    let mut scenario = test_scenario::begin(ADMIN);
    let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));

    // Setup
    {
        market::create_market<USDC, WSUI>(
            DURATION_7_DAY,
            RISK_TIER_A,
            LTV_TIER_A,
            test_scenario::ctx(&mut scenario),
        );
    };
    test_scenario::next_tx(&mut scenario, ADMIN);
    {
        let book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::create_pool<USDC, WSUI>(&book, 300, 800, 6, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };

    // Non-admin tries to rebalance → should fail
    test_scenario::next_tx(&mut scenario, LP_ALICE);
    {
        let mut pool = test_scenario::take_shared<LiquidityPool<USDC>>(&scenario);
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);

        market::rebalance_pool<USDC, WSUI>(
            &mut pool,
            &mut book,
            &clock,
            test_scenario::ctx(&mut scenario),
        );

        test_scenario::return_shared(pool);
        test_scenario::return_shared(book);
    };

    clock::destroy_for_testing(clock);
    test_scenario::end(scenario);
}

#[test]
#[expected_failure(abort_code = pool::EInvalidConfig)]
/// Pool creation fails with invalid config (min >= max).
fun test_create_pool_invalid_config() {
    let mut scenario = test_scenario::begin(ADMIN);

    {
        market::create_market<USDC, WSUI>(
            DURATION_7_DAY,
            RISK_TIER_A,
            LTV_TIER_A,
            test_scenario::ctx(&mut scenario),
        );
    };
    test_scenario::next_tx(&mut scenario, ADMIN);
    {
        let book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        // min_rate >= max_rate → should fail
        market::create_pool<USDC, WSUI>(&book, 800, 300, 6, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };

    test_scenario::end(scenario);
}

#[test]
#[expected_failure(abort_code = pool::EInsufficientShares)]
/// Withdrawal fails when LP doesn't have enough shares.
fun test_withdraw_insufficient_shares() {
    let mut scenario = test_scenario::begin(ADMIN);

    // Setup
    {
        market::create_market<USDC, WSUI>(
            DURATION_7_DAY,
            RISK_TIER_A,
            LTV_TIER_A,
            test_scenario::ctx(&mut scenario),
        );
    };
    test_scenario::next_tx(&mut scenario, ADMIN);
    {
        let book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::create_pool<USDC, WSUI>(&book, 300, 800, 6, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };
    test_scenario::next_tx(&mut scenario, LP_ALICE);
    {
        let mut pool = test_scenario::take_shared<LiquidityPool<USDC>>(&scenario);
        let deposit = coin::mint_for_testing<USDC>(100_000, test_scenario::ctx(&mut scenario));
        pool::deposit(&mut pool, deposit, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(pool);
    };

    // Try to withdraw more shares than owned
    test_scenario::next_tx(&mut scenario, LP_ALICE);
    {
        let mut pool = test_scenario::take_shared<LiquidityPool<USDC>>(&scenario);
        pool::withdraw(&mut pool, 200_000, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(pool);
    };

    test_scenario::end(scenario);
}
