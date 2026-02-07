"use client";

/**
 * Yume Protocol — Market Data Hooks (Real On-Chain Queries)
 *
 * All hooks accept a MarketConfig to support multi-market switching.
 * Falls back to the market context if no explicit config is provided.
 */

import { useCurrentAccount, useCurrentClient } from "@mysten/dapp-kit-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { LoanPosition, MarketConfig, Order, PoolState } from "./types";
import {
  bpsToPercent,
  DURATION_LABELS,
  ORDER_SIDE_LEND,
  PACKAGE_ID,
  RISK_TIER_LABELS,
} from "./types";
import { useMarket } from "./use-market-context";

// ============================================================
// Helpers
// ============================================================

/** Format smallest-unit values for display based on decimals */
export function formatTokenAmount(
  raw: bigint | number | string,
  decimals: number
): string {
  const val = typeof raw === "bigint" ? raw : BigInt(String(raw));
  const divisor = BigInt(10 ** decimals);
  const whole = val / divisor;
  const frac = val % divisor;
  const fracStr = frac.toString().padStart(decimals, "0").slice(0, 4);
  return `${whole}.${fracStr}`;
}

/** Legacy helper: format MIST to SUI */
export function mistToSui(mist: bigint | number | string): string {
  return formatTokenAmount(mist, 9);
}

// ============================================================
// useOrderBook — Read orders from on-chain Table dynamic fields
// ============================================================

export function useOrderBook(
  explicitMarket?: MarketConfig,
  refreshInterval = 15_000
) {
  const { market: ctxMarket } = useMarket();
  const market = explicitMarket ?? ctxMarket;

  const client = useCurrentClient();
  const [asks, setAsks] = useState<Order[]>([]);
  const [bids, setBids] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderbookId = market.orderbookId;

  const fetchOrderBook = useCallback(async () => {
    if (!(PACKAGE_ID && orderbookId && client)) return;
    try {
      const bookObj = await client.getObject({
        objectId: orderbookId,
        include: { json: true },
      });

      const bookJson = bookObj.object?.json as Record<string, unknown> | null;
      const nextOrderId = bookJson ? Number(bookJson.next_order_id ?? 0) : 0;

      if (nextOrderId === 0) {
        setAsks([]);
        setBids([]);
        setLoading(false);
        return;
      }

      const tableId = bookJson?.orders as { id: string } | string | undefined;
      let ordersTableId: string | null = null;
      if (typeof tableId === "object" && tableId !== null && "id" in tableId) {
        ordersTableId = tableId.id;
      } else if (typeof tableId === "string") {
        ordersTableId = tableId;
      }

      const parentId = ordersTableId ?? orderbookId;

      const newAsks: Order[] = [];
      const newBids: Order[] = [];
      let cursor: string | null = null;
      let hasMore = true;

      while (hasMore) {
        const page = await client.listDynamicFields({
          parentId,
          limit: 50,
          cursor,
        });

        for (const df of page.dynamicFields) {
          try {
            const fieldObj = await client.getObject({
              objectId: df.fieldId,
              include: { json: true },
            });

            const fieldJson = fieldObj.object?.json as Record<
              string,
              unknown
            > | null;
            if (!fieldJson) continue;

            const orderData = fieldJson.value as Record<string, unknown> | null;
            if (!orderData) continue;

            const order: Order = {
              orderId: Number(orderData.order_id ?? 0),
              owner: String(orderData.owner ?? ""),
              side: Number(orderData.side ?? 0),
              amount: BigInt(String(orderData.amount ?? "0")),
              rate: Number(orderData.rate ?? 0),
              timestamp: Number(orderData.timestamp ?? 0),
              isActive: Boolean(orderData.is_active),
            };

            if (!order.isActive) continue;

            if (order.side === ORDER_SIDE_LEND) {
              newAsks.push(order);
            } else {
              newBids.push(order);
            }
          } catch {}
        }

        hasMore = page.hasNextPage;
        cursor = page.cursor;
      }

      newAsks.sort((a, b) => a.rate - b.rate);
      newBids.sort((a, b) => b.rate - a.rate);

      setAsks(newAsks);
      setBids(newBids);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch order book:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch order book"
      );
    } finally {
      setLoading(false);
    }
  }, [client, orderbookId]);

  useEffect(() => {
    setLoading(true);
    fetchOrderBook();
    const interval = setInterval(fetchOrderBook, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchOrderBook, refreshInterval]);

  const spread =
    asks.length > 0 && bids.length > 0 ? asks[0].rate - bids[0].rate : 0;
  const totalAskVolume = asks.reduce((sum, o) => sum + o.amount, BigInt(0));
  const totalBidVolume = bids.reduce((sum, o) => sum + o.amount, BigInt(0));

  return {
    asks,
    bids,
    spread,
    totalAskVolume,
    totalBidVolume,
    loading,
    error,
    refetch: fetchOrderBook,
  };
}

