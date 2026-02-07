"use client";

/**
 * Yume Protocol — Market Data Hooks (Real On-Chain Queries)
 *
 * Fetches order book state by reconstructing from events,
 * user positions from owned objects, and pool/vault state
 * from shared objects.
 *
 * Uses SuiJsonRpcClient for event queries (not available on gRPC)
 * and the gRPC client via dapp-kit for object reads.
 */

import { useCurrentAccount, useCurrentClient } from "@mysten/dapp-kit-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { LoanPosition, Order, PoolState } from "./types";
import {
  bpsToPercent,
  ORDER_SIDE_LEND,
  ORDERBOOK_ID,
  PACKAGE_ID,
  POOL_ID,
} from "./types";

// ============================================================
// Client helper — we use the gRPC client from dapp-kit
// ============================================================

/**
 * Format MIST values to SUI for display (1 SUI = 1e9 MIST)
 */
export function mistToSui(mist: bigint | number | string): string {
  const val = typeof mist === "bigint" ? mist : BigInt(mist);
  const whole = val / BigInt(1e9);
  const frac = val % BigInt(1e9);
  const fracStr = frac.toString().padStart(9, "0").slice(0, 4);
  return `${whole}.${fracStr}`;
}

// ============================================================
// useOrderBook — Reconstruct from on-chain events
// ============================================================

interface OrderPlacedEvent {
  book_id: string;
  order_id: string;
  owner: string;
  side: string;
  amount: string;
  rate: string;
  timestamp: string;
}

interface OrderCancelledEvent {
  book_id: string;
  order_id: string;
  owner: string;
}

interface OrderMatchedEvent {
  book_id: string;
  lend_order_id: string;
  borrow_order_id: string;
  matched_amount: string;
  rate: string;
  lender: string;
  borrower: string;
}

/**
 * Returns live order book data reconstructed from on-chain events.
 * Polls every `refreshInterval` ms (default 15s).
 */
export function useOrderBook(refreshInterval = 15_000) {
  const client = useCurrentClient();
  const [asks, setAsks] = useState<Order[]>([]);
  const [bids, setBids] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderBook = useCallback(async () => {
    if (!(PACKAGE_ID && ORDERBOOK_ID && client)) return;
    try {
      // We reconstruct the book from the OrderBook object's dynamic fields
      // First read the OrderBook top-level to get next_order_id
      const bookObj = await client.getObject({
        objectId: ORDERBOOK_ID,
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

      // Read orders via the Table's dynamic fields
      // The orders Table is stored in the OrderBook's `orders` field
      // We list dynamic fields on the table object ID
      // The table ID is in the `orders` field of the OrderBook
      const tableId = bookJson?.orders as { id: string } | string | undefined;

      let ordersTableId: string | null = null;
      if (typeof tableId === "object" && tableId !== null && "id" in tableId) {
        ordersTableId = tableId.id;
      } else if (typeof tableId === "string") {
        ordersTableId = tableId;
      }

      // Fallback: list dynamic fields directly on the book
      // (Table entries are stored as dynamic fields on the Table UID)
      const parentId = ordersTableId ?? ORDERBOOK_ID;

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

        // Read each dynamic field to get Order data
        for (const df of page.dynamicFields) {
          try {
            const fieldData = await client.getDynamicField({
              parentId,
              name: df.name,
            });

            const value = fieldData.dynamicField?.value;
            if (!value) continue;

            // Parse the BCS or use the raw value
            // The value.type should be the Order struct
            // Try to read via JSON if available
            const orderObj = value as unknown as {
              bcs: Uint8Array;
              type: string;
            };

            // For now, try reading the object with json include
            // Dynamic field values may need BCS parsing
            // Let's try reading the field object with json
            const fieldObj = await client.getObject({
              objectId: df.fieldId,
              include: { json: true },
            });

            const fieldJson = fieldObj.object?.json as Record<
              string,
              unknown
            > | null;
            if (!fieldJson) continue;

            // Dynamic field JSON has { name, value } structure
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

      // Sort: asks by rate ascending, bids by rate descending
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
  }, [client]);

  useEffect(() => {
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
// usePositions — Query owned LoanPosition NFTs
// ============================================================

/**
 * Returns the current user's LoanPosition NFTs.
 */
export function usePositions() {
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
      setError(null);
    } catch (err) {
      console.error("Failed to fetch positions:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch positions"
      );
    } finally {
      setLoading(false);
    }
  }, [client, account?.address]);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  return { positions, loading, error, refetch: fetchPositions };
}

// ============================================================
// usePoolState — Read LiquidityPool shared object
// ============================================================

/**
 * Returns the current state of the Hybrid Liquidity Pool.
 */
export function usePoolState() {
  const client = useCurrentClient();
  const [pool, setPool] = useState<PoolState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPool = useCallback(async () => {
    if (!(client && POOL_ID)) {
      setLoading(false);
      return;
    }

    try {
      const result = await client.getObject({
        objectId: POOL_ID,
        include: { json: true },
      });

      const json = result.object?.json as Record<string, unknown> | null;
      if (!json) {
        setPool(null);
        return;
      }

      // Read the available balance from the dynamic field
      // The BalanceKey{} maps to a Balance<BASE> stored as dynamic field
      let availableBalance = BigInt(0);
      try {
        const dfList = await client.listDynamicFields({
          parentId: POOL_ID,
        });
        // Look for the balance key dynamic field
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
              // Balance<SUI> value is stored as a number or { value: ... }
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
        // Fallback: available balance unknown
      }

      setPool({
        id: POOL_ID,
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
  }, [client]);

  useEffect(() => {
    fetchPool();
  }, [fetchPool]);

  return { pool, loading, error, refetch: fetchPool };
}

// ============================================================
// useMarketStats — Computed from live order book + pool data
// ============================================================

/**
 * Returns market-level statistics computed from real data.
 */
export function useMarketStats() {
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
    return `${mistToSui(total)} SUI`;
  }, [totalAskVolume, totalBidVolume, pool]);

  return {
    tvl,
    activeOrders: asks.length + bids.length,
    activeLoans: 0, // Will be computed from positions count
    bestAskRate: asks.length > 0 ? bpsToPercent(asks[0].rate) : "—",
    bestBidRate: bids.length > 0 ? bpsToPercent(bids[0].rate) : "—",
    spread: spread > 0 ? bpsToPercent(spread) : "—",
    market: "SUI / SUI",
    duration: "7 Day",
    riskTier: "Tier A",
    maxLtv: "90%",
    loading,
  };
}
