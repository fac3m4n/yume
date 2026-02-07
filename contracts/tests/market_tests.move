/// Module: yume::market_tests
///
/// Comprehensive tests for Phase 2 & 3 of the Yume lending protocol:
/// - Market creation (OrderBook + CollateralVault)
/// - Lend order placement with Coin<BASE> deposit
/// - Borrow order placement (no deposit)
/// - Order cancellation with deposit refund
/// - Full settlement flow: match → settle with real Coins
/// - Loan repayment with interest calculation
/// - Error cases: insufficient collateral, insufficient repayment, unauthorized
///
/// Uses `sui::test_scenario` to simulate multi-party PTBs
/// and `coin::mint_for_testing` to create test Coins.
#[test_only]
module yume::market_tests;

use sui::test_scenario;
use sui::clock;
use sui::coin;
use yume::market;
use yume::liquidation;
use yume::orderbook::{Self, OrderBook};
use yume::position::{Self, LoanPosition};
use yume::vault::{Self, CollateralVault};

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
/// Verifies that a new OrderBook AND CollateralVault are created as shared objects.
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

    // Transaction 2: Verify both OrderBook and CollateralVault were created
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

        let vault_obj = test_scenario::take_shared<CollateralVault<WSUI>>(&scenario);
        assert!(vault::active_loans(&vault_obj) == 0);
        assert!(vault::total_locked(&vault_obj) == 0);
        test_scenario::return_shared(vault_obj);
    };

    test_scenario::end(scenario);
}

#[test]
/// Verifies that a lender can place an order with a Coin<BASE> deposit,
/// and that the deposit is stored in the OrderBook as a dynamic field.
fun test_place_lend_order_with_deposit() {
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

    // Lender places ask: 100k USDC at 5% with actual Coin deposit
    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let deposit = coin::mint_for_testing<USDC>(100_000, test_scenario::ctx(&mut scenario));

        market::place_lend_order<USDC, WSUI>(
            &mut book,
            deposit,
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

        // Verify deposit exists
        assert!(orderbook::has_deposit<USDC, WSUI>(&book, 0) == true);

        test_scenario::return_shared(book);
    };

    clock::destroy_for_testing(clock);
    test_scenario::end(scenario);
}

#[test]
/// Verifies that a borrower can place an order without a deposit.
fun test_place_borrow_order_no_deposit() {
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

    // Borrower places bid: 50k USDC at 8% max rate (no deposit)
    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);

        market::place_borrow_order<USDC, WSUI>(
            &mut book,
            50_000,
            800, // 8.00% max rate
            &clock,
            test_scenario::ctx(&mut scenario),
        );

        assert!(orderbook::total_asks(&book) == 0);
        assert!(orderbook::total_bids(&book) == 1);
        assert!(orderbook::next_order_id(&book) == 1);

        // Verify no deposit for borrow order
        assert!(orderbook::has_deposit<USDC, WSUI>(&book, 0) == false);

        test_scenario::return_shared(book);
    };

    clock::destroy_for_testing(clock);
    test_scenario::end(scenario);
}

#[test]
/// Verifies that a lender can cancel their order and receive their deposit back.
fun test_cancel_lend_order_refunds_deposit() {
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

    // Lender places order with deposit
    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let deposit = coin::mint_for_testing<USDC>(100_000, test_scenario::ctx(&mut scenario));

        market::place_lend_order<USDC, WSUI>(
            &mut book,
            deposit,
            500,
            &clock,
            test_scenario::ctx(&mut scenario),
        );
        assert!(orderbook::total_asks(&book) == 1);
        test_scenario::return_shared(book);
    };

    // Lender cancels → should get deposit back
    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::cancel_order<USDC, WSUI>(
            &mut book,
            0,
            test_scenario::ctx(&mut scenario),
        );
        assert!(orderbook::total_asks(&book) == 0);

        // Deposit should be removed
        assert!(orderbook::has_deposit<USDC, WSUI>(&book, 0) == false);

        test_scenario::return_shared(book);
    };

    // Verify lender received their refund
    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let refund = test_scenario::take_from_sender<coin::Coin<USDC>>(&scenario);
        assert!(coin::value(&refund) == 100_000);
        test_scenario::return_to_sender(&scenario, refund);
    };

    clock::destroy_for_testing(clock);
    test_scenario::end(scenario);
}

