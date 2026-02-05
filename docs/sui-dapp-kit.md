### Install Sui dApp Kit for Vanilla JavaScript and Other Frameworks

Source: https://sdk.mystenlabs.com/dapp-kit/index

Installs the core dApp Kit package for use with vanilla JavaScript or other frameworks. This provides framework-agnostic tools for interacting with the Sui network.

```bash
npm i @mysten/dapp-kit-core @mysten/sui
```

--------------------------------

### Start Sui dApp Development Server

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/create-dapp

Install project dependencies using `pnpm install` and then start the development server with `pnpm dev`. This command typically uses Vite for fast builds and hot module replacement.

```bash
pnpm install
pnpm dev
```

--------------------------------

### Install Sui dApp Kit for React Applications

Source: https://sdk.mystenlabs.com/dapp-kit/index

Installs the necessary packages for building React applications with the Sui dApp Kit. This includes the React-specific bindings and the core Sui SDK.

```bash
npm i @mysten/dapp-kit-react @mysten/sui
```

--------------------------------

### Install Sui dApp Kit and Dependencies

Source: https://sdk.mystenlabs.com/dapp-kit/legacy

This command installs the necessary packages for using the Sui dApp Kit, including the kit itself, the Sui SDK, and React Query for state management.

```bash
npm i --save @mysten/dapp-kit @mysten/sui @tanstack/react-query
```

--------------------------------

### React DAppKitProvider Setup with Custom Configuration

Source: https://sdk.mystenlabs.com/dapp-kit/react/dapp-kit-provider

Illustrates how to configure the DAppKitProvider with custom settings. This includes defining network URLs, creating a custom gRPC client, enabling auto-connect, and specifying storage options. It also shows the necessary global type registration for the dAppKit instance to ensure hooks function correctly. This setup is crucial for tailoring the dApp Kit to specific network environments and user preferences.

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

--------------------------------

### Example of Wallet Connection and Subscription

Source: https://sdk.mystenlabs.com/dapp-kit/actions/connect-wallet

Provides a comprehensive example of connecting a wallet using the dApp Kit SDK and subscribing to connection status changes. It retrieves available wallets, attempts to connect to the first one, and logs connection details or errors. This showcases real-time connection management.

```javascript
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

--------------------------------

### Complete dApp Kit Theme Example

Source: https://sdk.mystenlabs.com/dapp-kit/theming

A comprehensive example of CSS custom properties for a complete dApp Kit theme, covering colors, typography, and layout. This example uses HSL color values for precise control.

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

--------------------------------

### Install dApp Kit and Sui Dependencies for Vue

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/vue

Installs the core dApp Kit package, the Sui SDK, and the Nanostores Vue adapter. These are essential for integrating dApp Kit functionality into a Vue application and managing reactive state.

```bash
npm i @mysten/dapp-kit-core @mysten/sui @nanostores/vue
```

--------------------------------

### Connect Modal Programmatic Control Example (JavaScript)

Source: https://sdk.mystenlabs.com/dapp-kit/web-components/connect-modal

Provides an example of programmatically controlling the `<mysten-dapp-kit-connect-modal>` within a dApp. It shows how to check for an existing connection and open the modal if necessary before proceeding with a user action.

```javascript
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

--------------------------------

### React DAppKitProvider Basic Setup

Source: https://sdk.mystenlabs.com/dapp-kit/react/dapp-kit-provider

Demonstrates the fundamental way to set up the DAppKitProvider in a React application. This involves importing the provider and the dAppKit instance, then wrapping the main application component with DAppKitProvider, passing the dAppKit instance as a prop. This makes the dApp Kit functionalities available to all child components via context.

```tsx
import { dAppKit } from './dapp-kit.ts';
import { DAppKitProvider } from '@mysten/dapp-kit-react';

export default function App() {
	return (
		<DAppKitProvider dAppKit={dAppKit}>
			<YourApp />
		</DAppKitProvider>
	);
}
```

--------------------------------

### Configure dApp Kit Instance (React)

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/react

Sets up a dApp Kit instance for a React application, configuring network connections and creating a Sui gRPC client. It includes type registration for hook inference.

```typescript
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

--------------------------------

### Connect Wallet and Log Accounts using DApp Kit

Source: https://sdk.mystenlabs.com/dapp-kit/dapp-kit-instance

This example shows how to connect a wallet and log the connected accounts using a pre-configured DApp Kit instance. It imports the `dAppKit` instance and type definitions for wallets and accounts, then calls the `connectWallet` action.

```typescript
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

--------------------------------

### Create dApp Kit Instance with Sui gRPC Client

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/vue

Initializes the dApp Kit by creating an instance with specified networks and a client factory function. This setup configures the connection to the Sui network using the gRPC client, enabling interaction with the blockchain.

```typescript
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

--------------------------------

### Provide dApp Kit Context (React)

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/react

Wraps the React application with the DAppKitProvider to make dApp Kit functionalities and hooks available throughout the component tree. Includes a ConnectButton for user interaction.

```typescript
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

--------------------------------

### Create DApp Kit Instance with Sui gRPC Client

Source: https://sdk.mystenlabs.com/dapp-kit/dapp-kit-instance

This snippet demonstrates the basic setup for creating a DApp Kit instance. It imports necessary functions and clients, defines network URLs, and initializes `createDAppKit` with specified networks and a client creation function using `SuiGrpcClient`.

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

--------------------------------

### Create Sui dApp with Specific Template and Name

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/create-dapp

Utilize command-line flags with `npm create @mysten/dapp` to specify the template and project name directly. This allows for automated project setup without interactive prompts.

