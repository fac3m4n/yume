/**
 * Yume Protocol — PTB Builder Functions
 *
 * Pure functions that construct Programmable Transaction Blocks (PTBs)
 * for interacting with the Yume Move contracts.
 *
 * Each function returns a `Transaction` object ready to be signed
 * and executed via dAppKit's `useSignAndExecuteTransaction()`.
 *
 * @example
 * ```tsx
 * import { buildPlaceLendOrder } from '@/hooks/sui/transactions';
 * import { useSignAndExecuteTransaction } from '@mysten/dapp-kit-react';
 *
 * function LendButton() {
 *   const { mutate: signAndExecute } = useSignAndExecuteTransaction();
 *   const handleLend = () => {
 *     const tx = buildPlaceLendOrder({ ... });
 *     signAndExecute({ transaction: tx });
 *   };
 *   return <button onClick={handleLend}>Lend</button>;
 * }
 * ```
 */

import { Transaction } from "@mysten/sui/transactions";
import {
  BPS_DENOMINATOR,
  type MarketTypeArgs,
  PACKAGE_ID,
  SUI_CLOCK_ID,
} from "./types";

// ============================================================
// Market Administration
// ============================================================

interface CreateMarketParams {
  durationBucket: number;
  riskTier: number;
  maxLtvBps: number;
}

/**
 * Build a PTB to create a new lending market (OrderBook + CollateralVault).
 */
export function buildCreateMarket(
  params: CreateMarketParams,
  typeArgs: MarketTypeArgs
): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::market::create_market`,
    typeArguments: [typeArgs.base, typeArgs.collateral],
    arguments: [
      tx.pure.u64(params.durationBucket),
      tx.pure.u8(params.riskTier),
      tx.pure.u64(params.maxLtvBps),
    ],
  });

  return tx;
}

// ============================================================
// Order Placement
// ============================================================

interface PlaceLendOrderParams {
  /** OrderBook shared object ID */
  bookId: string;
  /** Object ID of the Coin<BASE> to deposit */
  depositCoinId: string;
  /** Interest rate in basis points */
  rate: number;
}

/**
 * Build a PTB to place a lend order with a Coin<BASE> deposit.
 *
 * The lender's coin is locked in the OrderBook until the order is
 * matched and settled, or cancelled (which refunds the coin).
 */
export function buildPlaceLendOrder(
  params: PlaceLendOrderParams,
  typeArgs: MarketTypeArgs
): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::market::place_lend_order`,
    typeArguments: [typeArgs.base, typeArgs.collateral],
    arguments: [
      tx.object(params.bookId),
      tx.object(params.depositCoinId),
      tx.pure.u64(params.rate),
      tx.object(SUI_CLOCK_ID),
    ],
  });

  return tx;
}

interface PlaceLendOrderSplitParams {
  /** OrderBook shared object ID */
  bookId: string;
  /** Object ID of the source Coin<BASE> to split from */
  sourceCoinId: string;
  /** Amount to deposit (will be split from the source coin) */
  amount: bigint;
  /** Interest rate in basis points */
  rate: number;
}

/**
 * Build a PTB to place a lend order, splitting the deposit from a larger coin.
 *
 * Useful when the lender has a single large coin and wants to deposit
 * only a portion of it.
 */
export function buildPlaceLendOrderSplit(
  params: PlaceLendOrderSplitParams,
  typeArgs: MarketTypeArgs
): Transaction {
  const tx = new Transaction();

  // Split the exact deposit amount from the source coin
  const [depositCoin] = tx.splitCoins(tx.object(params.sourceCoinId), [
    tx.pure.u64(params.amount),
  ]);

  tx.moveCall({
    target: `${PACKAGE_ID}::market::place_lend_order`,
    typeArguments: [typeArgs.base, typeArgs.collateral],
    arguments: [
      tx.object(params.bookId),
      depositCoin,
      tx.pure.u64(params.rate),
      tx.object(SUI_CLOCK_ID),
    ],
  });

  return tx;
}

interface PlaceBorrowOrderParams {
  /** OrderBook shared object ID */
  bookId: string;
  /** Amount to borrow in base asset units */
  amount: bigint;
  /** Maximum interest rate willing to pay (basis points) */
  rate: number;
}

/**
 * Build a PTB to place a borrow order (no deposit required).
 *
 * The borrower specifies how much they want to borrow and their
 * maximum acceptable interest rate. Collateral is provided later
 * during settlement.
 */
