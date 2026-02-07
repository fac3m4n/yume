"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ConnectButton = dynamic(() => import("./connect-button"), {
  ssr: false,
  loading: () => (
    <div className="h-10 w-32 animate-pulse rounded-md bg-neutral-200" />
  ),
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-4xl tracking-tight">Yume Protocol</h1>
          <p className="text-lg text-neutral-500">
            Order Book Lending on Sui. Fixed rates. Fixed terms. No pools.
          </p>
        </div>

        <ConnectButton />

        <Link href="/market">
          <Button className="font-medium" size="lg" variant="outline">
            Launch App
          </Button>
        </Link>

        <p className="max-w-sm text-neutral-400 text-sm">
          Live on Sui Mainnet — Order Book Lending + Hybrid Liquidity Pools.
        </p>
      </div>
    </main>
  );
}
