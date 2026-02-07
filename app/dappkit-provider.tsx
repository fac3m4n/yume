// app/DAppKitClientProvider.tsx
"use client";

import dynamic from "next/dynamic";

/**
 * Inner provider component — dynamically imported with ssr: false
 * to avoid the @mysten/dapp-kit-react `window` access during SSR.
 */
const DAppKitInner = dynamic(
  () => import("./dapp-kit-inner").then((mod) => mod.DAppKitInner),
  { ssr: false }
);

export function DAppKitClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DAppKitInner>{children}</DAppKitInner>;
}
