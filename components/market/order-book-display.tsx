"use client";

import { bpsToPercent } from "@/hooks/sui/types";
import { useMarket } from "@/hooks/sui/use-market-context";
import { formatTokenAmount, useOrderBook } from "@/hooks/sui/use-market-data";

export function OrderBookDisplay() {
  const { market } = useMarket();
  const { asks, bids, spread, loading, error } = useOrderBook();
  const sym = market.baseSymbol;
  const dec = market.baseDecimals;

  if (loading) {
    return (
      <div className="flex flex-col gap-0">
        <div className="grid grid-cols-3 gap-2 border-b px-3 py-2 font-medium text-muted-foreground text-xs">
          <span>Rate</span>
          <span className="text-right">Amount ({sym})</span>
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
      <div className="grid grid-cols-3 gap-2 border-b px-3 py-2 font-medium text-muted-foreground text-xs">
        <span>Rate</span>
        <span className="text-right">Amount ({sym})</span>
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
                    {formatTokenAmount(order.amount, dec)}
                  </span>
                  <span className="text-right font-mono text-muted-foreground">
                    {formatTokenAmount(cumulative, dec)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-2 border-y bg-muted/30 py-2">
            <span className="font-medium text-muted-foreground text-xs">
              Spread
            </span>
            <span className="font-mono font-semibold text-sm">
              {spread > 0 ? bpsToPercent(spread) : "—"}
            </span>
          </div>

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
                    {formatTokenAmount(order.amount, dec)}
                  </span>
                  <span className="text-right font-mono text-muted-foreground">
                    {formatTokenAmount(cumulative, dec)}
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
