"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type OrderSide = "lend" | "borrow";

export function PlaceOrderForm() {
  const [side, setSide] = useState<OrderSide>("lend");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");

  const isLend = side === "lend";

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
          {isLend ? "Deposit Amount (USDC)" : "Borrow Amount (USDC)"}
        </Label>
        <Input
          className="font-mono"
          id="amount"
          onChange={(e) => setAmount(e.target.value)}
          placeholder="50,000"
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
            <span className="font-medium font-mono">
              {Number(amount).toLocaleString()} USDC
            </span>
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
                ).toLocaleString()}{" "}
                USDC
              </span>
            </div>
          )}
          {!isLend && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Collateral needed</span>
              <span className="font-medium font-mono text-rose-500">
                ~{Math.ceil((Number(amount) * 10_000) / 9000).toLocaleString()}{" "}
                SUI
              </span>
            </div>
          )}
        </div>
      )}

      {/* Submit */}
      <Button
        className={`w-full font-medium ${
          isLend
            ? "bg-emerald-600 hover:bg-emerald-700"
            : "bg-rose-500 hover:bg-rose-600"
        }`}
        disabled={!(amount && rate)}
      >
        {isLend ? "Place Lend Order" : "Place Borrow Order"}
      </Button>

      <p className="text-center text-muted-foreground text-xs">
        Connect wallet to place orders on testnet
      </p>
    </div>
  );
}