export function buildPlaceBorrowOrder(
  params: PlaceBorrowOrderParams,
  typeArgs: MarketTypeArgs
): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::market::place_borrow_order`,
    typeArguments: [typeArgs.base, typeArgs.collateral],
    arguments: [
      tx.object(params.bookId),
      tx.pure.u64(params.amount),
      tx.pure.u64(params.rate),
      tx.object(SUI_CLOCK_ID),
    ],
  });

  return tx;
}

// ============================================================
// Order Cancellation
// ============================================================

interface CancelOrderParams {
  /** OrderBook shared object ID */
  bookId: string;
  /** Sequential order ID to cancel */
  orderId: number;
}

/**
 * Build a PTB to cancel an order.
 *
 * If the order is a lend order, the deposited Coin<BASE> is
 * automatically refunded to the caller.
 */
export function buildCancelOrder(
  params: CancelOrderParams,
  typeArgs: MarketTypeArgs
): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::market::cancel_order`,
    typeArguments: [typeArgs.base, typeArgs.collateral],
    arguments: [tx.object(params.bookId), tx.pure.u64(params.orderId)],
  });

  return tx;
}

// ============================================================
// Match + Settle (Hot Potato Flow)
// ============================================================

interface SettleParams {
  /** OrderBook shared object ID */
  bookId: string;
  /** CollateralVault shared object ID */
  vaultId: string;
  /** Taker order ID */
  takerOrderId: number;
  /** Maker order ID */
  makerOrderId: number;
  /** Object ID of the Coin<COLLATERAL> for the borrower's collateral */
  collateralCoinId: string;
}

/**
 * Build a PTB for the full match + settle Hot Potato flow.
 *
 * This constructs two atomic commands in one PTB:
 * 1. `match_orders()` → returns MatchReceipt (Hot Potato)
 * 2. `settle()` → consumes MatchReceipt, transfers coins, creates positions
 *
 * The MatchReceipt CANNOT be dropped — if settle fails, the entire
 * PTB reverts, providing mathematical certainty of atomic settlement.
 */
export function buildMatchAndSettle(
  params: SettleParams,
  typeArgs: MarketTypeArgs
): Transaction {
  const tx = new Transaction();

  // Command 1: Match orders → MatchReceipt (Hot Potato)
  const [receipt] = tx.moveCall({
    target: `${PACKAGE_ID}::market::match_orders`,
    typeArguments: [typeArgs.base, typeArgs.collateral],
    arguments: [
      tx.object(params.bookId),
      tx.pure.u64(params.takerOrderId),
      tx.pure.u64(params.makerOrderId),
      tx.object(SUI_CLOCK_ID),
    ],
  });

  // Command 2: Settle → consumes Hot Potato, transfers coins, creates positions
  tx.moveCall({
    target: `${PACKAGE_ID}::market::settle`,
    typeArguments: [typeArgs.base, typeArgs.collateral],
    arguments: [
      receipt,
      tx.object(params.collateralCoinId),
      tx.object(params.bookId),
      tx.object(params.vaultId),
      tx.object(SUI_CLOCK_ID),
    ],
  });

  return tx;
}

interface SettleSplitParams {
  /** OrderBook shared object ID */
  bookId: string;
  /** CollateralVault shared object ID */
  vaultId: string;
  /** Taker order ID */
  takerOrderId: number;
  /** Maker order ID */
  makerOrderId: number;
  /** Source Coin<COLLATERAL> to split from */
  sourceCollateralCoinId: string;
  /** Exact collateral amount to split */
  collateralAmount: bigint;
}

/**
 * Build a PTB for match + settle, splitting collateral from a larger coin.
 *
 * Similar to `buildMatchAndSettle`, but splits the exact collateral
 * amount from a larger source coin. Useful when the borrower's coin
 * is larger than the required collateral.
 */
export function buildMatchAndSettleSplit(
  params: SettleSplitParams,
  typeArgs: MarketTypeArgs
): Transaction {
  const tx = new Transaction();

  // Split exact collateral from source
  const [collateralCoin] = tx.splitCoins(
    tx.object(params.sourceCollateralCoinId),
    [tx.pure.u64(params.collateralAmount)]
  );

  // Command 1: Match orders → MatchReceipt
  const [receipt] = tx.moveCall({
    target: `${PACKAGE_ID}::market::match_orders`,
    typeArguments: [typeArgs.base, typeArgs.collateral],
    arguments: [
      tx.object(params.bookId),
      tx.pure.u64(params.takerOrderId),
      tx.pure.u64(params.makerOrderId),
      tx.object(SUI_CLOCK_ID),
    ],
  });

  // Command 2: Settle → consumes Hot Potato
  tx.moveCall({
    target: `${PACKAGE_ID}::market::settle`,
    typeArguments: [typeArgs.base, typeArgs.collateral],
    arguments: [
      receipt,
      collateralCoin,
      tx.object(params.bookId),
      tx.object(params.vaultId),
      tx.object(SUI_CLOCK_ID),
    ],
  });

  return tx;
}

