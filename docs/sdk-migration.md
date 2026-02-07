# Migrate to 2.0 (/sui/migrations/sui-2.0)



This guide covers the breaking changes across the latest release of all the `@mysten/*` packages.

The primary goal of this release is to support the new GRPC and GraphQL APIs across all the mysten
SDKs. These releases also include removals of deprecated APIs, some renaming for better consistency,
and significant internal refactoring to improve maintainability. Starting with this release, Mysten
packages will now be published as ESM only packages.

## Quick Reference

| Package                                                               | Key Changes                                                                              |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [@mysten/sui](/sui/migrations/sui-2.0/sui)                            | Client API stabilization, SuiClient removal, BCS schema alignment, transaction executors |
| [@mysten/dapp-kit](/sui/migrations/sui-2.0/dapp-kit)                  | Complete rewrite with framework-agnostic core                                            |
| [@mysten/kiosk](/sui/migrations/sui-2.0/kiosk)                        | Client extension pattern, low-level helpers removed, KioskTransaction pattern            |
| [@mysten/zksend](/sui/migrations/sui-2.0/zksend)                      | Client extension pattern                                                                 |
| [@mysten/suins](/sui/migrations/sui-2.0/suins)                        | Client extension pattern                                                                 |
| [@mysten/deepbook-v3](/sui/migrations/sui-2.0/deepbook-v3)            | Client extension pattern                                                                 |
| [@mysten/walrus](/sui/migrations/sui-2.0/walrus)                      | Client extension pattern, requires client instead of RPC URL                             |
| [@mysten/seal](/sui/migrations/sui-2.0/seal)                          | Client extension pattern                                                                 |
| [@mysten/wallet-standard](/sui/migrations/sui-2.0/wallet-builders)    | Removal of reportTransactionEffects, new core API response format                        |
| [Migrating from JSON-RPC](/sui/migrations/sui-2.0/json-rpc-migration) | Migrate from deprecated JSON-RPC to gRPC and GraphQL                                     |

## Common Migration Patterns

### ESM Migration

All `@mysten/*` packages are now ESM only. If you are using `moduleResolution` `"Node"`,
`"Classic"`, or `"Node10"`, you will need to update your `tsconfig.json` to use `"NodeNext"`,
`"Node16"`, or `"Bundler"`:

```json
{
	"compilerOptions": {
		"moduleResolution": "NodeNext",
		"module": "NodeNext"
	}
}
```

This enables proper resolution of the SDK's subpath exports (e.g., `@mysten/sui/client`,
`@mysten/sui/transactions`).

If you maintain a library that depends on any of the `@mysten/*` packages, you may also need to
update your library to be ESM only to ensure it works correctly everywhere.

Applications using bundlers and recent Node.js versions (>=22) may still work when using `require`
to load ESM packages, but we recommend migrating to ESM.

**Why ESM only?** Many packages in the ecosystem (specifically critical cryptography dependencies)
are now published as ESM only. Supporting CommonJS has prevented us from using the latest versions
of these dependencies, making our SDKs harder to maintain and risking missing critical security
updates.

### Client Migration

The most common change across all SDKs is migrating from `SuiClient` to `SuiJsonRpcClient`:

```diff
- import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
+ import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';

- const client = new SuiClient({ url: getFullnodeUrl('mainnet') });
+ const client = new SuiJsonRpcClient({
+   url: getJsonRpcFullnodeUrl('mainnet'),
+   network: 'mainnet',
+ });
```

We also recommend moving from the deprecated JSON RPC Apis to the new gRPC API as soon as possible:

```diff
- import { SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
+ import { SuiGrpcClient } from '@mysten/sui/grpc';

- const client = new SuiJsonRpcClient({ url, network: 'mainnet' });
+ const client = new SuiGrpcClient({ baseUrl, network: 'mainnet' });
```

The gRPC runs on full nodes so in most cases you should be able to use the same URLs when migrating
to gRPC.

### Network Parameter Required

All client constructors now require an explicit `network` parameter:

```ts
const client = new SuiJsonRpcClient({
	url: getJsonRpcFullnodeUrl('mainnet'),
	network: 'mainnet', // Required
});

const graphqlClient = new SuiGraphQLClient({
	url: 'https://sui-mainnet.mystenlabs.com/graphql',
	network: 'mainnet', // Required
});

const grpcClient = new SuiGrpcClient({
	baseUrl: 'https://fullnode.mainnet.sui.io:443',
	network: 'mainnet', // Required
});
```

### ClientWithCoreApi Interface

Many SDK methods now accept any client implementing `ClientWithCoreApi`, enabling use with JSON-RPC,
GraphQL, or gRPC transports:

```ts
import { SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
import { SuiGraphQLClient } from '@mysten/sui/graphql';
import { SuiGrpcClient } from '@mysten/sui/grpc';

// All of these work with APIs that accept ClientWithCoreApi
const jsonRpcClient = new SuiJsonRpcClient({ url, network: 'mainnet' });
const graphqlClient = new SuiGraphQLClient({ url, network: 'mainnet' });
const grpcClient = new SuiGrpcClient({ baseUrl, network: 'mainnet' });
```

## Package-Specific Guides

For detailed migration instructions, see the SDK-specific guides:

* **[@mysten/sui](/sui/migrations/sui-2.0/sui)** - Core SDK changes including client API, BCS
  schemas, transactions, zkLogin, and GraphQL
* **[@mysten/dapp-kit](/sui/migrations/sui-2.0/dapp-kit)** - Complete migration guide for the new
  dApp Kit architecture
* **[@mysten/kiosk](/sui/migrations/sui-2.0/kiosk)** - Kiosk SDK now exports a client extension,
  low-level helpers removed
* **[@mysten/zksend](/sui/migrations/sui-2.0/zksend)** - zkSend SDK now exports a client extension
* **[@mysten/suins](/sui/migrations/sui-2.0/suins)** - SuiNS now exports a client extension
* **[@mysten/deepbook-v3](/sui/migrations/sui-2.0/deepbook-v3)** - DeepBook DEX now exports a client
  extension
* **[@mysten/walrus](/sui/migrations/sui-2.0/walrus)** - Walrus storage now exports a client
  extension
* **[@mysten/seal](/sui/migrations/sui-2.0/seal)** - Seal encryption now exports a client extension

## Transport Migration

* **[Migrating from JSON-RPC](/sui/migrations/sui-2.0/json-rpc-migration)** - Migrate from the
  deprecated JSON-RPC client to gRPC and GraphQL

## Ecosystem Migration Guides

For wallet builders and SDK maintainers building on the Sui ecosystem:

* **[Wallet Builders](/sui/migrations/sui-2.0/wallet-builders)** - Guide for wallet implementations
  adapting to `reportTransactionEffects` removal and new core API response format
* **[SDK Maintainers](/sui/migrations/sui-2.0/sdk-maintainers)** - Guide for SDK authors migrating
  to `ClientWithCoreApi` and the new transport-agnostic architecture


---

# Agent Migration Prompt (/sui/migrations/sui-2.0/agent-prompt)



Copy and paste the following prompt into your AI coding assistant (Claude Code, Cursor, etc.) to
migrate your codebase to v2. If a planning mode is available we recommend starting there first.

