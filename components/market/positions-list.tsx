"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  bpsToPercent,
  DURATION_LABELS,
  ORDER_SIDE_LEND,
  STATUS_LABELS,
} from "@/hooks/sui/types";
import { useMarket } from "@/hooks/sui/use-market-context";
import {
  formatTokenAmount,
  usePositions,
  useUserOrders,
} from "@/hooks/sui/use-market-data";
import { useYumeTransactions } from "@/hooks/sui/use-yume-transactions";

type Tab = "orders" | "positions";

function timeRemaining(maturityTime: number): string {
  const now = Date.now();
  const diff = maturityTime - now;
  if (diff <= 0) return "Expired";
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
}

export function PositionsList() {
  const [tab, setTab] = useState<Tab>("orders");
  const { market } = useMarket();
  const sym = market.baseSymbol;
  const dec = market.baseDecimals;

  return (
    <div className="flex flex-col gap-4">
      {/* Tab bar */}
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        <button
          className={`flex-1 rounded-md px-3 py-1.5 font-medium text-sm transition-colors ${
            tab === "orders"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setTab("orders")}
          type="button"
        >
          Your Orders
        </button>
        <button
          className={`flex-1 rounded-md px-3 py-1.5 font-medium text-sm transition-colors ${
            tab === "positions"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setTab("positions")}
          type="button"
        >
          Your Positions
        </button>
      </div>

      {tab === "orders" ? (
        <OrdersTab dec={dec} sym={sym} />
      ) : (
        <PositionsTab dec={dec} sym={sym} />
      )}
    </div>
  );
}

function OrdersTab({ sym, dec }: { sym: string; dec: number }) {
  const { orders, loading, error, refetch } = useUserOrders();
  const { cancelOrder, txState, isConnected } = useYumeTransactions();
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Loading orders...
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground text-sm">
          Connect your wallet to view your orders.
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground text-sm">
          No active orders on this market. Place an order to get started.
        </p>
      </div>
    );
  }

  async function handleCancel(orderId: number) {
    setCancellingId(orderId);
    const digest = await cancelOrder(orderId);
    if (digest) {
      setTimeout(() => refetch(), 2000);
    }
    setCancellingId(null);
  }

  return (
    <div className="flex flex-col gap-2">
      {orders.map((order) => {
        const isLend = order.side === ORDER_SIDE_LEND;
        return (
          <div
            className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/30"
            key={order.orderId}
          >
            <div className="flex items-center gap-3">
              <Badge
                className={isLend ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                variant={isLend ? "default" : "destructive"}
              >
                {isLend ? "Lend" : "Borrow"}
              </Badge>
              <span className="font-mono font-semibold text-sm">
                {formatTokenAmount(order.amount, dec)} {sym}
              </span>
              <span className="text-muted-foreground text-sm">
                @ {bpsToPercent(order.rate)}
              </span>
            </div>
            <Button
              disabled={cancellingId === order.orderId}
              onClick={() => handleCancel(order.orderId)}
              size="sm"
              variant="outline"
            >
              {cancellingId === order.orderId ? "Cancelling..." : "Cancel"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}

function PositionsTab({ sym, dec }: { sym: string; dec: number }) {
  const { positions, loading, error, refetch } = usePositions();
  const { repayLoan, txState, isConnected } = useYumeTransactions();
  const [repayingId, setRepayingId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Loading positions...
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground text-sm">
          Connect your wallet to view positions.
        </p>
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-center">
        <p className="text-muted-foreground text-sm">
          No positions yet. Positions are created when orders are matched and
          settled.
        </p>
      </div>
    );
  }

  async function handleRepay(pos: (typeof positions)[0]) {
    setRepayingId(pos.id);
    const digest = await repayLoan(pos.id, pos.principal, pos.rate);
    if (digest) refetch();
    setRepayingId(null);
  }

  return (
    <div className="flex flex-col gap-3">
      {positions.map((pos) => {
        const isLend = pos.side === 0;
        return (
          <div
            className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/30"
            key={pos.id}
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Badge
                  className={
                    isLend ? "bg-emerald-600 hover:bg-emerald-700" : ""
                  }
                  variant={isLend ? "default" : "destructive"}
                >
                  {isLend ? "Lending" : "Borrowing"}
                </Badge>
                <Badge variant="outline">{STATUS_LABELS[pos.status]}</Badge>
                <Badge variant="secondary">
                  {DURATION_LABELS[pos.duration] ?? `${pos.duration}s`}
                </Badge>
              </div>
              <div className="flex items-baseline gap-4 text-sm">
                <span className="font-mono font-semibold">
                  {formatTokenAmount(pos.principal, dec)} {sym}
                </span>
                <span className="text-muted-foreground">
                  @ {bpsToPercent(pos.rate)}
                </span>
                <span className="text-muted-foreground">
                  {timeRemaining(pos.maturityTime)} remaining
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {!isLend && pos.status === 0 && (
                <Button
                  disabled={repayingId === pos.id}
                  onClick={() => handleRepay(pos)}
                  size="sm"
                  variant="outline"
                >
                  {repayingId === pos.id ? "Repaying..." : "Repay"}
                </Button>
              )}
              <Button
                className="text-xs"
                onClick={() =>
                  window.open(
                    `https://suiscan.xyz/mainnet/object/${pos.id}`,
                    "_blank"
                  )
                }
                size="sm"
                variant="ghost"
              >
                Explorer
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