#[test]
/// Full settlement flow with real Coins:
/// 1. Lender deposits USDC with their order
/// 2. Borrower places order (no deposit)
/// 3. Match + settle: borrower provides WSUI collateral
/// 4. Verify: borrower gets USDC principal, both get LoanPosition NFTs
/// 5. Verify: collateral is escrowed in the vault
fun test_settle_with_coins() {
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

    // Lender places ask: 100k USDC at 5% with deposit
    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let deposit = coin::mint_for_testing<USDC>(100_000, test_scenario::ctx(&mut scenario));

        market::place_lend_order<USDC, WSUI>(
            &mut book,
            deposit,
            500,
            &clock,
            test_scenario::ctx(&mut scenario),
        );
        test_scenario::return_shared(book);
    };

    // Borrower places bid: 50k at 8% max
    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);

        market::place_borrow_order<USDC, WSUI>(
            &mut book,
            50_000,
            800,
            &clock,
            test_scenario::ctx(&mut scenario),
        );
        test_scenario::return_shared(book);
    };

    // Match and settle: borrower provides collateral
    // Collateral required: 50,000 * 10,000 / 9,000 = 55,555
    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let mut vault_obj = test_scenario::take_shared<CollateralVault<WSUI>>(&scenario);

        // Borrower provides collateral (exact amount: 55,555)
        let collateral = coin::mint_for_testing<WSUI>(
            55_555,
            test_scenario::ctx(&mut scenario),
        );

        // Command 1: Match → MatchReceipt (Hot Potato)
        let receipt = market::match_orders<USDC, WSUI>(
            &mut book,
            1, // Borrower's order (taker)
            0, // Lender's order (maker)
            &clock,
        );

        // Command 2: Settle → consumes receipt, transfers coins, creates positions
        market::settle<USDC, WSUI>(
            receipt,
            collateral,
            &mut book,
            &mut vault_obj,
            &clock,
            test_scenario::ctx(&mut scenario),
        );

        // Both orders should be deactivated
        assert!(orderbook::total_bids(&book) == 0);
        assert!(orderbook::total_asks(&book) == 0);

        // Deposit should be consumed
        assert!(orderbook::has_deposit<USDC, WSUI>(&book, 0) == false);

        // Vault should have collateral locked
        assert!(vault::active_loans(&vault_obj) == 1);
        assert!(vault::total_locked(&vault_obj) == 55_555);

        test_scenario::return_shared(book);
        test_scenario::return_shared(vault_obj);
    };

    // Verify borrower received principal (Coin<USDC>)
    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let principal = test_scenario::take_from_sender<coin::Coin<USDC>>(&scenario);
        assert!(coin::value(&principal) == 50_000);
        test_scenario::return_to_sender(&scenario, principal);

        // Verify borrower received position NFT
        let borrower_pos = test_scenario::take_from_sender<LoanPosition>(&scenario);
        assert!(position::side(&borrower_pos) == ORDER_SIDE_BORROW);
        assert!(position::principal(&borrower_pos) == 50_000);
        assert!(position::rate(&borrower_pos) == 500); // Matched at maker's (lender's) rate
        assert!(position::duration(&borrower_pos) == DURATION_7_DAY);
        assert!(position::lender(&borrower_pos) == LENDER);
        assert!(position::borrower(&borrower_pos) == BORROWER);
        assert!(position::status(&borrower_pos) == 0); // STATUS_ACTIVE
        assert!(position::collateral_amount(&borrower_pos) == 55_555);
        test_scenario::return_to_sender(&scenario, borrower_pos);
    };

    // Verify lender received position NFT AND unmatched deposit refund
    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let lender_pos = test_scenario::take_from_sender<LoanPosition>(&scenario);
        assert!(position::side(&lender_pos) == ORDER_SIDE_LEND);
        assert!(position::principal(&lender_pos) == 50_000);
        assert!(position::rate(&lender_pos) == 500);
        assert!(position::lender(&lender_pos) == LENDER);
        assert!(position::borrower(&lender_pos) == BORROWER);
        assert!(position::status(&lender_pos) == 0); // STATUS_ACTIVE
        assert!(position::collateral_amount(&lender_pos) == 55_555);
        // Maturity: 1_000_000 + (604800 * 1000) = 604_801_000_000
        assert!(position::maturity_time(&lender_pos) == 1_000_000 + (DURATION_7_DAY * 1000));
        test_scenario::return_to_sender(&scenario, lender_pos);

        // Lender deposited 100k but only 50k was matched → 50k refund
        let refund = test_scenario::take_from_sender<coin::Coin<USDC>>(&scenario);
        assert!(coin::value(&refund) == 50_000);
        test_scenario::return_to_sender(&scenario, refund);
    };

    clock::destroy_for_testing(clock);
    test_scenario::end(scenario);
}