```bash
# Create with specific template
npm create @mysten/dapp -- -t react-e2e-counter

# Create with specific name
npm create @mysten/dapp -- -n my-app

# Create with both
npm create @mysten/dapp -- -t react-client-dapp -n my-app
```

--------------------------------

### Execute Transactions with dApp Kit (React)

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/react

Demonstrates how to use the useDAppKit hook to sign and execute a Sui transaction for transferring objects. It includes error handling for failed transactions.

```typescript
import { useDAppKit, useCurrentAccount } from '@mysten/dapp-kit-react';
import { Transaction, coinWithBalance } from '@mysten/sui/transactions';

function TransferButton() {
	const dAppKit = useDAppKit();
	const account = useCurrentAccount();

	aSync function handleTransfer() {
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

--------------------------------

### React Integration with dApp Kit Connect Button

Source: https://sdk.mystenlabs.com/dapp-kit/theming

Integrate the dApp Kit ConnectButton component into a React application. This example shows how to import the component and apply a custom theme by importing a CSS file.

```javascript
import { ConnectButton } from '@mysten/dapp-kit-react';
import './theme.css'; // Your theme CSS file

export function App() {
	return <ConnectButton />;
}
```

--------------------------------

### Access Sui dApp Kit Direct Properties (JavaScript)

Source: https://sdk.mystenlabs.com/dapp-kit/state

Demonstrates how to access direct properties of the dApp Kit instance, such as the list of available networks and methods to get specific network clients.

```javascript
// Get available networks (not a store, just a property)
const networks = dAppKit.networks; // ['mainnet', 'testnet', ...]

// Get client for specific network
const mainnetClient = dAppKit.getClient('mainnet');
const currentClient = dAppKit.getClient(); // Current network's client
```

--------------------------------

### React Using dApp Kit Hooks within Provider

Source: https://sdk.mystenlabs.com/dapp-kit/react/dapp-kit-provider

Shows how to utilize dApp Kit hooks such as `useDAppKit`, `useCurrentAccount`, and `useCurrentNetwork` within a React component once it's a descendant of `DAppKitProvider`. The example demonstrates fetching the current network and account information, and initiating wallet connection using the `dAppKit.connectWallet` method. These hooks provide convenient access to the dApp Kit's state and functionalities.

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

--------------------------------

### Use useSuiClientQuery Hook for RPC Calls

Source: https://sdk.mystenlabs.com/dapp-kit/legacy

This example demonstrates how to use the `useSuiClientQuery` hook from the Sui dApp Kit to fetch data from the Sui blockchain. It wraps `@tanstack/react-query`'s `useQuery` and provides a convenient way to interact with the Sui RPC API, such as fetching owned objects.

```javascript
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

--------------------------------

### Use dApp Kit Connect Button in Vue Component

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/vue

Demonstrates how to use the dApp Kit's connect button web component within a Vue setup script and template. It requires importing the dAppKit instance and passing it as a prop to the custom element.

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

--------------------------------

### Dynamically Import Single Client Component in Next.js

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/next-js

Dynamically imports the `WalletApp` client component into a Next.js page, ensuring it's only rendered on the client-side. This is an alternative to the multi-component setup.

```typescript
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

--------------------------------

### Inspect Sui dApp Kit Connection Store Details (JavaScript)

Source: https://sdk.mystenlabs.com/dapp-kit/state

Provides an example of how to retrieve and inspect the details of the connection store, including properties like wallet information, account address, and connection status flags.

```javascript
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

if (connection.isConnected && connection.wallet && connection.account) {
	console.log('Address:', connection.account.address);
	console.log('Wallet:', connection.wallet.name);
	console.log('Available accounts:', connection.wallet.accounts);
}
```

--------------------------------

### Complete Vue dApp Kit Example with Transaction Execution

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/vue

A comprehensive Vue component integrating dApp Kit for wallet connection and transaction execution. It displays wallet information and provides a button to send a test transaction, including full error handling and success feedback.

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

--------------------------------

### Access and Subscribe to Sui dApp Kit Network Store (JavaScript)

Source: https://sdk.mystenlabs.com/dapp-kit/state

Illustrates how to get the current network from the dApp Kit and subscribe to changes in the network store. It also notes that this store is read-only and network switching is done via a separate method.

```javascript
const currentNetwork = dAppKit.stores.$currentNetwork.get(); // 'mainnet' | 'testnet' | ...

// Subscribe to network changes
dAppKit.stores.$currentNetwork.subscribe((network) => {
	console.log('Switched to network:', network);
});

// Note: This store is read-only. Use dAppKit.switchNetwork() to change networks.
```

--------------------------------

### Single Client Component for dApp Kit Integration

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/next-js

An alternative approach for simpler applications, consolidating dApp Kit setup, connection button, and wallet status within a single client component. Includes a basic transaction sending functionality.

```typescript
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

--------------------------------

### Vue Integration with dApp Kit Connect Button

Source: https://sdk.mystenlabs.com/dapp-kit/theming

Integrate the dApp Kit connect button into a Vue application. This example demonstrates using the web component and importing a CSS theme file within the template and style tags.

```html
<template>
	<mysten-dapp-kit-connect-button :instance="dAppKit" />
</template>

<style>
@import './theme.css';
</style>
```

--------------------------------

### Display Wallet Connection Status (React)

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/react

Utilizes dApp Kit hooks (useCurrentAccount, useCurrentWallet, useCurrentNetwork) to display the current wallet connection status, including the wallet name, account address, and network.

