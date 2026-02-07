"use client";

import { AppHeader } from "@/components/layout/app-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MARKETS, PACKAGE_ID } from "@/hooks/sui/types";
import { MarketProvider } from "@/hooks/sui/use-market-context";

function ExplorerLink({
  label,
  objectId,
}: {
  label: string;
  objectId: string;
}) {
  if (!objectId) return null;
  return (
    <div className="flex items-center justify-between rounded-lg border px-3 py-2">
      <span className="text-muted-foreground text-sm">{label}</span>
      <a
        className="font-mono text-xs underline hover:text-foreground"
        href={`https://suiscan.xyz/mainnet/object/${objectId}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        {objectId.slice(0, 10)}...{objectId.slice(-6)}
      </a>
    </div>
  );
}

function DocsContent() {
  return (
    <div className="space-y-8">
      {/* Protocol Overview */}
      <section className="space-y-4">
        <h2 className="font-bold text-xl tracking-tight">Protocol Overview</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-muted-foreground text-sm leading-relaxed">
            Yume is a peer-to-peer fixed-rate, fixed-term lending protocol built
            natively on Sui. It combines a central limit order book (CLOB) with
            hybrid liquidity pools and leverages Sui-specific features like
            Programmable Transaction Blocks (PTBs), the Hot Potato pattern, and
            dynamic fields for a seamless DeFi experience.
          </p>
        </div>
      </section>

      <Separator />

      {/* Architecture */}
      <section className="space-y-4">
        <h2 className="font-bold text-xl tracking-tight">Architecture</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">OrderBook Module</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              <p>
                Central limit order book for lending and borrowing. Stores
                orders in a Table as dynamic fields on a shared object. Supports
                lend orders (asks) and borrow orders (bids) with rate-based
                matching.
              </p>
              <p className="mt-2">
                Key functions: <code>place_lend_order</code>,{" "}
                <code>place_borrow_order</code>, <code>cancel_order</code>,{" "}
                <code>match_orders</code>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Hot Potato Pattern</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              <p>
                <code>MatchReceipt</code> is a struct with no <code>drop</code>,{" "}
                <code>store</code>, or <code>key</code> abilities. When{" "}
                <code>match_orders</code> returns a receipt, it <em>must</em> be
                consumed by <code>settle</code> in the same PTB. This enforces
                atomic settlement — either all steps succeed or none.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">CollateralVault</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              <p>
                Holds locked collateral for active loans. Uses dynamic fields
                (keyed by loan ID) to store <code>LoanInfo</code> structs.
                Supports deposit, release (on repayment), and seizure (on
                liquidation).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Hybrid Liquidity Pool</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              <p>
                Passive depositors earn yield without managing individual
                orders. The pool admin can <code>rebalance</code> to
                automatically place lend orders across rate buckets. LP shares
                track each depositor&apos;s proportional ownership.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">LoanPosition NFTs</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              <p>
                When a match is settled, both lender and borrower receive a{" "}
                <code>LoanPosition</code> NFT (owned object). This NFT tracks
                principal, rate, duration, maturity time, and status. The
                borrower uses it to repay; the lender uses it to claim
                repayment.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">PTB Composability</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              <p>
                Multiple operations can be chained in a single Programmable
                Transaction Block. Example:{" "}
                <code>place_borrow_order → match_orders → settle</code> executes
                atomically. The Quick Borrow feature on the Market page
                demonstrates this live.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Contract Addresses */}
      <section className="space-y-4">
        <h2 className="font-bold text-xl tracking-tight">
          Contract Addresses (Mainnet)
        </h2>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Package</CardTitle>
          </CardHeader>
          <CardContent>
            <ExplorerLink label="Yume Package" objectId={PACKAGE_ID} />
          </CardContent>
        </Card>

        {MARKETS.map((market) => (
          <Card key={market.id}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                {market.label}
                <Badge variant="secondary">{market.duration / 86_400}D</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ExplorerLink label="OrderBook" objectId={market.orderbookId} />
              <ExplorerLink label="CollateralVault" objectId={market.vaultId} />
              {market.poolId && (
                <ExplorerLink label="LiquidityPool" objectId={market.poolId} />
              )}
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="outline">Base: {market.baseSymbol}</Badge>
                <Badge variant="outline">
                  Collateral: {market.collateralSymbol}
                </Badge>
                <Badge variant="outline">
                  Max LTV: {(market.maxLtvBps / 100).toFixed(0)}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Separator />

      {/* PTB Builder Reference */}
      <section className="space-y-4">
        <h2 className="font-bold text-xl tracking-tight">
          PTB Builder Reference
        </h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium font-mono">place_lend_order</p>
                <p className="text-muted-foreground">
                  <code>
                    market::place_lend_order&lt;BASE, COL&gt;(book, coin,
                    rate_bps, clock)
                  </code>
                </p>
                <p className="mt-1 text-muted-foreground text-xs">
                  Places a lend (ask) order. The coin is deposited into the
                  order book.
                </p>
              </div>
              <Separator />
              <div>
                <p className="font-medium font-mono">place_borrow_order</p>
                <p className="text-muted-foreground">
                  <code>
                    market::place_borrow_order&lt;BASE, COL&gt;(book, amount,
                    max_rate, clock)
                  </code>
                </p>
                <p className="mt-1 text-muted-foreground text-xs">
                  Places a borrow (bid) order. No deposit required upfront —
                  collateral is provided at settlement.
                </p>
              </div>
              <Separator />
              <div>
                <p className="font-medium font-mono">match_orders</p>
                <p className="text-muted-foreground">
                  <code>
                    market::match_orders&lt;BASE, COL&gt;(book, taker_id,
                    maker_id, clock) → MatchReceipt
                  </code>
                </p>
                <p className="mt-1 text-muted-foreground text-xs">
                  Matches a taker order with a maker order. Returns a
                  MatchReceipt (hot potato) that must be consumed by settle.
                </p>
              </div>
              <Separator />
              <div>
                <p className="font-medium font-mono">settle</p>
                <p className="text-muted-foreground">
                  <code>
                    market::settle&lt;BASE, COL&gt;(receipt, collateral_coin,
                    book, vault, clock)
                  </code>
                </p>
                <p className="mt-1 text-muted-foreground text-xs">
                  Consumes the MatchReceipt, locks collateral, transfers
                  principal to borrower, and creates LoanPosition NFTs for both
                  parties.
                </p>
              </div>
              <Separator />
              <div>
                <p className="font-medium font-mono">repay</p>
                <p className="text-muted-foreground">
                  <code>
                    market::repay&lt;BASE, COL&gt;(position, payment_coin,
                    vault, clock)
                  </code>
                </p>
                <p className="mt-1 text-muted-foreground text-xs">
                  Repays a loan. The borrower sends principal + interest. Their
                  collateral is released. Both LoanPosition NFTs are marked
                  repaid.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default function DocsPage() {
  return (
    <MarketProvider>
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
          <div>
            <h1 className="font-bold text-2xl tracking-tight">Documentation</h1>
            <p className="text-muted-foreground text-sm">
              Yume Protocol — architecture, contracts, and PTB reference.
            </p>
          </div>
          <DocsContent />
        </main>
      </div>
    </MarketProvider>
  );
}