#[test]
/// Full lifecycle: place → match → settle → repay
/// Verifies that the borrower can repay principal + interest and get collateral back.
fun test_full_lifecycle_with_repayment() {
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

    // Lender places ask: 50k USDC at 5%
    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let deposit = coin::mint_for_testing<USDC>(50_000, test_scenario::ctx(&mut scenario));

        market::place_lend_order<USDC, WSUI>(
            &mut book,
            deposit,
            500,
            &clock,
            test_scenario::ctx(&mut scenario),
        );
        test_scenario::return_shared(book);
    };

    // Borrower places bid: 50k at 8% max
    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::place_borrow_order<USDC, WSUI>(
            &mut book,
            50_000,
            800,
            &clock,
            test_scenario::ctx(&mut scenario),
        );
        test_scenario::return_shared(book);
    };

    // Match + settle
    // Collateral: 50,000 * 10,000 / 9,000 = 55,555
    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let mut vault_obj = test_scenario::take_shared<CollateralVault<WSUI>>(&scenario);
        let collateral = coin::mint_for_testing<WSUI>(55_555, test_scenario::ctx(&mut scenario));

        let receipt = market::match_orders<USDC, WSUI>(&mut book, 1, 0, &clock);
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

    // Advance clock past loan start (simulate time passing)
    clock::set_for_testing(&mut clock, 500_000_000);

    // Borrower repays: principal (50,000) + interest (50,000 * 500 / 10,000 = 2,500) = 52,500
    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut borrower_pos = test_scenario::take_from_sender<LoanPosition>(&scenario);
        let mut vault_obj = test_scenario::take_shared<CollateralVault<WSUI>>(&scenario);

        let repayment = coin::mint_for_testing<USDC>(52_500, test_scenario::ctx(&mut scenario));

        market::repay<USDC, WSUI>(
            &mut borrower_pos,
            repayment,
            &mut vault_obj,
            &clock,
            test_scenario::ctx(&mut scenario),
        );

        // Position should be repaid
        assert!(position::status(&borrower_pos) == 1); // STATUS_REPAID

        // Vault should have released the collateral
        assert!(vault::active_loans(&vault_obj) == 0);
        assert!(vault::total_locked(&vault_obj) == 0);

        test_scenario::return_to_sender(&scenario, borrower_pos);
        test_scenario::return_shared(vault_obj);
    };

    // Verify borrower got collateral back
    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let collateral_back = test_scenario::take_from_sender<coin::Coin<WSUI>>(&scenario);
        assert!(coin::value(&collateral_back) == 55_555);
        test_scenario::return_to_sender(&scenario, collateral_back);
    };

    // Verify lender received repayment (principal + interest)
    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let repayment_received = test_scenario::take_from_sender<coin::Coin<USDC>>(&scenario);
        assert!(coin::value(&repayment_received) == 52_500);
        test_scenario::return_to_sender(&scenario, repayment_received);
    };

    clock::destroy_for_testing(clock);
    test_scenario::end(scenario);
}

#[test]
/// Verifies that settle handles excess collateral correctly by returning remainder.
fun test_settle_returns_excess_collateral() {
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

    // Lender places ask: 50k at 5%
    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let deposit = coin::mint_for_testing<USDC>(50_000, test_scenario::ctx(&mut scenario));
        market::place_lend_order<USDC, WSUI>(&mut book, deposit, 500, &clock, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };

    // Borrower places bid: 50k at 8%
    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::place_borrow_order<USDC, WSUI>(&mut book, 50_000, 800, &clock, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };

    // Settle with EXCESS collateral (100k instead of 55,555 required)
    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let mut vault_obj = test_scenario::take_shared<CollateralVault<WSUI>>(&scenario);
        let collateral = coin::mint_for_testing<WSUI>(100_000, test_scenario::ctx(&mut scenario));

        let receipt = market::match_orders<USDC, WSUI>(&mut book, 1, 0, &clock);
        market::settle<USDC, WSUI>(
            receipt, collateral, &mut book, &mut vault_obj, &clock,
            test_scenario::ctx(&mut scenario),
        );

        // Vault should only have exact collateral amount
        assert!(vault::total_locked(&vault_obj) == 55_555);

        test_scenario::return_shared(book);
        test_scenario::return_shared(vault_obj);
    };

    // Verify borrower received excess collateral back
    // Borrower should have: Coin<USDC> (principal) + Coin<WSUI> (excess) + LoanPosition
    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        // Principal transfer
        let principal = test_scenario::take_from_sender<coin::Coin<USDC>>(&scenario);
        assert!(coin::value(&principal) == 50_000);
        test_scenario::return_to_sender(&scenario, principal);

        // Excess collateral returned (100,000 - 55,555 = 44,445)
        let excess = test_scenario::take_from_sender<coin::Coin<WSUI>>(&scenario);
        assert!(coin::value(&excess) == 44_445);
        test_scenario::return_to_sender(&scenario, excess);
    };

    clock::destroy_for_testing(clock);
    test_scenario::end(scenario);
}

