"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface LeverageStep {
  step: number;
  action: string;
  detail: string;
  sui: string;
  usdc: string;
}

const LEVERAGE_STEPS: LeverageStep[] = [
  {
    step: 1,
    action: "Start",
    detail: "User holds initial SUI collateral",
    sui: "100 SUI",
    usdc: "0 USDC",
  },
  {
    step: 2,
    action: "Deposit Collateral",
    detail: "Deposit 100 SUI into Yume vault",
    sui: "0 SUI (locked)",
    usdc: "0 USDC",
  },
  {
    step: 3,
    action: "Borrow USDC",
    detail: "Borrow 90 USDC against collateral (90% LTV)",
    sui: "0 SUI (locked)",
    usdc: "90 USDC",
  },
  {
    step: 4,
    action: "Swap on DeepBook",
    detail: "Swap 90 USDC to ~90 SUI on DeepBook CLOB",
    sui: "~90 SUI",
    usdc: "0 USDC",
  },
  {
    step: 5,
    action: "Deposit Again",
    detail: "Deposit ~90 SUI as additional collateral",
    sui: "0 SUI (190 locked)",
    usdc: "0 USDC",
  },
  {
    step: 6,
    action: "Borrow More",
    detail: "Borrow ~81 USDC against new collateral",
    sui: "0 SUI (190 locked)",
    usdc: "~81 USDC",
  },
];

export function LeverageDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAnimation = () => {
    setIsPlaying(true);
    setActiveStep(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= LEVERAGE_STEPS.length) {
        clearInterval(interval);
        setIsPlaying(false);
        return;
      }
      setActiveStep(step);
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">One-Click Leverage</h3>
          <p className="text-muted-foreground text-xs">
            6 operations in a single Sui PTB — atomic, no flash loans needed
          </p>
        </div>
        <Button
          disabled={isPlaying}
          onClick={playAnimation}
          size="sm"
          variant="outline"
        >
          {isPlaying ? "Playing..." : "Replay Demo"}
        </Button>
      </div>

      {/* PTB Flow Visualization */}
      <div className="rounded-lg border bg-muted/20 p-4">
        <div className="mb-3 font-mono text-muted-foreground text-xs">
          Programmable Transaction Block
        </div>

        <div className="flex flex-col gap-1">
          {LEVERAGE_STEPS.map((step, i) => {
            const isActive = i <= activeStep;
            const isCurrent = i === activeStep;
            return (
              <div
                className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all duration-300 ${
                  isCurrent
                    ? "border border-primary/30 bg-primary/10"
                    : isActive
                      ? "bg-muted/50"
                      : "opacity-40"
                }`}
                key={step.step}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-bold text-xs ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.step}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{step.action}</span>
                    {isCurrent && (
                      <span className="rounded bg-primary/20 px-1.5 py-0.5 text-primary text-xs">
                        current
                      </span>
                    )}
                  </div>
                  <p className="truncate text-muted-foreground text-xs">
                    {step.detail}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-mono text-rose-500 text-xs">
                    {step.sui}
                  </div>
                  <div className="font-mono text-emerald-600 text-xs">
                    {step.usdc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key insight */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
        <p className="text-muted-foreground text-xs">
          <span className="font-semibold text-foreground">
            Why Sui PTBs matter:
          </span>{" "}
          On Ethereum, this loop requires flash loans, multiple transactions,
          and complex smart contract interactions. On Sui, it&apos;s a single
          atomic transaction block — if any step fails, everything reverts. Zero
          risk of partial execution.
        </p>
        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
          <div className="rounded bg-muted p-2">
            <div className="font-bold text-lg">~1.9x</div>
            <div className="text-muted-foreground text-xs">Leverage</div>
          </div>
          <div className="rounded bg-muted p-2">
            <div className="font-bold text-lg">1</div>
            <div className="text-muted-foreground text-xs">Transaction</div>
          </div>
          <div className="rounded bg-muted p-2">
            <div className="font-bold text-lg">6</div>
            <div className="text-muted-foreground text-xs">Operations</div>
          </div>
        </div>
      </div>
    </div>
  );
}
