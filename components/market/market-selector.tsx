"use client";

import type { MarketConfig } from "@/hooks/sui/types";
import { useMarket } from "@/hooks/sui/use-market-context";

export function MarketSelector() {
  const { market, setMarket, markets } = useMarket();

  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
      {markets.map((m: MarketConfig) => {
        const isActive = m.id === market.id;
        return (
          <button
            className={`rounded-md px-3 py-1.5 font-medium text-sm transition-colors ${
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            key={m.id}
            onClick={() => setMarket(m)}
            type="button"
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
