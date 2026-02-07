"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bpsToPercent } from "@/hooks/sui/types";
import { mistToSui, usePoolState } from "@/hooks/sui/use-market-data";
import { useYumeTransactions } from "@/hooks/sui/use-yume-transactions";

function computeBuckets(
  minRate: number,
  maxRate: number,
  numBuckets: number,
  deployed: bigint
) {
  const perBucket = Number(deployed) / numBuckets;
  const spread = maxRate - minRate;
  return Array.from({ length: numBuckets }, (_, i) => ({
    rate: minRate + Math.round((i * spread) / (numBuckets - 1)),
    amount: perBucket,
  }));
}

/** Convert SUI amount (e.g. "0.1") to MIST (bigint) */
function suiToMist(sui: string): bigint {
  const num = Number.parseFloat(sui);
  if (isNaN(num) || num <= 0) return BigInt(0);
  return BigInt(Math.floor(num * 1e9));
}

export function PoolPanel() {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawShares, setWithdrawShares] = useState("");
  const [successDigest, setSuccessDigest] = useState<string | null>(null);

  const { pool, loading, error, refetch } = usePoolState();
  const {
    depositToPool,
    withdrawFromPool,
    rebalancePool,
    txState,
    isConnected,
    account,
  } = useYumeTransactions();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Loading pool...
        </div>
      </div>
    );
  }

  if (error || !pool) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-destructive text-sm">{error ?? "Pool not found"}</p>
      </div>
    );
  }

  const buckets = computeBuckets(
    pool.minRate,
    pool.maxRate,
    pool.numBuckets,
    pool.deployedBalance
  );

  const totalValue =
    Number(pool.availableBalance) + Number(pool.deployedBalance);
  const utilization =
    totalValue > 0
      ? ((Number(pool.deployedBalance) / totalValue) * 100).toFixed(1)
      : "0.0";

  const isAdmin = account?.address && pool.admin === account.address;

  async function handleDeposit() {
    const amountMist = suiToMist(depositAmount);
    if (amountMist <= 0) return;
    setSuccessDigest(null);
    const digest = await depositToPool(amountMist);
    if (digest) {
      setSuccessDigest(digest);
      setDepositAmount("");
      refetch();
    }
  }

  async function handleWithdraw() {
    const shares = BigInt(withdrawShares || "0");
    if (shares <= 0) return;
    setSuccessDigest(null);
    const digest = await withdrawFromPool(shares);
    if (digest) {
      setSuccessDigest(digest);
      setWithdrawShares("");
      refetch();
    }
  }

  async function handleRebalance() {
    setSuccessDigest(null);
    const digest = await rebalancePool();
    if (digest) {
      setSuccessDigest(digest);
      refetch();
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Pool Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border bg-card p-3">
          <div className="text-muted-foreground text-xs">Total Value</div>
          <div className="font-mono font-semibold text-sm">
            {mistToSui(BigInt(totalValue))} SUI
          </div>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="text-muted-foreground text-xs">Utilization</div>
          <div className="font-mono font-semibold text-sm">{utilization}%</div>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="text-muted-foreground text-xs">Rate Range</div>
          <div className="font-mono font-semibold text-sm">
            {bpsToPercent(pool.minRate)} – {bpsToPercent(pool.maxRate)}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="text-muted-foreground text-xs">Total Shares</div>
          <div className="font-mono font-semibold text-sm">
            {Number(pool.totalShares).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Rate Distribution Visualization */}
      <div>
        <div className="mb-2 font-medium text-muted-foreground text-xs">
          Linear Curve — Order Distribution
        </div>
        <div className="flex h-24 items-end gap-1">
          {buckets.map((bucket) => {
            const maxAmount = Math.max(...buckets.map((b) => b.amount));
            const height =
              maxAmount > 0 ? (bucket.amount / maxAmount) * 100 : 0;
            return (
              <div
                className="flex flex-1 flex-col items-center gap-1"
                key={`bucket-${bucket.rate}`}
              >
                <div
                  className="w-full rounded-t bg-emerald-600/80 transition-all"
                  style={{ height: `${Math.max(height, 8)}%` }}
                />
                <span className="font-mono text-[10px] text-muted-foreground">
                  {bpsToPercent(bucket.rate)}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          <span>
            {buckets[0]?.amount
              ? mistToSui(BigInt(Math.floor(buckets[0].amount)))
              : "0"}{" "}
            SUI each
          </span>
          <span>{pool.numBuckets} orders</span>
        </div>
      </div>

      {/* Admin: Rebalance */}
      {isAdmin && (
        <Button
          className="w-full"
          disabled={txState.loading}
          onClick={handleRebalance}
          variant="outline"
        >
          {txState.loading ? "Rebalancing..." : "Rebalance Pool Orders"}
        </Button>
      )}

      {/* Success message */}
      {successDigest && (
        <div className="rounded-lg border border-emerald-500/50 bg-emerald-500/10 p-2 text-xs">
          <span className="text-emerald-600">Transaction confirmed!</span>{" "}
          <a
            className="font-mono text-emerald-600 underline"
            href={`https://suiscan.xyz/mainnet/tx/${successDigest}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            View on Explorer
          </a>
        </div>
      )}

      {/* Error */}
      {txState.error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-2 text-destructive text-xs">
          {txState.error}
        </div>
      )}

      {/* Deposit / Withdraw */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Deposit */}
        <div className="flex flex-col gap-2 rounded-lg border p-3">
          <Label className="font-medium text-sm" htmlFor="pool-deposit">
            Deposit SUI
          </Label>
          <Input
            className="font-mono"
            id="pool-deposit"
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="0.1"
            step="0.001"
            type="number"
            value={depositAmount}
          />
          {depositAmount && (
            <div className="text-muted-foreground text-xs">
              ≈ {depositAmount} SUI → LP shares
            </div>
          )}
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            disabled={!(depositAmount && isConnected) || txState.loading}
            onClick={handleDeposit}
            size="sm"
          >
            {txState.loading ? "Depositing..." : "Deposit"}
          </Button>
        </div>

        {/* Withdraw */}
        <div className="flex flex-col gap-2 rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <Label className="font-medium text-sm" htmlFor="pool-withdraw">
              Withdraw
            </Label>
            <Badge className="text-[10px]" variant="secondary">
              {Number(pool.totalShares).toLocaleString()} total shares
            </Badge>
          </div>
          <Input
            className="font-mono"
            id="pool-withdraw"
            onChange={(e) => setWithdrawShares(e.target.value)}
            placeholder="Shares to burn"
            type="number"
            value={withdrawShares}
          />
          {withdrawShares && (
            <div className="text-muted-foreground text-xs">
              Burns {Number(withdrawShares).toLocaleString()} shares
            </div>
          )}
          <Button
            disabled={!(withdrawShares && isConnected) || txState.loading}
            onClick={handleWithdraw}
            size="sm"
            variant="outline"
          >
            {txState.loading ? "Withdrawing..." : "Withdraw"}
          </Button>
        </div>
      </div>

      {!isConnected && (
        <p className="text-center text-muted-foreground text-xs">
          Connect wallet to manage pool positions on mainnet
        </p>
      )}
    </div>
  );
}