// ============================================================
// useUserOrders — Filter order book for connected wallet
// ============================================================

export function useUserOrders(explicitMarket?: MarketConfig) {
  const account = useCurrentAccount();
  const { asks, bids, loading, error, refetch } = useOrderBook(explicitMarket);

  const userOrders = useMemo(() => {
    if (!account?.address) return [];
    return [...asks, ...bids].filter((o) => o.owner === account.address);
  }, [asks, bids, account?.address]);

  return { orders: userOrders, loading, error, refetch };
}

// ============================================================
// usePositions — Query owned LoanPosition NFTs
// ============================================================

export function usePositions(explicitMarket?: MarketConfig) {
  const { market: ctxMarket } = useMarket();
  const market = explicitMarket ?? ctxMarket;

  const client = useCurrentClient();
  const account = useCurrentAccount();
  const [positions, setPositions] = useState<LoanPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPositions = useCallback(async () => {
    if (!(client && account?.address && PACKAGE_ID)) {
      setPositions([]);
      setLoading(false);
      return;
    }

    try {
      const positionType = `${PACKAGE_ID}::position::LoanPosition`;

      const result = await client.listOwnedObjects({
        owner: account.address,
        type: positionType,
        include: { json: true },
      });

      const parsed: LoanPosition[] = [];
      for (const obj of result.objects) {
        const json = obj.json as Record<string, unknown> | null;
        if (!json) continue;

        const pos: LoanPosition = {
          id: obj.objectId,
          loanId: String(json.loan_id ?? ""),
          side: Number(json.side ?? 0),
          lender: String(json.lender ?? ""),
          borrower: String(json.borrower ?? ""),
          principal: BigInt(String(json.principal ?? "0")),
          rate: Number(json.rate ?? 0),
          duration: Number(json.duration ?? 0),
          collateralAmount: BigInt(String(json.collateral_amount ?? "0")),
          startTime: Number(json.start_time ?? 0),
          maturityTime: Number(json.maturity_time ?? 0),
          status: Number(json.status ?? 0),
          bookId: String(json.book_id ?? ""),
        };

        // Filter by current market's orderbook
        if (pos.bookId === market.orderbookId || !market.orderbookId) {
          parsed.push(pos);
        }
      }

      setPositions(parsed);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch positions:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch positions"
      );
    } finally {
      setLoading(false);
    }
  }, [client, account?.address, market.orderbookId]);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  return { positions, loading, error, refetch: fetchPositions };
}

// ============================================================
// useAllPositions — All positions across all markets
// ============================================================

export function useAllPositions() {
  const client = useCurrentClient();
  const account = useCurrentAccount();
  const [positions, setPositions] = useState<LoanPosition[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!(client && account?.address && PACKAGE_ID)) {
      setPositions([]);
      setLoading(false);
      return;
    }

    try {
      const positionType = `${PACKAGE_ID}::position::LoanPosition`;
      const result = await client.listOwnedObjects({
        owner: account.address,
        type: positionType,
        include: { json: true },
      });

      const parsed: LoanPosition[] = [];
      for (const obj of result.objects) {
        const json = obj.json as Record<string, unknown> | null;
        if (!json) continue;
        parsed.push({
          id: obj.objectId,
          loanId: String(json.loan_id ?? ""),
          side: Number(json.side ?? 0),
          lender: String(json.lender ?? ""),
          borrower: String(json.borrower ?? ""),
          principal: BigInt(String(json.principal ?? "0")),
          rate: Number(json.rate ?? 0),
          duration: Number(json.duration ?? 0),
          collateralAmount: BigInt(String(json.collateral_amount ?? "0")),
          startTime: Number(json.start_time ?? 0),
          maturityTime: Number(json.maturity_time ?? 0),
          status: Number(json.status ?? 0),
          bookId: String(json.book_id ?? ""),
        });
      }

      setPositions(parsed);
    } catch (err) {
      console.error("Failed to fetch all positions:", err);
    } finally {
      setLoading(false);
    }
  }, [client, account?.address]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { positions, loading, refetch: fetchAll };
}

