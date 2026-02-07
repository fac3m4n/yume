/**
 * Yume Protocol — Contract Types & Constants
 *
 * TypeScript representations of on-chain structs and constants.
 * Used by PTB builder functions and frontend components.
 */

// ============================================================
// Contract Addresses
// ============================================================

/** Deployed package ID (set after deployment) */
export const PACKAGE_ID = process.env.NEXT_PUBLIC_YUME_PACKAGE_ID ?? "";

/** Sui shared Clock object ID */
export const SUI_CLOCK_ID = "0x6";

/** Deployed shared object IDs (set after mainnet deployment) */
export const ORDERBOOK_ID = process.env.NEXT_PUBLIC_ORDERBOOK_ID ?? "";
export const VAULT_ID = process.env.NEXT_PUBLIC_VAULT_ID ?? "";
export const POOL_ID = process.env.NEXT_PUBLIC_POOL_ID ?? "";

/** Fully-qualified SUI coin type */
export const SUI_TYPE = "0x2::sui::SUI";

// ============================================================
// Order Constants
// ============================================================

/** Order side: Lending (offering capital) */
export const ORDER_SIDE_LEND = 0;
/** Order side: Borrowing (requesting capital) */
export const ORDER_SIDE_BORROW = 1;

// ============================================================
// Duration Buckets (seconds)
// ============================================================

/** Open-term (variable rate, callable at any time) */
export const DURATION_OPEN = 0;
/** 7-day fixed term */
export const DURATION_7_DAY = 604_800;
/** 30-day fixed term */
export const DURATION_30_DAY = 2_592_000;
/** 90-day fixed term */
export const DURATION_90_DAY = 7_776_000;

export const DURATION_LABELS: Record<number, string> = {
  [DURATION_OPEN]: "Open",
  [DURATION_7_DAY]: "7 Day",
  [DURATION_30_DAY]: "30 Day",
  [DURATION_90_DAY]: "90 Day",
};

// ============================================================
// Risk Tiers
// ============================================================

/** Risk Tier A: Blue-chip collateral (SUI, USDC). High LTV (90%). */
export const RISK_TIER_A = 0;
/** Risk Tier B: Volatile collateral (meme coins). Low LTV (50%). */
export const RISK_TIER_B = 1;

export const RISK_TIER_LABELS: Record<number, string> = {
  [RISK_TIER_A]: "Tier A",
  [RISK_TIER_B]: "Tier B",
};

// ============================================================
// Position Status
// ============================================================

export const STATUS_ACTIVE = 0;
export const STATUS_REPAID = 1;
export const STATUS_LIQUIDATED = 2;
export const STATUS_DEFAULTED = 3;

export const STATUS_LABELS: Record<number, string> = {
  [STATUS_ACTIVE]: "Active",
  [STATUS_REPAID]: "Repaid",
  [STATUS_LIQUIDATED]: "Liquidated",
  [STATUS_DEFAULTED]: "Defaulted",
};

// ============================================================
// Basis Points
// ============================================================

/** 100% = 10,000 basis points */
export const BPS_DENOMINATOR = 10_000;

/** Convert basis points to percentage string (e.g., 500 → "5.00%") */
export function bpsToPercent(bps: number): string {
  return `${(bps / 100).toFixed(2)}%`;
}

/** Calculate interest amount: principal * rate / BPS_DENOMINATOR */
export function calculateInterest(principal: bigint, rateBps: number): bigint {
  return (principal * BigInt(rateBps)) / BigInt(BPS_DENOMINATOR);
}

// ============================================================
// On-Chain Object Interfaces
// ============================================================

/** Represents a parsed Order from on-chain events */
export interface Order {
  orderId: number;
  owner: string;
  side: number;
  amount: bigint;
  rate: number;
  timestamp: number;
  isActive: boolean;
}

/** Represents a parsed LoanPosition NFT */
export interface LoanPosition {
  id: string;
  loanId: string;
  side: number;
  lender: string;
  borrower: string;
  principal: bigint;
  rate: number;
  duration: number;
  collateralAmount: bigint;
  startTime: number;
  maturityTime: number;
  status: number;
  bookId: string;
}

/** Represents the OrderBook shared object state */
export interface OrderBookState {
  id: string;
  durationBucket: number;
  riskTier: number;
  maxLtvBps: number;
  totalBids: number;
  totalAsks: number;
  isActive: boolean;
}

/** Represents the CollateralVault shared object state */
export interface VaultState {
  id: string;
  activeLoans: number;
  totalLocked: bigint;
}

/** Represents the LiquidityPool shared object state (Phase 4) */
export interface PoolState {
  id: string;
  admin: string;
  bookId: string;
  totalShares: bigint;
  availableBalance: bigint;
  deployedBalance: bigint;
  minRate: number;
  maxRate: number;
  numBuckets: number;
  isActive: boolean;
}

// ============================================================
// Type Argument Helpers
// ============================================================

/** Fully-qualified Move type for a coin (e.g., "0x2::sui::SUI") */
export type CoinType = string;

/** Type arguments for a specific lending market */
export interface MarketTypeArgs {
  base: CoinType;
  collateral: CoinType;
}
