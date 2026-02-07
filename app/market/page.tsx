"use client";

import { AppHeader } from "@/components/layout/app-header";
import { LeverageDemo } from "@/components/market/leverage-demo";
import { MarketSelector } from "@/components/market/market-selector";
import { MarketStats } from "@/components/market/market-stats";
import { OrderBookDisplay } from "@/components/market/order-book-display";
import { PlaceOrderForm } from "@/components/market/place-order-form";
import { PoolPanel } from "@/components/market/pool-panel";
import { PositionsList } from "@/components/market/positions-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MarketProvider } from "@/hooks/sui/use-market-context";

export default function MarketPage() {
  return (
    <MarketProvider>
      <div className="min-h-screen bg-background">
        <AppHeader />

        <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
          {/* Market selector + stats */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <MarketSelector />
          </div>

          <MarketStats />
          <Separator />

          {/* Order book + Place order */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Order Book</CardTitle>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-600" />
                      Lend (Ask)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                      Borrow (Bid)
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <OrderBookDisplay />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Place Order</CardTitle>
              </CardHeader>
              <CardContent>
                <PlaceOrderForm />
              </CardContent>
            </Card>
          </div>

          {/* Orders & Positions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Your Orders & Positions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PositionsList />
            </CardContent>
          </Card>

          {/* Hybrid Pool */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                Hybrid Liquidity Pool
                <span className="rounded-full bg-emerald-600/10 px-2 py-0.5 font-normal text-emerald-600 text-xs">
                  Passive Yield
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PoolPanel />
            </CardContent>
          </Card>

          {/* Match & Settle (PTB Demo) */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                Quick Borrow — Match & Settle
                <span className="rounded-full bg-primary/10 px-2 py-0.5 font-normal text-primary text-xs">
                  3-Step PTB
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LeverageDemo />
            </CardContent>
          </Card>
        </main>
      </div>
    </MarketProvider>
  );
}
