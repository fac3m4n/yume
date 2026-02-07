"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  bpsToPercent,
  DURATION_LABELS,
  STATUS_LABELS,
} from "@/hooks/sui/types";
import { mistToSui, usePositions } from "@/hooks/sui/use-market-data";
import { useYumeTransactions } from "@/hooks/sui/use-yume-transactions";

function formatAmount(amount: bigint): string {
  return mistToSui(amount);
}

function timeRemaining(maturityTime: number): string {
  const now = Date.now();
  const diff = maturityTime - now;
  if (diff <= 0) return "Expired";
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
}

export function PositionsList() {
  const { positions, loading, error, refetch } = usePositions();
  const { repayLoan, txState, isConnected } = useYumeTransactions();
  const [repayingId, setRepayingId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Loading positions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-destructive text-sm">{error}</p>
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground text-sm">
          {isConnected
            ? "No active positions. Place an order to get started."
            : "Connect your wallet to view positions."}
        </p>
      </div>
    );
  }

  async function handleRepay(pos: (typeof positions)[0]) {
    setRepayingId(pos.id);
    const digest = await repayLoan(pos.id, pos.principal, pos.rate);
    if (digest) {
      refetch();
    }
    setRepayingId(null);
  }

  return (
    <div className="flex flex-col gap-3">
      {positions.map((pos) => {
        const isLend = pos.side === 0;
        const isRepaying = repayingId === pos.id;
        return (
          <div
            className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/30"
            key={pos.id}
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Badge
                  className={
                    isLend ? "bg-emerald-600 hover:bg-emerald-700" : ""
                  }
                  variant={isLend ? "default" : "destructive"}
                >
                  {isLend ? "Lending" : "Borrowing"}
                </Badge>
                <Badge variant="outline">{STATUS_LABELS[pos.status]}</Badge>
                <Badge variant="secondary">
                  {DURATION_LABELS[pos.duration] ?? `${pos.duration}s`}
                </Badge>
              </div>
              <div className="flex items-baseline gap-4 text-sm">
                <span className="font-mono font-semibold">
                  {formatAmount(pos.principal)} SUI
                </span>
                <span className="text-muted-foreground">
                  @ {bpsToPercent(pos.rate)}
                </span>
                <span className="text-muted-foreground">
                  {timeRemaining(pos.maturityTime)} remaining
                </span>
              </div>
              <div className="text-muted-foreground text-xs">
                Collateral: {formatAmount(pos.collateralAmount)} SUI
              </div>
            </div>

            <div className="flex gap-2">
              {!isLend && pos.status === 0 && (
                <Button
                  disabled={isRepaying}
                  onClick={() => handleRepay(pos)}
                  size="sm"
                  variant="outline"
                >
                  {isRepaying ? "Repaying..." : "Repay"}
                </Button>
              )}
              <Button
                className="text-xs"
                onClick={() => {
                  window.open(
                    `https://suiscan.xyz/mainnet/object/${pos.id}`,
                    "_blank"
                  );
                }}
                size="sm"
                variant="ghost"
              >
                Explorer
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
