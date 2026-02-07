"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bpsToPercent } from "@/hooks/sui/types";

// Mock pool data
const MOCK_POOL = {
  admin: "0xAD...min",
  totalShares: BigInt(150_000),
  availableBalance: BigInt(30_000),
  deployedBalance: BigInt(120_000),
  minRate: 300,
  maxRate: 800,
  numBuckets: 6,
  isActive: true,
  userShares: BigInt(100_000),
};

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

export function PoolPanel() {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawShares, setWithdrawShares] = useState("");
  const pool = MOCK_POOL;

  const buckets = computeBuckets(
    pool.minRate,
    pool.maxRate,
    pool.numBuckets,
    pool.deployedBalance
  );

  const totalValue =
    Number(pool.availableBalance) + Number(pool.deployedBalance);
  const userValue =
    pool.totalShares > 0
      ? (Number(pool.userShares) * totalValue) / Number(pool.totalShares)
      : 0;
  const utilization =
    totalValue > 0
      ? ((Number(pool.deployedBalance) / totalValue) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="flex flex-col gap-5">
      {/* Pool Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border bg-card p-3">
          <div className="text-muted-foreground text-xs">Total Value</div>
          <div className="font-mono font-semibold text-sm">
            {totalValue.toLocaleString()} USDC
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
          <div className="text-muted-foreground text-xs">Your Value</div>
          <div className="font-mono font-semibold text-emerald-600 text-sm">
            {userValue.toLocaleString()} USDC
          </div>
        </div>
      </div>

      {/* Rate Distribution Visualization */}
      <div>
        <div className="mb-2 font-medium text-muted-foreground text-xs">
          Linear Curve — Order Distribution
        </div>
        <div className="flex h-24 items-end gap-1">
          {buckets.map((bucket, i) => {
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
          <span>{buckets[0]?.amount.toLocaleString()} USDC each</span>
          <span>{pool.numBuckets} orders</span>
        </div>
      </div>

      {/* Deposit / Withdraw */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Deposit */}
        <div className="flex flex-col gap-2 rounded-lg border p-3">
          <Label className="font-medium text-sm" htmlFor="pool-deposit">
            Deposit USDC
          </Label>
          <Input
            className="font-mono"
            id="pool-deposit"
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="10,000"
            type="number"
            value={depositAmount}
          />
          {depositAmount && (
            <div className="text-muted-foreground text-xs">
              You receive ~{Number(depositAmount).toLocaleString()} LP shares
            </div>
          )}
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            disabled={!depositAmount}
            size="sm"
          >
            Deposit
          </Button>
        </div>

        {/* Withdraw */}
        <div className="flex flex-col gap-2 rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <Label className="font-medium text-sm" htmlFor="pool-withdraw">
              Withdraw
            </Label>
            <Badge className="text-[10px]" variant="secondary">
              {Number(pool.userShares).toLocaleString()} shares
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
              You receive ~
              {pool.totalShares > 0
                ? Math.floor(
                    (Number(withdrawShares) * Number(pool.availableBalance)) /
                      Number(pool.totalShares)
                  ).toLocaleString()
                : 0}{" "}
              USDC (from available)
            </div>
          )}
          <Button disabled={!withdrawShares} size="sm" variant="outline">
            Withdraw
          </Button>
        </div>
      </div>

      <p className="text-center text-muted-foreground text-xs">
        Connect wallet to manage pool positions on testnet
      </p>
    </div>
  );
}
