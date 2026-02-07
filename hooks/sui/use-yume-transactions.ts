"use client";

/**
 * Yume Protocol — Transaction Execution Hook
 *
 * Wraps the PTB builder functions with dapp-kit wallet signing.
 * Provides a clean API for components to execute real on-chain transactions.
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
import {
  type MarketTypeArgs,
  ORDERBOOK_ID,
  PACKAGE_ID,
  POOL_ID,
  SUI_TYPE,
  VAULT_ID,
} from "./types";

/** Standard SUI/SUI market type args */
const SUI_SUI_TYPES: MarketTypeArgs = {
  base: SUI_TYPE,
  collateral: SUI_TYPE,
};

/** Transaction execution state */
export interface TxState {
  loading: boolean;
  error: string | null;
  digest: string | null;
}

/**
 * Hook that provides real transaction execution functions
 * for all Yume protocol operations.
 */
export function useYumeTransactions() {
  const dAppKit = useDAppKit();
  const account = useCurrentAccount();
  const connection = useWalletConnection();
  const [txState, setTxState] = useState<TxState>({
    loading: false,
    error: null,
    digest: null,
  });

  const isConnected = connection.isConnected;

  /**
   * Sign and execute a transaction, returning the digest.
   */
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

        // The result contains the digest
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

  /**
   * Place a lend order by splitting from the gas coin.
   * @param amountMist Amount in MIST to lend
   * @param rateBps Interest rate in basis points
   */
  const placeLendOrder = useCallback(
    async (amountMist: bigint, rateBps: number) => {
      if (!account?.address) return null;

      // Use tx.gas for SUI/SUI markets (split from gas coin)
      const tx = new Transaction();
      const [depositCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountMist)]);

      tx.moveCall({
        target: `${PACKAGE_ID}::market::place_lend_order`,
        typeArguments: [SUI_TYPE, SUI_TYPE],
        arguments: [
          tx.object(ORDERBOOK_ID),
          depositCoin,
          tx.pure.u64(rateBps),
          tx.object("0x6"), // Clock
        ],
      });

      return execute(tx);
    },
    [account?.address, execute]
  );

  /**
   * Place a borrow order.
   * @param amountMist Amount in MIST to borrow
   * @param rateBps Maximum interest rate in basis points
   */
  const placeBorrowOrder = useCallback(
    async (amountMist: bigint, rateBps: number) => {
      const tx = buildPlaceBorrowOrder(
        {
          bookId: ORDERBOOK_ID,
          amount: amountMist,
          rate: rateBps,
        },
        SUI_SUI_TYPES
      );
      return execute(tx);
    },
    [execute]
  );

  /**
   * Cancel an existing order.
   * @param orderId The order ID to cancel
   */
  const cancelOrder = useCallback(
    async (orderId: number) => {
      const tx = buildCancelOrder(
        { bookId: ORDERBOOK_ID, orderId },
        SUI_SUI_TYPES
      );
      return execute(tx);
    },
    [execute]
  );

  /**
   * Match and settle two orders.
   * @param takerOrderId The taker (borrow) order ID
   * @param makerOrderId The maker (lend) order ID
   * @param collateralAmountMist Collateral amount in MIST
   */
  const matchAndSettle = useCallback(
    async (
      takerOrderId: number,
      makerOrderId: number,
      collateralAmountMist: bigint
    ) => {
      // Split collateral from gas coin (SUI/SUI market)
      const tx = new Transaction();

      const [collateralCoin] = tx.splitCoins(tx.gas, [
        tx.pure.u64(collateralAmountMist),
      ]);

      // Match
      const [receipt] = tx.moveCall({
        target: `${PACKAGE_ID}::market::match_orders`,
        typeArguments: [SUI_TYPE, SUI_TYPE],
        arguments: [
          tx.object(ORDERBOOK_ID),
          tx.pure.u64(takerOrderId),
          tx.pure.u64(makerOrderId),
          tx.object("0x6"),
        ],
      });

      // Settle
      tx.moveCall({
        target: `${PACKAGE_ID}::market::settle`,
        typeArguments: [SUI_TYPE, SUI_TYPE],
        arguments: [
          receipt,
          collateralCoin,
          tx.object(ORDERBOOK_ID),
          tx.object(VAULT_ID),
          tx.object("0x6"),
        ],
      });

      return execute(tx);
    },
    [execute]
  );

  /**
   * Repay an active loan.
   * @param positionId LoanPosition object ID
   * @param principalMist Loan principal in MIST
   * @param rateBps Interest rate in basis points
   */
  const repayLoan = useCallback(
    async (positionId: string, principalMist: bigint, rateBps: number) => {
      // Calculate total due and split from gas
      const interest = (principalMist * BigInt(rateBps)) / BigInt(10_000);
      const totalDue = principalMist + interest;

      const tx = new Transaction();
      const [repayCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(totalDue)]);

      tx.moveCall({
        target: `${PACKAGE_ID}::market::repay`,
        typeArguments: [SUI_TYPE, SUI_TYPE],
        arguments: [
          tx.object(positionId),
          repayCoin,
          tx.object(VAULT_ID),
          tx.object("0x6"),
        ],
      });

      return execute(tx);
    },
    [execute]
  );

  // ============================================================
  // Pool Operations
  // ============================================================

  /**
   * Deposit SUI into the liquidity pool.
   * @param amountMist Amount in MIST to deposit
   */
  const depositToPool = useCallback(
    async (amountMist: bigint) => {
      const tx = new Transaction();
      const [depositCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountMist)]);

      tx.moveCall({
        target: `${PACKAGE_ID}::pool::deposit`,
        typeArguments: [SUI_TYPE],
        arguments: [tx.object(POOL_ID), depositCoin],
      });

      return execute(tx);
    },
    [execute]
  );

  /**
   * Withdraw from the liquidity pool by burning LP shares.
   * @param shares Number of LP shares to burn
   */
  const withdrawFromPool = useCallback(
    async (shares: bigint) => {
      const tx = buildPoolWithdraw({
        poolId: POOL_ID,
        sharesToBurn: Number(shares),
        typeArgs: SUI_SUI_TYPES,
      });
      return execute(tx);
    },
    [execute]
  );

  /**
   * Rebalance pool orders (admin only).
   */
  const rebalancePool = useCallback(async () => {
    const tx = buildRebalancePool({
      poolId: POOL_ID,
      bookId: ORDERBOOK_ID,
      typeArgs: SUI_SUI_TYPES,
    });
    return execute(tx);
  }, [execute]);

  /**
   * Liquidate an expired loan (permissionless).
   * @param loanId The loan ID to liquidate
   */
  const liquidate = useCallback(
    async (loanId: string) => {
      const tx = buildLiquidate({
        vaultId: VAULT_ID,
        loanId,
        typeArgs: SUI_SUI_TYPES,
      });
      return execute(tx);
    },
    [execute]
  );

  return {
    // State
    txState,
    isConnected,
    account,

    // Order operations
    placeLendOrder,
    placeBorrowOrder,
    cancelOrder,
    matchAndSettle,

    // Loan operations
    repayLoan,
    liquidate,

    // Pool operations
    depositToPool,
    withdrawFromPool,
    rebalancePool,

    // Low-level
    execute,
  };
}