```txt
## Sui TypeScript SDK v2 Migration

Migrate this codebase to the latest version of `@mysten/*` packages.

### Step 1: Identify Project Tools

Examine the project to identify:
- Package manager (npm, pnpm, yarn, bun) - check for lock files
- Build tools and scripts in package.json
- Type checking, linting, and test commands

### Step 2: Read the Migration Guide

Fetch and read the full migration guide from:
https://sdk.mystenlabs.com/sui/migrations/sui-2.0/llms.txt

This file contains the migration instructions for most affected @mysten package, but please be sure to install the
latest version of all @mysten packages even if they do not have an explicit migration guide

### Step 3: Migrate

Apply the migration patterns from the guide. Do not make changes without first reading the relevant section of the migration guide.

### Step 4: Validate

Run all validation scripts to verify the migration including:

* Type check
* Lint
* Build
* Test

Fix all errors before considering the migration complete.
```


---

# @mysten/dapp-kit (/sui/migrations/sui-2.0/dapp-kit)



This guide helps you migrate from the original `@mysten/dapp-kit` (legacy) to the new
`@mysten/dapp-kit-react` package.

<Callout type="info">
  The legacy `@mysten/dapp-kit` package will continue to work with the latest SDK, but it only
  supports JSON-RPC and will not receive further updates. We recommend migrating to
  `@mysten/dapp-kit-react` for new features and gRPC support.
</Callout>

## Overview

The new dApp Kit SDK represents a complete rewrite with these key changes:

* **Framework agnostic**: Split into `@mysten/dapp-kit-core` (framework-agnostic) and
  `@mysten/dapp-kit-react` (React bindings)
* **No React Query dependency**: Direct promise-based API instead of mutation hooks
* **Web Components**: UI components built with Lit Elements for cross-framework compatibility
* **Smaller bundle size**: No React Query dependency, lighter state management with nanostores
* **Better SSR support**: Compatible with SSR frameworks like Next.js
* **Cross-framework compatibility**: Core functionality can be used in vanilla JS, Vue, React, and
  other frameworks

## Step-by-Step Migration

### 1. Update Dependencies

Remove the old package and install the new ones:

```bash
npm uninstall @mysten/dapp-kit
npm i @mysten/dapp-kit-react @mysten/dapp-kit-core @mysten/sui
```

### 2. Create dApp Kit Instance

Create a new instance of the dApp Kit using the `createDAppKit` function and register the global
type.

```tsx
// dapp-kit.ts
import { createDAppKit } from '@mysten/dapp-kit-react';
import { SuiGrpcClient } from '@mysten/sui/grpc';

const GRPC_URLS = {
	testnet: 'https://fullnode.testnet.sui.io:443',
};

export const dAppKit = createDAppKit({
	networks: ['testnet'],
	createClient(network) {
		return new SuiGrpcClient({ network, baseUrl: GRPC_URLS[network] });
	},
});

// global type registration necessary for the hooks to work correctly
declare module '@mysten/dapp-kit-react' {
	interface Register {
		dAppKit: typeof dAppKit;
	}
}
```

### 3. Register Types

The `declare module` block in the previous step registers your dApp Kit instance's type globally.
This enables all hooks like `useDAppKit()`, `useCurrentNetwork()`, and `useCurrentClient()` to
automatically infer the correct types based on your configuration (e.g., your specific networks and
client type).

```tsx
declare module '@mysten/dapp-kit-react' {
	interface Register {
		dAppKit: typeof dAppKit;
	}
}
```

Without this registration, hooks return generic types and you lose type safety for things like
network names. If you prefer not to use global type registration, you can pass the `dAppKit`
instance explicitly to each hook instead:

```tsx
const connection = useWalletConnection({ dAppKit });
const network = useCurrentNetwork({ dAppKit });
```

### 4. Replace Provider Setup

Replace the nested dApp Kit providers with a single unified provider. You can keep your existing
`QueryClientProvider` for data fetching.

```diff
  // App.tsx
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
- import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
+ import { DAppKitProvider } from '@mysten/dapp-kit-react';
+ import { dAppKit } from './dapp-kit.ts';

  export function App() {
  	const queryClient = new QueryClient();
- 	const networkConfig = {
- 		mainnet: { url: 'https://mainnet.sui.io:443' },
- 		testnet: { url: 'https://testnet.sui.io:443' },
- 	};

  	return (
  		<QueryClientProvider client={queryClient}>
- 			<SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
- 				<WalletProvider>
- 					<App />
- 				</WalletProvider>
- 			</SuiClientProvider>
+ 			<DAppKitProvider dAppKit={dAppKit}>
+ 				<App />
+ 			</DAppKitProvider>
  		</QueryClientProvider>
  	);
  }
```

### 5. Configuration Option Changes

The `createDAppKit` function has different configuration options than the old `WalletProvider`:

| Old (`WalletProvider`) | New (`createDAppKit`) | Notes                                                                |
| ---------------------- | --------------------- | -------------------------------------------------------------------- |
| -                      | `networks` (required) | List of network identifiers your app supports                        |
| -                      | `createClient`        | Function to create a client for each network                         |
| -                      | `defaultNetwork`      | Network to use by default (defaults to first in `networks`)          |
| `autoConnect` (false)  | `autoConnect` (true)  | Default changed from `false` to `true`                               |
| `enableUnsafeBurner`   | `enableBurnerWallet`  | Renamed                                                              |
| `slushWallet`          | `slushWalletConfig`   | Renamed                                                              |
| `storage`              | `storage`             | Unchanged                                                            |
| `storageKey`           | `storageKey`          | Unchanged                                                            |
| `preferredWallets`     | -                     | Removed                                                              |
| `walletFilter`         | -                     | Removed (wallets filtered by network compatibility)                  |
| `theme`                | -                     | Removed (UI components are now web components with built-in styling) |
| -                      | `walletInitializers`  | New option for registering custom wallets                            |

### 6. Update Hook Usage

The new dApp Kit has a dramatically simplified hook API. Most hooks from the original version have
been replaced with direct action calls through `useDAppKit()`.

**Available hooks in the new version:**

* `useDAppKit()` - Access the dAppKit instance for calling actions
* `useCurrentClient()` - Get the blockchain client (renamed from `useSuiClient`)
* `useCurrentAccount()` - Get the current connected account
* `useCurrentWallet()` - Get the current connected wallet
* `useWallets()` - Get the list of available wallets
* `useWalletConnection()` - Get the current wallet connection status
* `useCurrentNetwork()` - Get the current network

**Removed hooks:**

All wallet action hooks have been replaced with direct action calls via `useDAppKit()`:

* `useConnectWallet` -> Use `dAppKit.connectWallet()`
* `useDisconnectWallet` -> Use `dAppKit.disconnectWallet()`
* `useSignTransaction` -> Use `dAppKit.signTransaction()`
* `useSignAndExecuteTransaction` -> Use `dAppKit.signAndExecuteTransaction()`
* `useSignPersonalMessage` -> Use `dAppKit.signPersonalMessage()`
* `useSwitchAccount` -> Use `dAppKit.switchAccount()`

All data fetching hooks have been removed (giving you flexibility to use your preferred solution):

* `useSuiClientQuery` -> Use `useCurrentClient()` with your data fetching solution
* `useSuiClientMutation` -> Use `useCurrentClient()` with your data fetching solution
* `useSuiClientInfiniteQuery` -> Use `useCurrentClient()` with your data fetching solution
* `useSuiClientQueries` -> Use `useCurrentClient()` with your data fetching solution
* `useResolveSuiNSNames` -> Use `useCurrentClient()` directly

Other removed hooks:

* `useAutoConnectWallet` -> Auto-connect is enabled by default
* `useAccounts` -> Use `useWalletConnection()` to access `connection.wallet.accounts`
* `useWalletStore` -> Use specific hooks like `useWalletConnection()` instead

### 7. Replace Mutation Patterns

The built-in mutation hooks have been removed. Use TanStack Query's `useMutation` with
`useDAppKit()` to get similar functionality.

**Chain parameter replaced with network:**

In the old dapp-kit, you could optionally pass a `chain` parameter (e.g., `sui:mainnet`) to methods
like `signTransaction` and `signAndExecuteTransaction`. In the new dapp-kit, use the `network`
parameter instead - the chain is automatically derived from the network.

```diff
- const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
- await signAndExecute({ transaction, chain: 'sui:mainnet' });
+ const dAppKit = useDAppKit();
+ await dAppKit.signAndExecuteTransaction({ transaction, network: 'mainnet' });
```

**Mutation example:**

```diff
- import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
+ import { useMutation } from '@tanstack/react-query';
+ import { useDAppKit } from '@mysten/dapp-kit-react';
  import type { Transaction } from '@mysten/sui/transactions';

  export function ExampleComponent({ transaction }: { transaction: Transaction }) {
- 	const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
+ 	const dAppKit = useDAppKit();
+
+ 	const { mutateAsync: signAndExecute } = useMutation({
+ 		mutationFn: (tx: Transaction) => dAppKit.signAndExecuteTransaction({ transaction: tx }),
+ 	});

  	const handleClick = async () => {
- 		await signAndExecute(
- 			{ transaction },
- 			{
- 				onSuccess: (result: any) => console.log(result),
- 				onError: (error: any) => console.error(error),
- 			},
- 		);
+ 		await signAndExecute(transaction, {
+ 			onSuccess: (result) => console.log(result),
+ 			onError: (error) => console.error(error),
+ 		});
  	};

  	return <button onClick={handleClick}>Sign and Execute</button>;
  }
```

**Alternative: Direct promise-based calls**

If you don't need React Query's state management, you can call `dAppKit` methods directly:

```tsx
import { useDAppKit } from '@mysten/dapp-kit-react';
import type { Transaction } from '@mysten/sui/transactions';

export function ExampleComponent({ transaction }: { transaction: Transaction }) {
	const dAppKit = useDAppKit();

	const handleClick = async () => {
		try {
			const result = await dAppKit.signAndExecuteTransaction({ transaction });
			console.log(result);
		} catch (error) {
			console.error(error);
		}
	};

	return <button onClick={handleClick}>Sign and Execute</button>;
}
```

### 8. Replace Data Fetching Patterns

The built-in data fetching hooks have been removed. Use TanStack Query's `useQuery` with
`useCurrentClient()` to get similar functionality:

```diff
- import { useSuiClientQuery } from '@mysten/dapp-kit';
+ import { useQuery } from '@tanstack/react-query';
+ import { useCurrentClient } from '@mysten/dapp-kit-react';

  export function ExampleComponent({ objectId }: { objectId: string }) {
+ 	const client = useCurrentClient();
+
- 	const { data, isLoading, error } = useSuiClientQuery('getObject', {
- 		id: objectId,
- 	});
+ 	const { data, isLoading, error } = useQuery({
+ 		queryKey: ['object', objectId],
+ 		queryFn: () => client.core.getObject({ objectId }),
+ 	});
  	// ...
  }
```

**Alternative: Direct data fetching**

If you don't need React Query's caching and state management, you can fetch data directly:

```tsx
import { useCurrentClient } from '@mysten/dapp-kit-react';
import { useState, useEffect } from 'react';

export function ExampleComponent({ objectId }: { objectId: string }) {
	const client = useCurrentClient();
	const [data, setData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		client.core
			.getObject({ objectId })
			.then((result) => setData(result.object ?? null))
			.catch((err) => setError(err.message))
			.finally(() => setIsLoading(false));
	}, [client, objectId]);
	// ...
}
```

### 9. Update The Remaining Code

The following hooks from the original dApp Kit are not available anymore:

* `useSuiClientQuery` → Use `useQuery` from `@tanstack/react-query`
* `useSuiClientMutation` → Use `useMutation` from `@tanstack/react-query`
* `useSuiClientInfiniteQuery` → Use `useInfiniteQuery` from `@tanstack/react-query`
* `useResolveSuiNSNames` → Use `useCurrentClient()` with the suins extension

<Callout type="warning">
  The `reportTransactionEffects` feature is planned for deprecation in the [Wallet
  Standard](https://docs.sui.io/standards/wallet-standard) and so the dApp Kit provides no
  replacement.
</Callout>

The following have been removed:

* `useReportTransactionEffects` hook
* `reportTransactionEffects` callback from `useSignTransaction`
* Automatic transaction effects reporting from `useSignAndExecuteTransaction`

## CSS and Theming Changes

The new dApp Kit no longer bundles a CSS file. If you were importing the old CSS file, remove the
import:

```diff
- import '@mysten/dapp-kit/dist/full/index.css';
```

The new dApp Kit uses web components with built-in styling that can be customized using CSS custom
properties. See the [Theming documentation](/dapp-kit/theming) for details on customizing the
appearance of dApp Kit components.

**Quick theme setup:**

```css
:root {
	--primary: #4f46e5;
	--primary-foreground: #ffffff;
	--background: #ffffff;
	--foreground: #0f172a;
	--border: #e2e8f0;
	--radius: 0.5rem;
}
```

## Removing TanStack Query

If you were only using `@tanstack/react-query` for dApp Kit and don't need it for other parts of
your application, you can now remove it:

```bash
npm uninstall @tanstack/react-query
```


---

# @mysten/deepbook-v3 (/sui/migrations/sui-2.0/deepbook-v3)



This package now exports a client extension that integrates with Sui clients.

```diff
- import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
- import { DeepBookClient } from '@mysten/deepbook-v3';
+ import { SuiGrpcClient } from '@mysten/sui/grpc'; // or SuiJsonRpcClient, SuiGraphQLClient
+ import { deepbook } from '@mysten/deepbook-v3';

- const suiClient = new SuiClient({ url: getFullnodeUrl('mainnet') });
- const deepBookClient = new DeepBookClient({
-   client: suiClient,
-   address: myAddress,
-   env: 'mainnet',
-   balanceManagers: { ... },
- });
+ const client = new SuiGrpcClient({
+   baseUrl: 'https://fullnode.mainnet.sui.io:443',
+   network: 'mainnet',
+ }).$extend(
+   deepbook({
+     address: myAddress,
+     // network is auto-detected from the client
+     balanceManagers: { ... },
+   }),
+ );

- await deepBookClient.checkManagerBalance(manager, asset);
+ await client.deepbook.checkManagerBalance(manager, asset);
```


---

# Migrating from JSON-RPC (/sui/migrations/sui-2.0/json-rpc-migration)



This guide covers migrating from `SuiJsonRpcClient` to the new client APIs. The JSON-RPC API is
being deprecated in favor of `SuiGrpcClient` and `SuiGraphQLClient`.

<Callout type="info">
  We recommend using `SuiGrpcClient` for most operations and `SuiGraphQLClient` for complex queries
  like filtering transactions and events.
</Callout>

## Choosing a Client

| Client             | Best For                                                        |
| ------------------ | --------------------------------------------------------------- |
| `SuiGrpcClient`    | Most operations, SDK integrations, real-time data               |
| `SuiGraphQLClient` | Complex queries, filtering transactions/events, historical data |

## Quick Migration to gRPC

For most use cases, migrate to `SuiGrpcClient`:

```diff
- import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';
+ import { SuiGrpcClient } from '@mysten/sui/grpc';

- const client = new SuiJsonRpcClient({
-   url: getJsonRpcFullnodeUrl('mainnet'),
-   network: 'mainnet',
- });
+ const client = new SuiGrpcClient({
+   baseUrl: 'https://fullnode.mainnet.sui.io:443',
+   network: 'mainnet',
+ });
```

Both clients use the same full node URLs, so you can use the same endpoint when migrating.

## Core API Methods

The gRPC client should work with almost all mysten SDKs as a drop in replacement for the JSON-RPC
client. When using the client directly, the methods and data returned will not be exactly the same
as what was available in JSON-RPC.

## Methods Replaced by Core API

These JSON-RPC methods have direct replacements in the core API:

| JSON-RPC Method              | Core API Replacement                              |
| ---------------------------- | ------------------------------------------------- |
| `getCoins`                   | `listCoins`                                       |
| `getAllCoins`                | `listOwnedObjects` with `type: '0x2::coin::Coin'` |
| `getAllBalances`             | `listBalances`                                    |
| `getOwnedObjects`            | `listOwnedObjects`                                |
| `multiGetObjects`            | `getObjects`                                      |
| `getDynamicFields`           | `listDynamicFields`                               |
| `getDynamicFieldObject`      | `getDynamicField`                                 |
| `devInspectTransactionBlock` | `simulateTransaction`                             |
| `dryRunTransactionBlock`     | `simulateTransaction`                             |
| `getNormalizedMoveFunction`  | `getMoveFunction`                                 |
| `getMoveFunctionArgTypes`    | `getMoveFunction`                                 |

### Example: Migrating getOwnedObjects

```diff
- const { data } = await jsonRpcClient.getOwnedObjects({
-   owner: '0xabc...',
-   options: { showContent: true },
- });
+ const { objects } = await grpcClient.listOwnedObjects({
+   owner: '0xabc...',
+   include: { content: true },
+ });
```

## Methods Replaced by gRPC Services

These JSON-RPC methods can be replaced by calling gRPC service clients directly:

| JSON-RPC Method                     | gRPC Service Replacement          |
| ----------------------------------- | --------------------------------- |
| `getCheckpoint`                     | `ledgerService.getCheckpoint`     |
| `getCheckpoints`                    | `ledgerService.listCheckpoints`   |
| `getLatestCheckpointSequenceNumber` | `ledgerService.getCheckpoint`     |
| `getEpochs`                         | `ledgerService.listEpochs`        |
| `getCurrentEpoch`                   | `ledgerService.getEpoch`          |
| `getLatestSuiSystemState`           | `ledgerService.getSystemState`    |
| `getCommitteeInfo`                  | `ledgerService.getCommittee`      |
| `getValidatorsApy`                  | `ledgerService.getValidators`     |
| `getProtocolConfig`                 | `ledgerService.getProtocolConfig` |
| `getNormalizedMoveModule`           | `movePackageService.getModule`    |
| `getNormalizedMoveModulesByPackage` | `movePackageService.getPackage`   |
| `getNormalizedMoveStruct`           | `movePackageService.getStruct`    |
| `resolveNameServiceAddress`         | `nameService.lookupName`          |
| `resolveNameServiceNames`           | `nameService.reverseLookupName`   |

### Example: Using gRPC Service Clients

```typescript
import { SuiGrpcClient } from '@mysten/sui/grpc';

const client = new SuiGrpcClient({
	baseUrl: 'https://fullnode.mainnet.sui.io:443',
	network: 'mainnet',
});

// Get checkpoint information
const { response } = await client.ledgerService.getCheckpoint({
	sequenceNumber: 12345n,
});

// Get current epoch
const { response: epoch } = await client.ledgerService.getEpoch({});

// Get Move module information
const { response: module } = await client.movePackageService.getModule({
	packageId: '0x2',
	moduleName: 'coin',
});

// Resolve SuiNS name
const { response: address } = await client.nameService.lookupName({
	name: 'example.sui',
});
```

## Methods Requiring GraphQL

Some JSON-RPC methods don't have gRPC equivalents and require using `SuiGraphQLClient` instead:

| JSON-RPC Method             | GraphQL Alternative                |
| --------------------------- | ---------------------------------- |
| `queryTransactionBlocks`    | `transactions` query               |
| `multiGetTransactionBlocks` | `multiGetTransactionEffects` query |
| `queryEvents`               | `events` query                     |
| `getCoinMetadata`           | `coinMetadata` query               |
| `getTotalSupply`            | `coinMetadata` query               |
| `getStakes`                 | `address.stakedSuis` query         |
| `getStakesByIds`            | `multiGetObjects` query            |
| `tryGetPastObject`          | Historical object queries          |
| `getNetworkMetrics`         | Use indexer                        |
| `getAddressMetrics`         | Use indexer                        |
| `getMoveCallMetrics`        | Use indexer                        |

### Setting Up GraphQL Client

```typescript
import { SuiGraphQLClient } from '@mysten/sui/graphql';

const graphqlClient = new SuiGraphQLClient({
	url: 'https://sui-mainnet.mystenlabs.com/graphql',
	network: 'mainnet',
});
```

### Querying Transactions

Replace `queryTransactionBlocks` with a GraphQL query:

```typescript
const result = await graphqlClient.query({
	query: `
    query QueryTransactions($sender: SuiAddress, $first: Int, $after: String) {
      transactions(
        first: $first
        after: $after
        filter: { sentAddress: $sender }
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          digest
          effects {
            status
            epoch { epochId }
          }
        }
      }
    }
  `,
	variables: {
		sender: '0xabc...',
		first: 10,
	},
});
```

**Available transaction filters:**

* `sentAddress` - Filter by sender address
* `affectedAddress` - Filter by any address involved in the transaction
* `affectedObject` - Filter by object ID that was affected
* `function` - Filter by Move function called (e.g., `0x2::coin::transfer`)
* `kind` - Filter by transaction kind (`SYSTEM` or `PROGRAMMABLE`)
* `atCheckpoint` / `beforeCheckpoint` / `afterCheckpoint` - Filter by checkpoint

### Querying Events

Replace `queryEvents` with a GraphQL query:

```typescript
const result = await graphqlClient.query({
	query: `
    query QueryEvents($type: String, $first: Int, $after: String) {
      events(
        first: $first
        after: $after
        filter: { type: $type }
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          transactionModule {
            package { address }
            name
          }
          sender { address }
          contents {
            type { repr }
            bcs
          }
        }
      }
    }
  `,
	variables: {
		type: '0x2::coin::CoinCreated',
		first: 10,
	},
});
```

**Available event filters:**

* `type` - Filter by event type (package, package::module, or full type)
* `module` - Filter by emitting module
* `sender` - Filter by transaction sender
* `atCheckpoint` / `beforeCheckpoint` / `afterCheckpoint` - Filter by checkpoint

### Fetching Multiple Transactions

Replace `multiGetTransactionBlocks` with a GraphQL query:

```typescript
const result = await graphqlClient.query({
	query: `
    query MultiGetTransactions($digests: [String!]!) {
      multiGetTransactionEffects(keys: $digests) {
        transaction {
          digest
          transactionBcs
        }
        status
        epoch { epochId }
      }
    }
  `,
	variables: {
		digests: ['digest1', 'digest2', 'digest3'],
	},
});
```

### Querying Historical Objects

Replace `tryGetPastObject` with a GraphQL query specifying a version:

```typescript
const result = await graphqlClient.query({
	query: `
    query GetObjectAtVersion($id: SuiAddress!, $version: UInt53!) {
      object(address: $id, version: $version) {
        address
        version
        digest
        asMoveObject {
          contents {
            type { repr }
            bcs
          }
        }
      }
    }
  `,
	variables: {
		id: '0x123...',
		version: 42,
	},
});
```

### Querying Coin Metadata

Replace `getCoinMetadata` and `getTotalSupply` with a GraphQL query:

```typescript
const result = await graphqlClient.query({
	query: `
    query GetCoinMetadata($coinType: String!) {
      coinMetadata(coinType: $coinType) {
        name
        symbol
        description
        decimals
        iconUrl
        supply
      }
    }
  `,
	variables: {
		coinType: '0x2::sui::SUI',
	},
});
```

### Querying Staked SUI

Replace `getStakes` with a GraphQL query:

```typescript
const result = await graphqlClient.query({
	query: `
    query GetStakes($owner: SuiAddress!) {
      address(address: $owner) {
        stakedSuis {
          nodes {
            principal
            stakeActivationEpoch
            estimatedReward
            contents {
              bcs
            }
          }
        }
      }
    }
  `,
	variables: {
		owner: '0xabc...',
	},
});
```

## Response Format Differences

The gRPC client uses the core API response format, which differs from JSON-RPC responses. See the
[@mysten/sui migration guide](/sui/migrations/sui-2.0/sui#transaction-executors-now-accept-any-client)
for details on the new response format.

Key differences:

```diff
// Transaction result access
- const status = result.effects?.status?.status;
+ const tx = result.Transaction ?? result.FailedTransaction;
+ const status = tx.effects.status.success;

// Include options
- { showEffects: true, showEvents: true }
+ { effects: true, events: true }
```

## Client Extensions

Client extensions work the same way with both clients:

```typescript
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { deepbook } from '@mysten/deepbook-v3';
import { suins } from '@mysten/suins';

const client = new SuiGrpcClient({
	baseUrl: 'https://fullnode.mainnet.sui.io:443',
	network: 'mainnet',
}).$extend(deepbook({ address: myAddress }), suins());

// Use extended functionality
await client.deepbook.checkManagerBalance(manager, asset);
await client.suins.getName('0xabc...');
```

## See Also

* [SuiGrpcClient Documentation](/sui/clients/grpc) - Full gRPC client documentation
* [SuiGraphQLClient Documentation](/sui/clients/graphql) - GraphQL client documentation
* [Core API](/sui/clients/core) - Transport-agnostic API methods
* [gRPC Overview](https://docs.sui.io/concepts/data-access/grpc-overview) - Sui gRPC API
  documentation


---

# @mysten/kiosk (/sui/migrations/sui-2.0/kiosk)



This package now exports a client extension that integrates with Sui clients.

> **Note:** The Kiosk SDK requires `SuiJsonRpcClient` or `SuiGraphQLClient`. It does not work with
> `SuiGrpcClient` because it uses event queries that are not available in gRPC.

```diff
- import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
- import { KioskClient, Network } from '@mysten/kiosk';
+ import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc'; // or SuiGraphQLClient
+ import { kiosk } from '@mysten/kiosk';

- const suiClient = new SuiClient({ url: getFullnodeUrl('mainnet') });
- const kioskClient = new KioskClient({
-   client: suiClient,
-   network: Network.MAINNET,
- });
+ const client = new SuiJsonRpcClient({
+   url: getJsonRpcFullnodeUrl('mainnet'),
+   network: 'mainnet',
+ }).$extend(kiosk());

- const ownedKiosks = await kioskClient.getOwnedKiosks({ address: myAddress });
+ const ownedKiosks = await client.kiosk.getOwnedKiosks({ address: myAddress });
```

## Removed: transactionBlock Parameter

The deprecated `transactionBlock` parameter has been removed from `KioskTransaction`,
`TransferPolicyTransaction`, and rule resolving functions. Use `transaction` instead:

```diff
const kioskTx = new KioskTransaction({
-  transactionBlock: tx,
+  transaction: tx,
   kioskClient,
   cap,
});

const tpTx = new TransferPolicyTransaction({
-  transactionBlock: tx,
+  transaction: tx,
   kioskClient,
   cap,
});
```

## Removed: Low-Level Helper Functions

The low-level helper functions have been removed in favor of the `KioskTransaction` and
`TransferPolicyTransaction` builder classes.

### Kiosk Functions

| Removed Function    | Use Instead              |
| ------------------- | ------------------------ |
| `createKiosk`       | `kioskTx.create()`       |
| `shareKiosk`        | `kioskTx.share()`        |
| `place`             | `kioskTx.place()`        |
| `lock`              | `kioskTx.lock()`         |
| `take`              | `kioskTx.take()`         |
| `list`              | `kioskTx.list()`         |
| `delist`            | `kioskTx.delist()`       |
| `placeAndList`      | `kioskTx.placeAndList()` |
| `purchase`          | `kioskTx.purchase()`     |
| `withdrawFromKiosk` | `kioskTx.withdraw()`     |
| `borrowValue`       | `kioskTx.borrow()`       |
| `returnValue`       | `kioskTx.return()`       |

### Transfer Policy Functions

| Removed Function                     | Use Instead                                             |
| ------------------------------------ | ------------------------------------------------------- |
| `createTransferPolicyWithoutSharing` | `tpTx.create()`                                         |
| `shareTransferPolicy`                | `tpTx.shareAndTransferCap()`                            |
| `confirmRequest`                     | Handled automatically by `kioskTx.purchaseAndResolve()` |
| `removeTransferPolicyRule`           | `tpTx.removeRule()`                                     |

### Personal Kiosk Functions

| Removed Function        | Use Instead                                   |
| ----------------------- | --------------------------------------------- |
| `convertToPersonalTx`   | `kioskTx.convertToPersonal()`                 |
| `transferPersonalCapTx` | Handled automatically by `kioskTx.finalize()` |

### Rule Attachment Functions

| Removed Function            | Use Instead                   |
| --------------------------- | ----------------------------- |
| `attachKioskLockRuleTx`     | `tpTx.addLockRule()`          |
| `attachRoyaltyRuleTx`       | `tpTx.addRoyaltyRule()`       |
| `attachPersonalKioskRuleTx` | `tpTx.addPersonalKioskRule()` |
| `attachFloorPriceRuleTx`    | `tpTx.addFloorPriceRule()`    |

## Migration Example

```diff
- import { createKiosk, shareKiosk, placeAndList } from '@mysten/kiosk';
+ import { kiosk, KioskTransaction } from '@mysten/kiosk';
+ import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';

- const [kiosk, cap] = createKiosk(tx);
- shareKiosk(tx, kiosk);
- placeAndList(tx, itemType, kiosk, cap, item, price);

+ const client = new SuiJsonRpcClient({
+   url: getJsonRpcFullnodeUrl('mainnet'),
+   network: 'mainnet',
+ }).$extend(kiosk());
+
+ const kioskTx = new KioskTransaction({ transaction: tx, kioskClient: client.kiosk });
+ kioskTx
+   .create()
+   .placeAndList({ itemType, item, price })
+   .shareAndTransferCap(address)
+   .finalize();
```


---

# SDK Maintainers (/sui/migrations/sui-2.0/sdk-maintainers)



# Upgrading SDKs to @mysten/sui\@2.0.0

This guide covers the key breaking changes for SDK maintainers building on top of `@mysten/sui`.

For comprehensive SDK development patterns, see the [Building SDKs guide](/sui/sdk-building).

## Use `ClientWithCoreApi`

Accept `ClientWithCoreApi` instead of `SuiClient` to support all 3 Sui clients (JSON-RPC, GraphQL,
gRPC):

```diff
- import { SuiClient } from '@mysten/sui/client';
+ import type { ClientWithCoreApi } from '@mysten/sui/client';

export class MySDKClient {
-   client: SuiClient;
+   client: ClientWithCoreApi;
}
```

## Access Data via `client.core` methods

All data access methods are namespaced under `client.core`:

```diff
- const result = await this.client.getObject({ objectId });
+ const result = await this.client.core.getObject({ objectId });

- const result = await this.client.getOwnedObjects({ owner });
+ const result = await this.client.core.listOwnedObjects({ owner });
```

| v1.x Method                      | v2.0 Method                       |
| -------------------------------- | --------------------------------- |
| `client.getObject()`             | `client.core.getObject()`         |
| `client.getOwnedObjects()`       | `client.core.listOwnedObjects()`  |
| `client.getDynamicFieldObject()` | `client.core.getDynamicField()`   |
| `client.getDynamicFields()`      | `client.core.listDynamicFields()` |
| `client.multiGetObjects()`       | `client.core.getObjects()`        |

See the [Core API documentation](/sui/clients/core) for all available methods.

## Use Peer Dependencies

Declare `@mysten/*` packages as peer dependencies:

```json
{
	"peerDependencies": {
		"@mysten/sui": "^2.0.0"
	},
	"devDependencies": {
		"@mysten/sui": "^2.0.0"
	}
}
```

## Client Extensions

v2.0 introduces client extensions that let users add your SDK to any Sui client:

```typescript
import type { ClientWithCoreApi } from '@mysten/sui/client';

export function mySDK() {
	return {
		name: 'mySDK',
		register: (client: ClientWithCoreApi) => {
			return new MySDKClient({ client });
		},
	};
}

// Users can then extend any client
const client = new SuiGrpcClient({ ... }).$extend(mySDK());
await client.mySDK.doSomething();
```

See the [Building SDKs guide](/sui/sdk-building#client-extensions) for the complete extension
pattern.

## Code Generation

Use **[@mysten/codegen](/codegen)** to generate type-safe TypeScript bindings from your Move
packages. See the [codegen documentation](/codegen) for setup instructions.

For complete SDK development patterns including client extensions, transaction thunks, and best
practices, see the [Building SDKs guide](/sui/sdk-building).


---

# @mysten/seal (/sui/migrations/sui-2.0/seal)



The deprecated `SealClient.asClientExtension()` static method has been removed. Use the `seal()`
registration function instead:

```diff
- import { SealClient } from '@mysten/seal';
+ import { seal } from '@mysten/seal';

- const client = suiClient.$extend(SealClient.asClientExtension());
+ const client = suiClient.$extend(seal());
```


---

# @mysten/sui (/sui/migrations/sui-2.0/sui)



## Removal of SuiClient Exports

The `@mysten/sui/client` export path has been removed. All JSON-RPC client functionality is now
exported from `@mysten/sui/jsonRpc`.

**Removed exports:**

* `SuiClient` (use `SuiJsonRpcClient` instead)
* `SuiClientOptions` (use `SuiJsonRpcClientOptions` instead)
* `isSuiClient` (use `isSuiJsonRpcClient` instead)
* `SuiTransport` (use `JsonRpcTransport` instead)
* `SuiTransportRequestOptions` (use `JsonRpcTransportRequestOptions` instead)
* `SuiTransportSubscribeOptions` (use `JsonRpcTransportSubscribeOptions` instead)
* `SuiHTTPTransportOptions` (use `JsonRpcHTTPTransportOptions` instead)
* `SuiHTTPTransport` (use `JsonRpcHTTPTransport` instead)
* `getFullnodeUrl` (use `getJsonRpcFullnodeUrl` instead)
* All JSON-RPC types (now exported from `@mysten/sui/jsonRpc`)

**Migration:**

```diff
- import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
+ import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';

- const client = new SuiClient({
-   url: getFullnodeUrl('devnet'),
+ const client = new SuiJsonRpcClient({
+   url: getJsonRpcFullnodeUrl('devnet'),
    network: 'devnet',
  });
```

## Network Parameter Required

When creating a new `SuiGraphQLClient` or `SuiJsonRpcClient`, you must now provide a `network`
parameter:

```ts
const client = new SuiGraphQLClient({
	url: 'https://...',
	network: 'mainnet', // Required
});

const client = new SuiJsonRpcClient({
	url: 'https://...',
	network: 'mainnet', // Required
});
```

## BCS Schema Changes

Several BCS schemas in `@mysten/sui/bcs` have been updated to align exactly with the Rust
implementation. These changes affect serialization and deserialization of transaction effects and
objects.

### ExecutionStatus Changes

**BCS Schema** (when parsing raw effects): The variant was renamed from `Failed` to `Failure`:

```diff
- effects.status.Failed.error
+ effects.status.Failure.error
```

**Core API** (gRPC/GraphQL responses): Uses a simplified structure with a `success` boolean:

```typescript
// Core API returns this structure
const result = await client.core.getTransaction({ digest, include: { effects: true } });
const tx = result.Transaction ?? result.FailedTransaction;

if (tx.effects.status.success) {
	// Transaction succeeded
} else {
	const error = tx.effects.status.error;
}
```

### Object BCS Schema Changes

Several changes to object BCS schemas:

```diff
// Renamed Owner enum variant
const owner = {
-  ConsensusV2: { owner: addr, startVersion: 1 }
+  ConsensusAddressOwner: { startVersion: 1, owner: addr }
};

// Renamed Data enum variant
const data = {
-  MoveObject: { ... }
+  Move: { ... }
};

// Renamed exported schema
- import { ObjectBcs } from '@mysten/sui/bcs';
+ import { bcs } from '@mysten/sui/bcs';
- const bytes = ObjectBcs.serialize(obj);
+ const bytes = bcs.Object.serialize(obj);
```

**This affects serialization.** Any existing serialized data with `ConsensusV2` will need to be
re-serialized with the new `ConsensusAddressOwner` variant.

### UnchangedSharedKind to UnchangedConsensusKind

Transaction effects field renamed:

```diff
// Field name change
- effects.unchangedSharedObjects
+ effects.unchangedConsensusObjects
```

**Removed variants:** `MutateDeleted`, `ReadDeleted`

**New variants:** `MutateConsensusStreamEnded`, `ReadConsensusStreamEnded`, `Cancelled`,
`PerEpochConfig`

## Experimental Client API Stabilization

The experimental client API has been stabilized and moved from `@mysten/sui/experimental` to
`@mysten/sui/client`. All `Experimental_` prefixes have been removed.

**Breaking changes:**

* The `@mysten/sui/experimental` module has been removed
* All `Experimental_` prefixed types and classes have been renamed
* Client types namespace changed from `Experimental_SuiClientTypes` to `SuiClientTypes`

**Migration:**

```diff
- import {
-   Experimental_BaseClient,
-   Experimental_CoreClient,
-   type Experimental_SuiClientTypes,
-   type Experimental_CoreClientOptions,
- } from '@mysten/sui/experimental';
+ import {
+   BaseClient,
+   CoreClient,
+   type SuiClientTypes,
+   type CoreClientOptions,
+ } from '@mysten/sui/client';

// Update class extensions
- class MyClient extends Experimental_CoreClient {
+ class MyClient extends CoreClient {
    async getObjects(
-     options: Experimental_SuiClientTypes.GetObjectsOptions,
-   ): Promise<Experimental_SuiClientTypes.GetObjectsResponse> {
+     options: SuiClientTypes.GetObjectsOptions,
+   ): Promise<SuiClientTypes.GetObjectsResponse> {
      // ...
    }
  }
```

**Common renames:**

| Old Name                         | New Name            |
| -------------------------------- | ------------------- |
| `Experimental_BaseClient`        | `BaseClient`        |
| `Experimental_CoreClient`        | `CoreClient`        |
| `Experimental_SuiClientTypes`    | `SuiClientTypes`    |
| `Experimental_CoreClientOptions` | `CoreClientOptions` |

## Commands Renamed to TransactionCommands

The `Commands` type exported from `@mysten/sui/transactions` has been renamed to
`TransactionCommands` because `Commands` is a reserved keyword in React Native.

```diff
- import { Commands } from '@mysten/sui/transactions';
+ import { TransactionCommands } from '@mysten/sui/transactions';

- const coin = tx.add(Commands.SplitCoins(tx.gas, [tx.pure.u64(100)]));
+ const coin = tx.add(TransactionCommands.SplitCoins(tx.gas, [tx.pure.u64(100)]));

- tx.add(Commands.TransferObjects([coin], recipient));
+ tx.add(TransactionCommands.TransferObjects([coin], recipient));
```

## GraphQL Schema Consolidation

The SDK now exports a single unified GraphQL schema instead of multiple versioned schemas.

**Removed exports:**

* `@mysten/sui/graphql/schemas/2024.1`
* `@mysten/sui/graphql/schemas/2024.4`
* `@mysten/sui/graphql/schemas/latest`

**Migration:**

```diff
- import { graphql } from '@mysten/sui/graphql/schemas/latest';
- import { graphql } from '@mysten/sui/graphql/schemas/2024.4';
- import { graphql } from '@mysten/sui/graphql/schemas/2024.1';
+ import { graphql } from '@mysten/sui/graphql/schema';
```

## Named Packages Plugin Removed

The `namedPackagesPlugin` and global plugin registry APIs have been removed. MVR (Move Registry)
resolution is now built directly into the core client.

**Removed:**

* `namedPackagesPlugin` function
* `NamedPackagesPluginOptions` type (from `@mysten/sui/transactions`)
* `Transaction.registerGlobalSerializationPlugin()` static method
* `Transaction.unregisterGlobalSerializationPlugin()` static method
* `Transaction.registerGlobalBuildPlugin()` static method
* `Transaction.unregisterGlobalBuildPlugin()` static method

**How it works now:**

MVR name resolution happens automatically during transaction building. The SDK detects `.move` names
(like `@org/package::module::Type`) and resolves them using the client's MVR resolver.

**Migration:**

```diff
- import { Transaction, namedPackagesPlugin } from '@mysten/sui/transactions';
-
- Transaction.registerGlobalSerializationPlugin(
-   'namedPackages',
-   namedPackagesPlugin({
-     url: 'https://mainnet.mvr.mystenlabs.com',
-     overrides: myOverrides,
-   })
- );

+ import { SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
+ import type { NamedPackagesOverrides } from '@mysten/sui/client';
+
+ const client = new SuiJsonRpcClient({
+   url: 'https://fullnode.mainnet.sui.io:443',
+   network: 'mainnet',
+   mvr: {
+     overrides: myOverrides,
+   },
+ });
```

## Transaction Executors Now Accept Any Client

The transaction executor classes now accept any client implementing `ClientWithCoreApi` instead of
requiring `SuiJsonRpcClient` specifically.

**Affected classes:**

* `CachingTransactionExecutor`
* `SerialTransactionExecutor`
* `ParallelTransactionExecutor`

**Breaking changes:**

* Constructor `client` parameter type changed from `SuiJsonRpcClient` to `ClientWithCoreApi`
* Return type of `executeTransaction()`: `data` property renamed to `result`
* The second parameter changed from JSON-RPC options to core API include options

**Migration:**

```diff
import { SerialTransactionExecutor } from '@mysten/sui/transactions';
- import { SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
+ // Works with any client: SuiJsonRpcClient, SuiGrpcClient, or SuiGraphQLClient

const executor = new SerialTransactionExecutor({
-   client: jsonRpcClient,
+   client, // Any ClientWithCoreApi-compatible client
    signer,
});

const result = await executor.executeTransaction(tx);

// Accessing the transaction result (changed)
- console.log(result.data.effects?.status.status);
+ const tx = result.Transaction ?? result.FailedTransaction;
+ console.log(tx.effects.status.success);
```

Include options have also changed:

```diff
- const result = await executor.executeTransaction(tx, {
-   showEffects: true,
-   showEvents: true,
- });
+ const result = await executor.executeTransaction(tx, {
+   effects: true,
+   events: true,
+ });
```

## ZkLogin Changes

### legacyAddress Parameter Required

The `legacyAddress` parameter is now **required** for all zkLogin address computation functions.

**Migration (to preserve existing behavior):**

```diff
// computeZkLoginAddressFromSeed (previous default: true)
- computeZkLoginAddressFromSeed(seed, iss)
+ computeZkLoginAddressFromSeed(seed, iss, true)

// jwtToAddress (previous default: false)
- jwtToAddress(jwt, userSalt)
+ jwtToAddress(jwt, userSalt, false)

// computeZkLoginAddress (previous default: false)
- computeZkLoginAddress({ claimName, claimValue, iss, aud, userSalt })
+ computeZkLoginAddress({ claimName, claimValue, iss, aud, userSalt, legacyAddress: false })

// toZkLoginPublicIdentifier (no previous default)
- toZkLoginPublicIdentifier(addressSeed, iss)
+ toZkLoginPublicIdentifier(addressSeed, iss, { legacyAddress: false })
```

## Default Transaction Expiration

Transactions now default the expiration to the current epoch + 1 using `ValidDuring` when built with
a client. This provides replay protection for all transactions without requiring explicit
configuration.

**To preserve the old behavior** (no expiration), explicitly set the expiration to `None`:

```typescript
const tx = new Transaction();
tx.setExpiration({ None: true });
```


---

# @mysten/suins (/sui/migrations/sui-2.0/suins)



This package now exports a client extension that integrates with Sui clients.

```diff
- import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
- import { SuinsClient } from '@mysten/suins';
+ import { SuiGrpcClient } from '@mysten/sui/grpc'; // or SuiJsonRpcClient, SuiGraphQLClient
+ import { suins } from '@mysten/suins';

- const suiClient = new SuiClient({ url: getFullnodeUrl('mainnet') });
- const suinsClient = new SuinsClient({
-   client: suiClient,
-   network: 'mainnet',
- });
+ const client = new SuiGrpcClient({
+   baseUrl: 'https://fullnode.mainnet.sui.io:443',
+   network: 'mainnet',
+ }).$extend(suins());

- const nameRecord = await suinsClient.getNameRecord('example.sui');
+ const nameRecord = await client.suins.getNameRecord('example.sui');
```

## Custom Package IDs

For custom deployments or networks other than mainnet/testnet, you can provide custom package info:

```ts
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { suins, type PackageInfo } from '@mysten/suins';

const customPackageInfo: PackageInfo = {
	packageId: '0x...',
	packageIdV1: '0x...',
	// ... other required fields
};

const client = new SuiGrpcClient({
	baseUrl: 'http://localhost:9000',
	network: 'localnet',
}).$extend(suins({ packageInfo: customPackageInfo }));
```


---

# Wallet Builders (/sui/migrations/sui-2.0/wallet-builders)



This guide covers the breaking changes for wallet builders implementing the
`@mysten/wallet-standard` interface.

## Key Changes

### Removal of `sui:reportTransactionEffects`

The `sui:reportTransactionEffects` feature has been removed entirely. If your wallet implements this
feature, remove it.

### New Core API Response Format

The most significant change is how you obtain BCS-encoded effects for the
`signAndExecuteTransaction` response. The new core API returns effects in a different structure.

## Migrating `signAndExecuteTransaction`

The wallet standard output format hasn't changed - what's different is how you obtain the BCS
effects when using the new Sui client APIs.

```diff
#signAndExecuteTransaction: SuiSignAndExecuteTransactionMethod = async ({
	transaction,
	signal,
}) => {
-	const { bytes, signature } = await Transaction.from(
-		await transaction.toJSON(),
-	).sign({ client: suiClient, signer: keypair });
-
-	const { rawEffects, digest } = await suiClient.executeTransactionBlock({
-		signature,
-		transactionBlock: bytes,
-		options: { showRawEffects: true },
-	});
+	const parsedTransaction = Transaction.from(await transaction.toJSON());
+	const bytes = await parsedTransaction.build({ client });
+
+	const result = await this.#keypair.signAndExecuteTransaction({
+		transaction: parsedTransaction,
+		client,
+	});
+
+	const tx = result.Transaction ?? result.FailedTransaction;

	return {
-		bytes,
-		signature,
-		digest,
-		effects: toBase64(new Uint8Array(rawEffects!)),
+		bytes: toBase64(bytes),
+		signature: tx.signatures[0],
+		digest: tx.digest,
+		effects: toBase64(tx.effects.bcs!),
	};
};
```

Key changes:

* Use `signer.signAndExecuteTransaction()` instead of `suiClient.executeTransactionBlock()`
* Response is a union type - unwrap with `result.Transaction ?? result.FailedTransaction`
* BCS effects are in `tx.effects.bcs` (Uint8Array) instead of `rawEffects` (number array)


---

# @mysten/walrus (/sui/migrations/sui-2.0/walrus)



## Breaking Changes

* **Client required**: `WalrusClient` can no longer be created with just an RPC URL. You must pass a
  Sui client.
* **Network from client**: The `network` parameter has been removed from `walrus()`. The network is
  now inferred from the client.
* **Removed deprecated method**: `WalrusClient.experimental_asClientExtension()` has been removed.
  Use the `walrus()` function instead.

## Updated Usage

If you were creating `WalrusClient` directly:

```diff
- import { WalrusClient } from '@mysten/walrus';
+ import { SuiGrpcClient } from '@mysten/sui/grpc'; // or SuiJsonRpcClient, SuiGraphQLClient
+ import { walrus } from '@mysten/walrus';

- const walrusClient = new WalrusClient({
-   suiRpcUrl: 'https://fullnode.testnet.sui.io:443',
-   network: 'testnet',
- });
+ const client = new SuiGrpcClient({
+   baseUrl: 'https://fullnode.testnet.sui.io:443',
+   network: 'testnet',
+ }).$extend(walrus());

- await walrusClient.getBlob(blobId);
+ await client.walrus.getBlob(blobId);
```

If you were passing `network` to `walrus()`, remove it:

```diff
- client.$extend(walrus({ network: 'testnet' }));
+ client.$extend(walrus());
```


---

# @mysten/zksend (/sui/migrations/sui-2.0/zksend)



This package now exports a client extension that integrates with Sui clients, enabling compatibility
with gRPC, GraphQL, and JSON RPC transports.

## Breaking Changes

* **Client extension**: The zkSend SDK is now a client extension (`client.$extend(zksend())`)
* **Non-contract links removed**: Only contract-based links are now supported. The `contract` option
  no longer accepts `null`
* **`isContractLink` removed**: The `isContractLink` option has been removed from `ZkSendLink`
* **`calculateGas` removed**: The `calculateGas` option has been removed from
  `CreateZkSendLinkOptions`
* **Data fetching helpers removed**: `getAssetsFromTransaction`, `isOwner`, and `ownedAfterChange`
  are no longer exported

## Migration

Update your code to use the client extension:

```diff
- import { ZkSendLinkBuilder, ZkSendLink } from '@mysten/zksend';
+ import { zksend } from '@mysten/zksend';
+ import { SuiGrpcClient } from '@mysten/sui/grpc'; // or SuiJsonRpcClient, SuiGraphQLClient

+ const client = new SuiGrpcClient({
+   baseUrl: 'https://fullnode.testnet.sui.io:443',
+   network: 'testnet',
+ }).$extend(zksend());
```

### Creating a Link Builder

```diff
- const builder = new ZkSendLinkBuilder({
-   client,
-   sender: address,
-   network: 'testnet',
- });
+ const link = client.zksend.linkBuilder({
+   sender: address,
+ });
```

### Loading a Link

```diff
- const link = new ZkSendLink({
-   client,
-   keypair,
-   network: 'testnet',
- });
+ const link = await client.zksend.loadLink({
+   address: linkAddress,
+   // or: keypair: linkKeypair,
+ });
```

### Loading from URL

```diff
- const link = await ZkSendLink.fromUrl(url, {
-   client,
-   network: 'testnet',
- });
+ const link = await client.zksend.loadLinkFromUrl(url);
```

## Complete Example

```ts
import { zksend } from '@mysten/zksend';
import { SuiGrpcClient } from '@mysten/sui/grpc'; // or SuiJsonRpcClient, SuiGraphQLClient

// Create client with zkSend extension
const client = new SuiGrpcClient({
	baseUrl: 'https://fullnode.testnet.sui.io:443',
	network: 'testnet',
}).$extend(zksend());

// Create a new link
const linkBuilder = client.zksend.linkBuilder({
	sender: myAddress,
});

// Add assets to the link
linkBuilder.addSui(1_000_000_000n); // 1 SUI

// Create the transaction
const { tx, link } = await linkBuilder.build();

// Later, load an existing link
const existingLink = await client.zksend.loadLinkFromUrl(linkUrl);
const assets = await existingLink.getAssets();
```