```typescript
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

--------------------------------

### Component-Specific Theming with CSS Custom Properties

Source: https://sdk.mystenlabs.com/dapp-kit/theming

Override CSS custom properties on specific dApp Kit web components to apply unique styles. This example customizes the connect button and connect modal.

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

--------------------------------

### Get Wallet Connection Status with useWalletConnection (React)

Source: https://sdk.mystenlabs.com/dapp-kit/react/hooks/use-wallet-connection

Demonstrates how to use the useWalletConnection hook to display different UI states based on the wallet connection status (disconnected, connecting, connected). Requires the DAppKitProvider to be set up in the component tree.

```javascript
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

--------------------------------

### Global Theming with CSS Custom Properties

Source: https://sdk.mystenlabs.com/dapp-kit/theming

Apply CSS custom properties to the :root selector to globally theme all dApp Kit components. This example sets primary colors, background, foreground, border, radius, and font family.

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

--------------------------------

### Update UI Based on Sui dApp Kit State Changes (JavaScript)

Source: https://sdk.mystenlabs.com/dapp-kit/state

Provides practical examples of subscribing to connection and network state changes and updating specific HTML elements to reflect the current connection status and network.

```javascript
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

--------------------------------

### Set up Sui dApp Kit Providers in React

Source: https://sdk.mystenlabs.com/dapp-kit/legacy

This code sets up the necessary providers for the Sui dApp Kit within a React application. It configures network connections, initializes a QueryClient, and wraps the application with SuiClientProvider and WalletProvider.

```javascript
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

--------------------------------

### Initialize and Access Sui dApp Kit Stores (JavaScript)

Source: https://sdk.mystenlabs.com/dapp-kit/state

Demonstrates how to initialize the dApp Kit and access its reactive state stores like connection, network, client, and wallets. This is the foundational step for interacting with the dApp Kit's state.

```javascript
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

--------------------------------

### DApp Kit Instance API

Source: https://sdk.mystenlabs.com/dapp-kit/dapp-kit-instance

The `createDAppKit` function is the foundation of your Sui dApp. It creates an instance that manages wallet connections, network configuration, and provides access to the Sui client.

```APIDOC
## POST /createDAppKit

### Description
Initializes and returns a DApp Kit instance, which manages wallet connections, network configurations, and provides access to the Sui client for dApp functionality.

### Method
POST

### Endpoint
/createDAppKit

### Parameters
#### Request Body
- **networks** (string[]) - Required - A list of networks supported by the application (e.g. `['mainnet', 'testnet']`).
- **autoConnect** (boolean) - Optional - Enables automatically connecting to the most recently used wallet account (default: `true`).
- **defaultNetwork** (string) - Optional - Initial network to use (default: first network in the array).
- **createClient** (function) - Required - A function that creates a new client instance for the given network.
- **enableBurnerWallet** (boolean) - Optional - Enable development-only burner wallet (default: `false`).
- **storage** (object | null) - Optional - Configures how the most recently connected to wallet account is stored (default: `localStorage`, set to `null` to disable).
- **storageKey** (string) - Optional - The key to use to store the most recently connected wallet account (default: `'mysten-dapp-kit:selected-wallet-and-address'`).
- **walletInitializers** (array) - Optional - A list of wallet initializers used for registering additional wallet standard wallets.
- **slushWalletConfig** (object | null) - Optional - Configuration for Slush wallet (set to `null` to disable the wallet).

### Request Example
```json
{
  "networks": ["testnet"],
  "createClient": "(network) => new SuiGrpcClient({ network, baseUrl: GRPC_URLS[network] })"
}
```

### Response
#### Success Response (200)
- **connectWallet** (function) - Function to connect a wallet.
- **disconnectWallet** (function) - Function to disconnect the wallet.
- **switchAccount** (function) - Function to switch the current account.
- **switchNetwork** (function) - Function to switch the network.
- **signTransaction** (function) - Function to sign a transaction.
- **signAndExecuteTransaction** (function) - Function to sign and execute a transaction.
- **signPersonalMessage** (function) - Function to sign a personal message.
- **networks** (string[]) - List of supported networks.
- **stores** (object) - Reactive stores for wallet connection status, current network, and client.
- **getClient** (function) - Function to get the client instance for a given network.

#### Response Example
```json
{
  "connectWallet": "[Function]",
  "disconnectWallet": "[Function]",
  "switchAccount": "[Function]",
  "switchNetwork": "[Function]",
  "signTransaction": "[Function]",
  "signAndExecuteTransaction": "[Function]",
  "signPersonalMessage": "[Function]",
  "networks": ["testnet"],
  "stores": {
    "$wallets": "[ReadableAtom]",
    "$connection": "[ReadableAtom]",
    "$currentNetwork": "[ReadableAtom]",
    "$currentClient": "[ReadableAtom]"
  },
  "getClient": "[Function]"
}
```
```

--------------------------------

### Create a Sui dApp with @mysten/create-dapp

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/create-dapp

Use the npm command to initiate the creation of a new Sui dApp project. This command will prompt you to select a template and project name, then set up a ready-to-run project structure.

```bash
npm create @mysten/dapp
```

--------------------------------

### Create dApp Kit Instance with Sui gRPC Client

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/next-js

Sets up a dApp Kit instance for a Next.js application. It configures network connections using Sui gRPC and defines how to create a client for each network. This code is intended for server-side or shared module usage.

```typescript
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

--------------------------------

### Utilize Sui dApp Kit Client Store for Blockchain Queries (JavaScript)

Source: https://sdk.mystenlabs.com/dapp-kit/state

Demonstrates how to access the SuiClient instance from the dApp Kit's client store and use it to perform blockchain queries, such as fetching account balances.