// ============================================================
// Loan Repayment
// ============================================================

interface RepayParams {
  /** Borrower's LoanPosition object ID */
  positionId: string;
  /** CollateralVault shared object ID */
  vaultId: string;
  /** Object ID of the Coin<BASE> for repayment */
  repaymentCoinId: string;
}

/**
 * Build a PTB for loan repayment.
 *
 * The borrower provides their LoanPosition and a Coin<BASE> covering
 * principal + interest. The function:
 * - Transfers repayment to the lender
 * - Returns collateral to the borrower
 * - Updates position status to Repaid
 */
export function buildRepay(
  params: RepayParams,
  typeArgs: MarketTypeArgs
): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::market::repay`,
    typeArguments: [typeArgs.base, typeArgs.collateral],
    arguments: [
      tx.object(params.positionId),
      tx.object(params.repaymentCoinId),
      tx.object(params.vaultId),
      tx.object(SUI_CLOCK_ID),
    ],
  });

  return tx;
}

interface RepayWithAmountParams {
  /** Borrower's LoanPosition object ID */
  positionId: string;
  /** CollateralVault shared object ID */
  vaultId: string;
  /** Source Coin<BASE> to split repayment from */
  sourceCoinId: string;
  /** Principal amount of the loan */
  principal: bigint;
  /** Interest rate in basis points */
  rateBps: number;
}

/**
 * Build a PTB for loan repayment, splitting the exact amount from a larger coin.
 *
 * Calculates total due (principal + interest) and splits that amount
 * from the source coin before calling repay.
 */
export function buildRepayWithAmount(
  params: RepayWithAmountParams,
  typeArgs: MarketTypeArgs
): Transaction {
  const tx = new Transaction();

  // Calculate total due
  const interest =
    (params.principal * BigInt(params.rateBps)) / BigInt(BPS_DENOMINATOR);
  const totalDue = params.principal + interest;

  // Split exact repayment from source coin
  const [repaymentCoin] = tx.splitCoins(tx.object(params.sourceCoinId), [
    tx.pure.u64(totalDue),
  ]);

  tx.moveCall({
    target: `${PACKAGE_ID}::market::repay`,
    typeArguments: [typeArgs.base, typeArgs.collateral],
    arguments: [
      tx.object(params.positionId),
      repaymentCoin,
      tx.object(params.vaultId),
      tx.object(SUI_CLOCK_ID),
    ],
  });

  return tx;
}

// ============================================================
// Liquidation
// ============================================================

/**
 * Builds a PTB that liquidates an expired loan.
 * Anyone can call this — permissionless (keeper/liquidator).
 *
 * Checks in the contract:
 * 1. Collateral still exists for loan_id (not already liquidated/repaid)
 * 2. Clock timestamp > loan maturity time
 *
 * On success: collateral transferred to lender as compensation.
 */
export function buildLiquidate(params: {
  vaultId: string;
  loanId: string;
  typeArgs: MarketTypeArgs;
}): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::liquidation::liquidate`,
    typeArguments: [params.typeArgs.collateral],
    arguments: [
      tx.object(params.vaultId),
      tx.pure.id(params.loanId),
      tx.object(SUI_CLOCK_ID),
    ],
  });

  return tx;
}

// ============================================================
// One-Click Leverage (PTB Composability Demo)
// ============================================================

/**
 * Builds the "One-Click Leverage" PTB that demonstrates Sui's
 * composability by chaining multiple operations atomically:
 *
 *   Deposit Collateral → Match Borrow → Settle → (Swap → Loop)
 *
 * This is a demo builder showing how the PTB would be constructed.
 * Full execution requires deployed contracts + DeepBook pool liquidity.
 *
 * @param params.bookId - OrderBook shared object ID
 * @param params.vaultId - CollateralVault shared object ID
 * @param params.collateralCoinId - User's initial collateral coin
 * @param params.lendOrderId - Existing lend order to match against
 * @param params.borrowRate - Rate for the borrow order (bps)
 * @param params.borrowAmount - Amount to borrow
 * @param params.typeArgs - BASE and COLLATERAL type arguments
 */
