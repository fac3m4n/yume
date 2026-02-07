"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useYumeTransactions } from "@/hooks/sui/use-yume-transactions";

type OrderSide = "lend" | "borrow";

/** Convert SUI amount (e.g. "0.1") to MIST (bigint) */
function suiToMist(sui: string): bigint {
  const num = Number.parseFloat(sui);
  if (isNaN(num) || num <= 0) return BigInt(0);
  return BigInt(Math.floor(num * 1e9));
}

/** Convert rate percentage (e.g. "5.00") to basis points (number) */
function percentToBps(pct: string): number {
  const num = Number.parseFloat(pct);
  if (isNaN(num) || num <= 0) return 0;
  return Math.round(num * 100);
}

export function PlaceOrderForm() {
  const [side, setSide] = useState<OrderSide>("lend");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [successDigest, setSuccessDigest] = useState<string | null>(null);

  const { placeLendOrder, placeBorrowOrder, txState, isConnected } =
    useYumeTransactions();

  const isLend = side === "lend";
  const amountMist = suiToMist(amount);
  const rateBps = percentToBps(rate);
  const canSubmit =
    isConnected && amountMist > 0 && rateBps > 0 && !txState.loading;

  async function handleSubmit() {
    setSuccessDigest(null);
    let digest: string | null = null;
    if (isLend) {
      digest = await placeLendOrder(amountMist, rateBps);
    } else {
      digest = await placeBorrowOrder(amountMist, rateBps);
    }
    if (digest) {
      setSuccessDigest(digest);
      setAmount("");
      setRate("");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Side toggle */}
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
        <button
          className={`rounded-md px-3 py-2 font-medium text-sm transition-colors ${
            isLend
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setSide("lend")}
          type="button"
        >
          Lend
        </button>
        <button
          className={`rounded-md px-3 py-2 font-medium text-sm transition-colors ${
            isLend
              ? "text-muted-foreground hover:text-foreground"
              : "bg-rose-500 text-white shadow-sm"
          }`}
          onClick={() => setSide("borrow")}
          type="button"
        >
          Borrow
        </button>
      </div>

      {/* Amount input */}
      <div className="flex flex-col gap-2">
        <Label className="text-sm" htmlFor="amount">
          {isLend ? "Deposit Amount (SUI)" : "Borrow Amount (SUI)"}
        </Label>
        <Input
          className="font-mono"
          id="amount"
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.1"
          step="0.001"
          type="number"
          value={amount}
        />
      </div>

      {/* Rate input */}
      <div className="flex flex-col gap-2">
        <Label className="text-sm" htmlFor="rate">
          {isLend ? "Interest Rate (%)" : "Max Rate (%)"}
        </Label>
        <Input
          className="font-mono"
          id="rate"
          onChange={(e) => setRate(e.target.value)}
          placeholder={isLend ? "5.00" : "8.00"}
          step="0.01"
          type="number"
          value={rate}
        />
      </div>

      {/* Summary */}
      {amount && rate && (
        <div className="space-y-1 rounded-lg bg-muted/50 p-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {isLend ? "You deposit" : "You receive"}
            </span>
            <span className="font-medium font-mono">{amount} SUI</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Interest rate</span>
            <span className="font-medium font-mono">{rate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Term</span>
            <span className="font-medium font-mono">7 Days</span>
          </div>
          {isLend && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expected return</span>
              <span className="font-medium font-mono text-emerald-600">
                {(
                  Number(amount) +
                  (Number(amount) * Number(rate)) / 100
                ).toFixed(4)}{" "}
                SUI
              </span>
            </div>
          )}
          {!isLend && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Collateral needed</span>
              <span className="font-medium font-mono text-rose-500">
                ~{((Number(amount) * 10_000) / 9000).toFixed(4)} SUI
              </span>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {txState.error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-2 text-destructive text-xs">
          {txState.error}
        </div>
      )}

      {/* Success */}
      {successDigest && (
        <div className="rounded-lg border border-emerald-500/50 bg-emerald-500/10 p-2 text-xs">
          <span className="text-emerald-600">Order placed!</span>{" "}
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

      {/* Submit */}
      <Button
        className={`w-full font-medium ${
          isLend
            ? "bg-emerald-600 hover:bg-emerald-700"
            : "bg-rose-500 hover:bg-rose-600"
        }`}
        disabled={!canSubmit}
        onClick={handleSubmit}
      >
        {txState.loading ? (
          <span className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Confirming...
          </span>
        ) : isLend ? (
          "Place Lend Order"
        ) : (
          "Place Borrow Order"
        )}
      </Button>

      {!isConnected && (
        <p className="text-center text-muted-foreground text-xs">
          Connect wallet to place orders on mainnet
        </p>
      )}
    </div>
  );
}