```javascript
const client = dAppKit.stores.$currentClient.get();

// Use the client to query the blockchain
const balance = await client.getBalance({
	owner: '0x...',
});
```

--------------------------------

### Deploy Move Contract on Sui Testnet

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/create-dapp

Commands to set up the Sui CLI for testnet, switch to the testnet environment, and publish a Move contract. Ensure you have testnet SUI from the faucet before publishing.

```bash
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
sui client switch --env testnet
cd move
sui client publish --gas-budget 100000000 counter
```

--------------------------------

### Sign and Execute Sui Transaction with dApp Kit (TypeScript)

Source: https://sdk.mystenlabs.com/dapp-kit/actions/sign-and-execute-transaction

Demonstrates how to use the `signAndExecuteTransaction` action from the dApp Kit to create, sign, and execute a transaction on the Sui network. It includes error handling for failed transactions and logging the transaction digest upon success. Requires `@mysten/dapp-kit-core` and `@mysten/sui`.

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

```typescript
// The action automatically detects and uses the appropriate method
// No special configuration needed
const result = await dAppKit.signAndExecuteTransaction({
	transaction: tx,
});
```

--------------------------------

### Integrate Custom Wallets with DApp Kit

Source: https://sdk.mystenlabs.com/dapp-kit/dapp-kit-instance

Add support for custom wallets to the DApp Kit using the `walletInitializers` option. This allows you to register your own wallet implementations by providing an `initialize` function that registers the wallet with the wallet standard API. This requires `@mysten/dapp-kit-core`, `@mysten/sui/grpc`, and `@mysten/wallet-standard`.

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

--------------------------------

### Connect Button Basic Usage - Vanilla JS

Source: https://sdk.mystenlabs.com/dapp-kit/web-components/connect-button

Demonstrates the basic integration of the `<mysten-dapp-kit-connect-button>` Web Component in vanilla JavaScript. It shows how to render the button and assign the dAppKit instance to it.

```html
<mysten-dapp-kit-connect-button></mysten-dapp-kit-connect-button>

<script>
	const button = document.querySelector('mysten-dapp-kit-connect-button');
	   button!.instance = dAppKit;
</script>
```

--------------------------------

### Switch Network with dApp Kit Core and Sui Grpc Client (JavaScript)

Source: https://sdk.mystenlabs.com/dapp-kit/actions/switch-network

Demonstrates how to initialize the dApp Kit with multiple networks and then switch the client's active network using the switchNetwork action. It requires the '@mysten/dapp-kit-core' and '@mysten/sui/grpc' libraries.

```javascript
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

--------------------------------

### Create DApp Kit Instance with Burner Wallet for Development

Source: https://sdk.mystenlabs.com/dapp-kit/dapp-kit-instance

This snippet illustrates how to configure the DApp Kit for development environments by enabling the burner wallet. It sets the network to 'localnet' and provides the appropriate gRPC client URL, along with `enableBurnerWallet: true`.

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

--------------------------------

### Connect Modal Basic Usage (Vanilla JS)

Source: https://sdk.mystenlabs.com/dapp-kit/web-components/connect-modal

Demonstrates the basic usage of the `<mysten-dapp-kit-connect-modal>` Web Component with a custom trigger button in vanilla JavaScript. It initializes the dApp Kit and links it to the modal, then uses an event listener to open the modal when the button is clicked.

```html
<button id="custom-trigger">Open Wallet Selector</button>
<mysten-dapp-kit-connect-modal></mysten-dapp-kit-connect-modal>
```

```javascript
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
modal.instance = dAppKit;

const trigger = document.getElementById('custom-trigger');
trigger?.addEventListener('click', () => {
    modal.show();
});
```

--------------------------------

### Connect Modal Methods (JavaScript)

Source: https://sdk.mystenlabs.com/dapp-kit/web-components/connect-modal

Illustrates how to programmatically control the `<mysten-dapp-kit-connect-modal>` using its `show()` and `close()` methods in JavaScript. The `show()` method opens the modal, while `close()` can optionally accept a return value.

```javascript
const modal = document.querySelector('mysten-dapp-kit-connect-modal');
await modal?.show();
```

```javascript
const modal = document.querySelector('mysten-dapp-kit-connect-modal');
await modal?.close('user-cancelled');
```

--------------------------------

### Access dApp Kit Connection State with Nanostores Vue

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/vue

Shows how to access the dApp Kit's reactive connection state and current network using `@nanostores/vue`. This allows for dynamic UI updates based on the wallet connection status and selected network.

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

--------------------------------

### Integrate Sui dApp Kit Connect Button (HTML)

Source: https://sdk.mystenlabs.com/dapp-kit/theming

This snippet shows the basic HTML structure required to include the Sui dApp Kit connect button in a web page. It includes a link to a CSS file for theming and the custom element for the connect button.

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

--------------------------------

### Connect Wallet Action

Source: https://sdk.mystenlabs.com/dapp-kit/actions/connect-wallet

This section details how to use the `connectWallet` action from the dApp Kit SDK to prompt a wallet to connect and authorize accounts for your application. It covers the necessary parameters and the expected return value.

```APIDOC
## POST /connectWallet

### Description
Initiates a wallet connection process, allowing users to authorize accounts for your dApp. Auto-connect is enabled by default.

### Method
POST

### Endpoint
/connectWallet

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **wallet** (UiWallet) - Required - The UiWallet instance to connect to.
- **account** (UiWalletAccount) - Optional - A specific UiWalletAccount to set as the selected account. Defaults to the first authorized account.

### Request Example
```json
{
  "wallet": "myWallet",
  "account": "myAccount"
}
```

