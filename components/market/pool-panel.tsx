"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bpsToPercent } from "@/hooks/sui/types";
import { useMarket } from "@/hooks/sui/use-market-context";
import { formatTokenAmount, usePoolState } from "@/hooks/sui/use-market-data";
import { useYumeTransactions } from "@/hooks/sui/use-yume-transactions";

type PoolAction = "deposit" | "withdraw" | "rebalance";

export function PoolPanel() {
  const { market } = useMarket();
  const { pool, loading, error, refetch } = usePoolState();
  const {
    depositToPool,
    withdrawFromPool,
    rebalancePool,
    txState,
    isConnected,
    account,
  } = useYumeTransactions();
  const [action, setAction] = useState<PoolAction>("deposit");
  const [amount, setAmount] = useState("");
  const [successDigest, setSuccessDigest] = useState<string | null>(null);

  const sym = market.baseSymbol;
  const dec = market.baseDecimals;

  // Only SUI/SUI market has a pool
  if (!market.poolId) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border bg-muted/30 py-12 text-center">
        <p className="font-medium text-muted-foreground">
          No liquidity pool for this market
        </p>
        <p className="mt-1 text-muted-foreground text-xs">
          Hybrid pools are available on the SUI / SUI market.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              className="animate-pulse space-y-2 rounded-lg border p-4"
              key={i}
            >
              <div className="h-4 w-16 rounded bg-muted" />
              <div className="h-6 w-24 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !pool) {
    return (
      <div className="flex items-center justify-center py-12 text-center">
        <p className="text-destructive text-sm">
          {error ?? "Failed to load pool data."}
        </p>
      </div>
    );
  }

  const isAdmin =
    account?.address &&
    pool.admin.toLowerCase() === account.address.toLowerCase();

  const totalValue = pool.availableBalance + pool.deployedBalance;
  const utilization =
    totalValue > 0
      ? Number((pool.deployedBalance * BigInt(10_000)) / totalValue) / 100
      : 0;

  async function handleAction() {
    setSuccessDigest(null);
    const amountSmallest = BigInt(
      Math.floor(Number.parseFloat(amount || "0") * 10 ** dec)
    );
    let digest: string | null = null;

    if (action === "deposit") {
      digest = await depositToPool(amountSmallest);
    } else if (action === "withdraw") {
      digest = await withdrawFromPool(amountSmallest);
    } else if (action === "rebalance") {
      digest = await rebalancePool();
    }

    if (digest) {
      setSuccessDigest(digest);
      setAmount("");
      setTimeout(() => refetch(), 2000);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Pool Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="space-y-1 rounded-lg border p-4">
          <p className="text-muted-foreground text-xs">Total Value</p>
          <p className="font-mono font-semibold text-lg">
            {formatTokenAmount(totalValue, dec)}
          </p>
          <p className="text-muted-foreground text-xs">{sym}</p>
        </div>
        <div className="space-y-1 rounded-lg border p-4">
          <p className="text-muted-foreground text-xs">Available</p>
          <p className="font-mono font-semibold text-lg">
            {formatTokenAmount(pool.availableBalance, dec)}
          </p>
          <p className="text-muted-foreground text-xs">{sym}</p>
        </div>
        <div className="space-y-1 rounded-lg border p-4">
          <p className="text-muted-foreground text-xs">Deployed</p>
          <p className="font-mono font-semibold text-lg">
            {formatTokenAmount(pool.deployedBalance, dec)}
          </p>
          <p className="text-muted-foreground text-xs">{sym}</p>
        </div>
        <div className="space-y-1 rounded-lg border p-4">
          <p className="text-muted-foreground text-xs">Utilization</p>
          <p className="font-mono font-semibold text-lg">
            {utilization.toFixed(1)}%
          </p>
          <p className="text-muted-foreground text-xs">
            Rate: {bpsToPercent(pool.minRate)} – {bpsToPercent(pool.maxRate)}
          </p>
        </div>
      </div>

      {/* Pool Details */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Badge variant="secondary">
          Shares: {formatTokenAmount(pool.totalShares, dec)}
        </Badge>
        <Badge variant="outline">Buckets: {pool.numBuckets}</Badge>
        <Badge
          className={pool.isActive ? "bg-emerald-600" : ""}
          variant={pool.isActive ? "default" : "destructive"}
        >
          {pool.isActive ? "Active" : "Paused"}
        </Badge>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 border-t pt-4">
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {(["deposit", "withdraw", "rebalance"] as PoolAction[]).map((a) => (
            <button
              className={`flex-1 rounded-md px-3 py-1.5 font-medium text-sm capitalize transition-colors ${
                action === a
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              key={a}
              onClick={() => setAction(a)}
              type="button"
            >
              {a}
            </button>
          ))}
        </div>

        {action !== "rebalance" && (
          <div className="flex flex-col gap-2">
            <Label className="text-sm" htmlFor="pool-amount">
              {action === "deposit"
                ? `Deposit Amount (${sym})`
                : "Shares to Withdraw"}
            </Label>
            <Input
              className="font-mono"
              id="pool-amount"
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1.0"
              step="0.01"
              type="number"
              value={amount}
            />
          </div>
        )}

        {action === "rebalance" && !isAdmin && (
          <p className="text-muted-foreground text-xs">
            Only the pool admin can trigger rebalance.
          </p>
        )}

        {txState.error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-2 text-destructive text-xs">
            {txState.error}
          </div>
        )}

        {successDigest && (
          <div className="rounded-lg border border-emerald-500/50 bg-emerald-500/10 p-2 text-xs">
            <span className="text-emerald-600">Success!</span>{" "}
            <a
              className="font-mono text-emerald-600 underline"
              href={`https://suiscan.xyz/mainnet/tx/${successDigest}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              View tx
            </a>
          </div>
        )}

        <Button
          className="w-full capitalize"
          disabled={
            !isConnected ||
            txState.loading ||
            (action === "rebalance" && !isAdmin)
          }
          onClick={handleAction}
        >
          {txState.loading ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Processing...
            </span>
          ) : (
            action
          )}
        </Button>
      </div>
    </div>
  );
}
