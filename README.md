# Yume Protocol

**Peer-to-peer fixed-rate lending on Sui.** Order book matching, hybrid liquidity pools, and atomic settlement via Programmable Transaction Blocks -- live on mainnet.

## Why Yume

DeFi lending today is dominated by variable-rate pool models. Borrowers have no rate certainty, lenders compete for scraps, and liquidity is passively allocated. Yume flips this:

- **Fixed rates, fixed terms.** Lenders and borrowers name their price on a central limit order book.
- **Hybrid liquidity.** Passive depositors earn yield through an auto-rebalancing pool that places orders across rate buckets.
- **Atomic composability.** The Hot Potato pattern enforces that match + settle execute in a single PTB -- or not at all.
- **Multi-market.** Three live markets (SUI/SUI, USDC/SUI, DEEP/SUI) with shared infrastructure.

## Architecture

```
                          Programmable Transaction Block
                  ┌──────────────────────────────────────────┐
                  │                                          │
                  │  place_borrow_order ──► match_orders     │
                  │                           │              │
                  │                     MatchReceipt         │
                  │                     (hot potato)         │
                  │                           │              │
                  │                        settle            │
                  │                       /       \          │
                  │            LoanPosition    LoanPosition  │
                  │              (lender)       (borrower)   │
                  └──────────────────────────────────────────┘
```

| Module | Role |
|---|---|
| `orderbook` | CLOB with rate-sorted lend/borrow orders stored in a `Table` via dynamic fields |
| `market` | Entry functions that compose orderbook, vault, and position modules |
| `vault` | Collateral custody -- locks on settle, releases on repay, seizes on liquidation |
| `position` | `LoanPosition` NFTs minted to both lender and borrower at settlement |
| `pool` | Hybrid liquidity pool with LP shares and admin-triggered rebalance |

**Key Sui patterns used:** Hot Potato (`MatchReceipt`), Dynamic Fields (order storage, collateral tracking), Shared Objects (OrderBook, Vault, Pool), Owned Objects (LoanPosition NFTs).

## Live on Mainnet

| Contract | Object ID |
|---|---|
| **Package** | [`0x220c...d3b7`](https://suiscan.xyz/mainnet/object/0x220caae17de736a4f02d34c2e3a62deb7f7981e7eeb970ccb477c7b23576d3b7) |

| Market | OrderBook | Vault | Pool |
|---|---|---|---|
| **SUI / SUI** | [`0x9f1c...ca32`](https://suiscan.xyz/mainnet/object/0x9f1c8ca3f0cbb7ab894c55127138ab166d61bcb7819a9797650077658185ca32) | [`0x0669...bd0a`](https://suiscan.xyz/mainnet/object/0x066967dcf5824c80cb6ee46fe08d7e60d48d71361de5eb0ba10aff50c1acbd0a) | [`0x5a58...497d`](https://suiscan.xyz/mainnet/object/0x5a58ad6e1119d485a2fc64fcdfab762de853772acba17569fbddbe46874a497d) |
| **USDC / SUI** | [`0x889a...2d2a`](https://suiscan.xyz/mainnet/object/0x889aa1b1098a17ec75722d5c5bed4bf5787b7d7420c97d982a88dce164e12d2a) | [`0x8058...9308`](https://suiscan.xyz/mainnet/object/0x805856187af190fdb47b2b7f20243e68be98b12f634e0b811607eaf2c02d9308) | -- |
| **DEEP / SUI** | [`0xf9c1...bd4b`](https://suiscan.xyz/mainnet/object/0xf9c1acf269c3a143356c80188e91d0d32c8e86cf842787347d02c62a6093bd4b) | [`0x1040...5cc1`](https://suiscan.xyz/mainnet/object/0x10404ae83a15619a015306cc76f5f31c3f9b4529cfc9313749dcbad3339f5cc1) | -- |

## Tech Stack

| Layer | Technology |
|---|---|
| Smart contracts | Sui Move (Edition 2024.beta) |
| Frontend | Next.js 16, React, TypeScript, Tailwind CSS, shadcn/ui |
| Wallet integration | `@mysten/dapp-kit-react` v1, `@mysten/sui` v2 (gRPC) |
| On-chain data | Live polling via `SuiGrpcClient` -- dynamic field reads, owned object queries |

## Getting Started

```bash
# Install dependencies
bun install

# Run the development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to launch the app.

### Environment

The app reads contract addresses from `.env`. All values are pre-configured for Sui mainnet:

```
NEXT_PUBLIC_SUI_NETWORK=mainnet
NEXT_PUBLIC_YUME_PACKAGE_ID=0x220c...
NEXT_PUBLIC_ORDERBOOK_ID=0x9f1c...
NEXT_PUBLIC_VAULT_ID=0x0669...
NEXT_PUBLIC_POOL_ID=0x5a58...
NEXT_PUBLIC_MARKET_USDC_SUI_OB=0x889a...
NEXT_PUBLIC_MARKET_USDC_SUI_VAULT=0x8058...
NEXT_PUBLIC_MARKET_DEEP_SUI_OB=0xf9c1...
NEXT_PUBLIC_MARKET_DEEP_SUI_VAULT=0x1040...
```

## Project Structure

```
yume/
├── app/                    # Next.js pages
│   ├── page.tsx            # Landing
│   ├── market/page.tsx     # Trading interface (order book, orders, pool, PTB demo)
│   ├── portfolio/page.tsx  # Cross-market portfolio view
│   └── docs/page.tsx       # Protocol documentation & contract reference
├── components/
│   ├── layout/             # Shared header
│   └── market/             # Order book, order form, positions, pool, match & settle
├── contracts/              # Sui Move smart contracts
│   └── sources/            # orderbook.move, vault.move, position.move, pool.move, market.move
├── hooks/sui/
│   ├── types.ts            # MarketConfig, MARKETS array, on-chain interfaces
│   ├── transactions.ts     # PTB builder functions
│   ├── use-market-context.tsx  # Selected market React context
│   ├── use-market-data.ts  # Live on-chain data hooks (order book, positions, pool)
│   └── use-yume-transactions.ts  # Transaction execution hook
└── scripts/
    └── demo-seed.ts        # Mainnet seeding script
```

## Features

- **Multi-market order book** -- Switch between SUI/SUI, USDC/SUI, and DEEP/SUI with a single click. Live 15-second polling with immediate refresh after transactions.
- **Place & cancel orders** -- Lend or borrow at your chosen rate. Cancel anytime before matching.
- **Quick Borrow (Match & Settle)** -- Select a lend order, configure your borrow, and execute a 3-step atomic PTB: `place_borrow_order` -> `match_orders` -> `settle`.
- **Hybrid liquidity pool** -- Deposit SUI for passive yield. Admin rebalance distributes liquidity across rate buckets.
- **Portfolio** -- View all your positions and orders across every market in one place.
- **Docs** -- In-app protocol reference with live contract addresses linked to Explorer.

## License

MIT