### Response
#### Success Response (200)
- **accounts** (Array<UiWalletAccount>) - An array of authorized UiWalletAccount instances.

#### Response Example
```json
{
  "accounts": [
    {
      "address": "0x123...",
      "publicKey": "0xabc..."
    }
  ]
}
```
```

--------------------------------

### Sign and Execute Transaction API

Source: https://sdk.mystenlabs.com/dapp-kit/actions/sign-and-execute-transaction

The `signAndExecuteTransaction` action prompts the connected wallet to sign and immediately execute a transaction on the Sui network. This is the most common way to execute transactions in your dApp.

```APIDOC
## POST /signAndExecuteTransaction

### Description
Prompts the connected wallet to sign and immediately execute a transaction on the Sui network. This is the most common way to execute transactions in your dApp.

### Method
POST

### Endpoint
/signAndExecuteTransaction

### Parameters
#### Request Body
- **`transaction`** (Transaction | string) - Required - The transaction to sign and execute. Can be either a Transaction instance or base64-encoded bcs bytes for the transaction.
- **`signal`** (AbortSignal) - Optional - An abort signal to cancel the transaction request.

### Request Example
```json
{
  "transaction": "0x...",
  "signal": null
}
```

### Response
#### Success Response (200)
- **`$kind`** (string) - Discriminator for the transaction result type. Either 'Transaction' or 'FailedTransaction'.
- **`Transaction`** (object) - Contains details of the successfully executed transaction.
  - **`digest`** (string) - The transaction digest (unique identifier for the executed transaction).
  - **`signatures`** (string[]) - The signatures as base64-encoded strings.
  - **`epoch`** (string | null) - The epoch in which the transaction was executed.
  - **`status`** (object) - The execution status.
    - **`success`** (boolean) - Indicates if the transaction was successful.
    - **`error`** (string | null) - Error message if the transaction failed.
  - **`effects`** (object | null) - The parsed transaction effects.
  - **`transaction`** (object) - The parsed transaction data.
- **`FailedTransaction`** (object) - Contains details of a failed transaction.
  - **`status`** (object) - The execution status with error details.
    - **`error`** (string | null) - Error message if the transaction failed.

#### Response Example
```json
{
  "$kind": "Transaction",
  "Transaction": {
    "digest": "someDigest",
    "signatures": ["sig1", "sig2"],
    "epoch": "10",
    "status": {
      "success": true,
      "error": null
    },
    "effects": {},
    "transaction": {}
  }
}
```

#### Error Response Example
```json
{
  "$kind": "FailedTransaction",
  "FailedTransaction": {
    "status": {
      "error": "Transaction failed: insufficient balance"
    }
  }
}
```
```

--------------------------------

### Connect Button Basic Usage - Vue

Source: https://sdk.mystenlabs.com/dapp-kit/web-components/connect-button

Illustrates how to use the `<mysten-dapp-kit-connect-button>` Web Component within a Vue.js application. It shows the necessary import and how to pass the dAppKit instance as a prop.

```html
<script setup>
import { dAppKit } from './dapp-kit.ts';
</script>

<template>
	<mysten-dapp-kit-connect-button :instance="dAppKit" />
</template>
```

--------------------------------

### Connect Modal Basic Usage (Vue)

Source: https://sdk.mystenlabs.com/dapp-kit/web-components/connect-modal

Shows how to integrate the `<mysten-dapp-kit-connect-modal>` Web Component within a Vue.js application. It utilizes Vue's reactivity system with `ref` to manage the modal's open state and access its instance for programmatic control via the `show()` method.

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

--------------------------------

### Iterate Through Available Wallets in Sui dApp Kit (JavaScript)

Source: https://sdk.mystenlabs.com/dapp-kit/state

Shows how to retrieve the list of available wallets from the dApp Kit's wallets store and iterate through them to display wallet names and icons.

```javascript
const wallets = dAppKit.stores.$wallets.get();

wallets.forEach((wallet) => {
	console.log('Wallet:', wallet.name);
	console.log('Icon:', wallet.icon);
});
```

--------------------------------

### Connect Modal Basic Usage with React

Source: https://sdk.mystenlabs.com/dapp-kit/react/components/connect-modal

Demonstrates the basic implementation of the ConnectModal component in a React application. It shows how to manage the modal's visibility using React's useState hook and a button to trigger the connection.

```javascript
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

--------------------------------

### Switch Account using dApp Kit Core

Source: https://sdk.mystenlabs.com/dapp-kit/actions/switch-account

Demonstrates how to switch to a different account using the switchAccount action provided by the dApp Kit core. This action takes a UiWalletAccount object as a parameter and updates the dApp's current account state synchronously. Ensure the account provided belongs to the currently connected wallet.

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

--------------------------------

### Connect Wallet Action in dApp Kit SDK

Source: https://sdk.mystenlabs.com/dapp-kit/actions/connect-wallet

Demonstrates how to use the `connectWallet` action from the dApp Kit SDK to establish a connection with a user's wallet. This action can optionally specify a particular account to connect to. It returns a promise that resolves with the authorized accounts.

```javascript
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

--------------------------------

### Dynamically Import dApp Kit Components in Next.js Pages

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/next-js

Demonstrates how to use Next.js dynamic imports with `ssr: false` to load dApp Kit components on the client-side only. This is crucial for components that rely on browser-specific APIs like wallet detection.

```typescript
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

--------------------------------

### Execute Sui Transactions with dApp Kit in Vue

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/vue

Demonstrates how to construct and execute a Sui transaction within a Vue component using dApp Kit. It includes error handling for failed transactions and displays the transaction digest upon success.

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