#[test]
/// Verifies that repay handles excess repayment correctly by returning remainder.
fun test_repay_returns_excess() {
    let mut scenario = test_scenario::begin(ADMIN);
    let mut clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
    clock::set_for_testing(&mut clock, 1_000_000);

    // Setup: create market, place orders, settle
    {
        market::create_market<USDC, WSUI>(DURATION_7_DAY, RISK_TIER_A, LTV_TIER_A, test_scenario::ctx(&mut scenario));
    };

    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let deposit = coin::mint_for_testing<USDC>(50_000, test_scenario::ctx(&mut scenario));
        market::place_lend_order<USDC, WSUI>(&mut book, deposit, 500, &clock, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };

    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::place_borrow_order<USDC, WSUI>(&mut book, 50_000, 800, &clock, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };

    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let mut vault_obj = test_scenario::take_shared<CollateralVault<WSUI>>(&scenario);
        let collateral = coin::mint_for_testing<WSUI>(55_555, test_scenario::ctx(&mut scenario));
        let receipt = market::match_orders<USDC, WSUI>(&mut book, 1, 0, &clock);
        market::settle<USDC, WSUI>(receipt, collateral, &mut book, &mut vault_obj, &clock, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
        test_scenario::return_shared(vault_obj);
    };

    // Repay with 60,000 USDC (total due = 52,500, excess = 7,500)
    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut borrower_pos = test_scenario::take_from_sender<LoanPosition>(&scenario);
        let mut vault_obj = test_scenario::take_shared<CollateralVault<WSUI>>(&scenario);
        let repayment = coin::mint_for_testing<USDC>(60_000, test_scenario::ctx(&mut scenario));

        market::repay<USDC, WSUI>(&mut borrower_pos, repayment, &mut vault_obj, &clock, test_scenario::ctx(&mut scenario));

        test_scenario::return_to_sender(&scenario, borrower_pos);
        test_scenario::return_shared(vault_obj);
    };

    // Verify lender got exactly 52,500
    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let repayment_received = test_scenario::take_from_sender<coin::Coin<USDC>>(&scenario);
        assert!(coin::value(&repayment_received) == 52_500);
        test_scenario::return_to_sender(&scenario, repayment_received);
    };

    // Verify borrower got excess repayment back (7,500) and collateral (55,555)
    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let collateral_back = test_scenario::take_from_sender<coin::Coin<WSUI>>(&scenario);
        assert!(coin::value(&collateral_back) == 55_555);
        test_scenario::return_to_sender(&scenario, collateral_back);

        let excess = test_scenario::take_from_sender<coin::Coin<USDC>>(&scenario);
        assert!(coin::value(&excess) == 7_500);
        test_scenario::return_to_sender(&scenario, excess);
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
fun test_cancel_order_unauthorized() {
    let mut scenario = test_scenario::begin(ADMIN);
    let mut clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
    clock::set_for_testing(&mut clock, 1_000_000);

    {
        market::create_market<USDC, WSUI>(DURATION_7_DAY, RISK_TIER_A, LTV_TIER_A, test_scenario::ctx(&mut scenario));
    };

    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let deposit = coin::mint_for_testing<USDC>(100_000, test_scenario::ctx(&mut scenario));
        market::place_lend_order<USDC, WSUI>(&mut book, deposit, 500, &clock, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };

    // Stranger tries to cancel → should abort
    test_scenario::next_tx(&mut scenario, STRANGER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::cancel_order<USDC, WSUI>(&mut book, 0, test_scenario::ctx(&mut scenario));
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

    {
        market::create_market<USDC, WSUI>(DURATION_7_DAY, RISK_TIER_A, LTV_TIER_A, test_scenario::ctx(&mut scenario));
    };

    // Same user places both orders
    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let deposit = coin::mint_for_testing<USDC>(100_000, test_scenario::ctx(&mut scenario));
        market::place_lend_order<USDC, WSUI>(&mut book, deposit, 500, &clock, test_scenario::ctx(&mut scenario));
        market::place_borrow_order<USDC, WSUI>(&mut book, 50_000, 800, &clock, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };

    // Try to match own orders → should abort with ESelfMatch
    test_scenario::next_tx(&mut scenario, ADMIN);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let mut vault_obj = test_scenario::take_shared<CollateralVault<WSUI>>(&scenario);
        let collateral = coin::mint_for_testing<WSUI>(100_000, test_scenario::ctx(&mut scenario));

        let receipt = market::match_orders<USDC, WSUI>(&mut book, 1, 0, &clock);
        market::settle<USDC, WSUI>(receipt, collateral, &mut book, &mut vault_obj, &clock, test_scenario::ctx(&mut scenario));

        test_scenario::return_shared(book);
        test_scenario::return_shared(vault_obj);
    };

    clock::destroy_for_testing(clock);
    test_scenario::end(scenario);
}

