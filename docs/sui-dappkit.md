# Sui dApp Kit (/dapp-kit)



<Callout type="info">
  **Migrating from @mysten/dapp-kit?** If you're currently using the legacy `@mysten/dapp-kit`
  package, check out our [Migration Guide](/sui/migrations/sui-2.0/dapp-kit) to upgrade to the new
  packages with gRPC and GraphQL support.
</Callout>

The Sui dApp Kit provides tools and components for building decentralized applications on the Sui
network. The SDK consists of two packages that work together:

## Packages

### @mysten/dapp-kit-core

Framework-agnostic core that works with vanilla JS, React, Vue, or any framework:

* Action-based API for direct wallet operations
* Web Components for universal UI elements
* Automatic state management with nanostores
* Smaller bundle size and improved performance

### @mysten/dapp-kit-react

React bindings for the core package:

* React hooks for state and actions
* React component wrappers for Web Components
* Seamless integration with React applications

## Install

Choose the installation method based on your framework:

### For React Applications

```sh npm2yarn
npm i @mysten/dapp-kit-react @mysten/sui
```

### Vanilla JavaScript and other frameworks

```sh npm2yarn
npm i @mysten/dapp-kit-core @mysten/sui
```

## Getting Started

Check the framework-specific guides:

* [React](/dapp-kit/getting-started/react)
* [Next.js](/dapp-kit/getting-started/next-js)
* [Vue](/dapp-kit/getting-started/vue)

## Legacy Package

### @mysten/dapp-kit (Legacy)

See the [Legacy dApp Kit documentation](/dapp-kit/legacy).

The original React-focused version of the dApp Kit. This package provides:

* React hooks for wallet connection and blockchain queries
* Pre-built UI components with Radix UI
* Integration with TanStack React Query
* Comprehensive wallet state management

<Callout type="warning">
  **Deprecated JSON RPC Only**: This legacy package only works with the deprecated JSON RPC API and
  will not be updated to support gRPC or GraphQL. All new projects should use
  `@mysten/dapp-kit-core` and `@mysten/dapp-kit-react`.
</Callout>


---

# Connect Wallet (/dapp-kit/actions/connect-wallet)



The dApp Kit SDK provides an action for wallet connection, allowing users to connect, disconnect,
and switch between wallets and accounts.

<Callout>
  The [Connect Button](../web-components/connect-button) Web Component provides a complete wallet
  connection UI.
</Callout>

## Usage

