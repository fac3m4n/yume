"use client";

import { bpsToPercent } from "@/hooks/sui/types";
import { mistToSui, useOrderBook } from "@/hooks/sui/use-market-data";

function formatAmount(amount: bigint): string {
  return mistToSui(amount);
}

export function OrderBookDisplay() {
  const { asks, bids, spread, loading, error } = useOrderBook();

  if (loading) {
    return (
      <div className="flex flex-col gap-0">
        <div className="grid grid-cols-3 gap-2 border-b px-3 py-2 font-medium text-muted-foreground text-xs">
          <span>Rate</span>
          <span className="text-right">Amount (SUI)</span>
          <span className="text-right">Total</span>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Loading order book...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-destructive text-sm">{error}</p>
      </div>
    );
  }

  const isEmpty = asks.length === 0 && bids.length === 0;

  return (
    <div className="flex flex-col gap-0">
      {/* Header */}
      <div className="grid grid-cols-3 gap-2 border-b px-3 py-2 font-medium text-muted-foreground text-xs">
        <span>Rate</span>
        <span className="text-right">Amount (SUI)</span>
        <span className="text-right">Total</span>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <p className="text-muted-foreground text-sm">
            No orders yet. Be the first to place an order.
          </p>
        </div>
      ) : (
        <>
          {/* Asks (Lend offers) — displayed in reverse so lowest rate is at bottom near spread */}
          <div className="flex flex-col-reverse">
            {asks.map((order) => {
              const cumulative = asks
                .filter((a) => a.rate <= order.rate)
                .reduce((sum, a) => sum + a.amount, BigInt(0));
              return (
                <div
                  className="grid grid-cols-3 gap-2 px-3 py-1.5 text-sm transition-colors hover:bg-muted/50"
                  key={order.orderId}
                >
                  <span className="font-mono text-emerald-600">
                    {bpsToPercent(order.rate)}
                  </span>
                  <span className="text-right font-mono">
                    {formatAmount(order.amount)}
                  </span>
                  <span className="text-right font-mono text-muted-foreground">
                    {formatAmount(cumulative)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Spread indicator */}
          <div className="flex items-center justify-center gap-2 border-y bg-muted/30 py-2">
            <span className="font-medium text-muted-foreground text-xs">
              Spread
            </span>
            <span className="font-mono font-semibold text-sm">
              {spread > 0 ? bpsToPercent(spread) : "—"}
            </span>
          </div>

          {/* Bids (Borrow requests) */}
          <div className="flex flex-col">
            {bids.map((order) => {
              const cumulative = bids
                .filter((b) => b.rate >= order.rate)
                .reduce((sum, b) => sum + b.amount, BigInt(0));
              return (
                <div
                  className="grid grid-cols-3 gap-2 px-3 py-1.5 text-sm transition-colors hover:bg-muted/50"
                  key={order.orderId}
                >
                  <span className="font-mono text-rose-500">
                    {bpsToPercent(order.rate)}
                  </span>
                  <span className="text-right font-mono">
                    {formatAmount(order.amount)}
                  </span>
                  <span className="text-right font-mono text-muted-foreground">
                    {formatAmount(cumulative)}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
