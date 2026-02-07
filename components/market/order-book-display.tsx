"use client";

import { bpsToPercent } from "@/hooks/sui/types";
import { useOrderBook } from "@/hooks/sui/use-market-data";

function formatAmount(amount: bigint): string {
  return Number(amount).toLocaleString();
}

export function OrderBookDisplay() {
  const { asks, bids, spread } = useOrderBook();

  return (
    <div className="flex flex-col gap-0">
      {/* Header */}
      <div className="grid grid-cols-3 gap-2 border-b px-3 py-2 font-medium text-muted-foreground text-xs">
        <span>Rate</span>
        <span className="text-right">Amount (USDC)</span>
        <span className="text-right">Total</span>
      </div>

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
          {bpsToPercent(spread)}
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
    </div>
  );
}
