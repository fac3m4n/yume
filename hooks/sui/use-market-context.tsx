"use client";

/**
 * Market Context — provides the currently selected market to all child components.
 */

import { createContext, type ReactNode, useContext, useState } from "react";
import { DEFAULT_MARKET, MARKETS, type MarketConfig } from "./types";

interface MarketContextValue {
  market: MarketConfig;
  setMarket: (market: MarketConfig) => void;
  markets: MarketConfig[];
}

const MarketContext = createContext<MarketContextValue>({
  market: DEFAULT_MARKET,
  setMarket: () => {},
  markets: MARKETS,
});

export function MarketProvider({ children }: { children: ReactNode }) {
  const [market, setMarket] = useState<MarketConfig>(DEFAULT_MARKET);

  return (
    <MarketContext.Provider value={{ market, setMarket, markets: MARKETS }}>
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket() {
  return useContext(MarketContext);
}
