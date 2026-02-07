/// Module: yume::market_tests
///
/// Comprehensive tests for the Yume lending protocol's core flow:
/// - Market creation
/// - Order placement (lend + borrow)
/// - Order cancellation (happy path + unauthorized)
/// - Order matching with Hot Potato settlement
/// - Error cases (self-match, rate mismatch)
///
/// Uses `sui::test_scenario` to simulate multi-party PTBs.
#[test_only]
module yume::market_tests;

use sui::test_scenario;
use sui::clock;
use yume::market;
use yume::orderbook::{Self, OrderBook};
use yume::position::{Self, LoanPosition};

// ============================================================
// Test Types
// ============================================================

/// Test stablecoin type (simulates USDC as the base lending asset)
public struct USDC has drop {}
/// Test collateral type (simulates wrapped SUI as collateral)
public struct WSUI has drop {}

// ============================================================
// Constants
// ============================================================

const LENDER: address = @0xA;
const BORROWER: address = @0xB;
const ADMIN: address = @0xC;
const STRANGER: address = @0xD;

const ORDER_SIDE_LEND: u8 = 0;
const ORDER_SIDE_BORROW: u8 = 1;

const DURATION_7_DAY: u64 = 604800;
const RISK_TIER_A: u8 = 0;
const LTV_TIER_A: u64 = 9000; // 90%

// ============================================================
// Happy Path Tests
// ============================================================

#[test]
/// Verifies that a new OrderBook can be created as a shared object
/// with correct initial state.
fun test_create_market() {
    let mut scenario = test_scenario::begin(ADMIN);

    // Transaction 1: Create a 7-day, Tier A market
    {
        market::create_market<USDC, WSUI>(
            DURATION_7_DAY,
            RISK_TIER_A,
            LTV_TIER_A,
            test_scenario::ctx(&mut scenario),
        );
    };

    // Transaction 2: Verify the OrderBook was created and shared
    test_scenario::next_tx(&mut scenario, ADMIN);
    {
        let book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        assert!(orderbook::total_bids(&book) == 0);
        assert!(orderbook::total_asks(&book) == 0);
        assert!(orderbook::duration_bucket(&book) == DURATION_7_DAY);
        assert!(orderbook::risk_tier(&book) == RISK_TIER_A);
        assert!(orderbook::max_ltv_bps(&book) == LTV_TIER_A);
        assert!(orderbook::is_active(&book) == true);
        assert!(orderbook::next_order_id(&book) == 0);
        test_scenario::return_shared(book);
    };

    test_scenario::end(scenario);
}

#[test]
/// Verifies that both lend and borrow limit orders can be placed,
/// and that order counters update correctly.
fun test_place_limit_orders() {
    let mut scenario = test_scenario::begin(ADMIN);
    let mut clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
    clock::set_for_testing(&mut clock, 1_000_000);

    // Create market
    {
        market::create_market<USDC, WSUI>(
            DURATION_7_DAY,
            RISK_TIER_A,
            LTV_TIER_A,
            test_scenario::ctx(&mut scenario),
        );
    };

    // Lender places an ask: 100k USDC at 5% APY
    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::place_limit_order<USDC, WSUI>(
            &mut book,
            ORDER_SIDE_LEND,
            100_000,
            500, // 5.00% in basis points
            &clock,
            test_scenario::ctx(&mut scenario),
        );
        assert!(orderbook::total_asks(&book) == 1);
        assert!(orderbook::total_bids(&book) == 0);
        assert!(orderbook::next_order_id(&book) == 1);

        // Verify order data
        let order = orderbook::borrow_order(&book, 0);
        assert!(orderbook::order_owner(order) == LENDER);
        assert!(orderbook::order_side(order) == ORDER_SIDE_LEND);
        assert!(orderbook::order_amount(order) == 100_000);
        assert!(orderbook::order_rate(order) == 500);
        assert!(orderbook::order_is_active(order) == true);

        test_scenario::return_shared(book);
    };

    // Borrower places a bid: 50k USDC at 8% max rate
    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::place_limit_order<USDC, WSUI>(
            &mut book,
            ORDER_SIDE_BORROW,
            50_000,
            800, // 8.00% max rate
            &clock,
            test_scenario::ctx(&mut scenario),
        );
        assert!(orderbook::total_asks(&book) == 1);
        assert!(orderbook::total_bids(&book) == 1);
        assert!(orderbook::next_order_id(&book) == 2);
        test_scenario::return_shared(book);
    };

    clock::destroy_for_testing(clock);
    test_scenario::end(scenario);
}

