"use client";

import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { useMemo } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  bpsToPercent,
  DURATION_LABELS,
  MARKETS,
  type MarketConfig,
  ORDER_SIDE_LEND,
  STATUS_LABELS,
} from "@/hooks/sui/types";
import { MarketProvider } from "@/hooks/sui/use-market-context";
import {
  formatTokenAmount,
  useAllPositions,
  useOrderBook,
} from "@/hooks/sui/use-market-data";

function findMarketByOrderbook(bookId: string): MarketConfig | undefined {
  return MARKETS.find((m) => m.orderbookId === bookId);
}

/** Aggregates orders for a single market */
function MarketOrders({ market }: { market: MarketConfig }) {
  const { asks, bids, loading } = useOrderBook(market, 30_000);
  const account = useCurrentAccount();

  const myOrders = useMemo(() => {
    if (!account?.address) return [];
    return [...asks, ...bids].filter((o) => o.owner === account.address);
  }, [asks, bids, account?.address]);

  if (loading) {
    return (
      <div className="animate-pulse py-2">
        <div className="h-4 w-32 rounded bg-muted" />
      </div>
    );
  }

  if (myOrders.length === 0) return null;

  return (
    <>
      {myOrders.map((order) => {
        const isLend = order.side === ORDER_SIDE_LEND;
        return (
          <div
            className="flex items-center justify-between rounded-lg border p-3"
            key={`${market.id}-${order.orderId}`}
          >
            <div className="flex items-center gap-3">
              <Badge
                className={isLend ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                variant={isLend ? "default" : "destructive"}
              >
                {isLend ? "Lend" : "Borrow"}
              </Badge>
              <span className="font-mono font-semibold text-sm">
                {formatTokenAmount(order.amount, market.baseDecimals)}{" "}
                {market.baseSymbol}
              </span>
              <span className="text-muted-foreground text-sm">
                @ {bpsToPercent(order.rate)}
              </span>
            </div>
            <Badge variant="outline">{market.label}</Badge>
          </div>
        );
      })}
    </>
  );
}

function PortfolioContent() {
  const account = useCurrentAccount();
  const { positions, loading: posLoading } = useAllPositions();

  if (!account?.address) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-semibold text-lg">Connect Your Wallet</p>
        <p className="mt-2 text-muted-foreground text-sm">
          Connect a wallet to view your portfolio across all markets.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-xs">
              Active Positions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono font-semibold text-2xl">
              {posLoading
                ? "..."
                : positions.filter((p) => p.status === 0).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-xs">
              Markets Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono font-semibold text-2xl">{MARKETS.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-xs">
              Wallet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="truncate font-mono text-sm">{account.address}</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Orders across all markets */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Active Orders (All Markets)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {MARKETS.map((m) => (
              <MarketOrders key={m.id} market={m} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Positions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Loan Positions (All Markets)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {posLoading ? (
            <div className="flex items-center gap-2 py-4 text-muted-foreground text-sm">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Loading positions...
            </div>
          ) : positions.length === 0 ? (
            <p className="py-4 text-center text-muted-foreground text-sm">
              No loan positions found. Positions are created when orders are
              matched and settled.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {positions.map((pos) => {
                const mkt = findMarketByOrderbook(pos.bookId);
                const dec = mkt?.baseDecimals ?? 9;
                const sym = mkt?.baseSymbol ?? "TOKEN";
                const isLend = pos.side === 0;

                return (
                  <div
                    className="flex items-center justify-between rounded-lg border p-4"
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
                        <Badge variant="outline">
                          {STATUS_LABELS[pos.status]}
                        </Badge>
                        {mkt && <Badge variant="secondary">{mkt.label}</Badge>}
                      </div>
                      <div className="flex items-baseline gap-4 text-sm">
                        <span className="font-mono font-semibold">
                          {formatTokenAmount(pos.principal, dec)} {sym}
                        </span>
                        <span className="text-muted-foreground">
                          @ {bpsToPercent(pos.rate)}
                        </span>
                        <span className="text-muted-foreground">
                          {DURATION_LABELS[pos.duration] ?? `${pos.duration}s`}
                        </span>
                      </div>
                    </div>
                    <button
                      className="text-muted-foreground text-xs underline hover:text-foreground"
                      onClick={() =>
                        window.open(
                          `https://suiscan.xyz/mainnet/object/${pos.id}`,
                          "_blank"
                        )
                      }
                      type="button"
                    >
                      Explorer
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <MarketProvider>
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
          <div>
            <h1 className="font-bold text-2xl tracking-tight">Portfolio</h1>
            <p className="text-muted-foreground text-sm">
              Your positions and orders across all Yume markets.
            </p>
          </div>
          <PortfolioContent />
        </main>
      </div>
    </MarketProvider>
  );
}
