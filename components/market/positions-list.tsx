"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  bpsToPercent,
  DURATION_LABELS,
  STATUS_LABELS,
} from "@/hooks/sui/types";
import { usePositions } from "@/hooks/sui/use-market-data";

function formatAmount(amount: bigint): string {
  return Number(amount).toLocaleString();
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
  const { positions } = usePositions();

  if (positions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground text-sm">
          No active positions. Place an order to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {positions.map((pos) => {
        const isLend = pos.side === 0;
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
                  {formatAmount(pos.principal)} USDC
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
                <Button size="sm" variant="outline">
                  Repay
                </Button>
              )}
              <Button className="text-xs" size="sm" variant="ghost">
                Details
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
