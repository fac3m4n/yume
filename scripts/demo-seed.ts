/**
 * Yume Protocol — Demo Seed Script
 *
 * Places several orders on the mainnet order book so the Explorer
 * has visible transaction data to showcase.
 *
 * Usage:
 *   bun run scripts/demo-seed.ts
 *
 * Reads the deployer's keypair from ~/.sui/sui_config/sui.keystore
 */

import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";
import { readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

// ============================================================
// Configuration — from .env / hardcoded mainnet values
// ============================================================

const PACKAGE_ID =
  "0x220caae17de736a4f02d34c2e3a62deb7f7981e7eeb970ccb477c7b23576d3b7";
const ORDERBOOK_ID =
  "0x9f1c8ca3f0cbb7ab894c55127138ab166d61bcb7819a9797650077658185ca32";
const VAULT_ID =
  "0x066967dcf5824c80cb6ee46fe08d7e60d48d71361de5eb0ba10aff50c1acbd0a";
const POOL_ID =
  "0x5a58ad6e1119d485a2fc64fcdfab762de853772acba17569fbddbe46874a497d";
const SUI_TYPE = "0x2::sui::SUI";
const CLOCK_ID = "0x6";

// ============================================================
// Helper: Load keypair from Sui keystore
// ============================================================

function loadKeypairFromKeystore(): Ed25519Keypair {
  const keystorePath = join(homedir(), ".sui", "sui_config", "sui.keystore");
  const raw = readFileSync(keystorePath, "utf-8");
  const keys: string[] = JSON.parse(raw);

  if (keys.length === 0) {
    throw new Error("No keys found in sui.keystore");
  }

  // The keystore stores base64-encoded Bech32 private keys
  // Try each until we find an Ed25519 key
  for (const encodedKey of keys) {
    try {
      const decoded = decodeSuiPrivateKey(encodedKey);
      if (decoded.scheme === "ED25519") {
        return Ed25519Keypair.fromSecretKey(decoded.secretKey);
      }
    } catch {
      // Fallback: raw base64 decode
      try {
        const bytes = Buffer.from(encodedKey, "base64");
        // Sui keystore format: first byte is scheme flag (0 = ed25519)
        if (bytes[0] === 0) {
          return Ed25519Keypair.fromSecretKey(bytes.slice(1));
        }
      } catch {}
    }
  }

  throw new Error("No Ed25519 keypair found in keystore");
}

// ============================================================
// Main
// ============================================================

async function main() {
  console.log("=== Yume Protocol Demo Seed ===\n");

  // Initialize client
  const client = new SuiGrpcClient({
    network: "mainnet",
    baseUrl: "https://fullnode.mainnet.sui.io:443",
  });

  // Load keypair
  const keypair = loadKeypairFromKeystore();
  const address = keypair.getPublicKey().toSuiAddress();
  console.log(`Deployer address: ${address}`);

  // Check balance
  const balanceResult = await client.getBalance({ owner: address });
  console.log(
    `Balance: ${(Number(balanceResult.balance.balance) / 1e9).toFixed(4)} SUI\n`
  );

  const digests: string[] = [];

  // ============================================================
  // Step 1: Place 3 lend orders at different rates
  // ============================================================

  console.log("--- Placing Lend Orders ---");
  const lendOrders = [
    { amount: 100_000_000n, rate: 300, label: "Lend 0.1 SUI @ 3%" },
    { amount: 100_000_000n, rate: 500, label: "Lend 0.1 SUI @ 5%" },
    { amount: 100_000_000n, rate: 700, label: "Lend 0.1 SUI @ 7%" },
  ];

  for (const order of lendOrders) {
    const tx = new Transaction();
    const [depositCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(order.amount)]);

    tx.moveCall({
      target: `${PACKAGE_ID}::market::place_lend_order`,
      typeArguments: [SUI_TYPE, SUI_TYPE],
      arguments: [
        tx.object(ORDERBOOK_ID),
        depositCoin,
        tx.pure.u64(order.rate),
        tx.object(CLOCK_ID),
      ],
    });

    const result = await client.signAndExecuteTransaction({
      transaction: tx,
      signer: keypair,
      include: { effects: true },
    });

    const digest =
      result.$kind === "Transaction"
        ? result.Transaction.digest
        : result.FailedTransaction.digest;
    digests.push(digest);
    console.log(`  ${order.label} → ${digest}`);

    // Small delay to avoid rate limiting
    await sleep(1500);
  }

  // ============================================================
  // Step 2: Place 2 borrow orders
  // ============================================================

  console.log("\n--- Placing Borrow Orders ---");
  const borrowOrders = [
    { amount: 80_000_000n, rate: 400, label: "Borrow 0.08 SUI @ max 4%" },
    { amount: 80_000_000n, rate: 600, label: "Borrow 0.08 SUI @ max 6%" },
  ];

  for (const order of borrowOrders) {
    const tx = new Transaction();

    tx.moveCall({
      target: `${PACKAGE_ID}::market::place_borrow_order`,
      typeArguments: [SUI_TYPE, SUI_TYPE],
      arguments: [
        tx.object(ORDERBOOK_ID),
        tx.pure.u64(order.amount),
        tx.pure.u64(order.rate),
        tx.object(CLOCK_ID),
      ],
    });

    const result = await client.signAndExecuteTransaction({
      transaction: tx,
      signer: keypair,
      include: { effects: true },
    });

    const digest =
      result.$kind === "Transaction"
        ? result.Transaction.digest
        : result.FailedTransaction.digest;
    digests.push(digest);
    console.log(`  ${order.label} → ${digest}`);

    await sleep(1500);
  }

  // ============================================================
  // Step 3: Match + Settle
  // NOTE: Self-matching (same address for lend and borrow) is
  // prevented by the contract (ESelfMatch = 108). In production,
  // a different wallet would call match_orders. For the demo,
  // we skip this step but the 5 orders above are enough to
  // showcase real transactions in Explorer.
  // ============================================================

  console.log(
    "\n--- Match + Settle skipped (self-match not allowed by contract) ---"
  );
  console.log(
    "  To match, use a different wallet to borrow against these lend orders."
  );

  // ============================================================
  // Step 4: Deposit into the Liquidity Pool
  // ============================================================

  console.log("\n--- Depositing into Liquidity Pool ---");
  {
    const tx = new Transaction();
    const depositAmount = 200_000_000n; // 0.2 SUI

    const [depositCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(depositAmount)]);

    tx.moveCall({
      target: `${PACKAGE_ID}::pool::deposit`,
      typeArguments: [SUI_TYPE],
      arguments: [tx.object(POOL_ID), depositCoin],
    });

    const result = await client.signAndExecuteTransaction({
      transaction: tx,
      signer: keypair,
      include: { effects: true },
    });

    const digest =
      result.$kind === "Transaction"
        ? result.Transaction.digest
        : result.FailedTransaction.digest;
    digests.push(digest);
    console.log(`  Deposit 0.2 SUI → ${digest}`);
  }

  await sleep(1500);

  // ============================================================
  // Step 5: Rebalance Pool (places orders on the book from pool)
  // ============================================================

  console.log("\n--- Rebalancing Pool ---");
  {
    const tx = new Transaction();

    tx.moveCall({
      target: `${PACKAGE_ID}::market::rebalance_pool`,
      typeArguments: [SUI_TYPE, SUI_TYPE],
      arguments: [
        tx.object(POOL_ID),
        tx.object(ORDERBOOK_ID),
        tx.object(CLOCK_ID),
      ],
    });

    const result = await client.signAndExecuteTransaction({
      transaction: tx,
      signer: keypair,
      include: { effects: true },
    });

    const digest =
      result.$kind === "Transaction"
        ? result.Transaction.digest
        : result.FailedTransaction.digest;
    digests.push(digest);
    console.log(`  Rebalance → ${digest}`);
  }

  // ============================================================
  // Summary
  // ============================================================

  console.log("\n=== Demo Complete ===\n");
  console.log("Transaction Digests (for Sui Explorer):\n");
  digests.forEach((d, i) => {
    console.log(`  ${i + 1}. https://suiscan.xyz/mainnet/tx/${d}`);
  });

  console.log(
    `\nOrderBook: https://suiscan.xyz/mainnet/object/${ORDERBOOK_ID}`
  );
  console.log(`Vault: https://suiscan.xyz/mainnet/object/${VAULT_ID}`);
  console.log(`Pool: https://suiscan.xyz/mainnet/object/${POOL_ID}`);
  console.log(`Package: https://suiscan.xyz/mainnet/object/${PACKAGE_ID}`);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