#[test]
/// Verifies that an order owner can cancel their order,
/// and the counter decrements correctly.
fun test_cancel_order() {
    let mut scenario = test_scenario::begin(ADMIN);
    let mut clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
    clock::set_for_testing(&mut clock, 1_000_000);

    // Create market
    {
        market::create_market<USDC, WSUI>(
            DURATION_7_DAY,
            RISK_TIER_A,
            LTV_TIER_A,
            test_scenario::ctx(&mut scenario),
        );
    };

    // Place an order
    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::place_limit_order<USDC, WSUI>(
            &mut book,
            ORDER_SIDE_LEND,
            100_000,
            500,
            &clock,
            test_scenario::ctx(&mut scenario),
        );
        assert!(orderbook::total_asks(&book) == 1);
        test_scenario::return_shared(book);
    };

    // Cancel the order
    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::cancel_order<USDC, WSUI>(
            &mut book,
            0, // First order ID
            test_scenario::ctx(&mut scenario),
        );
        assert!(orderbook::total_asks(&book) == 0);

        // Order should be inactive but still in the table
        let order = orderbook::borrow_order(&book, 0);
        assert!(orderbook::order_is_active(order) == false);

        test_scenario::return_shared(book);
    };

    clock::destroy_for_testing(clock);
    test_scenario::end(scenario);
}

#[test]
/// Full Hot Potato flow: place orders → match → settle → verify positions.
///
/// This test demonstrates the complete settlement lifecycle:
/// 1. Lender places ask at 5%, Borrower places bid at 8%
/// 2. Matcher calls match_orders → returns MatchReceipt (Hot Potato)
/// 3. Matcher calls settle → consumes MatchReceipt → creates LoanPositions
/// 4. Verify both parties received correct LoanPosition NFTs
fun test_match_and_settle() {
    let mut scenario = test_scenario::begin(ADMIN);
    let mut clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
    clock::set_for_testing(&mut clock, 1_000_000); // 1 second in ms

    // Create market
    {
        market::create_market<USDC, WSUI>(
            DURATION_7_DAY,
            RISK_TIER_A,
            LTV_TIER_A,
            test_scenario::ctx(&mut scenario),
        );
    };

    // Lender places ask: 100k at 5%
    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::place_limit_order<USDC, WSUI>(
            &mut book,
            ORDER_SIDE_LEND,
            100_000,
            500, // 5%
            &clock,
            test_scenario::ctx(&mut scenario),
        );
        test_scenario::return_shared(book);
    };

    // Borrower places bid: 50k at 8% max
    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::place_limit_order<USDC, WSUI>(
            &mut book,
            ORDER_SIDE_BORROW,
            50_000,
            800, // 8%
            &clock,
            test_scenario::ctx(&mut scenario),
        );
        test_scenario::return_shared(book);
    };

    // Match and settle in the same PTB (Hot Potato flow)
    test_scenario::next_tx(&mut scenario, ADMIN);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);

        // Command 1: Match → returns MatchReceipt (Hot Potato)
        let receipt = market::match_orders<USDC, WSUI>(
            &mut book,
            1, // Borrower's order (taker)
            0, // Lender's order (maker)
            &clock,
        );

        // Command 2: Settle → consumes MatchReceipt → creates positions
        market::settle(
            receipt,
            &clock,
            test_scenario::ctx(&mut scenario),
        );

        // Both orders should be deactivated
        assert!(orderbook::total_bids(&book) == 0);
        assert!(orderbook::total_asks(&book) == 0);

        test_scenario::return_shared(book);
    };

    // Verify lender received their position NFT (the "bond")
    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let lender_pos = test_scenario::take_from_sender<LoanPosition>(&scenario);
        assert!(position::side(&lender_pos) == ORDER_SIDE_LEND);
        // Matched at min(100k, 50k) = 50k
        assert!(position::principal(&lender_pos) == 50_000);
        // Matched at maker's rate (lender was the maker, so 500 bps = 5%)
        assert!(position::rate(&lender_pos) == 500);
        assert!(position::duration(&lender_pos) == DURATION_7_DAY);
        assert!(position::lender(&lender_pos) == LENDER);
        assert!(position::borrower(&lender_pos) == BORROWER);
        assert!(position::status(&lender_pos) == 0); // STATUS_ACTIVE
        // Collateral: 50,000 * 10,000 / 9,000 = 55,555
        assert!(position::collateral_amount(&lender_pos) == 55_555);
        // Maturity: 1_000_000 + (604800 * 1000) = 604_801_000_000
        assert!(position::maturity_time(&lender_pos) == 1_000_000 + (DURATION_7_DAY * 1000));
        test_scenario::return_to_sender(&scenario, lender_pos);
    };

    // Verify borrower received their position NFT (the "obligation")
    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let borrower_pos = test_scenario::take_from_sender<LoanPosition>(&scenario);
        assert!(position::side(&borrower_pos) == ORDER_SIDE_BORROW);
        assert!(position::principal(&borrower_pos) == 50_000);
        assert!(position::rate(&borrower_pos) == 500);
        assert!(position::lender(&borrower_pos) == LENDER);
        assert!(position::borrower(&borrower_pos) == BORROWER);
        assert!(position::status(&borrower_pos) == 0); // STATUS_ACTIVE
        test_scenario::return_to_sender(&scenario, borrower_pos);
    };

    clock::destroy_for_testing(clock);
    test_scenario::end(scenario);
}

