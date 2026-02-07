"use client";

import { useCurrentClient } from "@mysten/dapp-kit-react";
import { Transaction } from "@mysten/sui/transactions";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bpsToPercent, PACKAGE_ID } from "@/hooks/sui/types";
import { useMarket } from "@/hooks/sui/use-market-context";
import { formatTokenAmount, useOrderBook } from "@/hooks/sui/use-market-data";
import { useYumeTransactions } from "@/hooks/sui/use-yume-transactions";

type Step = "select" | "configure" | "review" | "success";

export function LeverageDemo() {
  const { market } = useMarket();
  const client = useCurrentClient();
  const { asks, loading: bookLoading, refetch } = useOrderBook();
  const { txState, isConnected, account, execute } = useYumeTransactions();

  const [step, setStep] = useState<Step>("select");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [borrowAmount, setBorrowAmount] = useState("");
  const [successDigest, setSuccessDigest] = useState<string | null>(null);
  const [nextOrderId, setNextOrderId] = useState<number>(0);

  const sym = market.baseSymbol;
  const dec = market.baseDecimals;
  const colSym = market.collateralSymbol;

  // Available lend orders (exclude own orders - ESelfMatch)
  const availableOrders = useMemo(() => {
    if (!account?.address) return asks;
    return asks.filter(
      (o) => o.owner.toLowerCase() !== account.address.toLowerCase()
    );
  }, [asks, account?.address]);

  const selectedOrder = useMemo(
    () => availableOrders.find((o) => o.orderId === selectedOrderId) ?? null,
    [availableOrders, selectedOrderId]
  );

  // Parse amounts
  const borrowAmountRaw = useMemo(() => {
    const num = Number.parseFloat(borrowAmount || "0");
    if (isNaN(num) || num <= 0) return BigInt(0);
    return BigInt(Math.floor(num * 10 ** dec));
  }, [borrowAmount, dec]);

  const collateralRequired = useMemo(() => {
    if (borrowAmountRaw <= 0 || !market.maxLtvBps) return BigInt(0);
    return (borrowAmountRaw * BigInt(10_000)) / BigInt(market.maxLtvBps);
  }, [borrowAmountRaw, market.maxLtvBps]);

  const interest = useMemo(() => {
    if (!selectedOrder || borrowAmountRaw <= 0) return BigInt(0);
    return (borrowAmountRaw * BigInt(selectedOrder.rate)) / BigInt(10_000);
  }, [selectedOrder, borrowAmountRaw]);

  // Fetch next_order_id when entering review step
  useEffect(() => {
    if (step !== "review") return;
    (async () => {
      try {
        const bookObj = await client.getObject({
          objectId: market.orderbookId,
          include: { json: true },
        });
        const bookJson = bookObj.object?.json as Record<string, unknown> | null;
        setNextOrderId(Number(bookJson?.next_order_id ?? 0));
      } catch {
        setNextOrderId(0);
      }
    })();
  }, [step, client, market.orderbookId]);

  const handleExecutePTB = useCallback(async () => {
    if (!selectedOrder || borrowAmountRaw <= 0 || nextOrderId === 0) return;

    setSuccessDigest(null);

    const tx = new Transaction();

    // Command 1: Place borrow order
    tx.moveCall({
      target: `${PACKAGE_ID}::market::place_borrow_order`,
      typeArguments: [market.base, market.collateral],
      arguments: [
        tx.object(market.orderbookId),
        tx.pure.u64(borrowAmountRaw),
        tx.pure.u64(selectedOrder.rate),
        tx.object("0x6"),
      ],
    });

    // Command 2: Match orders (returns MatchReceipt hot potato)
    const takerOrderId = nextOrderId; // Our borrow order gets this ID
    const [receipt] = tx.moveCall({
      target: `${PACKAGE_ID}::market::match_orders`,
      typeArguments: [market.base, market.collateral],
      arguments: [
        tx.object(market.orderbookId),
        tx.pure.u64(takerOrderId),
        tx.pure.u64(selectedOrder.orderId),
        tx.object("0x6"),
      ],
    });

    // Command 3: Split collateral from gas & settle
    const [collateralCoin] = tx.splitCoins(tx.gas, [
      tx.pure.u64(collateralRequired),
    ]);

    tx.moveCall({
      target: `${PACKAGE_ID}::market::settle`,
      typeArguments: [market.base, market.collateral],
      arguments: [
        receipt,
        collateralCoin,
        tx.object(market.orderbookId),
        tx.object(market.vaultId),
        tx.object("0x6"),
      ],
    });

    const digest = await execute(tx);
    if (digest) {
      setSuccessDigest(digest);
      setStep("success");
      setTimeout(() => refetch(), 2000);
    }
  }, [
    selectedOrder,
    borrowAmountRaw,
    nextOrderId,
    collateralRequired,
    market,
    execute,
    refetch,
  ]);

  function handleReset() {
    setStep("select");
    setSelectedOrderId(null);
    setBorrowAmount("");
    setSuccessDigest(null);
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">
          Connect your wallet to use Quick Borrow
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Progress steps */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {(
          [
            { key: "select", label: "1. Select Order" },
            { key: "configure", label: "2. Configure" },
            { key: "review", label: "3. Review PTB" },
            { key: "success", label: "4. Done" },
          ] as const
        ).map((s, i) => (
          <div className="flex items-center gap-1" key={s.key}>
            <span
              className={`rounded-full px-2.5 py-0.5 ${
                step === s.key
                  ? "bg-foreground font-medium text-background"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s.label}
            </span>
            {i < 3 && <span className="text-muted-foreground">→</span>}
          </div>
        ))}
      </div>

      {/* Step 1: Select lend order */}
      {step === "select" && (
        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground text-sm">
            Select a lend order to borrow against. Orders from your own wallet
            are excluded (ESelfMatch protection).
          </p>
          {bookLoading ? (
            <div className="flex items-center gap-2 py-4 text-muted-foreground text-sm">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Loading...
            </div>
          ) : availableOrders.length === 0 ? (
            <p className="py-4 text-muted-foreground text-sm">
              No matchable lend orders available.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {availableOrders.map((order) => (
                <button
                  className="flex items-center justify-between rounded-lg border p-3 text-left transition-colors hover:bg-muted/50"
                  key={order.orderId}
                  onClick={() => {
                    setSelectedOrderId(order.orderId);
                    setStep("configure");
                  }}
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <Badge className="bg-emerald-600">Lend</Badge>
                    <span className="font-mono font-semibold text-sm">
                      {formatTokenAmount(order.amount, dec)} {sym}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      @ {bpsToPercent(order.rate)}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    #{order.orderId}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Configure borrow amount */}
      {step === "configure" && selectedOrder && (
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border bg-muted/30 p-3 text-sm">
            <p className="text-muted-foreground">Selected lend offer:</p>
            <p className="font-mono font-semibold">
              {formatTokenAmount(selectedOrder.amount, dec)} {sym} @{" "}
              {bpsToPercent(selectedOrder.rate)}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm" htmlFor="borrow-amount">
              Borrow Amount ({sym})
            </Label>
            <Input
              className="font-mono"
              id="borrow-amount"
              onChange={(e) => setBorrowAmount(e.target.value)}
              placeholder="0.1"
              type="number"
              value={borrowAmount}
            />
            <p className="text-muted-foreground text-xs">
              Max: {formatTokenAmount(selectedOrder.amount, dec)} {sym}
            </p>
          </div>

          {borrowAmountRaw > 0 && (
            <div className="space-y-1 rounded-lg border p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Borrow</span>
                <span className="font-mono">
                  {borrowAmount} {sym}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Interest</span>
                <span className="font-mono">
                  {formatTokenAmount(interest, dec)} {sym}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Collateral</span>
                <span className="font-mono">
                  {formatTokenAmount(collateralRequired, 9)} {colSym}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">LTV</span>
                <span className="font-mono">
                  {(market.maxLtvBps / 100).toFixed(0)}%
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={() => setStep("select")}
              variant="outline"
            >
              Back
            </Button>
            <Button
              className="flex-1"
              disabled={borrowAmountRaw <= 0}
              onClick={() => setStep("review")}
            >
              Review PTB
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Review PTB */}
      {step === "review" && selectedOrder && (
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">
            3 operations in 1 atomic Programmable Transaction Block:
          </p>

          <div className="flex flex-col gap-2">
            {[
              {
                num: 1,
                label: "place_borrow_order",
                desc: `Borrow ${borrowAmount} ${sym} at ${bpsToPercent(selectedOrder.rate)}`,
              },
              {
                num: 2,
                label: "match_orders",
                desc: `Match with lend order #${selectedOrder.orderId}. Returns MatchReceipt (Hot Potato).`,
              },
              {
                num: 3,
                label: "settle",
                desc: `Lock ${formatTokenAmount(collateralRequired, 9)} ${colSym} collateral, transfer ${borrowAmount} ${sym}, create LoanPosition NFTs.`,
              },
            ].map((op) => (
              <div
                className="flex items-start gap-3 rounded-lg border p-3"
                key={op.num}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground font-medium text-background text-xs">
                  {op.num}
                </span>
                <div>
                  <p className="font-medium font-mono text-sm">{op.label}</p>
                  <p className="text-muted-foreground text-xs">{op.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-3 text-amber-700 text-xs dark:text-amber-400">
            <p className="font-medium">Hot Potato Pattern</p>
            <p className="mt-1">
              The MatchReceipt from step 2 has no `drop` ability — it must be
              consumed by `settle` in the same PTB. This guarantees atomicity:
              all 3 steps succeed, or none.
            </p>
          </div>

          {txState.error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-2 text-destructive text-xs">
              {txState.error}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={() => setStep("configure")}
              variant="outline"
            >
              Back
            </Button>
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              disabled={txState.loading || nextOrderId === 0}
              onClick={handleExecutePTB}
            >
              {txState.loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Executing...
                </span>
              ) : (
                "Execute PTB (3 ops)"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Success */}
      {step === "success" && (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-600">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                d="M5 13l4 4L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="font-semibold text-lg">Transaction Successful</p>
          <p className="text-muted-foreground text-sm">
            3 operations executed atomically in 1 PTB
          </p>
          {successDigest && (
            <a
              className="font-mono text-emerald-600 text-sm underline"
              href={`https://suiscan.xyz/mainnet/tx/${successDigest}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              View on Explorer
            </a>
          )}
          <Button onClick={handleReset} variant="outline">
            Start Over
          </Button>
        </div>
      )}
    </div>
  );
}
