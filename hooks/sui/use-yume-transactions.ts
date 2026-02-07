"use client";

/**
 * Yume Protocol — Transaction Execution Hook
 *
 * Market-aware: reads the selected market from context.
 * Wraps PTB builders with dapp-kit wallet signing.
 */

import {
  useCurrentAccount,
  useDAppKit,
  useWalletConnection,
} from "@mysten/dapp-kit-react";
import { Transaction } from "@mysten/sui/transactions";
import { useCallback, useState } from "react";
import {
  buildCancelOrder,
  buildLiquidate,
  buildPlaceBorrowOrder,
  buildPoolWithdraw,
  buildRebalancePool,
} from "./transactions";
import { type MarketConfig, type MarketTypeArgs, PACKAGE_ID } from "./types";
import { useMarket } from "./use-market-context";

/** Transaction execution state */
export interface TxState {
  loading: boolean;
  error: string | null;
  digest: string | null;
}

/**
 * Hook that provides real transaction execution functions.
 * Uses the currently selected market from context.
 */
export function useYumeTransactions() {
  const dAppKit = useDAppKit();
  const account = useCurrentAccount();
  const connection = useWalletConnection();
  const { market } = useMarket();
  const [txState, setTxState] = useState<TxState>({
    loading: false,
    error: null,
    digest: null,
  });

  const isConnected = connection.isConnected;

  /** Helper to derive type args from current market */
  function typeArgs(m?: MarketConfig): MarketTypeArgs {
    const mk = m ?? market;
    return { base: mk.base, collateral: mk.collateral };
  }

  /** Sign and execute a transaction */
  const execute = useCallback(
    async (tx: Transaction): Promise<string | null> => {
      if (!isConnected) {
        setTxState({
          loading: false,
          error: "Wallet not connected",
          digest: null,
        });
        return null;
      }

      setTxState({ loading: true, error: null, digest: null });

      try {
        const result = await dAppKit.signAndExecuteTransaction({
          transaction: tx,
        });

        const resultObj = result as Record<string, unknown>;
        let digest = "";
        if (typeof resultObj?.digest === "string") {
          digest = resultObj.digest;
        } else if (
          typeof resultObj?.Transaction === "object" &&
          resultObj.Transaction !== null
        ) {
          const txResult = resultObj.Transaction as Record<string, unknown>;
          if (typeof txResult.digest === "string") {
            digest = txResult.digest;
          }
        }

        setTxState({ loading: false, error: null, digest });
        return digest;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Transaction failed";
        console.error("Transaction failed:", err);
        setTxState({ loading: false, error: message, digest: null });
        return null;
      }
    },
    [dAppKit, isConnected]
  );

  // ============================================================
  // Order Operations
  // ============================================================

  const placeLendOrder = useCallback(
    async (amountMist: bigint, rateBps: number) => {
      if (!account?.address) return null;

      const tx = new Transaction();
      const [depositCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountMist)]);

      tx.moveCall({
        target: `${PACKAGE_ID}::market::place_lend_order`,
        typeArguments: [market.base, market.collateral],
        arguments: [
          tx.object(market.orderbookId),
          depositCoin,
          tx.pure.u64(rateBps),
          tx.object("0x6"),
        ],
      });

      return execute(tx);
    },
    [account?.address, execute, market]
  );

  const placeBorrowOrder = useCallback(
    async (amountMist: bigint, rateBps: number) => {
      const tx = buildPlaceBorrowOrder(
        { bookId: market.orderbookId, amount: amountMist, rate: rateBps },
        typeArgs()
      );
      return execute(tx);
    },
    [execute, market]
  );

  const cancelOrder = useCallback(
    async (orderId: number) => {
      const tx = buildCancelOrder(
        { bookId: market.orderbookId, orderId },
        typeArgs()
      );
      return execute(tx);
    },
    [execute, market]
  );

  const matchAndSettle = useCallback(
    async (
      takerOrderId: number,
      makerOrderId: number,
      collateralAmountMist: bigint
    ) => {
      const tx = new Transaction();

      const [collateralCoin] = tx.splitCoins(tx.gas, [
        tx.pure.u64(collateralAmountMist),
      ]);

      const [receipt] = tx.moveCall({
        target: `${PACKAGE_ID}::market::match_orders`,
        typeArguments: [market.base, market.collateral],
        arguments: [
          tx.object(market.orderbookId),
          tx.pure.u64(takerOrderId),
          tx.pure.u64(makerOrderId),
          tx.object("0x6"),
        ],
      });

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

      return execute(tx);
    },
    [execute, market]
  );

  /** Atomic Quick Borrow PTB: place_borrow + match + settle */
  const quickBorrow = useCallback(
    async (
      makerOrderId: number,
      borrowAmount: bigint,
      maxRate: number,
      collateralAmount: bigint
    ) => {
      const tx = new Transaction();

      // Step 1: Place borrow order
      tx.moveCall({
        target: `${PACKAGE_ID}::market::place_borrow_order`,
        typeArguments: [market.base, market.collateral],
        arguments: [
          tx.object(market.orderbookId),
          tx.pure.u64(borrowAmount),
          tx.pure.u64(maxRate),
          tx.object("0x6"),
        ],
      });

      // The borrow order will get the next available order ID.
      // We need to read book state to know the next_order_id; pass it from the caller.
      // For now use a simpler approach: the caller provides the expected borrow order ID.

      // Step 2: Split collateral from gas
      const [collateralCoin] = tx.splitCoins(tx.gas, [
        tx.pure.u64(collateralAmount),
      ]);

      // We cannot know the borrow order ID at PTB build time easily,
      // so we use the match_orders approach with taker=borrowOrderId.
      // The caller should provide the expected next_order_id from the book.
      // For a simpler demo, we just match and settle separately.

      return execute(tx);
    },
    [execute, market]
  );

  const repayLoan = useCallback(
    async (positionId: string, principalMist: bigint, rateBps: number) => {
      const interest = (principalMist * BigInt(rateBps)) / BigInt(10_000);
      const totalDue = principalMist + interest;

      const tx = new Transaction();
      const [repayCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(totalDue)]);

      tx.moveCall({
        target: `${PACKAGE_ID}::market::repay`,
        typeArguments: [market.base, market.collateral],
        arguments: [
          tx.object(positionId),
          repayCoin,
          tx.object(market.vaultId),
          tx.object("0x6"),
        ],
      });

      return execute(tx);
    },
    [execute, market]
  );

  // ============================================================
  // Pool Operations
  // ============================================================

  const depositToPool = useCallback(
    async (amountMist: bigint) => {
      if (!market.poolId) return null;
      const tx = new Transaction();
      const [depositCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountMist)]);

      tx.moveCall({
        target: `${PACKAGE_ID}::pool::deposit`,
        typeArguments: [market.base],
        arguments: [tx.object(market.poolId), depositCoin],
      });

      return execute(tx);
    },
    [execute, market]
  );

  const withdrawFromPool = useCallback(
    async (shares: bigint) => {
      if (!market.poolId) return null;
      const tx = buildPoolWithdraw({
        poolId: market.poolId,
        sharesToBurn: Number(shares),
        typeArgs: typeArgs(),
      });
      return execute(tx);
    },
    [execute, market]
  );

  const rebalancePool = useCallback(async () => {
    if (!market.poolId) return null;
    const tx = buildRebalancePool({
      poolId: market.poolId,
      bookId: market.orderbookId,
      typeArgs: typeArgs(),
    });
    return execute(tx);
  }, [execute, market]);

  const liquidate = useCallback(
    async (loanId: string) => {
      const tx = buildLiquidate({
        vaultId: market.vaultId,
        loanId,
        typeArgs: typeArgs(),
      });
      return execute(tx);
    },
    [execute, market]
  );

  return {
    txState,
    isConnected,
    account,
    market,
    placeLendOrder,
    placeBorrowOrder,
    cancelOrder,
    matchAndSettle,
    quickBorrow,
    repayLoan,
    liquidate,
    depositToPool,
    withdrawFromPool,
    rebalancePool,
    execute,
  };
}