// ============================================================
// usePoolState — Read LiquidityPool shared object
// ============================================================

export function usePoolState(explicitMarket?: MarketConfig) {
  const { market: ctxMarket } = useMarket();
  const market = explicitMarket ?? ctxMarket;

  const client = useCurrentClient();
  const [pool, setPool] = useState<PoolState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const poolId = market.poolId;

  const fetchPool = useCallback(async () => {
    if (!(client && poolId)) {
      setPool(null);
      setLoading(false);
      return;
    }

    try {
      const result = await client.getObject({
        objectId: poolId,
        include: { json: true },
      });

      const json = result.object?.json as Record<string, unknown> | null;
      if (!json) {
        setPool(null);
        return;
      }

      let availableBalance = BigInt(0);
      try {
        const dfList = await client.listDynamicFields({ parentId: poolId });
        for (const df of dfList.dynamicFields) {
          if (
            df.type.includes("BalanceKey") ||
            df.valueType.includes("Balance")
          ) {
            const fieldObj = await client.getObject({
              objectId: df.fieldId,
              include: { json: true },
            });
            const fieldJson = fieldObj.object?.json as Record<
              string,
              unknown
            > | null;
            if (fieldJson?.value !== undefined) {
              const val = fieldJson.value;
              if (typeof val === "object" && val !== null && "value" in val) {
                availableBalance = BigInt(
                  String((val as Record<string, unknown>).value ?? "0")
                );
              } else {
                availableBalance = BigInt(String(val ?? "0"));
              }
            }
          }
        }
      } catch {
        /* fallback */
      }

      setPool({
        id: poolId,
        admin: String(json.admin ?? ""),
        bookId: String(json.book_id ?? ""),
        totalShares: BigInt(String(json.total_shares ?? "0")),
        availableBalance,
        deployedBalance: BigInt(String(json.deployed_balance ?? "0")),
        minRate: Number(json.min_rate ?? 0),
        maxRate: Number(json.max_rate ?? 0),
        numBuckets: Number(json.num_buckets ?? 0),
        isActive: Boolean(json.is_active),
      });
      setError(null);
    } catch (err) {
      console.error("Failed to fetch pool:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch pool");
    } finally {
      setLoading(false);
    }
  }, [client, poolId]);

  useEffect(() => {
    fetchPool();
  }, [fetchPool]);

  return { pool, loading, error, refetch: fetchPool };
}

// ============================================================
// useMarketStats — Computed from live data + current market
// ============================================================

export function useMarketStats() {
  const { market } = useMarket();
  const {
    asks,
    bids,
    spread,
    totalAskVolume,
    totalBidVolume,
    loading: obLoading,
  } = useOrderBook();
  const { pool, loading: poolLoading } = usePoolState();

  const loading = obLoading || poolLoading;

  const tvl = useMemo(() => {
    const total =
      totalAskVolume +
      totalBidVolume +
      (pool?.availableBalance ?? BigInt(0)) +
      (pool?.deployedBalance ?? BigInt(0));
    return `${formatTokenAmount(total, market.baseDecimals)} ${market.baseSymbol}`;
  }, [
    totalAskVolume,
    totalBidVolume,
    pool,
    market.baseDecimals,
    market.baseSymbol,
  ]);

  return {
    tvl,
    activeOrders: asks.length + bids.length,
    activeLoans: 0,
    bestAskRate: asks.length > 0 ? bpsToPercent(asks[0].rate) : "—",
    bestBidRate: bids.length > 0 ? bpsToPercent(bids[0].rate) : "—",
    spread: spread > 0 ? bpsToPercent(spread) : "—",
    market: market.label,
    duration: DURATION_LABELS[market.duration] ?? `${market.duration}s`,
    riskTier: RISK_TIER_LABELS[market.riskTier] ?? "Unknown",
    maxLtv: `${(market.maxLtvBps / 100).toFixed(0)}%`,
    loading,
  };
}