<Callout>
  Auto-connect is enabled by default and will attempt to restore the previous wallet connection on
  page reload. This provides a seamless user experience but can be
  [disabled](../dapp-kit-instance#disabling-auto-connect) if needed.
</Callout>

The `connectWallet` action prompts a wallet to connect and authorize accounts for your application:

```typescript
import { createDAppKit } from '@mysten/dapp-kit-core';

const dAppKit = createDAppKit({
	/* config */
});

// Connect to a specific wallet
const result = await dAppKit.connectWallet({
	wallet: myWallet, // UiWallet instance
	account: myAccount, // Optional: specific account to select
});

console.log('Connected accounts:', result.accounts);
```

## Parameters

* **`wallet`** - The `UiWallet` instance to connect to
* **`account`** (optional) - A specific `UiWalletAccount` to set as the selected account. Defaults
  to the first authorized account

## Return Value

Returns a `Promise` that resolves to an object containing:

* **`accounts`** - Array of authorized `UiWalletAccount` instances

## Example

```typescript
const wallets = dAppKit.stores.$wallets.get();

const unsubscribe = dAppKit.stores.$connection.subscribe((connection) => {
	if (connection.isConnected) {
		console.log(`Connected account address: ${connection.account.address}`);
	} else {
		console.log({ connection });
	}
});

if (wallets.length > 0) {
	try {
		const { accounts } = await dAppKit.connectWallet({
			wallet: wallets[0],
		});
		console.log('Available accounts:', accounts);
	} catch (error) {
		console.error('Connection failed:', error);
	}
}
```


---

# Disconnect Wallet (/dapp-kit/actions/disconnect-wallet)



The `disconnectWallet` action terminates the connection with the currently connected wallet.

<Callout>
  The [Connect Button](../web-components/connect-button) Web Component provides a complete wallet
  connection UI.
</Callout>

## Usage

<Callout type="info">
  The disconnect action clears the connection state locally and attempts to notify the wallet. Even
  if the wallet notification fails, the local state is always cleared to ensure a clean
  disconnection.

  Note that wallets may or may not implement the `disconnect` feature. Calling `disconnectWallet`
  doesn't necessarily mean that the wallet accounts will be disconnected from the dApp within the
  wallet itself - this is determined by each wallet's implementation.
</Callout>

```typescript
import { createDAppKit } from '@mysten/dapp-kit-core';

const dAppKit = createDAppKit({
	/* config */
});

await dAppKit.disconnectWallet();
```

## Parameters

None.

## Return Value

Returns a `Promise` that resolves to `void` when the disconnection is complete.

<Callout>
  The action may throw `WalletNotConnectedError` if no wallet is connected. However, wallet-specific
  disconnect failures are logged but don't prevent the local connection state from being cleared.
</Callout>


---

# Sign and Execute Transaction (/dapp-kit/actions/sign-and-execute-transaction)



The `signAndExecuteTransaction` action prompts the connected wallet to sign and immediately execute
a transaction on the Sui network. This is the most common way to execute transactions in your dApp.

## Usage

```typescript
import { createDAppKit } from '@mysten/dapp-kit-core';
import { Transaction, coinWithBalance } from '@mysten/sui/transactions';

const dAppKit = createDAppKit({
	/* config */
});

const tx = new Transaction();
// No need to manually set sender - it's done automatically
tx.transferObjects([coinWithBalance({ balance: 123 })], '0xrecipient...');

const result = await dAppKit.signAndExecuteTransaction({
	transaction: tx,
});

if (result.FailedTransaction) {
	throw new Error(`Transaction failed: ${result.FailedTransaction.status.error?.message}`);
}

console.log('Transaction digest:', result.Transaction.digest);
```

## Parameters

* **`transaction`** - `Transaction | string` - The transaction to sign and execute. Can be either a
  Transaction instance or base64-encoded bcs bytes for the transaction.
* **`signal`** (optional) - `AbortSignal` - An abort signal to cancel the transaction request.

## Return Value

Returns a `Promise` that resolves to a `TransactionResult` discriminated union:

```typescript
type TransactionResult =
	| { $kind: 'Transaction'; Transaction: Transaction }
	| { $kind: 'FailedTransaction'; FailedTransaction: Transaction };
```

The `Transaction` object contains:

* **`digest`** - `string` - The transaction digest (unique identifier for the executed transaction)
* **`signatures`** - `string[]` - The signatures as base64-encoded strings
* **`epoch`** - `string | null` - The epoch in which the transaction was executed
* **`status`** - `ExecutionStatus` - The execution status with `success: boolean` and
  `error: string | null`
* **`effects`** - `TransactionEffects | null` - The parsed transaction effects (may be `null` if
  effects parsing fails for unknown effect versions)
* **`transaction`** - `TransactionData` - The parsed transaction data

```typescript
const result = await dAppKit.signAndExecuteTransaction({ transaction });

if (result.FailedTransaction) {
	console.error('Transaction failed:', result.FailedTransaction.status.error?.message);
	return;
}

// Access the successful transaction results
const tx = result.Transaction;
console.log('Digest:', tx.digest);
console.log('Signatures:', tx.signatures);
console.log('Epoch:', tx.epoch);
```

## Transaction Building

When passing a Transaction instance, the action automatically:

1. Sets the sender address if not already set
2. Builds the transaction using the current network's client
3. Converts it to the appropriate format for the wallet
4. Submits the transaction to the network

## Wallet Compatibility

* The action transparently handles both `sui:signAndExecuteTransaction` and
  `sui:signAndExecuteTransactionBlock` wallet-standard features
* The wallet handles network submission and response
* Some wallets (Enoki, Enoki Connect, WalletConnect) may use the dApp Kit client and execute
  transactions within the application as an implementation detail

```typescript
// The action automatically detects and uses the appropriate method
// No special configuration needed
const result = await dAppKit.signAndExecuteTransaction({
	transaction: tx,
});
```


---

# Sign Personal Message (/dapp-kit/actions/sign-personal-message)



The `signPersonalMessage` action prompts the connected wallet to sign a personal message. This is
useful for authentication, proof of ownership, or other scenarios where you need cryptographic proof
that a user controls a specific account.

## Usage

```typescript
import { createDAppKit } from '@mysten/dapp-kit-core';

const dAppKit = createDAppKit({
	/* config */
});

const message = new TextEncoder().encode('Please sign this message');
const result = await dAppKit.signPersonalMessage({
	message,
});

console.log('Message bytes:', result.bytes);
console.log('Signature:', result.signature);
```

## Parameters

* **`message`** - `Uint8Array` - The message to sign as a byte array

## Return Value

Returns a `Promise` that resolves to an object containing:

* **`bytes`** - `string` - Base64 encoded message bytes
* **`signature`** - `string` - Base64 encoded signature

## Message Format

The message parameter must be a `Uint8Array`. Common patterns for creating byte arrays:

```typescript
const textMessage = new TextEncoder().encode('Hello, Sui!');
await dAppKit.signPersonalMessage({ message: textMessage });

const jsonMessage = new TextEncoder().encode(
	JSON.stringify({ action: 'sign', timestamp: Date.now() }),
);
await dAppKit.signPersonalMessage({ message: jsonMessage });
```

## Security Considerations

### Message Content

* Always display the message content clearly to users before signing
* Avoid signing opaque or encoded data that users cannot understand
* Include human-readable prefixes for different message types
* Consider adding timestamps to prevent replay attacks


---

# Sign Transaction (/dapp-kit/actions/sign-transaction)



The `signTransaction` action prompts the connected wallet to sign a transaction without executing
it. This is useful when you need a signed transaction for later execution or for multi-signature
scenarios.

## Usage

```typescript
import { createDAppKit } from '@mysten/dapp-kit-core';
import { Transaction, coinWithBalance } from '@mysten/sui/transactions';

const dAppKit = createDAppKit({
	/* config */
});

const tx = new Transaction();
// No need to manually set sender - it's done automatically
tx.transferObjects([coinWithBalance({ balance: 123 })], '0xrecipient...');

// Sign the transaction without executing it
const { bytes, signature } = await dAppKit.signTransaction({
	transaction: tx,
});
```

## Parameters

* **`transaction`** - `Transaction | string` - The transaction to sign. Can be either a Transaction
  instance or base64-encoded bcs bytes for the transaction.
* **`signal`** (optional) - `AbortSignal` - An abort signal to cancel the signing request.

## Return Value

Returns a `Promise` that resolves to an object containing:

* **`bytes`** - `string` - The signed transaction as a base64-encoded BCS string
* **`signature`** - `string` - The signature as a base64-encoded string

```typescript
const result = await dAppKit.signTransaction({ transaction });
console.log('Signed transaction bytes:', result.bytes);
console.log('Signature:', result.signature);
```

## Transaction Building

When passing a Transaction instance, the action automatically:

1. Sets the sender address if not already set
2. Builds the transaction using the current network's client
3. Converts it to the appropriate format for the wallet

## Wallet Compatibility

* The action transparently handles both `sui:signTransaction` and `sui:signTransactionBlock`
  wallet-standard features

```typescript
// The action automatically detects and uses the appropriate method
// No special configuration needed
const result = await dAppKit.signTransaction({
	transaction: tx,
});
```


---

# Switch Account (/dapp-kit/actions/switch-account)



The `switchAccount` action changes the currently selected account to a different account from the
connected wallet.

<Callout type="info">
  The "current account" is a dApp Kit concept that tracks which account is active within your
  application. Changing the active account in the dApp does not affect the wallet itself, and
  wallets are not notified when the active account changes.
</Callout>

<Callout>
  Account switching is integrated into the [Connect Button](../web-components/connect-button) Web
  Component. When a wallet is connected with multiple accounts, the button provides an account
  selector.
</Callout>

## Usage

```typescript
import { createDAppKit } from '@mysten/dapp-kit-core';

const dAppKit = createDAppKit({
	/* config */
});

// Switch to a different account
dAppKit.switchAccount({
	account: anotherAccount, // UiWalletAccount from the connected wallet
});
```

## Parameters

* **`account`** - `UiWalletAccount` - The account to switch to. Must be an account that belongs to
  the currently connected wallet.

## Return Value

Returns `void`. The action completes synchronously and updates the connection state immediately.


---

# Switch Network (/dapp-kit/actions/switch-network)



The `switchNetwork` action changes the currently selected network that the dApp Kit client is
configured to use.

<Callout type="info">
  Network switching only affects your dApp's client connection. The wallet itself is not affected by
  this change, and wallets are not notified when the network changes in the dApp.
</Callout>

## Usage

```typescript
import { createDAppKit } from '@mysten/dapp-kit-core';
import { SuiGrpcClient } from '@mysten/sui/grpc';

const GRPC_URLS = {
	mainnet: 'https://fullnode.mainnet.sui.io:443',
	testnet: 'https://fullnode.testnet.sui.io:443',
} as const;

const dAppKit = createDAppKit({
	networks: ['mainnet', 'testnet'],
	defaultNetwork: 'mainnet',
	createClient: (network) => new SuiGrpcClient({ network, baseUrl: GRPC_URLS[network] }),
});

// Switch to a different network
dAppKit.switchNetwork('testnet');
```

## Parameters

* **`network`** - `TNetworks[number]` - The network to switch to. Must be one of the networks
  configured when creating the dApp Kit instance.

## Return Value

Returns `void`. The action completes synchronously and updates the network state immediately.


---

# DApp Kit Instance (/dapp-kit/dapp-kit-instance)



The `createDAppKit` function is the foundation of your Sui dApp. It creates an instance that manages
wallet connections, network configuration, and provides access to the Sui client.

## Creating a dApp Kit Instance

The core of the dApp Kit SDK is the `createDAppKit` function, which creates an instance that manages
all dApp functionality:

```typescript
import { createDAppKit } from '@mysten/dapp-kit-core';
import { SuiGrpcClient } from '@mysten/sui/grpc';

const GRPC_URLS = {
	testnet: 'https://fullnode.testnet.sui.io:443',
};

export const dAppKit = createDAppKit({
	networks: ['testnet'],
	createClient: (network) => new SuiGrpcClient({ network, baseUrl: GRPC_URLS[network] }),
});
```

<Callout type="info">
  If you use the React bindings, there are two ways to ensure type safety with hooks:

  1. [Register the global dAppKit type](./getting-started/react#1-create-a-dapp-kit-instance) once, and all hooks will be properly typed
  2. Pass the dAppKit instance explicitly to each hook: `useWalletConnection({ dAppKit })`
</Callout>

This instance provides:

* Wallet connection management
* Network switching capabilities
* Client access for blockchain interactions
* State stores for reactive updates

## Parameters

* **autoConnect** (optional) - Enables automatically connecting to the most recently used wallet
  account (default: `true`)
* **networks** - A list of networks supported by the application (e.g. `['mainnet', 'testnet']`)
* **defaultNetwork** (optional) - Initial network to use (default: first network in the array)
* **createClient** - Creates a new client instance for the given network
* **enableBurnerWallet** (optional) - Enable development-only burner wallet (default: `false`)
* **storage** (optional) - Configures how the most recently connected to wallet account is stored
  (default: `localStorage`, set to `null` to disable)
* **storageKey** (optional) - The key to use to store the most recently connected wallet account
  (default: `'mysten-dapp-kit:selected-wallet-and-address'`)
* **walletInitializers** (optional) - A list of wallet initializers used for registering additional
  wallet standard wallets.
* **slushWalletConfig** (optional) - Configuration for Slush wallet (set to `null` to disable the
  wallet)

## Return Value

```ts
{
    // Actions
    connectWallet: (args: { wallet: UiWallet; account?: UiWalletAccount }) => Promise<{ accounts: UiWalletAccount[]; }>;
    disconnectWallet: () => Promise<void>;
    switchAccount: (args: { account: UiWalletAccount }) => Promise<void>;
    switchNetwork: (network: string) => void;
    signTransaction: (args: { transaction: Transaction | string; signal?: AbortSignal }) => Promise<SignedTransaction>;
    signAndExecuteTransaction: (args: { transaction: Transaction | string; signal?: AbortSignal }) => Promise<TransactionResult>;
    signPersonalMessage: (args: { message: Uint8Array }) => Promise<SignedPersonalMessage>;

    // Properties
    networks: string[];
    stores:  {
        $wallets: DAppKitStores['$compatibleWallets'];
        $connection: DAppKitStores['$connection'];
        $currentNetwork: ReadableAtom<TNetworks[number]>;
        $currentClient: ReadableAtom<Client>;
    };
    getClient: (network?: string) => Client;
}
```

Read more about [actions](./actions/connect-wallet) and [stores](./state).

## Basic Usage

```ts
// dapp-kit.ts
import { createDAppKit } from '@mysten/dapp-kit-core';
import { SuiGrpcClient } from '@mysten/sui/grpc';

const GRPC_URLS = {
	testnet: 'https://fullnode.testnet.sui.io:443',
};

export const dAppKit = createDAppKit({
	networks: ['testnet'],
	createClient: (network) => new SuiGrpcClient({ network, baseUrl: GRPC_URLS[network] }),
});
```

```ts
// connect-wallet-and-log.ts
import type { UiWallet, UiWalletAccount } from '@mysten/dapp-kit-core';
import { dAppKit } from './dapp-kit.ts';

export async function connectWalletAndLog({
	wallet,
	account,
}: {
	wallet: UiWallet;
	account: UiWalletAccount;
}) {
	const result = await dAppKit.connectWallet({
		wallet,
		account,
	});
	console.log('Connected accounts:', result.accounts);
}
```

<Callout>
  If you use the React bindings, see [Getting Started in React](./getting-started/react) and
  [DAppKitProvider](./react/dapp-kit-provider).
</Callout>

## Development Configuration

For development environments, enable the burner wallet:

```typescript
import { createDAppKit } from '@mysten/dapp-kit-core';
import { SuiGrpcClient } from '@mysten/sui/grpc';

export const dAppKit = createDAppKit({
	networks: ['localnet'],
	defaultNetwork: 'localnet',
	createClient: () => new SuiGrpcClient({ network: 'localnet', baseUrl: 'http://127.0.0.1:9000' }),
	enableBurnerWallet: true, // Dev-only feature
});
```

## Auto-Connect Behavior

By default, dApp Kit automatically reconnects to the previously connected wallet.

### Disabling Auto-Connect

```typescript
import { createDAppKit } from '@mysten/dapp-kit-core';
import { SuiGrpcClient } from '@mysten/sui/grpc';

export const dAppKit = createDAppKit({
	networks: ['mainnet'],
	createClient: () =>
		new SuiGrpcClient({ network: 'mainnet', baseUrl: 'https://fullnode.mainnet.sui.io:443' }),
	autoConnect: false,
});
```

## Custom Wallet Integration

Add support for custom wallets using wallet initializers:

```typescript
import { createDAppKit } from '@mysten/dapp-kit-core';
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { getWallets } from '@mysten/wallet-standard';
import { CustomWallet } from './custom-wallet.js'; // import your custom wallet class

export const dAppKit = createDAppKit({
	networks: ['mainnet'],
	createClient: () =>
		new SuiGrpcClient({ network: 'mainnet', baseUrl: 'https://fullnode.mainnet.sui.io:443' }),
	walletInitializers: [
		{
			id: 'Custom Wallets',
			initialize() {
				const wallets = [new CustomWallet()];
				const walletsApi = getWallets();
				return { unregister: walletsApi.register(...wallets) };
			},
		},
	],
});
```


---

# @mysten/create-dapp (/dapp-kit/getting-started/create-dapp)



`@mysten/create-dapp` is a CLI tool that scaffolds a complete Sui dApp project with best practices
built in.

## Quick Start

```sh npm2yarn
npm create @mysten/dapp
```

The CLI prompts you to choose a template and project name, then creates a ready-to-run project.

## Templates

### react-client-dapp

A basic React dApp that demonstrates wallet connection and fetching owned objects:

* Wallet connection with `ConnectButton`
* Display connected wallet address
* List objects owned by the connected wallet
* Clean, modern UI with Tailwind CSS

### react-e2e-counter

A complete end-to-end example with Move smart contract integration:

* Move counter contract in `move/counter/`
* TypeScript bindings generated with `@mysten/codegen`
* Create, increment, and reset counters
* MVR (Move Registry) name resolution for package IDs
* Full transaction signing and execution

## Tech Stack

Both templates include:

* [React](https://react.dev/) - UI framework
* [TypeScript](https://www.typescriptlang.org/) - Type safety
* [Vite](https://vitejs.dev/) - Fast build tooling
* [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first styling
* [Lucide React](https://lucide.dev/) - Modern icons
* [`@mysten/dapp-kit-react`](/dapp-kit) - Wallet connection and blockchain interaction
* [pnpm](https://pnpm.io/) - Package management

The e2e-counter template also includes:

* [`@mysten/codegen`](/codegen) - Generate TypeScript from Move code

## Project Structure

### react-client-dapp

```
src/
├── components/ui/     # Reusable UI components (Card)
├── lib/utils.ts       # Utility functions
├── App.tsx            # Main application
├── WalletStatus.tsx   # Wallet connection display
├── OwnedObjects.tsx   # Object list component
├── dApp-kit.ts        # dApp Kit configuration
└── index.css          # Tailwind CSS theme
```

### react-e2e-counter

```
src/
├── components/ui/     # UI components (Button, Card)
├── contracts/         # Generated TypeScript bindings
├── lib/utils.ts       # Utility functions
├── App.tsx            # Main application
├── Counter.tsx        # Counter display and controls
├── CreateCounter.tsx  # Counter creation
├── dApp-kit.ts        # dApp Kit configuration
├── constants.ts       # Package IDs per network
└── index.css          # Tailwind CSS theme
move/
└── counter/           # Move smart contract
```

## Using the e2e-counter Template

### 1. Deploy the Move Contract

First, install the [Sui CLI](https://docs.sui.io/build/install) and set up testnet:

```bash
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
sui client switch --env testnet
```

Get testnet SUI from the [faucet](https://faucet.sui.io), then publish:

```bash
cd move
sui client publish --gas-budget 100000000 counter
```

### 2. Configure the Package ID

Copy the `packageId` from the publish output to `src/constants.ts`:

```ts
export const TESTNET_COUNTER_PACKAGE_ID = '<YOUR_PACKAGE_ID>';
```

### 3. Generate TypeScript Bindings

```bash
pnpm codegen
```

This generates type-safe functions in `src/contracts/` for interacting with your Move modules.

### 4. Start Development

```bash
pnpm install
pnpm dev
```

## Customizing the UI

The templates use [Tailwind CSS v4](https://tailwindcss.com/docs) with
[shadcn/ui](https://ui.shadcn.com/)-style components. The UI components in `src/components/ui/` can
be customized or extended.

To add more components, copy them from the
[shadcn/ui components](https://ui.shadcn.com/docs/components) documentation and adapt them to your
project.

Theme variables are defined in `src/index.css` using Tailwind's `@theme` directive.

## CLI Options

You can skip prompts with command-line flags:

```bash
# Create with specific template
npm create @mysten/dapp -- -t react-e2e-counter

# Create with specific name
npm create @mysten/dapp -- -n my-app

# Create with both
npm create @mysten/dapp -- -t react-client-dapp -n my-app
```


---

# Next.js (/dapp-kit/getting-started/next-js)



This guide covers integrating dApp Kit into Next.js applications, including handling server-side
rendering (SSR).

## Installation

```sh npm2yarn
npm i @mysten/dapp-kit-react @mysten/sui
```

## Setup

### 1. Create a dApp Kit Instance

```ts
// app/dapp-kit.ts
import { createDAppKit } from '@mysten/dapp-kit-react';
import { SuiGrpcClient } from '@mysten/sui/grpc';

const GRPC_URLS = {
	testnet: 'https://fullnode.testnet.sui.io:443',
} as const;

export const dAppKit = createDAppKit({
	networks: ['testnet'],
	createClient: (network) => new SuiGrpcClient({ network, baseUrl: GRPC_URLS[network] }),
});

// Register types for hook type inference
declare module '@mysten/dapp-kit-react' {
	interface Register {
		dAppKit: typeof dAppKit;
	}
}
```

### 2. Create a Client-Only Wrapper

Wallet detection only works in the browser, so dApp Kit components must be client-side rendered:

```tsx
// app/DAppKitClientProvider.tsx
'use client';

import { DAppKitProvider, ConnectButton } from '@mysten/dapp-kit-react';
import { dAppKit } from './dapp-kit';

export function DAppKitClientProvider({ children }: { children: React.ReactNode }) {
	return <DAppKitProvider dAppKit={dAppKit}>{children}</DAppKitProvider>;
}

export { ConnectButton };
```

### 3. Use Dynamic Import in Pages

Use Next.js dynamic imports with `ssr: false` to prevent server-side rendering:

```tsx
// app/page.tsx
import dynamic from 'next/dynamic';

const DAppKitClientProvider = dynamic(
	() => import('./DAppKitClientProvider').then((mod) => mod.DAppKitClientProvider),
	{ ssr: false },
);

const ConnectButton = dynamic(
	() => import('./DAppKitClientProvider').then((mod) => mod.ConnectButton),
	{ ssr: false, loading: () => <button disabled>Loading...</button> },
);

export default function Home() {
	return (
		<DAppKitClientProvider>
			<main>
				<h1>My Sui dApp</h1>
				<ConnectButton />
			</main>
		</DAppKitClientProvider>
	);
}
```

## Alternative: Single Client Component

For simpler apps, create a single client component:

```tsx
// app/WalletApp.tsx
'use client';

import {
	DAppKitProvider,
	ConnectButton,
	useCurrentAccount,
	useDAppKit,
} from '@mysten/dapp-kit-react';
import { Transaction, coinWithBalance } from '@mysten/sui/transactions';
import { dAppKit } from './dapp-kit';

function WalletStatus() {
	const account = useCurrentAccount();
	const dAppKit = useDAppKit();

	if (!account) {
		return <p>Connect your wallet to get started</p>;
	}

	async function handleTransfer() {
		const tx = new Transaction();
		tx.transferObjects([coinWithBalance({ balance: 1_000_000 })], account.address);
		const result = await dAppKit.signAndExecuteTransaction({ transaction: tx });

		if (result.FailedTransaction) {
			throw new Error(`Transaction failed: ${result.FailedTransaction.status.error?.message}`);
		}

		alert(`Transaction: ${result.Transaction.digest}`);
	}

	return (
		<div>
			<p>Connected: {account.address}</p>
			<button onClick={handleTransfer}>Send Transaction</button>
		</div>
	);
}

export default function WalletApp() {
	return (
		<DAppKitProvider dAppKit={dAppKit}>
			<ConnectButton />
			<WalletStatus />
		</DAppKitProvider>
	);
}
```

```tsx
// app/page.tsx
import dynamic from 'next/dynamic';

const WalletApp = dynamic(() => import('./WalletApp'), {
	ssr: false,
	loading: () => <p>Loading wallet...</p>,
});

export default function Home() {
	return (
		<main>
			<h1>My Sui dApp</h1>
			<WalletApp />
		</main>
	);
}
```

## Key Considerations

### Why SSR: false?

Wallets are detected via the browser's `window` object and the Wallet Standard API. This detection
cannot happen on the server, so components that interact with wallets must be client-side only.

### Hydration Errors

If you see hydration errors, ensure all dApp Kit components are wrapped with `ssr: false` dynamic
imports or are inside a `'use client'` component that's dynamically imported.

## Example Application

See the complete
[Next.js example](https://github.com/MystenLabs/ts-sdks/tree/main/packages/dapp-kit-next/examples/next-js/simple)
on GitHub.

## Next Steps

* [React Hooks](/dapp-kit/react/hooks) - All available hooks
* [React Components](/dapp-kit/react/components) - UI components
* [Theming](/dapp-kit/theming) - Customize appearance


---

# React (/dapp-kit/getting-started/react)



This guide walks you through integrating dApp Kit into a React application.

## Quick Start with create-dapp

The fastest way to get started is using our CLI tool:

```sh npm2yarn
npm create @mysten/dapp
```

This creates a new project with:

* React + TypeScript + Vite
* Tailwind CSS v4 for styling
* dApp Kit pre-configured
* Example wallet connection UI

Choose from two templates:

* **react-client-dapp**: Basic wallet connection and object display
* **react-e2e-counter**: Full example with Move smart contract and codegen

See the [create-dapp guide](/dapp-kit/getting-started/create-dapp) for more details.

***

## Manual Installation

```sh npm2yarn
npm i @mysten/dapp-kit-react @mysten/sui
```

## Setup

### 1. Create a dApp Kit Instance

Create a file to configure your dApp Kit instance:

```tsx
// dapp-kit.ts
import { createDAppKit } from '@mysten/dapp-kit-react';
import { SuiGrpcClient } from '@mysten/sui/grpc';

const GRPC_URLS = {
	testnet: 'https://fullnode.testnet.sui.io:443',
};

export const dAppKit = createDAppKit({
	networks: ['testnet'],
	createClient: (network) => new SuiGrpcClient({ network, baseUrl: GRPC_URLS[network] }),
});

// Register types for hook type inference
declare module '@mysten/dapp-kit-react' {
	interface Register {
		dAppKit: typeof dAppKit;
	}
}
```

### 2. Add the Provider

Wrap your application with `DAppKitProvider`:

```tsx
// App.tsx
import { DAppKitProvider, ConnectButton } from '@mysten/dapp-kit-react';
import { dAppKit } from './dapp-kit';

export default function App() {
	return (
		<DAppKitProvider dAppKit={dAppKit}>
			<div>
				<h1>My Sui dApp</h1>
				<ConnectButton />
				<WalletStatus />
			</div>
		</DAppKitProvider>
	);
}
```

### 3. Display Connection Status

Use hooks to access wallet state:

```tsx
import { useCurrentAccount, useCurrentWallet, useCurrentNetwork } from '@mysten/dapp-kit-react';

function WalletStatus() {
	const account = useCurrentAccount();
	const wallet = useCurrentWallet();
	const network = useCurrentNetwork();

	if (!account) {
		return <p>Connect your wallet to get started</p>;
	}

	return (
		<div>
			<p>Wallet: {wallet?.name}</p>
			<p>Address: {account.address}</p>
			<p>Network: {network}</p>
		</div>
	);
}
```

### 4. Execute Transactions

Use the `useDAppKit` hook to sign and execute transactions:

```tsx
import { useDAppKit, useCurrentAccount } from '@mysten/dapp-kit-react';
import { Transaction, coinWithBalance } from '@mysten/sui/transactions';

function TransferButton() {
	const dAppKit = useDAppKit();
	const account = useCurrentAccount();

	async function handleTransfer() {
		const tx = new Transaction();
		tx.transferObjects([coinWithBalance({ balance: 1_000_000 })], 'RECIPIENT_ADDRESS');

		try {
			const result = await dAppKit.signAndExecuteTransaction({ transaction: tx });

			if (result.FailedTransaction) {
				throw new Error(`Transaction failed: ${result.FailedTransaction.status.error?.message}`);
			}

			console.log('Transaction digest:', result.Transaction.digest);
		} catch (error) {
			console.error('Transaction failed:', error);
		}
	}

	return (
		<button onClick={handleTransfer} disabled={!account}>
			Send Transaction
		</button>
	);
}
```

## Available Hooks

| Hook                                                               | Description                              |
| ------------------------------------------------------------------ | ---------------------------------------- |
| [useDAppKit](/dapp-kit/react/hooks/use-dapp-kit)                   | Access the dApp Kit instance and actions |
| [useWalletConnection](/dapp-kit/react/hooks/use-wallet-connection) | Full connection state with status flags  |
| [useCurrentAccount](/dapp-kit/react/hooks/use-current-account)     | Currently selected account               |
| [useCurrentWallet](/dapp-kit/react/hooks/use-current-wallet)       | Currently connected wallet               |
| [useCurrentNetwork](/dapp-kit/react/hooks/use-current-network)     | Current network                          |
| [useCurrentClient](/dapp-kit/react/hooks/use-current-client)       | SuiClient for current network            |
| [useWallets](/dapp-kit/react/hooks/use-wallets)                    | List of available wallets                |

## Components

| Component                                                  | Description                       |
| ---------------------------------------------------------- | --------------------------------- |
| [ConnectButton](/dapp-kit/react/components/connect-button) | Complete wallet connection UI     |
| [ConnectModal](/dapp-kit/react/components/connect-modal)   | Standalone wallet selection modal |
| [DAppKitProvider](/dapp-kit/react/dapp-kit-provider)       | Context provider for hooks        |

## Example Application

See the complete
[React example](https://github.com/MystenLabs/ts-sdks/tree/main/packages/dapp-kit-next/examples/react/simple)
on GitHub.

## Next Steps

* [DAppKitProvider](/dapp-kit/react/dapp-kit-provider) - Provider configuration
* [Hooks Reference](/dapp-kit/react/hooks) - All available hooks
* [Components](/dapp-kit/react/components) - UI components
* [Theming](/dapp-kit/theming) - Customize appearance


---

# Vue (/dapp-kit/getting-started/vue)



This guide walks you through integrating dApp Kit into a Vue application using Web Components and
direct store access.

## Installation

```sh npm2yarn
npm i @mysten/dapp-kit-core @mysten/sui @nanostores/vue
```

## Setup

### 1. Create a dApp Kit Instance

```ts
// src/dapp-kit.ts
import { createDAppKit } from '@mysten/dapp-kit-core';
import { SuiGrpcClient } from '@mysten/sui/grpc';

const GRPC_URLS = {
	testnet: 'https://fullnode.testnet.sui.io:443',
};

export const dAppKit = createDAppKit({
	networks: ['testnet'],
	createClient: (network) => new SuiGrpcClient({ network, baseUrl: GRPC_URLS[network] }),
});
```

### 2. Register Web Components

Import the web components in your app entry point:

```ts
// src/main.ts
import '@mysten/dapp-kit-core/web';
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');
```

### 3. Use the Connect Button

```vue
<script setup lang="ts">
import { dAppKit } from './dapp-kit';
</script>

<template>
	<div>
		<h1>My Sui dApp</h1>
		<mysten-dapp-kit-connect-button :instance="dAppKit" />
	</div>
</template>
```

### 4. Access Connection State

Use `@nanostores/vue` for reactive state:

```vue
<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { dAppKit } from './dapp-kit';

const connection = useStore(dAppKit.stores.$connection);
const network = useStore(dAppKit.stores.$currentNetwork);
</script>

<template>
	<div>
		<mysten-dapp-kit-connect-button :instance="dAppKit" />

		<div v-if="connection.account">
			<p>Wallet: {{ connection.wallet?.name }}</p>
			<p>Address: {{ connection.account.address }}</p>
			<p>Network: {{ network }}</p>
		</div>
		<p v-else>Connect your wallet to get started</p>
	</div>
</template>
```

### 5. Execute Transactions

```vue
<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { Transaction, coinWithBalance } from '@mysten/sui/transactions';
import { dAppKit } from './dapp-kit';

const connection = useStore(dAppKit.stores.$connection);

async function handleTransfer() {
	const tx = new Transaction();
	tx.transferObjects([coinWithBalance({ balance: 1_000_000 })], connection.value.account!.address);

	try {
		const result = await dAppKit.signAndExecuteTransaction({ transaction: tx });

		if (result.FailedTransaction) {
			throw new Error(`Transaction failed: ${result.FailedTransaction.status.error?.message}`);
		}

		alert(`Transaction: ${result.Transaction.digest}`);
	} catch (error) {
		console.error('Transaction failed:', error);
	}
}
</script>

<template>
	<div>
		<mysten-dapp-kit-connect-button :instance="dAppKit" />

		<button v-if="connection.account" @click="handleTransfer">Send Transaction</button>
	</div>
</template>
```

## Complete Example

```vue
<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { Transaction, coinWithBalance } from '@mysten/sui/transactions';
import { dAppKit } from './dapp-kit';

const connection = useStore(dAppKit.stores.$connection);
const network = useStore(dAppKit.stores.$currentNetwork);

async function handleTransfer() {
	if (!connection.value.account) return;

	const tx = new Transaction();
	tx.transferObjects([coinWithBalance({ balance: 1_000_000 })], connection.value.account.address);

	try {
		const result = await dAppKit.signAndExecuteTransaction({ transaction: tx });

		if (result.FailedTransaction) {
			throw new Error(`Transaction failed: ${result.FailedTransaction.status.error?.message}`);
		}

		alert(`Transaction successful: ${result.Transaction.digest}`);
	} catch (error) {
		console.error('Transaction failed:', error);
	}
}
</script>

<template>
	<div class="app">
		<h1>My Sui dApp</h1>
		<mysten-dapp-kit-connect-button :instance="dAppKit" />

		<div v-if="connection.account" class="wallet-info">
			<p>Wallet: {{ connection.wallet?.name }}</p>
			<p>Address: {{ connection.account.address }}</p>
			<p>Network: {{ network }}</p>
			<button @click="handleTransfer">Send Test Transaction</button>
		</div>
		<p v-else>Connect your wallet to get started</p>
	</div>
</template>
```

## Web Components

Vue works with dApp Kit's Web Components through property binding:

| Component      | Usage                                                                  |
| -------------- | ---------------------------------------------------------------------- |
| Connect Button | `<mysten-dapp-kit-connect-button :instance="dAppKit" />`               |
| Connect Modal  | `<mysten-dapp-kit-connect-modal :instance="dAppKit" :open="isOpen" />` |

See [Web Components](/dapp-kit/web-components/connect-button) for full documentation.

## Available Stores

Access these stores via `dAppKit.stores`:

| Store             | Description                                       |
| ----------------- | ------------------------------------------------- |
| `$connection`     | Connection state with wallet, account, and status |
| `$currentNetwork` | Current network string                            |
| `$currentClient`  | SuiClient for current network                     |
| `$wallets`        | List of available wallets                         |

See [State Management](/dapp-kit/state) for full documentation.

## Example Application

See the complete
[Vue example](https://github.com/MystenLabs/ts-sdks/tree/main/packages/dapp-kit-next/examples/vue/simple)
on GitHub.

## Next Steps

* [Web Components](/dapp-kit/web-components/connect-button) - Component documentation
* [State Management](/dapp-kit/state) - Store details
* [Actions](/dapp-kit/actions/connect-wallet) - All available actions
* [Theming](/dapp-kit/theming) - Customize appearance


---

# Sui dApp Kit (Legacy) (/dapp-kit/legacy)



<Callout type="warning">
  **Deprecated - JSON RPC Only**: This legacy version of `@mysten/dapp-kit` only works with the
  deprecated JSON RPC API and will not be updated to support gRPC or GraphQL. For new projects, use
  [`@mysten/dapp-kit-core` and `@mysten/dapp-kit-react`](/dapp-kit).
</Callout>

The Sui dApp Kit is a set of React components, hooks, and utilities to help you build a dApp for the
Sui ecosystem. Its hooks and components provide an interface for querying data from the Sui network
and connecting to Sui wallets.

### Core Features

Some of the core features of the dApp Kit include:

* Query hooks to get the information your dApp needs
* Automatic wallet state management
* Support for all Sui wallets
* Pre-built React components
* Lower level hooks for custom components

## Install

To use the Sui dApp Kit in your project, run the following command in your project root:

```sh npm2yarn
npm i --save @mysten/dapp-kit @mysten/sui @tanstack/react-query
```

## Setting up providers

To use the hooks and components in the dApp Kit, wrap your app with the providers shown in the
following example. The props available on the providers are covered in more detail in their
respective pages.

```tsx
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
	localnet: { url: getFullnodeUrl('localnet') },
	mainnet: { url: getFullnodeUrl('mainnet') },
});
const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<SuiClientProvider networks={networkConfig} defaultNetwork="localnet">
				<WalletProvider>
					<YourApp />
				</WalletProvider>
			</SuiClientProvider>
		</QueryClientProvider>
	);
}
```

## Using UI components to connect to a wallet

The dApp Kit provides a set of flexible UI components that you can use to connect and manage wallet
accounts from your dApp. The components are built on top of
[Radix UI](https://www.radix-ui.com/primitives) and are customizable.

To use the provided UI components, import the dApp Kit CSS stylesheet into your dApp. For more
information regarding customization options, check out the respective documentation pages for the
components and [themes](/dapp-kit/legacy/themes).

```tsx
import '@mysten/dapp-kit/dist/index.css';
```

## Using hooks to make RPC calls

The dApp Kit provides a set of hooks for making RPC calls to the Sui blockchain. The hooks are thin
wrappers around `useQuery` from `@tanstack/react-query`. For more comprehensive documentation on how
to use these query hooks, check out the
[react-query documentation](https://tanstack.com/query/latest/docs/react/overview).

```tsx
import { useSuiClientQuery } from '@mysten/dapp-kit';

function MyComponent() {
	const { data, isPending, error, refetch } = useSuiClientQuery('getOwnedObjects', {
		owner: '0x123',
	});

	if (isPending) {
		return <div>Loading...</div>;
	}

	return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```


---

# Rpc Hooks (/dapp-kit/legacy/rpc-hooks)



Sui dApp Kit ships with hooks for each of the RPC methods defined in the
[JSON RPC specification](https://docs.sui.io/sui-api-ref).

## useSuiClientQuery

Load data from the Sui RPC using the `useSuiClientQuery` hook. This hook is a wrapper around the
[useQuery](https://tanstack.com/query/latest/docs/react/guides/queries) hook from
@tanstack/react-query.

The hook takes the RPC method name as the first argument and any parameters as the second argument.
You can pass any additional `useQuery` options as the third argument. You can read the
[useQuery documentation](https://tanstack.com/query/latest/docs/react/guides/queries) for more
details on the full set of options available.

```tsx
import { useSuiClientQuery } from '@mysten/dapp-kit';

function MyComponent() {
	const { data, isPending, isError, error, refetch } = useSuiClientQuery(
		'getOwnedObjects',
		{ owner: '0x123' },
		{
			gcTime: 10000,
		},
	);

	if (isPending) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error: {error.message}</div>;
	}

	return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

## useSuiClientQueries

You can fetch a variable number of Sui RPC queries using the `useSuiClientQueries` hook. This hook
is a wrapper around the
[useQueries](https://tanstack.com/query/latest/docs/react/reference/useQueries) hook from
@tanstack/react-query.

The `queries` value is an array of query option objects identical to the `useSuiClientQuery` hook.

The `combine` parameter is optional. Use this parameter to combine the results of the queries into a
single value. The result is structurally shared to be as referentially stable as possible.

```tsx
import { useSuiClientQueries } from '@mysten/dapp-kit';

function MyComponent() {
	const { data, isPending, isError } = useSuiClientQueries({
		queries: [
			{
				method: 'getAllBalances',
				params: {
					owner: '0x123',
				},
			},
			{
				method: 'queryTransactionBlocks',
				params: {
					filter: {
						FromAddress: '0x123',
					},
				},
			},
		],
		combine: (result) => {
			return {
				data: result.map((res) => res.data),
				isSuccess: result.every((res) => res.isSuccess),
				isPending: result.some((res) => res.isPending),
				isError: result.some((res) => res.isError),
			};
		},
	});

	if (isPending) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Fetching Error</div>;
	}

	return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

## useSuiClientInfiniteQuery

For RPC methods that support pagination, dApp Kit also implements a `useSuiClientInfiniteQuery`
hook. For more details check out the
[`useInfiniteQuery` documentation](https://tanstack.com/query/latest/docs/react/guides/infinite-queries).

```tsx
import { useSuiClientInfiniteQuery } from '@mysten/dapp-kit';

function MyComponent() {
	const { data, isPending, isError, error, isFetching, fetchNextPage, hasNextPage } =
		useSuiClientInfiniteQuery('getOwnedObjects', {
			owner: '0x123',
		});

	if (isPending) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error: {error.message}</div>;
	}

	return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

## useSuiClientMutation

For RPC methods that mutate state, dApp Kit implements a `useSuiClientMutation` hook. Use this hook
with any RPC method to imperatively call the RPC method. For more details, check out the
[`useMutation` documentation](https://tanstack.com/query/latest/docs/react/guides/mutations).

```tsx
import { useSuiClientMutation } from '@mysten/dapp-kit';

function MyComponent() {
	const { mutate } = useSuiClientMutation('dryRunTransactionBlock');

	return (
		<Button
			onClick={() => {
				mutate({
					transactionBlock: tx,
				});
			}}
		>
			Dry run transaction
		</Button>
	);
}
```

## useResolveSuiNSName

To get the SuiNS name for a given address, use the `useResolveSuiNSName` hook.

```tsx
import { useResolveSuiNSName } from '@mysten/dapp-kit';

function MyComponent() {
	const { data, isPending } = useResolveSuiNSName('0x123');

	if (isPending) {
		return <div>Loading...</div>;
	}

	if (data) {
		return <div>Domain name is: {data}</div>;
	}

	return <div>Domain name not found</div>;
}
```


---

# Slush Integration (/dapp-kit/legacy/slush)



dApp Kit provides out-of-the-box opt-in support for the [Slush wallet](/slush-wallet/dapp).

## Setup

To enable support for Slush wallets, pass the `slushWallet` object to the `WalletProvider`
component. This object has the following properties:

* **`name`** - The name of your dApp, shown to the user when connecting to the dApp.

```tsx
function App({ children }) {
	return (
		<WalletProvider
			slushWallet={{
				name: 'Your dApp name',
			}}
		>
			{children}
		</WalletProvider>
	);
}
```

<Callout>
  Note: In the connect modal, users with the Slush Wallet extension installed will only see the
  extension. If they don’t have it, the connection will default to the Slush web app.
</Callout>


---

# SuiClientProvider (/dapp-kit/legacy/sui-client-provider)



The `SuiClientProvider` manages the active `SuiJsonRpcClient` that hooks and components use in the
dApp Kit.

## Usage

Place the `SuiClientProvider` at the root of your app and wrap all components that use the dApp Kit
hooks.

`SuiClientProvider` accepts a list of network configurations to create `SuiJsonRpcClient` instances
for the currently active network.

```tsx
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
	localnet: { url: getJsonRpcFullnodeUrl('localnet') },
	mainnet: { url: getJsonRpcFullnodeUrl('mainnet') },
});

function App() {
	return (
		<SuiClientProvider networks={networkConfig} defaultNetwork="localnet">
			<YourApp />
		</SuiClientProvider>
	);
}
```

## Props

* `networks`: A map of networks you can use. The keys are the network names, and the values can be
  either a configuration object (`SuiClientOptions`) or a `SuiJsonRpcClient` instance.
* `defaultNetwork`: The name of the network to use by default when using the `SuiClientProvider` as
  an uncontrolled component.
* `network`: The name of the network to use when using the `SuiClientProvider` as a controlled
  component.
* `onNetworkChange`: A callback when the active network changes.
* `createClient`: A callback when a new `SuiJsonRpcClient` is created (for example, when the active
  network changes). It receives the network name and configuration object as arguments, returning a
  `SuiJsonRpcClient` instance.

## Controlled component

The following example demonstrates a `SuiClientProvider` used as a controlled component.

```tsx
import { createNetworkConfig, SuiClientProvider } from '@mysten/dapp-kit';
import { getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';
import { useState } from 'react';

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
	localnet: { url: getJsonRpcFullnodeUrl('localnet') },
	mainnet: { url: getJsonRpcFullnodeUrl('mainnet') },
});

function App() {
	const [activeNetwork, setActiveNetwork] = useState('localnet' as keyof typeof networks);

	return (
		<SuiClientProvider
			networks={networkConfig}
			network={activeNetwork}
			onNetworkChange={(network) => {
				setActiveNetwork(network);
			}}
		>
			<YourApp />
		</SuiClientProvider>
	);
}
```

## SuiJsonRpcClient customization

The following example demonstrates how to create a custom `SuiJsonRpcClient`.

```tsx
import { SuiClientProvider } from '@mysten/dapp-kit';
import { getJsonRpcFullnodeUrl, SuiJsonRpcClient, SuiHTTPTransport } from '@mysten/sui/jsonRpc';

// Config options for the networks you want to connect to
const networks = {
	localnet: { url: getJsonRpcFullnodeUrl('localnet') },
	mainnet: { url: getJsonRpcFullnodeUrl('mainnet') },
} satisfies Record<string, SuiClientOptions>;

function App() {
	return (
		<SuiClientProvider
			networks={networks}
			defaultNetwork="localnet"
			createClient={(network, config) => {
				return new SuiJsonRpcClient({
					transport: new SuiHTTPTransport({
						url: 'https://api.safecoin.org',
						rpc: {
							headers: {
								Authorization: 'xyz',
							},
						},
					}),
				});
			}}
		>
			<YourApp />
		</SuiClientProvider>
	);
}
```

## Using the SuiJsonRpcClient from the provider

To use the `SuiJsonRpcClient` from the provider, import the `useSuiClient` function from the
`@mysten/dapp-kit` module.

```tsx
import { useSuiClient } from '@mysten/dapp-kit';

function MyComponent() {
	const client = useSuiClient();

	// use the client
}
```

## Creating a network selector

The dApp Kit doesn't provide its own network switcher, but you can use the `useSuiClientContext`
hook to get the list of networks and set the active one:

```tsx
function NetworkSelector() {
	const ctx = useSuiClientContext();

	return (
		<div>
			{Object.keys(ctx.networks).map((network) => (
				<button key={network} onClick={() => ctx.selectNetwork(network)}>
					{`select ${network}`}
				</button>
			))}
		</div>
	);
}
```

## Using network specific configuration

If your dApp runs on multiple networks, the IDs for packages and other configurations might change,
depending on which network you're using. You can use `createNetworkConfig` to create per-network
configurations that your components can access.

The `createNetworkConfig` function returns the provided configuration, along with hooks you can use
to get the variables defined in your configuration.

* `useNetworkConfig` returns the full network configuration object
* `useNetworkVariables` returns the full variables object from the network configuration
* `useNetworkVariable` returns a specific variable from the network configuration

```tsx
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Config options for the networks you want to connect to
const { networkConfig, useNetworkVariable } = createNetworkConfig({
	localnet: {
		url: getJsonRpcFullnodeUrl('localnet'),
		variables: {
			myMovePackageId: '0x123',
		},
	},
	mainnet: {
		url: getJsonRpcFullnodeUrl('mainnet'),
		variables: {
			myMovePackageId: '0x456',
		},
	},
});

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<SuiClientProvider networks={networkConfig} defaultNetwork="localnet">
				<WalletProvider>
					<YourApp />
				</WalletProvider>
			</SuiClientProvider>
		</QueryClientProvider>
	);
}

function YourApp() {
	const id = useNetworkVariable('myMovePackageId');

	return <div>Package ID: {id}</div>;
}
```


---

# Themes (/dapp-kit/legacy/themes)



You can provide a theme to the `WalletProvider` component to customize the components in dApp Kit.

```tsx
import { lightTheme, WalletProvider } from '@mysten/dapp-kit';

const App = () => {
	return (
		<WalletProvider theme={lightTheme}>
			<YourApp />
		</WalletProvider>
	);
};
```

## Dynamic themes

To dynamically change the theme, you can provide multiple themes to the `WalletProvider` component:

```tsx
import { lightTheme, WalletProvider } from '@mysten/dapp-kit';

import { darkTheme, pinkTheme } from './my-themes';

const App = () => {
	return (
		<WalletProvider
			theme={[
				{
					// default to light theme
					variables: lightTheme,
				},
				{
					// Adds theme inside a media query
					mediaQuery: '(prefers-color-scheme: dark)',
					variables: darkTheme,
				},
				{
					// prefixes the theme styles with the given selector
					// this allows controlling the theme by adding a class to the body
					selector: '.pink-theme',
					variables: pinkTheme,
				},
			]}
		>
			<YourApp />
		</WalletProvider>
	);
};
```

## Theme variables

To define a custom theme, implement the `ThemeVars` interface with CSS variable values for your
theme:

```tsx
import { ThemeVars } from '@mysten/dapp-kit';

// Light theme copied from dapp-kit
export const lightTheme: ThemeVars = {
	blurs: {
		modalOverlay: 'blur(0)',
	},
	backgroundColors: {
		primaryButton: '#F6F7F9',
		primaryButtonHover: '#F0F2F5',
		outlineButtonHover: '#F4F4F5',
		modalOverlay: 'rgba(24 36 53 / 20%)',
		modalPrimary: 'white',
		modalSecondary: '#F7F8F8',
		iconButton: 'transparent',
		iconButtonHover: '#F0F1F2',
		dropdownMenu: '#FFFFFF',
		dropdownMenuSeparator: '#F3F6F8',
		walletItemSelected: 'white',
		walletItemHover: '#3C424226',
	},
	borderColors: {
		outlineButton: '#E4E4E7',
	},
	colors: {
		primaryButton: '#373737',
		outlineButton: '#373737',
		iconButton: '#000000',
		body: '#182435',
		bodyMuted: '#767A81',
		bodyDanger: '#FF794B',
	},
	radii: {
		small: '6px',
		medium: '8px',
		large: '12px',
		xlarge: '16px',
	},
	shadows: {
		primaryButton: '0px 4px 12px rgba(0, 0, 0, 0.1)',
		walletItemSelected: '0px 2px 6px rgba(0, 0, 0, 0.05)',
	},
	fontWeights: {
		normal: '400',
		medium: '500',
		bold: '600',
	},
	fontSizes: {
		small: '14px',
		medium: '16px',
		large: '18px',
		xlarge: '20px',
	},
	typography: {
		fontFamily:
			'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
		fontStyle: 'normal',
		lineHeight: '1.3',
		letterSpacing: '1',
	},
};
```


---

# ConnectButton (/dapp-kit/legacy/wallet-components/ConnectButton)



import { ConnectButtonExample } from '../../../../examples/wallet-components-client';

The `ConnectButton` shows the user a button to connect and disconnect a wallet. It automatically
uses the connected state to show a **connect** or **disconnect** button.

```tsx
import { ConnectButton } from '@mysten/dapp-kit';

export function YourApp() {
	return <ConnectButton />;
}
```

<ConnectButtonExample />

### Props

All props are optional.

* `connectText = "Connect Wallet"` - The text that displays in the button when the user is not
  currently connected to a wallet.
* `walletFilter` - A filter function that receives a wallet instance, and returns a boolean
  indicating whether the wallet should be displayed in the wallet list. By default, all wallets are
  displayed.


---

# ConnectModal (/dapp-kit/legacy/wallet-components/ConnectModal)



import {
	ControlledConnectModalExample,
	UncontrolledConnectModalExample,
} from '../../../../examples/wallet-components-client';

The `ConnectModal` component opens a modal that guides the user through connecting their wallet to
the dApp.

## Controlled example

```tsx
import { ConnectModal, useCurrentAccount } from '@mysten/dapp-kit';
import { useState } from 'react';

export function YourApp() {
	const currentAccount = useCurrentAccount();
	const [open, setOpen] = useState(false);

	return (
		<ConnectModal
			trigger={
				<button disabled={!!currentAccount}> {currentAccount ? 'Connected' : 'Connect'}</button>
			}
			open={open}
			onOpenChange={(isOpen) => setOpen(isOpen)}
		/>
	);
}
```

Click **Connect** to connect your wallet and see the previous code in action:

<ControlledConnectModalExample />

## Uncontrolled example

```tsx
import { ConnectModal, useCurrentAccount } from '@mysten/dapp-kit';

export function YourApp() {
	const currentAccount = useCurrentAccount();

	return (
		<ConnectModal
			trigger={
				<button disabled={!!currentAccount}> {currentAccount ? 'Connected' : 'Connect'}</button>
			}
		/>
	);
}
```

Click **Connect** to connect your wallet and see the previous code in action:

<UncontrolledConnectModalExample />

## Controlled props

* `open` - The controlled open state of the dialog.
* `onOpenChange` - Event handler called when the open state of the dialog changes.
* `trigger` - The trigger button that opens the dialog.
* `walletFilter` - A filter function that receives a wallet instance, and returns a boolean
  indicating whether the wallet should be displayed in the wallet list. By default, all wallets are
  displayed.

## Uncontrolled props

* `defaultOpen` - The open state of the dialog when it is initially rendered. Use when you do not
  need to control its open state.
* `trigger` - The trigger button that opens the dialog.
* `walletFilter` - A filter function that receives a wallet instance, and returns a boolean
  indicating whether the wallet should be displayed in the wallet list. By default, all wallets are
  displayed.


---

# useAccounts (/dapp-kit/legacy/wallet-hooks/useAccounts)



import { UseAccountsExample } from '../../../../examples/wallet-hooks-client';

The `useAccounts` hook retrieves a list of connected accounts the dApp authorizes.

```ts
import { ConnectButton, useAccounts } from '@mysten/dapp-kit';

function MyComponent() {
	const accounts = useAccounts();

	return (
		<div>
			<ConnectButton />
			<h2>Available accounts:</h2>
			{accounts.length === 0 && <div>No accounts detected</div>}
			<ul>
				{accounts.map((account) => (
					<li key={account.address}>- {account.address}</li>
				))}
			</ul>
		</div>
	);
}
```

## Example

<UseAccountsExample />

## Account properties

* `address`: The address of the account, corresponding with a public key.
* `publicKey`: The public key of the account, represented as a `Uint8Array`.
* `chains`: The chains the account supports.
* `features`: The features the account supports.
* `label`: An optional user-friendly descriptive label or name for the account.
* `icon`: An optional user-friendly icon for the account.


---

# useAutoConnectWallet (/dapp-kit/legacy/wallet-hooks/useAutoConnectWallet)



import { UseAutoConnectionStatusExample } from '../../../../examples/wallet-hooks-client';

The `useAutoConnectWallet` hook retrieves the status for the initial wallet auto-connection process.

```ts
import { ConnectButton, useAutoConnectWallet } from '@mysten/dapp-kit';

function MyComponent() {
	const autoConnectionStatus = useAutoConnectWallet();

	return (
		<div>
			<ConnectButton />
			<div>Auto-connection status: {autoConnectionStatus}</div>
		</div>
	);
}
```

## Example

<UseAutoConnectionStatusExample />

## Auto-connection status properties

* `disabled` - When the auto-connection functionality is disabled.
* `idle` - When the initial auto-connection attempt hasn't been made yet.
* `attempted` - When an auto-connection attempt has been made. This means either that there is no
  previously connected wallet, the previously connected wallet was not found, or that it has
  successfully connected to a wallet.


---

# useConnectWallet (/dapp-kit/legacy/wallet-hooks/useConnectWallet)



import { UseConnectWalletExample } from '../../../../examples/wallet-hooks-client';

The `useConnectWallet` hook is a mutation hook for establishing a connection to a specific wallet.

```ts
import { ConnectButton, useConnectWallet, useWallets } from '@mysten/dapp-kit';

function MyComponent() {
	const wallets = useWallets();
	const { mutate: connect } = useConnectWallet();

	return (
		<div style={{ padding: 20 }}>
			<ConnectButton />
			<ul>
				{wallets.map((wallet) => (
					<li key={wallet.name}>
						<button
							onClick={() => {
								connect(
									{ wallet },
									{
										onSuccess: () => console.log('connected'),
									},
								);
							}}
						>
							Connect to {wallet.name}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
```

## Example

<UseConnectWalletExample />

## Connect arguments

* `args` - Arguments passed to the `connect` function of the wallet.
  * `wallet` - The wallet to connect to.
  * `accountAddress` - (optional) The address in the wallet to connect to.

* `options` - Options passed the `useMutation` hook from
  [@tanstack/react-query](https://tanstack.com/query/latest/docs/react/guides/mutations).


---

# useCurrentAccount (/dapp-kit/legacy/wallet-hooks/useCurrentAccount)



import { UseCurrentAccountExample } from '../../../../examples/wallet-hooks-client';

The `useCurrentAccount` hook retrieves the wallet account that is currently selected, if one exists.

```ts
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';

function MyComponent() {
	const account = useCurrentAccount();

	return (
		<div>
			<ConnectButton />
			{!account && <div>No account connected</div>}
			{account && (
				<div>
					<h2>Current account:</h2>
					<div>Address: {account.address}</div>
				</div>
			)}
		</div>
	);
}
```

## Example

<UseCurrentAccountExample />

## Account properties

* `address`: The address of the account, corresponding with a public key.
* `publicKey`: The public key of the account, represented as a `Uint8Array`.
* `chains`: The chains the account supports.
* `features`: The features the account supports.
* `label`: An optional user-friendly descriptive label or name for the account.
* `icon`: An optional user-friendly icon for the account.


---

# useCurrentWallet (/dapp-kit/legacy/wallet-hooks/useCurrentWallet)



import { UseCurrentWalletExample } from '../../../../examples/wallet-hooks-client';

The `useCurrentWallet` hook retrieves the wallet that is currently connected to the dApp, if one
exists.

```ts
import { ConnectButton, useCurrentWallet } from '@mysten/dapp-kit';

function MyComponent() {
	const { currentWallet, connectionStatus } = useCurrentWallet();

	return (
		<div>
			<ConnectButton />
			{connectionStatus === 'connected' ? (
				<div>
					<h2>Current wallet:</h2>
					<div>Name: {currentWallet.name}</div>
					<div>
						Accounts:
						<ul>
							{currentWallet.accounts.map((account) => (
								<li key={account.address}>- {account.address}</li>
							))}
						</ul>
					</div>
				</div>
			) : (
				<div>Connection status: {connectionStatus}</div>
			)}
		</div>
	);
}
```

## Example

<UseCurrentWalletExample />

## Wallet properties

* `name` - The name of the wallet.
* `version` - The version of the wallet as a string.
* `icon` - A data URL of the wallet icon as an SVG.
* `accounts` - An array of accounts that are available in the wallet.
* `features` - An object with all the
  [wallet-standard](https://github.com/wallet-standard/wallet-standard) features implemented by the
  wallet.
* `chains` - An array of chain identifiers that the wallet supports.

## Connection status properties

* `connectionStatus`
  * `disconnected` - When no wallet is connected to the dApp.
  * `connecting` - When a wallet connection attempt is in progress.
  * `connected` - When a wallet is connected to the dApp.

* `isDisconnected` - A derived boolean from the status variable above, provided for convenience.

* `isConnecting` - A derived boolean from the status variable above, provided for convenience.

* `isConnected` - A derived boolean from the status variable above, provided for convenience.


---

# useDisconnectWallet (/dapp-kit/legacy/wallet-hooks/useDisconnectWallet)



import { UseDisconnectWalletExample } from '../../../../examples/wallet-hooks-client';

The `useDisconnectWallet` hook is a mutation hook for disconnecting from an active wallet
connection, if currently connected.

```ts
import { ConnectButton, useDisconnectWallet } from '@mysten/dapp-kit';

function MyComponent() {
	const { mutate: disconnect } = useDisconnectWallet();
	return (
		<div>
			<ConnectButton />

			<button onClick={() => disconnect()}>Disconnect</button>
		</div>
	);
}
```

## Example

<UseDisconnectWalletExample />

## Arguments

There are no arguments for `useDisconnectWallet`.


---

# useSignAndExecuteTransaction (/dapp-kit/legacy/wallet-hooks/useSignAndExecuteTransaction)



import { UseSignAndExecuteTransactionExample } from '../../../../examples/wallet-hooks-client';

Use the `useSignAndExecuteTransaction` hook to prompt the user to sign and execute a transaction
block with their wallet.

```ts
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useState } from 'react';

function MyComponent() {
	const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
	const [digest, setDigest] = useState('');
	const currentAccount = useCurrentAccount();

	return (
		<div style={{ padding: 20 }}>
			<ConnectButton />
			{currentAccount && (
				<>
					<div>
						<button
							onClick={() => {
								signAndExecuteTransaction(
									{
										transaction: new Transaction(),
										chain: 'sui:devnet',
									},
									{
										onSuccess: (result) => {
											console.log('executed transaction', result);
											setDigest(result.digest);
										},
									},
								);
							}}
						>
							Sign and execute transaction
						</button>
					</div>
					<div>Digest: {digest}</div>
				</>
			)}
		</div>
	);
}
```

## Example

<UseSignAndExecuteTransactionExample />

## Return additional data, or executing through GraphQL

To customize how transactions are executed, and what data is returned when executing a transaction,
you can pass a custom `execute` function.

```ts
import {
	ConnectButton,
	useSuiClient,
	useCurrentAccount,
	useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useState } from 'react';

function MyComponent() {
	const client = useSuiClient();
	const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
		execute: async ({ bytes, signature }) =>
			await client.executeTransactionBlock({
				transactionBlock: bytes,
				signature,
				options: {
					// Raw effects are required so the effects can be reported back to the wallet
					showRawEffects: true,
					// Select additional data to return
					showObjectChanges: true,
				},
			}),
	});

	const [digest, setDigest] = useState('');
	const currentAccount = useCurrentAccount();

	return (
		<div style={{ padding: 20 }}>
			<ConnectButton />
			{currentAccount && (
				<>
					<div>
						<button
							onClick={() => {
								signAndExecuteTransaction(
									{
										transaction: new Transaction(),
										chain: 'sui:devnet',
									},
									{
										onSuccess: (result) => {
											console.log('object changes', result.objectChanges);
											setDigest(result.digest);
										},
									},
								);
							}}
						>
							Sign and execute transaction
						</button>
					</div>
					<div>Digest: {digest}</div>
				</>
			)}
		</div>
	);
}
```

## Arguments

* `transaction`: The transaction to sign and execute.
* `chain`: (optional) The chain identifier the transaction should be signed for. Defaults to the
  active network of the dApp.
* `execute`: (optional) A custom function to execute the transaction

In addition to these options, you can also pass any options that the
[SuiJsonRpcClient.signAndExecuteTransaction](/typedoc/classes/_mysten_sui.client.SuiJsonRpcClient.html#signAndExecuteTransactionBlock)
method accepts.


---

# useSignPersonalMessage (/dapp-kit/legacy/wallet-hooks/useSignPersonalMessage)



import { UseSignPersonalMessageExample } from '../../../../examples/wallet-hooks-client';

Use the `useSignPersonalMessage` hook to prompt the user to sign a message with their wallet.

```ts
import { ConnectButton, useCurrentAccount, useSignPersonalMessage } from '@mysten/dapp-kit';
import { useState } from 'react';

function MyComponent() {
	const { mutate: signPersonalMessage } = useSignPersonalMessage();
	const [message, setMessage] = useState('hello, World!');
	const [signature, setSignature] = useState('');
	const currentAccount = useCurrentAccount();

	return (
		<div style={{ padding: 20 }}>
			<ConnectButton />
			{currentAccount && (
				<>
					<div>
						<label>
							Message:{' '}
							<input type="text" value={message} onChange={(ev) => setMessage(ev.target.value)} />
						</label>
					</div>
					<button
						onClick={() => {
							signPersonalMessage(
								{
									message: new TextEncoder().encode(message),
								},
								{
									onSuccess: (result) => setSignature(result.signature),
								},
							);
						}}
					>
						Sign message
					</button>
					<div>Signature: {signature}</div>
				</>
			)}
		</div>
	);
}
```

## Example

<UseSignPersonalMessageExample />

## Arguments

* `message`: The message to sign, as a `Uint8Array`.
* `chain`: (optional) The chain identifier the message should be signed for. Defaults to the active
  network of the dApp.

## Result

* `signature`: The signature of the message, as a `Base64`-encoded `string`.
* `bytes`: The bytes of the message, as a `Base64`-encoded `string`.


---

# useSignTransaction (/dapp-kit/legacy/wallet-hooks/useSignTransaction)



import { UseSignTransactionExample } from '../../../../examples/wallet-hooks-client';

Use the `useSignTransaction` hook to prompt the user to sign a transaction with their wallet.

```ts
import { Transaction } from '@mysten/sui/transactions';
import {
	ConnectButton,
	useCurrentAccount,
	useSignTransaction,
	useSuiClient,
} from '@mysten/dapp-kit';
import { toBase64 } from '@mysten/sui/utils';
import { useState } from 'react';

function MyComponent() {
	const { mutateAsync: signTransaction } = useSignTransaction();
	const [signature, setSignature] = useState('');
	const client = useSuiClient();
	const currentAccount = useCurrentAccount();

	return (
		<div style={{ padding: 20 }}>
			<ConnectButton />
			{currentAccount && (
				<>
					<div>
						<button
							onClick={async () => {
								const { bytes, signature } = await signTransaction({
									transaction: new Transaction(),
									chain: 'sui:devnet',
								});

								const executeResult = await client.executeTransactionBlock({
									transactionBlock: bytes,
									signature,
									options: {
										showRawEffects: true,
									},
								});


								console.log(executeResult);
							}}
						>
							Sign empty transaction
						</button>
					</div>
					<div>Signature: {signature}</div>
				</>
			)}
		</div>
	);
}
```

## Example

<UseSignTransactionExample />

## Arguments

* `transactionBlock`: The transaction to sign.
* `chain`: (optional) The chain identifier the transaction should be signed for. Defaults to the
  active network of the dApp.

## Result

* `signature`: The signature of the message, as a Base64-encoded `string`.
* `bytes`: The serialized transaction bytes, as a Base64-encoded `string`.


---

# useSwitchAccount (/dapp-kit/legacy/wallet-hooks/useSwitchAccount)



import { UseSwitchAccountExample } from '../../../../examples/wallet-hooks-client';

The `useSwitchAccount` hook is a mutation hook for establishing a connection to a specific wallet.

```ts
import { ConnectButton, useAccounts, useSwitchAccount } from '@mysten/dapp-kit';

function MyComponent() {
	const { mutate: switchAccount } = useSwitchAccount();
	const accounts = useAccounts();

	return (
		<div style={{ padding: 20 }}>
			<ConnectButton />
			<ul>
				{accounts.map((account) => (
					<li key={account.address}>
						<button
							onClick={() => {
								switchAccount(
									{ account },
									{
										onSuccess: () => console.log(`switched to ${account.address}`),
									},
								);
							}}
						>
							Switch to {account.address}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
```

## Example

<UseSwitchAccountExample />

## Arguments

* `args` - Arguments passed to the `connect` function of the wallet.
  * `account` - The account to switch to.

* `options` - Options passed the `useMutation` hook from
  [@tanstack/react-query](https://tanstack.com/query/latest/docs/react/guides/mutations).


---

# useWallets (/dapp-kit/legacy/wallet-hooks/useWallets)



import { UseWalletsExample } from '../../../../examples/wallet-hooks-client';

The `useWallets` hook returns an array of wallets that are available to the user. The wallets are
sorted by their priority, with the highest priority wallet being the first in the array.

```ts
import { useWallets } from '@mysten/dapp-kit';

function MyComponent() {
	const wallets = useWallets();

	return (
		<div>
			<h2>Installed wallets</h2>
			{wallets.length === 0 && <div>No wallets installed</div>}
			<ul>
				{wallets.map((wallet) => (
					<li key={wallet.name}>{wallet.name}</li>
				))}
			</ul>
		</div>
	);
}
```

## Example

<UseWalletsExample />

## Wallet properties

* `name` - The name of the wallet.
* `version` - The version of the wallet as a string.
* `icon` - A data URL of the wallet icon as an SVG.
* `accounts` - An array of accounts that are available in the wallet.
* `features` - An object with all the
  [wallet-standard](https://github.com/wallet-standard/wallet-standard) features implemented by the
  wallet.
* `chains` - An array of chain identifiers that the wallet supports.


---

# WalletProvider (/dapp-kit/legacy/wallet-provider)



Use `WalletProvider` to set up the necessary context for your React app. Use it at the root of your
app, so that you can use any of the dApp Kit wallet components underneath it.

```tsx
import { WalletProvider } from '@mysten/dapp-kit';

function App() {
	return (
		<WalletProvider>
			<YourApp />
		</WalletProvider>
	);
}
```

The `WalletProvider` manages all wallet state for you, and makes the current wallet state available
to other dApp Kit hooks and components.

### Props

All props are optional.

* `preferredWallets` - A list of wallets that are sorted to the top of the wallet list.
* `walletFilter` - A filter function that accepts a wallet and returns a boolean. This filters the
  list of wallets presented to users when selecting a wallet to connect from, ensuring that only
  wallets that meet the dApp requirements can connect.
* `enableUnsafeBurner` - Enables the development-only unsafe burner wallet, useful for testing.
* `autoConnect` - Enables automatically reconnecting to the most recently used wallet account upon
  mounting.
* `slushWallet` - Enables and configures the Slush wallet. Read more about how to
  [use the Slush integration](./slush).
* `storage` - Configures how the most recently connected-to wallet account is stored. Set to `null`
  to disable persisting state entirely. Defaults to using `localStorage` if it is available.
* `storageKey` - The key to use to store the most recently connected wallet account.
* `theme` - The theme to use for styling UI components. Defaults to using the light theme.


---

# React Components (/dapp-kit/react/components)



The `@mysten/dapp-kit-react` package provides pre-built React components for common wallet
interactions.

## Available Components

* [`ConnectButton`](/dapp-kit/react/components/connect-button) - A button that opens the wallet
  connection modal and displays account info when connected
* [`ConnectModal`](/dapp-kit/react/components/connect-modal) - A modal dialog for selecting and
  connecting to a wallet


---

# Connect Button (/dapp-kit/react/components/connect-button)



## Usage

```tsx
<ConnectButton
	modalOptions={{
		filterFn: (wallet) => wallet.name !== 'Excluded Wallet',
		sortFn: (a, b) => a.name.localeCompare(b.name),
	}}
/>
```

<Callout>
  Auto-connect is enabled by default and will attempt to restore the previous wallet connection on
  page reload. This provides a seamless user experience but can be
  [disabled](/dapp-kit/dapp-kit-instance#disabling-auto-connect) if needed.
</Callout>

## Props

* **instance** (optional) - dApp Kit instance. If not provided, uses the instance from context.
* **modalOptions** (optional) - Configuration options for the connect modal
  * **filterFn** (optional) - Function to filter available wallets
    * Type: `(wallet: UiWallet, index: number, array: UiWallet[]) => boolean`
  * **sortFn** (optional) - Function to sort available wallets
    * Type: `(a: UiWallet, b: UiWallet) => number`

## Custom Button Text

Use the slot to customize the button content when disconnected:

```tsx
<ConnectButton>
	<span>🔗 Link Wallet</span>
</ConnectButton>
```

## Server-Side Rendering (SSR)

The `<ConnectButton />` component can be only client-side rendered, as wallets are detected in the
browser. For Next.js guide see [here](/dapp-kit/getting-started/next-js).


---

# Connect Modal (/dapp-kit/react/components/connect-modal)



## Usage

```tsx
import { useState } from 'react';
import { ConnectModal } from '@mysten/dapp-kit-react';

export function App() {
	const [open, setOpen] = useState(false);
	return (
		<>
			<button onClick={() => setOpen(true)}>Connect Wallet</button>
			<ConnectModal open={open} />
		</>
	);
}
```

## Props

* **open** (optional) - Boolean to control modal visibility. If not provided, the modal can be
  controlled by calling `show()` and `close()` methods directly on the component ref.
* **instance** (optional) - dApp Kit instance. If not provided, uses the instance from context
* **filterFn** (optional) - Function to filter available wallets
  * Type: `(wallet: UiWallet, index: number, array: UiWallet[]) => boolean`
* **sortFn** (optional) - Function to sort available wallets
  * Type: `(a: UiWallet, b: UiWallet) => number`

### Example

```tsx
<ConnectModal
	open={open}
	filterFn={(wallet) => wallet.name !== 'ExcludedWallet'}
	sortFn={(a, b) => a.name.localeCompare(b.name)}
/>
```

## Modal States

The modal displays different views based on connection status:

* **Wallet Selection**: Shows available wallets to choose from
* **Connecting**: Displays loading state while connecting to selected wallet
* **Error**: Shows error message with retry option when connection fails
* **Request Cancelled**: Appears when user cancels the wallet connection request

## Server-Side Rendering (SSR)

The `<ConnectModal />` component can be only client-side rendered, as wallets are detected in the
browser. For Next.js guide see [here](/dapp-kit/getting-started/next-js).


---

# DAppKitProvider (/dapp-kit/react/dapp-kit-provider)



The `DAppKitProvider` is a React context provider that makes your dApp Kit instance available
throughout your React application. It must wrap any components that use dApp Kit hooks.

## Basic Usage

```tsx
import { dAppKit } from './dapp-kit.ts';

export default function App() {
	return (
		<DAppKitProvider dAppKit={dAppKit}>
			<YourApp />
		</DAppKitProvider>
	);
}
```

## Props

* **dAppKit**: The dApp Kit instance created with `createDAppKit`

## Provider Setup Patterns

### With Custom Configuration

```tsx
import { createDAppKit, DAppKitProvider } from '@mysten/dapp-kit-react';
import { SuiGrpcClient } from '@mysten/sui/grpc';

const GRPC_URLS = {
	testnet: 'https://fullnode.testnet.sui.io:443',
} as const;

const dAppKit = createDAppKit({
	networks: ['testnet'],
	createClient: (network) => new SuiGrpcClient({ network, baseUrl: GRPC_URLS[network] }),
	autoConnect: true,
	storage: localStorage,
	storageKey: 'myapp_dappkit',
});

// global type registration necessary for the hooks to work correctly
declare module '@mysten/dapp-kit-react' {
	interface Register {
		dAppKit: typeof dAppKit;
	}
}

export function App() {
	return (
		<DAppKitProvider dAppKit={dAppKit}>
			<YourApp />
		</DAppKitProvider>
	);
}
```

## Using Hooks Inside the Provider

Once your app is wrapped with `DAppKitProvider`, you can use any dApp Kit hooks in child components:

```tsx
import type { UiWallet } from '@mysten/dapp-kit-react';
import { useDAppKit, useCurrentAccount, useCurrentNetwork } from '@mysten/dapp-kit-react';

export function MyComponent({ wallet }: { wallet: UiWallet }) {
	const dAppKit = useDAppKit();
	const account = useCurrentAccount();
	const network = useCurrentNetwork();
	const handleConnect = async () => {
		await dAppKit.connectWallet({ wallet });
	};
	return (
		<div>
			<p>Network: {network}</p>
			<p>Account: {account?.address}</p>
			<button onClick={handleConnect}>Connect</button>
		</div>
	);
}
```

<Callout>
  All dApp Kit hooks must be used within components that are descendants of `DAppKitProvider`. Using
  them outside will result in an error.
</Callout>

## Server-Side Rendering (SSR)

While `DAppKitProvider` itself is SSR-safe, components that interact with wallets should be
client-side rendered, as wallets are detected in the browser. For Next.js guide see
[here](/dapp-kit/getting-started/next-js).


---

# React Hooks (/dapp-kit/react/hooks)



The `@mysten/dapp-kit-react` package provides a set of hooks for interacting with wallets and the
Sui blockchain in React applications.

<Callout type="warn">
  All dApp Kit hooks must be used within components that are descendants of
  [DAppKitProvider](/dapp-kit/react/dapp-kit-provider). Using them outside will result in an error.
</Callout>

## Available Hooks

* [`useDAppKit`](/dapp-kit/react/hooks/use-dapp-kit) - Access the dApp Kit instance for calling
  actions directly
* [`useCurrentAccount`](/dapp-kit/react/hooks/use-current-account) - Get the currently selected
  account
* [`useCurrentClient`](/dapp-kit/react/hooks/use-current-client) - Get the blockchain client for the
  current network
* [`useCurrentNetwork`](/dapp-kit/react/hooks/use-current-network) - Get the currently selected
  network
* [`useCurrentWallet`](/dapp-kit/react/hooks/use-current-wallet) - Get the currently connected
  wallet
* [`useWalletConnection`](/dapp-kit/react/hooks/use-wallet-connection) - Get wallet connection
  status and actions
* [`useWallets`](/dapp-kit/react/hooks/use-wallets) - Get all available wallets


---

# useCurrentAccount (/dapp-kit/react/hooks/use-current-account)



The `useCurrentAccount` hook provides access to the currently selected account.

<Callout type="warn">
  All dApp Kit hooks must be used within components that are descendants of
  [DAppKitProvider](../dapp-kit-provider). Using them outside will result in an error.
</Callout>

## Usage

```tsx
import { useCurrentAccount } from '@mysten/dapp-kit-react';

export function MyComponent() {
	const account = useCurrentAccount();

	if (!account) {
		return <div>No account selected</div>;
	}

	return (
		<div>
			<p>Address: {account.address}</p>
			<p>Label: {account.label}</p>
		</div>
	);
}
```

## Return Value

```tsx
UiWalletAccount | null;
```


---

# useCurrentClient (/dapp-kit/react/hooks/use-current-client)



The `useCurrentClient` hook provides access to the blockchain client instance for the current
network.

<Callout type="info">
  By default, this returns a `SuiClient` instance when using the standard setup. However, the dApp
  Kit supports any client that implements the Sui core API, making it flexible for different
  blockchain implementations.
</Callout>

<Callout type="warn">
  All dApp Kit hooks must be used within components that are descendants of
  [DAppKitProvider](../dapp-kit-provider). Using them outside will result in an error.
</Callout>

## Usage

```tsx
import { useCurrentClient } from '@mysten/dapp-kit-react';

export function MyComponent() {
	const client = useCurrentClient();

	const handleQuery = async () => {
		const balance = await client.getBalance({
			owner: '0x...',
		});
		console.log(balance);
	};

	return <button onClick={handleQuery}>Check Balance</button>;
}
```

## Return Value

```tsx
SuiClient;
```


---

# useCurrentNetwork (/dapp-kit/react/hooks/use-current-network)



The `useCurrentNetwork` hook provides access to the currently selected network.

<Callout type="warn">
  All dApp Kit hooks must be used within components that are descendants of
  [DAppKitProvider](../dapp-kit-provider). Using them outside will result in an error.
</Callout>

## Usage

```tsx
import { useCurrentNetwork } from '@mysten/dapp-kit-react';

export function MyComponent() {
	const network = useCurrentNetwork();

	return (
		<div>
			<p>Current network: {network}</p>
		</div>
	);
}
```

## Return Value

```tsx
string;
```


---

# useCurrentWallet (/dapp-kit/react/hooks/use-current-wallet)



The `useCurrentWallet` hook provides access to the currently connected wallet.

<Callout type="warn">
  All dApp Kit hooks must be used within components that are descendants of
  [DAppKitProvider](../dapp-kit-provider). Using them outside will result in an error.
</Callout>

## Usage

```tsx
import { useCurrentWallet } from '@mysten/dapp-kit-react';

export function MyComponent() {
	const wallet = useCurrentWallet();

	if (!wallet) {
		return <div>No wallet connected</div>;
	}

	return (
		<div>
			<p>Wallet: {wallet.name}</p>
			<p>
				Icon: <img src={wallet.icon} alt={wallet.name} />
			</p>
			<p>Accounts: {wallet.accounts.length}</p>
		</div>
	);
}
```

## Return Value

```tsx
UiWallet | null;
```


---

# useDAppKit (/dapp-kit/react/hooks/use-dapp-kit)



The `useDAppKit` hook provides direct access to the dApp Kit instance within React components,
enabling you to call actions and access the underlying functionality.

<Callout type="warn">
  All dApp Kit hooks must be used within components that are descendants of
  [DAppKitProvider](../dapp-kit-provider). Using them outside will result in an error.
</Callout>

## Usage

```tsx
import type { UiWallet } from '@mysten/dapp-kit-react';
import { useDAppKit } from '@mysten/dapp-kit-react';

export function MyComponent({ wallet }: { wallet: UiWallet }) {
	const dAppKit = useDAppKit();

	async function handleConnect() {
		try {
			await dAppKit.connectWallet({ wallet });
			console.log('Connected successfully');
		} catch (error) {
			console.error('Connection failed:', error);
		}
	}

	return <button onClick={handleConnect}>Connect Wallet</button>;
}
```

## Return Value

```ts
{
    // Actions
    connectWallet: (args: { wallet: UiWallet; account?: UiWalletAccount }) => Promise<{ accounts: UiWalletAccount[]; }>;
    disconnectWallet: () => Promise<void>;
    switchAccount: (args: { account: UiWalletAccount }) => Promise<void>;
    switchNetwork: (network: string) => void;
    signTransaction: (args: { transaction: Transaction | string; signal?: AbortSignal }) => Promise<SignedTransaction>;
    signAndExecuteTransaction: (args: { transaction: Transaction | string; signal?: AbortSignal }) => Promise<TransactionResult>;
    signPersonalMessage: (args: { message: Uint8Array }) => Promise<SignedPersonalMessage>;

    // Properties
    networks: string[];
    stores:  {
        $wallets: DAppKitStores['$compatibleWallets'];
        $connection: DAppKitStores['$connection'];
        $currentNetwork: ReadableAtom<TNetworks[number]>;
        $currentClient: ReadableAtom<Client>;
    };
    getClient: (network?: string) => Client;
}
```

## Examples

### Transaction Execution

```tsx
import { useDAppKit } from '@mysten/dapp-kit-react';
import { Transaction } from '@mysten/sui/transactions';

export function TransferButton() {
	const dAppKit = useDAppKit();

	async function handleTransfer() {
		const tx = new Transaction();
		tx.transferObjects([tx.object('0x123...')], '0xrecipient...');

		try {
			const result = await dAppKit.signAndExecuteTransaction({
				transaction: tx,
			});

			if (result.FailedTransaction) {
				throw new Error(`Transaction failed: ${result.FailedTransaction.status.error?.message}`);
			}

			console.log('Transaction digest:', result.Transaction.digest);
		} catch (error) {
			console.error('Transaction failed:', error);
		}
	}

	return <button onClick={handleTransfer}>Transfer</button>;
}
```

### Subscribing to State Changes

```tsx
import { useEffect } from 'react';
import { useDAppKit } from '@mysten/dapp-kit-react';

export function ConnectionMonitor() {
	const dAppKit = useDAppKit();
	useEffect(() => {
		// Subscribe directly to connection store changes
		const unsubscribe = dAppKit.stores.$connection.subscribe((connection) => {
			console.log('Connection status:', connection.status);
		});
		return unsubscribe;
	}, [dAppKit]);
	return null;
}
```


---

# useWalletConnection (/dapp-kit/react/hooks/use-wallet-connection)



The `useWalletConnection` hook provides access to the current wallet connection status and
information.

<Callout type="warn">
  All dApp Kit hooks must be used within components that are descendants of
  [DAppKitProvider](../dapp-kit-provider). Using them outside will result in an error.
</Callout>

## Usage

```tsx
import { useWalletConnection } from '@mysten/dapp-kit-react';

export function MyComponent() {
	const connection = useWalletConnection();

	if (connection.status === 'disconnected') {
		return <div>Please connect your wallet</div>;
	}

	if (connection.status === 'connecting') {
		return <div>Connecting...</div>;
	}

	// status === 'connected'
	return (
		<div>
			<p>Connected to: {connection.wallet.name}</p>
			<p>Address: {connection.account.address}</p>
		</div>
	);
}
```

## Return Value

```tsx
{
	status: 'disconnected' | 'connecting' | 'reconnecting' | 'connected';
	wallet: UiWallet | null;
	account: UiWalletAccount | null;
	supportedIntents: string[];
	isConnected: boolean;
	isConnecting: boolean;
	isReconnecting: boolean;
	isDisconnected: boolean;
}
```


---

# useWallets (/dapp-kit/react/hooks/use-wallets)



The `useWallets` hook provides access to all available wallets.

<Callout type="warn">
  All dApp Kit hooks must be used within components that are descendants of
  [DAppKitProvider](../dapp-kit-provider). Using them outside will result in an error.
</Callout>

## Usage

```tsx
import { useWallets } from '@mysten/dapp-kit-react';

export function MyComponent() {
	const wallets = useWallets();

	return (
		<div>
			{wallets.map((wallet) => (
				<div key={wallet.name}>
					<img src={wallet.icon} alt={wallet.name} />
					<span>{wallet.name}</span>
				</div>
			))}
		</div>
	);
}
```

## Return Value

```tsx
UiWallet[]
```


---

# State (/dapp-kit/state)



The Sui dApp Kit SDK uses [nanostores](https://github.com/nanostores/nanostores) for state
management, providing a lightweight, framework-agnostic solution that works across React, Vue,
Vanilla JavaScript, and other frameworks.

## Available Stores

The dApp Kit exposes four reactive stores that you can subscribe to:

* **`$connection`** - Current wallet connection state
* **`$currentNetwork`** - Currently selected network
* **`$currentClient`** - Client instance for the current network
* **`$wallets`** - List of available wallets

## Accessing Stores

All stores are available through the `dAppKit.stores` property:

```typescript
import { createDAppKit } from '@mysten/dapp-kit-core';

const dAppKit = createDAppKit({
	/* config */
});

// Access stores
const connection = dAppKit.stores.$connection.get();
const currentNetwork = dAppKit.stores.$currentNetwork.get();
const client = dAppKit.stores.$currentClient.get();
const wallets = dAppKit.stores.$wallets.get();
```

## Subscribing to State Changes

Subscribe to any store to react to state changes:

```typescript
// Subscribe to connection changes
const unsubscribe = dAppKit.stores.$connection.subscribe((connection) => {
	if (connection.isConnected && connection.wallet && connection.account) {
		console.log('Connected to:', connection.wallet.name);
		console.log('Account:', connection.account.address);
	} else {
		console.log('Not connected');
	}
});

// Clean up subscription when done
unsubscribe();
```

## Store Details

### Connection Store (`$connection`)

Contains the current wallet connection state with status flags:

```typescript
const connection = dAppKit.stores.$connection.get();

// Connection has these properties:
// - wallet: UiWallet | null
// - account: UiWalletAccount | null
// - status: 'connected' | 'connecting' | 'reconnecting' | 'disconnected'
// - supportedIntents: string[]
// - isConnected: boolean
// - isConnecting: boolean
// - isReconnecting: boolean
// - isDisconnected: boolean
```

Example usage:

```typescript
const connection = dAppKit.stores.$connection.get();

if (connection.isConnected && connection.wallet && connection.account) {
	console.log('Address:', connection.account.address);
	console.log('Wallet:', connection.wallet.name);
	console.log('Available accounts:', connection.wallet.accounts);
}
```

### Current Network Store (`$currentNetwork`)

Contains the currently selected network as a string:

```typescript
const currentNetwork = dAppKit.stores.$currentNetwork.get(); // 'mainnet' | 'testnet' | ...

// Subscribe to network changes
dAppKit.stores.$currentNetwork.subscribe((network) => {
	console.log('Switched to network:', network);
});
```

Note: This store is read-only. Use `dAppKit.switchNetwork()` to change networks.

### Current Client Store (`$currentClient`)

Contains the SuiClient instance for the current network:

```typescript
const client = dAppKit.stores.$currentClient.get();

// Use the client to query the blockchain
const balance = await client.getBalance({
	owner: '0x...',
});
```

Note: This store automatically updates when the network changes.

### Wallets Store (`$wallets`)

Contains the list of available wallets:

```typescript
const wallets = dAppKit.stores.$wallets.get();

wallets.forEach((wallet) => {
	console.log('Wallet:', wallet.name);
	console.log('Icon:', wallet.icon);
});
```

## Subscribing to State Changes

You can subscribe directly to stores:

```typescript
// Subscribe to connection changes
dAppKit.stores.$connection.subscribe((connection) => {
	const statusElement = document.getElementById('connection-status');
	if (statusElement === null) return;
	if (connection.isConnected && connection.account) {
		statusElement.textContent = `Connected: ${connection.account.address}`;
	} else {
		statusElement.textContent = 'Not connected';
	}
});

// Subscribe to network changes
dAppKit.stores.$currentNetwork.subscribe((network) => {
	const networkElement = document.getElementById('current-network');
	if (networkElement === null) return;
	networkElement.textContent = `Network: ${network}`;
});
```

## React

React users can use the [provided hooks](./react/hooks/use-wallet-connection) instead of direct
store access.

## Properties

Besides stores, some values are available as direct properties:

```typescript
// Get available networks (not a store, just a property)
const networks = dAppKit.networks; // ['mainnet', 'testnet', ...]

// Get client for specific network
const mainnetClient = dAppKit.getClient('mainnet');
const currentClient = dAppKit.getClient(); // Current network's client
```


---

# Theming (/dapp-kit/theming)



The dApp Kit web components use a theming system compatible with
[shadcn/ui](https://ui.shadcn.com/docs/theming). Components are customized using CSS custom
properties (CSS variables), allowing you to match them to your application's design system.

<Callout type="info">
  **shadcn/ui Compatibility**: The dApp Kit uses the same CSS custom property naming convention as
  shadcn/ui. If your application already uses shadcn/ui themes, the dApp Kit components will
  automatically inherit your theme. You can also use [shadcn/ui's theme
  builder](https://ui.shadcn.com/themes) to create custom themes.
</Callout>

## CSS Custom Properties

All dApp Kit web components support the following CSS custom properties:

### Colors

These color variables follow the shadcn/ui naming convention. Colors can be defined using any valid
CSS color format (hex, rgb, hsl, oklch, etc.).

* **`--background`** - Background color of the component. Used as the default background for UI
  elements.
* **`--foreground`** - Foreground color of the component. Used as the default text color.
* **`--primary`** - Primary color used for interactive elements such as buttons and links.
* **`--primary-foreground`** - Text or icon color placed on top of primary elements.
* **`--secondary`** - Secondary color used for less prominent interactive elements.
* **`--secondary-foreground`** - Text or icon color placed on top of secondary elements.
* **`--border`** - Border color for UI elements.
* **`--accent`** - Accent color used for highlights and decorative elements.
* **`--accent-foreground`** - Text or icon color placed on top of accent elements.
* **`--muted`** - Background color for subtle or muted UI elements (e.g., placeholders, disabled
  states).
* **`--muted-foreground`** - Text or icon color for muted UI elements.
* **`--popover`** - Background color for floating elements such as popovers, dropdowns, or tooltips.
* **`--popover-foreground`** - Text or icon color inside popover elements.
* **`--ring`** - Color used for focus rings (visible focus indicators on interactive elements).

### Typography

* **`--font-sans`** - Font family used for text content.
* **`--font-weight-medium`** - Medium font weight for text (typically used for buttons and
  interactive elements).
* **`--font-weight-semibold`** - Semibold font weight for text (typically used for headings or
  emphasized text).

### Layout

* **`--radius`** - Border radius used for UI elements.

## Usage

### Global Theming

Apply custom properties to affect all dApp Kit components:

```css
:root {
	--primary: #4f46e5;
	--primary-foreground: #ffffff;
	--background: #ffffff;
	--foreground: #0f172a;
	--border: #e2e8f0;
	--radius: 0.5rem;
	--font-sans: 'Inter', sans-serif;
}
```

### Component-Specific Theming

Target specific components:

```css
mysten-dapp-kit-connect-button {
	--primary: #10b981;
	--primary-foreground: #ffffff;
	--radius: 0.75rem;
}

mysten-dapp-kit-connect-modal {
	--background: #f8fafc;
	--popover: #ffffff;
}
```

### Dark Mode

Implement dark mode by overriding the custom properties:

```css
:root {
	--background: #ffffff;
	--foreground: #0f172a;
	--primary: #4f46e5;
	--border: #e2e8f0;
}

@media (prefers-color-scheme: dark) {
	:root {
		--background: #0f172a;
		--foreground: #f1f5f9;
		--primary: #818cf8;
		--border: #334155;
	}
}
```

Or use a class-based approach:

```css
.light-theme {
	--background: #ffffff;
	--foreground: #0f172a;
}

.dark-theme {
	--background: #0f172a;
	--foreground: #f1f5f9;
}
```

```tsx
<div className={isDark ? 'dark-theme' : 'light-theme'}>
	<ConnectButton />
</div>
```

## Example: Complete Theme

Here's a complete theme example matching a custom design system:

```css
:root {
	/* Colors */
	--background: hsl(0 0% 100%);
	--foreground: hsl(222.2 84% 4.9%);
	--primary: hsl(221.2 83.2% 53.3%);
	--primary-foreground: hsl(210 40% 98%);
	--secondary: hsl(210 40% 96.1%);
	--secondary-foreground: hsl(222.2 47.4% 11.2%);
	--accent: hsl(210 40% 96.1%);
	--accent-foreground: hsl(222.2 47.4% 11.2%);
	--muted: hsl(210 40% 96.1%);
	--muted-foreground: hsl(215.4 16.3% 46.9%);
	--border: hsl(214.3 31.8% 91.4%);
	--popover: hsl(0 0% 100%);
	--popover-foreground: hsl(222.2 84% 4.9%);
	--ring: hsl(221.2 83.2% 53.3%);

	/* Typography */
	--font-sans:
		system-ui, -apple-system, 'Segoe UI', 'Roboto', 'Ubuntu', 'Cantarell', 'Noto Sans', sans-serif;
	--font-weight-medium: 500;
	--font-weight-semibold: 600;

	/* Layout */
	--radius: 0.5rem;
}
```

## Framework Integration

### React

```tsx
import { ConnectButton } from '@mysten/dapp-kit-react';
import './theme.css'; // Your theme CSS file

export function App() {
	return <ConnectButton />;
}
```

### Vue

```vue
<template>
	<mysten-dapp-kit-connect-button :instance="dAppKit" />
</template>

<style>
@import './theme.css';
</style>
```

### Vanilla JavaScript

```html
<!doctype html>
<html>
	<head>
		<link rel="stylesheet" href="theme.css" />
	</head>
	<body>
		<mysten-dapp-kit-connect-button></mysten-dapp-kit-connect-button>
	</body>
</html>
```


---

# Connect Button (/dapp-kit/web-components/connect-button)



The `<mysten-dapp-kit-connect-button>` Web Component provides a complete wallet connection UI. It
displays a "Connect Wallet" button when no wallet is connected, and shows the connected account with
a menu when a wallet is active.

<Callout>
  Auto-connect is enabled by default and will attempt to restore the previous wallet connection on
  page reload. This provides a seamless user experience but can be
  [disabled](../dapp-kit-instance#disabling-auto-connect) if needed.
</Callout>

## Basic Usage

### Vanilla

```html
<mysten-dapp-kit-connect-button></mysten-dapp-kit-connect-button>

<script>
	const button = document.querySelector('mysten-dapp-kit-connect-button');
	   button!.instance = dAppKit;
</script>
```

### Vue

```vue
<script setup>
import { dAppKit } from './dapp-kit.ts';
</script>

<template>
	<mysten-dapp-kit-connect-button :instance="dAppKit" />
</template>
```

### React

DApp Kit React bindings provide a [React wrapper](../react/components/connect-button) for the
button.

## Features

The connect button component automatically handles:

* **Wallet Connection**: Opens a modal to select and connect a wallet
* **Account Display**: Shows the connected account address
* **Account Switching**: Provides a menu to switch between multiple accounts when connected
* **Disconnection**: Includes a disconnect option in the menu

## Properties

* **instance** - The dApp Kit instance
* **modalOptions** (optional) - Configuration options for the connect modal
  * `filterFn` - Function to filter available wallets
  * `sortFn` - Function to sort available wallets

## Custom Button Text

Use the default slot to customize the button text when not connected:

```html
<mysten-dapp-kit-connect-button>
	<span>Sign In</span>
</mysten-dapp-kit-connect-button>
```

## Modal Integration

The connect button automatically manages its own modal. You don't need to add a separate
`<mysten-dapp-kit-connect-modal>` component when using the connect button.

## Connected State

When a wallet is connected, the button transforms into an account menu that displays:

* Account address (truncated)
* SUI balance
* Network indicator
* Menu options for:
  * Switching accounts (if multiple accounts available)
  * Managing connection
  * Disconnecting

## Server-Side Rendering (SSR)

The `<mysten-dapp-kit-connect-button>` Web Component can be only client-side rendered, as wallets
are detected in the browser. For Next.js guide see [here](../getting-started/next-js).


---

# Connect Modal (/dapp-kit/web-components/connect-modal)



The `<mysten-dapp-kit-connect-modal>` Web Component provides a modal dialog for wallet connection.
While most apps should use the [`Connect Button`](./connect-button) which includes an integrated
modal, the standalone modal is useful for advanced scenarios requiring custom trigger mechanisms.

## When to Use

Use the standalone modal when you need:

* **Custom trigger elements** - Menu items, keyboard shortcuts, or other non-button triggers
* **Complex UI flows** - Integration into existing navigation or custom wallet management interfaces
* **Programmatic control** - Opening the modal based on application logic or user actions
* **Multiple triggers** - Different parts of your UI that can open the same modal

For standard wallet connection with a button, use the [Connect Button](./connect-button) component
instead.

## Basic Usage

### Vanilla

```html
<button id="custom-trigger">Open Wallet Selector</button>
<mysten-dapp-kit-connect-modal></mysten-dapp-kit-connect-modal>

<script>
	import { createDAppKit } from '@mysten/dapp-kit-core';
	import { SuiGrpcClient } from '@mysten/sui/grpc';

	const GRPC_URLS = {
	    mainnet: 'https://fullnode.mainnet.sui.io:443',
	    testnet: 'https://fullnode.testnet.sui.io:443',
	};

	const dAppKit = createDAppKit({
	    enableBurnerWallet: import.meta.env.DEV,
	    networks: ['mainnet', 'testnet'],
	    defaultNetwork: 'testnet',
	    createClient(network) {
	        return new SuiGrpcClient({ network, baseUrl: GRPC_URLS[network] });
	    },
	});

	const modal = document.querySelector('mysten-dapp-kit-connect-modal');
	modal!.instance = dAppKit;

	const trigger = document.getElementById('custom-trigger');
	trigger?.addEventListener('click', () => {
	    modal!.show();
	});
</script>
```

### Vue

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { dAppKit } from './dapp-kit.ts';

const modalRef = ref();
const isModalOpen = ref(false);

const openModal = () => {
	// Using property binding
	isModalOpen.value = true;
	// Or using method
	modalRef.value.show();
};
</script>

<template>
	<!-- Custom trigger -->
	<button @click="openModal">Select Wallet</button>

	<!-- Modal component -->
	<mysten-dapp-kit-connect-modal
		ref="modalRef"
		:instance="dAppKit"
		:open="isModalOpen"
		@closed="isModalOpen = false"
	/>
</template>
```

### React

DApp Kit React bindings provide a [React wrapper](../react/components/connect-modal) for the modal.

## Properties

* **instance** - The dApp Kit instance
* **open** - Boolean to control modal visibility programmatically
* **filterFn** (optional) - Function to filter available wallets
  * Type: `(wallet: UiWallet, index: number, array: UiWallet[]) => boolean`
* **sortFn** (optional) - Function to sort available wallets
  * Type: `(a: UiWallet, b: UiWallet) => number`

## Methods

### show()

Opens the modal programmatically:

```js
const modal = document.querySelector('mysten-dapp-kit-connect-modal');
await modal?.show();
```

### close(returnValue: string)

Closes the modal with an optional return value:

```js
const modal = document.querySelector('mysten-dapp-kit-connect-modal');
await modal?.close('user-cancelled');
```

## Events

The modal fires several events during its lifecycle:

* **open** - Fired before the modal opens (cancelable)
* **opened** - Fired after the modal has fully opened
* **close** - Fired before the modal closes (cancelable)
* **closed** - Fired after the modal has fully closed
* **cancel** - Fired when clicking backdrop or pressing Escape (cancelable)

```js
const modal = document.querySelector('mysten-dapp-kit-connect-modal');

modal?.addEventListener('open', (event) => {
	console.log('Modal is about to open');
	// Prevent opening if needed
	// event.preventDefault();
});

modal?.addEventListener('opened', () => {
	console.log('Modal is now open');
});

modal?.addEventListener('closed', () => {
	console.log('Modal has closed');
});

modal?.addEventListener('cancel', (event) => {
	console.log('User clicked backdrop or pressed Escape');
});
```

## Examples

### Programmatic Control

```js
const modal = document.querySelector('mysten-dapp-kit-connect-modal');
modal.instance = dAppKit;

// Open modal when user tries to perform an action that requires connection
async function performAction() {
	const connection = dAppKit.stores.$connection.get();

	if (!connection.account) {
		await modal.show();
		// Wait for connection or cancellation
		return;
	}

	// Proceed with action...
}
```

## Server-Side Rendering (SSR)

The `<mysten-dapp-kit-connect-modal>` Web Component can be only client-side rendered, as wallets are
detected in the browser. For Next.js guide see [here](../getting-started/next-js).