export function buildLeverageDemo(params: {
  bookId: string;
  vaultId: string;
  collateralCoinId: string;
  lendOrderId: number;
  borrowRate: number;
  borrowAmount: number;
  typeArgs: MarketTypeArgs;
}): Transaction {
  const tx = new Transaction();

  // Step 1: Place a borrow order on the order book
  tx.moveCall({
    target: `${PACKAGE_ID}::market::place_borrow_order`,
    typeArguments: [params.typeArgs.base, params.typeArgs.collateral],
    arguments: [
      tx.object(params.bookId),
      tx.pure.u64(params.borrowAmount),
      tx.pure.u64(params.borrowRate),
      tx.object(SUI_CLOCK_ID),
    ],
  });

  // Step 2: Match the borrow order against the existing lend order
  // (returns a MatchReceipt — Hot Potato that must be consumed in Step 3)
  const receipt = tx.moveCall({
    target: `${PACKAGE_ID}::market::match_orders`,
    typeArguments: [params.typeArgs.base, params.typeArgs.collateral],
    arguments: [
      tx.object(params.bookId),
      tx.pure.u64(params.lendOrderId),
      // Borrow order ID would be dynamically assigned; using 1 for demo
      tx.pure.u64(1),
      tx.object(SUI_CLOCK_ID),
    ],
  });

  // Step 3: Settle the match — consumes the Hot Potato MatchReceipt
  // Deposits collateral into the vault, transfers principal to borrower
  tx.moveCall({
    target: `${PACKAGE_ID}::market::settle`,
    typeArguments: [params.typeArgs.base, params.typeArgs.collateral],
    arguments: [
      receipt,
      tx.object(params.collateralCoinId),
      tx.object(params.bookId),
      tx.object(params.vaultId),
      tx.object(SUI_CLOCK_ID),
    ],
  });

  // Note: In a full leverage loop, Steps 4-6 would be:
  // Step 4: Swap received BASE tokens for COLLATERAL on DeepBook
  //   tx.moveCall({ target: `deepbook::place_market_order`, ... })
  // Step 5: Deposit new COLLATERAL and borrow more BASE
  //   (repeat Steps 1-3 with the new collateral)
  // Step 6: Final position = ~1.9x leverage on initial collateral

  return tx;
}

// ============================================================
// Pool Operations (Phase 4 — Hybrid Pools)
// ============================================================

/**
 * Builds a PTB that creates a new Hybrid Liquidity Pool
 * for an existing OrderBook market.
 */
export function buildCreatePool(params: {
  bookId: string;
  minRate: number;
  maxRate: number;
  numBuckets: number;
  typeArgs: MarketTypeArgs;
}): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::market::create_pool`,
    typeArguments: [params.typeArgs.base, params.typeArgs.collateral],
    arguments: [
      tx.object(params.bookId),
      tx.pure.u64(params.minRate),
      tx.pure.u64(params.maxRate),
      tx.pure.u64(params.numBuckets),
    ],
  });

  return tx;
}

/**
 * Builds a PTB that deposits BASE tokens into a liquidity pool.
 * LP receives shares proportional to their deposit vs pool value.
 */
export function buildPoolDeposit(params: {
  poolId: string;
  depositCoinId: string;
  typeArgs: MarketTypeArgs;
}): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::pool::deposit`,
    typeArguments: [params.typeArgs.base],
    arguments: [tx.object(params.poolId), tx.object(params.depositCoinId)],
  });

  return tx;
}

/**
 * Builds a PTB that deposits a specific amount by splitting from a source coin.
 */
export function buildPoolDepositSplit(params: {
  poolId: string;
  sourceCoinId: string;
  amount: number;
  typeArgs: MarketTypeArgs;
}): Transaction {
  const tx = new Transaction();

  const [depositCoin] = tx.splitCoins(tx.object(params.sourceCoinId), [
    tx.pure.u64(params.amount),
  ]);

  tx.moveCall({
    target: `${PACKAGE_ID}::pool::deposit`,
    typeArguments: [params.typeArgs.base],
    arguments: [tx.object(params.poolId), depositCoin],
  });

  return tx;
}

/**
 * Builds a PTB that withdraws from a liquidity pool by burning LP shares.
 * Returns pro-rata share of available (undeployed) balance.
 */
export function buildPoolWithdraw(params: {
  poolId: string;
  sharesToBurn: number;
  typeArgs: MarketTypeArgs;
}): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::pool::withdraw`,
    typeArguments: [params.typeArgs.base],
    arguments: [tx.object(params.poolId), tx.pure.u64(params.sharesToBurn)],
  });

  return tx;
}

/**
 * Builds a PTB that rebalances a pool's order book positions.
 * Admin-only: cancels existing orders, recovers deposits,
 * and places new orders using the linear rate curve.
 */
export function buildRebalancePool(params: {
  poolId: string;
  bookId: string;
  typeArgs: MarketTypeArgs;
}): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::market::rebalance_pool`,
    typeArguments: [params.typeArgs.base, params.typeArgs.collateral],
    arguments: [
      tx.object(params.poolId),
      tx.object(params.bookId),
      tx.object(SUI_CLOCK_ID),
    ],
  });

  return tx;
}