--------------------------------

### Subscribe to Sui dApp Kit State Changes (JavaScript)

Source: https://sdk.mystenlabs.com/dapp-kit/state

Shows how to subscribe to changes in the dApp Kit's state stores, specifically the connection store. This allows your application to react in real-time to events like wallet connections or disconnections.

```javascript
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

--------------------------------

### Connect Modal Events (JavaScript)

Source: https://sdk.mystenlabs.com/dapp-kit/web-components/connect-modal

Demonstrates how to listen for and handle various events emitted by the `<mysten-dapp-kit-connect-modal>` Web Component. This includes 'open', 'opened', 'close', 'closed', and 'cancel' events, allowing for custom logic during the modal's lifecycle.

```javascript
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

--------------------------------

### Register dApp Kit Web Components in Vue App

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/vue

Imports and registers the dApp Kit's web components in the main entry point of the Vue application. This makes components like the connect button available for use throughout the app.

```typescript
// src/main.ts
import '@mysten/dapp-kit-core/web';
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');
```

--------------------------------

### Import Sui dApp Kit CSS Stylesheet

Source: https://sdk.mystenlabs.com/dapp-kit/legacy

This import statement includes the default CSS stylesheet for the Sui dApp Kit UI components, enabling their default styling within your dApp.

```javascript
import '@mysten/dapp-kit/dist/index.css';
```

--------------------------------

### Client-Only Provider for dApp Kit Components

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/next-js

A React client component that wraps dApp Kit functionality, ensuring wallet detection and interaction occur only on the client-side. This prevents server-side rendering issues.

```typescript
// app/DAppKitClientProvider.tsx
'use client';

import { DAppKitProvider, ConnectButton } from '@mysten/dapp-kit-react';
import { dAppKit } from './dapp-kit';

export function DAppKitClientProvider({ children }: { children: React.ReactNode }) {
	return <DAppKitProvider dAppKit={dAppKit}>{children}</DAppKitProvider>;
}

export { ConnectButton };
```

--------------------------------

### Generate TypeScript Bindings with pnpm codegen

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/create-dapp

Execute the `pnpm codegen` command to generate type-safe TypeScript functions for interacting with your Move modules. These bindings are placed in the `src/contracts/` directory.

```bash
pnpm codegen
```

--------------------------------

### Access Wallets with useWallets Hook (React)

Source: https://sdk.mystenlabs.com/dapp-kit/react/hooks/use-wallets

Demonstrates how to use the useWallets hook to fetch and display a list of available wallets, including their icons and names. This hook requires the component to be a descendant of DAppKitProvider.

```javascript
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

--------------------------------

### Connect Button with Modal Options

Source: https://sdk.mystenlabs.com/dapp-kit/react/components/connect-button

Demonstrates how to use the ConnectButton component with custom filtering and sorting options for the connection modal. This allows developers to control which wallets are displayed and in what order.

```jsx
<ConnectButton
	modalOptions={{
		filterFn: (wallet) => wallet.name !== 'Excluded Wallet',
		sortFn: (a, b) => a.name.localeCompare(b.name),
	}}
/>
```

--------------------------------

### Configure Package ID in TypeScript

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/create-dapp

After publishing your Move contract, copy the returned `packageId` and insert it into the `src/constants.ts` file. This is crucial for your dApp to reference the deployed contract.

```typescript
export const TESTNET_COUNTER_PACKAGE_ID = '<YOUR_PACKAGE_ID>';
```

--------------------------------

### Connect Modal Customization with Filter and Sort Functions in React

Source: https://sdk.mystenlabs.com/dapp-kit/react/components/connect-modal

Illustrates how to customize the wallet selection process within the ConnectModal component using `filterFn` and `sortFn` props. These functions allow developers to control which wallets are displayed and in what order.

```javascript
<ConnectModal
	open={open}
	filterFn={(wallet) => wallet.name !== 'ExcludedWallet'}
	sortFn={(a, b) => a.name.localeCompare(b.name)}
/>
```

--------------------------------

### Execute Transaction with useDAppKit Hook

Source: https://sdk.mystenlabs.com/dapp-kit/react/hooks/use-dapp-kit

Illustrates how to use the useDAppKit hook to sign and execute a transaction. It constructs a Sui transaction, calls signAndExecuteTransaction, and logs the result or any errors.

```typescript
import { useDAppKit } from '@mysten/dapp-kit-react';
import { Transaction } from '@mysten/sui/transactions';

