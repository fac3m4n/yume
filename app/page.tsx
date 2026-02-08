"use client";

import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import BlurEffect from "react-progressive-blur";
import { Button } from "@/components/ui/button";

const ConnectButton = dynamic(() => import("./connect-button"), {
  ssr: false,
  loading: () => (
    <div className="h-10 w-32 animate-pulse rounded-md bg-neutral-200/50" />
  ),
});

const HelixScene = dynamic(
  () => import("@/components/ui/helix-hero").then((mod) => mod.Scene),
  {
    ssr: false,
    loading: () => <div className="h-full w-full bg-white" />,
  }
);

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-white">
      {/* 3D Helix Background */}
      <div className="absolute inset-0 z-0">
        <HelixScene />
      </div>

      {/* Top blur for softness */}
      <BlurEffect
        className="pointer-events-none absolute top-0 z-10 h-1/3 w-full bg-linear-to-b from-white/30 to-transparent"
        intensity={40}
        position="top"
      />

      {/* Bottom blur */}
      <BlurEffect
        className="pointer-events-none absolute bottom-0 z-10 h-1/3 w-full bg-linear-to-b from-transparent to-white/30"
        intensity={40}
        position="bottom"
      />

      {/* Content Overlay */}
      <div className="relative z-20 flex h-full flex-col justify-between p-6 md:p-12 lg:p-16">
        {/* Top Bar: Logo + Connect */}
        <header className="flex items-center justify-between">
          <h1 className="font-serif text-4xl text-gray-900 italic tracking-tight">
            yume
          </h1>
          <ConnectButton />
        </header>

        {/* Hero Content — Bottom Left */}
        <div className="max-w-lg pb-8 md:pb-12">
          <p className="mb-4 font-medium text-gray-400 text-xs uppercase tracking-[0.2em]">
            Order Book Lending on Sui
          </p>

          <h2 className="mb-5 font-serif text-5xl text-gray-900 leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
            Fixed rates.
            <br />
            <span className="italic">Fixed terms.</span>
            <br />
            Peer-to-peer.
          </h2>

          <p className="mb-8 max-w-sm text-gray-500 text-sm leading-relaxed">
            A hybrid order book and liquidity pool protocol for precise lending
            and borrowing — built natively on Sui.
          </p>

          <div className="flex items-center gap-3">
            <Link href="/market">
              <Button
                className="group gap-2 rounded-full px-6 font-medium"
                size="lg"
              >
                Launch App
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button
                className="rounded-full px-6 font-medium"
                size="lg"
                variant="ghost"
              >
                Read Docs
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom-right subtle tag */}
      <div className="absolute right-6 bottom-6 z-20 md:right-12 md:bottom-12">
        <p className="text-[11px] text-gray-900 tracking-wide">
          Live on Sui Mainnet
        </p>
      </div>
    </main>
  );
}