#[test]
#[expected_failure(abort_code = orderbook::ERateMismatch)]
/// Verifies that orders with incompatible rates cannot be matched.
fun test_rate_mismatch_fails() {
    let mut scenario = test_scenario::begin(ADMIN);
    let mut clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
    clock::set_for_testing(&mut clock, 1_000_000);

    {
        market::create_market<USDC, WSUI>(DURATION_7_DAY, RISK_TIER_A, LTV_TIER_A, test_scenario::ctx(&mut scenario));
    };

    // Lender demands 10%
    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let deposit = coin::mint_for_testing<USDC>(100_000, test_scenario::ctx(&mut scenario));
        market::place_lend_order<USDC, WSUI>(&mut book, deposit, 1000, &clock, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };

    // Borrower only offers 5%
    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::place_borrow_order<USDC, WSUI>(&mut book, 50_000, 500, &clock, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };

    // Match should fail (lender 10% > borrower 5%)
    test_scenario::next_tx(&mut scenario, ADMIN);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let mut vault_obj = test_scenario::take_shared<CollateralVault<WSUI>>(&scenario);
        let collateral = coin::mint_for_testing<WSUI>(100_000, test_scenario::ctx(&mut scenario));

        let receipt = market::match_orders<USDC, WSUI>(&mut book, 1, 0, &clock);
        market::settle<USDC, WSUI>(receipt, collateral, &mut book, &mut vault_obj, &clock, test_scenario::ctx(&mut scenario));

        test_scenario::return_shared(book);
        test_scenario::return_shared(vault_obj);
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

    {
        market::create_market<USDC, WSUI>(DURATION_7_DAY, RISK_TIER_A, LTV_TIER_A, test_scenario::ctx(&mut scenario));
    };

    // Lend order with too-small deposit (100 < min 1000)
    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let deposit = coin::mint_for_testing<USDC>(100, test_scenario::ctx(&mut scenario));
        market::place_lend_order<USDC, WSUI>(&mut book, deposit, 500, &clock, test_scenario::ctx(&mut scenario));
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

    {
        market::create_market<USDC, WSUI>(DURATION_7_DAY, RISK_TIER_A, LTV_TIER_A, test_scenario::ctx(&mut scenario));
    };

    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let deposit = coin::mint_for_testing<USDC>(100_000, test_scenario::ctx(&mut scenario));
        market::place_lend_order<USDC, WSUI>(&mut book, deposit, 0, &clock, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };

    clock::destroy_for_testing(clock);
    test_scenario::end(scenario);
}

#[test]
#[expected_failure(abort_code = market::EInsufficientCollateral)]
/// Verifies that settlement fails when collateral is less than required.
fun test_settle_insufficient_collateral_fails() {
    let mut scenario = test_scenario::begin(ADMIN);
    let mut clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
    clock::set_for_testing(&mut clock, 1_000_000);

    {
        market::create_market<USDC, WSUI>(DURATION_7_DAY, RISK_TIER_A, LTV_TIER_A, test_scenario::ctx(&mut scenario));
    };

    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let deposit = coin::mint_for_testing<USDC>(50_000, test_scenario::ctx(&mut scenario));
        market::place_lend_order<USDC, WSUI>(&mut book, deposit, 500, &clock, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };

    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::place_borrow_order<USDC, WSUI>(&mut book, 50_000, 800, &clock, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };

    // Settle with insufficient collateral (1,000 < 55,555 required)
    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let mut vault_obj = test_scenario::take_shared<CollateralVault<WSUI>>(&scenario);
        let collateral = coin::mint_for_testing<WSUI>(1_000, test_scenario::ctx(&mut scenario));

        let receipt = market::match_orders<USDC, WSUI>(&mut book, 1, 0, &clock);
        market::settle<USDC, WSUI>(
            receipt, collateral, &mut book, &mut vault_obj, &clock,
            test_scenario::ctx(&mut scenario),
        );

        test_scenario::return_shared(book);
        test_scenario::return_shared(vault_obj);
    };

    clock::destroy_for_testing(clock);
    test_scenario::end(scenario);
}

