"use client";

import { DAppKitProvider } from "@mysten/dapp-kit-react";
import { dAppKit } from "./dapp-kit";

/**
 * Inner wrapper that imports @mysten/dapp-kit-react.
 * This module is dynamically imported with ssr: false by
 * DAppKitClientProvider to avoid `window is not defined` during SSR.
 */
export function DAppKitInner({ children }: { children: React.ReactNode }) {
  return <DAppKitProvider dAppKit={dAppKit}>{children}</DAppKitProvider>;
}
