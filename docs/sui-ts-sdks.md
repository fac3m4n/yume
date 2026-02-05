### Install Sui TypeScript SDK using npm

Source: https://sdk.mystenlabs.com/index

This command installs the Sui TypeScript SDK package from npm. It's the first step to start interacting with the Sui blockchain using TypeScript.

```bash
npm i @mysten/sui
```

--------------------------------

### Start Sui dApp Development Server

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/create-dapp

Install project dependencies and start the development server for your Sui dApp. This command typically uses Vite for fast builds and hot module replacement.

```bash
pnpm install
pnpm dev
```

--------------------------------

### Example Media Query for DynamicTheme

Source: https://sdk.mystenlabs.com/typedoc/types/_mysten_dapp-kit.DynamicTheme

Provides an example of a media query string that can be used with the `mediaQuery` property of `DynamicTheme`. This specific example targets dark color schemes.

```css
'(prefers-color-scheme: dark)'
```

--------------------------------

### Setup Sui gRPC Client with Payment Kit Extension

Source: https://sdk.mystenlabs.com/payment-kit/getting-started

Demonstrates how to initialize a Sui gRPC client and extend it with the Payment Kit functionality. This client is used to interact with the Sui network and perform payment operations.

```typescript
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { paymentKit } from '@mysten/payment-kit';

// Create a Sui client with Payment Kit extension
const client = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
}).$extend(paymentKit());
```

--------------------------------

### Install @mysten/enoki SDK

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_enoki

Installs the @mysten/enoki SDK using npm. This is the first step to integrate Enoki's features into your project.

```bash
npm install @mysten/enoki
```

--------------------------------

### Creating a DApp Kit Instance

Source: https://sdk.mystenlabs.com/dapp-kit/dapp-kit-instance

The `createDAppKit` function initializes the DApp Kit, managing wallet connections, network configurations, and providing access to the Sui client. This example shows basic setup for the testnet.

```APIDOC
## POST /createDAppKit

### Description
Initializes the DApp Kit instance, which manages wallet connections, network configurations, and provides access to the Sui client for your dApp.

### Method
POST

### Endpoint
/createDAppKit

### Parameters
#### Request Body
- **networks** (string[]) - Required - A list of networks supported by the application (e.g. `['mainnet', 'testnet']`).
- **createClient** (function) - Required - A function that creates a new client instance for the given network.
- **autoConnect** (boolean) - Optional - Enables automatically connecting to the most recently used wallet account (default: `true`).
- **defaultNetwork** (string) - Optional - Initial network to use (default: first network in the array).
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
- **dAppKitInstance** (object) - The initialized DApp Kit instance with methods for wallet management, network switching, and client access.

#### Response Example
```json
{
  "dAppKitInstance": {
    "connectWallet": "function",
    "disconnectWallet": "function",
    "switchAccount": "function",
    "switchNetwork": "function",
    "signTransaction": "function",
    "signAndExecuteTransaction": "function",
    "signPersonalMessage": "function",
    "networks": ["testnet"],
    "stores": {
      "$wallets": "object",
      "$connection": "object",
      "$currentNetwork": "object",
      "$currentClient": "object"
    },
    "getClient": "function"
  }
}
```
```

--------------------------------

### Install and Build Sui TypeScript SDK with pnpm

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_sui

Instructions for installing dependencies and building the Sui TypeScript SDK locally using pnpm. This involves running 'pnpm install' followed by 'pnpm run build' or 'pnpm sdk build' depending on the project context.

```bash
# Install all dependencies  
$ pnpm install  
  
# Run `build` for the TypeScript SDK if you're in the `sdk/sui` project  
$ pnpm run build  
  
# Run `sdk build` for the TypeScript SDK if you're in the root of `sui` repo  
$ pnpm sdk build
```

--------------------------------

### Seal SDK Setup

Source: https://sdk.mystenlabs.com/seal

Guides users on how to set up the Seal SDK by creating a Sui client and extending it with the Seal extension, including necessary server configurations.

```APIDOC
## Setup

To use the Seal SDK, create a Sui client and extend it with the Seal extension:

```typescript
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { seal } from '@mysten/seal';

const client = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
}).$extend(
	seal({
		serverConfigs: [
			{ objectId: '0x...keyserver1', weight: 1 },
			{ objectId: '0x...keyserver2', weight: 1 },
		],
	}),
);
```

### Configuration Options

The `seal()` function accepts the following options:

*   **`serverConfigs`**(required) - Array of key server configurations with `objectId` and `weight`
*   **`verifyKeyServers`**(optional) - Whether to verify key server authenticity (default: `true`)
*   **`timeout`**(optional) - Timeout in milliseconds for network requests (default: `10000`)
```

--------------------------------

### Install @mysten/zksend SDK

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_zksend

Installs the @mysten/zksend package using npm. This is the first step to using the SDK for creating claimable links.

```bash
npm install @mysten/zksend
```

--------------------------------

### Install @mysten/walrus and @mysten/sui

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_walrus

Installs the necessary packages for using the Walrus SDK and interacting with Sui.

```bash
npm install --save @mysten/walrus @mysten/sui
```

--------------------------------

### Get Storage Confirmation from Node Example (TypeScript)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_walrus.WalrusClient

Demonstrates how to get a storage confirmation from a storage node using the SDK. It requires node index, blob ID, and deletable status as input.

```typescript
const confirmation = await client.getStorageConfirmationFromNode({ nodeIndex, blobId, deletable, objectId });
```

--------------------------------

### Complete Registry Setup and Payment Workflow (JavaScript)

Source: https://sdk.mystenlabs.com/payment-kit/registry-management

Provides a comprehensive example of setting up a custom payment registry, configuring its settings, and processing the first payment. This workflow involves creating the registry, extracting the admin capability, setting epoch expiration and managed funds, and finally initiating a payment. It requires several imports from `@mysten/sui` and `@mysten/payment-kit`.

```javascript
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { paymentKit } from '@mysten/payment-kit';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

const client = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
}).$extend(paymentKit());

const keypair = Ed25519Keypair.generate();
const registryName = 'my-marketplace-registry';

// Step 1: Create the registry
console.log('Creating registry...');
const createTx = client.paymentKit.tx.createRegistry({
	registryName: registryName,
});

const createResult = await client.signAndExecuteTransaction({
	transaction: createTx,
	signer: keypair,
	options: {
		showEffects: true,
		showObjectChanges: true,
	},
});

// Check transaction status
if (createResult.$kind === 'FailedTransaction') {
	throw new Error(
		`Registry creation failed: ${createResult.FailedTransaction.status.error?.message}`,
	);
}

// Step 2: Extract the admin cap
const adminCapObject = createResult.Transaction.objectChanges?.find(
	(change) => change.type === 'created' && change.objectType.includes('RegistryAdminCap'),
);

const adminCapId = adminCapObject && 'objectId' in adminCapObject ? adminCapObject.objectId : '';

console.log('Registry created!');
console.log('Admin Cap ID:', adminCapId);

// Step 3: Configure the registry
console.log('Configuring registry...');
const configTx = new Transaction();

// Set 60-epoch expiration
configTx.add(
	client.paymentKit.calls.setConfigEpochExpirationDuration({
		registryName: registryName,
		epochExpirationDuration: 60,
		adminCapId: adminCapId,
	}),
);

// Enable managed funds
configTx.add(
	client.paymentKit.calls.setConfigRegistryManagedFunds({
		registryName: registryName,
		registryManagedFunds: true,
		adminCapId: adminCapId,
	}),
);

const configResult = await client.signAndExecuteTransaction({
	transaction: configTx,
	signer: keypair,
});

// Check transaction status
if (configResult.$kind === 'FailedTransaction') {
	throw new Error(`Configuration failed: ${configResult.FailedTransaction.status.error?.message}`);
}

console.log('Registry configured!');
console.log('Ready to process payments');

// Step 4: Process a payment
const registryId = getRegistryIdFromName(registryName, namespaceId); // Assuming getRegistryIdFromName is defined elsewhere

const paymentTx = client.paymentKit.tx.processRegistryPayment({
	nonce: crypto.randomUUID(),
	coinType: '0x2::sui::SUI',
	amount: 1000000000,
	receiver: registryId, // Funds go to registry
	sender: keypair.getPublicKey().toSuiAddress(),
	registryName: registryName,
});

const paymentResult = await client.signAndExecuteTransaction({
	transaction: paymentTx,
	signer: keypair,
});

// Check transaction status
if (paymentResult.$kind === 'FailedTransaction') {
	throw new Error(`Payment failed: ${paymentResult.FailedTransaction.status.error?.message}`);
}

console.log('First payment processed:', paymentResult.Transaction.digest);
```

--------------------------------

### Complete Vue dApp Example with dApp Kit

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/vue

A comprehensive Vue component example integrating dApp Kit for wallet connection and transaction execution. It displays connection status, wallet details, and provides a button to send a test transaction.

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

### Set up Kiosk Extension for Devnet/Localnet with Custom Package IDs

Source: https://sdk.mystenlabs.com/kiosk/kiosk-client/introduction

This example shows how to configure the Kiosk extension for 'devnet' or 'localnet' by explicitly providing package IDs for various Kiosk rules. This is necessary because Kiosk rules and extensions are not supported on Devnet without specifying these IDs due to network wipes. It requires importing 'kiosk' and Sui RPC client utilities.

```typescript
import { kiosk } from '@mysten/kiosk';
import { getJsonRpcFullnodeUrl, SuiJsonRpcClient } from '@mysten/sui/jsonRpc';

const client = new SuiJsonRpcClient({
	url: getJsonRpcFullnodeUrl('devnet'),
	network: 'devnet',
}).$extend(
	kiosk({
		packageIds: {
			kioskLockRulePackageId: '0x...', 
			royaltyRulePackageId: '0x...', 
			personalKioskRulePackageId: '0x...', 
			floorPriceRulePackageId: '0x...', 
		},
	}),
);

```

--------------------------------

### Install @mysten/payment-kit and @mysten/sui

Source: https://sdk.mystenlabs.com/payment-kit

Installs the necessary packages for using the Sui Payment Kit SDK and the core Sui SDK. This command is essential for setting up your project to interact with the Sui blockchain and its payment functionalities.

```bash
npm install --save @mysten/payment-kit @mysten/sui
```

--------------------------------

### Install Kiosk SDK using npm

Source: https://sdk.mystenlabs.com/kiosk

This command installs the Kiosk SDK package from npm. Ensure you have Node.js and npm installed on your system.

```bash
npm i @mysten/kiosk
```

--------------------------------

### Place and List Item to Kiosk (Sui SDK V2)

Source: https://sdk.mystenlabs.com/kiosk/from-v1

This code snippet shows how to achieve the same functionality as the V1 example (placing an item and listing it for sale) using the new Kiosk SDK V2. It utilizes a builder-pattern API with `KioskTransaction` and requires initializing a SuiJsonRpcClient extended with kiosk functionality.

```typescript
import { kiosk, KioskTransaction } from '@mysten/kiosk';
import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';

// You need to do this only once and re-use it in the application.
const client = new SuiJsonRpcClient({
	url: getJsonRpcFullnodeUrl('mainnet'),
	network: 'mainnet',
}).$extend(kiosk());

const placeAndListToKiosk = async () => {
	// Assume you have saved the user's preferred kiosk Cap somewhere in your app's state.
	const { kioskOwnerCaps } = await client.kiosk.getOwnedKiosks({ address: '0xSomeAddress' });

	const tx = new Transaction();

	// Assume you use the first owned kiosk.
	new KioskTransaction({ transaction: tx, kioskClient: client.kiosk, cap: kioskOwnerCaps[0] })
		.placeAndList({
			itemType: '0xItemAddr::some:ItemType',
			item: 'SomeItemId',
			price: '100000',
		})
		.finalize();

	// ... continue to sign and execute the transaction
};

```

--------------------------------

### Install dApp Kit and Sui Packages for Vue

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/vue

Installs the core dApp Kit, Sui SDK, and Vue state management library using npm. These are essential dependencies for building a dApp with Mysten Labs SDKs in a Vue environment.

```bash
npm i @mysten/dapp-kit-core @mysten/sui @nanostores/vue
```

--------------------------------

### Install Sui dApp Kit and Dependencies (npm)

Source: https://sdk.mystenlabs.com/dapp-kit/legacy

Installs the necessary packages for the Sui dApp Kit, including `@mysten/dapp-kit`, `@mysten/sui`, and `@tanstack/react-query` for managing network requests and state.

```bash
npm i --save @mysten/dapp-kit @mysten/sui @tanstack/react-query
```

--------------------------------

### Seal SDK Installation

Source: https://sdk.mystenlabs.com/seal

Instructions on how to install the Seal SDK and the Sui SDK using npm.

```APIDOC
## Installation

```bash
npm install --save @mysten/seal @mysten/sui
```
```

--------------------------------

### Example CSS Selector for DynamicTheme

Source: https://sdk.mystenlabs.com/typedoc/types/_mysten_dapp-kit.DynamicTheme

Provides an example of a CSS selector string that can be used with the `selector` property of `DynamicTheme`. This is useful for manual theme switching by applying a class or data-attribute.

```css
'.data-dark'
```

--------------------------------

### Create Project Directory and Navigate

Source: https://sdk.mystenlabs.com/sui/hello-sui

This snippet shows how to create a new directory for your project and then change into that directory using standard terminal commands. These are foundational steps for starting any new project.

```bash
mkdir hello-sui
cd hello-sui
```

--------------------------------

### Execute Create Storage Transaction Example

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_walrus.WalrusClient

Provides an example of executing a transaction that creates a storage object. It returns the transaction digest and details of the created storage.

```typescript
const { digest, storage } = await client.executeCreateStorageTransaction({ size: 1000, epochs: 3, signer });
```

--------------------------------

### Install Sui dApp Kit for Vanilla JavaScript/Other Frameworks

Source: https://sdk.mystenlabs.com/dapp-kit

Installs the core Sui dApp Kit package for use with vanilla JavaScript or other frameworks. This provides framework-agnostic tools for dApp development.

```bash
npm i @mysten/dapp-kit-core @mysten/sui
```

--------------------------------

### Setup Walrus Client with Default Configuration

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_walrus

Initializes the Sui gRPC client and extends it with the Walrus SDK using default testnet configurations.

```typescript
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { walrus } from '@mysten/walrus';

const client = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
}).$extend(walrus());
```

--------------------------------

### Process Payment with Custom Coin Type on Sui

Source: https://sdk.mystenlabs.com/payment-kit/getting-started

Illustrates how to use the Payment Kit to process payments involving custom coin types on the Sui blockchain. This example shows how to specify a non-SUI coin type in the transaction.

```typescript
// Example with a custom coin type
const customCoinType = '0xabcd...::my_coin::MY_COIN';

const tx = client.paymentKit.tx.processRegistryPayment({
	nonce: crypto.randomUUID(),
	coinType: customCoinType,
	amount: 5000,
	receiver,
	sender: sender,
});

// Execute the transaction
const result = await client.signAndExecuteTransaction({
	transaction: tx,
	signer: keypair,
});
```

--------------------------------

### Build and Install Sui TypeScript SDK from Local Build

Source: https://sdk.mystenlabs.com/sui/install

Instructions for building the Sui TypeScript SDK from the Sui monorepo using pnpm and then adding it to your project. This method is for advanced users or those needing to test unreleased features directly from the source.

```bash
# Install all dependencies
pnpm install
# Run the build for the TypeScript SDK
pnpm sdk build
```

```bash
pnpm add ../ts-sdks/packages/sui
```

--------------------------------

### Derive Multisig Address with Passkey Public Key

Source: https://sdk.mystenlabs.com/sui/cryptography/multisig

This example shows how to derive a multisig address by incorporating a PasskeyPublicKey into the MultiSigPublicKey configuration. It allows for the creation of multisig setups that include passkey-based authentication alongside other key types.

```typescript
const multiSigPublicKey = MultiSigPublicKey.fromPublicKeys({
	threshold: 1,
	publicKeys: [
		{ publicKey: passkeyPublicKey, weight: 1 },
		// other keys
	],
});
```

--------------------------------

### Get ZkSend Link URL

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_zksend.ZkSendLinkBuilder

Provides an example of how to retrieve the generated ZkSend link URL from a ZkSendLinkBuilder instance. This link can be shared for others to claim the assets.

```typescript
import { ZkSendLinkBuilder } from "@mysten/zksend";

// Assume 'builder' is an instance of ZkSendLinkBuilder that has had assets added
const linkUrl = builder.getLink();

console.log("ZkSend Link URL:", linkUrl);
```

--------------------------------

### Connect to Sui Devnet using SuiGrpcClient

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_sui

Example of creating a SuiGrpcClient instance to connect to the Sui Devnet. It demonstrates initializing the client with the network and base URL, and then using the getCoins method to retrieve coins owned by a specific address.

```typescript
import { SuiGrpcClient } from '@mysten/sui/grpc';  
  
// create a client connected to devnet  
const client = new SuiGrpcClient({
	network: 'devnet',
	baseUrl: 'https://fullnode.devnet.sui.io:443',
});  
  
// get coins owned by an address using the Core API  
await client.getCoins({
	owner: '0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231',
});
```

--------------------------------

### Install Seal SDK and Sui

Source: https://sdk.mystenlabs.com/seal

Installs the necessary packages for the Seal SDK and Sui blockchain integration using npm.

```bash
npm install --save @mysten/seal @mysten/sui
```

--------------------------------

### Install @mysten/dapp-kit-react and @mysten/sui

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/next-js

Installs the necessary packages for integrating the dApp Kit with a Next.js application. This includes the React-specific dApp Kit components and the core Sui SDK.

```bash
npm i @mysten/dapp-kit-react @mysten/sui
```

--------------------------------

### Setting up Providers for Sui dApp Kit

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_dapp-kit

This code snippet demonstrates how to set up the necessary providers for the Sui dApp Kit. It includes configuring network connections, initializing the QueryClient, and wrapping the application with SuiClientProvider and WalletProvider.

```typescript
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getJsonRpcFullnodeUrl, type SuiClientOptions } from '@mysten/sui/jsonRpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
	localnet: { url: getJsonRpcFullnodeUrl('localnet') },
	mainnet: { url: getJsonRpcFullnodeUrl('mainnet') },
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

### Complete Theme Example with HSL Colors

Source: https://sdk.mystenlabs.com/dapp-kit/theming

Provides a comprehensive example of a complete theme using HSL color values for a custom design system. This includes definitions for colors, typography, and layout properties, demonstrating a full theming configuration.

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

### Install Sui TypeScript SDK Experimental Tag from NPM

Source: https://sdk.mystenlabs.com/sui/install

Installs the experimental version of the Sui TypeScript SDK from NPM. This version includes the latest features and is recommended for development against a local Sui network built from the 'main' branch of the Sui monorepo.

```bash
npm i @mysten/sui@experimental
```

--------------------------------

### Experimental Encrypt Feature Example

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_slush-wallet.SlushWallet

An example of an experimental encrypt feature within the Wallet Standard. It defines the feature name, version, supported ciphers, and the encrypt method signature.

```typescript
export type ExperimentalEncryptFeature = {
    // Name of the feature.
    'experimental:encrypt': {
        // Version of the feature.
        version: '1.0.0';
        // Properties of the feature.
        ciphers: readonly 'x25519-xsalsa20-poly1305'[];
        // Methods of the feature.
        encrypt (data: Uint8Array): Promise<Uint8Array>;
    };
};

```

--------------------------------

### Get a Section of an Array (JavaScript)

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_wallet-standard.ReadonlyUint8Array

The slice method returns a shallow copy of a portion of an array into a new array object selected from start to end (end not included) where start and end represent the index of items in that array. The original array will not be modified.

```javascript
const animals = ['ant', 'bison', 'camel', 'duck', 'elephant'];

console.log(animals.slice(2));
// Expected output: ['camel', 'duck', 'elephant']

console.log(animals.slice(2, 4));
// Expected output: ['camel', 'duck']
```

--------------------------------

### EnokiClient Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_enoki.EnokiClient

Initializes a new instance of the EnokiClient with the provided configuration.

```APIDOC
## Constructors

### constructor
  * new EnokiClient(config: EnokiClientConfig): EnokiClient
#### Parameters
    * config: EnokiClientConfig
#### Returns EnokiClient
```

--------------------------------

### Execute Sui Transactions in Vue with dApp Kit

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/vue

Provides an example of how to execute a Sui transaction (transferring objects) from a Vue component using the dApp Kit. It includes transaction creation, signing, execution, and error handling for failed transactions.

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

### Process a Registry-Based Payment in Sui

Source: https://sdk.mystenlabs.com/payment-kit/getting-started

Guides through creating and executing a registry-based payment transaction using the Payment Kit. It includes generating a keypair, constructing the transaction with payment details, signing, and executing it on the Sui network.

```typescript
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

// Create or load your keypair
const keypair = Ed25519Keypair.generate();
const sender = keypair.getPublicKey().toSuiAddress();

// Create the payment transaction
const tx = client.paymentKit.tx.processRegistryPayment({
	nonce: crypto.randomUUID(), // Unique identifier for this payment
	coinType: '0x2::sui::SUI', // Coin type (SUI in this case)
	amount: 1n * MIST_PER_SUI, // 1 SUI (in MIST)
	receiver,
	sender: sender,
});

// Sign and execute
const result = await client.signAndExecuteTransaction({
	transaction: tx,
	signer: keypair,
	options: {
		showEffects: true,
		showEvents: true,
	},
});

// Check transaction status
if (result.$kind === 'FailedTransaction') {
	throw new Error(`Payment failed: ${result.FailedTransaction.status.error?.message}`);
}

console.log('Payment processed:', result.Transaction.digest);
```

--------------------------------

### Install zkSend SDK with npm

Source: https://sdk.mystenlabs.com/zksend

Installs the zkSend SDK and the Sui SDK using npm. This is the first step to integrating zkSend functionality into your dApp.

```bash
npm i @mysten/zksend @mysten/sui
```

--------------------------------

### Install @mysten/signers Package

Source: https://sdk.mystenlabs.com/sui/cryptography/webcrypto-signer

Installs the necessary package for using the Web Crypto Signer. This is a prerequisite for importing and using the signer functionalities.

```bash
npm i @mysten/signers
```

--------------------------------

### Utilize Sui Core API for Transport-Agnostic Operations (TypeScript)

Source: https://sdk.mystenlabs.com/sui/clients

Illustrates the use of the Sui Core API, which provides a consistent interface for common operations across all client types. Examples include getting an object, retrieving a balance, and executing a transaction.

```typescript
// These methods work the same on any client
const { object } = await client.core.getObject({ objectId: '0x...' });
const balance = await client.core.getBalance({ owner: '0x...' });
await client.core.executeTransaction({ transaction, signatures });
```

--------------------------------

### Get Wallets API

Source: https://sdk.mystenlabs.com/typedoc/functions/_mysten_wallet-standard.getWallets

Provides an API for getting, listening for, and registering wallets using the @wallet-standard/base interface. It dispatches an event to notify wallets of app readiness and listens for registration events.

```APIDOC
## getWallets()

### Description
Provides an API for getting, listening for, and registering wallets. When called for the first time, it dispatches a "@wallet-standard/base".WindowAppReadyEvent to notify each Wallet that the app is ready to register it. It also adds a listener for "@wallet-standard/base".WindowRegisterWalletEvent to listen for a notification from each Wallet that the Wallet is ready to be registered by the app. This combination guarantees that each Wallet will be registered synchronously as soon as the app is ready, whether the app loads before or after each Wallet.

### Method
GET

### Endpoint
/

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```javascript
getWallets()
```

### Response
#### Success Response (200)
- **Wallets** (object) - API for getting, listening for, and registering Wallets.

#### Response Example
```json
{
  "example": "Wallets API object"
}
```
```

--------------------------------

### Borrow Item from Kiosk for Action

Source: https://sdk.mystenlabs.com/kiosk/kiosk-client/kiosk-transaction/examples

Shows how to borrow an item from a Kiosk to perform an action, such as leveling up a 'hero'. This example uses the `borrowTx` method to temporarily acquire an item, execute a `moveCall` for the action, and then finalize the transaction.

```typescript
// A sample function that borrows an item from kiosk and levels it up.
const levelUp = async (object) => {
	const tx = new Transaction();

	new KioskTransaction({ kioskClient: client.kiosk, transaction: tx, cap })
		.borrowTx(object, (item) => {
			tx.moveCall({
				target: '0xMyGame::hero::level_up',
				arguments: [item],
			});
		})
		.finalize();

	// Sign and execute transaction.
	await signAndExecuteTransaction({ tx: tx });
};

levelUp({
	itemType: '0x2MyGame::hero::Hero',
	itemId: '0xMyHeroObjectId',
});

```

--------------------------------

### Client Setup

Source: https://sdk.mystenlabs.com/payment-kit/payment-kit-sdk

This section details how to set up and extend the Sui gRPC client with the Payment Kit functionality.

```APIDOC
## Client Setup

### PaymentKitClient

The main client class that provides access to Payment Kit functionality.

#### `paymentKit()`

Function to create a Payment Kit client extension for `SuiGrpcClient`.

```typescript
paymentKit<Name extends string = 'paymentKit'>({
	name = 'paymentKit' as Name,
}): SuiClientRegistration<PaymentKitCompatibleClient, Name, PaymentKitClient>
```

**Example:**

```typescript
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { paymentKit } from '@mysten/payment-kit';

const client = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
}).$extend(paymentKit());

// Access Payment Kit functionality
client.paymentKit.tx.processRegistryPayment(/* ... */);
```

**Supported Networks:**
  * `testnet`
  * `mainnet`

**Throws:**
  * `PaymentKitClientError` if network is unsupported
```

--------------------------------

### SuiPythClient Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.SuiPythClient

Initializes a new instance of the SuiPythClient.

```APIDOC
## new SuiPythClient

### Description
Initializes a new instance of the SuiPythClient.

### Method
Constructor

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```json
{
  "provider": "ClientWithCoreApi",
  "pythStateId": "string",
  "wormholeStateId": "string"
}
```

### Response
#### Success Response (200)
N/A (Constructor)

#### Response Example
N/A (Constructor)
```

--------------------------------

### Initialize Sui SDK Client

Source: https://sdk.mystenlabs.com/kiosk/advanced-examples

Initializes the SuiJsonRpcClient with the kiosk extension for interacting with the Sui network. It requires the '@mysten/sui' and '@mysten/kiosk' packages.

```typescript
import { kiosk, KioskTransaction } from '@mysten/kiosk';
import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';

// a constant for bullshark's type.
const bullsharkType = `${packageId}::suifrens::SuiFren<${packageId}::bullshark::Bullshark>`;
// a constant for capy's type.
const capyType = `${packageId}::suifrens::SuiFren<${packageId}::capy::Capy>`;

// initialize the client with the kiosk extension.
const client = new SuiJsonRpcClient({
	url: getJsonRpcFullnodeUrl('mainnet'),
	network: 'mainnet',
}).$extend(kiosk());
```

--------------------------------

### PublicKey Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.cryptography.PublicKey

Details on how to instantiate a PublicKey object.

```APIDOC
## Constructors

### constructor

`new PublicKey(): PublicKey`

#### Returns
* PublicKey - A new PublicKey instance.
```

--------------------------------

### Connect to Sui Localnet using SuiGrpcClient

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_sui

Example of establishing a connection to a local Sui network using SuiGrpcClient. It shows how to configure the client for 'localnet' with the appropriate base URL and then query for coins owned by an address.

```typescript
import { SuiGrpcClient } from '@mysten/sui/grpc';  
  
// create a client connected to localnet  
const client = new SuiGrpcClient({
	network: 'localnet',
	baseUrl: 'http://127.0.0.1:9000',
});  
  
// get coins owned by an address using the Core API  
await client.getCoins({
	owner: '0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231',
});
```

--------------------------------

### Mint a SuiFren using Kiosk SDK

Source: https://sdk.mystenlabs.com/kiosk/advanced-examples

Demonstrates minting a SuiFren (Capy) into a kiosk. It handles creating a new kiosk if one doesn't exist and then mints the Capy. Requires '@mysten/kiosk' and '@mysten/sui' packages.

```typescript
async function mintFren(address: string) {
	const { kioskOwnerCaps } = await client.kiosk.getOwnedKiosks({ address });

	// Choose the first kiosk for simplicity. We could have extra logic here (e.g. let the user choose, pick a personal one, etc).
	const cap = kioskOwnerCaps[0];

	const tx = new Transaction();
	const kioskTx = new KioskTransaction({ transaction: tx, kioskClient: client.kiosk, cap });

	// We're mixing the logic here. If the cap is undefined, we create a new kiosk.
	if (!cap) kioskTx.create();

	// Let's mint a capy here into the kiosk (either a new or an existing one).
	tx.moveCall({
		target: `${packageId}::suifrens::mint_app::mint`,
		arguments: [kioskTx.getKiosk(), kioskTx.getKioskCap()],
		typeArguments: [capyType],
	});

	// If we don't have a cap, that means we create a new kiosk for the user in this flow.
	if (!cap) kioskTx.shareAndTransferCap(address);

	kioskTx.finalize();

	// sign and execute transaction.
	await signAndExecuteTransaction({ tx: tx });
}
```

--------------------------------

### Initialize GcpKmsSigner using Options

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_signers.gcp.GcpKmsSigner

Shows how to instantiate GcpKmsSigner using a detailed options object. This method requires specific details about the GCP KMS key, including its name, version, key ring, location, and project ID. Authentication is handled via the GOOGLE_APPLICATION_CREDENTIALS environment variable.

```typescript
const signer = await GcpKmsSigner.fromOptions({
  cryptoKey: "your-crypto-key",
  cryptoKeyVersion: "your-crypto-key-version",
  keyRing: "your-key-ring",
  location: "your-location",
  projectId: "your-project-id",
});

```

--------------------------------

### Initialize Sui Grpc Client and Use Core/Native APIs (TypeScript)

Source: https://sdk.mystenlabs.com/sui/clients

Demonstrates initializing the SuiGrpcClient for the mainnet and using both its Native API for specific features like getting a transaction and its Core API for common operations like getting an object.

```typescript
import { SuiGrpcClient } from '@mysten/sui/grpc';

const client = new SuiGrpcClient({
	network: 'mainnet',
	baseUrl: 'https://fullnode.mainnet.sui.io:443',
});

// Use the native API for full access to transport-specific features
const { response } = await client.ledgerService.getTransaction({ digest: '0x...' });

// Use the Core API for transport-agnostic operations
const { object } = await client.core.getObject({ objectId: '0x...' });
```

--------------------------------

### Setup Sui Client with Seal Extension

Source: https://sdk.mystenlabs.com/seal

Demonstrates how to initialize a Sui gRPC client and extend it with the Seal SDK's encryption capabilities. Requires network configuration and key server details.

```typescript
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { seal } from '@mysten/seal';

const client = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
}).$extend(
	seal({
		serverConfigs: [
			{ objectId: '0x...keyserver1', weight: 1 },
			{ objectId: '0x...keyserver2', weight: 1 },
		],
	}),
);
```

--------------------------------

### SuiPriceServiceConnection Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.SuiPriceServiceConnection

Initializes a new instance of the SuiPriceServiceConnection.

```APIDOC
## new SuiPriceServiceConnection

### Description
Constructs a new Connection to the Sui price service.

### Method
Constructor

### Endpoint
N/A

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```javascript
const connection = new SuiPriceServiceConnection("https://price.sui.io");
```

### Response
#### Success Response (200)
N/A

#### Response Example
N/A

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Path Parameters
```

--------------------------------

### Install @mysten/codegen Package

Source: https://sdk.mystenlabs.com/codegen

Installs the @mysten/codegen package as a development dependency using npm.

```bash
npm install -D @mysten/codegen
```

--------------------------------

### Initialize Sui Client with Payment Kit Extension

Source: https://sdk.mystenlabs.com/payment-kit

Demonstrates how to initialize a Sui gRPC client and extend it with the Payment Kit functionality. This setup is required before you can utilize any of the payment processing features provided by the SDK. It configures the client to connect to a specific Sui network, such as testnet.

```typescript
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { paymentKit } from '@mysten/payment-kit';

// Create a Sui client with a Payment Kit extension
const client = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
}).$extend(paymentKit());
```

--------------------------------

### Initialize PaymentKitClient

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_payment-kit.PaymentKitClient

Constructs a new instance of PaymentKitClient. Requires PaymentKitClientOptions as input. This is the primary way to start using the payment kit functionalities.

```typescript
const client = new PaymentKitClient(options);
```

--------------------------------

### initRegistration

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_suins.SuinsTransaction

Initializes the registration process for a given domain.

```APIDOC
## POST /initRegistration

### Description
Initializes the registration process for a given domain.

### Method
POST

### Endpoint
/initRegistration

### Parameters
#### Request Body
- **domain** (string) - Required - The domain name to register.

### Request Example
```json
{
  "domain": "example.com"
}
```

### Response
#### Success Response (200)
- **TransactionObjectArgument** - The transaction object argument for initialization.

#### Response Example
```json
{
  "digest": "0xdef...",
  "effects": { ... },
  "events": [ ... ]
}
```
```

--------------------------------

### Making RPC Calls with useSuiClientQuery Hook

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_dapp-kit

This example shows how to use the `useSuiClientQuery` hook from the Sui dApp Kit to fetch data from the Sui blockchain. It demonstrates fetching owned objects for a given owner address and handling loading and error states.

```typescript
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

### LedgerSigner Static Method: fromDerivationPath

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_signers.ledger.LedgerSigner

Prepares the signer by fetching and setting the public key from a Ledger device. It is recommended to initialize an `LedgerSigner` instance using this function.

```APIDOC
## Static Method: fromDerivationPath

### Description
Prepares the signer by fetching and setting the public key from a Ledger device. It is recommended to initialize an `LedgerSigner` instance using this function.

### Method
`static fromDerivationPath(derivationPath: string, ledgerClient: Sui, suiClient: ClientWithCoreApi): Promise<LedgerSigner>`

### Parameters
- **derivationPath** (string) - The derivation path for the key on the Ledger device.
- **ledgerClient** (Sui) - An instance of the Sui ledger client.
- **suiClient** (ClientWithCoreApi) - An instance of the Sui client with core API access.

### Returns
- **Promise<LedgerSigner>** - A promise that resolves once a `LedgerSigner` instance is prepared (public key is set).

### Example
```typescript
const derivationPath = "m/44'/784'/0'/0'/0'
const ledgerClient = new Sui(); // Assuming Sui client initialization
const suiClient = new ClientWithCoreApi(); // Assuming ClientWithCoreApi initialization
const signer = await LedgerSigner.fromDerivationPath(derivationPath, ledgerClient, suiClient);
```
```

--------------------------------

### DeepBookClient Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Initializes a new instance of the DeepBookClient.

```APIDOC
## new DeepBookClient()

### Description
Creates a new DeepBookClient instance.

### Method
CONSTRUCTOR

### Parameters
#### Named Parameters
- **__namedParameters** (DeepBookClientOptions) - Required - Options for the DeepBookClient.

### Request Example
```json
{
  "__namedParameters": {
    "deepbook": "0x...",
    "deepbookAdmin": "0x..."
    // ... other options
  }
}
```

### Response
#### Success Response (Instance)
- **DeepBookClient** - An instance of the DeepBookClient.

#### Response Example
```javascript
const client = new DeepBookClient({
  deepbook: "0x...",
  deepbookAdmin: "0x..."
});
```
```

--------------------------------

### Accessing dApp Kit Stores (JavaScript)

Source: https://sdk.mystenlabs.com/dapp-kit/state

Demonstrates how to initialize the dApp Kit and access its reactive stores for connection state, current network, client instance, and available wallets using the .get() method.

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

### SyncStore get Method (TypeScript)

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_enoki.SyncStore

Implements the get method for the SyncStore interface. This method retrieves the string value associated with a given key. It returns the value as a string or null if the key is not found.

```typescript
get(key: string): string | null;
```

--------------------------------

### Development Configuration with Burner Wallet

Source: https://sdk.mystenlabs.com/dapp-kit/dapp-kit-instance

Example demonstrating how to enable the burner wallet for development environments, typically used with `localnet`.

```APIDOC
## POST /createDAppKit (Development Configuration)

### Description
Initializes the DApp Kit instance with the burner wallet enabled, suitable for development environments connecting to a local network.

### Method
POST

### Endpoint
/createDAppKit

### Parameters
#### Request Body
- **networks** (string[]) - Required - Should include 'localnet' for development.
- **defaultNetwork** (string) - Optional - Set to 'localnet' for development.
- **createClient** (function) - Required - Function to create a `SuiGrpcClient` for the local network.
- **enableBurnerWallet** (boolean) - Required - Set to `true` to enable the development-only burner wallet.

### Request Example
```json
{
  "networks": ["localnet"],
  "defaultNetwork": "localnet",
  "createClient": "() => new SuiGrpcClient({ network: 'localnet', baseUrl: 'http://127.0.0.1:9000' })",
  "enableBurnerWallet": true
}
```

### Response
#### Success Response (200)
- **dAppKitInstance** (object) - The initialized DApp Kit instance with burner wallet capabilities.

#### Response Example
```json
{
  "dAppKitInstance": {
    "connectWallet": "function",
    "disconnectWallet": "function",
    "switchAccount": "function",
    "switchNetwork": "function",
    "signTransaction": "function",
    "signAndExecuteTransaction": "function",
    "signPersonalMessage": "function",
    "networks": ["localnet"],
    "stores": {
      "$wallets": "object",
      "$connection": "object",
      "$currentNetwork": "object",
      "$currentClient": "object"
    },
    "getClient": "function"
  }
}
```
```

--------------------------------

### Run Node.js Script

Source: https://sdk.mystenlabs.com/sui/hello-sui

This command executes the JavaScript file (index.js) using Node.js in your terminal. This will run the code that interacts with the Sui network to mint SUI.

```bash
node index.js
```

--------------------------------

### GET /websites/sdk_mystenlabs/getLiquidationRiskRatio

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the liquidation risk ratio for a deepbook pool, indicating the pool's leverage.

```APIDOC
## GET /websites/sdk_mystenlabs/getLiquidationRiskRatio

### Description
Get the liquidation risk ratio for a deepbook pool.

### Method
GET

### Endpoint
/websites/sdk_mystenlabs/getLiquidationRiskRatio

### Parameters
#### Query Parameters
- **poolKey** (string) - Required - The key to identify the pool.

### Response
#### Success Response (200)
- **liquidationRiskRatio** (number) - The liquidation risk ratio as a decimal (e.g., 1.125 for 112.5%).

#### Response Example
```json
{
  "liquidationRiskRatio": 1.125
}
```
```

--------------------------------

### Connect to a Custom Fullnode with SuiGrpcClient

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_sui

Demonstrates how to create a SuiGrpcClient instance to connect to a custom Sui fullnode. The client is configured with a specified network and the base URL of the user's fullnode, followed by an example of fetching coins.

```typescript
import { SuiGrpcClient } from '@mysten/sui/grpc';  
  
// create a client connected to your own fullnode  
const client = new SuiGrpcClient({
	network: 'devnet',
	baseUrl: 'https://your-fullnode.example.com:443',
});  
  
// get coins owned by an address using the Core API  
await client.getCoins({
	owner: '0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231',
});
```

--------------------------------

### Instantiate LedgerSigner with fromDerivationPath

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_signers.ledger.LedgerSigner

Creates an instance of LedgerSigner by fetching the public key from a Ledger device using a derivation path. This is the recommended way to initialize the signer.

```typescript
const signer = await LedgerSigner.fromDerivationPath(derivationPath, options);

```

--------------------------------

### KioskClient Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_kiosk.KioskClient

Initializes a new instance of the KioskClient.

```APIDOC
## KioskClient Constructor

### Description
Initializes a new instance of the KioskClient.

### Method
CONSTRUCTOR

### Parameters
#### Parameters
- **options** (KioskClientOptions) - Required - Options for the KioskClient.

### Returns
KioskClient

### Request Example
```json
{
  "options": { ... KioskClientOptions ... }
}
```

### Response Example
```json
{
  "instance": "KioskClient"
}
```
```

--------------------------------

### Publish Modules using Sui SDK

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_sui

This example shows how to publish a Move package to the Sui blockchain using the SDK. It involves building the package, extracting its bytecode and dependencies, and then publishing it via a transaction.

```typescript
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import { execSync } from 'child_process';

// Generate a new Ed25519 Keypair
const keypair = new Ed25519Keypair();
const client = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
});

const { modules, dependencies } = JSON.parse(
	execSync(`${cliPath} move build --dump-bytecode-as-base64 --path ${packagePath}`, {
		encoding: 'utf-8',
	}),
);
const tx = new Transaction();
const [upgradeCap] = tx.publish({
	modules,
	dependencies,
});
tx.transferObjects([upgradeCap], keypair.toSuiAddress());
const result = await client.signAndExecuteTransaction({
	signer: keypair,
	transaction: tx,
});
console.log({ result });
```

--------------------------------

### Static WalrusFile.from

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_walrus.WalrusFile

Creates a new WalrusFile instance from provided contents, identifier, and optional tags.

```APIDOC
## Static Method `from`

### Description
Creates a new WalrusFile instance from provided contents, identifier, and optional tags.

### Method
POST

### Endpoint
`/walrusfile/from`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **options** (object) - Required - An object containing the file contents, identifier, and optional tags.
  - **contents** (Uint8Array<ArrayBufferLike> | Blob) - Required - The content of the file.
  - **identifier** (string) - Required - The unique identifier for the file.
  - **tags** (Record<string, string>) - Optional - Key-value pairs for file tags.

### Request Example
```json
{
  "options": {
    "contents": "Uint8Array | Blob",
    "identifier": "unique-file-id",
    "tags": {
      "environment": "production"
    }
  }
}
```

### Response
#### Success Response (200)
- **WalrusFile** (object) - The newly created WalrusFile instance.

#### Response Example
```json
{
  "walrusFileInstance": "WalrusFile"
}
```
```

--------------------------------

### GET /websites/sdk_mystenlabs/getBaseQuantityOut

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Simulates a trade to determine the base quantity that will be received for a given quote quantity in a pool.

```APIDOC
## GET /websites/sdk_mystenlabs/getBaseQuantityOut

### Description
Get the base quantity out for a given quote quantity.

### Method
GET

### Endpoint
/websites/sdk_mystenlabs/getBaseQuantityOut

### Parameters
#### Query Parameters
- **poolKey** (string) - Required - Key of the pool.
- **quoteQuantity** (number) - Required - Quote quantity to convert.

### Response
#### Success Response (200)
- **baseOut** (number) - The amount of base asset received.
- **deepRequired** (number) - The amount of DEEP required for fees.
- **quoteOut** (number) - The effective quote quantity after fees.
- **quoteQuantity** (number) - The original quote quantity input.

#### Response Example
```json
{
  "baseOut": 99.8,
  "deepRequired": 4.9,
  "quoteOut": 95.1,
  "quoteQuantity": 100
}
```
```

--------------------------------

### Setup Walrus Client with Custom Package IDs

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_walrus

Initializes the Sui gRPC client and extends it with the Walrus SDK, allowing custom configuration for package IDs like system and staking pool.

```typescript
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { walrus } from '@mysten/walrus';

const client = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
}).$extend(
	walrus({
		packageConfig: {
			systemObjectId: '0x98ebc47370603fe81d9e15491b2f1443d619d1dab720d586e429ed233e1255c1',
			stakingPoolId: '0x20266a17b4f1a216727f3eef5772f8d486a9e3b5e319af80a5b75809c035561d',
		},
	}),
);
```

--------------------------------

### Setup Walrus Client with Custom Storage Node Options

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_walrus

Initializes the Sui gRPC client and extends it with the Walrus SDK, enabling customization of storage node client options like fetch function and timeout.

```typescript
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { walrus } from '@mysten/walrus';

const client = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
}).$extend(
	walrus({
		storageNodeClientOptions: {
			fetch: (url, options) => {
				console.log('fetching', url);
				return fetch(url, options);
			},
			timeout: 60_000,
		},
	}),
);
```

--------------------------------

### Initialize Enoki Wallets with enokiWalletsInitializer

Source: https://sdk.mystenlabs.com/typedoc/functions/_mysten_enoki.enokiWalletsInitializer

The enokiWalletsInitializer function is used to set up and manage enoki wallets. It accepts an options object and returns an object with an initialize method. The initialize method requires a function to get the client and a list of networks, and it returns a promise that resolves with an unregister function.

```typescript
import {
  RegisterEnokiWalletsOptions,
  Network,
  ClientWithCoreApi,
} from "@mysten/enoki";

function enokiWalletsInitializer(
  options: Omit<RegisterEnokiWalletsOptions, "clients" | "getCurrentNetwork">,
): {
  id: string;
  initialize(
    __namedParameters: {
      getClient: (network?: Network) => ClientWithCoreApi;
      networks: readonly Network[];
    },
  ): Promise<{ unregister: () => void }>;
} {
  // Implementation details would go here
  const id = "some-unique-id";
  return {
    id,
    initialize: async ({ getClient, networks }) => {
      console.log("Initializing wallets for networks:", networks);
      // Actual initialization logic using getClient and networks
      return {
        unregister: () => {
          console.log("Unregistering wallets for id:", id);
        },
      };
    },
  };
}
```

--------------------------------

### GET /accountExists

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Checks if an account exists for a given balance manager.

```APIDOC
## GET /accountExists

### Description
Check if account exists for a balance manager.

### Method
GET

### Endpoint
`/accountExists`

### Parameters
#### Query Parameters
- **poolKey** (string) - Required - Key of the pool.
- **managerKey** (string) - Required - Key of the balance manager.

### Response
#### Success Response (200)
- **boolean** - True if the account exists, false otherwise.

#### Response Example
```json
true
```
```

--------------------------------

### Configure Upload Relay with Constant Tip

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_walrus

This example demonstrates configuring an upload relay with a constant tip. The `sendTip` configuration includes an `address` and a `kind` set to `const`, specifying a fixed tip amount for each blob written.

```javascript
const client = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
}).$extend(
	walrus({
		uploadRelay: {
			host: 'https://upload-relay.testnet.walrus.space',
			sendTip: {
				address: '0x123...',
				kind: {
					const: 105,
				},
			},
		},
	}),
);

```

--------------------------------

### Get BalanceManager Owner

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.BalanceManagerContract

Retrieves the owner of the BalanceManager.

```APIDOC
## GET /balanceManager/owner

### Description
Get the owner of the BalanceManager.

### Method
GET

### Endpoint
/balanceManager/owner

### Parameters
#### Query Parameters
- **managerKey** (string) - Required - The key of the BalanceManager

### Response
#### Success Response (200)
- **ownerAddress** (string) - The owner's address.

#### Response Example
```json
{
  "ownerAddress": "0x123..."
}
```
```

--------------------------------

### WalrusFile Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_walrus.WalrusFile

Initializes a new instance of the WalrusFile class.

```APIDOC
## Constructor WalrusFile

### Description
Initializes a new instance of the WalrusFile class.

### Method
Constructor

### Endpoint
N/A

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```json
{
  "reader": "FileReader"
}
```

### Response
#### Success Response (200)
- **WalrusFile** (object) - An instance of the WalrusFile class.

#### Response Example
```json
{
  "instance": "WalrusFile"
}
```
```

--------------------------------

### Get Pool Deep Price Conversion

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Gets the DEEP price conversion for a given pool. This function takes a `poolKey` as input and returns a promise that resolves to an object indicating the deep price, either per base or per quote asset.

```typescript
async getPoolDeepPrice(
  poolKey: string,
): Promise<
  | {
      asset_is_base: true;
      deep_per_base: number;
      deep_per_quote?: undefined;
    }
  | {
      asset_is_base: false;
      deep_per_base?: undefined;
      deep_per_quote: number;
    },
>
```

--------------------------------

### Create Storage Transaction Example

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_walrus.WalrusClient

Demonstrates how to create a transaction to provision storage with specified size and epochs. This function is part of the client's transaction building capabilities.

```typescript
const tx = client.createStorageTransaction({ size: 1000, epochs: 3, owner: signer.toSuiAddress() });
```

--------------------------------

### Get BalanceManager ID

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.BalanceManagerContract

Retrieves the ID of the BalanceManager.

```APIDOC
## GET /balanceManager/id

### Description
Get the ID of the BalanceManager.

### Method
GET

### Endpoint
/balanceManager/id

### Parameters
#### Query Parameters
- **managerKey** (string) - Required - The key of the BalanceManager

### Response
#### Success Response (200)
- **managerId** (string) - The ID of the BalanceManager.

#### Response Example
```json
{
  "managerId": "someManagerId"
}
```
```

--------------------------------

### SuinsClient Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_suins.SuinsClient

Initializes a new instance of the SuinsClient class.

```APIDOC
## new SuinsClient(config: SuinsClientConfig): SuinsClient

### Description
Initializes a new instance of the SuinsClient class.

### Method
CONSTRUCTOR

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```json
{
  "config": "SuinsClientConfig object"
}
```

### Response
#### Success Response (200)
- **SuinsClient** (object) - An instance of the SuinsClient.

#### Response Example
```json
{
  "instance": "SuinsClient object"
}
```
```

--------------------------------

### Set up Sui dApp Kit Providers (React)

Source: https://sdk.mystenlabs.com/dapp-kit/legacy

Configures and wraps the application with necessary providers for Sui dApp Kit, including `QueryClientProvider`, `SuiClientProvider`, and `WalletProvider`. This setup is crucial for enabling network connectivity and wallet management within the dApp.

```jsx
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

### EnokiConnectWallet Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_enoki-connect.EnokiConnectWallet

Initializes a new EnokiConnectWallet instance. Requires dappName, hostOrigin, icon, network, publicAppSlug, and walletName. The icon can be a base64 encoded SVG, WEBP, PNG, or GIF.

```typescript
new EnokiConnectWallet({
  dappName: string;
  hostOrigin: string;
  icon: |
    `data:image/svg+xml;base64,${string}` |
    `data:image/webp;base64,${string}` |
    `data:image/png;base64,${string}` |
    `data:image/gif;base64,${string}`;
  network: SupportedNetwork;
  publicAppSlug: string;
  walletName: string;
})
```

--------------------------------

### DApp Kit Instance Configuration Options

Source: https://sdk.mystenlabs.com/dapp-kit/dapp-kit-instance

Detailed explanation of the parameters available when creating a DApp Kit instance, including network configuration, wallet management, and storage options.

```APIDOC
## DApp Kit Instance Parameters

### Parameters
#### Request Body Parameters
- **autoConnect** (boolean) - Optional - Enables automatically connecting to the most recently used wallet account (default: `true`).
- **networks** (string[]) - Required - A list of networks supported by the application (e.g. `['mainnet', 'testnet']`).
- **defaultNetwork** (string) - Optional - Initial network to use (default: first network in the array).
- **createClient** (function) - Required - A function that creates a new client instance for the given network.
- **enableBurnerWallet** (boolean) - Optional - Enable development-only burner wallet (default: `false`).
- **storage** (object | null) - Optional - Configures how the most recently connected to wallet account is stored (default: `localStorage`, set to `null` to disable).
- **storageKey** (string) - Optional - The key to use to store the most recently connected wallet account (default: `'mysten-dapp-kit:selected-wallet-and-address'`).
- **walletInitializers** (array) - Optional - A list of wallet initializers used for registering additional wallet standard wallets.
- **slushWalletConfig** (object | null) - Optional - Configuration for Slush wallet (set to `null` to disable the wallet).
```

--------------------------------

### GET /websites/sdk_mystenlabs/getMarginAccountOrderDetails

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves detailed information about all orders placed by a margin account.

```APIDOC
## GET /websites/sdk_mystenlabs/getMarginAccountOrderDetails

### Description
Get the details of all orders for a margin account.

### Method
GET

### Endpoint
/websites/sdk_mystenlabs/getMarginAccountOrderDetails

### Parameters
#### Query Parameters
- **marginManagerKey** (string) - Required - The key to identify the margin manager.

### Response
#### Success Response (200)
- **orders** (object[]) - An array of order details.
  - **balance_manager_id** (string) - The ID of the balance manager.
  - **client_order_id** (string) - The client-defined order ID.
  - **epoch** (string) - The epoch timestamp of the order.
  - **expire_timestamp** (string) - The expiration timestamp of the order.
  - **fee_is_deep** (boolean) - Whether the fee was paid in DEEP.
  - **filled_quantity** (string) - The quantity of the order that has been filled.
  - **order_deep_price** (object) - The price of the order in DEEP.
    - **asset_is_base** (boolean) - Whether the asset is the base asset.
    - **deep_per_asset** (string) - The price per asset in DEEP.
  - **order_id** (string) - The unique ID of the order.
  - **quantity** (string) - The total quantity of the order.
  - **status** (number) - The status of the order (e.g., 0 for open, 1 for filled, 2 for cancelled).

#### Response Example
```json
{
  "orders": [
    {
      "balance_manager_id": "bm_123",
      "client_order_id": "client_order_abc",
      "epoch": "1678886400",
      "expire_timestamp": "1678972800",
      "fee_is_deep": true,
      "filled_quantity": "50.0",
      "order_deep_price": {
        "asset_is_base": false,
        "deep_per_asset": "0.001"
      },
      "order_id": "order_xyz",
      "quantity": "100.0",
      "status": 0
    }
  ]
}
```
```

--------------------------------

### EnokiKeypair Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_enoki.EnokiKeypair

Initializes a new EnokiKeypair instance. This constructor requires detailed input including the address, an ephemeral keypair, maximum epoch, and a cryptographic proof object. The proof object contains essential elements for verifying the keypair's authenticity and integrity.

```typescript
new EnokiKeypair(
input: {
address: string;
ephemeralKeypair: Signer;
maxEpoch: number;
proof: {
addressSeed: string;
headerBase64: string;
issBase64Details: { indexMod4: number; value: string };
proofPoints: {
 a: Iterable<string, any, any> & { length: number };
 b: Iterable<Iterable<string, any, any> & { length: number }, any, any> & {
 length: number;
 };
 c: Iterable<string, any, any> & { length: number };
};
};
},
): EnokiKeypair
```

--------------------------------

### getRulePackageId

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_kiosk.KioskClient

A helper to get package IDs for supported rules.

```APIDOC
## POST /getRulePackageId

### Description
A convenient helper to get the packageIds for our supported ruleset, based on `kioskClient` configuration.

### Method
POST

### Endpoint
/getRulePackageId

### Parameters
#### Request Body
- **rule** (string) - Required - The rule to get the package ID for. Possible values: "kioskLockRulePackageId", "royaltyRulePackageId", "personalKioskRulePackageId", "floorPriceRulePackageId".

### Request Example
```json
{
  "rule": "kioskLockRulePackageId"
}
```

### Response
#### Success Response (200)
- **string | undefined** (string | undefined) - The package ID for the rule, or undefined if not found.

#### Response Example
```json
{
  "packageId": "0x123..."
}
```
```

--------------------------------

### Get Vault Balances

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Retrieves the vault balances for a given pool.

```APIDOC
## GET /vaultBalances

### Description
Get the vault balances for a pool.

### Method
GET

### Endpoint
/vaultBalances

### Parameters
#### Query Parameters
- **poolKey** (string) - Required - The key to identify the pool

### Response
#### Success Response (200)
- **tx** (Transaction) - A function that takes a Transaction object

#### Response Example
```json
{
  "tx": "(tx: Transaction) => void"
}
```
```

--------------------------------

### Initialize DAppKitProvider in React

Source: https://sdk.mystenlabs.com/dapp-kit/react/dapp-kit-provider

Demonstrates the basic setup of DAppKitProvider in a React application. This context provider makes the dApp Kit instance accessible to child components. It requires importing `dAppKit` and wrapping the application's main component.

```jsx
import { dAppKit } from './dapp-kit.ts';

export default function App() {
	return (
		<DAppKitProvider dAppKit={dAppKit}>
			<YourApp />
		</DAppKitProvider>
	);
}
```

--------------------------------

### Export and Persist Keypair

Source: https://sdk.mystenlabs.com/sui/cryptography/webcrypto-signer

Exports the keypair into a serializable object containing the public key and a reference to the private key. This object can then be persisted, for example, using IndexedDB. The example suggests using `idb-keyval` for simplified IndexedDB operations.

```typescript
// Get the exported keypair:
const exported = keypair.export();

// Write the keypair to IndexedDB.
// This method does not exist, you need to implement it yourself. We recommend `idb-keyval` for simplicity.
await writeToIndexedDB('keypair', exported);
```

--------------------------------

### Initialize GcpKmsSigner using Version Name

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_signers.gcp.GcpKmsSigner

Demonstrates how to create an instance of GcpKmsSigner by providing a version name. This method is a convenient way to set up the signer when the full GCP KMS resource name is known. It relies on environment variables for authentication.

```typescript
const signer = await GcpKmsSigner.fromVersionName(versionName);

```

--------------------------------

### GET /accountOpenOrders

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the list of open order IDs for a given account.

```APIDOC
## GET /accountOpenOrders

### Description
Get the open order IDs for a given account.

### Method
GET

### Endpoint
`/accountOpenOrders`

### Parameters
#### Query Parameters
- **poolKey** (string) - Required - Key of the pool.
- **managerKey** (string) - Required - Key of the balance manager.

### Response
#### Success Response (200)
- **string[]** - An array of open order IDs.

#### Response Example
```json
[
  "order123",
  "order456"
]
```
```

--------------------------------

### GET /websites/sdk_mystenlabs/getBaseQuantityOutInputFee

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Calculates the base quantity received when the input token is used to pay for fees.

```APIDOC
## GET /websites/sdk_mystenlabs/getBaseQuantityOutInputFee

### Description
Get the base quantity out using input token as fee.

### Method
GET

### Endpoint
/websites/sdk_mystenlabs/getBaseQuantityOutInputFee

### Parameters
#### Query Parameters
- **poolKey** (string) - Required - Key of the pool.
- **quoteQuantity** (number) - Required - Quote quantity.

### Response
#### Success Response (200)
- **baseOut** (number) - The amount of base asset received.
- **deepRequired** (number) - The amount of DEEP required for fees.
- **quoteOut** (number) - The effective quote quantity after fees.
- **quoteQuantity** (number) - The original quote quantity input.

#### Response Example
```json
{
  "baseOut": 99.5,
  "deepRequired": 5.0,
  "quoteOut": 94.5,
  "quoteQuantity": 100
}
```
```

--------------------------------

### Get Base Quantity In

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Calculates the base quantity required to obtain a target quote quantity in a pool.

```APIDOC
## Get Base Quantity In

### Description
Get the base quantity needed to receive a target quote quantity.

### Method
GET (Assumed, as it retrieves data)

### Endpoint
`/websites/sdk_mystenlabs/getBaseQuantityIn`

### Parameters
#### Path Parameters
None

#### Query Parameters
- **poolKey** (string) - Required - The key to identify the pool.
- **targetQuoteQuantity** (number) - Required - The target quantity of the quote asset.
- **payWithDeep** (boolean) - Required - Whether to pay fees with DEEP.

### Request Example
```
/websites/sdk_mystenlabs/getBaseQuantityIn?poolKey=0x123...&targetQuoteQuantity=100&payWithDeep=true
```

### Response
#### Success Response (200)
- **transactionResult** (TransactionResult) - The result of the transaction, containing the calculated base quantity.

#### Response Example
```json
{
  "transactionResult": {
    "effects": {
      "created": [],
      "mutated": [],
      "deleted": [],
      "unwrapped": [],
      "wrapped": [],
      "gas_used": 1000,
      "status": {
        "Ok": null
      }
    },
    "digest": "0xabc...",
    "events": []
  }
}
```
```

--------------------------------

### Install @mysten/bcs Package

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_bcs

This snippet shows how to add the @mysten/bcs package to your project using npm. It's a prerequisite for using the library's functionalities.

```bash
npm i @mysten/bcs
```

--------------------------------

### SuiGraphQLClientOptions Interface

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_sui.graphql.SuiGraphQLClientOptions

Defines the configuration options for initializing the Sui GraphQL client.

```APIDOC
## Interface SuiGraphQLClientOptions<Queries>

### Description
Defines the configuration options for initializing the Sui GraphQL client.

### Type Parameters
* `Queries` extends `Record<string, GraphQLDocument>`: A type representing the queries to be used with the client.

### Properties
#### `Optional` fetch
- **Type**: `(input: URL | RequestInfo, init?: RequestInit) => Promise<Response>` or `(input: string | URL | Request, init?: RequestInit) => Promise<Response>`
- **Description**: A custom fetch function to override the default fetch behavior. It can accept either `URL | RequestInfo` or `string | URL | Request` as input.

#### `Optional` headers
- **Type**: `Record<string, string>`
- **Description**: An object containing custom headers to be sent with each request.

#### `Optional` mvr
- **Type**: `MvrOptions`
- **Description**: Options related to Move Value Representation (MVR).

#### network
- **Type**: `Network`
- **Description**: The network configuration to connect to.

#### `Optional` queries
- **Type**: `Queries`
- **Description**: An object containing custom GraphQL queries to be used by the client.

#### url
- **Type**: `string`
- **Description**: The URL of the Sui GraphQL endpoint.
```

--------------------------------

### PoolProxyContract Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.PoolProxyContract

Initializes the PoolProxyContract with configuration.

```APIDOC
## Constructors

### constructor
  * new PoolProxyContract(config: DeepBookConfig): PoolProxyContract
#### Parameters
    * config: DeepBookConfig
Configuration for PoolProxyContract
#### Returns PoolProxyContract
```

--------------------------------

### Get Pool Quorum

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the quorum amount for a specific DeepBook pool.

```APIDOC
## GET /quorum

### Description
Get the quorum for a pool.

### Method
GET

### Endpoint
/quorum

### Parameters
#### Query Parameters
- **poolKey** (string) - Required - Key of the pool

### Response
#### Success Response (200)
- **quorum** (number) - The quorum amount in DEEP.

#### Response Example
```json
{
  "quorum": 5000
}
```
```

--------------------------------

### Configure DAppKitProvider with Custom Settings

Source: https://sdk.mystenlabs.com/dapp-kit/react/dapp-kit-provider

Shows how to create and configure a DAppKit instance with custom settings, including network configurations and gRPC client setup. This allows for tailored dApp Kit behavior, such as specifying networks, custom clients, auto-connection, and storage options. Global type registration is also included for hook compatibility.

```jsx
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

### BcsTuple Constructor and Usage in TypeScript

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_bcs.BcsTuple

Demonstrates how to instantiate and use the BcsTuple class in TypeScript. It shows the constructor signature and how to define a tuple with specific BCS types. This snippet highlights the type inference capabilities for input and output data structures.

```typescript
import { BcsTuple, BcsType, BcsReader, BcsWriterOptions, SerializedBcs } from '@mysten/bcs';

// Example Usage:
// Assuming BcsType<T, U, N> is defined elsewhere

// Define a tuple type with specific BCS types
const myTupleType = [
  new BcsType<number, number, 'u32'>('u32'),
  new BcsType<string, string, 'utf8'>('utf8'),
] as const;

// Instantiate BcsTuple
const myTuple = new BcsTuple<typeof myTupleType, 'myTuple'>(myTupleType, 'myTuple');

// Example of accessing properties and methods (conceptual)
// const inputData = { 0: 123, 1: 'hello' };
// const serialized = myTuple.serialize(inputData);
// const parsedData = myTuple.parse(serialized.bytes);

```

--------------------------------

### GET /websites/sdk_mystenlabs/getBaseMarginPoolId

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the base margin pool ID for a deepbook pool.

```APIDOC
## GET /websites/sdk_mystenlabs/getBaseMarginPoolId

### Description
Get the base margin pool ID for a deepbook pool.

### Method
GET

### Endpoint
/websites/sdk_mystenlabs/getBaseMarginPoolId

### Parameters
#### Query Parameters
- **poolKey** (string) - Required - The key to identify the pool.

### Response
#### Success Response (200)
- **baseMarginPoolId** (string) - The base margin pool ID.

#### Response Example
```json
{
  "baseMarginPoolId": "0xabcdef1234567890"
}
```
```

--------------------------------

### Get Next Epoch Pool Trade Parameters

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the trade parameters for the next epoch of a given DeepBook pool.

```APIDOC
## GET /poolTradeParamsNext

### Description
Get the next epoch trade parameters for a given pool.

### Method
GET

### Endpoint
/poolTradeParamsNext

### Parameters
#### Query Parameters
- **poolKey** (string) - Required - Key of the pool

### Response
#### Success Response (200)
- **makerFee** (number) - The maker fee for the next epoch.
- **stakeRequired** (number) - The stake required for the next epoch.
- **takerFee** (number) - The taker fee for the next epoch.

#### Response Example
```json
{
  "makerFee": 0.0015,
  "stakeRequired": 1200,
  "takerFee": 0.0025
}
```
```

--------------------------------

### DataLoader Constructor and Usage Example (TypeScript)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_utils.DataLoader

Demonstrates how to instantiate and use the DataLoader class. It takes a batch loading function and optional configuration. The DataLoader is useful for optimizing data fetching by batching requests and caching results.

```typescript
import DataLoader from '@mysten/utils/dist/DataLoader';

// Define a batch loading function
const batchLoadUsers = async (keys: string[]): Promise<User[]> => {
  // In a real application, fetch users from a database or API based on keys
  console.log('Batch loading users:', keys);
  const users = await fetchUsersByIds(keys);
  return keys.map(key => users.find(user => user.id === key) || new Error(`User with key ${key} not found`));
};

// Create a DataLoader instance
const userLoader = new DataLoader<string, User>(batchLoadUsers, {
  maxBatchSize: 10,
  cacheKeyFn: (key) => key // Default cache key function
});

// Example usage
const loadUser = async (userId: string) => {
  try {
    const user = await userLoader.load(userId);
    console.log(`Loaded user: ${user.name}`);
    return user;
  } catch (error) {
    console.error(`Error loading user ${userId}:`, error);
    return null;
  }
};

// Load multiple users
const loadUsers = async () => {
  const [userA, userB, userC] = await userLoader.loadMany(['user-a', 'user-b', 'user-c']);
  console.log('Loaded users:', userA, userB, userC);
};

// Prime the cache
userLoader.prime('user-d', { id: 'user-d', name: 'Preloaded User' });

// Clear cache for a specific key
userLoader.clear('user-a');

// Clear the entire cache
// userLoader.clearAll();

```

--------------------------------

### Request Media Key System Access with Navigator.requestMediaKeySystemAccess()

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_wallet-standard.DEPRECATED_WalletsNavigator

The requestMediaKeySystemAccess() method returns a Promise which delivers a MediaKeySystemAccess object. This object can be used to access a particular media key system, which can in turn be used to create keys for decrypting a media stream. It is available only in secure contexts.

```javascript
const keySystem = 'com.widevine.alpha';
const supportedConfigurations = [
  {
    initDataTypes: ['cenc'],
    audioCapabilities: [
      { contentType: 'audio/mp4;codecs="aac"'
      }
    ]
  }
];

navigator.requestMediaKeySystemAccess(keySystem, supportedConfigurations)
  .then(keySystemAccess => {
    console.log('Media key system access granted:', keySystemAccess);
  })
  .catch(error => {
    console.error('Media key system access denied:', error);
  });
```

--------------------------------

### GET /websites/sdk_mystenlabs/getReferralId

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the referral ID from a balance manager for a specific pool.

```APIDOC
## GET /websites/sdk_mystenlabs/getReferralId

### Description
Get the referral ID from a balance manager for a specific pool.

### Method
GET

### Endpoint
/websites/sdk_mystenlabs/getReferralId

### Parameters
#### Query Parameters
- **poolKey** (string) - Required - The key to identify the pool.

### Response
#### Success Response (200)
- **referralId** (string) - The referral ID.

#### Response Example
```json
{
  "referralId": "0x1234567890abcdef"
}
```
```

--------------------------------

### GET /websites/sdk_mystenlabs/getBaseQuantityIn

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Calculates the base quantity needed to receive a target quote quantity in a pool, with an option to pay fees with DEEP.

```APIDOC
## GET /websites/sdk_mystenlabs/getBaseQuantityIn

### Description
Get the base quantity needed to receive target quote quantity.

### Method
GET

### Endpoint
/websites/sdk_mystenlabs/getBaseQuantityIn

### Parameters
#### Query Parameters
- **poolKey** (string) - Required - Key of the pool.
- **targetQuoteQuantity** (number) - Required - Target quote quantity.
- **payWithDeep** (boolean) - Required - Whether to pay fees with DEEP.

### Response
#### Success Response (200)
- **baseIn** (number) - The base quantity required.
- **deepRequired** (number) - The amount of DEEP required for fees.
- **quoteOut** (number) - The actual quote quantity received after fees.

#### Response Example
```json
{
  "baseIn": 100.5,
  "deepRequired": 5.2,
  "quoteOut": 95.3
}
```
```

--------------------------------

### getStorageConfirmationFromNode

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_walrus.WalrusClient

Gets a storage confirmation from a storage node.

```APIDOC
## POST /storage/confirmation

### Description
Gets a storage confirmation from a storage node.

### Method
POST

### Endpoint
/storage/confirmation

### Parameters
#### Request Body
- **options** (GetStorageConfirmationOptions) - Required - Options for getting storage confirmation.
  - **nodeIndex** (number) - The index of the storage node.
  - **blobId** (string) - The ID of the blob.
  - **deletable** (boolean) - Whether the blob is deletable.
  - **objectId** (string) - The object ID of the blob.

### Response
#### Success Response (200)
- **confirmation** (StorageConfirmation) - The storage confirmation object.

#### Response Example
```json
{
  "confirmation": {
    "status": "confirmed",
    "timestamp": "2023-10-27T10:00:00Z"
  }
}
```
```

--------------------------------

### Get Reference Gas Price API

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.graphql.SuiGraphQLClient

Fetches the current reference gas price for the Sui network.

```APIDOC
## GET /reference-gas-price

### Description
Retrieves the current reference gas price on the Sui network.

### Method
GET

### Endpoint
/reference-gas-price

### Parameters
None

### Response
#### Success Response (200)
- **gasPrice** (string) - The current reference gas price.

#### Response Example
```json
{
  "gasPrice": "500000000"
}
```
```

--------------------------------

### Static SessionKey Methods

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_seal.SessionKey

Static methods for creating and importing SessionKey instances.

```APIDOC
## POST /sessionkey/static/create

### Description
Creates a new SessionKey instance. Requires user address details and a Sui client.

### Method
POST

### Endpoint
/sessionkey/static/create

### Parameters
#### Request Body
- **address** (object) - Required - An object containing user address details.
  - **address** (string) - Required - The user's address.
  - **mvrName** (string) - Optional - The MVR name.
  - **packageId** (string) - Required - The package ID.
  - **signer** (Signer) - Optional - The signer object.
  - **suiClient** (SealCompatibleClient) - Required - The Sui client instance.
  - **ttlMin** (number) - Required - The time-to-live in minutes.

### Request Example
```json
{
  "address": {
    "address": "0x123...",
    "packageId": "0xabc...",
    "suiClient": "...",
    "ttlMin": 60
  }
}
```

### Response
#### Success Response (200)
- **sessionKey** (SessionKey) - A new SessionKey instance.

#### Response Example
```json
{
  "sessionKey": {
    "address": "0x123..."
  }
}
```
```

```APIDOC
## POST /sessionkey/static/import

### Description
Restores a SessionKey instance from exported data. Requires the exported data and a Sui client.

### Method
POST

### Endpoint
/sessionkey/static/import

### Parameters
#### Request Body
- **data** (ExportedSessionKey) - Required - The exported session key data.
- **suiClient** (SealCompatibleClient) - Required - The Sui client instance.
- **signer** (Signer) - Optional - The signer object.

### Request Example
```json
{
  "data": {
    "key": "...",
    "signature": "..."
  },
  "suiClient": "..."
}
```

### Response
#### Success Response (200)
- **sessionKey** (SessionKey) - A new SessionKey instance with restored state.

#### Response Example
```json
{
  "sessionKey": {
    "address": "0x123..."
  }
}
```
```

--------------------------------

### Get Allowed Maintainers API

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves a list of all allowed maintainer capability IDs.

```APIDOC
## GET /websites/sdk_mystenlabs/getAllowedMaintainers

### Description
Get all allowed maintainer cap IDs.

### Method
GET

### Endpoint
/websites/sdk_mystenlabs/getAllowedMaintainers

### Response
#### Success Response (200)
- **maintainerIds** (string[]) - Array of allowed maintainer cap IDs

#### Response Example
```json
["maintainer1", "maintainer2"]
```
```

--------------------------------

### Reset Client Cache Example (TypeScript)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_walrus.WalrusClient

Demonstrates how to reset the client's cached data. This can be useful for ensuring that the client is working with fresh data.

```typescript
client.reset();
```

--------------------------------

### GET /websites/sdk_mystenlabs/getConditionalOrderIds

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves all conditional order IDs associated with a specific margin manager.

```APIDOC
## GET /websites/sdk_mystenlabs/getConditionalOrderIds

### Description
Get all conditional order IDs for a margin manager.

### Method
GET

### Endpoint
/websites/sdk_mystenlabs/getConditionalOrderIds

### Parameters
#### Query Parameters
- **marginManagerKey** (string) - Required - The key to identify the margin manager.

### Response
#### Success Response (200)
- **orderIds** (string[]) - An array of conditional order IDs.

#### Response Example
```json
{
  "orderIds": ["order_1", "order_2", "order_3"]
}
```
```

--------------------------------

### Get Multiple Orders

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Prepares a transaction to retrieve multiple orders from a specified pool using their IDs.

```APIDOC
## POST /websites/sdk_mystenlabs/getOrders

### Description
Prepares a transaction to retrieve multiple orders from a specified pool.

### Method
POST

### Endpoint
/websites/sdk_mystenlabs/getOrders

### Parameters
#### Request Body
- **poolKey** (string) - Required - The identifier key for the pool to retrieve orders from.
- **orderIds** (string[]) - Required - Array of order IDs to retrieve.

### Request Example
```json
{
  "poolKey": "string",
  "orderIds": [
    "string"
  ]
}
```

### Response
#### Success Response (200)
- **tx** (Transaction) - A Transaction object

#### Response Example
```json
{
  "tx": {}
}
```
```

--------------------------------

### Get Allowed Pause Caps API

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves a list of all allowed pause capability IDs.

```APIDOC
## GET /websites/sdk_mystenlabs/getAllowedPauseCaps

### Description
Get all allowed pause cap IDs.

### Method
GET

### Endpoint
/websites/sdk_mystenlabs/getAllowedPauseCaps

### Response
#### Success Response (200)
- **pauseCapIds** (string[]) - Array of allowed pause cap IDs

#### Response Example
```json
["pauseCap1", "pauseCap2"]
```
```

--------------------------------

### ClientCache.clear Method

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.client.ClientCache

Clears entries from the cache. Optionally, a prefix can be provided to clear only entries starting with that prefix.

```APIDOC
## Methods

### clear
  * clear(prefix?: string[]): void
#### Parameters
    * `Optional`prefix: string[]
#### Returns void
```

--------------------------------

### Get BalanceManager Referral

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.BalanceManagerContract

Retrieves the referral ID from the balance manager for a specific pool.

```APIDOC
## GET /balanceManager/referral

### Description
Get the referral ID from the balance manager for a specific pool.

### Method
GET

### Endpoint
/balanceManager/referral

### Parameters
#### Query Parameters
- **managerKey** (string) - Required - The name of the BalanceManager
- **poolKey** (string) - Required - Key of the pool to get the referral for

### Response
#### Success Response (200)
- **referralId** (string) - The referral ID for the specified pool.

#### Response Example
```json
{
  "referralId": "someReferralId"
}
```
```

--------------------------------

### Get Quantity Out for Conversion

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Calculates the output quantity when converting a given base or quote quantity within a pool.

```APIDOC
## POST /websites/sdk_mystenlabs/getQuantityOut

### Description
Get the quantity out for a given base or quote quantity.

### Method
POST

### Endpoint
/websites/sdk_mystenlabs/getQuantityOut

### Parameters
#### Request Body
- **poolKey** (string) - Required - The key to identify the pool
- **baseQuantity** (number) - Required - Base quantity to convert
- **quoteQuantity** (number) - Required - Quote quantity to convert

### Request Example
```json
{
  "poolKey": "string",
  "baseQuantity": 0,
  "quoteQuantity": 0
}
```

### Response
#### Success Response (200)
- **tx** (Transaction) - A Transaction object

#### Response Example
```json
{
  "tx": {}
}
```
```

--------------------------------

### Process Registry Payment Example

Source: https://sdk.mystenlabs.com/payment-kit/payment-processing

Demonstrates how to process a registry-based payment using the Payment Kit SDK. It includes defining payment parameters and attempting to process the payment twice to show duplicate prevention.

```typescript
// These parameters create a unique payment key
const paymentParams = {
	nonce: 'b5e88aec-d88e-4961-9204-6c84e0e1de4e',
	amount: 1000000000,
	receiver,
	coinType: '0x2::sui::SUI',
};

// If you try to process the same payment twice, it will fail
const tx1 = client.paymentKit.tx.processRegistryPayment({
	...paymentParams,
	sender: senderAddress,
	registryName: 'my-registry',
});

// This will fail - same payment key
const tx2 = client.paymentKit.tx.processRegistryPayment({
	...paymentParams,
	sender: senderAddress,
	registryName: 'my-registry',
});
```

--------------------------------

### Setup zkSend SDK Client Extension

Source: https://sdk.mystenlabs.com/zksend

Demonstrates how to set up a Sui client and extend it with the zkSend functionality. This involves importing necessary modules and configuring the client for a specific network.

```typescript
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { zksend } from '@mysten/zksend';

const client = new SuiGrpcClient({
	network: 'mainnet',
	baseUrl: 'https://fullnode.mainnet.sui.io:443',
}).$extend(zksend());
```

--------------------------------

### Get Referral Balances for a Pool

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Retrieves the balances associated with a specific referral within a given pool.

```APIDOC
## POST /websites/sdk_mystenlabs/getPoolReferralBalances

### Description
Get the balances for a referral (DeepBookPoolReferral).

### Method
POST

### Endpoint
/websites/sdk_mystenlabs/getPoolReferralBalances

### Parameters
#### Request Body
- **poolKey** (string) - Required - The key to identify the pool
- **referral** (string) - Required - The referral (DeepBookPoolReferral) to get the balances for

### Request Example
```json
{
  "poolKey": "string",
  "referral": "string"
}
```

### Response
#### Success Response (200)
- **tx** (Transaction) - A Transaction object
- **result** (TransactionResult) - The result of the transaction

#### Response Example
```json
{
  "tx": {},
  "result": {}
}
```
```

--------------------------------

### WalrusClient Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_walrus.WalrusClient

Initializes a new instance of the WalrusClient.

```APIDOC
## constructor WalrusClient

### Description
Initializes a new instance of the WalrusClient.

### Method
CONSTRUCTOR

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
* **config** (WalrusClientConfig) - Required - Configuration object for the WalrusClient.

### Request Example
```json
{
  "config": { ... } // WalrusClientConfig object
}
```

### Response
#### Success Response (200)
* **WalrusClient** - The newly created WalrusClient instance.

#### Response Example
```json
{
  "instance": "WalrusClient instance"
}
```
```

--------------------------------

### Get Base Quantity Out

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Calculates the base quantity that can be obtained by converting a given quote quantity in a pool.

```APIDOC
## Get Base Quantity Out

### Description
Get the base quantity out for a given quote quantity in.

### Method
GET (Assumed, as it retrieves data)

### Endpoint
`/websites/sdk_mystenlabs/getBaseQuantityOut`

### Parameters
#### Path Parameters
None

#### Query Parameters
- **poolKey** (string) - Required - The key to identify the pool.
- **quoteQuantity** (number) - Required - The quantity of the quote asset to convert.

### Request Example
```
/websites/sdk_mystenlabs/getBaseQuantityOut?poolKey=0x123...&quoteQuantity=50
```

### Response
#### Success Response (200)
- **void** - This function does not return a value upon successful execution, but the transaction result will contain the calculated base quantity.

#### Response Example
(No explicit return value, check transaction events or effects for the base quantity)
```

--------------------------------

### Write Blob Directly

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_walrus

This example demonstrates writing a blob directly using the `writeBlob` method. It takes a `Uint8Array` blob, specifies if it's deletable, the storage duration in epochs, and a signer. It returns the `blobId` of the written blob.

```javascript
const file = new TextEncoder().encode('Hello from the TS SDK!!!\n');

const { blobId } = await client.walrus.writeBlob({
	blob: file,
	deletable: false,
	epochs: 3,
	signer: keypair,
});

```

--------------------------------

### Create Blob Registration Transaction Example (TypeScript)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_walrus.WalrusClient

Illustrates how to create a standalone transaction for registering a blob. This is useful when you need a transaction object specifically for blob registration.

```typescript
const tx = client.registerBlobTransaction({ size: 1000, epochs: 3, blobId, rootHash, deletable: true });
```

--------------------------------

### Create New Margin Manager with Initializer

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginManagerContract

Creates a new margin manager and allows for initial deposit parameters to be set within the same transaction.

```APIDOC
## POST /websites/sdk_mystenlabs/newMarginManagerWithInitializer

### Description
Create a new margin manager with an initializer.

### Method
POST

### Endpoint
/websites/sdk_mystenlabs/newMarginManagerWithInitializer

### Parameters
#### Request Body
- **poolKey** (string) - Required - The key to identify the pool.

### Request Example
```json
{
  "poolKey": "pool_abc"
}
```

### Response
#### Success Response (200)
- **tx** (Transaction) - A Transaction object representing the operation.
- **initializer** (object) - Details about the initializer.
  - **$kind** (string) - "NestedResult"
  - **NestedResult** (array) - Contains two numbers [number, number].
- **manager** (object) - Details about the created manager.
  - **$kind** (string) - "NestedResult"
  - **NestedResult** (array) - Contains two numbers [number, number].

#### Response Example
```json
{
  "tx": "TransactionObject",
  "initializer": {
    "$kind": "NestedResult",
    "NestedResult": [1, 0]
  },
  "manager": {
    "$kind": "NestedResult",
    "NestedResult": [0, 1]
  }
}
```
```

--------------------------------

### Execute Certify Blob Transaction Example

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_walrus.WalrusClient

Demonstrates executing a transaction to certify a blob. This involves providing the blob ID, object ID, confirmation details, and a signer.

```typescript
const { digest } = await client.executeCertifyBlobTransaction({ blobId, blobObjectId, confirmations, signer });
```

--------------------------------

### Get a Specific Order

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Retrieves details for a specific order using its ID within a given pool.

```APIDOC
## POST /websites/sdk_mystenlabs/getOrder

### Description
Gets an order.

### Method
POST

### Endpoint
/websites/sdk_mystenlabs/getOrder

### Parameters
#### Request Body
- **poolKey** (string) - Required - The key to identify the pool
- **orderId** (string) - Required - Order ID to get

### Request Example
```json
{
  "poolKey": "string",
  "orderId": "string"
}
```

### Response
#### Success Response (200)
- **tx** (Transaction) - A Transaction object

#### Response Example
```json
{
  "tx": {}
}
```
```

--------------------------------

### Create New Pyth Configuration (TypeScript)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginAdminContract

Creates a new Pyth configuration for a given set of coin setups and a maximum age. This function returns a transaction builder that accepts a Transaction object and returns a TransactionResult.

```typescript
newPythConfig(
  coinSetups: {
    coinKey: string;
    maxConfBps: number;
    maxEwmaDifferenceBps: number;
  }[],
  maxAgeSeconds: number,
): (tx: Transaction) => TransactionResult
```

--------------------------------

### Get Balance Manager IDs

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Retrieves all balance manager IDs associated with a given owner address.

```APIDOC
## Get Balance Manager IDs

### Description
Get the balance manager IDs for a given owner.

### Method
GET (Assumed, as it retrieves data)

### Endpoint
`/websites/sdk_mystenlabs/getBalanceManagerIds`

### Parameters
#### Path Parameters
None

#### Query Parameters
- **owner** (string) - Required - The owner address to get balance manager IDs for.

### Request Example
```
/websites/sdk_mystenlabs/getBalanceManagerIds?owner=0xownerAddress...
```

### Response
#### Success Response (200)
- **void** - This function does not return a value upon successful execution, but the transaction result will contain the IDs.

#### Response Example
(No explicit return value, check transaction events or effects for balance manager IDs)
```

--------------------------------

### Get All Allowed Pause Caps

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Fetches a list of all allowed pause capability IDs. This function does not require any parameters.

```typescript
getAllowedPauseCaps(): Promise<string[]>
```

--------------------------------

### Get Target Liquidation Risk Ratio (SDK)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the target liquidation risk ratio for a deepbook pool. This value is crucial for risk management and understanding the conditions under which a position might be liquidated. It takes the pool key as input and returns the ratio as a decimal.

```typescript
getTargetLiquidationRiskRatio(poolKey: string): Promise<number>
```

--------------------------------

### Get All Allowed Maintainer Caps

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves a list of all allowed maintainer capability IDs. This function does not require any parameters.

```typescript
getAllowedMaintainers(): Promise<string[]>
```

--------------------------------

### percentageToBasisPoints Function

Source: https://sdk.mystenlabs.com/typedoc/functions/_mysten_kiosk.percentageToBasisPoints

Converts a percentage value, including decimals up to two places, into basis points. For example, 9.95 is converted to 995.

```APIDOC
## Function percentageToBasisPoints

### Description
Converts a number to basis points. Supports up to 2 decimal points. E.g 9.95 -> 995

### Method
N/A (This is a client-side function, not an API endpoint)

### Endpoint
N/A

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```javascript
// Example usage:
const percentage = 9.95;
const basisPoints = percentageToBasisPoints(percentage);
console.log(basisPoints); // Output: 995
```

### Response
#### Success Response
- **basisPoints** (number) - The converted value in basis points.

#### Response Example
```json
995
```
```

--------------------------------

### Scaffold a Sui dApp with @mysten/create-dapp

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/create-dapp

Use this command to initiate the creation of a new Sui dApp project. The CLI will guide you through template selection and project naming, setting up a ready-to-run project with best practices.

```bash
npm create @mysten/dapp
```

--------------------------------

### Get Balance Manager Referral ID

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.BalanceManagerContract

Retrieves the referral ID associated with a BalanceManager and pool.

```APIDOC
## GET /getBalanceManagerReferralId

### Description
Get the referral ID associated with a BalanceManager and pool.

### Method
GET

### Endpoint
/getBalanceManagerReferralId

### Parameters
#### Path Parameters
N/A

#### Query Parameters
- **managerKey** (string) - Required - The key of the BalanceManager.
- **poolKey** (string) - Required - The key of the pool.

#### Request Body
N/A

### Request Example
```json
{
  "managerKey": "string",
  "poolKey": "string"
}
```

### Response
#### Success Response (200)
- **tx** (Transaction) - A function that takes a Transaction object.
- **result** (TransactionResult) - The result of the transaction.

#### Response Example
```json
{
  "tx": "Transaction Function",
  "result": "TransactionResult"
}
```
```

--------------------------------

### SealClient Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_seal.SealClient

Initializes a new instance of the SealClient with the provided options.

```APIDOC
## constructor SealClient

### Description
Initializes a new instance of the SealClient.

### Method
constructor

### Endpoint
N/A

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
* **options** (SealClientOptions) - Required - Options for the SealClient.

### Request Example
```json
{
  "options": { ... } 
}
```

### Response
#### Success Response (200)
* **SealClient** - The initialized SealClient instance.

#### Response Example
```json
{
  "instance": "SealClient object"
}
```
```

--------------------------------

### Initialize zkSend Client and Build Link

Source: https://sdk.mystenlabs.com/zksend/link-builder

Initializes the Sui gRPC client and extends it with the zkSend functionality. It then demonstrates how to start building a zkSend link by calling the `linkBuilder` method with a sender address.

```typescript
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { zksend } from '@mysten/zksend';

const client = new SuiGrpcClient({
	network: 'mainnet',
	baseUrl: 'https://fullnode.mainnet.sui.io:443',
}).$extend(zksend());

const link = client.zksend.linkBuilder({
	sender: '0x...',
});
```

--------------------------------

### Place and List Item to Kiosk (Sui SDK V1)

Source: https://sdk.mystenlabs.com/kiosk/from-v1

This code snippet demonstrates how to place an item into a kiosk and list it for sale using the older Kiosk SDK V1. It requires importing specific functions and initializing a Transaction object.

```typescript
import { placeAndList } from '@mysten/kiosk';
import { Transaction } from '@mysten/sui/transactions';

const placeAndListToKiosk = async () => {
	const kiosk = 'SomeKioskId';
	const kioskCap = 'KioskCapObjectId';
	const itemType = '0xItemAddr::some:ItemType';
	const item = 'SomeItemId';
	const price = '100000';

	const tx = new Transaction();

	placeAndList(tx, itemType, kiosk, kioskCap, item, price);

	// ... continue to sign and execute the transaction
	// ...
};

```

--------------------------------

### Get Margin Manager IDs for Owner

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves a list of all margin manager IDs associated with a given owner address.

```APIDOC
## GET /margin-manager/ids-for-owner

### Description
Get the margin manager IDs for a given owner address.

### Method
GET

### Endpoint
/margin-manager/ids-for-owner

### Parameters
#### Query Parameters
- **owner** (string) - Required - The owner address

### Response
#### Success Response (200)
- (string[]) - An array of margin manager IDs.

#### Response Example
```json
[
  "0x111...",
  "0x222..."
]
```
```

--------------------------------

### Extend Sui Client with Custom SDK Functionality

Source: https://sdk.mystenlabs.com/sui/sdk-building

This example demonstrates how to extend a Sui client (e.g., `SuiGrpcClient`) with a custom SDK (e.g., `mySDK`). The `$extend` method is used to integrate the SDK, allowing access to its custom methods like `getResource`.

```typescript
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { mySDK } from '@your-org/your-sdk';

const client = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
}).$extend(mySDK());

// Access your extension
await client.mySDK.getResource('0x...');

```

--------------------------------

### Capture Stack Trace Example

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.ResourceNotFoundError

Demonstrates how to use Error.captureStackTrace to create a .stack property on an object. This allows for custom stack trace generation, optionally omitting frames above a specified constructor.

```javascript
const myObject = {};
Error.captureStackTrace(myObject);
console.log(myObject.stack);
```

```javascript
function a() {
  b();
}

function b() {
  c();
}

function c() {
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;
  Error.captureStackTrace(error, b);
  throw error;
}

a();
```

--------------------------------

### PaymentKitClient Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_payment-kit.PaymentKitClient

Initializes a new instance of the PaymentKitClient.

```APIDOC
## Constructor PaymentKitClient

### Description
Initializes a new instance of the PaymentKitClient.

### Method
CONSTRUCTOR

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```javascript
const client = new PaymentKitClient(options);
```

### Response
#### Success Response (200)
N/A (Constructor)

#### Response Example
N/A (Constructor)
```

--------------------------------

### Get Account Order Details

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Retrieves order details for a specific account's balance manager within a pool.

```APIDOC
## Get Account Order Details

### Description
Get account order details for a balance manager.

### Method
GET (Assumed, as it retrieves data)

### Endpoint
`/websites/sdk_mystenlabs/getAccountOrderDetails`

### Parameters
#### Path Parameters
None

#### Query Parameters
- **poolKey** (string) - Required - The key to identify the pool.
- **managerKey** (string) - Required - Key of the balance manager.

### Request Example
```
/websites/sdk_mystenlabs/getAccountOrderDetails?poolKey=0x123...&managerKey=0x789...
```

### Response
#### Success Response (200)
- **transactionResult** (TransactionResult) - The result of the transaction, containing order details.

#### Response Example
```json
{
  "transactionResult": {
    "effects": {
      "created": [],
      "mutated": [],
      "deleted": [],
      "unwrapped": [],
      "wrapped": [],
      "gas_used": 1000,
      "status": {
        "Ok": null
      }
    },
    "digest": "0xabc...",
    "events": []
  }
}
```
```

--------------------------------

### Get Reference Gas Price

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.graphql.SuiGraphQLClient

Fetches the current reference gas price from the Sui network. This is a simple, non-parameterized asynchronous operation.

```typescript
getReferenceGasPrice(): Promise<GetReferenceGasPriceResponse>
```

--------------------------------

### Set up Kiosk Extension for Testnet/Mainnet with SuiJsonRpcClient

Source: https://sdk.mystenlabs.com/kiosk/kiosk-client/introduction

This code snippet demonstrates how to extend a SuiJsonRpcClient with the Kiosk extension for use on 'mainnet' or 'testnet'. It requires importing 'kiosk' from '@mysten/kiosk' and Sui RPC client utilities. The client instance can then be used for all Kiosk operations.

```typescript
import { kiosk } from '@mysten/kiosk';
import { getJsonRpcFullnodeUrl, SuiJsonRpcClient } from '@mysten/sui/jsonRpc';

const client = new SuiJsonRpcClient({
	url: getJsonRpcFullnodeUrl('testnet'),
	network: 'testnet',
}).$extend(kiosk());

// Now you can use client.kiosk for all kiosk operations
const { kioskOwnerCaps } = await client.kiosk.getOwnedKiosks({ address: '0x...' });
```

--------------------------------

### Error.captureStackTrace with Constructor Option Example

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_seal.GeneralError

Demonstrates how to use the optional `constructorOpt` argument in `Error.captureStackTrace()` to omit frames from the stack trace, effectively hiding implementation details.

```javascript
function a() {
  b();
}

function b() {
  c();
}

function c() {
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  Error.captureStackTrace(error, b); 
  throw error;
}

a();
```

--------------------------------

### Get Base Quantity Out With Input Fee

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Calculates the base quantity that can be obtained by converting a given quote quantity, considering input fees.

```APIDOC
## Get Base Quantity Out With Input Fee

### Description
Get the base quantity out for a given quote quantity, considering input fees.

### Method
GET (Assumed, as it retrieves data)

### Endpoint
`/websites/sdk_mystenlabs/getBaseQuantityOutInputFee`

### Parameters
#### Path Parameters
None

#### Query Parameters
- **poolKey** (string) - Required - The key to identify the pool.
- **quoteQuantity** (number) - Required - The quantity of the quote asset to convert.

### Request Example
```
/websites/sdk_mystenlabs/getBaseQuantityOutInputFee?poolKey=0x123...&quoteQuantity=50
```

### Response
#### Success Response (200)
- **transactionResult** (TransactionResult) - The result of the transaction, containing the calculated base quantity after fees.

#### Response Example
```json
{
  "transactionResult": {
    "effects": {
      "created": [],
      "mutated": [],
      "deleted": [],
      "unwrapped": [],
      "wrapped": [],
      "gas_used": 1000,
      "status": {
        "Ok": null
      }
    },
    "digest": "0xabc...",
    "events": []
  }
}
```
```

--------------------------------

### Get Margin Manager Borrowed Shares

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the borrowed shares for both base and quote assets for a given margin manager.

```APIDOC
## GET /margin-manager/borrowed-shares

### Description
Get borrowed shares for both base and quote assets.

### Method
GET

### Endpoint
/margin-manager/borrowed-shares

### Parameters
#### Query Parameters
- **marginManagerKey** (string) - Required - The key to identify the margin manager

### Response
#### Success Response (200)
- **baseShares** (string) - The borrowed base shares.
- **quoteShares** (string) - The borrowed quote shares.

#### Response Example
```json
{
  "baseShares": "50.2",
  "quoteShares": "75.8"
}
```
```

--------------------------------

### Configure dApp Kit Instance in React

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/react

Set up a dApp Kit instance by creating a configuration file. This involves importing necessary modules from '@mysten/dapp-kit-react' and '@mysten/sui/grpc', defining network URLs, and creating the dApp Kit instance with specified networks and a client creation function. It also includes type augmentation for hook inference.

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

### Get Epochs

Source: https://sdk.mystenlabs.com/typedoc/functions/_mysten_dapp-kit.useSuiClientQueries

Retrieves a list of epochs, with options for ordering and pagination. Accepts `PaginationArguments`, `descendingOrder`, and `AbortSignal`.

```typescript
{
  method: "getEpochs",
  options?: UseSuiClientQueryOptions<"getEpochs", unknown>;
  params: { descendingOrder?: boolean; signal?: AbortSignal } & PaginationArguments<
    string
    | null,
  >;
}
```

--------------------------------

### React Integration with dApp Kit and Enoki

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_enoki

Demonstrates integrating Enoki with React and dApp Kit, including wallet registration and using the `useEnokiFlow` hook for initiating the login process with a specified provider.

```javascript
import { registerEnokiWallets } from '@mysten/enoki';
import { useEnokiFlow } from '@mysten/enoki/react';

// In your app setup
registerEnokiWallets({
	apiKey: 'your-enoki-api-key',
	providers: ['google'],
});

// In your component
function LoginButton() {
	const { login } = useEnokiFlow();

	return <button onClick={() => login('google')}>Sign in with Google</button>;
}
```

--------------------------------

### Get Margin Manager Borrowed Quote Shares

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the number of borrowed shares for the quote asset of a margin manager.

```APIDOC
## GET /margin-manager/borrowed-quote-shares

### Description
Get borrowed quote shares.

### Method
GET

### Endpoint
/margin-manager/borrowed-quote-shares

### Parameters
#### Query Parameters
- **marginManagerKey** (string) - Required - The key to identify the margin manager

### Response
#### Success Response (200)
- (string) - The borrowed quote shares.

#### Response Example
```json
"75.8"
```
```

--------------------------------

### GET /getReferenceGasPrice

Source: https://sdk.mystenlabs.com/sui/clients/core

Retrieves the current reference gas price for the network.

```APIDOC
## GET /getReferenceGasPrice

### Description
Get the current reference gas price.

### Method
GET

### Endpoint
/getReferenceGasPrice

### Response
#### Success Response (200)
- **referenceGasPrice** (bigint) - The current reference gas price.

#### Response Example
```json
{
  "referenceGasPrice": 1000n
}
```
```

--------------------------------

### BCS Type Definitions

Source: https://sdk.mystenlabs.com/typedoc/variables/_mysten_bcs.bcs

This section provides documentation for various BCS type constructors, explaining their purpose, parameters, and providing usage examples.

```APIDOC
## Fixed Array

### Description
Creates a BcsType that represents a fixed length array of a given type.

### Method
`bcs.fixedArray(size: number, type: BcsType, options?: BcsTypeOptions): BcsType<Array, Iterable & { length: number }, Name>

### Parameters
#### Path Parameters
- **size** (number) - Required - The number of elements in the array.
- **type** (BcsType) - Required - The BcsType of each element in the array.
- **options** (BcsTypeOptions) - Optional - Configuration options for the BcsType.

### Request Example
```typescript
bcs.fixedArray(3, bcs.u8()).serialize([1, 2, 3]).toBytes()
```

### Response
#### Success Response (200)
- **Uint8Array** - The serialized byte array.

#### Response Example
```json
[ 1, 2, 3 ]
```

## Map

### Description
Creates a BcsType representing a map of a given key and value type.

### Method
`bcs.map<K extends BcsType, V extends BcsType>(keyType: K, valueType: V): BcsType<Map<InferBcsType<K>, InferBcsType<V>>, Map<InferBcsInput<K>, InferBcsInput<V>>, `Map<${K["name"]}, ${V["name"]}>`>

### Parameters
#### Path Parameters
- **keyType** (BcsType) - Required - The BcsType of the key.
- **valueType** (BcsType) - Required - The BcsType of the value.

### Request Example
```typescript
const map = bcs.map(bcs.u8(), bcs.string())
map.serialize(new Map([[2, 'a']])).toBytes()
```

### Response
#### Success Response (200)
- **Uint8Array** - The serialized map.

#### Response Example
```json
[ 1, 2, 1, 97 ]
```

## Option

### Description
Creates a BcsType representing an optional value.

### Method
`bcs.option<T extends BcsType>(type: T): BcsType<InferBcsType<T> | null, InferBcsInput<T> | null | undefined, `Option<${T["name"]}>`>

### Parameters
#### Path Parameters
- **type** (BcsType) - Required - The BcsType of the optional value.

### Request Example
```typescript
bcs.option(bcs.u8()).serialize(null).toBytes()
bcs.option(bcs.u8()).serialize(1).toBytes()
```

### Response
#### Success Response (200)
- **Uint8Array** - The serialized optional value.

#### Response Example
```json
[ 0 ] // for null
[ 1, 1 ] // for value 1
```

## Vector

### Description
Creates a BcsType representing a variable length vector of a given type.

### Method
`bcs.vector<T extends BcsType>(type: T, options?: BcsTypeOptions): BcsType<InferBcsType<T>[], Iterable<InferBcsInput<T>, any, any> & { length: number }, Name>

### Parameters
#### Path Parameters
- **type** (BcsType) - Required - The BcsType of each element in the vector.
- **options** (BcsTypeOptions) - Optional - Configuration options for the BcsType.

### Request Example
```typescript
bcs.vector(bcs.u8()).toBytes([1, 2, 3])
```

### Response
#### Success Response (200)
- **Uint8Array** - The serialized vector.

#### Response Example
```json
[ 3, 1, 2, 3 ]
```

## Bool

### Description
Creates a BcsType that can be used to read and write boolean values.

### Method
`bcs.bool(options?: BcsTypeOptions<boolean, boolean, string>): BcsType<boolean, boolean, "bool">

### Parameters
#### Path Parameters
- **options** (BcsTypeOptions) - Optional - Configuration options for the BcsType.

### Request Example
```typescript
bcs.bool().serialize(true).toBytes()
```

### Response
#### Success Response (200)
- **Uint8Array** - The serialized boolean value.

#### Response Example
```json
[ 1 ] // for true
```

## Bytes

### Description
Creates a BcsType representing a fixed length byte array.

### Method
`bcs.bytes<T extends number>(size: T, options?: BcsTypeOptions): BcsType<Uint8Array, Iterable<number, any, any>, `bytes[${T}]`>

### Parameters
#### Path Parameters
- **size** (number) - Required - The number of bytes this type represents.
- **options** (BcsTypeOptions) - Optional - Configuration options for the BcsType.

### Request Example
```typescript
bcs.bytes(3).serialize(new Uint8Array([1, 2, 3])).toBytes()
```

### Response
#### Success Response (200)
- **Uint8Array** - The serialized byte array.

#### Response Example
```json
[ 1, 2, 3 ]
```

## Byte Vector

### Description
Creates a BcsType representing a variable length byte array.

### Method
`bcs.byteVector(options?: BcsTypeOptions<Uint8Array, Iterable<number, any, any>, string>): BcsType<Uint8Array, Iterable<number, any, any>, "vector<u8>">

### Parameters
#### Path Parameters
- **options** (BcsTypeOptions) - Optional - Configuration options for the BcsType.

### Request Example
```typescript
bcs.byteVector().serialize(new Uint8Array([1, 2, 3])).toBytes()
```

### Response
#### Success Response (200)
- **Uint8Array** - The serialized byte array.

#### Response Example
```json
[ 1, 2, 3 ]
```
```

--------------------------------

### MarginTPSLContract Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginTPSLContract

Initializes a new instance of the MarginTPSLContract class.

```APIDOC
## Constructor MarginTPSLContract

### Description
Initializes a new instance of the MarginTPSLContract class.

### Method
constructor

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
* **config** (DeepBookConfig) - Required - Configuration for MarginTPSLContract

### Request Example
```json
{
  "config": { ... } 
}
```

### Response
#### Success Response (200)
* **MarginTPSLContract** - An instance of the MarginTPSLContract class.

#### Response Example
```json
{
  "instance": "MarginTPSLContract"
}
```
```

--------------------------------

### Get Pool Vault Balances

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the vault balances for a specific DeepBook pool, including base, deep, and quote balances.

```APIDOC
## GET /vaultBalances

### Description
Get the vault balances for a pool.

### Method
GET

### Endpoint
/vaultBalances

### Parameters
#### Query Parameters
- **poolKey** (string) - Required - Key of the pool

### Response
#### Success Response (200)
- **base** (number) - The base balance in the vault.
- **deep** (number) - The deep balance in the vault.
- **quote** (number) - The quote balance in the vault.

#### Response Example
```json
{
  "base": 10000,
  "deep": 5000,
  "quote": 20000
}
```
```

--------------------------------

### Get Margin Manager Borrowed Base Shares

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the number of borrowed shares for the base asset of a margin manager.

```APIDOC
## GET /margin-manager/borrowed-base-shares

### Description
Get borrowed base shares.

### Method
GET

### Endpoint
/margin-manager/borrowed-base-shares

### Parameters
#### Query Parameters
- **marginManagerKey** (string) - Required - The key to identify the margin manager

### Response
#### Success Response (200)
- (string) - The borrowed base shares.

#### Response Example
```json
"50.2"
```
```

--------------------------------

### Low-level Enoki Client for Sponsored Transactions

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_enoki

Shows how to use the `EnokiClient` for low-level operations, specifically creating and executing sponsored transactions. This requires network, sender, and transaction details.

```javascript
import { EnokiClient } from '@mysten/enoki';

const client = new EnokiClient({
	apiKey: 'your-enoki-api-key',
});

// Create a sponsored transaction
const sponsored = await client.createSponsoredTransaction({
	network: 'mainnet',
	sender: '0x...',
	transactionKindBytes: '...',
});

// Execute it
await client.executeSponsoredTransaction({
	digest: sponsored.digest,
	signature: '...',
});
```

--------------------------------

### Get Pool ID by Asset Types

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Finds the unique pool ID based on the types of the base and quote assets.

```APIDOC
## POST /websites/sdk_mystenlabs/getPoolIdByAssets

### Description
Get the pool ID by asset types.

### Method
POST

### Endpoint
/websites/sdk_mystenlabs/getPoolIdByAssets

### Parameters
#### Request Body
- **baseType** (string) - Required - Type of the base asset
- **quoteType** (string) - Required - Type of the quote asset

### Request Example
```json
{
  "baseType": "string",
  "quoteType": "string"
}
```

### Response
#### Success Response (200)
- **tx** (Transaction) - A Transaction object

#### Response Example
```json
{
  "tx": {}
}
```
```

--------------------------------

### BalanceManagerContract Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.BalanceManagerContract

Initializes a new instance of the BalanceManagerContract with the provided configuration.

```APIDOC
## BalanceManagerContract Constructor

### Description
Initializes a new instance of the BalanceManagerContract with the provided configuration.

### Method
CONSTRUCTOR

### Endpoint
N/A

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
N/A

### Request Example
```json
{
  "config": "DeepBookConfig"
}
```

### Response
#### Success Response (200)
- **BalanceManagerContract** (object) - An instance of the BalanceManagerContract.

#### Response Example
```json
{
  "instance": "BalanceManagerContract"
}
```
```

--------------------------------

### Get Transaction API

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.graphql.SuiGraphQLClient

Retrieves details of a specific transaction by its ID. Supports including transaction effects and events.

```APIDOC
## GET /transactions/{digest}

### Description
Fetches the details of a specific transaction using its digest.

### Method
GET

### Endpoint
/transactions/{digest}

### Parameters
#### Path Parameters
- **digest** (string) - Required - The digest of the transaction to retrieve.

#### Query Parameters
- **options** (GetTransactionOptions<Include>) - Optional - Options to include transaction effects and events.

### Response
#### Success Response (200)
- **digest** (string) - The transaction digest.
- **data** (TransactionData) - The transaction data.
- **effects** (TransactionEffects | null) - The transaction effects, if requested.
- **events** (SuiEvent[] | null) - The transaction events, if requested.

#### Response Example
```json
{
  "digest": "Ejx...",
  "data": {
    "transaction": {
      "kind": "moveCall",
      "packageId": "0x2",
      "module": "sui",
      "function": "transfer",
      "typeArguments": [],
      "arguments": [
        "0x456...",
        "0x789...",
        "1000"
      ]
    },
    "sender": "0x123...",
    "gasData": {
      "gasPrice": "500000000",
      "budget": "1000000",
      "owner": "0x123..."
    }
  },
  "effects": {
    "status": {
      "}
    },
    "gasUsed": "500000"
  },
  "events": []
}
```
```

--------------------------------

### newPoolConfigWithLeverage

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginAdminContract

Creates a new pool configuration with leverage.

```APIDOC
## POST /newPoolConfigWithLeverage

### Description
Create a new pool config with leverage.

### Method
POST

### Endpoint
/newPoolConfigWithLeverage

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **poolKey** (string) - Required - The key to identify the pool
- **leverage** (number) - Required - The leverage for the pool

### Request Example
```json
{
  "poolKey": "string",
  "leverage": 10
}
```

### Response
#### Success Response (200)
- **tx** (Transaction) - A function that takes a Transaction object.

#### Response Example
```json
{
  "tx": "(tx: Transaction) => void"
}
```
```

--------------------------------

### Accessing dApp Kit Properties (JavaScript)

Source: https://sdk.mystenlabs.com/dapp-kit/state

Demonstrates how to access direct properties of the dApp Kit instance, such as the list of available networks and how to get a client instance for a specific network or the current network.

```javascript
// Get available networks (not a store, just a property)
const networks = dAppKit.networks; // ['mainnet', 'testnet', ...]

// Get client for specific network
const mainnetClient = dAppKit.getClient('mainnet');
const currentClient = dAppKit.getClient(); // Current network's client
```

--------------------------------

### GET /websites/sdk_mystenlabs/getLowestTriggerAbovePrice

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the lowest trigger price for 'trigger_above' orders within a margin manager. Returns MAX_U64 if no such orders exist.

```APIDOC
## GET /websites/sdk_mystenlabs/getLowestTriggerAbovePrice

### Description
Get the lowest trigger price for trigger_above orders. Returns MAX_U64 if there are no trigger_above orders.

### Method
GET

### Endpoint
/websites/sdk_mystenlabs/getLowestTriggerAbovePrice

### Parameters
#### Query Parameters
- **marginManagerKey** (string) - Required - The key to identify the margin manager.

### Response
#### Success Response (200)
- **lowestTriggerPrice** (bigint) - The lowest trigger price.

#### Response Example
```json
{
  "lowestTriggerPrice": "18446744073709551615"
}
```
```

--------------------------------

### GET /websites/sdk_mystenlabs/getHighestTriggerBelowPrice

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the highest trigger price for 'trigger_below' orders within a margin manager. Returns 0 if no such orders exist.

```APIDOC
## GET /websites/sdk_mystenlabs/getHighestTriggerBelowPrice

### Description
Get the highest trigger price for trigger_below orders. Returns 0 if there are no trigger_below orders.

### Method
GET

### Endpoint
/websites/sdk_mystenlabs/getHighestTriggerBelowPrice

### Parameters
#### Query Parameters
- **marginManagerKey** (string) - Required - The key to identify the margin manager.

### Response
#### Success Response (200)
- **highestTriggerPrice** (bigint) - The highest trigger price.

#### Response Example
```json
{
  "highestTriggerPrice": "150000000000000000000000000000000000000"
}
```
```

--------------------------------

### Mix two Bullsharks using Kiosk SDK

Source: https://sdk.mystenlabs.com/kiosk/advanced-examples

Demonstrates mixing two 'Bullshark' SuiFrens using the Kiosk SDK. It borrows both items, calls the mix function, and then returns the borrowed items. Requires '@mysten/kiosk' and '@mysten/sui' packages.

```typescript
// We're mixing two frens.
async function mixFrens(firstFrenObjectId: string, secondFrenObjectId: string, cap: KioskOwnerCap) {
	const tx = new Transaction();
	const kioskTx = new KioskTransaction({ transaction: tx, kioskClient: client.kiosk, cap });

	// borrow both frens.
	const [fren1, promise1] = kioskTx.borrow({
		itemType: bullsharkType,
		itemId: firstFrenObjectId,
	});

	const [fren2, promise2] = kioskTx.borrow({
		itemType: bullsharkType,
		itemId: secondFrenObjectId,
	});

	// Let's call the mix function. We skip any payment related stuff here.
	tx.moveCall({
		target: `${packageId}::mix_app::mix`,
		arguments: [fren1, fren2, kioskTx.getKiosk(), kioskTx.getKioskCap()],
		typeArguments: [bullsharkType],
	});

	kioskTx
		.return({
			itemType: bullsharkType,
			item: fren1,
			promise: promise1,
		})
		.return({
			itemType: bullsharkType,
			item: fren2,
			promise: promise2,
		})
		.finalize();

	// sign and execute transaction.
	await signAndExecuteTransaction({ tx: tx });
}
```

--------------------------------

### Get Margin Manager DeepBook Pool ID

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the DeepBook pool ID associated with a specific margin manager.

```APIDOC
## GET /margin-manager/deepbook-pool-id

### Description
Get the DeepBook pool ID associated with a margin manager.

### Method
GET

### Endpoint
/margin-manager/deepbook-pool-id

### Parameters
#### Query Parameters
- **marginManagerKey** (string) - Required - The key to identify the margin manager

### Response
#### Success Response (200)
- (string) - The DeepBook pool ID.

#### Response Example
```json
"0x789..."
```
```

--------------------------------

### Transfer Objects with Storage Creation

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_walrus.WalrusClient

An example snippet showing the transfer of newly created storage objects. It utilizes the client's ability to create storage and then transfer ownership.

```typescript
tx.transferObjects([client.createStorage({ size: 1000, epochs: 3 })], owner);
```

--------------------------------

### MarginAdminContract Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginAdminContract

Initializes a new instance of the MarginAdminContract class.

```APIDOC
## Constructor MarginAdminContract

### Description
Initializes a new instance of the MarginAdminContract class.

### Method
constructor

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```json
{
  "config": "DeepBookConfig"
}
```

### Response
#### Success Response (200)
- **MarginAdminContract** (object) - An instance of the MarginAdminContract.

#### Response Example
```json
{
  "instance": "MarginAdminContract"
}
```
```

--------------------------------

### Get Liquidation Risk Ratio - TypeScript

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the liquidation risk ratio for a deepbook pool. This ratio indicates how close the pool is to a liquidation event.

```typescript
/**
 * Get the liquidation risk ratio for a deepbook pool
 * @param poolKey The key to identify the pool
 * @returns The liquidation risk ratio as a decimal (e.g., 1.125 for 112.5%)
 */
async getLiquidationRiskRatio(poolKey: string): Promise<number>
```

--------------------------------

### Get Margin Manager Balance Manager ID

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the unique identifier for the balance manager associated with a specific margin manager.

```APIDOC
## GET /margin-manager/balance-manager-id

### Description
Get the balance manager ID for a margin manager.

### Method
GET

### Endpoint
/margin-manager/balance-manager-id

### Parameters
#### Query Parameters
- **marginManagerKey** (string) - Required - The key to identify the margin manager

### Response
#### Success Response (200)
- (string) - The balance manager ID.

#### Response Example
```json
"0x456..."
```
```

--------------------------------

### GET /getCurrentSystemState

Source: https://sdk.mystenlabs.com/sui/clients/core

Fetches the current state of the Sui system, including epoch information and system version.

```APIDOC
## GET /getCurrentSystemState

### Description
Get the current system state including epoch information.

### Method
GET

### Endpoint
/getCurrentSystemState

### Response
#### Success Response (200)
- **epoch** (string) - The current epoch number.
- **systemStateVersion** (string) - The version of the system state.

#### Response Example
```json
{
  "epoch": "10",
  "systemStateVersion": "12345"
}
```
```

--------------------------------

### SuiGraphQLClient Initialization and Core API Usage

Source: https://sdk.mystenlabs.com/sui/clients/graphql

Demonstrates how to initialize the SuiGraphQLClient and use it to fetch an object using its core API methods.

```APIDOC
## POST /graphql

### Description
This endpoint allows for executing GraphQL queries against the Sui GraphQL API. The `SuiGraphQLClient` provides a type-safe interface for interacting with this API, including fetching core data like objects.

### Method
POST

### Endpoint
/graphql

### Parameters
#### Query Parameters
None

#### Request Body
- **query** (string) - Required - The GraphQL query string.
- **variables** (object) - Optional - Variables to be used with the GraphQL query.

### Request Example
```json
{
  "query": "query GetObject($objectId: ID!) { object(id: $objectId) { ... on MoveObject { details { data { fields } } } } }",
  "variables": {
    "objectId": "0x..."
  }
}
```

### Response
#### Success Response (200)
- **data** (object) - The result of the GraphQL query.
- **errors** (array) - An array of errors, if any occurred during query execution.

#### Response Example
```json
{
  "data": {
    "object": {
      "details": {
        "data": {
          "fields": {
            "owner": "0x...",
            "symbol": "SUI",
            "balance": "1000000"
          }
        }
      }
    }
  }
}
```
```

--------------------------------

### Customize Network Requests with Custom Fetch

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_walrus

Replace the default `fetch` implementation with a custom one to control request behavior, such as setting timeouts and using specific network agents. This example uses `undici` for enhanced network performance and configuration options.

```javascript
import type { RequestInfo, RequestInit } from 'undici';
import { Agent, fetch, setGlobalDispatcher } from 'undici';

const client = new SuiGrpcClient({
  network: 'testnet',
  baseUrl: 'https://fullnode.testnet.sui.io:443',
}).$extend(
  walrus({
    storageNodeClientOptions: {
      timeout: 60_000,
      fetch: (url, init) => {
        // Some casting may be required because undici types may not exactly match the @node/types types
        return fetch(url as RequestInfo, {
          ...(init as RequestInit),
          dispatcher: new Agent({
            connectTimeout: 60_000,
          }),
        }) as unknown as Promise<Response>;
      },
    },
  }),
);
```

--------------------------------

### Get Balance - TypeScript

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.client.CoreClient

Fetches the balance for a specified coin type for an address. Requires GetBalanceOptions.

```typescript
getBalance(options: GetBalanceOptions): Promise<GetBalanceResponse>
```

--------------------------------

### Get Transaction Details

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.graphql.SuiGraphQLClient

Retrieves detailed information about a specific transaction on the Sui blockchain. Allows for generic inclusion of transaction-related data.

```typescript
getTransaction<Include extends TransactionInclude = {}>(input: GetTransactionOptions<Include>): Promise<SuiClientTypes.TransactionResult<Include>>
```

--------------------------------

### Demonstrate Payment Key Uniqueness

Source: https://sdk.mystenlabs.com/payment-kit/payment-processing

Illustrates how changing any component of the payment parameters results in a unique payment key. This example shows variations in nonce and amount.

```typescript
// Original payment
const originalNonce = crypto.randomUUID();

const payment1 = {
	nonce: originalNonce,
	amount: 1000000000,
	receiver,
	coinType: '0x2::sui::SUI',
};

// Different nonce = different payment
const payment2 = {
	nonce: crypto.randomUUID(), // Changed
	amount: 1000000000,
	receiver,
	coinType: '0x2::sui::SUI',
};

// Different amount = different payment
const payment3 = {
	nonce: originalNonce,
	amount: 2000000000, // Changed
	receiver,
	coinType: '0x2::sui::SUI',
};

// All three are unique payments that can be processed separately
```

--------------------------------

### MultiSigSigner Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.multisig.MultiSigSigner

Initializes a new MultiSigSigner instance. It requires a MultiSigPublicKey and can optionally take an array of Signer objects.

```APIDOC
## Constructors

### constructor
  * new MultiSigSigner(
pubkey: MultiSigPublicKey,
signers?: Signer[],
): MultiSigSigner
#### Parameters
    * pubkey: MultiSigPublicKey
    * signers: Signer[] = []
#### Returns MultiSigSigner
```

--------------------------------

### Get Margin Manager State

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginManagerContract

Retrieves comprehensive state information for a margin manager, including balances, debt, and other relevant metrics.

```APIDOC
## GET /websites/sdk_mystenlabs/managerState

### Description
Get comprehensive state information for a margin manager.

### Method
GET

### Endpoint
/websites/sdk_mystenlabs/managerState

### Parameters
#### Query Parameters
- **poolKey** (string) - Required - The key to identify the pool.
- **marginManagerId** (string) - Required - The ID of the margin manager.

### Response
#### Success Response (200)
- **tx** (Transaction) - A Transaction object representing the operation.
- **result** (TransactionResult) - The result of the transaction.

#### Response Example
```json
{
  "tx": "TransactionObject",
  "result": "TransactionResult"
}
```
```

--------------------------------

### Get Pool DEEP Price Conversion

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Retrieves the DEEP (Decentralized Exchange Protocol) price conversion information for a given pool.

```APIDOC
## POST /websites/sdk_mystenlabs/getPoolDeepPrice

### Description
Get the DEEP price conversion for a pool.

### Method
POST

### Endpoint
/websites/sdk_mystenlabs/getPoolDeepPrice

### Parameters
#### Request Body
- **poolKey** (string) - Required - The key to identify the pool

### Request Example
```json
{
  "poolKey": "string"
}
```

### Response
#### Success Response (200)
- **tx** (Transaction) - A Transaction object

#### Response Example
```json
{
  "tx": {}
}
```
```

--------------------------------

### Computed Style and Selection

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_wallet-standard.WalletEventsWindow

Methods for getting computed CSS styles and the current text selection.

```APIDOC
## POST /window/getComputedStyle

### Description
Returns an object containing the values of all CSS properties of an element, after applying active stylesheets.

### Method
POST

### Endpoint
/window/getComputedStyle

### Parameters
#### Request Body
- **elt** (Element) - Required - The element whose styles you want to get.
- **pseudoElt** (string | null) - Optional - Specifies the pseudo-element to match (e.g., '::before').

### Request Example
```json
{
  "elt": "#myElement",
  "pseudoElt": null
}
```

### Response
#### Success Response (200)
- **styleDeclaration** (CSSStyleDeclaration) - An object containing the computed CSS properties and their values.

#### Response Example
```json
{
  "styleDeclaration": {
    "color": "rgb(0, 0, 0)",
    "fontSize": "16px"
  }
}
```

## POST /window/getSelection

### Description
Returns the `Selection` object associated with the window's document, representing the range of text selected by the user or the current position of the caret.

### Method
POST

### Endpoint
/window/getSelection

### Response
#### Success Response (200)
- **selection** (Selection | null) - The `Selection` object or null if no text is selected.

#### Response Example
```json
{
  "selection": {
    "type": "Range",
    "rangeCount": 1
  }
}
```
```

--------------------------------

### StandardConnectMethod

Source: https://sdk.mystenlabs.com/typedoc/types/_mysten_wallet-standard.StandardConnectMethod

The StandardConnectMethod is used to initiate a connection with a wallet. It accepts an optional input object and returns a promise that resolves with the connection output.

```APIDOC
## StandardConnectMethod

### Description
Method to call to use the StandardConnectFeature. This method is used to establish a connection with a wallet.

### Method
(async) function

### Endpoint
N/A (This is a client-side SDK method)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **input** (StandardConnectInput) - Optional - An object containing connection-specific input parameters.

### Request Example
```json
{
  "example": "StandardConnectInput object or undefined"
}
```

### Response
#### Success Response (Promise<StandardConnectOutput>)
- **output** (StandardConnectOutput) - The output object upon successful connection.

#### Response Example
```json
{
  "example": "StandardConnectOutput object"
}
```
```

--------------------------------

### Get Objects API

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.graphql.SuiGraphQLClient

Retrieves objects based on the provided options. This method supports generic type parameters for including additional object details.

```APIDOC
## GET /objects

### Description
Retrieves objects from the Sui blockchain based on specified criteria. Supports including detailed object information.

### Method
GET

### Endpoint
/objects

### Parameters
#### Query Parameters
- **input** (GetObjectsOptions<Include>) - Required - Options to filter and retrieve objects.

### Request Example
```json
{
  "options": {
    "showType": true,
    "showContent": true
  }
}
```

### Response
#### Success Response (200)
- **data** (Array<Object>) - A list of objects matching the query.
- **nextCursor** (string | null) - Cursor for paginating through results.
- **hasNextPage** (boolean) - Indicates if there are more pages of results.

#### Response Example
```json
{
  "data": [
    {
      "objectId": "0x123...",
      "owner": "0x456...",
      "type": "0x2::coin::Coin<0x2::sui::SUI>",
      "version": "10",
      "digest": "Ejx...",
      "content": {
        "dataType": "moveObject",
        "fields": {
          "value": "1000"
        }
      }
    }
  ],
  "nextCursor": null,
  "hasNextPage": false
}
```
```

--------------------------------

### GET /websites/sdk_mystenlabs/getLevel2TicksFromMid

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves Level 2 order book data (bid and ask prices/quantities) for a specified number of ticks away from the mid-price.

```APIDOC
## GET /websites/sdk_mystenlabs/getLevel2TicksFromMid

### Description
Get level 2 order book ticks from mid-price for a pool.

### Method
GET

### Endpoint
/websites/sdk_mystenlabs/getLevel2TicksFromMid

### Parameters
#### Query Parameters
- **poolKey** (string) - Required - Key of the pool.
- **ticks** (number) - Required - Number of ticks from mid-price.

### Response
#### Success Response (200)
- **ask_prices** (number[]) - Array of ask prices.
- **ask_quantities** (number[]) - Array of corresponding ask quantities.
- **bid_prices** (number[]) - Array of bid prices.
- **bid_quantities** (number[]) - Array of corresponding bid quantities.

#### Response Example
```json
{
  "ask_prices": [1.05, 1.10, 1.15],
  "ask_quantities": [50, 45, 40],
  "bid_prices": [0.95, 0.90, 0.85],
  "bid_quantities": [55, 50, 45]
}
```
```

--------------------------------

### GET /websites/sdk_mystenlabs/getLevel2Range

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves Level 2 order book data (prices and quantities) within a specified price range for a given pool.

```APIDOC
## GET /websites/sdk_mystenlabs/getLevel2Range

### Description
Get level 2 order book specifying range of price.

### Method
GET

### Endpoint
/websites/sdk_mystenlabs/getLevel2Range

### Parameters
#### Query Parameters
- **poolKey** (string) - Required - Key of the pool.
- **priceLow** (number) - Required - Lower bound of the price range.
- **priceHigh** (number) - Required - Upper bound of the price range.
- **isBid** (boolean) - Required - Whether to get bid or ask orders.

### Response
#### Success Response (200)
- **prices** (number[]) - An array of prices within the specified range.
- **quantities** (number[]) - An array of corresponding quantities.

#### Response Example
```json
{
  "prices": [1.0, 1.1, 1.2],
  "quantities": [100, 90, 80]
}
```
```

--------------------------------

### Get Pool Trade Parameters

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the current trade parameters for a given DeepBook pool, including maker fee, stake required, and taker fee.

```APIDOC
## GET /poolTradeParams

### Description
Get the trade parameters for a given pool, including taker fee, maker fee, and stake required.

### Method
GET

### Endpoint
/poolTradeParams

### Parameters
#### Query Parameters
- **poolKey** (string) - Required - Key of the pool

### Response
#### Success Response (200)
- **makerFee** (number) - The maker fee for the pool.
- **stakeRequired** (number) - The stake required for the pool.
- **takerFee** (number) - The taker fee for the pool.

#### Response Example
```json
{
  "makerFee": 0.001,
  "stakeRequired": 1000,
  "takerFee": 0.002
}
```
```

--------------------------------

### Get Base Quantity Out for Quote Quantity with Input Fee

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Calculates the base quantity that can be obtained for a given quote quantity, using the input token as the fee.

```APIDOC
## POST /websites/sdk_mystenlabs/getQuantityOutInputFee

### Description
Get the base quantity out for a given quote quantity using input token as fee.

### Method
POST

### Endpoint
/websites/sdk_mystenlabs/getQuantityOutInputFee

### Parameters
#### Request Body
- **poolKey** (string) - Required - The key to identify the pool
- **baseQuantity** (number) - Required - Base quantity to convert
- **quoteQuantity** (number) - Required - Quote quantity to convert

### Request Example
```json
{
  "poolKey": "string",
  "baseQuantity": 0,
  "quoteQuantity": 0
}
```

### Response
#### Success Response (200)
- **tx** (Transaction) - A Transaction object
- **result** (TransactionResult) - The result of the transaction

#### Response Example
```json
{
  "tx": {},
  "result": {}
}
```
```

--------------------------------

### Subscribing to dApp Kit State Changes (JavaScript)

Source: https://sdk.mystenlabs.com/dapp-kit/state

Shows how to subscribe to changes in the dApp Kit's stores, such as the connection status, and provides an example of how to unsubscribe when the listener is no longer needed.

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

### GET /getChainIdentifier

Source: https://sdk.mystenlabs.com/sui/clients/core

Retrieves the unique identifier for the current blockchain network.

```APIDOC
## GET /getChainIdentifier

### Description
Get the chain identifier for the network.

### Method
GET

### Endpoint
/getChainIdentifier

### Response
#### Success Response (200)
- **chainIdentifier** (string) - The chain identifier (e.g., "4c78adac").

#### Response Example
```json
{
  "chainIdentifier": "4c78adac"
}
```
```

--------------------------------

### Get LedgerSigner Key Scheme

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_signers.ledger.LedgerSigner

Retrieves the key scheme used by the LedgerSigner. Currently, only ED25519 is supported.

```typescript
const keyScheme = signer.getKeyScheme(); // Returns "ED25519"

```

--------------------------------

### SlushWallet Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_slush-wallet.SlushWallet

Initializes a new SlushWallet instance. It requires metadata including wallet details and an optional chain and origin. The metadata must contain enabled status, icon, ID, and wallet name.

```typescript
new SlushWallet(
  __namedParameters: {
    chain?: "sui:devnet" | "sui:testnet" | "sui:localnet" | "sui:mainnet";
    metadata: {
      enabled: boolean;
      icon: string;
      id: string;
      walletName: string;
    };
    name: string;
    origin?: string;
  },
): SlushWallet
```

--------------------------------

### Get Account Order Details

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Fetches detailed information about all orders associated with a balance manager in a specific pool. It returns an array of order detail objects.

```typescript
getAccountOrderDetails(poolKey: string, managerKey: string): Promise<{
  balance_manager_id: string;
  client_order_id: string;
  epoch: string;
  expire_timestamp: string;
  fee_is_deep: boolean;
  filled_quantity: string;
  order_deep_price: { asset_is_base: boolean; deep_per_asset: string };
  order_id: string;
  quantity: string;
  status: number;
}[]>
```

--------------------------------

### Initialize ZkSendLinkBuilder

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_zksend

Initializes the ZkSendLinkBuilder class to start creating a zkSend link. It requires the sender's address and optionally accepts a Sui client and network configuration.

```typescript
import { ZkSendLinkBuilder } from '@mysten/zksend';

const link = new ZkSendLinkBuilder({
	sender: '0x...',
});
```

--------------------------------

### Get LedgerSigner Public Key

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_signers.ledger.LedgerSigner

Retrieves the public key associated with the LedgerSigner instance. This is an Ed25519PublicKey object.

```typescript
const publicKey = signer.getPublicKey(); // Returns an Ed25519PublicKey instance

```

--------------------------------

### Register Wallet with WindowAppReadyEventAPI (TypeScript)

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_wallet-standard.WindowAppReadyEventAPI

Demonstrates how to register a wallet using the `register` method of the `WindowAppReadyEventAPI` interface. This interface is provided by the app to wallets. The `register` method takes a `Wallet` object and returns an `unregister` function.

```typescript
interface WindowAppReadyEventAPI {
  register(wallet: Wallet): () => void;
}

// Example usage (conceptual):
const walletApi: WindowAppReadyEventAPI = getWalletApiFromApp();
const unregisterWallet = walletApi.register(myWalletInstance);

// To unregister later:
unregisterWallet();
```

--------------------------------

### getRegistryIdFromName

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_payment-kit.PaymentKitClient

Get the registry object ID from a registry name. Returns the derived registry ID.

```APIDOC
## GET /registry/id

### Description
Get the registry object ID from a registry name. Returns the derived registry ID.

### Method
GET

### Endpoint
/registry/id

### Parameters
#### Path Parameters
None

#### Query Parameters
- **registryName** (string) - Required - The name of the registry.

#### Request Body
None

### Request Example
```javascript
const registryId = await client.getRegistryIdFromName("my-registry");
```

### Response
#### Success Response (200)
- **registryId** (string) - The derived registry object ID.

#### Response Example
```json
{
  "registryId": "some-registry-object-id"
}
```
```

--------------------------------

### getVerifiedBlobStatus

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_walrus.WalrusClient

Gets the blob status from multiple storage nodes and returns the latest status that can be verified.

```APIDOC
## POST /blob/status/verified

### Description
Gets the blob status from multiple storage nodes and returns the latest status that can be verified.

### Method
POST

### Endpoint
/blob/status/verified

### Parameters
#### Request Body
- **options** (ReadBlobOptions) - Required - Options for reading blobs.

### Response
#### Success Response (200)
- **status** (BlobStatus) - The verified blob status.

#### Response Example
```json
{
  "status": {
    "verified": true,
    "last_checked": "2023-10-27T10:00:00Z"
  }
}
```
```

--------------------------------

### PublicKey Class Overview

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.cryptography.PublicKey

Provides an overview of the PublicKey class and its hierarchical structure.

```APIDOC
## PublicKey Class

A public key.

### Hierarchy
* PublicKey
  * Ed25519PublicKey
  * Secp256k1PublicKey
  * MultiSigPublicKey
  * ZkLoginPublicIdentifier
```

--------------------------------

### Get a Specific Walrus Blob

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_walrus

Retrieves a specific Walrus blob using its unique blob ID.

```typescript
const blob = await client.walrus.getBlob({ blobId });
```

--------------------------------

### newProtocolConfig

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginMaintainerContract

Creates a new protocol configuration including margin pool and interest settings.

```APIDOC
## POST /newProtocolConfig

### Description
Create a new protocol config.

### Method
POST

### Endpoint
/newProtocolConfig

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
* **coinKey** (string) - Required - The key to identify the coin
* **marginPoolConfig** (MarginPoolConfigParams) - Required - The configuration for the margin pool (with optional rate limit)
* **interestConfig** (InterestConfigParams) - Required - The configuration for the interest

### Request Example
```json
{
  "coinKey": "string",
  "marginPoolConfig": "MarginPoolConfigParams object",
  "interestConfig": "InterestConfigParams object"
}
```

### Response
#### Success Response (200)
* **(tx: Transaction) => TransactionResult** - A function that takes a Transaction object and returns a TransactionResult.

#### Response Example
```json
{
  "transactionFunction": "(tx: Transaction) => TransactionResult"
}
```
```

--------------------------------

### Get Chain Identifier

Source: https://sdk.mystenlabs.com/sui/clients/core

Obtains the unique identifier for the current blockchain network.

```typescript
const { chainIdentifier } = await client.core.getChainIdentifier();
console.log(chainIdentifier); // e.g., "4c78adac"
```

--------------------------------

### Initialize Payment Kit Client with Sui gRPC

Source: https://sdk.mystenlabs.com/payment-kit/payment-kit-sdk

Demonstrates how to set up the PaymentKitClient by extending the SuiGrpcClient. This involves importing necessary modules and configuring the client for a specific network like 'testnet'. The client can then be used to access Payment Kit functionalities.

```typescript
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { paymentKit } from '@mysten/payment-kit';

const client = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
}).$extend(paymentKit());

// Access Payment Kit functionality
client.paymentKit.tx.processRegistryPayment(/* ... */);
```

--------------------------------

### Get Margin Pool Protocol Spread

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Returns the protocol spread for a specified margin pool. The 'coinKey' identifies the pool, and the spread is returned as a decimal number.

```typescript
getMarginPoolProtocolSpread(coinKey: string): Promise<number>
```

--------------------------------

### Get Margin Manager Assets

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Calculates and retrieves the base and quote assets for a given margin manager. Optionally, you can specify the number of decimal places to display.

```APIDOC
## GET /margin-manager/assets

### Description
Calculate assets (base and quote) for a margin manager.

### Method
GET

### Endpoint
/margin-manager/assets

### Parameters
#### Query Parameters
- **marginManagerKey** (string) - Required - The key to identify the margin manager
- **decimals** (number) - Optional - Number of decimal places to show (default: 6)

### Response
#### Success Response (200)
- **baseAsset** (string) - The base asset symbol.
- **quoteAsset** (string) - The quote asset symbol.

#### Response Example
```json
{
  "baseAsset": "ETH",
  "quoteAsset": "USDC"
}
```
```

--------------------------------

### Create dApp Kit Instance with Sui gRPC Client

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/vue

Sets up a dApp Kit instance for a Vue application, configuring it to use the Sui testnet via a gRPC client. This involves defining network URLs and creating a client for each network.

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

### Instantiate ZkSendLinkBuilder

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_zksend.ZkSendLinkBuilder

Demonstrates how to create a new instance of the ZkSendLinkBuilder class. This constructor requires an options object, typically including network and sender information.

```typescript
import { ZkSendLinkBuilder } from "@mysten/zksend";

const builder = new ZkSendLinkBuilder({
  network: "testnet",
  sender: "0x123...",
});
```

--------------------------------

### Get Pool Object

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookConfig

Retrieves a Pool object by its key. This method allows access to specific pool configurations and data.

```typescript
getPool(key: string): Pool
```

--------------------------------

### Get User Liquidation Reward (SDK)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Fetches the user's liquidation reward for a deepbook pool. This function allows users to check potential earnings from participating in liquidations. It requires the pool key and returns the reward as a decimal.

```typescript
getUserLiquidationReward(poolKey: string): Promise<number>
```

--------------------------------

### Sui SDK Query Methods - Type Parameters

Source: https://sdk.mystenlabs.com/typedoc/functions/_mysten_dapp-kit.useSuiClientQueries

This section details the various query methods available in the Sui SDK, including parameters for resolving nameservice names, getting RPC API version, managing coins, balances, and coin metadata. It also covers methods for retrieving Move modules, functions, structs, owned objects, specific objects, and transaction blocks.

```typescript
type Queries = readonly (
  | {
      method: "resolveNameServiceNames";
      options?: UseSuiClientQueryOptions<"resolveNameServiceNames", unknown>;
      params: ResolveNameServiceNamesParams & { format?: "at" | "dot" };
    }
  | {
      method: "getRpcApiVersion";
      options?: UseSuiClientQueryOptions<"getRpcApiVersion", unknown>;
      params: { signal?: AbortSignal };
    }
  | {
      method: "getCoins";
      options?: UseSuiClientQueryOptions<"getCoins", unknown>;
      params: GetCoinsParams;
    }
  | {
      method: "getAllCoins";
      options?: UseSuiClientQueryOptions<"getAllCoins", unknown>;
      params: GetAllCoinsParams;
    }
  | {
      method: "getBalance";
      options?: UseSuiClientQueryOptions<"getBalance", unknown>;
      params: GetBalanceParams;
    }
  | {
      method: "getAllBalances";
      options?: UseSuiClientQueryOptions<"getAllBalances", unknown>;
      params: GetAllBalancesParams;
    }
  | {
      method: "getCoinMetadata";
      options?: UseSuiClientQueryOptions<"getCoinMetadata", unknown>;
      params: GetCoinMetadataParams;
    }
  | {
      method: "getTotalSupply";
      options?: UseSuiClientQueryOptions<"getTotalSupply", unknown>;
      params: GetTotalSupplyParams;
    }
  | {
      method: "getMoveFunctionArgTypes";
      options?: UseSuiClientQueryOptions<"getMoveFunctionArgTypes", unknown>;
      params: GetMoveFunctionArgTypesParams;
    }
  | {
      method: "getNormalizedMoveModulesByPackage";
      options?: UseSuiClientQueryOptions<
        "getNormalizedMoveModulesByPackage",
        unknown,
      >;
      params: GetNormalizedMoveModulesByPackageParams;
    }
  | {
      method: "getNormalizedMoveModule";
      options?: UseSuiClientQueryOptions<"getNormalizedMoveModule", unknown>;
      params: GetNormalizedMoveModuleParams;
    }
  | {
      method: "getNormalizedMoveFunction";
      options?: UseSuiClientQueryOptions<"getNormalizedMoveFunction", unknown>;
      params: GetNormalizedMoveFunctionParams;
    }
  | {
      method: "getNormalizedMoveStruct";
      options?: UseSuiClientQueryOptions<"getNormalizedMoveStruct", unknown>;
      params: GetNormalizedMoveStructParams;
    }
  | {
      method: "getOwnedObjects";
      options?: UseSuiClientQueryOptions<"getOwnedObjects", unknown>;
      params: {
        cursor?: string | null;
        limit?: number | null;
        owner: string;
        signal?: AbortSignal;
      } & SuiObjectResponseQuery;
    }
  | {
      method: "getObject";
      options?: UseSuiClientQueryOptions<"getObject", unknown>;
      params: GetObjectParams;
    }
  | {
      method: "tryGetPastObject";
      options?: UseSuiClientQueryOptions<"tryGetPastObject", unknown>;
      params: TryGetPastObjectParams;
    }
  | {
      method: "multiGetObjects";
      options?: UseSuiClientQueryOptions<"multiGetObjects", unknown>;
      params: MultiGetObjectsParams;
    }
  | {
      method: "queryTransactionBlocks";
      options?: UseSuiClientQueryOptions<"queryTransactionBlocks", unknown>;
      params: {
        cursor?: string | null;
        limit?: number | null;
        order?: "ascending" | "descending" | null;
        signal?: AbortSignal;
      } & SuiTransactionBlockResponseQuery;
    }
  | {
      method: "getTransactionBlock";
      options?: UseSuiClientQueryOptions<"getTransactionBlock", unknown>;
      params: GetTransactionBlockParams;
    }
  | {
      method: "multiGetTransactionBlocks";
      options?: UseSuiClientQueryOptions<"multiGetTransactionBlocks", unknown>;
      params: MultiGetTransactionBlocksParams;
    }
  | {
      method: "executeTransactionBlock";
      options?: UseSuiClientQueryOptions<"executeTransactionBlock", unknown>;
      params: ExecuteTransactionBlockParams;
    }
  | {
      method: "signAndExecuteTransaction";
      options?: UseSuiClientQueryOptions<"signAndExecuteTransaction", unknown>;
      params: {
        signer: Signer;
        transaction: Uint8Array<ArrayBufferLike> | Transaction;
      } & Omit<ExecuteTransactionBlockParams, "transactionBlock" | "signature">;
    }
  | {
      method: "getTotalTransactionBlocks";
      options?: UseSuiClientQueryOptions<"getTotalTransactionBlocks", unknown>;
      params: { signal?: AbortSignal };
    }
  | {
      method: "getReferenceGasPrice";
      options?: UseSuiClientQueryOptions<"getReferenceGasPrice", unknown>;
      params: GetReferenceGasPriceParams;
    }
  | {
      method: "getStakes";
      options?: UseSuiClientQueryOptions<"getStakes", unknown>;
      params: GetStakesParams;
    }
  | {
      method: "getStakesByIds";
      options?: UseSuiClientQueryOptions<"getStakesByIds", unknown>;
      params: GetStakesByIdsParams;
    }
  | {
      method: "getLatestSuiSystemState";
      options?: UseSuiClientQueryOptions<"getLatestSuiSystemState", unknown>;
      params: GetLatestSuiSystemStateParams;
    }
  | {
      method: "queryEvents";
      options?: UseSuiClientQueryOptions<"queryEvents", unknown>;
      params: QueryEventsParams;
    }
  | {
      method: "devInspectTransactionBlock";
      options?: UseSuiClientQueryOptions<"devInspectTransactionBlock", unknown>;
      params: DevInspectTransactionBlockParams;
    }
  | {
      method: "dryRunTransactionBlock";
      options?: UseSuiClientQueryOptions<"dryRunTransactionBlock", unknown>;
      params: DryRunTransactionBlockParams;
    }
  | {
      method: "getDynamicFields";
      options?: UseSuiClientQueryOptions<"getDynamicFields", unknown>;
      params: GetDynamicFieldsParams;
    }
);
```

--------------------------------

### Get Required DEEP for an Order

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Calculates the required DEEP (Decentralized Exchange Protocol) for placing an order with a specified base quantity and price.

```APIDOC
## POST /websites/sdk_mystenlabs/getOrderDeepRequired

### Description
Get the DEEP required for an order.

### Method
POST

### Endpoint
/websites/sdk_mystenlabs/getOrderDeepRequired

### Parameters
#### Request Body
- **poolKey** (string) - Required - The key to identify the pool
- **baseQuantity** (number) - Required - Base quantity
- **price** (number) - Required - Price

### Request Example
```json
{
  "poolKey": "string",
  "baseQuantity": 0,
  "price": 0
}
```

### Response
#### Success Response (200)
- **tx** (Transaction) - A Transaction object
- **result** (TransactionResult) - The result of the transaction

#### Response Example
```json
{
  "tx": {},
  "result": {}
}
```
```

--------------------------------

### Create DApp Kit Instance (JavaScript)

Source: https://sdk.mystenlabs.com/dapp-kit/dapp-kit-instance

Initializes the DApp Kit instance for a Sui dApp. It configures network support and provides a method to create Sui gRPC clients for each network. This is the foundational step for integrating wallet connections and blockchain interactions.

```javascript
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

### Register Blob in Transaction Example (TypeScript)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_walrus.WalrusClient

Shows how to register a blob within a transaction. This function returns a transaction builder that can be used to add the registration to a larger transaction.

```typescript
tx.transferObjects([client.registerBlob({ size: 1000, epochs: 3, blobId, rootHash, deletable: true })], owner);
```

--------------------------------

### Get Current System State - TypeScript

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.client.CoreClient

Fetches the current state of the Sui network. Optionally accepts GetCurrentSystemStateOptions.

```typescript
getCurrentSystemState(
options?: GetCurrentSystemStateOptions,
): Promise<GetCurrentSystemStateResponse>
```

--------------------------------

### Get Objects - TypeScript

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.client.CoreClient

Fetches multiple objects from the Sui network, with options to include related data. Requires GetObjectsOptions.

```typescript
getObjects<Include extends ObjectInclude = object>(
options: GetObjectsOptions<Include>,
): Promise<GetObjectsResponse<Include>>
```

--------------------------------

### GovernanceContract Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.GovernanceContract

Initializes a new instance of the GovernanceContract class with the provided configuration.

```APIDOC
## Constructors

### constructor
  * new GovernanceContract(config: DeepBookConfig): GovernanceContract

#### Parameters
    * config: DeepBookConfig
Configuration for GovernanceContract

#### Returns GovernanceContract
```

--------------------------------

### Get Epoch Metrics

Source: https://sdk.mystenlabs.com/typedoc/functions/_mysten_dapp-kit.useSuiClientQueries

Retrieves metrics for a given epoch, with options for ordering and pagination. Accepts `PaginationArguments`, `descendingOrder`, and `AbortSignal`.

```typescript
{
  method: "getEpochMetrics",
  options?: UseSuiClientQueryOptions<"getEpochMetrics", unknown>;
  params: { descendingOrder?: boolean; signal?: AbortSignal } & PaginationArguments<
    string
    | null,
  >;
}
```

--------------------------------

### Initialize Transaction Builder

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.transactions.Transaction

Constructs a new Transaction object, which serves as the builder for creating SUI transactions. This is the starting point for all transaction-related operations.

```typescript
new Transaction()
```

--------------------------------

### Delete Blob and Transfer Storage

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_walrus.WalrusClient

This example demonstrates deleting a blob and then transferring the associated storage. It combines blob deletion with object transfer functionalities.

```typescript
const storage = await client.deleteBlob({ blobObjectId });
tx.transferObjects([storage], owner);
```

--------------------------------

### WebCryptoSigner Constructors

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_signers.webcrypto.WebCryptoSigner

Documentation for the constructors of the WebCryptoSigner class.

```APIDOC
## Constructors

### constructor
  * new WebCryptoSigner(
privateKey: CryptoKey,
publicKey: Uint8Array,
): WebCryptoSigner
#### Parameters
    * privateKey: CryptoKey
    * publicKey: Uint8Array
#### Returns WebCryptoSigner
```

--------------------------------

### Get Referral Owner

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Fetches the owner of a referral given its unique ID. This function is useful for tracking referral relationships and their associated owners.

```typescript
balanceManagerReferralOwner(referral: string): Promise<string>
```

--------------------------------

### getApp

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_enoki.EnokiClient

Retrieves application information.

```APIDOC
### getApp
  * getApp(_input?: GetAppApiInput): Promise<GetAppApiResponse>
#### Parameters
    * `Optional`_input: GetAppApiInput
#### Returns Promise<GetAppApiResponse>
```

--------------------------------

### Access Parent Window

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_wallet-standard.WalletEventsWindow

Gets a reference to the parent window of the current window or subframe. This is a read-only property.

```javascript
const parentWindow = window.parent;

if (parentWindow) {
  console.log("Parent window reference obtained.");
}
```

--------------------------------

### Get Move Function - TypeScript

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.client.CoreClient

Fetches details about a Move function on the Sui network. Requires GetMoveFunctionOptions.

```typescript
getMoveFunction(options: GetMoveFunctionOptions): Promise<GetMoveFunctionResponse>
```

--------------------------------

### TypeScript: Using ClientWithCoreApi for SDK Development

Source: https://sdk.mystenlabs.com/sui/clients/core

Demonstrates how to use the `ClientWithCoreApi` type to build SDKs or libraries that are compatible with any Sui client implementation, ensuring transport-agnostic operations.

```typescript
import type { ClientWithCoreApi } from '@mysten/sui/client';

// Your SDK works with any client
class MySDK {
	constructor(private client: ClientWithCoreApi) {}

	aSync doSomething() {
		// Use client.core for all operations
		return this.client.core.getObject({ objectId: '0x...' });
	}
}
```

--------------------------------

### Get Level 2 Order Book Ticks from Mid-Price

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Retrieves level 2 order book ticks relative to the mid-price for a given pool.

```APIDOC
## POST /websites/sdk_mystenlabs/getLevel2TicksFromMid

### Description
Get level 2 order book ticks from mid-price for a pool.

### Method
POST

### Endpoint
/websites/sdk_mystenlabs/getLevel2TicksFromMid

### Parameters
#### Request Body
- **poolKey** (string) - Required - The key to identify the pool
- **tickFromMid** (number) - Required - Number of ticks from mid-price

### Request Example
```json
{
  "poolKey": "string",
  "tickFromMid": 0
}
```

### Response
#### Success Response (200)
- **tx** (Transaction) - A Transaction object

#### Response Example
```json
{
  "tx": {}
}
```
```

--------------------------------

### Integrate Custom Wallets with dApp Kit

Source: https://sdk.mystenlabs.com/dapp-kit/dapp-kit-instance

Shows how to add support for custom wallets by providing wallet initializers to the dApp Kit. This allows developers to integrate their own wallet solutions. It depends on '@mysten/dapp-kit-core', '@mysten/sui/grpc', and '@mysten/wallet-standard'.

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

### Get DEEP Token Balance

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginManagerContract

Retrieves the DEEP token balance for a given margin manager. This function is part of the margin management functionalities.

```APIDOC
## GET /websites/sdk_mystenlabs/balance

### Description
Get the DEEP token balance of a margin manager.

### Method
GET

### Endpoint
/websites/sdk_mystenlabs/balance

### Parameters
#### Query Parameters
- **poolKey** (string) - Required - The key to identify the pool.
- **marginManagerId** (string) - Required - The ID of the margin manager.

### Response
#### Success Response (200)
- **tx** (Transaction) - A Transaction object representing the operation.
- **result** (TransactionResult) - The result of the transaction.

#### Response Example
```json
{
  "tx": "TransactionObject",
  "result": "TransactionResult"
}
```
```

--------------------------------

### Sui SDK - Clone Parameters

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.transactions.TransactionDataBuilder

Details the optional 'clone' parameter and its associated commands for transaction construction.

```APIDOC
## POST /websites/sdk_mystenlabs

### Description
This section details the optional `clone` parameter and its associated commands, which are used for constructing transactions within the Sui SDK. It outlines various operations like Move calls, object transfers, coin splits, and more.

### Method
POST

### Endpoint
/websites/sdk_mystenlabs

### Parameters
#### Query Parameters
- **clone** (object) - Optional - Contains commands for transaction construction.

#### Request Body
- **clone.commands** (EnumOutputShapeWithKeys) - Required - An enum specifying the type of command to execute. Possible values include `MoveCall`, `TransferObjects`, `SplitCoins`, `MergeCoins`, `Publish`, `MakeMoveVec`, `Upgrade`, and `$Intent`.
  - **$Intent** (object) - Represents an intent with data and inputs.
    - **data** (object) - Key-value pairs for intent data.
    - **inputs** (array) - An array defining the inputs for the intent.
  - **MakeMoveVec** (object) - Represents the creation of a Move vector.
    - **elements** (array) - Elements to include in the vector.
    - **type** (string | null) - The type of elements in the vector.
  - **MergeCoins** (object) - Represents merging multiple coins into one.
    - **destination** (object) - The coin to merge into.
    - **sources** (array) - The coins to be merged.
  - **MoveCall** (object) - Represents a call to a Move function.
    - **_argumentTypes** (array | null) - Optional argument types for the function.
    - **arguments** (array) - Arguments for the Move function.
    - **function** (string) - The name of the function to call.
    - **module** (string) - The module containing the function.
    - **package** (string) - The package containing the module.
    - **typeArguments** (array) - Type arguments for the function.
  - **Publish** (object) - Represents publishing a new Move package.
    - **dependencies** (array) - Dependencies of the package.
    - **modules** (array) - The modules within the package.
  - **SplitCoins** (object) - Represents splitting a coin into multiple amounts.
    - **amounts** (array) - The amounts to split the coin into.
    - **coin** (object) - The coin to be split.
  - **TransferObjects** (object) - Represents transferring objects to an address.
    - **address** (object) - The recipient's address.
    - **objects** (array) - The objects to transfer.
  - **Upgrade** (object) - Represents upgrading a Move package.
    - **dependencies** (array) - Dependencies of the upgraded package.
    - **modules** (array) - The modules in the upgraded package.
    - **package** (string) - The package to upgrade.
    - **ticket** (object) - The upgrade ticket.
- **expiration** (object | null) - Optional expiration settings for the transaction.
  - **Epoch** (string | number) - Specifies an epoch for expiration.
  - **None** (boolean) - No expiration.
  - **ValidDuring** (object) - Specifies a valid duration.
    - **chain** (string) - The chain for the validity period.
    - **maxEpoch** (string | number | null) - Maximum epoch for validity.
    - **maxTimestamp** (string | number | null) - Maximum timestamp for validity.
    - **minEpoch** (string | number | null) - Minimum epoch for validity.
    - **minTimestamp** (string | number | null) - Minimum timestamp for validity.
    - **nonce** (number) - A nonce for the validity period.
- **gasData** (object) - Gas-related data for the transaction.
  - **budget** (string | number | null) - The maximum gas budget.
  - **owner** (string | null) - The owner of the gas payment.
  - **payment** (array | null) - An array of gas payment objects.
    - **digest** (string) - Digest of the gas payment object.
    - **objectId** (string) - Object ID of the gas payment.
    - **version** (string | number) - Version of the gas payment object.
  - **price** (string | number | null) - The gas price.
- **inputs** (EnumOutputShapeWithKeys) - An enum defining the types of inputs for the transaction.
  - **FundsWithdrawal** (object) - Represents a withdrawal of funds.
    - **reservation** (object) - Reservation details for the withdrawal.
      - **MaxAmountU64** (string | number) - Maximum amount to withdraw.
    - **typeArg** (object) - The type argument for the withdrawal.
      - **Balance** (string) - Represents a balance.
    - **withdrawFrom** (EnumOutputShapeWithKeys) - Specifies where to withdraw from (`Sender` or `Sponsor`).
  - **Object** (object) - Represents an object on the blockchain.
    - **ImmOrOwnedObject** (object) - An object that is immediately owned.
      - **digest** (string) - Digest of the object.
      - **objectId** (string) - Object ID.
      - **version** (string | number) - Version of the object.
    - **Receiving** (object) - An object being received.
      - **digest** (string) - Digest of the object.
      - **objectId** (string) - Object ID.
      - **version** (string | number) - Version of the object.
    - **SharedObject** (object) - A shared object.
      - **initialSharedVersion** (string | number) - Initial shared version.
      - **mutable** (boolean) - Whether the object is mutable.
      - **objectId** (string) - Object ID.
  - **Pure** (object) - Represents pure data.
    - **bytes** (string) - The byte representation of the pure data.
  - **UnresolvedObject** (object) - An object that needs to be resolved.
    - **digest** (string | null) - Optional digest of the object.
    - **initialSharedVersion** (string | number | null) - Optional initial shared version.
    - **mutable** (boolean | null) - Optional mutability flag.
    - **objectId** (string) - Object ID.
    - **version** (string | number | null) - Optional version of the object.
  - **UnresolvedPure** (object) - Pure data that needs to be resolved.
    - **value** (unknown) - The value to be resolved.

### Request Example
```json
{
  "clone": {
    "commands": [
      {
        "$kind": "MoveCall",
        "package": "0x2",
        "module": "sui",
        "function": "transfer",
        "arguments": [
          {
            "$kind": "Object",
            "objectId": "0x123",
            "version": 1,
            "immOrOwned": true
          },
          {
            "$kind": "Input",
            "Input": 0,
            "type": "object"
          }
        ],
        "typeArguments": []
      }
    ],
    "gasData": {
      "budget": 10000,
      "payment": [
        {
          "objectId": "0xabc",
          "version": 1,
          "digest": "some_digest"
        }
      ]
    }
  }
}
```

### Response
#### Success Response (200)
- **digest** (string) - The digest of the transaction.

#### Response Example
```json
{
  "digest": "transaction_digest_here"
}
```
```

--------------------------------

### Get Coin Object

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookConfig

Retrieves a Coin object associated with the given key. This method is used to access coin-specific data or functionalities.

```typescript
getCoin(key: string): Coin
```

--------------------------------

### WebCryptoSigner Static Methods

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_signers.webcrypto.WebCryptoSigner

Documentation for the static methods of the WebCryptoSigner class.

```APIDOC
## Static Methods

### `Static`generate
  * generate(
__namedParameters?: { extractable?: boolean },
): Promise<WebCryptoSigner>
#### Parameters
    * __namedParameters: { extractable?: boolean } = {}
#### Returns Promise<WebCryptoSigner>

### `Static`import
  * import(data: ExportedWebCryptoKeypair): WebCryptoSigner
Imports a keypair using the value returned by `export()`.
#### Parameters
    * data: ExportedWebCryptoKeypair
#### Returns WebCryptoSigner
```

--------------------------------

### Get zkSend Link URL

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_zksend

Retrieves the generated URL for the zkSend link. This URL can be shared with recipients to claim the assets.

```typescript
const linkUrl = link.getLink();
```

--------------------------------

### Get Margin Pool ID

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the unique identifier for a margin pool. It takes the 'coinKey' as input and returns the margin pool ID as a string.

```typescript
getMarginPoolId(coinKey: string): Promise<string>
```

--------------------------------

### BcsTuple Constructor and Usage in TypeScript

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.bcs.BcsTuple

Demonstrates the constructor for BcsTuple, which accepts BcsTupleOptions to define the tuple's elements and name. It also shows how the $inferInput and $inferType properties infer the input and output types for the tuple.

```typescript
import { BcsTuple, BcsType } from "@mysten/sui/bcs";

// Define a tuple type with two elements: a string and a number
type MyTuple = BcsTuple<[
  BcsType<string, string, "string">,
  BcsType<number, number, "number">
], "(string, number)">;

// Example usage of the constructor
const myTupleInstance: MyTuple = new BcsTuple({
  elements: [
    new BcsType<string, string, "string">('string'),
    new BcsType<number, number, "number">('number')
  ],
  name: "(string, number)"
});

// Inferring input and type
console.log(myTupleInstance.$inferInput);
console.log(myTupleInstance.$inferType);
```

--------------------------------

### Connect Wallet and Log Accounts (JavaScript)

Source: https://sdk.mystenlabs.com/dapp-kit/dapp-kit-instance

Demonstrates how to connect a wallet and log the connected accounts using the previously initialized DApp Kit instance. This function takes a wallet and an account as arguments and utilizes the `connectWallet` action provided by the dAppKit instance.

```javascript
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

### Error.stackTraceLimit Example

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_seal.GeneralError

Illustrates the usage and behavior of the static `Error.stackTraceLimit` property, which controls the number of stack frames collected in a stack trace. It explains the default value and how setting it affects subsequent stack trace captures.

```javascript
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack; // Similar to `new Error().stack`
```

--------------------------------

### Initialize Sui and Ledger Signer with MystenLabs SDK

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_signers

This snippet demonstrates how to initialize the necessary clients for interacting with the Sui network via gRPC and a Ledger device. It sets up a `SuiLedgerClient` and a `LedgerSigner` using a specified derivation path, and a `SuiGrpcClient` for the testnet. The output includes the derived Sui address.

```javascript
import Transport from '@ledgerhq/hw-transport-node-hid';
import SuiLedgerClient from '@mysten/ledgerjs-hw-app-sui';
import { LedgerSigner } from '@mysten/signers/ledger';
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { Transaction } from '@mysten/sui/transactions';

const transport = await Transport.open(undefined);
const ledgerClient = new SuiLedgerClient(transport);
const suiClient = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
});

const signer = await LedgerSigner.fromDerivationPath(
	"m/44'/784'/0'/0'/0",
	ledgerClient,
	suiClient,
);

// Log the Sui address:
console.log(signer.toSuiAddress());

// Define a test transaction:
const testTransaction = new Transaction();
const transactionBytes = await testTransaction.build();

// Sign a test transaction:
const { signature } = await signer.signTransaction(transactionBytes);
console.log(signature);
```

--------------------------------

### Get Objects from Sui Blockchain

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.graphql.SuiGraphQLClient

Retrieves objects from the Sui blockchain based on specified options. Supports generic inclusion types for detailed object information.

```typescript
getObjects<Include extends ObjectInclude = {}>(input: GetObjectsOptions<Include>): Promise<GetObjectsResponse<Include>>
```

--------------------------------

### Get Margin Pool Borrow Shares

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Returns the total borrow shares for a specified margin pool. The 'coinKey' identifies the pool, and an optional 'decimals' parameter controls the precision of the returned string.

```typescript
getMarginPoolBorrowShares(coinKey: string, decimals?: number): Promise<string>
```

--------------------------------

### Get WalrusBlob as WalrusFile

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_walrus.WalrusBlob

Converts the current WalrusBlob instance into a WalrusFile object. This method does not take any parameters.

```typescript
walrusBlob.asFile();
```

--------------------------------

### Access MIDI Devices with Navigator.requestMIDIAccess()

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_wallet-standard.DEPRECATED_WalletsNavigator

The requestMIDIAccess() method returns a Promise representing a request for access to MIDI devices on a user's system. This is available only in secure contexts and allows web applications to interact with MIDI controllers and instruments.

```javascript
navigator.requestMIDIAccess().then(midiAccess => {
  console.log('MIDI access granted:', midiAccess);
  // Further MIDI device interaction can happen here
}).catch(error => {
  console.error('MIDI access denied:', error);
});
```

--------------------------------

### PublicKey Methods

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.cryptography.PublicKey

Documentation for the methods available on the PublicKey class.

```APIDOC
## Methods

### equals

`equals(publicKey: PublicKey): boolean`

Checks if two public keys are equal.

#### Parameters
* **publicKey** (PublicKey) - The public key to compare against.

#### Returns
* boolean - True if the keys are equal, false otherwise.
```

```APIDOC
### flag

`flag(): number`

Return signature scheme flag of the public key.

#### Returns
* number - The signature scheme flag.
```

```APIDOC
### toBase64

`toBase64(): string`

Return the base-64 representation of the public key.

#### Returns
* string - The base-64 encoded public key.
```

```APIDOC
### toRawBytes

`toRawBytes(): Uint8Array<ArrayBuffer>`

Return the byte array representation of the public key.

#### Returns
* Uint8Array<ArrayBuffer> - The raw byte array of the public key.
```

```APIDOC
### toString

`toString(): never`

This method is abstract and should not be called directly.

#### Returns
* never
```

```APIDOC
### toSuiAddress

`toSuiAddress(): string`

Return the Sui address associated with this Ed25519 public key.

#### Returns
* string - The Sui address.
```

```APIDOC
### toSuiBytes

`toSuiBytes(): Uint8Array<ArrayBuffer>`

Returns the bytes representation of the public key prefixed with the signature scheme flag.

#### Returns
* Uint8Array<ArrayBuffer> - The prefixed byte array.
```

```APIDOC
### toSuiPublicKey

`toSuiPublicKey(): string`

Return the Sui representation of the public key encoded in base-64. A Sui public key is formed by the concatenation of the scheme flag with the raw bytes of the public key.

#### Returns
* string - The Sui public key string.
```

```APIDOC
### verify

`verify(data: Uint8Array, signature: string | Uint8Array<ArrayBufferLike>): Promise<boolean>`

Verifies that the signature is valid for the provided message.

#### Parameters
* **data** (Uint8Array) - The data to verify.
* **signature** (string | Uint8Array<ArrayBufferLike>) - The signature to check.

#### Returns
* Promise<boolean> - A promise that resolves to true if the signature is valid, false otherwise.
```

```APIDOC
### verifyAddress

`verifyAddress(address: string): boolean`

Verifies that the public key is associated with the provided address.

#### Parameters
* **address** (string) - The address to verify against.

#### Returns
* boolean - True if the address matches the public key, false otherwise.
```

```APIDOC
### verifyPersonalMessage

`verifyPersonalMessage(message: Uint8Array, signature: string | Uint8Array<ArrayBufferLike>): Promise<boolean>`

Verifies that the signature is valid for the provided PersonalMessage.

#### Parameters
* **message** (Uint8Array) - The personal message to verify.
* **signature** (string | Uint8Array<ArrayBufferLike>) - The signature to check.

#### Returns
* Promise<boolean> - A promise that resolves to true if the signature is valid, false otherwise.
```

```APIDOC
### verifyTransaction

`verifyTransaction(transaction: Uint8Array, signature: string | Uint8Array<ArrayBufferLike>): Promise<boolean>`

Verifies that the signature is valid for the provided Transaction.

#### Parameters
* **transaction** (Uint8Array) - The transaction data to verify.
* **signature** (string | Uint8Array<ArrayBufferLike>) - The signature to check.

#### Returns
* Promise<boolean> - A promise that resolves to true if the signature is valid, false otherwise.
```

```APIDOC
### verifyWithIntent

`verifyWithIntent(bytes: Uint8Array, signature: string | Uint8Array<ArrayBufferLike>, intent: IntentScope): Promise<boolean>`

Verifies a signature with a specific intent scope.

#### Parameters
* **bytes** (Uint8Array) - The data bytes to verify.
* **signature** (string | Uint8Array<ArrayBufferLike>) - The signature to check.
* **intent** (IntentScope) - The intent scope for the verification.

#### Returns
* Promise<boolean> - A promise that resolves to true if the signature is valid, false otherwise.
```

--------------------------------

### Request SUI from Faucet using requestSuiFromFaucetV2

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_sui

Example of requesting SUI tokens from the faucet for Devnet. It utilizes the 'requestSuiFromFaucetV2' function, specifying the faucet host obtained via 'getFaucetHost' and the recipient's address.

```typescript
import { getFaucetHost, requestSuiFromFaucetV2 } from '@mysten/sui/faucet';  
  
await requestSuiFromFaucetV2({
	host: getFaucetHost('devnet'),
	recipient: '0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231',
});
```

--------------------------------

### Get Margin Pool Supply Shares

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Fetches the total supply shares for a given margin pool. The 'coinKey' identifies the pool, and an optional 'decimals' parameter can be used to control the precision of the returned string.

```typescript
getMarginPoolSupplyShares(coinKey: string, decimals?: number): Promise<string>
```

--------------------------------

### Get Minimum Borrow Risk Ratio (TypeScript)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Fetches the minimum borrow risk ratio for a given deepbook pool. This function requires a `poolKey` as input and returns a Promise that resolves to a number representing the minimum risk ratio (e.g., 1.25 for 125%).

```typescript
import { getMinBorrowRiskRatio } from "@mysten/sdk";

async function fetchMinBorrowRisk(poolKey: string): Promise<number> {
  try {
    const minRiskRatio = await getMinBorrowRiskRatio(poolKey);
    return minRiskRatio;
  } catch (error) {
    console.error("Error fetching minimum borrow risk ratio:", error);
    throw error;
  }
}
```

--------------------------------

### MarginMaintainerContract Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginMaintainerContract

Initializes a new instance of the MarginMaintainerContract.

```APIDOC
## Constructor MarginMaintainerContract

### Description
Initializes a new instance of the MarginMaintainerContract.

### Method
Constructor

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
* **config** (DeepBookConfig) - Required - Configuration for MarginMaintainerContract

### Request Example
```json
{
  "config": "DeepBookConfig object"
}
```

### Response
#### Success Response (200)
* **MarginMaintainerContract** - An instance of the MarginMaintainerContract.

#### Response Example
```json
{
  "instance": "MarginMaintainerContract object"
}
```
```

--------------------------------

### Encode Blob Example

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_walrus.WalrusClient

Shows how to encode a blob into slivers for distribution. This function returns the blob ID, metadata, slivers, and root hash, which are essential for distributed storage.

```typescript
const { blobId, metadata, sliversByNode, rootHash } = await client.encodeBlob(blob);
```

--------------------------------

### Initialize and Show Connect Modal (Vanilla JS)

Source: https://sdk.mystenlabs.com/dapp-kit/web-components/connect-modal

Demonstrates how to initialize the dApp Kit and display the Connect Modal using a custom button trigger in Vanilla JavaScript. It sets up the dApp Kit instance and attaches an event listener to a button to programmatically open the modal.

```javascript
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
```

--------------------------------

### Get Margin Manager by Key

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookConfig

Fetches a MarginManager object based on the provided manager key. This allows for targeted access to margin management features.

```typescript
getMarginManager(managerKey: string): MarginManager
```

--------------------------------

### Get Margin Manager Base Balance

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the balance of the base asset for a given margin manager. You can specify the number of decimal places for the returned balance.

```APIDOC
## GET /margin-manager/base-balance

### Description
Get the base asset balance of a margin manager.

### Method
GET

### Endpoint
/margin-manager/base-balance

### Parameters
#### Query Parameters
- **marginManagerKey** (string) - Required - The key to identify the margin manager
- **decimals** (number) - Optional - Number of decimal places to show (default: 9)

### Response
#### Success Response (200)
- (string) - The base asset balance.

#### Response Example
```json
"100.5"
```
```

--------------------------------

### Handle Wallet Connection State with @mysten/dapp-kit-core

Source: https://sdk.mystenlabs.com/dapp-kit/actions/connect-wallet

Shows how to retrieve available wallets and subscribe to connection state changes using the dApp Kit's stores. It includes an example of attempting to connect a wallet and logging the connection status or errors.

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

--------------------------------

### Signer Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.cryptography.Signer

Initializes a new instance of the Signer class.

```APIDOC
## Constructors

### constructor
  * `new Signer()`: Signer

#### Returns
Signer
```

--------------------------------

### Get Margin Pool Min Borrow Amount

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Fetches the minimum borrow amount allowed for a margin pool. The 'coinKey' identifies the pool, and an optional 'decimals' parameter can be used to set the precision of the returned string.

```typescript
getMarginPoolMinBorrow(coinKey: string, decimals?: number): Promise<string>
```

--------------------------------

### Create and Share Kiosk (Sui SDK V2)

Source: https://sdk.mystenlabs.com/kiosk/from-v1

This code snippet illustrates how to create a new kiosk and share its capability using the new Kiosk SDK V2. It leverages the `KioskTransaction` class for a more streamlined and readable approach, requiring a pre-initialized SuiJsonRpcClient.

```typescript
import { kiosk, KioskTransaction } from '@mysten/kiosk';
import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';

// You need to do this only once and re-use it in the application.
const client = new SuiJsonRpcClient({
	url: getJsonRpcFullnodeUrl('mainnet'),
	network: 'mainnet',
}).$extend(kiosk());

const createKiosk = async () => {
	const tx = new Transaction();

	const kioskTx = new KioskTransaction({ transaction: tx, kioskClient: client.kiosk });

	kioskTx.create().shareAndTransferCap('0xSomeSuiAddress').finalize();

	// ... continue to sign and execute the transaction
};

```

--------------------------------

### Get Dynamic Field - TypeScript

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.client.CoreClient

Retrieves a dynamic field associated with an object. Requires GetDynamicFieldOptions.

```typescript
getDynamicField(options: GetDynamicFieldOptions): Promise<GetDynamicFieldResponse>
```

--------------------------------

### Get Margin Manager Deep Balance

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the DEEP token balance for a given margin manager. You can specify the number of decimal places for the returned balance.

```APIDOC
## GET /margin-manager/deep-balance

### Description
Get the DEEP token balance of a margin manager.

### Method
GET

### Endpoint
/margin-manager/deep-balance

### Parameters
#### Query Parameters
- **marginManagerKey** (string) - Required - The key to identify the margin manager
- **decimals** (number) - Optional - Number of decimal places to show (default: 6)

### Response
#### Success Response (200)
- (string) - The DEEP token balance.

#### Response Example
```json
"500.75"
```
```

--------------------------------

### createZkLoginNonce

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_enoki.EnokiClient

Generates a nonce for zkLogin authentication.

```APIDOC
### createZkLoginNonce
  * createZkLoginNonce(
input: CreateZkLoginNonceApiInput,
): Promise<CreateZkLoginNonceApiResponse>
#### Parameters
    * input: CreateZkLoginNonceApiInput
#### Returns Promise<CreateZkLoginNonceApiResponse>
```

--------------------------------

### Get the Primitive Value of an Object (JavaScript)

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_wallet-standard.ReadonlyUint8Array

The valueOf method returns the primitive value of a specified object. For arrays, it returns the array itself.

```javascript
const arr = [1, 2, 3];
console.log(arr.valueOf()); // [ 1, 2, 3 ]
```

--------------------------------

### Initialize PasskeyKeypair with BrowserPasskeyProvider

Source: https://sdk.mystenlabs.com/sui/cryptography/passkey

Creates a new PasskeyKeypair instance by initializing a BrowserPasskeyProvider. This involves specifying the relying party name and ID, and optionally configuring authenticator selection for cross-platform or platform-specific authenticators.

```typescript
const keypair = await PasskeyKeypair.getPasskeyInstance(
	new BrowserPasskeyProvider('Sui Passkey Example', {
		rpName: 'Sui Passkey Example',
		rpId: window.location.hostname,
		authenticatorSelection: {
			authenticatorAttachment: 'cross-platform', // or "platform"
		},
	} as BrowserPasswordProviderOptions),
);
```

--------------------------------

### Get Margin Manager Borrowed Quote Shares

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the amount of borrowed quote shares for a margin manager. The margin manager key is required for this operation.

```typescript
async getMarginManagerBorrowedQuoteShares(marginManagerKey: string): Promise<string>
```

--------------------------------

### Get Pool Book Parameters (SDK)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the trading parameters for a specified pool, including lot size, minimum size, and tick size. These parameters define the rules for placing trades within the pool. It takes the pool key and returns an object with these values.

```typescript
poolBookParams(
  poolKey: string,
): Promise<{ lotSize: number; minSize: number; tickSize: number }>
```

--------------------------------

### Get Margin Account Order Details

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginManagerContract

Retrieves detailed order information for a margin account associated with a margin manager. It fetches the balance manager and calls `get_account_order_details`.

```APIDOC
## GET /websites/sdk_mystenlabs/getMarginAccountOrderDetails

### Description
Get account order details for a margin manager. This retrieves the balance manager from the margin manager and calls get_account_order_details.

### Method
GET

### Endpoint
/websites/sdk_mystenlabs/getMarginAccountOrderDetails

### Parameters
#### Query Parameters
- **poolKey** (string) - Required - The key to identify the pool.
- **marginManagerId** (string) - Required - The ID of the margin manager.

### Response
#### Success Response (200)
- **tx** (Transaction) - A Transaction object representing the operation.
- **result** (TransactionResult) - The result of the transaction.

#### Response Example
```json
{
  "tx": "TransactionObject",
  "result": "TransactionResult"
}
```
```

--------------------------------

### Get Transaction Digest (TypeScript)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.transactions.TransactionDataBuilder

Retrieves the unique digest for a given transaction. The digest is a string representation that can be used to identify and track transactions on the blockchain.

```typescript
// Assuming a transaction object or its representation is available

// Example usage of getDigest
const transactionDigest: string = getDigest();

console.log(transactionDigest);
```

--------------------------------

### Get Quote Quantity In for Target Base Quantity

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Calculates the required quote quantity to obtain a target base quantity, with an option to pay fees using DEEP.

```APIDOC
## POST /websites/sdk_mystenlabs/getQuoteQuantityIn

### Description
Get the quote quantity in for a target base quantity, with an option to pay fees with DEEP.

### Method
POST

### Endpoint
/websites/sdk_mystenlabs/getQuoteQuantityIn

### Parameters
#### Request Body
- **poolKey** (string) - Required - The key to identify the pool
- **targetBaseQuantity** (number) - Required - Target base quantity
- **payWithDeep** (boolean) - Required - Whether to pay fees with DEEP

### Request Example
```json
{
  "poolKey": "string",
  "targetBaseQuantity": 0,
  "payWithDeep": true
}
```

### Response
#### Success Response (200)
- **tx** (Transaction) - A Transaction object
- **result** (TransactionResult) - The result of the transaction

#### Response Example
```json
{
  "tx": {},
  "result": {}
}
```
```

--------------------------------

### Import WebCryptoSigner Class

Source: https://sdk.mystenlabs.com/sui/cryptography/webcrypto-signer

Imports the WebCryptoSigner class from the installed package. This allows you to instantiate and use the signer in your client-side dApp.

```typescript
import { WebCryptoSigner } from '@mysten/signers/webcrypto';
```

--------------------------------

### Get Price Info Object

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves a price info object for a given coin key. This function requires a `Transaction` object and a `coinKey` string, returning a promise that resolves to a string representation of the price info.

```typescript
async getPriceInfoObject(tx: Transaction, coinKey: string): Promise<string>
```

--------------------------------

### Get Margin Manager Borrowed Base Shares

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the amount of borrowed base shares for a margin manager. This function requires the margin manager key.

```typescript
async getMarginManagerBorrowedBaseShares(marginManagerKey: string): Promise<string>
```

--------------------------------

### Get Referral Pool ID

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the pool ID associated with a given referral. This function helps in identifying the specific pool a referral is linked to.

```typescript
balanceManagerReferralPoolId(referral: string): Promise<string>
```

--------------------------------

### Get Margin Pool Object

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookConfig

Fetches a MarginPool object using its key. This method is useful for retrieving information or interacting with specific margin pools.

```typescript
getMarginPool(key: string): MarginPool
```

--------------------------------

### DeepBookContract Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Initializes a new instance of the DeepBookContract class.

```APIDOC
## Constructor DeepBookContract

### Description
Initializes a new instance of the DeepBookContract class.

### Method
`constructor`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
* **config** (DeepBookConfig) - Required - Configuration for DeepBookContract

### Request Example
```json
{
  "config": { ... } 
}
```

### Response
#### Success Response (200)
* **DeepBookContract** - An instance of the DeepBookContract class.

#### Response Example
```json
{
  "instance": "DeepBookContract object"
}
```
```

--------------------------------

### Get Object - TypeScript

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.client.CoreClient

Retrieves a specific object from the Sui network, with options to include related data. Requires GetObjectOptions.

```typescript
getObject<Include extends ObjectInclude = object>(
options: GetObjectOptions<Include>,
): Promise<GetObjectResponse<Include>>
```

--------------------------------

### Merge Coins using Sui SDK

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_sui

This code example demonstrates how to merge multiple coins into a single coin using the Sui SDK. It requires the object IDs of the coins to be merged and the ID of the coin to merge into.

```typescript
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';

// Generate a new Ed25519 Keypair
const keypair = new Ed25519Keypair();
const client = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
});

const tx = new Transaction();
tx.mergeCoins('0xe19739da1a701eadc21683c5b127e62b553e833e8a15a4f292f4f48b4afea3f2', [
	'0x127a8975134a4824d9288722c4ee4fc824cd22502ab4ad9f6617f3ba19229c1b',
]);
const result = await client.signAndExecuteTransaction({
	signer: keypair,
	transaction: tx,
});
console.log({ result });
```

--------------------------------

### Get Pool Liquidation Reward

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Fetches the liquidation reward for a deepbook pool. The function requires a `poolKey` to identify the pool and returns a promise that resolves to the liquidation reward as a decimal number.

```typescript
async getPoolLiquidationReward(poolKey: string): Promise<number>
```

--------------------------------

### Initialize MarginPoolContract

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginPoolContract

Initializes a new instance of the MarginPoolContract. It requires a DeepBookConfig object for configuration.

```typescript
import { Transaction, TransactionObjectArgument } from '@mysten/sui.js';
import { DeepBookConfig, MarginPoolContract } from '@mysten/deepbook-v3';

const config: DeepBookConfig = { /* ... your config ... */ };
const marginPoolContract = new MarginPoolContract(config);
```

--------------------------------

### Verify a Payment Record on Sui

Source: https://sdk.mystenlabs.com/payment-kit/getting-started

Shows how to query the Payment Kit to verify if a specific payment record exists on the Sui blockchain. This is useful for confirming successful transactions.

```typescript
// Query the payment record
const paymentRecord = await client.paymentKit.getPaymentRecord({
	nonce: crypto.randomUUID(),
	coinType: '0x2::sui::SUI',
	amount: 1n * MIST_PER_SUI,
	receiver,
});

if (paymentRecord) {
	console.log('Payment verified!');
	console.log('Transaction:', paymentRecord.paymentTransactionDigest);
	console.log('Epoch:', paymentRecord.epochAtTimeOfRecord);
} else {
	console.log('Payment not found');
}
```

--------------------------------

### Get Registered Wallets

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_wallet-standard.Wallets

Retrieves an array of all currently registered standard wallets. This method is synchronous and returns a read-only array.

```typescript
get(): readonly Wallet[]
```

--------------------------------

### PasskeyKeypair Usage for Signing

Source: https://sdk.mystenlabs.com/sui/cryptography/passkey

Demonstrates the standard usage of a PasskeyKeypair instance for cryptographic operations. This includes retrieving the public key, deriving the Sui address, signing personal messages, and signing transaction bytes, consistent with other keypair implementations in the SDK.

```typescript
const publicKey = keypair.getPublicKey();
const address = publicKey.toSuiAddress();

const message = new TextEncoder().encode('hello world');
const { signature } = await keypair.signPersonalMessage(message);

const txSignature = await passkey.signTransaction(txBytes);
```

--------------------------------

### Get Balance Manager by Key

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookConfig

Retrieves a BalanceManager object using its unique key. This method is essential for interacting with specific balance management functionalities within DeepBook.

```typescript
getBalanceManager(managerKey: string): BalanceManager
```

--------------------------------

### Get Margin Pool Max Utilization Rate

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the maximum utilization rate for a margin pool. The 'coinKey' identifies the pool, and the rate is returned as a decimal number (e.g., 0.95 for 95%).

```typescript
getMarginPoolMaxUtilizationRate(coinKey: string): Promise<number>
```

--------------------------------

### DeepBookConfig Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookConfig

Initializes a new instance of the DeepBookConfig class. It requires essential parameters like the network and address, and accepts optional parameters for managing balances, margins, and pools.

```typescript
new DeepBookConfig({
  address: string;
  adminCap?: string;
  balanceManagers?: { [key: string]: BalanceManager };
  coins?: CoinMap;
  marginAdminCap?: string;
  marginMaintainerCap?: string;
  marginManagers?: { [key: string]: MarginManager };
  marginPools?: MarginPoolMap;
  network: Network;
  pools?: PoolMap;
})
```

--------------------------------

### Get Margin Manager Assets

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Calculates and returns the base and quote assets for a given margin manager. Optionally, the number of decimal places for the output can be specified. The function requires the margin manager key.

```typescript
async getMarginManagerAssets(marginManagerKey: string, decimals?: number): Promise<{ baseAsset: string; quoteAsset: string }>
```

--------------------------------

### Get Margin Pool ID

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginManagerContract

Retrieves the margin pool ID associated with a margin manager, if one exists. Useful for verifying pool linkage.

```APIDOC
## GET /websites/sdk_mystenlabs/marginPoolId

### Description
Get the margin pool ID (if any) associated with a margin manager.

### Method
GET

### Endpoint
/websites/sdk_mystenlabs/marginPoolId

### Parameters
#### Query Parameters
- **poolKey** (string) - Required - The key to identify the pool.
- **marginManagerId** (string) - Required - The ID of the margin manager.

### Response
#### Success Response (200)
- **tx** (Transaction) - A Transaction object representing the operation.
- **result** (TransactionResult) - The result of the transaction.

#### Response Example
```json
{
  "tx": "TransactionObject",
  "result": "TransactionResult"
}
```
```

--------------------------------

### Get Margin Manager Borrowed Shares

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Fetches the borrowed shares for both base and quote assets for a given margin manager. The margin manager key is the sole required parameter.

```typescript
async getMarginManagerBorrowedShares(marginManagerKey: string): Promise<{ baseShares: string; quoteShares: string }>
```

--------------------------------

### Create and Share Kiosk (Sui SDK V1)

Source: https://sdk.mystenlabs.com/kiosk/from-v1

This code snippet demonstrates how to create a new kiosk and share its capability with a specific account address using the older Kiosk SDK V1. It involves importing a function and manipulating a Transaction object.

```typescript
import { createKioskAndShare } from '@mysten/kiosk';
import { Transaction } from '@mysten/sui/transactions';

const createKiosk = async () => {
	const accountAddress = '0xSomeSuiAddress';

	const tx = new Transaction();
	const kiosk_cap = createKioskAndShare(tx);

	tx.transferObjects([kiosk_cap], accountAddress);

	// ... continue to sign and execute the transaction
	// ...
};

```

--------------------------------

### Initialize Deepbook Client with Options

Source: https://sdk.mystenlabs.com/typedoc/functions/_mysten_deepbook-v3.deepbook

The 'deepbook' function initializes a Sui client for DeepBook integration. It accepts generic type parameters for naming and requires a DeepBookOptions object for configuration. The function returns a SuiClientRegistration object, enabling interaction with DeepBook functionalities.

```typescript
import { deepbook, DeepBookOptions, SuiClientRegistration, DeepBookCompatibleClient, DeepBookClient } from "@mysten/deepbook-v3";

// Example usage:
async function initializeDeepbook() {
  const options: DeepBookOptions<'myDeepbook'> = {
    // ... provide necessary options here ...
  };
  const registration: SuiClientRegistration<DeepBookCompatibleClient, 'myDeepbook', DeepBookClient> = deepbook<'myDeepbook'>(
    options
  );
  // Now you can use the registered client
  console.log(registration);
}
```

--------------------------------

### SealClientOptions Interface

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_seal.SealClientOptions

Defines the configuration options for initializing a SealClient. This includes server configurations, a compatible Sui client, optional network timeout, and an option to verify key servers.

```APIDOC
## Interface SealClientOptions

Configuration options for initializing a SealClient.

### Properties

*   **serverConfigs** (KeyServerConfig[]) - Required - An array of key server configurations, each including an objectId, weight, and optional API key name and API key.
*   **suiClient** (SealCompatibleClient) - Required - An instance of a Sui client compatible with Seal.
*   **timeout** (number) - Optional - The timeout in milliseconds for network requests.
*   **verifyKeyServers** (boolean) - Optional - A flag to determine whether to verify the authenticity of the key servers.
```

--------------------------------

### Get Lowest Trigger Above Price - TypeScript

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Fetches the lowest trigger price for 'trigger_above' type orders within a margin manager. Returns MAX_U64 if no such orders exist.

```typescript
/**
 * Get the lowest trigger price for trigger_above orders
 * Returns MAX_U64 if there are no trigger_above orders
 * @param marginManagerKey The key to identify the margin manager
 * @returns The lowest trigger above price
 */
async getLowestTriggerAbovePrice(marginManagerKey: string): Promise<bigint>
```

--------------------------------

### Get Balance Manager IDs by Owner

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves all balance manager IDs associated with a given owner address. It takes the owner's address as input and returns an array of strings.

```typescript
getBalanceManagerIds(owner: string): Promise<string[]>
```

--------------------------------

### Get Margin Manager DeepBook Pool ID

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Fetches the DeepBook pool ID that is linked to a specific margin manager. This function requires the margin manager key.

```typescript
async getMarginManagerDeepbookPool(marginManagerKey: string): Promise<string>
```

--------------------------------

### Get Latest Checkpoints with Sui SDK

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_sui

Fetches the latest 100 checkpoints in descending order and iterates through them to log transaction digests for each checkpoint. Requires the SuiGrpcClient.

```typescript
client.getCheckpoints({ descendingOrder: true }).then(function (checkpointPage: CheckpointPage) {
	console.log(checkpointPage);

	checkpointPage.data.forEach((checkpoint) => {
		console.log('---------------------------------------------------------------');
		console.log(
			' -----------   Transactions for Checkpoint:  ',
			checkpoint.sequenceNumber,
			' -------- ',
		);
		console.log('---------------------------------------------------------------');
		checkpoint.transactions.forEach((tx) => {
			console.log(tx);
		});
		console.log('***************************************************************');
	});
});
```

--------------------------------

### Create and Share Balance Manager

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.BalanceManagerContract

Creates a new BalanceManager and shares it.

```APIDOC
## POST /createAndShareBalanceManager

### Description
Create and share a new BalanceManager.

### Method
POST

### Endpoint
/createAndShareBalanceManager

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
N/A

### Request Example
```json
{}
```

### Response
#### Success Response (200)
- **tx** (Transaction) - A function that takes a Transaction object.

#### Response Example
```json
{
  "tx": "Transaction Function"
}
```
```

--------------------------------

### Get Output Quantities for Dry Run

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Calculates the output quantities for a given base and quote quantity in a pool, simulating a trade without execution. This function requires `poolKey`, `baseQuantity`, and `quoteQuantity`, returning an object with details of the potential trade, including `baseOut`, `quoteOut`, and `deepRequired`.

```typescript
async getQuantityOut(
  poolKey: string,
  baseQuantity: number,
  quoteQuantity: number,
): Promise<
  {
    baseOut: number;
    baseQuantity: number;
    deepRequired: number;
    quoteOut: number;
    quoteQuantity: number;
  },
>
```

--------------------------------

### Get Level 2 Order Book by Price Range

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Retrieves level 2 order book data within a specified price range (bid or ask orders).

```APIDOC
## POST /websites/sdk_mystenlabs/getLevel2Range

### Description
Get level 2 order book specifying range of price.

### Method
POST

### Endpoint
/websites/sdk_mystenlabs/getLevel2Range

### Parameters
#### Request Body
- **poolKey** (string) - Required - The key to identify the pool
- **priceLow** (number) - Required - Lower bound of the price range
- **priceHigh** (number) - Required - Upper bound of the price range
- **isBid** (boolean) - Required - Whether to get bid or ask orders

### Request Example
```json
{
  "poolKey": "string",
  "priceLow": 0,
  "priceHigh": 0,
  "isBid": true
}
```

### Response
#### Success Response (200)
- **tx** (Transaction) - A Transaction object

#### Response Example
```json
{
  "tx": {}
}
```
```

--------------------------------

### Get Highest Trigger Below Price - TypeScript

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Fetches the highest trigger price for 'trigger_below' type orders within a margin manager. Returns 0 if no such orders exist.

```typescript
/**
 * Get the highest trigger price for trigger_below orders
 * Returns 0 if there are no trigger_below orders
 * @param marginManagerKey The key to identify the margin manager
 * @returns The highest trigger below price
 */
async getHighestTriggerBelowPrice(marginManagerKey: string): Promise<bigint>
```

--------------------------------

### Get Margin Manager Margin Pool ID

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the margin pool ID associated with a specific margin manager. This can be null if no margin pool is associated.

```APIDOC
## GET /margin-manager/margin-pool-id

### Description
Get the margin pool ID associated with a margin manager.

### Method
GET

### Endpoint
/margin-manager/margin-pool-id

### Parameters
#### Query Parameters
- **marginManagerKey** (string) - Required - The key to identify the margin manager

### Response
#### Success Response (200)
- (string | null) - The margin pool ID, or null if not found.

#### Response Example
```json
"0xabc..."
```
```

--------------------------------

### Initialize ZkSendClient

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_zksend.ZkSendClient

Initializes a new ZkSendClient instance. Requires a ClientWithCoreApi instance and optionally accepts ZkSendOptions.

```typescript
new ZkSendClient(
  client: ClientWithCoreApi,
  options?: Omit<ZkSendOptions, "name">,
): ZkSendClient
```

--------------------------------

### Mint Item into Kiosk (Silent Creation)

Source: https://sdk.mystenlabs.com/kiosk/kiosk-client/kiosk-transaction/examples

Demonstrates minting an item into a Kiosk when the user does not already have one. The SDK handles the silent creation of a new Kiosk as part of the transaction. This function prepares and executes a transaction to create a kiosk and mint a 'hero' item into it.

```typescript
// Our mint function.
const mint = async () => {
	const tx = new Transaction();
	const kioskTx = new KioskTransaction({ kioskClient: client.kiosk, transaction: tx });

	// Creates a kiosk.
	kioskTx.create();

	// We'll assume it costs 1 SUI
	let coin = tx.splitCoins(tx.gas, [1_000_000_000]);

	// A function that mints directly into the kiosk.
	tx.moveCall({
		target: '0xMyGame::hero::mint',
		arguments: [
			coin, // the payment
			kioskTx.getKiosk(), // our kiosk that the hero will be placed in.
			kioskTx.getKioskCap(), // our kiosk cap, so that the function can place or lock it.
		],
	});

	kioskTx.shareAndTransferCap('0xAddressToTransferCapTo');
	kioskTx.finalize();

	// Sign and execute transaction.
	await signAndExecuteTransaction({ tx: tx });
};

```

--------------------------------

### AsyncCache Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.transactions.AsyncCache

Initializes a new instance of the AsyncCache.

```APIDOC
## Constructors

### constructor
  * new AsyncCache(): AsyncCache
#### Returns AsyncCache
```

--------------------------------

### slice

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_wallet-standard.ReadonlyUint8Array

The slice method returns a shallow copy of a portion of an array into a new array object selected from `start` to `end` where `end` is not included.

```APIDOC
## slice

### Description
Returns a section of an array as a new Uint8Array.

### Method
`slice`

### Endpoint
`slice(start?: number, end?: number): Uint8Array<ArrayBuffer>`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```javascript
const uint8Array = Uint8Array.from([1, 2, 3, 4, 5]);
const slicedArray = uint8Array.slice(1, 4);
// slicedArray is Uint8Array(3) [2, 3, 4]
```

### Response
#### Success Response (200)
- **Return Value** (Uint8Array<ArrayBuffer>) - A new Uint8Array containing the specified portion of the original array.

#### Response Example
```json
{
  "example": "Uint8Array(3) [2, 3, 4]"
}
```
```

--------------------------------

### EnokiClientConfig Interface

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_enoki.EnokiClientConfig

Defines the configuration object for initializing the Enoki client. It requires an API key and allows for optional settings like a custom API URL and the number of additional epochs for nonce validity.

```APIDOC
## Interface EnokiClientConfig

### Description
Defines the configuration object for initializing the Enoki client.

### Properties

#### `apiKey` (string) - Required

The API key for the Enoki app, available in the Enoki Portal.

#### `apiUrl` (string) - Optional

The API URL for Enoki. In most cases, this should not be set.

#### `additionalEpochs` (number) - Optional

The amount of epochs that you would like to have the nonce be valid for. Range: `0 <= value <= 30`

### Request Example
```json
{
  "apiKey": "YOUR_API_KEY",
  "apiUrl": "https://api.example.com",
  "additionalEpochs": 5
}
```

### Response Example
```json
{
  "message": "Configuration applied successfully."
}
```
```

--------------------------------

### Get Account Order Details

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves account order details for a specified margin manager. This function fetches the balance manager associated with the margin manager and returns the order details.

```APIDOC
## GET /accounts/orders

### Description
Get account order details for a margin manager. This retrieves the balance manager from the margin manager and returns order details.

### Method
GET

### Endpoint
/accounts/orders

### Parameters
#### Query Parameters
- **marginManagerKey** (string) - Required - The key to identify the margin manager

### Response
#### Success Response (200)
- **balance_manager_id** (string) - The ID of the balance manager.
- **client_order_id** (string) - The client-generated order ID.
- **epoch** (string) - The epoch number.
- **expire_timestamp** (string) - The timestamp when the order expires.
- **fee_is_deep** (boolean) - Indicates if the fee is deep.
- **filled_quantity** (string) - The quantity of the order that has been filled.
- **order_deep_price** (object) - Details about the deep price of the order.
  - **asset_is_base** (boolean) - True if the price is for the base asset.
  - **deep_per_asset** (string) - The deep price per asset.
- **order_id** (string) - The unique identifier for the order.
- **quantity** (string) - The total quantity of the order.
- **status** (number) - The status code of the order.

#### Response Example
```json
[
  {
    "balance_manager_id": "0x123...",
    "client_order_id": "client-123",
    "epoch": "100",
    "expire_timestamp": "1678886400",
    "fee_is_deep": true,
    "filled_quantity": "10.5",
    "order_deep_price": {
      "asset_is_base": true,
      "deep_per_asset": "1.2"
    },
    "order_id": "order-abc",
    "quantity": "20.0",
    "status": 1
  }
]
```
```

--------------------------------

### ClientCache Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.client.ClientCache

Initializes a new instance of the ClientCache class. It can optionally accept ClientCacheOptions.

```APIDOC
## Constructors

### constructor
  * new ClientCache(__namedParameters?: ClientCacheOptions): ClientCache
#### Parameters
    * __namedParameters: ClientCacheOptions = {}
#### Returns ClientCache
```

--------------------------------

### Get Account Order Details

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Retrieves account order details for a balance manager. This function requires poolKey and managerKey, returning a function that processes a Transaction object to yield a TransactionResult.

```typescript
function getAccountOrderDetails(
  poolKey: string,
  managerKey: string
): (tx: Transaction) => TransactionResult;
```

--------------------------------

### LedgerSigner Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_signers.ledger.LedgerSigner

Creates an instance of LedgerSigner. It's expected to call the static `fromDerivationPath` method to create an instance.

```APIDOC
## Constructor LedgerSigner

### Description
Creates an instance of LedgerSigner. It's expected to call the static `fromDerivationPath` method to create an instance.

### Method
`new LedgerSigner(__namedParameters: LedgerSignerOptions)`

### Parameters
#### Named Parameters
- **__namedParameters** (LedgerSignerOptions) - Options for the LedgerSigner.

### Returns
LedgerSigner

### Example
```typescript
const signer = await LedgerSigner.fromDerivationPath(derivationPath, options);
```
```

--------------------------------

### Get User Supply Shares (SDK)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the user's supply shares for a specific supplier cap in a margin pool. This function helps users understand their proportional share of the liquidity provided. It takes the coin key, supplier cap ID, and an optional number of decimals, returning the shares as a string.

```typescript
getUserSupplyShares(
  coinKey: string,
  supplierCapId: string,
  decimals?: number,
): Promise<string>
```

--------------------------------

### Basic Connect Button Usage (Vanilla JS)

Source: https://sdk.mystenlabs.com/dapp-kit/web-components/connect-button

Demonstrates the fundamental integration of the `<mysten-dapp-kit-connect-button>` Web Component in a vanilla JavaScript environment. It shows how to instantiate the component and assign the dAppKit instance to it.

```html
<mysten-dapp-kit-connect-button></mysten-dapp-kit-connect-button>

<script>
	const button = document.querySelector('mysten-dapp-kit-connect-button');
	   button.instance = dAppKit;
</script>
```

--------------------------------

### Get Window Outer Dimensions

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_wallet-standard.WalletEventsWindow

Retrieves the outer width and height of the browser window, including borders and toolbars. These are read-only properties.

```javascript
const windowOuterHeight = window.outerHeight;
const windowOuterWidth = window.outerWidth;

console.log(`Outer Height: ${windowOuterHeight}px`);
console.log(`Outer Width: ${windowOuterWidth}px`);
```

--------------------------------

### Get Current System State

Source: https://sdk.mystenlabs.com/sui/clients/core

Retrieves the current state of the Sui network, including epoch information and system state version.

```typescript
const systemState = await client.core.getCurrentSystemState();
console.log(systemState.epoch);
console.log(systemState.systemStateVersion);
```

--------------------------------

### Get Reference Gas Price - TypeScript

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.client.CoreClient

Retrieves the current reference gas price on the Sui network. Optionally accepts GetReferenceGasPriceOptions.

```typescript
getReferenceGasPrice(
options?: GetReferenceGasPriceOptions,
): Promise<GetReferenceGasPriceResponse>
```

--------------------------------

### Get Margin Manager IDs for Owner

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves an array of margin manager IDs associated with a given owner address. The owner's address is the required input parameter.

```typescript
async getMarginManagerIdsForOwner(owner: string): Promise<string[]>
```

--------------------------------

### SyncStore Interface

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_enoki.SyncStore

Provides methods to interact with the synchronized key-value store.

```APIDOC
## SyncStore Interface

### Description
An sync key-value store.

### Methods
- `delete(key: string): void`
- `get(key: string): string | null`
- `set(key: string, value: string): void`

## DELETE /syncstore

### Description
Deletes a value from the sync store using its key.

### Method
DELETE

### Endpoint
`/syncstore`

### Parameters
#### Query Parameters
- **key** (string) - Required - The key of the value to delete.

### Response
#### Success Response (200)
- **message** (string) - Indicates the success of the deletion operation.

#### Response Example
```json
{
  "message": "Key deleted successfully"
}
```

## GET /syncstore

### Description
Retrieves a value from the sync store using its key.

### Method
GET

### Endpoint
`/syncstore`

### Parameters
#### Query Parameters
- **key** (string) - Required - The key of the value to retrieve.

### Response
#### Success Response (200)
- **value** (string | null) - The value associated with the key, or null if the key is not found.

#### Response Example
```json
{
  "value": "retrieved_value"
}
```

## POST /syncstore

### Description
Sets a key-value pair in the sync store.

### Method
POST

### Endpoint
`/syncstore`

### Parameters
#### Request Body
- **key** (string) - Required - The key for the value.
- **value** (string) - Required - The value to store.

### Request Example
```json
{
  "key": "my_key",
  "value": "my_value"
}
```

### Response
#### Success Response (200)
- **message** (string) - Indicates the success of the set operation.

#### Response Example
```json
{
  "message": "Key-value pair set successfully"
}
```
```

--------------------------------

### Get Minimum Withdraw Risk Ratio (TypeScript)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the minimum withdraw risk ratio for a specified deepbook pool. It takes a `poolKey` and returns a Promise that resolves to a number indicating the minimum risk ratio required for withdrawal (e.g., 1.5 for 150%).

```typescript
import { getMinWithdrawRiskRatio } from "@mysten/sdk";

async function fetchMinWithdrawRisk(poolKey: string): Promise<number> {
  try {
    const minRiskRatio = await getMinWithdrawRiskRatio(poolKey);
    return minRiskRatio;
  } catch (error) {
    console.error("Error fetching minimum withdraw risk ratio:", error);
    throw error;
  }
}
```

--------------------------------

### Create DApp Kit Instance with Burner Wallet (JavaScript)

Source: https://sdk.mystenlabs.com/dapp-kit/dapp-kit-instance

Configures the DApp Kit instance for a development environment, enabling the burner wallet feature. This setup uses 'localnet' for the network and specifies the local gRPC endpoint, making it suitable for local testing and development.

```javascript
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

### SuiGraphQLClient Methods

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.graphql.SuiGraphQLClient

This section outlines the various methods available on the SuiGraphQLClient for interacting with the Sui blockchain via GraphQL.

```APIDOC
## Class SuiGraphQLClient

### Constructors

#### constructor

```typescript
new SuiGraphQLClient<Queries extends Record<string, GraphQLDocument>>(options: SuiGraphQLClientOptions<Queries>): SuiGraphQLClient<Queries>
```

**Parameters**

*   `options` (SuiGraphQLClientOptions<Queries>) - Configuration options for the client.

### Properties

*   **base** (BaseClient) - The base client instance.
*   **cache** (ClientCache) - The client's cache instance.
*   **core** (GraphQLCoreClient) - The core GraphQL client instance.
*   **network** (Network) - The network instance.

### Accessors

#### mvr

```typescript
get mvr(): MvrMethods
```

**Returns**

MvrMethods - An interface for MVR (Move Value Representation) methods.

### Methods

#### $extend

```typescript
$extend<Registrations extends SuiClientRegistration<SuiGraphQLClient<Queries>>[]>(...registrations: Registrations): ClientWithExtensions<...>
```

**Description**

Extends the SuiGraphQLClient with additional functionality provided by registrations.

**Type Parameters**

*   `Registrations` - An array of SuiClientRegistration objects.

**Parameters**

*   `...registrations` - Variable number of SuiClientRegistration objects to extend the client with.

**Returns**

ClientWithExtensions - A new client instance with extended capabilities.

#### defaultNameServiceName

```typescript
defaultNameServiceName(input: DefaultNameServiceNameOptions): Promise<DefaultNameServiceNameResponse>
```

**Description**

Resolves the default name service name based on the provided options.

**Parameters**

*   `input` (DefaultNameServiceNameOptions) - Options for resolving the name service name.

**Returns**

Promise<DefaultNameServiceNameResponse> - A promise that resolves to the name service response.

#### execute

```typescript
execute<Query extends string, Result = ..., Variables = ...>(query: Query, options: Omit<GraphQLQueryOptions<Result, Variables>, "query">): Promise<GraphQLQueryResult<Result>>
```

**Description**

Executes a GraphQL query against the Sui network.

**Type Parameters**

*   `Query` - The type of the query string.
*   `Result` - The expected result type of the query.
*   `Variables` - The expected variables type for the query.

**Parameters**

*   `query` (Query) - The GraphQL query string to execute.
*   `options` (Omit<GraphQLQueryOptions<Result, Variables>, "query">) - Options for the query execution, excluding the query itself.

**Returns**

Promise<GraphQLQueryResult<Result>> - A promise that resolves to the query result.

#### executeTransaction

```typescript
executeTransaction<Include extends TransactionInclude = {}>(input: ExecuteTransactionOptions<Include>): Promise<SuiClientTypes.TransactionResult<Include>>
```

**Description**

Executes a transaction on the Sui network.

**Type Parameters**

*   `Include` - Transaction inclusion options.

**Parameters**

*   `input` (ExecuteTransactionOptions<Include>) - Options for executing the transaction.

**Returns**

Promise<SuiClientTypes.TransactionResult<Include>> - A promise that resolves to the transaction result.

#### getBalance

```typescript
getBalance(input: GetBalanceOptions): Promise<GetBalanceResponse>
```

**Description**

Retrieves the balance for a given coin type.

**Parameters**

*   `input` (GetBalanceOptions) - Options for retrieving the balance.

**Returns**

Promise<GetBalanceResponse> - A promise that resolves to the balance information.

#### getDynamicField

```typescript
getDynamicField(input: GetDynamicFieldOptions): Promise<GetDynamicFieldResponse>
```

**Description**

Retrieves a dynamic field associated with an object.

**Parameters**

*   `input` (GetDynamicFieldOptions) - Options for retrieving the dynamic field.

**Returns**

Promise<GetDynamicFieldResponse> - A promise that resolves to the dynamic field data.

#### getMoveFunction

```typescript
getMoveFunction(input: GetMoveFunctionOptions): Promise<GetMoveFunctionResponse>
```

**Description**

Retrieves details about a Move function.

**Parameters**

*   `input` (GetMoveFunctionOptions) - Options for retrieving the Move function details.

**Returns**

Promise<GetMoveFunctionResponse> - A promise that resolves to the Move function information.

#### getObject

```typescript
getObject<Include extends ObjectInclude = {}>(input: GetObjectOptions<Include>): Promise<GetObjectResponse<Include>>
```

**Description**

Retrieves an object by its ID, with optional included data.

**Type Parameters**

*   `Include` - Specifies which related data to include in the response.

**Parameters**

*   `input` (GetObjectOptions<Include>) - Options for retrieving the object.

**Returns**

Promise<GetObjectResponse<Include>> - A promise that resolves to the object data.

#### getObjects

```typescript
getObjects(input: GetObjectsOptions): Promise<GetObjectsResponse>
```

**Description**

Retrieves multiple objects by their IDs.

**Parameters**

*   `input` (GetObjectsOptions) - Options for retrieving the objects.

**Returns**

Promise<GetObjectsResponse> - A promise that resolves to the list of objects.

#### getReferenceGasPrice

```typescript
getReferenceGasPrice(): Promise<GetReferenceGasPriceResponse>
```

**Description**

Retrieves the current reference gas price on the network.

**Returns**

Promise<GetReferenceGasPriceResponse> - A promise that resolves to the reference gas price.

#### getTransaction

```typescript
getTransaction(input: GetTransactionOptions): Promise<GetTransactionResponse>
```

**Description**

Retrieves details of a transaction by its ID.

**Parameters**

*   `input` (GetTransactionOptions) - Options for retrieving the transaction.

**Returns**

Promise<GetTransactionResponse> - A promise that resolves to the transaction details.

#### listBalances

```typescript
listBalances(input: ListBalancesOptions): Promise<ListBalancesResponse>
```

**Description**

Lists all balances for a given address.

**Parameters**

*   `input` (ListBalancesOptions) - Options for listing balances.

**Returns**

Promise<ListBalancesResponse> - A promise that resolves to the list of balances.

#### listCoins

```typescript
listCoins(input: ListCoinsOptions): Promise<ListCoinsResponse>
```

**Description**

Lists all coins of a specific coin type owned by an address.

**Parameters**

*   `input` (ListCoinsOptions) - Options for listing coins.

**Returns**

Promise<ListCoinsResponse> - A promise that resolves to the list of coins.

#### listDynamicFields

```typescript
listDynamicFields(input: ListDynamicFieldsOptions): Promise<ListDynamicFieldsResponse>
```

**Description**

Lists all dynamic fields associated with an object.

**Parameters**

*   `input` (ListDynamicFieldsOptions) - Options for listing dynamic fields.

**Returns**

Promise<ListDynamicFieldsResponse> - A promise that resolves to the list of dynamic fields.

#### listOwnedObjects

```typescript
listOwnedObjects(input: ListOwnedObjectsOptions): Promise<ListOwnedObjectsResponse>
```

**Description**

Lists all objects owned by a specific address, with optional filtering.

**Parameters**

*   `input` (ListOwnedObjectsOptions) - Options for listing owned objects.

**Returns**

Promise<ListOwnedObjectsResponse> - A promise that resolves to the list of owned objects.

#### query

```typescript
query<T>(options: GraphQLQueryOptions<T>): Promise<GraphQLQueryResult<T>>
```

**Description**

Executes a generic GraphQL query.

**Type Parameters**

*   `T` - The expected result type of the query.

**Parameters**

*   `options` (GraphQLQueryOptions<T>) - Options for the query execution.

**Returns**

Promise<GraphQLQueryResult<T>> - A promise that resolves to the query result.

#### resolveTransaction

```typescript
resolveTransaction(input: ResolveTransactionOptions): Promise<ResolveTransactionResponse>
```

**Description**

Resolves a transaction based on the provided options.

**Parameters**

*   `input` (ResolveTransactionOptions) - Options for resolving the transaction.

**Returns**

Promise<ResolveTransactionResponse> - A promise that resolves to the transaction resolution details.

#### signAndExecuteTransaction

```typescript
signAndExecuteTransaction(input: SignAndExecuteTransactionOptions): Promise<SuiClientTypes.TransactionResponse>
```

**Description**

Signs and executes a transaction.

**Parameters**

*   `input` (SignAndExecuteTransactionOptions) - Options for signing and executing the transaction.

**Returns**

Promise<SuiClientTypes.TransactionResponse> - A promise that resolves to the transaction response.

#### simulateTransaction

```typescript
simulateTransaction(input: SimulateTransactionOptions): Promise<SimulateTransactionResponse>
```

**Description**

Simulates a transaction without executing it.

**Parameters**

*   `input` (SimulateTransactionOptions) - Options for simulating the transaction.

**Returns**

Promise<SimulateTransactionResponse> - A promise that resolves to the simulation result.

#### verifyZkLoginSignature

```typescript
verifyZkLoginSignature(input: VerifyZkLoginSignatureOptions): Promise<VerifyZkLoginSignatureResponse>
```

**Description**

Verifies a ZkLogin signature.

**Parameters**

*   `input` (VerifyZkLoginSignatureOptions) - Options for verifying the ZkLogin signature.

**Returns**

Promise<VerifyZkLoginSignatureResponse> - A promise that resolves to the verification result.

#### waitForTransaction

```typescript
waitForTransaction(input: WaitForTransactionOptions): Promise<TransactionEffects & { digest: string }>
```

**Description**

Waits for a transaction to be confirmed on the network.

**Parameters**

*   `input` (WaitForTransactionOptions) - Options for waiting for the transaction.

**Returns**

Promise<TransactionEffects & { digest: string }> - A promise that resolves when the transaction is confirmed.
```

--------------------------------

### Mint Item into Kiosk (User Has Kiosk)

Source: https://sdk.mystenlabs.com/kiosk/kiosk-client/kiosk-transaction/examples

Demonstrates minting an item directly into a user's existing Kiosk. It assumes the user has already connected their wallet and retrieved their Kiosk Owner Capability. This function prepares and executes a transaction to mint a 'hero' item.

```typescript
const connectedAddress = '0xAnAddress';

// This function should run when the user connects the wallet.
// We should re-use the same client instance throughout our dApp.
const getCap = async () => {
	let { kioskOwnerCaps } = await client.kiosk.getOwnedKiosks({ address: connectedAddress });
	// Assume that the user has only 1 kiosk.
	// Here, you need to do some more checks in a realistic scenario.
	// And possibly give the user in our dApp a kiosk selector to choose which one they want to interact with (if they own more than one).
	return kioskOwnerCaps[0];
};

// The mint function could be like the following.
const mint = async () => {
	const tx = new Transaction();
	const kioskTx = new KioskTransaction({
		kioskClient: client.kiosk,
		transaction: tx,
		cap: await getCap(),
	});

	// Assume it costs one SUI
	let coin = tx.splitCoins(tx.gas, [1_000_000_000]);

	// A function that mints directly into the kiosk.
	tx.moveCall({
		target: '0xMyGame::hero::mint',
		arguments: [
			coin, // the payment
			kioskTx.getKiosk(), // our kiosk that the hero will be placed in.
			kioskTx.getKioskCap(), // our kiosk cap, so that the function can place or lock it.
		],
	});

	kioskTx.finalize();

	// Sign and execute transaction.
	await signAndExecuteTransaction({ tx: tx });
};

```

--------------------------------

### Current Network Store Usage (JavaScript)

Source: https://sdk.mystenlabs.com/dapp-kit/state

Demonstrates how to get the currently selected network from the dApp Kit and subscribe to changes in the network. It also notes that this store is read-only and network switching is done via `dAppKit.switchNetwork()`.

```javascript
const currentNetwork = dAppKit.stores.$currentNetwork.get(); // 'mainnet' | 'testnet' | ...

// Subscribe to network changes
dAppKit.stores.$currentNetwork.subscribe((network) => {
	console.log('Switched to network:', network);
});

// Note: This store is read-only. Use dAppKit.switchNetwork() to change networks.
```

--------------------------------

### Get Balance Manager Referral ID

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the referral ID for a balance manager within a specific pool. It returns the referral ID string or null if no referral is set.

```typescript
getBalanceManagerReferralId(managerKey: string, poolKey: string): Promise<string | null>
```

--------------------------------

### Purchase Item with Transfer Policies (Mysten SDK V1)

Source: https://sdk.mystenlabs.com/kiosk/from-v1

This snippet demonstrates purchasing an item using the older Mysten SDK V1. It involves querying transfer policies, initializing a transaction, and optionally placing the item in a personal kiosk if no lock rule is present. Dependencies include '@mysten/kiosk' and '@mysten/sui/jsonRpc'.

```typescript
import {
	queryTransferPolicy,
	purchaseAndResolvePolicies,
	place,
	testnetEnvironment,
} from '@mysten/kiosk';
import { SuiJsonRpcClient } from '@mysten/sui/jsonRpc';

const client = new SuiJsonRpcClient({
	url: 'https://fullnode.testnet.sui.io:443',
});

// The kiosk we're purchasing from.
const kioskId = `0xSomeKioskAddress`;
// A sample item retrieved from `fetchKiosk` function (or hard-coded).
const item = {
	isLocked: false,
	objectId: '0xb892d61a9992a10c9453efcdbd14ca9720d7dc1000a2048224209c9e544ed223',
	type: '0x52852c4ba80040395b259c641e70b702426a58990ff73cecf5afd31954429090::test::TestItem',
	listing: {
		isExclusive: false,
		listingId: '0x368b512ff2514dbea814f26ec9a3d41198c00e8ed778099961e9ed22a9f0032b',
		price: '20000000000', // in MIST
	},
};
const ownedKiosk = `0xMyKioskAddress`;
const ownedKioskCap = `0xMyKioskOwnerCap`;

const purchaseItem = async (item, kioskId) => {
	// Fetch the policy of the item (could be an array, if there's more than one transfer policy)
	const policies = await queryTransferPolicy(client, item.type);
	// Selecting the first one for simplicity.
	const policyId = policy[0]?.id;
	// Initialize transaction.
	const tx = new Transaction();

	// Both are required if there is a `kiosk_lock_rule`.
	// Optional otherwise. Function throws an error if there's a kiosk_lock_rule and these are missing.
	const extraParams = {
		ownedKiosk,
		ownedKioskCap,
	};
	// Define the environment.
	// To use a custom package address for rules, you could call:
	// const environment = customEnvironment('<PackageAddress>');
	const environment = testnetEnvironment;

	// Extra params. Optional, but required if the user tries to resolve a `kiosk_lock_rule`.
	// Purchases the item. Supports `kiosk_lock_rule`, `royalty_rule` (accepts combination too).
	const result = purchaseAndResolvePolicies(
		tx,
		item.type,
		item.listing.price,
		kioskId,
		item.objectId,
		policy[0],
		environment,
		extraParams,
	);

	// result = {item: <the_purchased_item>, canTransfer: true/false // depending on whether there was a kiosk lock rule }
	// If the item didn't have a kiosk_lock_rule, you need to do something with it.
	// For example, place it in your own kiosk. (demonstrated below)
	if (result.canTransfer) place(tx, item.type, ownedKiosk, ownedKioskCap, result.item);

	// ...finally, sign PTB & execute it.
};

```

--------------------------------

### EnokiKeypair Transaction Execution

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_enoki.EnokiKeypair

The `signAndExecuteTransaction` method allows for signing a transaction and immediately executing it. This method takes `SignAndExecuteOptions` as input and returns a promise that resolves with the transaction result, including effects and transaction details.

```typescript
signAndExecuteTransaction(
__namedParameters: SignAndExecuteOptions,
): Promise<SuiClientTypes.TransactionResult<{ effects: true; transaction: true }>>
```

--------------------------------

### BcsEnum Class Overview

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.bcs.BcsEnum

Provides an overview of the BcsEnum class, its type parameters, and its inheritance hierarchy.

```APIDOC
## Class BcsEnum<T, Name>

#### Type Parameters
  * T extends Record<string, BcsType<any> | null>
  * const Name extends string = string

#### Hierarchy (View Summary, Expand)
  * BcsType<
EnumOutputShape<
{
  [K in keyof T]: T[K] extends BcsType<infer U, any> ? U : true
},
EnumInputShape<
{
  [K in keyof T]: T[K] extends BcsType<any, infer U, any> ? U : boolean | object | null
},
Name
>
>
    * BcsEnum
```

--------------------------------

### Get Scroll Position

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_wallet-standard.WalletEventsWindow

Returns the number of pixels the document is scrolled horizontally (scrollX) and vertically (scrollY). These are read-only properties.

```javascript
const horizontalScroll = window.scrollX;
const verticalScroll = window.scrollY;

console.log(`Scrolled Horizontally: ${horizontalScroll}px`);
console.log(`Scrolled Vertically: ${verticalScroll}px`);
```

--------------------------------

### Fetch Protocol Configuration with Sui Client SDK

Source: https://sdk.mystenlabs.com/typedoc/functions/_mysten_dapp-kit.useSuiClientQueries

Retrieves the current protocol configuration for the Sui network. This includes various network parameters and settings.

```typescript
{
  method: "getProtocolConfig",
  options?: UseSuiClientQueryOptions<"getProtocolConfig", unknown>;
  params: GetProtocolConfigParams;
}
```

--------------------------------

### Get Screen Information

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_wallet-standard.WalletEventsWindow

Retrieves information about the user's screen, such as its dimensions and the window's position relative to the screen. These are read-only properties.

```javascript
const screenInfo = window.screen;
const screenLeftPosition = window.screenLeft;
const screenTopPosition = window.screenTop;

console.log("Screen object:", screenInfo);
console.log(`Screen Left: ${screenLeftPosition}px`);
console.log(`Screen Top: ${screenTopPosition}px`);
```

--------------------------------

### Create Balance Manager With Owner

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.BalanceManagerContract

Creates a new BalanceManager and allows manual setting of the owner.

```APIDOC
## POST /createBalanceManagerWithOwner

### Description
Create a new BalanceManager, manually set the owner. Returns the manager.

### Method
POST

### Endpoint
/createBalanceManagerWithOwner

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
- **ownerAddress** (string) - Required - The address of the owner.

### Request Example
```json
{
  "ownerAddress": "string"
}
```

### Response
#### Success Response (200)
- **tx** (Transaction) - A function that takes a Transaction object.
- **result** (TransactionResult) - The result of the transaction, containing the new BalanceManager.

#### Response Example
```json
{
  "tx": "Transaction Function",
  "result": "TransactionResult"
}
```
```

--------------------------------

### Get Owned Objects using Sui SDK

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_sui

This snippet demonstrates how to fetch all objects owned by a specific Sui address using the Sui SDK. It requires initializing a Sui gRPC client and then calling the `getOwnedObjects` method with the owner's address.

```typescript
import { SuiGrpcClient } from '@mysten/sui/grpc';

const client = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
});

const objects = await client.getOwnedObjects({
	owner: '0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231',
});
```

--------------------------------

### Get ZkSend Link (Synchronous)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_zksend.ZkSendClient

Retrieves a ZkSendLink object synchronously without loading its associated assets. Accepts LoadLinkOptions as input.

```typescript
getLink(options: LoadLinkOptions): ZkSendLink
```

--------------------------------

### Get Margin Manager Base Balance

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Fetches the balance of the base asset for a margin manager. An optional 'decimals' parameter can be provided to control the precision of the returned balance. The margin manager key is a required parameter.

```typescript
async getMarginManagerBaseBalance(marginManagerKey: string, decimals?: number): Promise<string>
```

--------------------------------

### Query Kiosk Extension

Source: https://sdk.mystenlabs.com/kiosk/kiosk-client/querying

Queries an extension's data for a given kiosk. Returns `null` if there's no extension with the specified type installed.

```APIDOC
## GET /kiosk/extension

### Description
Queries an extension's data for a given kiosk. Returns `null` if there's no extension with that type installed.

### Method
GET

### Endpoint
`/kiosk/extension`

### Parameters
#### Query Parameters
- **kioskId** (string) - Required - The ID of the kiosk.
- **type** (string) - Required - The type of the custom extension.

### Request Example
```javascript
const type = '0xAddress::custom_extension::ACustomExtensionType';
const extension = await client.kiosk.getKioskExtension({
	kioskId: '0xAKioskId',
	type,
});
console.log(extension);
```

### Response
#### Success Response (200)
- **objectId** (string) - The object ID of the extension.
- **type** (string) - The type of the extension.
- **isEnabled** (boolean) - Indicates if the extension is enabled.
- **permissions** (string) - The permissions for the extension.
- **storageId** (string) - The storage ID for the extension's data.
- **storageSize** (string) - The size of the extension's storage.

#### Response Example
```json
{
  "objectId": "extensionObjectId",
  "type": "0xAddress::custom_extension::ACustomExtensionType",
  "isEnabled": true,
  "permissions": "3",
  "storageId": "0xExampleStorageId",
  "storageSize": "0"
}
```
```

--------------------------------

### Get Mid Price (SDK)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Fetches the current mid-price for a given pool. The mid-price is the average of the best bid and ask prices and is a key indicator of the asset's current market value. It requires the pool key and returns the price as a number.

```typescript
midPrice(poolKey: string): Promise<number>
```

--------------------------------

### Process an Ephemeral Payment in Sui

Source: https://sdk.mystenlabs.com/payment-kit/getting-started

Demonstrates how to process an ephemeral payment using the Payment Kit. This method is suitable when duplicate prevention or persistent storage is not required, offering lower gas costs.

```typescript
const tx = client.paymentKit.tx.processEphemeralPayment({
	nonce: crypto.randomUUID(),
	coinType: '0x2::sui::SUI',
	amount: 1n * MIST_PER_SUI,
	receiver,
	sender: sender,
});

const result = await client.signAndExecuteTransaction({
	transaction: tx,
	signer: keypair,
});

// Check transaction status
if (result.$kind === 'FailedTransaction') {
	throw new Error(`Ephemeral payment failed: ${result.FailedTransaction.status.error?.message}`);
}

console.log('Ephemeral payment processed:', result.Transaction.digest);
```

--------------------------------

### Get Conditional Order IDs - TypeScript

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves all conditional order IDs associated with a specific margin manager. This function is crucial for managing and tracking conditional orders.

```typescript
/**
 * Get all conditional order IDs for a margin manager
 * @param marginManagerKey The key to identify the margin manager
 * @returns Array of conditional order IDs
 */
async getConditionalOrderIds(marginManagerKey: string): Promise<string[]>
```

--------------------------------

### placeLimitOrder

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Places a limit order with specified parameters.

```APIDOC
## POST /websites/sdk_mystenlabs/placeLimitOrder

### Description
Place a limit order.

### Method
POST

### Endpoint
/websites/sdk_mystenlabs/placeLimitOrder

### Parameters
#### Request Body
- **params** (PlaceLimitOrderParams) - Required - Parameters for placing a limit order

### Response
#### Success Response (200)
- **tx** (Transaction) - A function that takes a Transaction object
```

--------------------------------

### Get Transaction API

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.client.CoreClient

Fetches the details of a specific transaction by its ID. Supports including various transaction-related objects in the response.

```APIDOC
## GET /transactions/{digest}

### Description
Fetches the details of a specific transaction by its digest.

### Method
GET

### Endpoint
/transactions/{digest}

### Parameters
#### Path Parameters
- **digest** (string) - Required - The digest of the transaction to retrieve.
#### Query Parameters
- **options** (GetTransactionOptions) - Optional - Options to customize the transaction details returned, such as including effects or events.

### Response
#### Success Response (200)
- **digest** (string) - The transaction digest.
- **data** (object) - The transaction data.
- **effects** (object) - The transaction effects.
- **events** (object) - The transaction events.

#### Response Example
```json
{
  "digest": "some_digest",
  "data": {},
  "effects": {},
  "events": {}
}
```
```

--------------------------------

### Place Limit Order Parameters

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_deepbook-v3.PlaceLimitOrderParams

Defines the parameters required to place a limit order. This includes details about the order itself, such as price, quantity, and type, as well as information about the balance manager, client order ID, and pool.

```APIDOC
## Interface PlaceLimitOrderParams

### Description
Parameters for placing a limit order on Deepbook.

### Properties

#### balanceManagerKey
- **Type**: `string`
- **Description**: The key for the balance manager.
- **Required**: Yes

#### clientOrderId
- **Type**: `string`
- **Description**: A unique identifier for the client's order.
- **Required**: Yes

#### expiration
- **Type**: `number` | `bigint`
- **Description**: Optional expiration time for the order.
- **Required**: No

#### isBid
- **Type**: `boolean`
- **Description**: `true` if the order is a bid (buy), `false` if it's an ask (sell).
- **Required**: Yes

#### orderType
- **Type**: `OrderType`
- **Description**: The type of order (e.g., limit, market). This is optional and may default to a specific type.
- **Required**: No

#### payWithDeep
- **Type**: `boolean`
- **Description**: Optional flag to indicate if payment should be made with DEEP tokens.
- **Required**: No

#### poolKey
- **Type**: `string`
- **Description**: The key identifying the liquidity pool for the order.
- **Required**: Yes

#### price
- **Type**: `number`
- **Description**: The price at which the order should be executed.
- **Required**: Yes

#### quantity
- **Type**: `number`
- **Description**: The amount of the asset to be traded.
- **Required**: Yes

#### selfMatchingOption
- **Type**: `SelfMatchingOptions`
- **Description**: Optional configuration for self-matching behavior.
- **Required**: No

### Request Example
```json
{
  "balanceManagerKey": "0x123...",
  "clientOrderId": "my-unique-order-id-123",
  "isBid": true,
  "poolKey": "0xabc...",
  "price": 1.50,
  "quantity": 100
}
```

### Response Example (Success)
```json
{
  "orderId": "0xdef...",
  "status": "placed"
}
```
```

--------------------------------

### Get Margin Pool Minimum Borrow Amount

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginPoolContract

Retrieves the minimum amount that can be borrowed from a margin pool. This function requires the pool's coin key.

```typescript
const coinKey = 'USDC';
const txResult = marginPoolContract.minBorrow(coinKey)(new Transaction());
// txResult will be a TransactionResult object
```

--------------------------------

### Delete Blob Transaction Example

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_walrus.WalrusClient

Illustrates the creation of a transaction to delete a blob. It requires the blob's object ID and the owner address to which the storage resource should be returned.

```typescript
const tx = client.deleteBlobTransaction({ blobObjectId, owner });
```

--------------------------------

### Get Margin Pool Supply Cap

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginPoolContract

Fetches the supply cap for a margin pool, indicating the maximum amount that can be supplied. The coin key is used to specify the pool.

```typescript
const coinKey = 'USDC';
const txResult = marginPoolContract.supplyCap(coinKey)(new Transaction());
// txResult will be a TransactionResult object
```

--------------------------------

### Updating UI with dApp Kit State Changes (JavaScript)

Source: https://sdk.mystenlabs.com/dapp-kit/state

Provides examples of subscribing to connection and network state changes from the dApp Kit and updating specific DOM elements to reflect the current connection status and network.

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

### WindowRegisterWalletEvent

Source: https://sdk.mystenlabs.com/typedoc/types/_mysten_wallet-standard.WindowRegisterWalletEvent

Details the WindowRegisterWalletEvent, which is dispatched on the `window` by wallets when they are ready for registration. Applications should listen for this event to register available wallets.

```APIDOC
## Type Alias WindowRegisterWalletEvent

### Description

Event that will be dispatched on the `window` by each Wallet when the Wallet is ready to be registered by the app. The app must listen for this event, and register Wallets when the event is dispatched.

### Method

N/A (Event Dispatch)

### Endpoint

N/A (Browser Event)

### Parameters

This event is a custom event (`UnstoppableCustomEvent`) and its specific payload structure depends on the `WindowRegisterWalletEventType` and `WindowRegisterWalletEventCallback` definitions, which are not detailed here.

### Request Example

N/A

### Response

N/A

### Error Handling

N/A
```

--------------------------------

### Get Ed25519 Key Scheme

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.keypairs_ed25519.Ed25519Keypair

Retrieves the signature scheme associated with the Ed25519 keypair. This method returns the SignatureScheme enum value, which will be ED25519.

```typescript
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { SignatureScheme } from "@mysten/sui/cryptography";

// Assume keypair is already initialized
const keypair = new Ed25519Keypair();

const keyScheme: SignatureScheme = keypair.getKeyScheme();

console.log("Key Scheme:", keyScheme); // Expected output: SignatureScheme.ED25519
```

--------------------------------

### Get Balance API

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_sui.client.SuiClientTypes.GetBalanceOptions

Retrieves the balance of a specific coin type for a given owner on the Sui network. It allows for optional filtering by coin type and provides an option to use an AbortSignal for request cancellation.

```APIDOC
## GET /balance

### Description
Retrieves the balance of a specific coin type for a given owner. Supports optional coin type and cancellation via AbortSignal.

### Method
GET

### Endpoint
/balance

### Parameters
#### Query Parameters
- **owner** (string) - Required - The address of the owner whose balance is to be retrieved.
- **coinType** (string) - Optional - The specific type of coin to query the balance for. Defaults to `0x2::sui::SUI` if not provided.
- **signal** (AbortSignal) - Optional - An AbortSignal to cancel the request.

### Request Example
```json
{
  "owner": "0x123...abc",
  "coinType": "0x2::sui::SUI"
}
```

### Response
#### Success Response (200)
- **balance** (string) - The balance of the specified coin type for the owner.

#### Response Example
```json
{
  "balance": "1000000"
}
```
```

--------------------------------

### BcsTuple Class Overview

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.bcs.BcsTuple

Provides a comprehensive overview of the BcsTuple class, including its type parameters, hierarchy, and available constructors, properties, and methods.

```APIDOC
## Class BcsTuple<T, Name>

#### Type Parameters
  * const T extends readonly BcsType<any>[]
  * const Name extends string = `(${JoinString<  
{ [K in keyof T]: T[K] extends BcsType<any, any, infer T> ? T : never },  
", ",  
>})`

#### Hierarchy (View Summary, Expand)
  * BcsType<  
{  
-readonly [K in keyof T]: T[K] extends BcsType<infer T, any>  
? T  
: never  
},  
{ [K in keyof T]: T[K] extends BcsType<any, infer T> ? T : never },  
Name,  
>
    * BcsTuple

##### Index
### Constructors
constructor
### Properties
$inferInput $inferType name read serializedSize validate
### Methods
fromBase58 fromBase64 fromHex parse serialize transform write
```

--------------------------------

### Get Margin Pool Protocol Spread

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginPoolContract

Retrieves the protocol spread for a margin pool. This represents a fee or percentage retained by the protocol. The coin key identifies the pool.

```typescript
const coinKey = 'USDC';
const txResult = marginPoolContract.protocolSpread(coinKey)(new Transaction());
// txResult will be a TransactionResult object
```

--------------------------------

### Get Move Function Definition

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.transactions.ObjectCache

Fetches the definition of a Move function from the blockchain. It requires a reference object containing the package, module, and function name. Returns the function definition or null if not found.

```typescript
/**
 * Retrieves the definition of a Move function.
 * @param {{ function: string; module: string; package: string }} ref - Reference to the Move function.
 * @returns {Promise<MoveFunctionCacheEntry | null>} A promise that resolves with the function definition or null.
 */
getMoveFunctionDefinition(
  ref: { function: string; module: string; package: string },
): Promise<MoveFunctionCacheEntry | null>;
```

--------------------------------

### Get Next Epoch Pool Trade Parameters (MystenLabs SDK)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Fetches the trading parameters for the next epoch of a given pool. This is useful for anticipating upcoming fee structures and stake requirements. Similar to `poolTradeParams`, it requires a `poolKey` and returns an object with `makerFee`, `stakeRequired`, and `takerFee` for the subsequent epoch.

```typescript
poolTradeParamsNext(poolKey: string): Promise<{ makerFee: number; stakeRequired: number; takerFee: number }>
```

--------------------------------

### DeepBookAdminContract Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookAdminContract

Initializes a new instance of DeepBookAdminContract. It requires a DeepBookConfig object for configuration. This constructor sets up the contract instance for administrative operations.

```typescript
new DeepBookAdminContract(config: DeepBookConfig): DeepBookAdminContract
```

--------------------------------

### Get Quote Balance

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginManagerContract

Fetches the quote asset balance for a margin manager within a specific pool. This function requires the poolKey and marginManagerId and returns a transaction-processing function that yields a TransactionResult.

```typescript
quoteBalance(
  poolKey: string,
  marginManagerId: string,
): (tx: Transaction) => TransactionResult
```

--------------------------------

### Get Margin Manager Balance Manager ID

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the unique identifier for the balance manager associated with a specific margin manager. This function requires the margin manager key as input.

```typescript
async getMarginManagerBalanceManagerId(marginManagerKey: string): Promise<string>
```

--------------------------------

### Get Margin Manager DEEP Balance

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the DEEP token balance associated with a margin manager. The number of decimal places for the balance can be optionally specified. The margin manager key is required.

```typescript
async getMarginManagerDeepBalance(marginManagerKey: string, decimals?: number): Promise<string>
```

--------------------------------

### Get Reference Gas Price

Source: https://sdk.mystenlabs.com/sui/clients/core

Fetches the current reference gas price for the network. This is a bigint value representing the cost of gas.

```typescript
const { referenceGasPrice } = await client.core.getReferenceGasPrice();
console.log(referenceGasPrice); // bigint
```

--------------------------------

### Initialize ParallelTransactionExecutor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.transactions.ParallelTransactionExecutor

Constructs a new instance of ParallelTransactionExecutor. It requires an options object to configure its behavior, such as setting up connections or defining execution strategies.

```typescript
new ParallelTransactionExecutor(options: ParallelTransactionExecutorOptions)
```

--------------------------------

### Get Account Order Details for Margin Manager

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves detailed information about account orders for a specified margin manager. It fetches the balance manager associated with the margin manager to return order details. Dependencies include the margin manager key.

```typescript
async getAccountOrderDetails(marginManagerKey: string): Promise<Array<{
  balance_manager_id: string;
  client_order_id: string;
  epoch: string;
  expire_timestamp: string;
  fee_is_deep: boolean;
  filled_quantity: string;
  order_deep_price: { asset_is_base: boolean; deep_per_asset: string };
  order_id: string;
  quantity: string;
  status: number;
}>>
```

--------------------------------

### Get System State (TypeScript)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_walrus.WalrusClient

Fetches the current system state of the walrus contract. This includes detailed information about the network's committee, deny list, event blob certification, future accounting, and storage pricing.

```typescript
import { getClient } from "./client";

async function getSystemState() {
  const client = getClient();
  const systemState = await client.systemState();
  console.log(systemState);
  return systemState;
}
```

--------------------------------

### AsyncCache Methods

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.transactions.AsyncCache

Provides documentation for various methods of the AsyncCache class, including adding, retrieving, and deleting cached items.

```APIDOC
## Methods

### addMoveFunctionDefinition
  * addMoveFunctionFunctionDefinition(
functionEntry: MoveFunctionCacheEntry,
): Promise<
{
function: string;
module: string;
package: string;
parameters: OpenSignature[];
},
>
#### Parameters
    * functionEntry: MoveFunctionCacheEntry
#### Returns Promise<
{
function: string;
module: string;
package: string;
parameters: OpenSignature[];
},
>

### addObject
  * addObject(object: ObjectCacheEntry): Promise<ObjectCacheEntry>
#### Parameters
    * object: ObjectCacheEntry
#### Returns Promise<ObjectCacheEntry>

### addObjects
  * addObjects(objects: ObjectCacheEntry[]): Promise<void>
#### Parameters
    * objects: ObjectCacheEntry[]
#### Returns Promise<void>

### clear
  * clear<T extends keyof CacheEntryTypes>(type?: T): Promise<void>
#### Type Parameters
    * T extends keyof CacheEntryTypes
#### Parameters
    * `Optional`type: T
#### Returns Promise<void>

### delete
  * delete<T extends keyof CacheEntryTypes>(type: T, key: string): Promise<void>
#### Type Parameters
    * T extends keyof CacheEntryTypes
#### Parameters
    * type: T
    * key: string
#### Returns Promise<void>

### deleteCustom
  * deleteCustom(key: string): Promise<void>
#### Parameters
    * key: string
#### Returns Promise<void>

### deleteMoveFunctionDefinition
  * deleteMoveFunctionDefinition(
ref: { function: string; module: string; package: string },
): Promise<void>
#### Parameters
    * ref: { function: string; module: string; package: string }
#### Returns Promise<void>

### deleteObject
  * deleteObject(id: string): Promise<void>
#### Parameters
    * id: string
#### Returns Promise<void>

### deleteObjects
  * deleteObjects(ids: string[]): Promise<void>
#### Parameters
    * ids: string[]
#### Returns Promise<void>

### get
  * get<T extends keyof CacheEntryTypes>(
type: T,
key: string,
): Promise<CacheEntryTypes[T] | null>
#### Type Parameters
    * T extends keyof CacheEntryTypes
#### Parameters
    * type: T
    * key: string
#### Returns Promise<CacheEntryTypes[T] | null>

### getCustom
  * getCustom<T>(key: string): Promise<T | null>
#### Type Parameters
    * T
#### Parameters
    * key: string
#### Returns Promise<T | null>

### getMoveFunctionDefinition
  * getMoveFunctionDefinition(
ref: { function: string; module: string; package: string },
): Promise<MoveFunctionCacheEntry | null>
#### Parameters
    * ref: { function: string; module: string; package: string }
#### Returns Promise<MoveFunctionCacheEntry | null>

### getObject
  * getObject(id: string): Promise<ObjectCacheEntry | null>
#### Parameters
    * id: string
#### Returns Promise<ObjectCacheEntry | null>

### getObjects
  * getObjects(ids: string[]): Promise<(ObjectCacheEntry | null)[]>
#### Parameters
    * ids: string[]
#### Returns Promise<(ObjectCacheEntry | null)[]>

### set
  * set<T extends keyof CacheEntryTypes>(
type: T,
key: string,
value: CacheEntryTypes[T],
): Promise<void>
#### Type Parameters
    * T extends keyof CacheEntryTypes
#### Parameters
    * type: T
    * key: string
    * value: CacheEntryTypes[T]
#### Returns Promise<void>

### setCustom
  * setCustom<T>(key: string, value: T): Promise<void>
#### Type Parameters
    * T
#### Parameters
    * key: string
    * value: T
#### Returns Promise<void>
```

--------------------------------

### Get Self Window Reference

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_wallet-standard.DEPRECATED_WalletsWindow

The `self` property returns a reference to the window itself, often as a `WindowProxy`. It is equivalent to `window` and `this` within the global scope.

```javascript
const selfWindow = window.self;
console.log("Self reference:", selfWindow);
```

--------------------------------

### Get Base Quantity Out - TypeScript

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Performs a dry run to determine the base quantity that will be received for a given quote quantity. It returns the expected base out, DEEP required for fees, and the resulting quote out.

```typescript
/**
 * Get the base quantity out for a given quote quantity
 * @param poolKey Key of the pool
 * @param quoteQuantity Quote quantity to convert
 * @returns An object with quote quantity, base out, quote out, and deep required for the dry run
 */
async getBaseQuantityOut(
  poolKey: string,
  quoteQuantity: number,
): Promise<{ baseOut: number; deepRequired: number; quoteOut: number; quoteQuantity: number }>
```

--------------------------------

### FlashLoanContract Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.FlashLoanContract

Initializes a new FlashLoanContract instance. It requires a DeepBookConfig object for configuration. This constructor sets up the necessary parameters for managing flash loans within the DeepBook ecosystem.

```typescript
new FlashLoanContract(config: DeepBookConfig): FlashLoanContract
```

--------------------------------

### Get Margin Pool Supply Shares

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginPoolContract

Retrieves the total supply shares for a margin pool. This function requires the pool's coin key to identify the pool.

```typescript
const coinKey = 'USDC';
const txResult = marginPoolContract.supplyShares(coinKey)(new Transaction());
// txResult will be a TransactionResult object
```

--------------------------------

### Get Open Orders for Balance Manager

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves an array of open order IDs associated with a specific balance manager within a given pool. It requires the pool key and the balance manager key as input.

```typescript
getOpenOrders(poolKey: string, managerKey: string): Promise<string[]>
```

--------------------------------

### Get Margin Manager Debts

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Calculates and retrieves the debts for both base and quote assets for a margin manager. This function automatically determines the relevant margin pool. Optionally, specify the number of decimal places.

```APIDOC
## GET /margin-manager/debts

### Description
Calculate debts (base and quote) for a margin manager NOTE: This function automatically determines whether to use base or quote margin pool based on hasBaseDebt. You don't need to specify the debt coin type.

### Method
GET

### Endpoint
/margin-manager/debts

### Parameters
#### Query Parameters
- **marginManagerKey** (string) - Required - The key to identify the margin manager
- **decimals** (number) - Optional - Number of decimal places to show (default: 6)

### Response
#### Success Response (200)
- **baseDebt** (string) - The base asset debt.
- **quoteDebt** (string) - The quote asset debt.

#### Response Example
```json
{
  "baseDebt": "25.1",
  "quoteDebt": "40.3"
}
```
```

--------------------------------

### Get Viewport Orientation

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_wallet-standard.DEPRECATED_WalletsWindow

The `orientation` property returns the orientation of the viewport in degrees, in 90-degree increments. Note that this property is deprecated.

```javascript
const viewportOrientation = window.orientation;
console.log("Viewport orientation:", viewportOrientation);
```

--------------------------------

### WalletStandardError Constructor and Usage

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_wallet-standard.WalletStandardError

Demonstrates how to instantiate and use the WalletStandardError class. It highlights the generic type parameter for error codes and the flexible constructor that accepts code and optional context/error options.

```typescript
import { WalletStandardError, WalletStandardErrorCode } from "@mysten/wallet-standard";

try {
  // Example of throwing an error with a specific code and context
  throw new WalletStandardError("4001000", { __code: "4001000" });
} catch (error) {
  if (WalletStandardError.isError(error)) {
    console.error("Caught a WalletStandardError:", error.message);
    console.error("Error context:", error.context);
  } else {
    console.error("Caught a non-WalletStandardError:", error);
  }
}
```

--------------------------------

### Get Window Object Reference

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_wallet-standard.DEPRECATED_WalletsWindow

The `window` property of a `Window` object points to the window object itself. It is a reference to the global object in a browser environment.

```javascript
const currentWindow = window.window;
console.log("Window object:", currentWindow);
```

--------------------------------

### Execute Sui Transaction using useDAppKit

Source: https://sdk.mystenlabs.com/dapp-kit/react/hooks/use-dapp-kit

Shows how to use the `useDAppKit` hook to sign and execute a Sui transaction. This example demonstrates creating a `Transaction` object, specifying objects to transfer and a recipient, and then submitting it for execution. Error handling for failed transactions is included.

```javascript
import { useDAppKit } from '@mysten/dapp-kit-react';
import { Transaction } from '@mysten/sui/transactions';

export function TransferButton() {
	const dAppKit = useDAppKit();

	await function handleTransfer() {
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

### Get Level 2 Ticks From Mid - TypeScript

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Fetches level 2 order book data for a specified number of ticks away from the mid-price in a pool. Returns both bid and ask prices and quantities.

```typescript
/**
 * Get level 2 order book ticks from mid-price for a pool
 * @param poolKey Key of the pool
 * @param ticks Number of ticks from mid-price
 * @returns An object with arrays of ask prices/quantities and bid prices/quantities
 */
async getLevel2TicksFromMid(
  poolKey: string,
  ticks: number,
): Promise<{ ask_prices: number[]; ask_quantities: number[]; bid_prices: number[]; bid_quantities: number[] }>
```

--------------------------------

### Get Margin Manager Owner

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the owner address of a specified margin manager. It takes the margin manager's key as input and returns a Promise resolving to the owner's address as a string.

```typescript
getMarginManagerOwner(marginManagerKey: string): Promise<string>
```

--------------------------------

### Get Chain Identifier

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_sui.client.SuiClientTypes.GetChainIdentifierResponse

Retrieves the unique identifier for the current Sui network. This identifier is the base58 encoded 32-byte genesis checkpoint digest.

```APIDOC
## GET /chainIdentifier

### Description
Retrieves the unique identifier for the current Sui network. This identifier is the base58 encoded 32-byte genesis checkpoint digest.

### Method
GET

### Endpoint
/chainIdentifier

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **chainIdentifier** (string) - The base58 encoded 32-byte genesis checkpoint digest, uniquely identifying the network.

#### Response Example
```json
{
  "chainIdentifier": "someBase58EncodedString"
}
```
```

--------------------------------

### Get Multiple Orders (TypeScript)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Fetches information for multiple orders within a specified pool. This function takes a `poolKey` and an array of `orderIds`. It returns a Promise that resolves to an array of order detail objects or null if no orders are found or an error occurs.

```typescript
import { getOrders } from "@mysten/sdk";

interface OrderDetails {
  balance_manager_id: string;
  client_order_id: string;
  epoch: string;
  expire_timestamp: string;
  fee_is_deep: boolean;
  filled_quantity: string;
  order_deep_price: { asset_is_base: boolean; deep_per_asset: string };
  order_id: string;
  quantity: string;
  status: number;
}

async function fetchMultipleOrders(poolKey: string, orderIds: string[]): Promise<OrderDetails[] | null> {
  try {
    const orders = await getOrders(poolKey, orderIds);
    return orders;
  } catch (error) {
    console.error(`Error fetching orders ${orderIds.join(', ')} from pool ${poolKey}:`, error);
    throw error;
  }
}
```

--------------------------------

### Single Client Component for Wallet Integration

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/next-js

An alternative approach for simpler applications, consolidating dApp Kit setup and wallet interaction logic into a single client component. It includes a `WalletStatus` component to display account information and a button to send a transaction.

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

### Get Pool Referral Multiplier (SDK)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Fetches the referral multiplier for a specific pool and referral code. This function is relevant for understanding referral program dynamics and potential rewards or discounts. It requires the pool key and referral string, returning the multiplier as a number.

```typescript
poolReferralMultiplier(poolKey: string, referral: string): Promise<number>
```

--------------------------------

### MarginManagerContract Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginManagerContract

Initializes a new instance of the MarginManagerContract class.

```APIDOC
## Constructor MarginManagerContract

### Description
Initializes a new instance of the MarginManagerContract class.

### Method
constructor

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```json
{
  "config": "DeepBookConfig"
}
```

### Response
#### Success Response (200)
- **MarginManagerContract** (object) - An instance of the MarginManagerContract.

#### Response Example
```json
{
  "instance": "MarginManagerContract"
}
```
```

--------------------------------

### SessionKey Class Methods

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_seal.SessionKey

This section details the methods available on the SessionKey class for managing session keys and interacting with the Sui network.

```APIDOC
## POST /sessionkey/createRequestParams

### Description
Creates request parameters for a given transaction. This includes generating ephemeral keys and a request signature.

### Method
POST

### Endpoint
/sessionkey/createRequestParams

### Parameters
#### Request Body
- **txBytes** (Uint8Array) - Required - The transaction bytes to process.

### Request Example
```json
{
  "txBytes": "0x..."
}
```

### Response
#### Success Response (200)
- **encKey** (Uint8Array) - The ephemeral secret key.
- **encKeyPk** (Uint8Array) - The public key of the ephemeral secret key.
- **encVerificationKey** (Uint8Array) - The verification key.
- **requestSignature** (string) - The signature for the request.

#### Response Example
```json
{
  "encKey": "0x...",
  "encKeyPk": "0x...",
  "encVerificationKey": "0x...",
  "requestSignature": "0x..."
}
```
```

```APIDOC
## POST /sessionkey/export

### Description
Exports the current SessionKey object, which can then be stored for persistence, for example, in IndexedDB.

### Method
POST

### Endpoint
/sessionkey/export

### Response
#### Success Response (200)
- **ExportedSessionKey** (object) - An object representing the exported session key state.

#### Response Example
```json
{
  "exportedSessionKey": {
    "key": "...",
    "signature": "..."
  }
}
```
```

```APIDOC
## GET /sessionkey/getAddress

### Description
Retrieves the address associated with the current SessionKey instance.

### Method
GET

### Endpoint
/sessionkey/getAddress

### Response
#### Success Response (200)
- **address** (string) - The session key's address.

#### Response Example
```json
{
  "address": "0x123..."
}
```
```

```APIDOC
## GET /sessionkey/getCertificate

### Description
Retrieves a certificate associated with the session key. This is an asynchronous operation.

### Method
GET

### Endpoint
/sessionkey/getCertificate

### Response
#### Success Response (200)
- **Certificate** (object) - The certificate object.

#### Response Example
```json
{
  "certificate": {
    "data": "..."
  }
}
```
```

```APIDOC
## GET /sessionkey/getPackageId

### Description
Retrieves the package ID associated with the session key.

### Method
GET

### Endpoint
/sessionkey/getPackageId

### Response
#### Success Response (200)
- **packageId** (string) - The package ID.

#### Response Example
```json
{
  "packageId": "0xabc..."
}
```
```

```APIDOC
## GET /sessionkey/getPackageName

### Description
Retrieves the package name associated with the session key.

### Method
GET

### Endpoint
/sessionkey/getPackageName

### Response
#### Success Response (200)
- **packageName** (string) - The package name.

#### Response Example
```json
{
  "packageName": "MyPackage"
}
```
```

```APIDOC
## GET /sessionkey/getPersonalMessage

### Description
Retrieves the personal message associated with the session key.

### Method
GET

### Endpoint
/sessionkey/getPersonalMessage

### Response
#### Success Response (200)
- **personalMessage** (Uint8Array) - The personal message bytes.

#### Response Example
```json
{
  "personalMessage": "0x..."
}
```
```

```APIDOC
## GET /sessionkey/isExpired

### Description
Checks if the session key has expired.

### Method
GET

### Endpoint
/sessionkey/isExpired

### Response
#### Success Response (200)
- **expired** (boolean) - True if the session key is expired, false otherwise.

#### Response Example
```json
{
  "expired": false
}
```
```

```APIDOC
## POST /sessionkey/setPersonalMessageSignature

### Description
Sets the signature for the personal message associated with the session key.

### Method
POST

### Endpoint
/sessionkey/setPersonalMessageSignature

### Parameters
#### Request Body
- **personalMessageSignature** (string) - Required - The signature for the personal message.

### Request Example
```json
{
  "personalMessageSignature": "0xabc..."
}
```

### Response
#### Success Response (200)
- **message** (string) - Success message.

#### Response Example
```json
{
  "message": "Signature set successfully."
}
```
```

--------------------------------

### BcsType Constructor and Core Methods

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_bcs.BcsType

Demonstrates the instantiation of the BcsType class and its fundamental methods for reading and writing BCS data. This includes defining how to parse data from a reader and serialize it to a writer, along with validation and size calculation.

```typescript
new BcsType<T, Input, Name>({
  name: Name;
  read: (reader: BcsReader) => T;
  serialize?: (
    value: Input,
    options?: BcsWriterOptions,
  ) => Uint8Array<ArrayBuffer>;
  serializedSize?: (value: Input) => number | null;
  validate?: (value: Input) => void;
  write: (value: Input, writer: BcsWriter) => void;
})
```

--------------------------------

### Combine Partial Signatures for Multisig with zkLogin

Source: https://sdk.mystenlabs.com/sui/cryptography/multisig

This example illustrates how to combine a zkLogin signature with a MultiSigPublicKey to form a valid multisig. This is crucial for authorizing transactions from a multisig account where one of the participants is a zkLogin identifier.

```typescript
const multisig = multiSigPublicKey.combinePartialSignatures([zkLoginSig]);
```

--------------------------------

### Instantiate AwsKmsSigner using fromKeyId

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_signers.aws.AwsKmsSigner

Demonstrates how to create an instance of AwsKmsSigner using the static `fromKeyId` method. This method initializes the signer by fetching the public key from AWS KMS. Ensure AWS credentials and region are configured.

```typescript
const signer = await AwsKmsSigner.fromKeyId(keyId, options);

```

--------------------------------

### Selection and Style Retrieval

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_wallet-standard.WalletEventsWindow

Provides methods to get the current text selection within the document and to retrieve the computed CSS styles for an element, including its pseudo-elements.

```typescript
getComputedStyle(
  elt: Element,
  pseudoElt?: string | null,
): CSSStyleDeclaration;
getSelection(): Selection | null;
```

--------------------------------

### BcsWriter Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_bcs.BcsWriter

Initializes a new BcsWriter instance. Options can be provided to configure the initial buffer.

```APIDOC
## Constructors

### constructor
  * `new BcsWriter(__namedParameters?: BcsWriterOptions): BcsWriter`

#### Parameters
    * `__namedParameters`: BcsWriterOptions = {}
      Optional configuration object for the BcsWriter.

#### Returns
`BcsWriter`
  An instance of the BcsWriter.
```

--------------------------------

### Get Pool ID (TypeScript)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Fetches the unique identifier for a specified pool. This function is useful for referencing pools in other operations or for data retrieval purposes. It returns a transaction result.

```typescript
poolId(poolKey: string): (tx: Transaction) => TransactionResult
```

--------------------------------

### Get Price Info Object Age

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Determines the age of the price info object for a specific coin. The function takes a `coinKey` and returns a promise that resolves to the age of the price info object in seconds (as a number).

```typescript
async getPriceInfoObjectAge(coinKey: string): Promise<number>
```

--------------------------------

### createZkLoginZkp

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_enoki.EnokiClient

Creates a zero-knowledge proof (ZKP) for zkLogin.

```APIDOC
### createZkLoginZkp
  * createZkLoginZkp(
input: CreateZkLoginZkpApiInput,
): Promise<CreateZkLoginZkpApiResponse>
#### Parameters
    * input: CreateZkLoginZkpApiInput
#### Returns Promise<CreateZkLoginZkpApiResponse>
```

--------------------------------

### Create and Serialize String - JavaScript

Source: https://sdk.mystenlabs.com/typedoc/variables/_mysten_bcs.bcs

Demonstrates the creation of a string type using bcs.string(). The function serializes strings by UTF-8 encoding them. The example shows serialization of a single character string.

```javascript
bcs.string().serialize('a').toBytes() // Uint8Array [ 1, 97 ]
```

--------------------------------

### Get Default Name Service Name - TypeScript

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.client.CoreClient

Retrieves the default name service name associated with the client. Requires DefaultNameServiceNameOptions.

```typescript
defaultNameServiceName(options: DefaultNameServiceNameOptions): Promise<DefaultNameServiceNameResponse>
```

--------------------------------

### WindowRegisterWalletEventCallback

Source: https://sdk.mystenlabs.com/typedoc/types/_mysten_wallet-standard.WindowRegisterWalletEventCallback

Callback function provided by Wallets to be called by the app when the app is ready to register Wallets.

```APIDOC
## Type Alias WindowRegisterWalletEventCallback

### Description
Callback function provided by Wallets to be called by the app when the app is ready to register Wallets.

### Type Declaration
```typescript
(api: WindowAppReadyEventAPI) => void
```

### Parameters
*   **api** (WindowAppReadyEventAPI) - The API object provided to the callback.

### Returns
*   **void**
```

--------------------------------

### Get Margin Pool Borrow Shares

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginPoolContract

Retrieves the total borrow shares for a specified margin pool. This function returns a transaction that, when executed, yields the borrow shares.

```typescript
const coinKey = 'USDC';
const txResult = marginPoolContract.borrowShares(coinKey)(new Transaction());
// txResult will be a TransactionResult object
```

--------------------------------

### Get Margin Pool ID

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginPoolContract

Fetches the unique identifier for a given margin pool. The function requires the coin key of the pool to retrieve its ID.

```typescript
const coinKey = 'USDC';
const txResult = marginPoolContract.getId(coinKey)(new Transaction());
// txResult will be a TransactionResult object
```

--------------------------------

### WebCryptoSigner Methods

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_signers.webcrypto.WebCryptoSigner

Documentation for the methods of the WebCryptoSigner class.

```APIDOC
## Methods

### export
  * export(): ExportedWebCryptoKeypair
Exports the keypair so that it can be stored in IndexedDB.
#### Returns ExportedWebCryptoKeypair

### getKeyScheme
  * getKeyScheme(): SignatureScheme
Get the key scheme of the keypair: Secp256k1 or ED25519
#### Returns SignatureScheme

### getPublicKey
  * getPublicKey(): Secp256r1PublicKey
The public key for this keypair
#### Returns Secp256r1PublicKey

### sign
  * sign(bytes: Uint8Array): Promise<Uint8Array<ArrayBuffer>>
#### Parameters
    * bytes: Uint8Array
#### Returns Promise<Uint8Array<ArrayBuffer>>

### signAndExecuteTransaction
  * signAndExecuteTransaction(
__namedParameters: SignAndExecuteOptions,
): Promise<
SuiClientTypes.TransactionResult<{ effects: true; transaction: true }>,
>
#### Parameters
    * __namedParameters: SignAndExecuteOptions
#### Returns Promise<SuiClientTypes.TransactionResult<{ effects: true; transaction: true }>>

### signPersonalMessage
  * signPersonalMessage(
bytes: Uint8Array,
): Promise<{ bytes: string; signature: string }>
Signs provided personal message by calling `signWithIntent()` with a `PersonalMessage` provided as intent scope
#### Parameters
    * bytes: Uint8Array
#### Returns Promise<{ bytes: string; signature: string }>

### signTransaction
  * signTransaction(bytes: Uint8Array): Promise<SignatureWithBytes>
Signs provided transaction by calling `signWithIntent()` with a `TransactionData` provided as intent scope
#### Parameters
    * bytes: Uint8Array
#### Returns Promise<SignatureWithBytes>

### signWithIntent
  * signWithIntent(
bytes: Uint8Array,
intent: IntentScope,
): Promise<SignatureWithBytes>
Sign messages with a specific intent. By combining the message bytes with the intent before hashing and signing, it ensures that a signed message is tied to a specific purpose and domain separator is provided
#### Parameters
    * bytes: Uint8Array
    * intent: IntentScope
#### Returns Promise<SignatureWithBytes>

### toSuiAddress
  * toSuiAddress(): string
#### Returns string
```

--------------------------------

### Get Base Quantity Out with Input Fee - TypeScript

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Calculates the base quantity out when the input token is used to pay for fees. This is useful for scenarios where the fee structure differs from the standard DEEP fee payment.

```typescript
/**
 * Get the base quantity out using input token as fee
 * @param poolKey Key of the pool
 * @param quoteQuantity Quote quantity
 * @returns An object with base out, deep required, quote out, and quote quantity
 */
async getBaseQuantityOutInputFee(
  poolKey: string,
  quoteQuantity: number,
): Promise<{ baseOut: number; deepRequired: number; quoteOut: number; quoteQuantity: number }>
```

--------------------------------

### Initialize Payment Kit Client

Source: https://sdk.mystenlabs.com/typedoc/functions/_mysten_payment-kit.paymentKit

Initializes the paymentKit client with an optional name. It returns an object containing the name and a register function. The register function takes a ClientWithCoreApi and returns a PaymentKitClient.

```typescript
function paymentKit<const Name = "paymentKit">(  
__namedParameters?: { name?: Name },  
): { name: Name; register: (client: ClientWithCoreApi) => PaymentKitClient }
```

--------------------------------

### Capture Stack Trace Example - JavaScript

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_walrus.InternalServerError

Demonstrates how to use the static `captureStackTrace` method of the Error object to create a `.stack` property on a target object. This is useful for custom error objects or for debugging purposes, allowing you to capture the call stack at a specific point in your code.

```javascript
const myObject = {};
Error.captureStackTrace(myObject);
console.log(myObject.stack); // Similar to `new Error().stack`
```

--------------------------------

### Payment Kit Initialization

Source: https://sdk.mystenlabs.com/typedoc/functions/_mysten_payment-kit.paymentKit

This section describes the `paymentKit` function, which is used to initialize the payment kit client. It allows for optional naming of the payment kit instance.

```APIDOC
## Function paymentKit

### Description
Initializes the payment kit client. It accepts an optional `name` parameter to identify the payment kit instance.

### Method
Function Call

### Parameters
#### Named Parameters
- **name** (string) - Optional - The name for the payment kit instance. Defaults to "paymentKit".

### Returns
- **name** (string) - The name of the payment kit instance.
- **register** (function) - A function that takes a `ClientWithCoreApi` and returns a `PaymentKitClient`.

### Example
```javascript
import { paymentKit } from '@mysten/payment-kit';

const myPaymentKit = paymentKit({ name: 'myCustomKit' });

// To register the client (assuming you have a client instance)
// const client = new SomeClient();
// const paymentKitClient = myPaymentKit.register(client);
```
```

--------------------------------

### Wallet Registration API

Source: https://sdk.mystenlabs.com/typedoc/functions/_mysten_wallet-standard.registerWallet

This API allows for the registration of a standard wallet with the application. It handles the necessary event dispatches and listeners to ensure synchronous registration.

```APIDOC
## Function registerWallet

### Description
Register a "@wallet-standard/base".Wallet as a Standard Wallet with the app. This dispatches a "@wallet-standard/base".WindowRegisterWalletEvent to notify the app that the Wallet is ready to be registered. This also adds a listener for "@wallet-standard/base".WindowAppReadyEvent to listen for a notification from the app that the app is ready to register the Wallet. This combination of event dispatch and listener guarantees that the Wallet will be registered synchronously as soon as the app is ready whether the Wallet loads before or after the app.

### Method
N/A (This is a function call within the SDK)

### Endpoint
N/A

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
* **wallet** (Wallet) - Required - The wallet object to register.

### Request Example
```javascript
// Assuming 'myWallet' is an instance of a Wallet object
registerWallet(myWallet);
```

### Response
#### Success Response
* **void** - This function does not return any value.

#### Response Example
N/A
```

--------------------------------

### Get Order Details (TypeScript)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Fetches detailed information about a specific order within a pool. This function requires both the `poolKey` and the `orderId`. It returns a Promise that resolves to an object containing order details or null if the order is not found.

```typescript
import { getOrder } from "@mysten/sdk";

interface OrderDetails {
  balance_manager_id: string;
  client_order_id: string;
  epoch: string;
  expire_timestamp: string;
  fee_is_deep: boolean;
  filled_quantity: string;
  order_deep_price: { asset_is_base: boolean; deep_per_asset: string };
  order_id: string;
  quantity: string;
  status: number;
}

async function fetchOrderDetails(poolKey: string, orderId: string): Promise<OrderDetails | null> {
  try {
    const order = await getOrder(poolKey, orderId);
    return order;
  } catch (error) {
    console.error(`Error fetching order ${orderId} from pool ${poolKey}:`, error);
    throw error;
  }
}
```

--------------------------------

### Get Move Function Information

Source: https://sdk.mystenlabs.com/sui/clients/core

Fetches metadata about a specific Move function within a package. Requires the package ID, module name, and function name.

```typescript
const { function: fn } = await client.core.getMoveFunction({
	packageId: '0x2',
	moduleName: 'coin',
	name: 'transfer',
});

console.log(fn.name);
console.log(fn.parameters);
console.log(fn.typeParameters);
```

--------------------------------

### BcsType Class Overview

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.bcs.BcsType

Provides a comprehensive overview of the BcsType class, including its type parameters, hierarchy, constructors, properties, and methods.

```APIDOC
## Class BcsType<T, Input, Name>

#### Type Parameters
  * T
  * Input = T
  * const Name extends string = string

#### Hierarchy (View Summary)
  * BcsType
    * BcsStruct
    * BcsEnum
    * BcsTuple

##### Index
### Constructors
constructor
### Properties
$inferInput $inferType name read serializedSize validate
### Methods
fromBase58 fromBase64 fromHex parse serialize transform write
```

--------------------------------

### Get Scroll Offsets

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_wallet-standard.DEPRECATED_WalletsWindow

The `pageXOffset` and `pageYOffset` properties return the number of pixels the document has been scrolled horizontally and vertically, respectively. These are aliases for `scrollX` and `scrollY`.

```javascript
const horizontalScroll = window.pageXOffset;
const verticalScroll = window.pageYOffset;
console.log(`Scrolled: ${horizontalScroll}px horizontally, ${verticalScroll}px vertically`);
```

--------------------------------

### Get Quote Quantity Out (SDK)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Calculates the quote quantity needed to receive a target base quantity from a pool. It takes the pool key and the desired base quantity as input and returns an object containing details of the transaction, including base and quote amounts, and required deep liquidity.

```typescript
getQuoteQuantityOut(
  poolKey: string,
  baseQuantity: number,
): Promise<
  {
    baseOut: number;
    baseQuantity: number;
    deepRequired: number;
    quoteOut: number;
  },
>
```

--------------------------------

### Connect to Sui Devnet and Get Coins with SuiJsonRpcClient

Source: https://sdk.mystenlabs.com/sui/clients/json-rpc

Connects to the Sui Devnet using SuiJsonRpcClient and fetches all Coin objects owned by a specific address. It demonstrates using getJsonRpcFullnodeUrl for network endpoint discovery.

```typescript
import { getJsonRpcFullnodeUrl, SuiJsonRpcClient } from '@mysten/sui/jsonRpc';

// use getJsonRpcFullnodeUrl to define Devnet RPC location
const rpcUrl = getJsonRpcFullnodeUrl('devnet');

// create a client connected to devnet
const client = new SuiJsonRpcClient({ url: rpcUrl, network: 'devnet' });

// get coins owned by an address
// replace <OWNER_ADDRESS> with actual address in the form of 0x123...
await client.getCoins({
	owner: '<OWNER_ADDRESS>',
});
```

--------------------------------

### SuiClientOptions Hierarchy

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_sui.client.SuiClientTypes.SuiClientOptions

Shows the inheritance hierarchy for SuiClientOptions, indicating it extends CoreClientOptions.

```APIDOC
## Hierarchy

### SuiClientOptions
- Extends: `CoreClientOptions`
```

--------------------------------

### Query Ledger Service via gRPC (TypeScript)

Source: https://sdk.mystenlabs.com/sui/clients/grpc

Provides examples for interacting with the ledgerService client to retrieve transaction details by digest and fetch current epoch information. Requires an initialized SuiGrpcClient.

```typescript
// Get transaction by digest
const { response: transactionResponse } = await grpcClient.ledgerService.getTransaction({
	digest: '0x123...',
});

// Get current epoch information
const { response: epochInfoResponse } = await grpcClient.ledgerService.getEpoch({});
```

--------------------------------

### Create dApp Kit Instance with Sui gRPC Client

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/next-js

Sets up a dApp Kit instance for a Next.js application, configuring it to use the Sui gRPC client for communication with the Sui network. It specifies the network to connect to (e.g., testnet) and provides the necessary gRPC endpoint.

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

### Get Pool Referral Balances

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the referral balances for a specific pool and referral ID. This function takes `poolKey` and `referral` as string inputs and returns a promise resolving to an object containing `base`, `deep`, and `quote` balances.

```typescript
async getPoolReferralBalances(
  poolKey: string,
  referral: string,
): Promise<{ base: number; deep: number; quote: number }>
```

--------------------------------

### Handle Payment Errors with Try-Catch

Source: https://sdk.mystenlabs.com/payment-kit/getting-started

Demonstrates how to wrap payment operations in try-catch blocks to gracefully handle potential errors during transaction processing. It checks for specific error messages like 'Duplicate' or 'insufficient' balance for tailored responses.

```javascript
try {
	const tx = client.paymentKit.tx.processRegistryPayment({...});
	const result = await client.signAndExecuteTransaction({
		transaction: tx,
		signer: keypair,
	});

	if (result.$kind === 'FailedTransaction') {
		throw new Error(`Payment failed: ${result.FailedTransaction.status.error?.message}`);
	}

	console.log('Success:', result.Transaction.digest);
} catch (error) {
	if (error.message.includes('Duplicate')) {
		console.error('Payment already processed');
	} else if (error.message.includes('insufficient')) {
		console.error('Insufficient balance');
	} else {
		console.error('Payment failed:', error.message);
	}
}
```

--------------------------------

### EnokiFlow Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_enoki.EnokiFlow

Initializes a new EnokiFlow instance with the provided configuration. This class is deprecated and `registerEnokiWallets` should be used instead.

```typescript
new EnokiFlow(config: EnokiFlowConfig): EnokiFlow
```

--------------------------------

### Get Dynamic Object Field - TypeScript

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.client.CoreClient

Retrieves a dynamic field of an object, with options to include specific object details. Requires GetDynamicObjectFieldOptions.

```typescript
getDynamicObjectField<Include extends ObjectInclude = object>(
options: GetDynamicObjectFieldOptions<Include>,
): Promise<GetDynamicObjectFieldResponse<Include>>
```

--------------------------------

### Get ZkSend Link from URL (Synchronous)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_zksend.ZkSendClient

Parses a URL to retrieve a ZkSendLink object synchronously, without loading assets. Requires a URL string as input.

```typescript
getLinkFromUrl(url: string): ZkSendLink
```

--------------------------------

### Create and Execute Registry Payment Transaction

Source: https://sdk.mystenlabs.com/payment-kit/payment-kit-sdk

Shows how to create a transaction for a registry-based payment using `processRegistryPayment`. This method requires details like nonce, coin type, amount, receiver, and sender. The example includes signing and executing the transaction, along with error handling for failed transactions.

```typescript
const tx = client.paymentKit.tx.processRegistryPayment({
	nonce: crypto.randomUUID(),
	coinType: '0x2::sui::SUI',
	amount: 1000000000,
	receiver,
	sender: senderAddress,
});

const result = await client.signAndExecuteTransaction({
	transaction: tx,
	signer: keypair,
});

// Check transaction status
if (result.$kind === 'FailedTransaction') {
	throw new Error(`Payment failed: ${result.FailedTransaction.status.error?.message}`);
}
```

--------------------------------

### Deploy Move Contract to Sui Testnet

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/create-dapp

Commands to set up the Sui CLI for testnet, switch to the testnet environment, and publish a Move smart contract. Ensure you have testnet SUI from the faucet before publishing.

```bash
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
sui client switch --env testnet
cd move
sui client publish --gas-budget 100000000 counter
```

--------------------------------

### Get Quote Quantity Out with Input Fee (SDK)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Calculates the quote quantity out when the input token is used as the fee. This function is useful for scenarios where transaction fees are paid in the same token being traded. It requires the pool key and the base quantity.

```typescript
getQuoteQuantityOutInputFee(
  poolKey: string,
  baseQuantity: number,
): Promise<
  {
    baseOut: number;
    baseQuantity: number;
    deepRequired: number;
    quoteOut: number;
  },
>
```

--------------------------------

### Transaction Building Parameters

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.transactions.TransactionDataBuilder

This section outlines the parameters used for building transactions, including commands, expiration, gas data, and input object resolutions.

```APIDOC
## Transaction Building Parameters

### Description
This endpoint details the structure for defining transaction commands, expiration policies, gas configurations, and how to resolve input objects.

### Method
N/A (Configuration structure)

### Endpoint
N/A

### Parameters
#### Request Body
- **commands** (EnumOutputShapeWithKeys<...>) - Required - An array of commands to be executed in the transaction. This includes operations like `MoveCall`, `TransferObjects`, `SplitCoins`, `MergeCoins`, `Publish`, `MakeMoveVec`, `Upgrade`, and `$Intent`.
- **expiration** (EnumOutputShapeWithKeys<...> | null) - Optional - Specifies the expiration policy for the transaction, which can be `None`, `ValidDuring` a specific period, or tied to an `Epoch`.
- **gasData** (object) - Required - Contains information about gas payment and budget.
  - **budget** (string | number | null) - Optional - The maximum amount of gas to be spent.
  - **owner** (string | null) - Optional - The owner of the gas payment.
  - **payment** (Array<object> | null) - Optional - An array of objects used for gas payment, each with `digest`, `objectId`, and `version`.
  - **price** (string | number | null) - Optional - The price per unit of gas.
- **inputs** (EnumOutputShapeWithKeys<...>) - Required - Defines how input objects are resolved, including types like `FundsWithdrawal`, `Object`, `Pure`, `UnresolvedObject`, and `UnresolvedPure`.

### Request Example
```json
{
  "commands": [
    {
      "$kind": "MoveCall",
      "package": "0x2",
      "module": "coin",
      "function": "transfer",
      "arguments": [
        {
          "$kind": "Input",
          "Input": 0
        },
        {
          "$kind": "Input",
          "Input": 1
        },
        {
          "$kind": "Input",
          "Input": 2
        }
      ]
    }
  ],
  "expiration": null,
  "gasData": {
    "budget": 10000,
    "owner": "0x123...",
    "payment": [],
    "price": 1
  },
  "inputs": [
    {
      "$kind": "Object",
      "ImmOrOwnedObject": {
        "objectId": "0xabc...",
        "version": 1,
        "digest": "digest1"
      }
    },
    {
      "$kind": "Object",
      "ImmOrOwnedObject": {
        "objectId": "0xdef...",
        "version": 1,
        "digest": "digest2"
      }
    },
    {
      "$kind": "Object",
      "ImmOrOwnedObject": {
        "objectId": "0xghi...",
        "version": 1,
        "digest": "digest3"
      }
    }
  ]
}
```

### Response
#### Success Response (200)
N/A (This is a request structure)

#### Response Example
N/A
```

--------------------------------

### Get Ed25519 Secret Key

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.keypairs_ed25519.Ed25519Keypair

Retrieves the Bech32 encoded secret key string for the Ed25519 keypair. This method should be used with caution as it exposes sensitive information.

```typescript
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

// Assume keypair is already initialized
const keypair = new Ed25519Keypair();

const secretKey = keypair.getSecretKey();

console.log("Secret Key (Bech32):", secretKey);
```

--------------------------------

### Get Specific Checkpoint Details with Sui SDK

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_sui

Retrieves details for a specific checkpoint by its ID (sequence number) and logs its sequence number, timestamp, and the number of transactions it contains. Uses the SuiGrpcClient.

```typescript
client.getCheckpoint({ id: '1994010' }).then(function (checkpoint: Checkpoint) {
	console.log('Checkpoint Sequence Num ', checkpoint.sequenceNumber);
	console.log('Checkpoint timestampMs ', checkpoint.timestampMs);
	console.log('Checkpoint # of Transactions ', checkpoint.transactions.length);
});
```

--------------------------------

### Get Locked Balance (TypeScript)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Fetches the locked balance for a specific pool and balance manager. This function is essential for understanding liquidity constraints and managing funds within the system. It returns a transaction object.

```typescript
lockedBalance(poolKey: string, managerKey: string): (tx: Transaction) => void
```

--------------------------------

### SuiClientOptions Interface

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_sui.client.SuiClientTypes.SuiClientOptions

Defines the structure for configuring the Sui client, including optional base client and cache settings, and a required network configuration.

```APIDOC
## Interface SuiClientOptions

### Description
Defines the configuration options for the Sui client.

### Properties

#### `Optional` base
- **Type**: `BaseClient`
- **Description**: The base client configuration.

#### `Optional` cache
- **Type**: `ClientCache`
- **Description**: The client cache configuration.

#### Required network
- **Type**: `Network`
- **Description**: The network configuration for the Sui client.
```

--------------------------------

### Get Top Window Reference

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_wallet-standard.DEPRECATED_WalletsWindow

The `top` property returns a reference to the topmost window in the window hierarchy. If the current window is the top-level window, `top` will refer to itself.

```javascript
const topWindow = window.top;
console.log("Top window:", topWindow);
```

--------------------------------

### Get Margin Pool Last Update Timestamp

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginPoolContract

Returns the timestamp of the last update for a margin pool. This can be useful for tracking data freshness. The coin key identifies the pool.

```typescript
const coinKey = 'USDC';
const txResult = marginPoolContract.lastUpdateTimestamp(coinKey)(new Transaction());
// txResult will be a TransactionResult object
```

--------------------------------

### Verify Signature via gRPC (TypeScript)

Source: https://sdk.mystenlabs.com/sui/clients/grpc

Provides an example of using the signatureVerificationService client to verify a signature against a message. Requires message and signature bytes, and an optional JWKS array. Assumes `messageBytes` and `signatureBytes` are defined.

```typescript
const { response } = await grpcClient.signatureVerificationService.verifySignature({
	message: {
		name: 'TransactionData',
		value: messageBytes,
	},
	signature: {
		bcs: { value: signatureBytes },
		signature: { oneofKind: undefined },
	},
	jwks: [],
});
```

--------------------------------

### Get Margin Manager Quote Balance

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Fetches the quote asset balance for a given margin manager. Optionally accepts a 'decimals' parameter to specify the number of decimal places for the returned balance. Defaults to 6 decimal places.

```typescript
getMarginManagerQuoteBalance(marginManagerKey: string, decimals?: number): Promise<string>
```

--------------------------------

### Access dApp Kit Connection State in Vue

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/vue

Shows how to access and display the dApp Kit's connection state (wallet, account, network) reactively in a Vue application using `@nanostores/vue`. This enables dynamic UI updates based on the wallet connection status.

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

### Initialize SuiGraphQLClient and Fetch Object

Source: https://sdk.mystenlabs.com/sui/clients/graphql

Demonstrates how to initialize the SuiGraphQLClient with a network URL and fetch an object using its ID. This client enables type-safe GraphQL queries against the Sui GraphQL API.

```typescript
import { SuiGraphQLClient } from '@mysten/sui/graphql';

const client = new SuiGraphQLClient({
	url: 'https://sui-mainnet.mystenlabs.com/graphql',
	network: 'mainnet',
});

const { object } = await client.getObject({ objectId: '0x...' });
```

--------------------------------

### BCS Serialization and Deserialization with @mysten/bcs

Source: https://sdk.mystenlabs.com/bcs

Demonstrates how to define custom BCS schemas for complex types like 'Coin' and perform serialization and deserialization using the @mysten/bcs library. It includes examples of transforming data to and from hex strings.

```typescript
import { bcs, fromHex, toHex } from '@mysten/bcs';

// define UID as a 32-byte array, then add a transform to/from hex strings
const UID = bcs.fixedArray(32, bcs.u8()).transform({
	input: (id: string) => fromHex(id),
	output: (id) => toHex(Uint8Array.from(id)),
});

const Coin = bcs.struct('Coin', {
	id: UID,
	value: bcs.u64(),
});

// deserialization: BCS bytes into Coin
const bcsBytes = Coin.serialize({
	id: '0000000000000000000000000000000000000000000000000000000000000001',
	value: 1000000n,
}).toBytes();

const coin = Coin.parse(bcsBytes);

// serialization: Object into bytes - an Option with <T = Coin>
const hex = bcs.option(Coin).serialize(coin).toHex();

console.log(hex);
```

--------------------------------

### Get Payment Record

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_payment-kit.PaymentKitClient

Queries for a payment record in a registry using provided options. Returns the payment record data if found, otherwise returns null. Dependencies include the client instance and GetPaymentRecordOptions.

```typescript
const paymentRecord = await client.getPaymentRecord({ registry, nonce, amount, receiver, coinType });
```

--------------------------------

### Generate Proof

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.BalanceManagerContract

Generates a trade proof for the BalanceManager. It automatically calls the appropriate function based on whether a tradeCap is set.

```APIDOC
## GET /generateProof

### Description
Generate a trade proof for the BalanceManager. Calls the appropriate function based on whether tradeCap is set.

### Method
GET

### Endpoint
/generateProof

### Parameters
#### Path Parameters
N/A

#### Query Parameters
- **managerKey** (string) - Required - The key of the BalanceManager.

#### Request Body
N/A

### Request Example
```json
{
  "managerKey": "string"
}
```

### Response
#### Success Response (200)
- **tx** (Transaction) - A function that takes a Transaction object.
- **result** (TransactionResult) - The result of the transaction.

#### Response Example
```json
{
  "tx": "Transaction Function",
  "result": "TransactionResult"
}
```
```

--------------------------------

### Get Normalized Order Details (TypeScript)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves detailed information for a specific order, including a normalized price. This function requires `poolKey` and `orderId`. It returns a Promise that resolves to an object with order details or null if the order is not found.

```typescript
import { getOrderNormalized } from "@mysten/sdk";

interface NormalizedOrderDetails {
  balance_manager_id: string;
  client_order_id: string;
  epoch: string;
  expire_timestamp: string;
  fee_is_deep: boolean;
  filled_quantity: string;
  isBid: boolean;
  normalized_price: string;
  order_deep_price: { asset_is_base: boolean; deep_per_asset: string };
  order_id: string;
  quantity: string;
  status: number;
}

async function fetchNormalizedOrder(poolKey: string, orderId: string): Promise<NormalizedOrderDetails | null> {
  try {
    const order = await getOrderNormalized(poolKey, orderId);
    return order;
  } catch (error) {
    console.error(`Error fetching normalized order ${orderId} from pool ${poolKey}:`, error);
    throw error;
  }
}
```

--------------------------------

### Get Quote Quantity Out (TypeScript)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Calculates the quote quantity needed to receive a target base quantity for a given pool. It takes the pool key and the desired base quantity as input and returns a transaction object.

```typescript
getQuoteQuantityOut(
  poolKey: string,
  baseQuantity: number,
): (tx: Transaction) => void
```

--------------------------------

### Create and Serialize Struct - JavaScript

Source: https://sdk.mystenlabs.com/typedoc/variables/_mysten_bcs.bcs

Illustrates how to define a struct with named fields using bcs.struct(). The example defines a struct with an unsigned 8-bit integer and a string field, then serializes an instance of this struct.

```javascript
const struct = bcs.struct('MyStruct', {
 a: bcs.u8(),
 b: bcs.string(),
})
struct.serialize({ a: 1, b: 'a' }).toBytes() // Uint8Array [ 1, 1, 97 ]
```

--------------------------------

### Purchase Item with Kiosk SDK (Mysten SDK V2)

Source: https://sdk.mystenlabs.com/kiosk/from-v1

This snippet demonstrates purchasing an item using the newer Mysten SDK V2 with the Kiosk module. It simplifies the process by using a dedicated KioskTransaction class. Dependencies include '@mysten/kiosk' and '@mysten/sui/jsonRpc'. This method works for both personal and non-personal kiosks.

```typescript
import { kiosk, KioskTransaction } from '@mysten/kiosk';
import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';

// You need to do this only once and re-use it in the application.
const client = new SuiJsonRpcClient({
	url: getJsonRpcFullnodeUrl('mainnet'),
	network: 'mainnet',
}).$extend(kiosk());

// An Item as returned from `client.kiosk.getKiosk()` call.
const item = {
	isLocked: false,
	objectId: '0xb892d61a9992a10c9453efcdbd14ca9720d7dc1000a2048224209c9e544ed223',
	type: '0x52852c4ba80040395b259c641e70b702426a58990ff73cecf5afd31954429090::test::TestItem',
	kioskId: '0xSomeKioskAddress',
	listing: {
		isExclusive: false,
		listingId: '0x368b512ff2514dbea814f26ec9a3d41198c00e8ed778099961e9ed22a9f0032b',
		price: '20000000000', // in MIST
	},
};

const purchase = async () => {
	// Assume you have saved the user's preferred kiosk Cap somewhere in your app's state.
	// You wouldn't need to query this for every purchase.
	const { kioskOwnerCaps } = await client.kiosk.getOwnedKiosks({ address: '0xSomeAddress' });

	const tx = new Transaction();

	const kioskTx = new KioskTransaction({
		ransaction: tx,
		kioskClient: client.kiosk,
		cap: kioskOwnerCaps[0],
	});

	// Purchase the item and resolve the rules.
	await kioskTx.purchaseAndResolve({
		itemType: item.type,
		itemId: item.objectId,
		price: item.listing.price,
		sellerKiosk: item.kioskId,
	});

	kioskTx.finalize();
};

```

--------------------------------

### Derive Multisig Address with zkLogin and Single Key

Source: https://sdk.mystenlabs.com/sui/cryptography/multisig

This example demonstrates how to compute a multisig address using a combination of a single Ed25519 keypair and a zkLogin public identifier. It involves generating an address seed from JWT values and a user salt, deriving the zkLogin public identifier, and then constructing the MultiSigPublicKey.

```typescript
const kp1 = new Ed25519Keypair();
const pkSingle = kp1.getPublicKey();

const decodedJWT = decodeJwt('a valid jwt token here');
const userSalt = BigInt('123'); 
const addressSeed = genAddressSeed(userSalt, 'sub', decodedJWT.sub, decodedJWT.aud).toString();

let pkZklogin = toZkLoginPublicIdentifier(addressSeed, decodedJWT.iss);

const multiSigPublicKey = MultiSigPublicKey.fromPublicKeys({
	threshold: 1,
	publicKeys: [
		{ publicKey: pkSingle, weight: 1 },
		{ publicKey: pkZklogin, weight: 1 },
	],
});

const multisigAddress = multiSigPublicKey.toSuiAddress();
```

--------------------------------

### BcsStruct Class Overview

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_bcs.BcsStruct

Provides an overview of the BcsStruct class, including its type parameters, hierarchy, constructors, properties, and available methods for data manipulation.

```APIDOC
## Class BcsStruct<T, Name>

#### Type Parameters
  * T extends Record<string, BcsType<any>>
  * const Name extends string = string

#### Hierarchy
  * BcsType< { [K in keyof T]: T[K] extends BcsType<infer U, any> ? U : never }, { [K in keyof T]: T[K] extends BcsType<any, infer U> ? U : never }, Name >
    * BcsStruct

### Constructors

#### constructor
  * `new BcsStruct<T extends Record<string, BcsType<any, any, string>>, Name extends string = string>(__namedParameters: BcsStructOptions<T, Name>)`
    * **Parameters**
      * `__namedParameters`: BcsStructOptions<T, Name>
    * **Returns** BcsStruct<T, Name>

### Properties

#### $inferInput
  * `$inferInput`: { [K in string | number | symbol]: T[K] extends BcsType<any, U, string> ? U : never }

#### $inferType
  * `$inferType`: { [K in string | number | symbol]: T[K] extends BcsType<U, any, string> ? U : never }

#### name
  * `name`: Name

#### read
  * `read`: (reader: BcsReader) => { [K in string | number | symbol]: T[K] extends BcsType<U, any, string> ? U : never }

#### serializedSize
  * `serializedSize`: (value: { [K in string | number | symbol]: T[K] extends BcsType<any, U, string> ? U : never }, options?: BcsWriterOptions) => number | null

#### validate
  * `validate`: (value: { [K in string | number | symbol]: T[K] extends BcsType<any, U, string> ? U : never }) => void

### Methods

#### fromBase58
  * `fromBase58(b64: string)`
    * **Parameters**
      * `b64`: string
    * **Returns** { [K in string | number | symbol]: T[K] extends BcsType<U, any, string> ? U : never }

#### fromBase64
  * `fromBase64(b64: string)`
    * **Parameters**
      * `b64`: string
    * **Returns** { [K in string | number | symbol]: T[K] extends BcsType<U, any, string> ? U : never }

#### fromHex
  * `fromHex(hex: string)`
    * **Parameters**
      * `hex`: string
    * **Returns** { [K in string | number | symbol]: T[K] extends BcsType<U, any, string> ? U : never }

#### parse
  * `parse(bytes: Uint8Array)`
    * **Parameters**
      * `bytes`: Uint8Array
    * **Returns** { [K in string | number | symbol]: T[K] extends BcsType<U, any, string> ? U : never }

#### serialize
  * `serialize(value: { [K in string | number | symbol]: T[K] extends BcsType<any, U, string> ? U : never }, options?: BcsWriterOptions)`
    * **Parameters**
      * `value`: { [K in string | number | symbol]: T[K] extends BcsType<any, U, string> ? U : never }
      * `options`: BcsWriterOptions (Optional)
    * **Returns** SerializedBcs< { [K in string | number | symbol]: T[K] extends BcsType<U, any, string> ? U : never }, { [K in string | number | symbol]: T[K] extends BcsType<any, U, string> ? U : never } >

#### transform
  * `transform<T2 = { [K in string | number | symbol]: T[K] extends BcsType<U, any, string> ? U : never }, Input2 = { [K in string | number | symbol]: T[K] extends BcsType<any, U, string> ? U : never }, NewName extends string = Name>(__namedParameters: { input?: (val: Input2) => { [K in string | number | symbol]: T[K] extends BcsType<any, U, string> ? U : never }; output?: (value: { [K in string | number | symbol]: T[K] extends BcsType<U, any, string> ? U : never }) => T2 } & BcsTypeOptions<T2, Input2, NewName>)
    * **Type Parameters**
      * `T2` = { [K in string | number | symbol]: T[K] extends BcsType<U, any, string> ? U : never }
      * `Input2` = { [K in string | number | symbol]: T[K] extends BcsType<any, U, string> ? U : never }
      * `NewName` extends string = Name
    * **Parameters**
      * `__namedParameters`: { input?: (val: Input2) => { [K in string | number | symbol]: T[K] extends BcsType<any, U, string> ? U : never }; output?: (value: { [K in string | number | symbol]: T[K] extends BcsType<U, any, string> ? U : never }) => T2 } & BcsTypeOptions<T2, Input2, NewName>
    * **Returns** BcsType<T2, Input2, NewName>
```

--------------------------------

### MultiSigSigner Methods

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.multisig.MultiSigSigner

Provides details on the various methods available for the MultiSigSigner class, including key scheme retrieval, public key access, transaction signing, and message signing.

```APIDOC
## Methods

### getKeyScheme
  * getKeyScheme(): SignatureScheme
Get the key scheme of the keypair: Secp256k1 or ED25519
#### Returns SignatureScheme

### getPublicKey
  * getPublicKey(): MultiSigPublicKey
The public key for this keypair
#### Returns MultiSigPublicKey

### sign
  * sign(_data: Uint8Array): never
#### Parameters
    * _data: Uint8Array
#### Returns never

### signAndExecuteTransaction
  * signAndExecuteTransaction(
__namedParameters: SignAndExecuteOptions,
): Promise<
SuiClientTypes.TransactionResult<{ effects: true; transaction: true }>,
>
#### Parameters
    * __namedParameters: SignAndExecuteOptions
#### Returns Promise<SuiClientTypes.TransactionResult<{ effects: true; transaction: true }>>

### signPersonalMessage
  * signPersonalMessage(
bytes: Uint8Array,
): Promise<{ bytes: string; signature: string }>
Signs provided personal message by calling `signWithIntent()` with a `PersonalMessage` provided as intent scope
#### Parameters
    * bytes: Uint8Array
#### Returns Promise<{ bytes: string; signature: string }>

### signTransaction
  * signTransaction(
bytes: Uint8Array,
): Promise<{ bytes: string; signature: string }>
Signs provided transaction by calling `signWithIntent()` with a `TransactionData` provided as intent scope
#### Parameters
    * bytes: Uint8Array
#### Returns Promise<{ bytes: string; signature: string }>

### signWithIntent
  * signWithIntent(
bytes: Uint8Array,
intent: IntentScope,
): Promise<SignatureWithBytes>
Sign messages with a specific intent. By combining the message bytes with the intent before hashing and signing, it ensures that a signed message is tied to a specific purpose and domain separator is provided
#### Parameters
    * bytes: Uint8Array
    * intent: IntentScope
#### Returns Promise<SignatureWithBytes>

### toSuiAddress
  * toSuiAddress(): string
#### Returns string
```

--------------------------------

### Get Balance Manager IDs

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Retrieves the balance manager IDs associated with a given owner address. It takes the owner's address as input and returns a function that accepts a Transaction object and returns void.

```typescript
function getBalanceManagerIds(owner: string): (tx: Transaction) => void;
```

--------------------------------

### Create Sui dApp with Specific Template and Name

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/create-dapp

Command-line flags to bypass interactive prompts when creating a Sui dApp. You can specify the template (`-t`) and project name (`-n`) directly.

```bash
# Create with specific template
npm create @mysten/dapp -- -t react-e2e-counter

# Create with specific name
npm create @mysten/dapp -- -n my-app

# Create with both
npm create @mysten/dapp -- -t react-client-dapp -n my-app
```

--------------------------------

### Get Margin Pool Total Borrow (TypeScript)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the total borrow amount for a specified margin pool. It takes a coin key to identify the pool and an optional number of decimals for formatting the output. The function returns a Promise that resolves to the total borrow amount as a string.

```typescript
import { getMarginPoolTotalBorrow } from "@mysten/sdk";

async function fetchTotalBorrow(coinKey: string, decimals: number = 6): Promise<string> {
  try {
    const totalBorrow = await getMarginPoolTotalBorrow(coinKey, decimals);
    return totalBorrow;
  } catch (error) {
    console.error("Error fetching total borrow:", error);
    throw error;
  }
}
```

--------------------------------

### Generate Proof As Owner

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.BalanceManagerContract

Generates a trade proof specifically as the owner of the BalanceManager.

```APIDOC
## GET /generateProofAsOwner

### Description
Generate a trade proof as the owner.

### Method
GET

### Endpoint
/generateProofAsOwner

### Parameters
#### Path Parameters
N/A

#### Query Parameters
- **managerId** (string) - Required - The ID of the BalanceManager.

#### Request Body
N/A

### Request Example
```json
{
  "managerId": "string"
}
```

### Response
#### Success Response (200)
- **tx** (Transaction) - A function that takes a Transaction object.
- **result** (TransactionResult) - The result of the transaction.

#### Response Example
```json
{
  "tx": "Transaction Function",
  "result": "TransactionResult"
}
```
```

--------------------------------

### Get User Activation State with Navigator.userActivation

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_wallet-standard.DEPRECATED_WalletsNavigator

The userActivation read-only property returns a UserActivation object. This object contains information about the current window's user activation state, such as whether the user has recently interacted with the page through clicks or key presses.

```javascript
if (navigator.userActivation) {
  console.log('Has recent user activation:', navigator.userActivation.hasBeenActive); 
  console.log('Is currently active:', navigator.userActivation.isActive);
}
```

--------------------------------

### Get Quorum (TypeScript)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Fetches the quorum information for a specified pool. Quorum is a critical concept in decentralized systems, often related to consensus or the minimum number of participants required for an action. It returns a transaction result.

```typescript
quorum(poolKey: string): (tx: Transaction) => TransactionResult
```

--------------------------------

### Write Blob Options

Source: https://sdk.mystenlabs.com/typedoc/types/_mysten_walrus.WriteBlobOptions

Defines the structure for options when writing a blob using the Walrus client. This includes blob data, storage duration, ownership, and signing information.

```APIDOC
## Write Blob Options

### Description
This section details the `WriteBlobOptions` type alias used for writing blobs. It specifies the required and optional fields necessary for the operation, including blob content, storage parameters, and ownership details.

### Method
N/A (This describes a data structure, not an HTTP endpoint)

### Endpoint
N/A

### Parameters
#### Request Body (Conceptual - Represents the `WriteBlobOptions` object)
- **attributes** (Record<string, string | null>) - Optional - The attributes to write for the blob.
- **blob** (Uint8Array) - Required - The actual blob data to be written.
- **deletable** (boolean) - Required - Indicates if the blob can be deleted.
- **epochs** (number) - Required - The number of epochs the blob should be stored for.
- **owner** (string) - Optional - Where the blob should be transferred to after it is registered. Defaults to the signer address.
- **signer** (Signer) - Required - The signer object responsible for authorizing the operation.

### Request Example
```json
{
  "blob": "Uint8Array representation of the blob data",
  "deletable": true,
  "epochs": 10,
  "attributes": {
    "contentType": "application/json"
  },
  "owner": "0x123...",
  "signer": "Signer object"
}
```

### Response
#### Success Response (Conceptual)
This operation typically returns a confirmation or identifier for the written blob. The exact structure depends on the SDK's implementation.

- **confirmation** (any) - Description of the success confirmation.

#### Response Example
```json
{
  "confirmation": "Blob written successfully with ID: xyz789"
}
```
```

--------------------------------

### Get String Representation of an Array (JavaScript)

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_wallet-standard.ReadonlyUint8Array

The toString method returns a string representing an array. It concatenates all of the elements in an array into a string, separated by commas, or by another string and a separator if provided.

```javascript
const arr = [1, 2, 'a', 'b'];
console.log(arr.toString()); // "1,2,a,b"
```

--------------------------------

### Get Mid Price (TypeScript)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Retrieves the mid-price for a given trading pool. The mid-price is the average of the best bid and ask prices and is a key indicator for market liquidity and trading strategies. It returns a transaction object.

```typescript
midPrice(poolKey: string): (tx: Transaction) => void
```

--------------------------------

### Get Pool Trade Parameters (TypeScript)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Fetches the trade parameters for a given pool, including taker fee, maker fee, and the required stake. These parameters are crucial for understanding the costs and requirements associated with trading in the pool. It returns a transaction object.

```typescript
poolTradeParams(poolKey: string): (tx: Transaction) => void
```

--------------------------------

### addConfig

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginAdminContract

Adds a PythConfig to the margin registry.

```APIDOC
## POST /addConfig

### Description
Add the PythConfig to the margin registry.

### Method
POST

### Endpoint
/addConfig

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **config** (TransactionArgument) - Required - The config to be added

### Request Example
```json
{
  "config": "TransactionArgument"
}
```

### Response
#### Success Response (200)
- **tx** (Transaction) - A function that takes a Transaction object.

#### Response Example
```json
{
  "tx": "(tx: Transaction) => void"
}
```
```

--------------------------------

### Get Margin Pool Max Utilization Rate

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginPoolContract

Fetches the maximum utilization rate allowed for a margin pool. This indicates the upper limit of leveraged positions. The coin key specifies the pool.

```typescript
const coinKey = 'USDC';
const txResult = marginPoolContract.maxUtilizationRate(coinKey)(new Transaction());
// txResult will be a TransactionResult object
```

--------------------------------

### Run Unit and E2E Tests for Sui TypeScript SDK

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_sui

Commands to execute unit and end-to-end tests for the '@mysten/sui' package. This includes running all unit tests, preparing and running E2E tests against a local network, and optionally running specific test files.

```bash
pnpm --filter @mysten/sui test:unit
```

```bash
pnpm --filter @mysten/sui prepare:e2e  

# This will run all e2e tests  
pnpm --filter @mysten/sui test:e2e  

# Alternatively you can choose to run only one test file  
npx vitest txn-builder.test.ts
```

--------------------------------

### Mysten Labs SDK: Transaction Expiration Settings

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.transactions.TransactionDataBuilder

Defines various options for transaction expiration in the Mysten Labs SDK. This includes setting an epoch, a specific valid duration with start and end times/epochs, or no expiration.

```typescript
expiration?: |
  | EnumOutputShapeWithKeys<
      {
        Epoch: string | number;
        None: true;
        ValidDuring: {
          chain: string;
          maxEpoch: string | number | null;
          maxTimestamp: string | number | null;
          minEpoch: string | number | null;
          minTimestamp: string | number | null;
          nonce: number;
        };
      },
      "None" | "ValidDuring" | "Epoch",
    >
  | null;
```

--------------------------------

### Configure Upload Relay with Linear Tip

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_walrus

This snippet illustrates configuring an upload relay with a linear tip. The `sendTip` configuration uses a `linear` kind, specifying a base amount and an additional amount per encoded Kibibyte of the blob.

```javascript
const client = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
}).$extend(
	walrus({
		uploadRelay: {
			host: 'https://upload-relay.testnet.walrus.space',
			sendTip: {
				address: '0x123...',
				kind: {
					linear: {
						base: 105,
						perEncodedKib: 10,
					},
				},
			},
		},
	}),
);

```

--------------------------------

### Static Method: Create Multiple ZkSend Links

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_zksend.ZkSendLinkBuilder

Illustrates the usage of the static `createLinks` method, which allows for the creation of multiple ZkSend links in a batched transaction. It requires a client, an array of ZkSendLinkBuilder instances, and optionally network and contract options.

```typescript
import { ZkSendLinkBuilder } from "@mysten/zksend";
import { ClientWithCoreApi } from "@mysten/sui.js";

// Assume 'client' is an initialized SuiClient and 'builders' is an array of ZkSendLinkBuilder instances
const client: ClientWithCoreApi = // ... initialize your client
const builders: ZkSendLinkBuilder[] = []; // ... populate with ZkSendLinkBuilder instances

const transaction = await ZkSendLinkBuilder.createLinks({
  client: client,
  links: builders,
  network: "testnet",
});

console.log("Batch links transaction:", transaction);
```

--------------------------------

### Get Pool Referral Multiplier (TypeScript)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Retrieves the referral multiplier for a given pool and referral code. This function is used to determine the specific benefits or adjustments associated with a particular referral. It returns a transaction result.

```typescript
poolReferralMultiplier(
  poolKey: string,
  referral: string,
): (tx: Transaction) => TransactionResult
```

--------------------------------

### Mint SUI using Sui TypeScript SDK

Source: https://sdk.mystenlabs.com/sui/hello-sui

This JavaScript code mints SUI tokens to a specified address on the Sui Devnet using the Sui TypeScript SDK. It initializes a Sui gRPC client, retrieves the SUI balance before and after the faucet request, and logs the result. Ensure you replace '<YOUR_SUI_ADDRESS>' with your actual Sui address.

```javascript
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { getFaucetHost, requestSuiFromFaucetV2 } from '@mysten/sui/faucet';
import { MIST_PER_SUI } from '@mysten/sui/utils';

// replace <YOUR_SUI_ADDRESS> with your actual address, which is in the form 0x123...
const MY_ADDRESS = '<YOUR_SUI_ADDRESS>';

// create a new SuiGrpcClient object pointing to the network you want to use
const suiClient = new SuiGrpcClient({
	network: 'devnet',
	baseUrl: 'https://fullnode.devnet.sui.io:443',
});

// Convert MIST to Sui
const balance = (balance) => {
	return Number.parseInt(balance.totalBalance) / Number(MIST_PER_SUI);
};

// store the JSON representation for the SUI the address owns before using faucet
const suiBefore = await suiClient.getBalance({
	owner: MY_ADDRESS,
});

await requestSuiFromFaucetV2({
	// use getFaucetHost to make sure you're using correct faucet address
	// you can also just use the address (see Sui TypeScript SDK Quick Start for values)
	host: getFaucetHost('devnet'),
	recipient: MY_ADDRESS,
});

// store the JSON representation for the SUI the address owns after using faucet
const suiAfter = await suiClient.getBalance({
	owner: MY_ADDRESS,
});

// Output result to console.
console.log(
	`Balance before faucet: ${balance(suiBefore)} SUI. Balance after: ${balance(
		suiAfter,
	)} SUI. Hello, SUI!`);

```

--------------------------------

### Class-based Dark Mode Toggle in React

Source: https://sdk.mystenlabs.com/dapp-kit/theming

Shows a React example of how to toggle between light and dark themes using CSS classes. This snippet demonstrates conditional class application based on a state variable (`isDark`) to control the theme.

```jsx
<div className={isDark ? 'dark-theme' : 'light-theme'}>
	<ConnectButton />
</div>
```

--------------------------------

### SDK Client Structure and Methods

Source: https://sdk.mystenlabs.com/sui/sdk-building

Demonstrates the structure of a Mysten SDK client, including top-level methods, transaction builders, Move call helpers, and view methods for interacting with the blockchain.

```typescript
import { Transaction } from '@mysten/sui/transactions';
import * as myModule from './contracts/my-package/my-module';

export class MySDKClient {
	#client: ClientWithCoreApi;

	constructor({ client }: { client: ClientWithCoreApi }) {
		this.#client = client;
	}

	// Top-level methods - execute actions or read/parse data
	async executeAction(options: ActionOptions) {
		const transaction = this.tx.createAction(options);
		// Execute and return result
	}

	async getResource(objectId: string) {
		const { object } = await this.#client.core.getObject({
			objectId,
			include: { content: true },
		});
		return myModule.MyStruct.parse(object.content);
	}

	// Transaction builders
	tx = {
		createAction: (options: ActionOptions) => {
			const transaction = new Transaction();
			ransaction.add(this.call.action(options));
			return transaction;
		},
	};

	// Move call helpers - use generated functions with typed options
	call = {
		action: (options: ActionOptions) => {
			return myModule.action({
				arguments: {
					obj: options.objectId,
					amount: options.amount,
				},
			});
		},
	};

	// View methods - use simulate API to read onchain state
	view = {
		getBalance: async (managerId: string) => {
			const tx = new Transaction();
			tx.add(myModule.getBalance({ arguments: { manager: managerId } }));

			const res = await this.#client.core.simulateTransaction({
				transaction: tx,
				include: { commandResults: true },
			});

			return bcs.U64.parse(res.commandResults![0].returnValues[0].bcs);
		},
	};
}

```

--------------------------------

### Get Base Margin Pool ID - TypeScript

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the base margin pool ID for a given pool key. This function is essential for interacting with specific trading pools within the system.

```typescript
/**
 * Get the base margin pool ID for a deepbook pool
 * @param poolKey Key of the pool
 * @returns The base margin pool ID
 */
async getBaseMarginPoolId(poolKey: string): Promise<string>
```

--------------------------------

### SuiPythClient Methods

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.SuiPythClient

Methods available on the SuiPythClient class.

```APIDOC
## getBaseUpdateFee

### Description
Returns the cached base update fee, fetching it if necessary.

### Method
GET

### Endpoint
N/A (Method within a class)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
N/A (Method call)

### Response
#### Success Response (200)
- **fee** (number) - The base update fee.

#### Response Example
```json
1000
```

## getPriceFeedObjectId

### Description
Get the price feed object ID for a given feed ID, caching the promise.

### Method
GET

### Endpoint
N/A (Method within a class)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```json
{
  "feedId": "0x..."
}
```

### Response
#### Success Response (200)
- **objectId** (string | undefined) - The object ID of the price feed, or undefined if not found.

#### Response Example
```json
"0xabc..."
```

## getPriceTableInfo

### Description
Fetches the price table object ID for the current state ID, caching the promise.

### Method
GET

### Endpoint
N/A (Method within a class)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
N/A (Method call)

### Response
#### Success Response (200)
- **fieldType** (string) - The type of the field.
- **id** (string) - The object ID of the price table.

#### Response Example
```json
{
  "fieldType": "price",
  "id": "0x123..."
}
```

## getPythPackageId

### Description
Fetches the package ID for the Pyth contract, with caching.

### Method
GET

### Endpoint
N/A (Method within a class)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
N/A (Method call)

### Response
#### Success Response (200)
- **packageId** (string) - The package ID of the Pyth contract.

#### Response Example
```json
"0xpythpackage..."
```

## getWormholePackageId

### Description
Fetches the package ID for the Wormhole contract, with caching.

### Method
GET

### Endpoint
N/A (Method within a class)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
N/A (Method call)

### Response
#### Success Response (200)
- **packageId** (string) - The package ID of the Wormhole contract.

#### Response Example
```json
"0xwormholepackage..."
```

## updatePriceFeeds

### Description
Adds the necessary commands for updating the Pyth price feeds to the transaction block.

### Method
POST

### Endpoint
N/A (Method within a class)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **tx** (Transaction) - Required - Transaction block to add commands to.
- **updates** (Uint8Array<ArrayBufferLike>[]) - Required - Array of price feed updates received from the price service.
- **feedIds** (string[]) - Required - Array of feed IDs to update (in hex format).

### Request Example
```json
{
  "tx": "TransactionObject",
  "updates": [
    "0x...",
    "0x..."
  ],
  "feedIds": [
    "0xfeed1...",
    "0xfeed2..."
  ]
}
```

### Response
#### Success Response (200)
- **updateResults** (string[]) - An array of strings indicating the result of each update.

#### Response Example
```json
["success", "success"]
```

## verifyVaas

### Description
Verifies the VAAs using the Wormhole contract.

### Method
POST

### Endpoint
N/A (Method within a class)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **vaas** (Uint8Array<ArrayBufferLike>[]) - Required - Array of VAA buffers to verify.
- **tx** (Transaction) - Required - Transaction block to add commands to.

### Request Example
```json
{
  "vaas": [
    "0x...",
    "0x..."
  ],
  "tx": "TransactionObject"
}
```

### Response
#### Success Response (200)
- **verificationResults** (Array<{ $kind: "NestedResult"; NestedResult: [number, number] }>) - Array of verified VAAs.

#### Response Example
```json
[
  {
    "$kind": "NestedResult",
    "NestedResult": [1, 0]
  }
]
```
```

--------------------------------

### Get Ed25519 Public Key and Address

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.keypairs_ed25519.Ed25519Keypair

Demonstrates how to retrieve the public key and Sui address associated with an Ed25519 keypair. The public key is returned as an Ed25519PublicKey object, and the address as a string.

```typescript
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

// Assume keypair is already initialized
const keypair = new Ed25519Keypair();

const publicKey = keypair.getPublicKey();
const suiAddress = keypair.toSuiAddress();

console.log("Public Key:", publicKey);
console.log("Sui Address:", suiAddress);
```

--------------------------------

### Get Margin Manager Margin Pool ID

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Fetches the margin pool ID for a specified margin manager. The function returns the pool ID as a string or null if not found. The margin manager key is required.

```typescript
async getMarginManagerMarginPoolId(marginManagerKey: string): Promise<string | null>
```

--------------------------------

### React Connect Modal with Custom Filters

Source: https://sdk.mystenlabs.com/dapp-kit/react/components/connect-modal

Illustrates how to customize the wallet selection behavior of the ConnectModal component using the `filterFn` and `sortFn` props. These functions allow developers to control which wallets are displayed and in what order. This example filters out a specific wallet and sorts the remaining ones alphabetically by name.

```jsx
<ConnectModal
	open={open}
	filterFn={(wallet) => wallet.name !== 'ExcludedWallet'}
	sortFn={(a, b) => a.name.localeCompare(b.name)}
/>
```

--------------------------------

### Order Placement

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.PoolProxyContract

Methods for placing different types of orders.

```APIDOC
### placeLimitOrder
  * placeLimitOrder(
params: PlaceMarginLimitOrderParams,
): (tx: Transaction) => TransactionResult
#### Parameters
    * params: PlaceMarginLimitOrderParams
Parameters for placing a limit order
#### Returns (tx: Transaction) => TransactionResult
A function that takes a Transaction object
#### Description
Place a limit order

### placeMarketOrder
  * placeMarketOrder(
params: PlaceMarginMarketOrderParams,
): (tx: Transaction) => TransactionResult
#### Parameters
    * params: PlaceMarginMarketOrderParams
Parameters for placing a market order
#### Returns (tx: Transaction) => TransactionResult
A function that takes a Transaction object
#### Description
Place a market order

### placeReduceOnlyLimitOrder
  * placeReduceOnlyLimitOrder(
params: PlaceMarginLimitOrderParams,
): (tx: Transaction) => TransactionResult
#### Parameters
    * params: PlaceMarginLimitOrderParams
Parameters for placing a reduce only limit order
#### Returns (tx: Transaction) => TransactionResult
A function that takes a Transaction object
#### Description
Place a reduce only limit order

### placeReduceOnlyMarketOrder
  * placeReduceOnlyMarketOrder(
params: PlaceMarginMarketOrderParams,
): (tx: Transaction) => TransactionResult
#### Parameters
    * params: PlaceMarginMarketOrderParams
Parameters for placing a reduce only market order
#### Returns (tx: Transaction) => TransactionResult
A function that takes a Transaction object
#### Description
Place a reduce only market order
```

--------------------------------

### Get Quote Quantity Out with Input Fee (TypeScript)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Retrieves the quote quantity out for a specified base quantity, utilizing the input token as the fee. This function is useful when the fee is paid in the same token being converted. It returns a transaction result.

```typescript
getQuoteQuantityOutInputFee(
  poolKey: string,
  baseQuantity: number,
): (tx: Transaction) => TransactionResult
```

--------------------------------

### Read Files from a Walrus Blob (Quilt)

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_walrus

Demonstrates various ways to read files contained within a Walrus blob, which might be a quilt. This includes getting all files, filtering by identifier, filtering by tags, or filtering by quilt ID.

```typescript
// Get all files:
const files = await blob.files();
// Get files by identifier
const [readme] = await blob.files({ identifiers: ['README.md'] });
// Get files by tag
const textFiles: WalrusFile[] = await blob.files({ tags: [{ 'content-type': 'text/plain' }] });
// Get files by quilt id
const filesById = await blob.files({ ids: [quiltID] });
```

--------------------------------

### Initialize WalrusClient

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_walrus.WalrusClient

Initializes a new instance of the WalrusClient. This constructor requires a configuration object of type WalrusClientConfig.

```typescript
new WalrusClient(config: WalrusClientConfig): WalrusClient
```

--------------------------------

### Get Margin Pool Interest Rate

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginPoolContract

Retrieves the current interest rate for a margin pool. This is essential for understanding borrowing costs. The function uses the pool's coin key.

```typescript
const coinKey = 'USDC';
const txResult = marginPoolContract.interestRate(coinKey)(new Transaction());
// txResult will be a TransactionResult object
```

--------------------------------

### Get Level 2 Range - TypeScript

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves level 2 order book data for a specified price range within a pool. It allows fetching either bid or ask orders based on the 'isBid' parameter.

```typescript
/**
 * Get level 2 order book specifying range of price
 * @param poolKey Key of the pool
 * @param priceLow Lower bound of the price range
 * @param priceHigh Upper bound of the price range
 * @param isBid Whether to get bid or ask orders
 * @returns An object with arrays of prices and quantities
 */
async getLevel2Range(
  poolKey: string,
  priceLow: number,
  priceHigh: number,
  isBid: boolean,
): Promise<{ prices: number[]; quantities: number[] }>
```

--------------------------------

### Construct WalrusFile from various types (JavaScript)

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_walrus

Demonstrates how to create `WalrusFile` objects from `Uint8Array`, `Blob`, or strings. These files can then be stored on Walrus. The `identifier` is mandatory, and `tags` can be optionally provided for metadata.

```javascript
const file1 = WalrusFile.from({
	contents: new Uint8Array([1, 2, 3]),
	identifier: 'file1.bin',
});
const file2 = WalrusFile.from({
	contents: new Blob([new Uint8Array([1, 2, 3])]),
	identifier: 'file2.bin',
});
const file3 = WalrusFile.from({
	contents: new TextEncoder().encode('Hello from the TS SDK!!!\n'),
	identifier: 'README.md',
	tags: {
		'content-type': 'text/plain',
	},
});
```

--------------------------------

### Get Margin Manager State

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves comprehensive state information for a margin manager. This includes details about base and quote assets, debt, prices, pool IDs, and risk ratios. An optional 'decimals' parameter can be provided.

```typescript
getMarginManagerState(marginManagerKey: string, decimals?: number): Promise<{ baseAsset: string; baseDebt: string; basePythDecimals: number; basePythPrice: string; currentPrice: bigint; deepbookPoolId: string; highestTriggerBelowPrice: bigint; lowestTriggerAbovePrice: bigint; managerId: string; quoteAsset: string; quoteDebt: string; quotePythDecimals: number; quotePythPrice: string; riskRatio: number; }>
```

--------------------------------

### MarginManagerContract Methods

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginManagerContract

Provides documentation for various methods within the MarginManagerContract class.

```APIDOC
## GET /websites/sdk_mystenlabs/MarginManagerContract/balanceManager

### Description
Get the balance manager ID for a margin manager.

### Method
GET

### Endpoint
/websites/sdk_mystenlabs/MarginManagerContract/balanceManager

### Parameters
#### Path Parameters
None

#### Query Parameters
- **poolKey** (string) - Required - The key to identify the pool
- **marginManagerId** (string) - Required - The ID of the margin manager

#### Request Body
None

### Request Example
```json
{
  "poolKey": "pool123",
  "marginManagerId": "mm456"
}
```

### Response
#### Success Response (200)
- **transactionResult** (object) - A function that takes a Transaction object and returns a TransactionResult.

#### Response Example
```json
{
  "transactionResult": "(tx: Transaction) => TransactionResult"
}
```
```

```APIDOC
## GET /websites/sdk_mystenlabs/MarginManagerContract/baseBalance

### Description
Get the base asset balance of a margin manager.

### Method
GET

### Endpoint
/websites/sdk_mystenlabs/MarginManagerContract/baseBalance

### Parameters
#### Path Parameters
None

#### Query Parameters
- **poolKey** (string) - Required - The key to identify the pool
- **marginManagerId** (string) - Required - The ID of the margin manager

#### Request Body
None

### Request Example
```json
{
  "poolKey": "pool123",
  "marginManagerId": "mm456"
}
```

### Response
#### Success Response (200)
- **transactionResult** (object) - A function that takes a Transaction object and returns a TransactionResult.

#### Response Example
```json
{
  "transactionResult": "(tx: Transaction) => TransactionResult"
}
```
```

```APIDOC
## POST /websites/sdk_mystenlabs/MarginManagerContract/borrowBase

### Description
Borrow base from a margin manager.

### Method
POST

### Endpoint
/websites/sdk_mystenlabs/MarginManagerContract/borrowBase

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **managerKey** (string) - Required - The key to identify the manager
- **amount** (number) - Required - The amount to borrow

### Request Example
```json
{
  "managerKey": "manager789",
  "amount": 1000
}
```

### Response
#### Success Response (200)
- **transactionResult** (object) - A function that takes a Transaction object and returns a TransactionResult.

#### Response Example
```json
{
  "transactionResult": "(tx: Transaction) => TransactionResult"
}
```
```

```APIDOC
## GET /websites/sdk_mystenlabs/MarginManagerContract/borrowedBaseShares

### Description
Get borrowed base shares.

### Method
GET

### Endpoint
/websites/sdk_mystenlabs/MarginManagerContract/borrowedBaseShares

### Parameters
#### Path Parameters
None

#### Query Parameters
- **poolKey** (string) - Required - The key to identify the pool
- **marginManagerId** (string) - Required - The ID of the margin manager

#### Request Body
None

### Request Example
```json
{
  "poolKey": "pool123",
  "marginManagerId": "mm456"
}
```

### Response
#### Success Response (200)
- **transactionResult** (object) - A function that takes a Transaction object and returns a TransactionResult.

#### Response Example
```json
{
  "transactionResult": "(tx: Transaction) => TransactionResult"
}
```
```

```APIDOC
## GET /websites/sdk_mystenlabs/MarginManagerContract/borrowedQuoteShares

### Description
Get borrowed quote shares.

### Method
GET

### Endpoint
/websites/sdk_mystenlabs/MarginManagerContract/borrowedQuoteShares

### Parameters
#### Path Parameters
None

#### Query Parameters
- **poolKey** (string) - Required - The key to identify the pool
- **marginManagerId** (string) - Required - The ID of the margin manager

#### Request Body
None

### Request Example
```json
{
  "poolKey": "pool123",
  "marginManagerId": "mm456"
}
```

### Response
#### Success Response (200)
- **transactionResult** (object) - A function that takes a Transaction object and returns a TransactionResult.

#### Response Example
```json
{
  "transactionResult": "(tx: Transaction) => TransactionResult"
}
```
```

```APIDOC
## GET /websites/sdk_mystenlabs/MarginManagerContract/borrowedShares

### Description
Get borrowed shares for both base and quote assets.

### Method
GET

### Endpoint
/websites/sdk_mystenlabs/MarginManagerContract/borrowedShares

### Parameters
#### Path Parameters
None

#### Query Parameters
- **poolKey** (string) - Required - The key to identify the pool
- **marginManagerId** (string) - Required - The ID of the margin manager

#### Request Body
None

### Request Example
```json
{
  "poolKey": "pool123",
  "marginManagerId": "mm456"
}
```

### Response
#### Success Response (200)
- **transactionResult** (object) - A function that takes a Transaction object and returns a TransactionResult.

#### Response Example
```json
{
  "transactionResult": "(tx: Transaction) => TransactionResult"
}
```
```

```APIDOC
## POST /websites/sdk_mystenlabs/MarginManagerContract/borrowQuote

### Description
Borrow quote from a margin manager.

### Method
POST

### Endpoint
/websites/sdk_mystenlabs/MarginManagerContract/borrowQuote

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **managerKey** (string) - Required - The key to identify the manager
- **amount** (number) - Required - The amount to borrow

### Request Example
```json
{
  "managerKey": "manager789",
  "amount": 500
}
```

### Response
#### Success Response (200)
- **transactionResult** (object) - A function that takes a Transaction object and returns a TransactionResult.

#### Response Example
```json
{
  "transactionResult": "(tx: Transaction) => TransactionResult"
}
```
```

```APIDOC
## GET /websites/sdk_mystenlabs/MarginManagerContract/calculateAssets

### Description
Calculate assets (base and quote) for a margin manager.

### Method
GET

### Endpoint
/websites/sdk_mystenlabs/MarginManagerContract/calculateAssets

### Parameters
#### Path Parameters
None

#### Query Parameters
- **poolKey** (string) - Required - The key to identify the pool
- **marginManagerId** (string) - Required - The ID of the margin manager

#### Request Body
None

### Request Example
```json
{
  "poolKey": "pool123",
  "marginManagerId": "mm456"
}
```

### Response
#### Success Response (200)
- **transactionResult** (object) - A function that takes a Transaction object and returns a TransactionResult.

#### Response Example
```json
{
  "transactionResult": "(tx: Transaction) => TransactionResult"
}
```
```

```APIDOC
## GET /websites/sdk_mystenlabs/MarginManagerContract/calculateDebts

### Description
Calculate debts (base and quote) for a margin manager.

### Method
GET

### Endpoint
/websites/sdk_mystenlabs/MarginManagerContract/calculateDebts

### Parameters
#### Path Parameters
None

#### Query Parameters
- **poolKey** (string) - Required - The key to identify the pool
- **coinKey** (string) - Required - The key to identify the debt coin (base or quote)
- **marginManagerId** (string) - Required - The ID of the margin manager

#### Request Body
None

### Request Example
```json
{
  "poolKey": "pool123",
  "coinKey": "base",
  "marginManagerId": "mm456"
}
```

### Response
#### Success Response (200)
- **transactionResult** (object) - A function that takes a Transaction object and returns a TransactionResult.

#### Response Example
```json
{
  "transactionResult": "(tx: Transaction) => TransactionResult"
}
```
```

```APIDOC
## GET /websites/sdk_mystenlabs/MarginManagerContract/deepBalance

### Description
Get the deep balance for a margin manager.

### Method
GET

### Endpoint
/websites/sdk_mystenlabs/MarginManagerContract/deepBalance

### Parameters
#### Path Parameters
None

#### Query Parameters
- **poolKey** (string) - Required - The key to identify the pool
- **marginManagerId** (string) - Required - The ID of the margin manager

#### Request Body
None

### Request Example
```json
{
  "poolKey": "pool123",
  "marginManagerId": "mm456"
}
```

### Response
#### Success Response (200)
- **transactionResult** (object) - A function that takes a Transaction object and returns a TransactionResult.

#### Response Example
```json
{
  "transactionResult": "(tx: Transaction) => TransactionResult"
}
```
```

--------------------------------

### Get Owner by Pool Key

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginManagerContract

Retrieves the owner address associated with a margin manager for a given pool key. It requires the poolKey and marginManagerId as parameters and returns a function that takes a Transaction object to produce a TransactionResult.

```typescript
ownerByPoolKey(
  poolKey: string,
  marginManagerId: string,
): (tx: Transaction) => TransactionResult
```

--------------------------------

### Listen to Connect Modal Events (JavaScript)

Source: https://sdk.mystenlabs.com/dapp-kit/web-components/connect-modal

Provides examples of how to listen to various events emitted by the Connect Modal Web Component, such as 'open', 'opened', 'close', 'closed', and 'cancel'. This allows for custom logic to be executed at different stages of the modal's lifecycle.

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

### Window Event Handlers

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_wallet-standard.WalletEventsWindow

This section details the event handler properties for the Window object, covering events like abort, afterprint, animationcancel, animationend, animationiteration, animationstart, auxclick, beforeinput, beforeprint, beforeunload, blur, cancel, canplay, canplaythrough, change, click, close, contextlost, contextmenu, contextrestored, copy, cuechange, cut, dblclick, drag, dragend, dragenter, devicemotion, deviceorientation, deviceorientationabsolute.

```APIDOC
## Window Event Handlers

### Description
Allows for handling various user interactions and browser events.

### Parameters
#### Event Handlers
- **onabort**: Handler for the 'abort' event.
- **onafterprint**: Handler for the 'afterprint' event.
- **onanimationcancel**: Handler for the 'animationcancel' event.
- **onanimationend**: Handler for the 'animationend' event.
- **onanimationiteration**: Handler for the 'animationiteration' event.
- **onanimationstart**: Handler for the 'animationstart' event.
- **onauxclick**: Handler for the 'auxclick' event (e.g., middle mouse button click).
- **onbeforeinput**: Handler for the 'beforeinput' event.
- **onbeforematch**: Handler for the 'beforematch' event.
- **onbeforeprint**: Handler for the 'beforeprint' event.
- **onbeforetoggle**: Handler for the 'beforetoggle' event.
- **onbeforeunload**: Handler for the 'beforeunload' event (called before the page unloads).
- **onblur**: Handler for the 'blur' event (when the window loses focus).
- **oncancel**: Handler for the 'cancel' event.
- **oncanplay**: Handler for the 'canplay' event (media can start playing).
- **oncanplaythrough**: Handler for the 'canplaythrough' event (media can play without interruption).
- **onchange**: Handler for the 'change' event.
- **onclick**: Handler for the 'click' event.
- **onclose**: Handler for the 'close' event.
- **oncontextlost**: Handler for the 'contextlost' event.
- **oncontextmenu**: Handler for the 'contextmenu' event (when the context menu is triggered).
- **oncontextrestored**: Handler for the 'contextrestored' event.
- **oncopy**: Handler for the 'copy' event.
- **oncuechange**: Handler for the 'cuechange' event.
- **oncut**: Handler for the 'cut' event.
- **ondblclick**: Handler for the 'dblclick' event.
- **ondrag**: Handler for the 'drag' event.
- **ondragend**: Handler for the 'dragend' event.
- **ondragenter**: Handler for the 'dragenter' event.
- **ondragleave**: Handler for the 'dragleave' event.
- **ondragover**: Handler for the 'dragover' event.
- **ondrop**: Handler for the 'drop' event.
- **ondurationchange**: Handler for the 'durationchange' event.
- **onemptied**: Handler for the 'emptied' event.
- **onended**: Handler for the 'ended' event.
- **onerror**: Handler for the 'error' event.
- **onfocus**: Handler for the 'focus' event (when the window gains focus).
- **onformdata**: Handler for the 'formdata' event.
- **onhashchange**: Handler for the 'hashchange' event (when the URL fragment changes).
- **oninput**: Handler for the 'input' event.
- **oninvalid**: Handler for the 'invalid' event.
- **onkeydown**: Handler for the 'keydown' event.
- **onkeypress**: Handler for the 'keypress' event.
- **onkeyup**: Handler for the 'keyup' event.
- **onload**: Handler for the 'load' event (when the page has finished loading).
- **onloadeddata**: Handler for the 'loadeddata' event.
- **onloadedmetadata**: Handler for the 'loadedmetadata' event.
- **onloadstart**: Handler for the 'loadstart' event.
- **onmousedown**: Handler for the 'mousedown' event.
- **onmouseenter**: Handler for the 'mouseenter' event.
- **onmouseleave**: Handler for the 'mouseleave' event.
- **onmousemove**: Handler for the 'mousemove' event.
- **onmouseout**: Handler for the 'mouseout' event.
- **onmouseover**: Handler for the 'mouseover' event.
- **onmouseup**: Handler for the 'mouseup' event.
- **onpaste**: Handler for the 'paste' event.
- **onpause**: Handler for the 'pause' event.
- **onplay**: Handler for the 'play' event.
- **onplaying**: Handler for the 'playing' event.
- **onprogress**: Handler for the 'progress' event.
- **onratechange**: Handler for the 'ratechange' event.
- **onreset**: Handler for the 'reset' event.
- **onresize**: Handler for the 'resize' event.
- **onscroll**: Handler for the 'scroll' event.
- **onsecuritypolicyviolation**: Handler for the 'securitypolicyviolation' event.
- **onseeked**: Handler for the 'seeked' event.
- **onseeking**: Handler for the 'seeking' event.
- **onselect**: Handler for the 'select' event.
- **onselectionchange**: Handler for the 'selectionchange' event.
- **onselectstart**: Handler for the 'selectstart' event.
- **onslotchange**: Handler for the 'slotchange' event.
- **onstalled**: Handler for the 'stalled' event.
- **onstorage**: Handler for the 'storage' event.
- **onsubmit**: Handler for the 'submit' event.
- **onsuspend**: Handler for the 'suspend' event.
- **ontimeupdate**: Handler for the 'timeupdate' event.
- **ontoggle**: Handler for the 'toggle' event.
- **ontouchend**: Handler for the 'touchend' event.
- **ontouchmove**: Handler for the 'touchmove' event.
- **ontouchstart**: Handler for the 'touchstart' event.
- **ontransitioncancel**: Handler for the 'transitioncancel' event.
- **ontransitionend**: Handler for the 'transitionend' event.
- **ontransitionrun**: Handler for the 'transitionrun' event.
- **ontransitionstart**: Handler for the 'transitionstart' event.
- **onunhandledrejection**: Handler for the 'unhandledrejection' event.
- **onunload**: Handler for the 'unload' event (when the page is unloaded).
- **onvolumechange**: Handler for the 'volumechange' event.
- **onwaiting**: Handler for the 'waiting' event.
- **onwebkitanimationend**: Handler for the 'webkitAnimationEnd' event (vendor-prefixed).
- **onwebkitanimationiteration**: Handler for the 'webkitAnimationIteration' event (vendor-prefixed).
- **onwebkitanimationstart**: Handler for the 'webkitAnimationStart' event (vendor-prefixed).
- **onwebkittransitionend**: Handler for the 'webkitTransitionEnd' event (vendor-prefixed).
- **onwheel**: Handler for the 'wheel' event.

### Request Example
```javascript
window.onclick = function(event) {
  console.log('Window was clicked!');
};

window.onresize = function(event) {
  console.log('Window was resized!');
};
```

### Response Example
```json
{
  "onabort": "function",
  "onafterprint": "function",
  "onanimationcancel": "function",
  "onanimationend": "function",
  "onanimationiteration": "function",
  "onanimationstart": "function",
  "onauxclick": "function",
  "onbeforeinput": "function",
  "onbeforematch": "function",
  "onbeforeprint": "function",
  "onbeforetoggle": "function",
  "onbeforeunload": "function",
  "onblur": "function",
  "oncancel": "function",
  "oncanplay": "function",
  "oncanplaythrough": "function",
  "onchange": "function",
  "onclick": "function",
  "onclose": "function",
  "oncontextlost": "function",
  "oncontextmenu": "function",
  "oncontextrestored": "function",
  "oncopy": "function",
  "oncuechange": "function",
  "oncut": "function",
  "ondblclick": "function",
  "ondrag": "function",
  "ondragend": "function",
  "ondragenter": "function",
  "ondragleave": "function",
  "ondragover": "function",
  "ondrop": "function",
  "ondurationchange": "function",
  "onemptied": "function",
  "onended": "function",
  "onerror": "function",
  "onfocus": "function",
  "onformdata": "function",
  "onhashchange": "function",
  "oninput": "function",
  "oninvalid": "function",
  "onkeydown": "function",
  "onkeypress": "function",
  "onkeyup": "function",
  "onload": "function",
  "onloadeddata": "function",
  "onloadedmetadata": "function",
  "onloadstart": "function",
  "onmousedown": "function",
  "onmouseenter": "function",
  "onmouseleave": "function",
  "onmousemove": "function",
  "onmouseout": "function",
  "onmouseover": "function",
  "onmouseup": "function",
  "onpaste": "function",
  "onpause": "function",
  "onplay": "function",
  "onplaying": "function",
  "onprogress": "function",
  "onratechange": "function",
  "onreset": "function",
  "onresize": "function",
  "onscroll": "function",
  "onsecuritypolicyviolation": "function",
  "onseeked": "function",
  "onseeking": "function",
  "onselect": "function",
  "onselectionchange": "function",
  "onselectstart": "function",
  "onslotchange": "function",
  "onstalled": "function",
  "onstorage": "function",
  "onsubmit": "function",
  "onsuspend": "function",
  "ontimeupdate": "function",
  "ontoggle": "function",
  "ontouchend": "function",
  "ontouchmove": "function",
  "ontouchstart": "function",
  "ontransitioncancel": "function",
  "ontransitionend": "function",
  "ontransitionrun": "function",
  "ontransitionstart": "function",
  "onunhandledrejection": "function",
  "onunload": "function",
  "onvolumechange": "function",
  "onwaiting": "function",
  "onwebkitanimationend": "function",
  "onwebkitanimationiteration": "function",
  "onwebkitanimationstart": "function",
  "onwebkittransitionend": "function",
  "onwheel": "function"
}
```
```

--------------------------------

### Serialize an 8-bit Unsigned Integer (u8) with BCS

Source: https://sdk.mystenlabs.com/typedoc/variables/_mysten_bcs.bcs

An example of serializing an 8-bit unsigned integer using BCS. This type is suitable for small values ranging from 0 to 255.

```typescript
bcs.u8().serialize(255).toBytes() // Uint8Array [ 255 ]
```

--------------------------------

### BcsEnum Constructor and Properties

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_bcs.BcsEnum

Demonstrates the constructor signature and key properties of the BcsEnum class. This includes inferring input and output shapes, accessing the enum name, and understanding properties related to reading, validation, and serialized size calculation.

```typescript
new BcsEnum<T, Name>(
  __namedParameters: BcsEnumOptions<T, Name>
): BcsEnum<T, Name>

// Properties:
$inferInput: EnumInputShape
$inferType: EnumOutputShape
name: Name
read: (reader: BcsReader) => EnumOutputShape
serializedSize: (value: EnumInputShape, options?: BcsWriterOptions) => number | null
validate: (value: EnumInputShape) => void
```

--------------------------------

### Get Margin Manager Debts

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Calculates the base and quote debts for a margin manager. This function automatically determines the relevant margin pool based on 'hasBaseDebt' and does not require the user to specify the debt coin type. An optional 'decimals' parameter can be set.

```typescript
async getMarginManagerDebts(marginManagerKey: string, decimals?: number): Promise<{ baseDebt: string; quoteDebt: string }>
```

--------------------------------

### CommandOutput Interface

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_sui.client.SuiClientTypes.CommandOutput

Defines the structure for command output, specifically containing BCS encoded data.

```APIDOC
## Interface CommandOutput

### Description
Represents the output of a command, containing Base64 Serialization (BCS) encoded data.

### Properties

#### bcs
- **bcs** (Uint8Array) - The BCS encoded data as a Uint8Array.
```

--------------------------------

### Use dApp Kit Connect Button in Vue Template

Source: https://sdk.mystenlabs.com/dapp-kit/getting-started/vue

Demonstrates how to use the Mysten dApp Kit's connect button component within a Vue template. It requires importing the dAppKit instance and passing it as a prop to the custom element.

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

### Get Parent Window Reference

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_wallet-standard.DEPRECATED_WalletsWindow

The `parent` property returns a reference to the parent window of the current window or subframe. If the current window is the top-level window, `parent` will refer to itself.

```javascript
const parentWindow = window.parent;
console.log("Parent window:", parentWindow);
```

--------------------------------

### Get Window Opener Reference

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_wallet-standard.DEPRECATED_WalletsWindow

The `opener` property returns a reference to the window that opened the current window. This is useful for communication between parent and child windows, typically created using `window.open()`.

```javascript
const openerWindow = window.opener;
if (openerWindow) {
  console.log("This window was opened by:", openerWindow);
}
```

--------------------------------

### Write multiple files to Walrus using writeFiles (JavaScript)

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_walrus

Shows how to write an array of `WalrusFile` objects to Walrus using the `writeFiles` method. This requires a `Signer` instance to handle transaction signing and payment for storage fees. The `epochs` parameter specifies the duration of storage, and `deletable` indicates if the files can be deleted.

```javascript
const results = client.walrus.writeFiles({
	files: [file1, file2, file3],
	epochs: 3,
	deletable: true,
	signer: keypair,
});
```

--------------------------------

### Browser file writing flow using writeFilesFlow (JavaScript)

Source: https://sdk.mystenlabs.com/typedoc/modules/_mysten_walrus

Illustrates the step-by-step process for writing files in a browser environment using `writeFilesFlow`. This method breaks down the process into `encode`, `register`, `upload`, and `certify` steps to manage wallet signature prompts effectively. Each step requires separate user interaction to avoid browser popup blockers.

```javascript
// Step 1: Create and encode the flow (can be done immediately when file is selected)
const flow = client.walrus.writeFilesFlow({
	files: [
		WalrusFile.from({
			contents: new Uint8Array(fileData),
			identifier: 'my-file.txt',
		}),
	],
});

await flow.encode();

// Step 2: Register the blob (triggered by user clicking a register button after the encode step)
async function handleRegister() {
	const registerTx = flow.register({
		epochs: 3,
		owner: currentAccount.address,
		deletable: true,
	});
	const result = await signAndExecuteTransaction({ transaction: registerTx });

	// Check transaction status
	if (result.$kind === 'FailedTransaction') {
		throw new Error(`Registration failed: ${result.FailedTransaction.status.error?.message}`);
	}

	// Step 3: Upload the data to storage nodes
	// This can be done immediately after the register step, or as a separate step the user initiates
	await flow.upload({ digest: result.Transaction.digest });
}

// Step 4: Certify the blob (triggered by user clicking a certify button after the blob is uploaded)
async function handleCertify() {
	const certifyTx = flow.certify();

	const result = await signAndExecuteTransaction({ transaction: certifyTx });

	// Check transaction status
	if (result.$kind === 'FailedTransaction') {
		throw new Error(`Certification failed: ${result.FailedTransaction.status.error?.message}`);
	}

	// Step 5: Get the new files
	const files = await flow.listFiles();
	console.log('Uploaded files', files);
}
```

--------------------------------

### Get Owned Transfer Policies By Type

Source: https://sdk.mystenlabs.com/kiosk/kiosk-client/querying

Queries to find all the owned transfer policies for a specific item type and address. This is useful for managing transfer policies.

```APIDOC
## GET /kiosk/owned-transfer-policies-by-type

### Description
Queries to find all the owned transfer policies for a specific item type and address. This is useful for managing transfer policies.

### Method
GET

### Endpoint
`/kiosk/owned-transfer-policies-by-type`

### Parameters
#### Query Parameters
- **address** (string) - Required - The address that owns the transfer policies.
- **type** (string) - Required - The type of the transfer policy.

### Request Example
```javascript
const address = '0xAddress';
const type = '0xbe01d0594bedbce45c0e08c7374b03bf822e9b73cd7d555bf39c39bbf09d23a9::hero::Hero';
const policies = await client.kiosk.getOwnedTransferPoliciesByType({ address, type });
console.log(policies);
```

### Response
#### Success Response (200)
- **policyId** (string) - The ID of the transfer policy.
- **policyCapId** (string) - The ID of the policy capability.
- **type** (string) - The type of the item associated with the transfer policy.

#### Response Example
```json
[
  {
    "policyId": "0x6b6eca8df6e70ea6447e639ef26b519039b5e9123642258eea1b3c781e94faca",
    "policyCapId": "0x34a4794d4ad6578ac345d23ca0f7a4632ca88de297daaf24a1cdbc91e1547be4",
    "type": "0xbe01d0594bedbce45c0e08c7374b03bf822e9b73cd7d555bf39c39bbf09d23a9::hero::Hero"
  }
]
```
```

--------------------------------

### Get Permissions Status with Navigator.permissions

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_wallet-standard.DEPRECATED_WalletsNavigator

The permissions read-only property returns a Permissions object. This object provides a status of APIs covered by the Permissions API, allowing developers to query and revoke permissions for various browser features.

```javascript
navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
  console.log('Geolocation permission state:', permissionStatus.state);
});
```

--------------------------------

### prepareForSerialization

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.transactions.Transaction

Prepares the transaction for serialization based on the provided options. This may involve resolving objects or other asynchronous operations.

```APIDOC
## POST /transaction/prepare_serialization

### Description
Prepares the transaction for serialization.

### Method
POST

### Endpoint
`/transaction/prepare_serialization`

### Parameters
#### Request Body
- **options** (SerializeTransactionOptions) - Required - Options for controlling the serialization process.

### Returns
- **Promise<void>** - A promise that resolves when preparation is complete.
```

--------------------------------

### Query Name Service via gRPC (TypeScript)

Source: https://sdk.mystenlabs.com/sui/clients/grpc

Shows how to perform a reverse lookup to get the Sui Name Service name associated with a given address using the nameService client. Requires an initialized SuiGrpcClient.

```typescript
const { response } = await grpcClient.nameService.reverseLookupName({
	address: '0xabc...',
});
```

--------------------------------

### Current Client Store Usage (JavaScript)

Source: https://sdk.mystenlabs.com/dapp-kit/state

Explains how to access the SuiClient instance for the current network from the dApp Kit's current client store and use it to interact with the blockchain, such as querying balances.

```javascript
const client = dAppKit.stores.$currentClient.get();

// Use the client to query the blockchain
const balance = await client.getBalance({
	owner: '0x...',
});

// Note: This store automatically updates when the network changes.
```

--------------------------------

### Get Gamepad State with Navigator.getGamepads()

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_wallet-standard.DEPRECATED_WalletsNavigator

The getGamepads() method returns an array of Gamepad objects, representing connected gamepads. Elements in the array may be null if a gamepad disconnects during a session, ensuring that remaining gamepads retain their original indices. This method is useful for game development and interactive applications.

```javascript
const gamepads = navigator.getGamepads();
console.log(gamepads);
```

--------------------------------

### GetMoveFunctionOptions Interface

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_sui.client.SuiClientTypes.GetMoveFunctionOptions

Defines the structure for options when calling methods to get Move function details. It includes required fields for identifying the module, function, and package, as well as an optional AbortSignal for request cancellation.

```APIDOC
## Interface GetMoveFunctionOptions

### Description
This interface specifies the options required to retrieve details about a Move function within the Sui blockchain. It includes the module name, function name, and the package ID where the module is deployed. An optional `AbortSignal` can be provided for request cancellation.

### Properties

#### moduleName
- **moduleName** (string) - Required - The name of the Move module containing the function.

#### name
- **name** (string) - Required - The name of the Move function.

#### packageId
- **packageId** (string) - Required - The ID of the package containing the Move module.

#### signal
- **signal** (AbortSignal) - Optional - An `AbortSignal` to cancel the request.

### Hierarchy
- CoreClientMethodOptions
  - GetMoveFunctionOptions
```

--------------------------------

### Get Public Key from AwsKmsSigner

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_signers.aws.AwsKmsSigner

Demonstrates retrieving the public key associated with the AwsKmsSigner. This method returns a `PublicKey` instance, typically a `Secp256k1PublicKey`. An error will be thrown if the public key has not been initialized.

```typescript
const publicKey = signer.getPublicKey();

```

--------------------------------

### Default Fetch Implementation

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_walrus.UploadRelayConfig

Illustrates the default fetch function used when none is explicitly provided in the UploadRelayConfig. It utilizes the global fetch API.

```javascript
globalThis.fetch
```

--------------------------------

### Get Next Epoch Pool Trade Parameters (TypeScript)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Retrieves the trade parameters for the next epoch of a pool. This function allows users to anticipate changes in trading fees and other parameters for future trading periods. It returns a transaction result.

```typescript
poolTradeParamsNext(poolKey: string): (tx: Transaction) => TransactionResult
```

--------------------------------

### initRenewal

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_suins.SuinsTransaction

Initializes the renewal process for a domain NFT for a specified number of years.

```APIDOC
## POST /initRenewal

### Description
Initializes the renewal process for a domain NFT for a specified number of years.

### Method
POST

### Endpoint
/initRenewal

### Parameters
#### Request Body
- **nft** (TransactionObjectInput) - Required - The NFT object representing the domain.
- **years** (number) - Required - The number of years to renew the domain for.

### Request Example
```json
{
  "nft": { "objectId": "0xabc...", "version": 1 },
  "years": 5
}
```

### Response
#### Success Response (200)
- **TransactionObjectArgument** - The transaction object argument for renewal initialization.

#### Response Example
```json
{
  "digest": "0xghi...",
  "effects": { ... },
  "events": [ ... ]
}
```
```

--------------------------------

### Set Gas Payment Coins for Sui Transaction

Source: https://sdk.mystenlabs.com/sui/transaction-building/gas

This example illustrates how to manually specify the coins to be used for gas payment in a Sui transaction using `setGasPayment`. It's crucial to ensure these coins do not overlap with other transaction inputs.

```typescript
// you need to ensure that the coins do not overlap with any
// of the input objects for the transaction
tx.setGasPayment([coin1, coin2]);
```

--------------------------------

### Get Quantity Out Using Input Token as Fee

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Calculates the quantity out when the input token is used to pay the fee. This function is similar to `getQuantityOut` but accounts for fees paid with the input token. It requires `poolKey`, `baseQuantity`, and `quoteQuantity`, returning an object with trade details.

```typescript
async getQuantityOutInputFee(
  poolKey: string,
  baseQuantity: number,
  quoteQuantity: number,
): Promise<
  {
    baseOut: number;
    baseQuantity: number;
    deepRequired: number;
    quoteOut: number;
    quoteQuantity: number;
  },
>
```

--------------------------------

### Get User Supply Amount (SDK)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the user's supply amount for a given supplier cap within a margin pool. This function is useful for users to track their deposited assets. It accepts the coin key, supplier cap ID, and an optional number of decimals, returning the amount as a string.

```typescript
getUserSupplyAmount(
  coinKey: string,
  supplierCapId: string,
  decimals?: number,
): Promise<string>
```

--------------------------------

### normalizeSuiAddress Function

Source: https://sdk.mystenlabs.com/typedoc/functions/_mysten_sui.utils.normalizeSuiAddress

This function normalizes a given Sui address string. It converts the address to lowercase, ensures it starts with '0x', and pads it with zeros if necessary to meet the standard Sui address length. It also handles cases where the input might have duplicate '0x' prefixes.

```APIDOC
## Function normalizeSuiAddress

### Description
Normalizes a Sui address string by converting it to lowercase, prepending '0x' if missing, and padding with zeros to the standard SUI_ADDRESS_LENGTH. Handles potential duplicate '0x' prefixes with the `forceAdd0x` option.

### Method
Utility Function

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```javascript
// Assuming SUI_ADDRESS_LENGTH is defined elsewhere
// Example 1: Basic normalization
const normalizedAddress1 = normalizeSuiAddress('0x1234567890abcdef');
// normalizedAddress1 will be '0x1234567890abcdef' (assuming it's already standard length)

// Example 2: Prepending '0x'
const normalizedAddress2 = normalizeSuiAddress('1234567890abcdef');
// normalizedAddress2 will be '0x1234567890abcdef'

// Example 3: Padding with zeros
const normalizedAddress3 = normalizeSuiAddress('0xabc');
// normalizedAddress3 will be '0x0000000000000abc' (assuming SUI_ADDRESS_LENGTH is 64 hex chars)

// Example 4: Handling duplicate '0x' with forceAdd0x = true
const normalizedAddress4 = normalizeSuiAddress('0x0x12345', true);
// normalizedAddress4 will be '0x0x12345'

// Example 5: Handling duplicate '0x' with default forceAdd0x = false
const normalizedAddress5 = normalizeSuiAddress('0x0x12345');
// normalizedAddress5 will be '0x12345' (the first '0x' is treated as a prefix, not part of the address)
```

### Response
#### Success Response (string)
Returns the normalized Sui address string.

#### Response Example
```json
{
  "normalizedAddress": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
}
```
```

--------------------------------

### Get Registry ID from Name

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_payment-kit.PaymentKitClient

Derives and returns the registry object ID from a given registry name. This method is synchronous and takes a string representing the registry name.

```typescript
const registryId = await client.getRegistryIdFromName("my-registry");
```

--------------------------------

### Manage Custom Data in SDK

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.transactions.ObjectCache

Allows for the management of custom data within the SDK using a key-value store. Supports getting, setting, and deleting custom data, with generic type support for values. Operations are asynchronous.

```typescript
/**
 * Retrieves custom data associated with a key.
 * @template T The expected type of the data.
 * @param {string} key The key for the custom data.
 * @returns {Promise<T | null>} A promise that resolves with the data or null if not found.
 */
getCustom<T>(key: string): Promise<T | null>;

/**
 * Sets custom data with a specific key.
 * @template T The type of the data to set.
 * @param {string} key The key for the custom data.
 * @param {T} value The data to store.
 * @returns {Promise<void>}
 */
setCustom<T>(key: string, value: T): Promise<void>;

/**
 * Deletes custom data associated with a key.
 * @param {string} key The key for the custom data to delete.
 * @returns {Promise<void>}
 */
deleteCustom(key: string): Promise<void>;
```

--------------------------------

### ReadonlyUint8Array Methods

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_wallet-standard.ReadonlyUint8Array

Lists the available methods for interacting with a ReadonlyUint8Array. These methods allow for iteration, searching, mapping, and transforming the array's contents without modifying the original data. Examples include `at`, `entries`, `filter`, `forEach`, and `map`.

```typescript
// [iterator] method
"[iterator]"(): ArrayIterator<number>

// at method
at(index: number): number | undefined

// entries method
entries(): ArrayIterator<[number, number]>

// every method
every(
  predicate: (value: number, index: number, array: this) => unknown,
  thisArg?: any,
): boolean

// filter method
filter(
  predicate: (value: number, index: number, array: this) => any,
  thisArg?: any,
): Uint8Array<ArrayBuffer>

// find method
find(
  predicate: (value: number, index: number, obj: this) => boolean,
  thisArg?: any,
): number | undefined

// findIndex method
findIndex(
  predicate: (value: number, index: number, obj: this) => boolean,
  thisArg?: any,
): number

// findLast method
findLast<S extends number>(
  predicate: (value: number, index: number, array: this) => value is S,
  thisArg?: any,
): S | undefined

// findLastIndex method
findLastIndex(
  predicate: (value: number, index: number, array: this) => unknown,
  thisArg?: any,
): number

// forEach method
forEach(
  callbackfn: (value: number, index: number, array: this) => void,
  thisArg?: any,
): void

// includes method
includes(searchElement: number, fromIndex?: number): boolean

// indexOf method
indexOf(searchElement: number, fromIndex?: number): number

// join method
join(separator?: string): string

// keys method
keys(): ArrayIterator<number>

// lastIndexOf method
lastIndexOf(searchElement: number, fromIndex?: number): number

// map method
map(
  callbackfn: (value: number, index: number, array: this) => number,
  thisArg?: any,
): Uint8Array<ArrayBuffer>

// reduce method
reduce(
  callbackfn: (
    previousValue: number,
    currentValue: number,
    currentIndex: number,
    array: this,
  ) => number,
): number

// reduceRight method
reduceRight(
  callbackfn: (
    previousValue: number,
    currentValue: number,
    currentIndex: number,
    array: this,
  ) => number,
): number

// slice method
slice(start?: number, end?: number): Uint8Array<ArrayBuffer>

// some method
some(
  predicate: (value: number, index: number, array: this) => unknown,
  thisArg?: any,
): boolean

// subarray method
subarray(begin?: number, end?: number): Uint8Array<ArrayBufferLike>

// toLocaleString method
toLocaleString(): string

// toReversed method
toReversed(): Uint8Array<ArrayBuffer>

// toSorted method
toSorted(
  compareFn?: (a: number, b: number) => number,
): Uint8Array<ArrayBuffer>

// toString method
toString(): string

// valueOf method
valueOf(): this

// values method
values(): ArrayIterator<number>

// with method
with(index: number, value: number): Uint8Array<ArrayBuffer>
```

--------------------------------

### Create and Execute Ephemeral Payment Transaction

Source: https://sdk.mystenlabs.com/payment-kit/payment-kit-sdk

Illustrates the creation and execution of an ephemeral payment transaction using `processEphemeralPayment`. This method is similar to registry payments but does not store payment records on-chain. The example covers transaction creation, signing, execution, and error checking.

```typescript
const tx = client.paymentKit.tx.processEphemeralPayment({
	nonce: crypto.randomUUID(),
	coinType: '0x2::sui::SUI',
	amount: 500000000,
	receiver,
	sender: senderAddress,
});

const result = await client.signAndExecuteTransaction({
	transaction: tx,
	signer: keypair,
});

// Check transaction status
if (result.$kind === 'FailedTransaction') {
	throw new Error(`Ephemeral payment failed: ${result.FailedTransaction.status.error?.message}`);
}
```

--------------------------------

### Generate TypeScript Bindings from Move Contracts with @mysten/codegen

Source: https://sdk.mystenlabs.com/sui/sdk-building

Utilize @mysten/codegen to generate type-safe TypeScript bindings for Move packages. This process enhances type safety, simplifies BCS parsing, improves IDE support, and integrates with MoveRegistry for human-readable package names. Setup instructions are available in the codegen documentation.

```typescript
import * as myContract from './contracts/my-package/my-module';

// Generated Move call functions return thunks with typed options
const tx = new Transaction();
tx.add(
	myContract.doSomething({
		arguments: {
			obj: '0x123...', 
			amount: 100n,
		},
	}),
);

// Generated BCS types parse on-chain data
const { object } = await client.core.getObject({
	objectId: '0x123...',
	include: { content: true },
});
const parsed = myContract.MyStruct.parse(object.content);
```

--------------------------------

### mintMaintainerCap

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginAdminContract

Mints a maintainer cap.

```APIDOC
## POST /mintMaintainerCap

### Description
Mint a maintainer cap.

### Method
POST

### Endpoint
/mintMaintainerCap

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```json
{}
```

### Response
#### Success Response (200)
- **tx** (Transaction) - A function that takes a Transaction object and returns a Coin.

#### Response Example
```json
{
  "tx": "(tx: Transaction) => TransactionResult"
}
```
```

--------------------------------

### Get Margin Pool Total Supply (TypeScript)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the total supply amount for a specified margin pool. Similar to `getMarginPoolTotalBorrow`, it accepts a coin key and an optional decimal precision. The function returns a Promise that resolves to the total supply amount as a string.

```typescript
import { getMarginPoolTotalSupply } from "@mysten/sdk";

async function fetchTotalSupply(coinKey: string, decimals: number = 6): Promise<string> {
  try {
    const totalSupply = await getMarginPoolTotalSupply(coinKey, decimals);
    return totalSupply;
  } catch (error) {
    console.error("Error fetching total supply:", error);
    throw error;
  }
}
```

--------------------------------

### BcsTuple Constructor

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.bcs.BcsTuple

Details the constructor for the BcsTuple class, including its type parameters, named parameters, and return type.

```APIDOC
## Constructors
### constructor
  * new BcsTuple<  
const T extends readonly BcsType<any, any, string>[],  
const Name extends  
string = `(${JoinString<  
{
  
[K in string  
| number  
| symbol]: T[K<K>] extends BcsType<any, any, T> ? T : never  
},  
", ",  
>})`,
>(  
__namedParameters: BcsTupleOptions<T, Name>,
): BcsTuple<T, Name>
#### Type Parameters
    * const T extends readonly BcsType<any, any, string>[]
    * const Name extends string = `(${JoinString<  
{
  
[K in string  
| number  
| symbol]: T[K<K>] extends BcsType<any, any, T> ? T : never  
},
", ",
>})`
#### Parameters
    * __namedParameters: BcsTupleOptions<T, Name>
#### Returns BcsTuple<T, Name>
```

--------------------------------

### Query Kiosk Extension Data

Source: https://sdk.mystenlabs.com/kiosk/kiosk-client/querying

Queries an extension's data for a given kiosk ID. Returns `null` if no extension of the specified type is installed. Requires the `client` object and the extension `type` as input.

```javascript
const type = '0xAddress::custom_extension::ACustomExtensionType';

const extension = await client.kiosk.getKioskExtension({
	kioskId: '0xAKioskId',
	type,
});

console.log(extension);
```

--------------------------------

### Get Outer Window Dimensions

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_wallet-standard.DEPRECATED_WalletsWindow

The `outerHeight` and `outerWidth` properties return the height and width of the entire browser window, including toolbars, scrollbars, and window borders. These are read-only properties.

```javascript
const outerHeight = window.outerHeight;
const outerWidth = window.outerWidth;
console.log(`Outer window dimensions: ${outerWidth}px x ${outerHeight}px`);
```

--------------------------------

### SealClient Methods

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_seal.SealClient

Provides documentation for the various methods available on the SealClient class.

```APIDOC
## Methods

### decrypt

#### Description
Decrypts the given encrypted bytes using cached keys. It fetches keys if necessary and throws an error if key servers are incompatible or the threshold cannot be met. Optionally checks for share consistency.

#### Method
`decrypt`

#### Endpoint
N/A

#### Parameters
##### Path Parameters
None

##### Query Parameters
None

##### Request Body
* **data** (DecryptOptions) - Required - The encrypted bytes to decrypt.

### Request Example
```json
{
  "data": { ... }
}
```

#### Response
##### Success Response (200)
* **Uint8Array<ArrayBufferLike>** - The decrypted plaintext.

#### Response Example
```json
{
  "decryptedData": "<Uint8Array of decrypted data>"
}
```

### encrypt

#### Description
Returns an encrypted message under the identity using the specified KEM type.

#### Method
`encrypt`

#### Endpoint
N/A

#### Parameters
##### Path Parameters
None

##### Query Parameters
None

##### Request Body
* **kemType** (EncryptOptions) - Required - The type of KEM to use.

### Request Example
```json
{
  "kemType": { ... }
}
```

#### Response
##### Success Response (200)
* **encryptedObject** (Uint8Array<ArrayBuffer>) - The bcs bytes of the encrypted object.
* **key** (Uint8Array<ArrayBuffer>) - The symmetric key used for encryption.

#### Response Example
```json
{
  "encryptedObject": "<bcs bytes of encrypted object>",
  "key": "<symmetric encryption key>"
}
```

### fetchKeys

#### Description
Fetches keys from key servers and updates the cache. Recommended to call once for all IDs before decrypting multiple objects.

#### Method
`fetchKeys`

#### Endpoint
N/A

#### Parameters
##### Path Parameters
None

##### Query Parameters
None

##### Request Body
* **ids** (FetchKeysOptions) - Required - The IDs of the encrypted objects.

### Request Example
```json
{
  "ids": { ... }
}
```

#### Response
##### Success Response (200)
* **void** - Indicates successful completion.

#### Response Example
```json
{
  "status": "success"
}
```

### getDerivedKeys

#### Description
Retrieves derived keys from the specified services for a given encrypted object ID. Returns threshold keys if successful.

#### Method
`getDerivedKeys`

#### Endpoint
N/A

#### Parameters
##### Path Parameters
None

##### Query Parameters
None

##### Request Body
* **id** (GetDerivedKeysOptions) - Required - The ID of the encrypted object.

### Request Example
```json
{
  "id": { ... }
}
```

#### Response
##### Success Response (200)
* **Map<string, DerivedKey>** - A map of service object IDs to their derived keys.

#### Response Example
```json
{
  "derivedKeys": {
    "service1": "<DerivedKey object>",
    "service2": "<DerivedKey object>"
  }
}
```

### getKeyServers

#### Description
Retrieves the available key servers.

#### Method
`getKeyServers`

#### Endpoint
N/A

#### Parameters
None

### Request Example
N/A

#### Response
##### Success Response (200)
* **Map<string, KeyServer>** - A map of key server identifiers to KeyServer objects.

#### Response Example
```json
{
  "keyServers": {
    "server1": "<KeyServer object>",
    "server2": "<KeyServer object>"
  }
}
```

### getPublicKeys

#### Description
Retrieves the public keys for the given services. Fetches them if not already in the cache.

#### Method
`getPublicKeys`

#### Endpoint
N/A

#### Parameters
##### Path Parameters
None

##### Query Parameters
None

##### Request Body
* **services** (string[]) - Required - The services to get the public keys for.

### Request Example
```json
{
  "services": ["service1", "service2"]
}
```

#### Response
##### Success Response (200)
* **G2Element[]** - An array of G2Element public keys in the same order as the requested services.

#### Response Example
```json
{
  "publicKeys": [
    "<G2Element object>",
    "<G2Element object>"
  ]
}
```
```

--------------------------------

### Parse Payment Transaction URIs

Source: https://sdk.mystenlabs.com/payment-kit/getting-started

Demonstrates how to use the `parsePaymentTransactionUri` function to convert a payment URI back into its constituent parameters. These parsed parameters can then be used to construct a payment transaction.

```javascript
import { parsePaymentTransactionUri } from '@mysten/payment-kit';

// Parse a payment URI
const params = parsePaymentTransactionUri(paymentUri);
// Returns: { receiverAddress, amount, coinType, nonce, label?, message?, iconUrl?, registryName? | registryId? }

// Use the parsed parameters to create a transaction
const tx = client.paymentKit.tx.processRegistryPayment({
	receiver: params.receiverAddress,
	amount: params.amount,
	coinType: params.coinType,
	nonce: params.nonce,
	registryName: params.registryName,
	sender: sender,
});
```

--------------------------------

### Connection Store Details (JavaScript)

Source: https://sdk.mystenlabs.com/dapp-kit/state

Illustrates how to retrieve and inspect the properties of the connection store, including wallet information, account details, and connection status flags like isConnected, isConnecting, etc.

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

// Example usage:
if (connection.isConnected && connection.wallet && connection.account) {
	console.log('Address:', connection.account.address);
	console.log('Wallet:', connection.wallet.name);
	console.log('Available accounts:', connection.wallet.accounts);
}
```

--------------------------------

### Get Pool Book Parameters (TypeScript)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookContract

Retrieves the book parameters for a given pool, including essential details like tick size, lot size, and minimum order size. These parameters define the trading rules and constraints for the pool. It returns a transaction object.

```typescript
poolBookParams(poolKey: string): (tx: Transaction) => void
```

--------------------------------

### BcsTuple Properties

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_sui.bcs.BcsTuple

Explains the properties available on BcsTuple instances, including type inference, name, read, serialization size calculation, and validation.

```APIDOC
## Properties
### $inferInput
$inferInput: {  
[K in string | number | symbol]: T[K<K>] extends BcsType<any, T, string>  
? T  
: never  
}
### $inferType
$inferType: {  
-readonly [K in string | number | symbol]: T[K<K>] extends BcsType<  
T,
any,
string,
>  
? T  
: never  
}
### name
name: Name
### read
read: (  
reader: BcsReader,
) => {  
-readonly [K in string | number | symbol]: T[K<K>] extends BcsType<  
T,
any,
string,
>  
? T  
: never  
}
### serializedSize
serializedSize: (  
value: {  
[K in string | number | symbol]: T[K<K>] extends BcsType<  
any,
T,
string,
>  
? T  
: never  
},
options?: BcsWriterOptions,
) => number | null
### validate
validate: (  
value: {  
[K in string | number | symbol]: T[K<K>] extends BcsType<  
any,
T,
string,
>  
? T  
: never  
},
) => void
```

--------------------------------

### TypeScript: Getting Balance for a Specific Coin Type

Source: https://sdk.mystenlabs.com/sui/clients/core

Fetches the total balance and the number of coin objects for a given owner and coin type. Defaults to SUI coin if `coinType` is not specified.

```typescript
const balance = await client.core.getBalance({
	owner: '0xabc...',
	coinType: '0x2::sui::SUI', // Optional, defaults to SUI
});

console.log(balance.totalBalance); // Total balance as bigint
console.log(balance.coinObjectCount); // Number of coin objects

```

--------------------------------

### Get System Object (TypeScript)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_walrus.WalrusClient

Retrieves the cached system object for the walrus package. This object contains essential information about the package, including its ID, version, and potentially a new package ID if an update is available.

```typescript
import { getClient } from "./client";

async function getSystemObject() {
  const client = getClient();
  const systemObject = await client.systemObject();
  console.log(systemObject);
  return systemObject;
}
```

--------------------------------

### Checkpoint API

Source: https://sdk.mystenlabs.com/typedoc/functions/_mysten_dapp-kit.useSuiClientQueries

Provides methods for retrieving checkpoint information from the Sui blockchain.

```APIDOC
## GET /getLatestCheckpointSequenceNumber

### Description
Retrieves the sequence number of the latest checkpoint.

### Method
GET

### Endpoint
/getLatestCheckpointSequenceNumber

### Parameters
No parameters required.

### Response
#### Success Response (200)
- **sequenceNumber** (string) - The sequence number of the latest checkpoint.

#### Response Example
```json
{
  "sequenceNumber": "12345"
}
```
```

```APIDOC
## GET /getCheckpoint

### Description
Retrieves a specific checkpoint by its sequence number.

### Method
GET

### Endpoint
/getCheckpoint

### Parameters
#### Query Parameters
- **sequenceNumber** (string) - Required - The sequence number of the checkpoint.

### Response
#### Success Response (200)
- **checkpoint** (object) - The checkpoint object.

#### Response Example
```json
{
  "checkpoint": {
    "sequenceNumber": "12345",
    "digest": "0xabc..."
  }
}
```
```

```APIDOC
## GET /getCheckpoints

### Description
Retrieves a paginated list of checkpoints.

### Method
GET

### Endpoint
/getCheckpoints

### Parameters
#### Query Parameters
- **cursor** (string | null) - Optional - The cursor for pagination.
- **limit** (number) - Optional - The maximum number of results to return.
- **descendingOrder** (boolean) - Optional - Whether to return results in descending order.

### Response
#### Success Response (200)
- **data** (array) - A list of checkpoint objects.
- **nextCursor** (string | null) - The cursor for the next page of results.
- **hasNextPage** (boolean) - Indicates if there are more pages of results.

#### Response Example
```json
{
  "data": [
    {
      "sequenceNumber": "12345",
      "digest": "0xabc..."
    }
  ],
  "nextCursor": null,
  "hasNextPage": false
}
```
```

--------------------------------

### WalrusClientError Static Methods

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_walrus.WalrusClientError

Details on the static methods provided by the WalrusClientError class.

```APIDOC
## Methods

### `Static` captureStackTrace
`captureStackTrace(targetObject: object, constructorOpt?: Function): void`

Creates a `.stack` property on `targetObject`, which when accessed returns a string representing the location in the code at which `Error.captureStackTrace()` was called.

**Example**
```javascript
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack; // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with `${myObject.name}: ${myObject.message}`. The optional `constructorOpt` argument accepts a function. If given, all frames above `constructorOpt`, including `constructorOpt`, will be omitted from the generated stack trace. The `constructorOpt` argument is useful for hiding implementation details of error generation from the user.

**Parameters**
* `targetObject`: object
* `Optional` `constructorOpt`: Function

**Returns**
void

### `Static` isError
`isError(error: unknown): error is Error`

Indicates whether the argument provided is a built-in Error instance or not.

**Parameters**
* `error`: unknown

**Returns**
`error is Error`

### `Static` prepareStackTrace
`prepareStackTrace(err: Error, stackTraces: CallSite[]): any`

**Parameters**
* `err`: Error
* `stackTraces`: CallSite[]

**Returns**
any

**See**
https://v8.dev/docs/stack-trace-api#customizing-stack-traces
```

--------------------------------

### Get Pool Trade Parameters (MystenLabs SDK)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the trading parameters for a given pool, including maker fee, stake required, and taker fee. This function is crucial for understanding the cost and requirements associated with trading within a specific pool. It takes the poolKey as input and returns an object containing these fee and stake details.

```typescript
poolTradeParams(poolKey: string): Promise<{ makerFee: number; stakeRequired: number; takerFee: number }>
```

--------------------------------

### newPoolConfig

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginAdminContract

Creates a new pool configuration.

```APIDOC
## POST /newPoolConfig

### Description
Create a new pool config.

### Method
POST

### Endpoint
/newPoolConfig

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **poolKey** (string) - Required - The key to identify the pool
- **poolConfigParams** (PoolConfigParams) - Required - The parameters for the pool config

### Request Example
```json
{
  "poolKey": "string",
  "poolConfigParams": "PoolConfigParams"
}
```

### Response
#### Success Response (200)
- **tx** (Transaction) - A function that takes a Transaction object and returns a Coin.

#### Response Example
```json
{
  "tx": "(tx: Transaction) => TransactionResult"
}
```
```

--------------------------------

### Get Base Rules Resolver List - TypeScript

Source: https://sdk.mystenlabs.com/typedoc/functions/_mysten_kiosk.getBaseRules

The getBaseRules function constructs a list of rule resolvers based on the provided BaseRulePackageIds. It is part of the @mysten/kiosk SDK and returns an array of TransferPolicyRule.

```typescript
import { getBaseRules, BaseRulePackageIds, TransferPolicyRule } from '@mysten/kiosk';

// Example usage:
const rulePackageIds: BaseRulePackageIds = {
  // ... provide package IDs here
};

const rules: TransferPolicyRule[] = getBaseRules(rulePackageIds);
console.log(rules);
```

--------------------------------

### Get Selection Object

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_wallet-standard.DEPRECATED_WalletsWindow

Returns a Selection object representing the text selected by the user or the current position of the caret. This is useful for text manipulation and user interaction.

```typescript
getSelection(): Selection | null;
```

--------------------------------

### createMarginPool

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginMaintainerContract

Creates a new margin pool with the specified coin key and pool configuration.

```APIDOC
## POST /createMarginPool

### Description
Create a new margin pool.

### Method
POST

### Endpoint
/createMarginPool

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
* **coinKey** (string) - Required - The key to identify the coin
* **poolConfig** (TransactionArgument) - Required - The configuration for the pool

### Request Example
```json
{
  "coinKey": "string",
  "poolConfig": "TransactionArgument"
}
```

### Response
#### Success Response (200)
* **(tx: Transaction) => void** - A function that takes a Transaction object and returns void.

#### Response Example
```json
{
  "transactionFunction": "(tx: Transaction) => void"
}
```
```

--------------------------------

### TypeScript: Getting a Dynamic Object Field

Source: https://sdk.mystenlabs.com/sui/clients/core

Retrieves a dynamic field that references another object, returning the full object details. Supports including the content of the referenced object.

```typescript
const { object } = await client.core.getDynamicObjectField({
	parentId: '0x123...',
	name: {
		type: '0x2::object::ID',
		bcs: bcs.Address.serialize('0x456...').toBytes(),
	},
	include: { content: true },
});

```

--------------------------------

### Get Total Borrow Amount - TypeScript

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.MarginPoolContract

Retrieves the total amount borrowed from a specified margin pool. It takes a coin key as input and returns a function that operates on a Transaction object to yield a TransactionResult.

```typescript
totalBorrow(coinKey: string): (tx: Transaction) => TransactionResult
```

--------------------------------

### Get Quote Quantity In for Target Base

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Calculates the required quote quantity to obtain a target base quantity, with an option to pay fees using DEEP. This function takes `poolKey`, `targetBaseQuantity`, and `payWithDeep` as input, returning a promise with `baseOut`, `deepRequired`, and `quoteIn`.

```typescript
async getQuoteQuantityIn(
  poolKey: string,
  targetBaseQuantity: number,
  payWithDeep: boolean,
): Promise<{ baseOut: number; deepRequired: number; quoteIn: number }>
```

--------------------------------

### Get Pool ID (SDK)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Retrieves the unique identifier (ID) for a given pool. This function is useful for referencing pools in other operations or for display purposes. It requires the pool key and returns the pool ID as a string.

```typescript
poolId(poolKey: string): Promise<string>
```

--------------------------------

### Execute Transaction Block with SuiJsonRpcClient

Source: https://sdk.mystenlabs.com/sui/clients/json-rpc

Demonstrates the process of signing and executing a transaction block using SuiJsonRpcClient. It involves creating a `Transaction`, signing it with a `keypair`, and then submitting it for execution with specified options.

```typescript
const tx = new Transaction();

// add transaction data to tx...

const { bytes, signature } = await tx.sign({ client, signer: keypair });

const result = await client.executeTransactionBlock({
	ransactionBlock: bytes,
	signature,
	options: {
		showEffects: true,
	},
});
```

--------------------------------

### CoreClientOptions Interface

Source: https://sdk.mystenlabs.com/typedoc/interfaces/_mysten_sui.client.CoreClientOptions

Defines the structure for core client options, including base client, optional cache and MVR settings, and the network configuration.

```APIDOC
## Interface CoreClientOptions

### Description
Defines the configuration options for the core Sui client.

### Properties

*   **base** (BaseClient) - Required - The base client instance.
*   **cache** (ClientCache) - Optional - Configuration for the client's cache.
*   **mvr** (MvrOptions) - Optional - Configuration for MVR (Move Value Representation) options.
*   **network** (Network) - Required - The network configuration to use.

### Hierarchy
*   SuiClientOptions
    *   CoreClientOptions

### Example
```json
{
  "base": { ... },
  "network": { ... },
  "cache": { ... },
  "mvr": { ... }
}
```

### Success Response (200)
*   **base** (BaseClient) - The base client instance.
*   **cache** (ClientCache) - The client's cache configuration.
*   **mvr** (MvrOptions) - The MVR options.
*   **network** (Network) - The network configuration.

### Response Example
```json
{
  "base": { ... },
  "cache": { ... },
  "mvr": { ... },
  "network": { ... }
}
```
```

--------------------------------

### Get Order Deep Required (TypeScript)

Source: https://sdk.mystenlabs.com/typedoc/classes/_mysten_deepbook-v3.DeepBookClient

Calculates the DEEP (Deepbook Exchange Engine Protocol) required for placing an order. This function takes the `poolKey`, `baseQuantity`, and `price` as input. It returns a Promise that resolves to an object containing `deepRequiredMaker` and `deepRequiredTaker` values.

```typescript
import { getOrderDeepRequired } from "@mysten/sdk";

interface DeepRequired {
  deepRequiredMaker: number;
  deepRequiredTaker: number;
}

async function calculateDeepRequired(poolKey: string, baseQuantity: number, price: number): Promise<DeepRequired> {
  try {
    const deepRequired = await getOrderDeepRequired(poolKey, baseQuantity, price);
    return deepRequired;
  } catch (error) {
    console.error("Error calculating DEEP required:", error);
    throw error;
  }
}
```