#[test]
#[expected_failure(abort_code = market::EInsufficientRepayment)]
/// Verifies that repayment fails when the coin value is less than total due.
fun test_repay_insufficient_funds_fails() {
    let mut scenario = test_scenario::begin(ADMIN);
    let mut clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
    clock::set_for_testing(&mut clock, 1_000_000);

    // Setup: create, place, settle
    {
        market::create_market<USDC, WSUI>(DURATION_7_DAY, RISK_TIER_A, LTV_TIER_A, test_scenario::ctx(&mut scenario));
    };

    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let deposit = coin::mint_for_testing<USDC>(50_000, test_scenario::ctx(&mut scenario));
        market::place_lend_order<USDC, WSUI>(&mut book, deposit, 500, &clock, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };

    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::place_borrow_order<USDC, WSUI>(&mut book, 50_000, 800, &clock, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };

    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let mut vault_obj = test_scenario::take_shared<CollateralVault<WSUI>>(&scenario);
        let collateral = coin::mint_for_testing<WSUI>(55_555, test_scenario::ctx(&mut scenario));
        let receipt = market::match_orders<USDC, WSUI>(&mut book, 1, 0, &clock);
        market::settle<USDC, WSUI>(receipt, collateral, &mut book, &mut vault_obj, &clock, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
        test_scenario::return_shared(vault_obj);
    };

    // Repay with insufficient funds (10,000 < 52,500 total due)
    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut borrower_pos = test_scenario::take_from_sender<LoanPosition>(&scenario);
        let mut vault_obj = test_scenario::take_shared<CollateralVault<WSUI>>(&scenario);
        let repayment = coin::mint_for_testing<USDC>(10_000, test_scenario::ctx(&mut scenario));

        market::repay<USDC, WSUI>(&mut borrower_pos, repayment, &mut vault_obj, &clock, test_scenario::ctx(&mut scenario));

        test_scenario::return_to_sender(&scenario, borrower_pos);
        test_scenario::return_shared(vault_obj);
    };

    clock::destroy_for_testing(clock);
    test_scenario::end(scenario);
}

#[test]
#[expected_failure(abort_code = market::ENotBorrowerPosition)]
/// Verifies that only borrower positions can be used for repayment.
fun test_repay_with_lender_position_fails() {
    let mut scenario = test_scenario::begin(ADMIN);
    let mut clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
    clock::set_for_testing(&mut clock, 1_000_000);

    // Setup: create, place, settle
    {
        market::create_market<USDC, WSUI>(DURATION_7_DAY, RISK_TIER_A, LTV_TIER_A, test_scenario::ctx(&mut scenario));
    };

    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let deposit = coin::mint_for_testing<USDC>(50_000, test_scenario::ctx(&mut scenario));
        market::place_lend_order<USDC, WSUI>(&mut book, deposit, 500, &clock, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };

    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::place_borrow_order<USDC, WSUI>(&mut book, 50_000, 800, &clock, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };

    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let mut vault_obj = test_scenario::take_shared<CollateralVault<WSUI>>(&scenario);
        let collateral = coin::mint_for_testing<WSUI>(55_555, test_scenario::ctx(&mut scenario));
        let receipt = market::match_orders<USDC, WSUI>(&mut book, 1, 0, &clock);
        market::settle<USDC, WSUI>(receipt, collateral, &mut book, &mut vault_obj, &clock, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
        test_scenario::return_shared(vault_obj);
    };

    // Try to repay using lender's position → should abort
    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let mut lender_pos = test_scenario::take_from_sender<LoanPosition>(&scenario);
        let mut vault_obj = test_scenario::take_shared<CollateralVault<WSUI>>(&scenario);
        let repayment = coin::mint_for_testing<USDC>(52_500, test_scenario::ctx(&mut scenario));

        market::repay<USDC, WSUI>(&mut lender_pos, repayment, &mut vault_obj, &clock, test_scenario::ctx(&mut scenario));

        test_scenario::return_to_sender(&scenario, lender_pos);
        test_scenario::return_shared(vault_obj);
    };

    clock::destroy_for_testing(clock);
    test_scenario::end(scenario);
}

// ============================================================
// Phase 3 — Liquidation Tests
// ============================================================

