"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { LeverageDemo } from "@/components/market/leverage-demo";
import { MarketStats } from "@/components/market/market-stats";
import { OrderBookDisplay } from "@/components/market/order-book-display";
import { PlaceOrderForm } from "@/components/market/place-order-form";
import { PositionsList } from "@/components/market/positions-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const ConnectButton = dynamic(() => import("../connect-button"), {
  ssr: false,
  loading: () => (
    <div className="h-10 w-32 animate-pulse rounded-md bg-neutral-200" />
  ),
});

export default function MarketPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link className="font-bold text-lg tracking-tight" href="/">
              Yume
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link className="font-medium text-foreground" href="/market">
                Market
              </Link>
              <span className="cursor-default text-muted-foreground">
                Portfolio
              </span>
              <span className="cursor-default text-muted-foreground">Docs</span>
            </nav>
          </div>
          <ConnectButton />
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        {/* Market stats bar */}
        <MarketStats />

        <Separator />

        {/* Order book + Place order (2-column) */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Order Book — takes 2 columns */}
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

          {/* Place Order Form */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Place Order</CardTitle>
            </CardHeader>
            <CardContent>
              <PlaceOrderForm />
            </CardContent>
          </Card>
        </div>

        {/* Positions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Your Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <PositionsList />
          </CardContent>
        </Card>

        {/* One-Click Leverage Demo */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              PTB Composability Demo
              <span className="rounded-full bg-primary/10 px-2 py-0.5 font-normal text-primary text-xs">
                Sui-native
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LeverageDemo />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