// ============================================================
// Error Case Tests
// ============================================================

#[test]
#[expected_failure(abort_code = orderbook::EUnauthorized)]
/// Verifies that only the order owner can cancel their order.
/// A stranger attempting to cancel should trigger EUnauthorized (105).
fun test_cancel_order_unauthorized() {
    let mut scenario = test_scenario::begin(ADMIN);
    let mut clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
    clock::set_for_testing(&mut clock, 1_000_000);

    // Create market
    {
        market::create_market<USDC, WSUI>(
            DURATION_7_DAY,
            RISK_TIER_A,
            LTV_TIER_A,
            test_scenario::ctx(&mut scenario),
        );
    };

    // Lender places an order
    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::place_limit_order<USDC, WSUI>(
            &mut book,
            ORDER_SIDE_LEND,
            100_000,
            500,
            &clock,
            test_scenario::ctx(&mut scenario),
        );
        test_scenario::return_shared(book);
    };

    // Stranger tries to cancel Lender's order → should abort
    test_scenario::next_tx(&mut scenario, STRANGER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::cancel_order<USDC, WSUI>(
            &mut book,
            0,
            test_scenario::ctx(&mut scenario),
        );
        test_scenario::return_shared(book);
    };

    clock::destroy_for_testing(clock);
    test_scenario::end(scenario);
}

#[test]
#[expected_failure(abort_code = orderbook::ESelfMatch)]
/// Verifies that a user cannot match their own orders (wash trading prevention).
fun test_self_match_fails() {
    let mut scenario = test_scenario::begin(ADMIN);
    let mut clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
    clock::set_for_testing(&mut clock, 1_000_000);

    // Create market
    {
        market::create_market<USDC, WSUI>(
            DURATION_7_DAY,
            RISK_TIER_A,
            LTV_TIER_A,
            test_scenario::ctx(&mut scenario),
        );
    };

    // Same user places both a lend and borrow order
    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::place_limit_order<USDC, WSUI>(
            &mut book,
            ORDER_SIDE_LEND,
            100_000,
            500,
            &clock,
            test_scenario::ctx(&mut scenario),
        );
        market::place_limit_order<USDC, WSUI>(
            &mut book,
            ORDER_SIDE_BORROW,
            50_000,
            800,
            &clock,
            test_scenario::ctx(&mut scenario),
        );
        test_scenario::return_shared(book);
    };

    // Try to match own orders → should abort with ESelfMatch
    test_scenario::next_tx(&mut scenario, ADMIN);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let receipt = market::match_orders<USDC, WSUI>(
            &mut book,
            1, // borrow order (taker)
            0, // lend order (maker)
            &clock,
        );
        market::settle(receipt, &clock, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };

    clock::destroy_for_testing(clock);
    test_scenario::end(scenario);
}