#[test]
/// Full liquidation flow: place → match → settle → advance clock past maturity → liquidate.
/// Verifies that a third-party liquidator can seize collateral after loan expiry.
fun test_liquidation_after_maturity() {
    let mut scenario = test_scenario::begin(ADMIN);
    let mut clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
    clock::set_for_testing(&mut clock, 1_000_000);

    // Setup: create market, place orders, settle
    {
        market::create_market<USDC, WSUI>(DURATION_7_DAY, RISK_TIER_A, LTV_TIER_A, test_scenario::ctx(&mut scenario));
    };

    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let deposit = coin::mint_for_testing<USDC>(50_000, test_scenario::ctx(&mut scenario));
        market::place_lend_order<USDC, WSUI>(&mut book, deposit, 500, &clock, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };

    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::place_borrow_order<USDC, WSUI>(&mut book, 50_000, 800, &clock, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };

    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let mut vault_obj = test_scenario::take_shared<CollateralVault<WSUI>>(&scenario);
        let collateral = coin::mint_for_testing<WSUI>(55_555, test_scenario::ctx(&mut scenario));
        let receipt = market::match_orders<USDC, WSUI>(&mut book, 1, 0, &clock);
        market::settle<USDC, WSUI>(receipt, collateral, &mut book, &mut vault_obj, &clock, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
        test_scenario::return_shared(vault_obj);
    };

    // Verify loan info is stored in vault
    test_scenario::next_tx(&mut scenario, ADMIN);
    {
        let vault_obj = test_scenario::take_shared<CollateralVault<WSUI>>(&scenario);
        let lender_pos = test_scenario::take_from_address<LoanPosition>(&scenario, LENDER);
        let loan_id = position::loan_id(&lender_pos);

        assert!(vault::has_loan_info(&vault_obj, loan_id) == true);
        assert!(vault::has_collateral(&vault_obj, loan_id) == true);

        let info = vault::get_loan_info(&vault_obj, loan_id);
        assert!(vault::loan_info_lender(&info) == LENDER);
        assert!(vault::loan_info_borrower(&info) == BORROWER);
        assert!(vault::loan_info_principal(&info) == 50_000);
        assert!(vault::loan_info_rate(&info) == 500);

        test_scenario::return_to_address(LENDER, lender_pos);
        test_scenario::return_shared(vault_obj);
    };

    // Advance clock PAST maturity (7 days + 1 second = 604801 seconds from start)
    // Maturity = 1_000_000 + (604800 * 1000) = 604_801_000_000 ms
    clock::set_for_testing(&mut clock, 604_801_000_001);

    // STRANGER triggers liquidation (permissionless)
    test_scenario::next_tx(&mut scenario, STRANGER);
    {
        let mut vault_obj = test_scenario::take_shared<CollateralVault<WSUI>>(&scenario);
        let lender_pos = test_scenario::take_from_address<LoanPosition>(&scenario, LENDER);
        let loan_id = position::loan_id(&lender_pos);

        liquidation::liquidate<WSUI>(
            &mut vault_obj,
            loan_id,
            &clock,
            test_scenario::ctx(&mut scenario),
        );

        // Vault should be empty
        assert!(vault::active_loans(&vault_obj) == 0);
        assert!(vault::total_locked(&vault_obj) == 0);
        assert!(vault::has_collateral(&vault_obj, loan_id) == false);
        assert!(vault::has_loan_info(&vault_obj, loan_id) == false);

        test_scenario::return_to_address(LENDER, lender_pos);
        test_scenario::return_shared(vault_obj);
    };

    // Verify lender received collateral as compensation
    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let collateral_received = test_scenario::take_from_sender<coin::Coin<WSUI>>(&scenario);
        assert!(coin::value(&collateral_received) == 55_555);
        test_scenario::return_to_sender(&scenario, collateral_received);
    };

    clock::destroy_for_testing(clock);
    test_scenario::end(scenario);
}

