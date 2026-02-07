"use client";

import { useMarketStats } from "@/hooks/sui/use-market-data";

export function MarketStats() {
  const stats = useMarketStats();

  if (stats.loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            className="animate-pulse space-y-2 rounded-lg border p-3"
            key={i}
          >
            <div className="h-3 w-12 rounded bg-muted" />
            <div className="h-5 w-16 rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  const items = [
    { label: "Market", value: stats.market },
    { label: "Duration", value: stats.duration },
    { label: "TVL", value: stats.tvl },
    { label: "Active Orders", value: stats.activeOrders.toString() },
    { label: "Best Ask", value: stats.bestAskRate },
    { label: "Best Bid", value: stats.bestBidRate },
    { label: "Spread", value: stats.spread },
    { label: "Max LTV", value: stats.maxLtv },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
      {items.map((item) => (
        <div className="space-y-1 rounded-lg border p-3" key={item.label}>
          <p className="text-muted-foreground text-xs">{item.label}</p>
          <p className="font-mono font-semibold text-sm">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