#[test]
#[expected_failure(abort_code = orderbook::ERateMismatch)]
/// Verifies that orders with incompatible rates cannot be matched.
/// Lender asks 10%, borrower only willing to pay 5% → ERateMismatch (109).
fun test_rate_mismatch_fails() {
    let mut scenario = test_scenario::begin(ADMIN);
    let mut clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
    clock::set_for_testing(&mut clock, 1_000_000);

    // Create market
    {
        market::create_market<USDC, WSUI>(
            DURATION_7_DAY,
            RISK_TIER_A,
            LTV_TIER_A,
            test_scenario::ctx(&mut scenario),
        );
    };

    // Lender demands 10%
    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::place_limit_order<USDC, WSUI>(
            &mut book,
            ORDER_SIDE_LEND,
            100_000,
            1000, // 10%
            &clock,
            test_scenario::ctx(&mut scenario),
        );
        test_scenario::return_shared(book);
    };

    // Borrower only offers 5%
    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::place_limit_order<USDC, WSUI>(
            &mut book,
            ORDER_SIDE_BORROW,
            50_000,
            500, // 5% max
            &clock,
            test_scenario::ctx(&mut scenario),
        );
        test_scenario::return_shared(book);
    };

    // Try to match → should abort (lender wants 10%, borrower pays max 5%)
    test_scenario::next_tx(&mut scenario, ADMIN);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let receipt = market::match_orders<USDC, WSUI>(
            &mut book,
            1, // borrow (taker)
            0, // lend (maker)
            &clock,
        );
        market::settle(receipt, &clock, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };

    clock::destroy_for_testing(clock);
    test_scenario::end(scenario);
}

#[test]
#[expected_failure(abort_code = orderbook::EInvalidAmount)]
/// Verifies that orders below the minimum amount are rejected.
fun test_order_below_minimum_fails() {
    let mut scenario = test_scenario::begin(ADMIN);
    let mut clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
    clock::set_for_testing(&mut clock, 1_000_000);

    // Create market
    {
        market::create_market<USDC, WSUI>(
            DURATION_7_DAY,
            RISK_TIER_A,
            LTV_TIER_A,
            test_scenario::ctx(&mut scenario),
        );
    };

    // Try to place an order below minimum (default min = 1000)
    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::place_limit_order<USDC, WSUI>(
            &mut book,
            ORDER_SIDE_LEND,
            100, // Below minimum of 1000
            500,
            &clock,
            test_scenario::ctx(&mut scenario),
        );
        test_scenario::return_shared(book);
    };

    clock::destroy_for_testing(clock);
    test_scenario::end(scenario);
}

#[test]
#[expected_failure(abort_code = orderbook::EInvalidRate)]
/// Verifies that a zero interest rate is rejected.
fun test_zero_rate_fails() {
    let mut scenario = test_scenario::begin(ADMIN);
    let mut clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
    clock::set_for_testing(&mut clock, 1_000_000);

    // Create market
    {
        market::create_market<USDC, WSUI>(
            DURATION_7_DAY,
            RISK_TIER_A,
            LTV_TIER_A,
            test_scenario::ctx(&mut scenario),
        );
    };

    // Try to place an order with 0% rate
    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::place_limit_order<USDC, WSUI>(
            &mut book,
            ORDER_SIDE_LEND,
            100_000,
            0, // Zero rate → invalid
            &clock,
            test_scenario::ctx(&mut scenario),
        );
        test_scenario::return_shared(book);
    };

    clock::destroy_for_testing(clock);
    test_scenario::end(scenario);
}