#[test]
#[expected_failure(abort_code = liquidation::ELoanNotExpired)]
/// Verifies that liquidation fails when the loan has not yet matured.
fun test_liquidation_before_maturity_fails() {
    let mut scenario = test_scenario::begin(ADMIN);
    let mut clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
    clock::set_for_testing(&mut clock, 1_000_000);

    // Setup: create market, place orders, settle
    {
        market::create_market<USDC, WSUI>(DURATION_7_DAY, RISK_TIER_A, LTV_TIER_A, test_scenario::ctx(&mut scenario));
    };

    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let deposit = coin::mint_for_testing<USDC>(50_000, test_scenario::ctx(&mut scenario));
        market::place_lend_order<USDC, WSUI>(&mut book, deposit, 500, &clock, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };

    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::place_borrow_order<USDC, WSUI>(&mut book, 50_000, 800, &clock, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };

    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let mut vault_obj = test_scenario::take_shared<CollateralVault<WSUI>>(&scenario);
        let collateral = coin::mint_for_testing<WSUI>(55_555, test_scenario::ctx(&mut scenario));
        let receipt = market::match_orders<USDC, WSUI>(&mut book, 1, 0, &clock);
        market::settle<USDC, WSUI>(receipt, collateral, &mut book, &mut vault_obj, &clock, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
        test_scenario::return_shared(vault_obj);
    };

    // Try to liquidate BEFORE maturity → should abort
    // Clock is still at 1_000_000 ms, maturity is 604_801_000_000 ms
    test_scenario::next_tx(&mut scenario, STRANGER);
    {
        let mut vault_obj = test_scenario::take_shared<CollateralVault<WSUI>>(&scenario);
        let lender_pos = test_scenario::take_from_address<LoanPosition>(&scenario, LENDER);
        let loan_id = position::loan_id(&lender_pos);

        liquidation::liquidate<WSUI>(
            &mut vault_obj,
            loan_id,
            &clock,
            test_scenario::ctx(&mut scenario),
        );

        test_scenario::return_to_address(LENDER, lender_pos);
        test_scenario::return_shared(vault_obj);
    };

    clock::destroy_for_testing(clock);
    test_scenario::end(scenario);
}

#[test]
#[expected_failure(abort_code = liquidation::EAlreadyLiquidated)]
/// Verifies that double liquidation is prevented (collateral already seized).
fun test_double_liquidation_fails() {
    let mut scenario = test_scenario::begin(ADMIN);
    let mut clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
    clock::set_for_testing(&mut clock, 1_000_000);

    // Setup: create market, place orders, settle
    {
        market::create_market<USDC, WSUI>(DURATION_7_DAY, RISK_TIER_A, LTV_TIER_A, test_scenario::ctx(&mut scenario));
    };

    test_scenario::next_tx(&mut scenario, LENDER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let deposit = coin::mint_for_testing<USDC>(50_000, test_scenario::ctx(&mut scenario));
        market::place_lend_order<USDC, WSUI>(&mut book, deposit, 500, &clock, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };

    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        market::place_borrow_order<USDC, WSUI>(&mut book, 50_000, 800, &clock, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
    };

    test_scenario::next_tx(&mut scenario, BORROWER);
    {
        let mut book = test_scenario::take_shared<OrderBook<USDC, WSUI>>(&scenario);
        let mut vault_obj = test_scenario::take_shared<CollateralVault<WSUI>>(&scenario);
        let collateral = coin::mint_for_testing<WSUI>(55_555, test_scenario::ctx(&mut scenario));
        let receipt = market::match_orders<USDC, WSUI>(&mut book, 1, 0, &clock);
        market::settle<USDC, WSUI>(receipt, collateral, &mut book, &mut vault_obj, &clock, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(book);
        test_scenario::return_shared(vault_obj);
    };

    // Advance past maturity
    clock::set_for_testing(&mut clock, 604_801_000_001);

    // First liquidation succeeds
    test_scenario::next_tx(&mut scenario, STRANGER);
    {
        let mut vault_obj = test_scenario::take_shared<CollateralVault<WSUI>>(&scenario);
        let lender_pos = test_scenario::take_from_address<LoanPosition>(&scenario, LENDER);
        let loan_id = position::loan_id(&lender_pos);

        liquidation::liquidate<WSUI>(&mut vault_obj, loan_id, &clock, test_scenario::ctx(&mut scenario));

        test_scenario::return_to_address(LENDER, lender_pos);
        test_scenario::return_shared(vault_obj);
    };

    // Second liquidation attempt → should fail (already liquidated)
    test_scenario::next_tx(&mut scenario, STRANGER);
    {
        let mut vault_obj = test_scenario::take_shared<CollateralVault<WSUI>>(&scenario);
        let lender_pos = test_scenario::take_from_address<LoanPosition>(&scenario, LENDER);
        let loan_id = position::loan_id(&lender_pos);

        liquidation::liquidate<WSUI>(&mut vault_obj, loan_id, &clock, test_scenario::ctx(&mut scenario));

        test_scenario::return_to_address(LENDER, lender_pos);
        test_scenario::return_shared(vault_obj);
    };

    clock::destroy_for_testing(clock);
    test_scenario::end(scenario);
}
