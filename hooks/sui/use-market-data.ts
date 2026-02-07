"use client";

/**
 * Yume Protocol — Market Data Hooks
 *
 * Provides mock data for the demo and type-safe hooks for
 * fetching on-chain order book state and user positions.
 *
 * Mock data is used until contracts are deployed to testnet.
 * The hooks follow the same interface as real on-chain queries.
 */

import { useMemo, useState } from "react";
import type { LoanPosition, Order } from "./types";
import {
  DURATION_7_DAY,
  ORDER_SIDE_BORROW,
  ORDER_SIDE_LEND,
  STATUS_ACTIVE,
} from "./types";

// ============================================================
// Mock Data — Order Book
// ============================================================

const MOCK_ASKS: Order[] = [
  {
    orderId: 0,
    owner: "0xaa...1111",
    side: ORDER_SIDE_LEND,
    amount: BigInt(100_000),
    rate: 500,
    timestamp: Date.now(),
    isActive: true,
  },
  {
    orderId: 2,
    owner: "0xbb...2222",
    side: ORDER_SIDE_LEND,
    amount: BigInt(75_000),
    rate: 525,
    timestamp: Date.now(),
    isActive: true,
  },
  {
    orderId: 4,
    owner: "0xcc...3333",
    side: ORDER_SIDE_LEND,
    amount: BigInt(250_000),
    rate: 550,
    timestamp: Date.now(),
    isActive: true,
  },
  {
    orderId: 6,
    owner: "0xdd...4444",
    side: ORDER_SIDE_LEND,
    amount: BigInt(50_000),
    rate: 600,
    timestamp: Date.now(),
    isActive: true,
  },
  {
    orderId: 8,
    owner: "0xee...5555",
    side: ORDER_SIDE_LEND,
    amount: BigInt(120_000),
    rate: 650,
    timestamp: Date.now(),
    isActive: true,
  },
];

const MOCK_BIDS: Order[] = [
  {
    orderId: 1,
    owner: "0xff...6666",
    side: ORDER_SIDE_BORROW,
    amount: BigInt(80_000),
    rate: 475,
    timestamp: Date.now(),
    isActive: true,
  },
  {
    orderId: 3,
    owner: "0x11...7777",
    side: ORDER_SIDE_BORROW,
    amount: BigInt(150_000),
    rate: 450,
    timestamp: Date.now(),
    isActive: true,
  },
  {
    orderId: 5,
    owner: "0x22...8888",
    side: ORDER_SIDE_BORROW,
    amount: BigInt(60_000),
    rate: 400,
    timestamp: Date.now(),
    isActive: true,
  },
  {
    orderId: 7,
    owner: "0x33...9999",
    side: ORDER_SIDE_BORROW,
    amount: BigInt(200_000),
    rate: 350,
    timestamp: Date.now(),
    isActive: true,
  },
  {
    orderId: 9,
    owner: "0x44...aaaa",
    side: ORDER_SIDE_BORROW,
    amount: BigInt(30_000),
    rate: 300,
    timestamp: Date.now(),
    isActive: true,
  },
];

const MOCK_POSITIONS: LoanPosition[] = [
  {
    id: "0xpos1",
    loanId: "0xloan1",
    side: ORDER_SIDE_LEND,
    lender: "0xYOU",
    borrower: "0xff...6666",
    principal: BigInt(50_000),
    rate: 500,
    duration: DURATION_7_DAY,
    collateralAmount: BigInt(55_555),
    startTime: Date.now() - 86_400_000,
    maturityTime: Date.now() + 518_400_000,
    status: STATUS_ACTIVE,
    bookId: "0xbook1",
  },
  {
    id: "0xpos2",
    loanId: "0xloan2",
    side: ORDER_SIDE_BORROW,
    lender: "0xbb...2222",
    borrower: "0xYOU",
    principal: BigInt(30_000),
    rate: 525,
    duration: DURATION_7_DAY,
    collateralAmount: BigInt(33_333),
    startTime: Date.now() - 172_800_000,
    maturityTime: Date.now() + 432_000_000,
    status: STATUS_ACTIVE,
    bookId: "0xbook1",
  },
];

// ============================================================
// Hooks
// ============================================================

/** Returns mock order book data (asks sorted by rate asc, bids by rate desc) */
export function useOrderBook() {
  const asks = useMemo(
    () => [...MOCK_ASKS].sort((a, b) => a.rate - b.rate),
    []
  );
  const bids = useMemo(
    () => [...MOCK_BIDS].sort((a, b) => b.rate - a.rate),
    []
  );

  const spread =
    asks.length > 0 && bids.length > 0 ? asks[0].rate - bids[0].rate : 0;

  const totalAskVolume = asks.reduce((sum, o) => sum + o.amount, BigInt(0));
  const totalBidVolume = bids.reduce((sum, o) => sum + o.amount, BigInt(0));

  return { asks, bids, spread, totalAskVolume, totalBidVolume };
}

/** Returns mock user positions */
export function usePositions() {
  const [positions] = useState<LoanPosition[]>(MOCK_POSITIONS);
  return { positions };
}

/** Returns market-level statistics */
export function useMarketStats() {
  return {
    tvl: "$595,000",
    activeOrders: 10,
    activeLoans: 2,
    bestAskRate: "5.00%",
    bestBidRate: "4.75%",
    spread: "0.25%",
    market: "USDC / SUI",
    duration: "7 Day",
    riskTier: "Tier A",
    maxLtv: "90%",
  };
}