export function TransferButton() {
	const dAppKit = useDAppKit();

	aync function handleTransfer() {
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

--------------------------------

### Sign Transaction with @mysten/dapp-kit-core and @mysten/sui

Source: https://sdk.mystenlabs.com/dapp-kit/actions/sign-transaction

Demonstrates how to use the `signTransaction` action from `@mysten/dapp-kit-core` to sign a Sui transaction built with `@mysten/sui`. This action prompts the connected wallet to sign the transaction without executing it, returning the signed transaction bytes and signature.

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

console.log('Signed transaction bytes:', bytes);
console.log('Signature:', signature);

```

--------------------------------

### Class-Based Dark Mode Theming

Source: https://sdk.mystenlabs.com/dapp-kit/theming

An alternative approach to dark mode theming using CSS classes. Define separate class names for light and dark themes and apply them conditionally to a parent element.

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

--------------------------------

### useWalletConnection Hook Return Value Structure

Source: https://sdk.mystenlabs.com/dapp-kit/react/hooks/use-wallet-connection

Illustrates the structure of the object returned by the useWalletConnection hook, detailing the available properties for connection status, wallet information, account details, and supported intents.

```json
{
	"status": "disconnected" | "connecting" | "reconnecting" | "connected",
	"wallet": UiWallet | null,
	"account": UiWalletAccount | null,
	"supportedIntents": string[],
	"isConnected": boolean,
	"isConnecting": boolean,
	"isReconnecting": boolean,
	"isDisconnected": boolean
}
```

--------------------------------

### Connect Wallet with useDAppKit Hook

Source: https://sdk.mystenlabs.com/dapp-kit/react/hooks/use-dapp-kit

Demonstrates how to use the useDAppKit hook to connect a wallet within a React component. It requires the wallet object as input and handles connection success or failure.

```typescript
import type { UiWallet } from '@mysten/dapp-kit-react';
import { useDAppKit } from '@mysten/dapp-kit-react';

export function MyComponent({ wallet }: { wallet: UiWallet }) {
	const dAppKit = useDAppKit();

	aync function handleConnect() {
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

--------------------------------

### Connect Button with Custom Text

Source: https://sdk.mystenlabs.com/dapp-kit/react/components/connect-button

Shows how to customize the content of the ConnectButton when a wallet is not connected by using a slot. This enables developers to display custom text or elements, such as a 'Link Wallet' button.

```jsx
<ConnectButton>
	<span>🔗 Link Wallet</span>
</ConnectButton>
```

--------------------------------

### Connect Button Custom Text - HTML

Source: https://sdk.mystenlabs.com/dapp-kit/web-components/connect-button

Shows how to customize the button text when no wallet is connected by using the default slot of the `<mysten-dapp-kit-connect-button>` Web Component.

```html
<mysten-dapp-kit-connect-button>
	<span>Sign In</span>
</mysten-dapp-kit-connect-button>
```

--------------------------------

### Access Sui Client with useCurrentClient Hook (React)

Source: https://sdk.mystenlabs.com/dapp-kit/react/hooks/use-current-client

Demonstrates how to use the `useCurrentClient` hook to obtain a `SuiClient` instance within a React component. This client can then be used to perform blockchain operations like fetching account balances. Ensure the component is a descendant of `DAppKitProvider`.

```javascript
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

--------------------------------

### Disable Auto-Connect with DApp Kit

Source: https://sdk.mystenlabs.com/dapp-kit/dapp-kit-instance

Configure the DApp Kit to prevent automatic wallet connections on initialization. This is achieved by setting the `autoConnect` option to `false` during the `createDAppKit` call. This requires the `@mysten/dapp-kit-core` and `@mysten/sui/grpc` packages.

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

--------------------------------

### Creating Uint8Array Messages for Signing (TypeScript)

Source: https://sdk.mystenlabs.com/dapp-kit/actions/sign-personal-message

Illustrates common patterns for creating Uint8Array messages required by the signPersonalMessage action. This includes encoding plain text strings and JSON objects into byte arrays before passing them to the signing function.

```typescript
const textMessage = new TextEncoder().encode('Hello, Sui!');
await dAppKit.signPersonalMessage({ message: textMessage });

const jsonMessage = new TextEncoder().encode(
	JSON.stringify({ action: 'sign', timestamp: Date.now() }),
);
await dAppKit.signPersonalMessage({ message: jsonMessage });
```

--------------------------------

### Sign Personal Message with dApp Kit (TypeScript)

Source: https://sdk.mystenlabs.com/dapp-kit/actions/sign-personal-message

Demonstrates how to use the signPersonalMessage action from the dApp Kit to prompt a wallet to sign a personal message. The message must be provided as a Uint8Array. The function returns a promise that resolves with the Base64 encoded signature and message bytes.

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

--------------------------------

### Conditional Class Application for Dark Mode in React

Source: https://sdk.mystenlabs.com/dapp-kit/theming

Dynamically apply 'dark-theme' or 'light-theme' class to a div in a React component based on a state variable (e.g., `isDark`). This allows for runtime theme switching.

```javascript
<div className={isDark ? 'dark-theme' : 'light-theme'}>
	<ConnectButton />
</div>
```

--------------------------------

### Subscribe to State Changes with useDAppKit Hook

Source: https://sdk.mystenlabs.com/dapp-kit/react/hooks/use-dapp-kit

Shows how to subscribe to state changes from the dApp Kit's connection store using the useDAppKit hook. It logs the connection status whenever it changes.

```typescript
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

--------------------------------

### Dark Mode Theming with CSS Custom Properties

Source: https://sdk.mystenlabs.com/dapp-kit/theming

Implement dark mode by defining different CSS custom property values within a media query for `prefers-color-scheme: dark`. This ensures the UI adapts to the user's system preferences.

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

--------------------------------

### Access Current Wallet with useCurrentWallet (React)

Source: https://sdk.mystenlabs.com/dapp-kit/react/hooks/use-current-wallet

The useCurrentWallet hook retrieves the currently connected wallet object. It returns null if no wallet is connected. This hook must be used within a component that is a descendant of DAppKitProvider.

```javascript
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

--------------------------------

### Access Current Account with useCurrentAccount Hook (React)

Source: https://sdk.mystenlabs.com/dapp-kit/react/hooks/use-current-account

This snippet demonstrates how to use the `useCurrentAccount` hook to retrieve and display the address and label of the currently selected wallet account. It handles the case where no account is selected. Ensure this hook is used within a component that is a descendant of `DAppKitProvider`.

```javascript
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

--------------------------------

### Return Value of useCurrentAccount Hook (TypeScript)

Source: https://sdk.mystenlabs.com/dapp-kit/react/hooks/use-current-account

This snippet defines the return type for the `useCurrentAccount` hook. It indicates that the hook will return either a `UiWalletAccount` object containing account details or `null` if no account is currently selected.

```typescript
UiWalletAccount | null;
```

--------------------------------

### Sign Personal Message

Source: https://sdk.mystenlabs.com/dapp-kit/actions/sign-personal-message

The `signPersonalMessage` action prompts the connected wallet to sign a personal message. This is useful for authentication, proof of ownership, or other scenarios where you need cryptographic proof that a user controls a specific account.

```APIDOC
## POST /signPersonalMessage

### Description
Prompts the connected wallet to sign a personal message. Useful for authentication, proof of ownership, or other scenarios requiring cryptographic proof of account control.

### Method
POST

### Endpoint
/signPersonalMessage

### Parameters
#### Request Body
- **message** (Uint8Array) - Required - The message to sign as a byte array.

### Request Example
```json
{
  "message": "base64EncodedMessage"
}
```

### Response
#### Success Response (200)
- **bytes** (string) - Base64 encoded message bytes.
- **signature** (string) - Base64 encoded signature.

#### Response Example
```json
{
  "bytes": "SGVsbG8sIFN1aSE=",
  "signature": "someSignatureString"
}
```

### Security Considerations
- Always display the message content clearly to users before signing.
- Avoid signing opaque or encoded data that users cannot understand.
- Include human-readable prefixes for different message types.
- Consider adding timestamps to prevent replay attacks.
```

--------------------------------

### Switch Account Action

Source: https://sdk.mystenlabs.com/dapp-kit/actions/switch-account

The switchAccount action allows you to change the currently active account within your dApp to another account from the connected wallet. This action updates the dApp's internal state but does not notify the wallet.

```APIDOC
## POST /switchAccount

### Description
Changes the currently selected account to a different account from the connected wallet. This action updates the dApp's internal state and does not affect the wallet itself.

### Method
POST

### Endpoint
/switchAccount

### Parameters
#### Request Body
- **account** (UiWalletAccount) - Required - The account to switch to. Must be an account that belongs to the currently connected wallet.

### Request Example
```javascript
import { createDAppKit } from '@mysten/dapp-kit-core';

const dAppKit = createDAppKit({
	/* config */
});

// Assuming 'anotherAccount' is a UiWalletAccount object from the connected wallet
dAppKit.switchAccount({
	account: anotherAccount,
});
```

### Response
#### Success Response (200)
- **void** - The action completes synchronously and updates the connection state immediately.

#### Response Example
(No response body is returned as the action is synchronous and returns void.)
```

--------------------------------

### Sign Transaction API

Source: https://sdk.mystenlabs.com/dapp-kit/actions/sign-transaction

The `signTransaction` action prompts the connected wallet to sign a transaction without executing it. This is useful when you need a signed transaction for later execution or for multi-signature scenarios.

```APIDOC
## POST /signTransaction

### Description
Prompts the connected wallet to sign a transaction without executing it. Useful for later execution or multi-signature scenarios.

### Method
POST

### Endpoint
/signTransaction

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **`transaction`** (Transaction | string) - Required - The transaction to sign. Can be a Transaction instance or base64-encoded bcs bytes.
- **`signal`** (AbortSignal) - Optional - An abort signal to cancel the signing request.

### Request Example
```json
{
  "transaction": "0x...",
  "signal": null
}
```

### Response
#### Success Response (200)
- **`bytes`** (string) - The signed transaction as a base64-encoded BCS string.
- **`signature`** (string) - The signature as a base64-encoded string.

#### Response Example
```json
{
  "bytes": "base64EncodedSignedTransaction",
  "signature": "base64EncodedSignature"
}
```
```

--------------------------------

### Access Current Network with useCurrentNetwork Hook (React)

Source: https://sdk.mystenlabs.com/dapp-kit/react/hooks/use-current-network

The `useCurrentNetwork` hook retrieves the name of the currently selected network. It is essential to use this hook within a component that is a descendant of `DAppKitProvider` to avoid runtime errors. The hook returns a string representing the network name.

```javascript
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

--------------------------------

### Disconnect Wallet Action - JavaScript

Source: https://sdk.mystenlabs.com/dapp-kit/actions/disconnect-wallet

The `disconnectWallet` action terminates the connection with the currently connected wallet. It clears the local connection state and attempts to notify the wallet. This action is part of the Mysten Labs dApp Kit.

```javascript
import { createDAppKit } from '@mysten/dapp-kit-core';

const dAppKit = createDAppKit({
	/* config */
});

await dAppKit.disconnectWallet();
```

--------------------------------

### Disconnect Wallet Action

Source: https://sdk.mystenlabs.com/dapp-kit/actions/disconnect-wallet

Terminates the connection with the currently connected wallet. This action clears the connection state locally and attempts to notify the wallet.

```APIDOC
## Disconnect Wallet

### Description
The `disconnectWallet` action terminates the connection with the currently connected wallet. It clears the connection state locally and attempts to notify the wallet. Even if the wallet notification fails, the local state is always cleared to ensure a clean disconnection.

### Method
```
await dAppKit.disconnectWallet();
```

### Endpoint
N/A (This is a client-side action)

### Parameters
None.

### Request Example
```javascript
import { createDAppKit } from '@mysten/dapp-kit-core';

const dAppKit = createDAppKit({
  /* config */
});

await dAppKit.disconnectWallet();
```

### Response
#### Success Response
- **void** - Resolves when the disconnection is complete.

#### Response Example
(Resolves to void)

#### Error Response
- **WalletNotConnectedError** - Thrown if no wallet is connected.
```