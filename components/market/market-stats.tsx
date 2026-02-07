"use client";

import { useMarketStats } from "@/hooks/sui/use-market-data";

export function MarketStats() {
  const stats = useMarketStats();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
      <StatCard label="Market" value={stats.market} />
      <StatCard label="Duration" value={stats.duration} />
      <StatCard label="Risk Tier" value={stats.riskTier} />
      <StatCard
        accent="emerald"
        label="Best Lend Rate"
        value={stats.bestAskRate}
      />
      <StatCard
        accent="rose"
        label="Best Borrow Rate"
        value={stats.bestBidRate}
      />
      <StatCard label="Spread" value={stats.spread} />
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "emerald" | "rose";
}) {
  const valueColor =
    accent === "emerald"
      ? "text-emerald-600"
      : accent === "rose"
        ? "text-rose-500"
        : "text-foreground";

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="text-muted-foreground text-xs">{label}</div>
      <div className={`font-mono font-semibold text-sm ${valueColor}`}>
        {value}
      </div>
    </div>
  );
}
