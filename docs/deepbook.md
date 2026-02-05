### Complete Margin Pool Setup Workflow

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/maintainer

Orchestrates the complete setup process for a new margin pool, including creating protocol configurations, instantiating the pool, and enabling it for borrowing against specific DeepBook pools. This function streamlines the deployment of new margin pools.

```typescript
setupNewMarginPool = (tx: Transaction) => {
	const coinKey = 'SUI';

	// Step 1: Create protocol config
	const poolConfig = tx.add(
		this.maintainerContract.newProtocolConfig(
			coinKey,
			{
				supplyCap: 1_000_000, // 1M SUI
				maxUtilizationRate: 0.75,
				referralSpread: 0.1,
				minBorrow: 10,
			},
			{
				baseRate: 0.01,
				baseSlope: 0.08,
				optimalUtilization: 0.8,
				excessSlope: 0.8,
			},
		),
	);

	// Step 2: Create the margin pool
	tx.add(this.maintainerContract.createMarginPool(coinKey, poolConfig));

	// Step 3: Enable specific DeepBook pools for borrowing
	const marginPoolCapId = '0x...'; // Get from pool creation event
	tx.add(this.maintainerContract.enableDeepbookPoolForLoan('SUI_DBUSDC', coinKey, marginPoolCapId));
	tx.add(this.maintainerContract.enableDeepbookPoolForLoan('SUI_USDT', coinKey, marginPoolCapId));
};
```

--------------------------------

### Example Asset Response

Source: https://docs.sui.io/standards/deepbook/v3-indexer

An example of a successful response from the /assets endpoint, showcasing the structure and data for specific assets like Sui Name Service (NS) and AUSD.

```json
{
  "NS": {
    "unified_cryptoasset_id": "32942",
    "name": "Sui Name Service",
    "contractAddress": "0x5145494a5f5100e645e4b0aa950fa6b68f614e8c59e17bc5ded3495123a79178",
    "contractAddressUrl": "https://suiscan.xyz/mainnet/object/0x5145494a5f5100e645e4b0aa950fa6b68f614e8c59e17bc5ded3495123a79178",
    "can_deposit": "true",
    "can_withdraw": "true"
  },
  "AUSD": {
    "unified_cryptoasset_id": "32864",
    "name": "AUSD",
    "contractAddress": "0x2053d08c1e2bd02791056171aab0fd12bd7cd7efad2ab8f6b9c8902f14df2ff2",
    "contractAddressUrl": "https://suiscan.xyz/mainnet/object/0x2053d08c1e2bd02791056171aab0fd12bd7cd7efad2ab8f6b9c8902f14df2ff2",
    "can_deposit": "true",
    "can_withdraw": "true"
  }
}
```

--------------------------------

### Get Points API Request (HTTP)

Source: https://docs.sui.io/standards/deepbook/v3-indexer

An example HTTP GET request to the '/get_points' endpoint. It demonstrates how to pass a comma-separated list of addresses as a query parameter to retrieve their points.

```http
/get_points?addresses=0x344c2734b1d211bd15212bfb7847c66a3b18803f3f5ab00f5ff6f87b6fe6d27d,0x47dcbbc8561fe3d52198336855f0983878152a12524749e054357ac2e3573d58
```

--------------------------------

### Install DeepBook Margin SDK

Source: https://docs.sui.io/standards/deepbook/-margin-sdk

Installs the `@mysten/deepbook-v3` package, which contains the margin trading functionality, using npm or yarn.

```sh
npm install @mysten/deepbook-v3

```

--------------------------------

### Install DeepBookV3 SDK using npm or yarn

Source: https://docs.sui.io/standards/deepbook/v3-sdk

Instructions on how to install the DeepBookV3 SDK package using either npm or yarn. This is the first step to integrating the SDK into your project.

```shell
npm install @mysten/deepbook-v3
# or
yarn add @mysten/deepbook-v3
```

--------------------------------

### Demonstrate DeepBook Margin Trading Operations (TypeScript)

Source: https://docs.sui.io/standards/deepbook/-margin-sdk

An example demonstrating margin trading operations using the DeepBookMarginTrader client. It shows how to deposit funds, borrow assets, place leveraged limit orders, and supply assets to a margin pool. This example assumes default pools and coins are used.

```typescript
(async () => {
	const privateKey = ''; // Can encapsulate this in a .env file

	// Initialize with margin managers if created
	const marginManagers = {
		MARGIN_MANAGER_1: {
			address: '',
			poolKey: 'SUI_DBUSDC',
		},
	};
	const traderClient = new DeepBookMarginTrader(privateKey, 'testnet', marginManagers);

	const tx = new Transaction();

	// Margin manager contract calls

traderClient.client.deepbook.marginManager.deposit('MARGIN_MANAGER_1', 'DBUSDC', 10000)(tx);
traderClient.client.deepbook.marginManager.borrowBase('MARGIN_MANAGER_1', 'SUI_DBUSDC', 100)(tx);

	// Place leveraged orders

traderClient.client.deepbook.poolProxy.placeLimitOrder({
		poolKey: 'SUI_DBUSDC',
		marginManagerKey: 'MARGIN_MANAGER_1',
		clientOrderId: '12345',
		price: 2.5,
		quantity: 100,
		isBid: true,
		payWithDeep: true,
	})(tx);

	// Margin pool operations
	const supplierCap = tx.add(traderClient.client.deepbook.marginPool.mintSupplierCap());
traderClient.client.deepbook.marginPool.supplyToMarginPool('DBUSDC', supplierCap, 5000)(tx);

	let res = await traderClient.signAndExecute(tx);

	console.dir(res, { depth: null });
})();

```

--------------------------------

### Get Points API Response Example (JSON)

Source: https://docs.sui.io/standards/deepbook/v3-indexer

This JSON structure shows a successful response from the '/get_points' API, detailing the total points for specified addresses. It's a common format for returning user-specific data.

```json
[
    {
        "address": "0x344c2734b1d211bd15212bfb7847c66a3b18803f3f5ab00f5ff6f87b6fe6d27d",
        "total_points": 1250000
    },
    {
        "address": "0x47dcbbc8561fe3d52198336855f0983878152a12524749e054357ac2e3573d58",
        "total_points": 750000
    }
]
```

--------------------------------

### Example OHLCV Candlestick Data Request

Source: https://docs.sui.io/standards/deepbook/v3-indexer

An example HTTP request to the /ohclv endpoint to fetch hourly candlestick data for the SUI_USDC pool, limited to the last 10 candles.

```http
/ohclv/SUI_USDC?interval=1h&limit=10
```

--------------------------------

### DeepBookMarketMaker Flash Loan Example

Source: https://docs.sui.io/standards/deepbook/v3-sdk/flash-loans

This TypeScript example demonstrates a complete flash loan transaction within a `DeepBookMarketMaker` class. It includes borrowing base assets, executing trades using borrowed assets, and returning the borrowed assets to settle the loan.

```typescript
// Example of a flash loan transaction
// Borrow 1 DEEP from DEEP_SUI pool
// Swap 0.5 DBUSDC for SUI in SUI_DBUSDC pool, pay with deep borrowed
// Swap SUI back to DEEP
// Return 1 DEEP to DEEP_SUI pool
flashLoanExample = async (tx: Transaction) => {
  const borrowAmount = 1;
  const [deepCoin, flashLoan] = tx.add(this.flashLoans.borrowBaseAsset('DEEP_SUI', borrowAmount));

  // Execute trade using borrowed DEEP
  const [baseOut, quoteOut, deepOut] = tx.add(
    this.deepBook.swapExactQuoteForBase({
      poolKey: 'SUI_DBUSDC',
      amount: 0.5,
      deepAmount: 1,
      minOut: 0,
      deepCoin: deepCoin,
    }),
  );

  tx.transferObjects([baseOut, quoteOut, deepOut], this.getActiveAddress());

  // Execute second trade to get back DEEP for repayment
  const [baseOut2, quoteOut2, deepOut2] = tx.add(
    this.deepBook.swapExactQuoteForBase({
      poolKey: 'DEEP_SUI',
      amount: 10,
      deepAmount: 0,
      minOut: 0,
    }),
  );

  tx.transferObjects([quoteOut2, deepOut2], this.getActiveAddress());

  // Return borrowed DEEP
  const loanRemain = tx.add(
    this.flashLoans.returnBaseAsset('DEEP_SUI', borrowAmount, baseOut2, flashLoan),
  );
  
  // Send the remaining coin to user's address
  tx.transferObjects([loanRemain], this.getActiveAddress());
};

```

--------------------------------

### Example OHLCV Candlestick Data Response

Source: https://docs.sui.io/standards/deepbook/v3-indexer

An example JSON response for the OHLCV candlestick data endpoint, showing the format of the 'candles' array with sample data.

```json
{
    "candles": [
        [1738000000, 3.5, 3.6, 3.4, 3.55, 1000000],
        [1738003600, 3.55, 3.7, 3.5, 3.65, 1500000]
    ]
}
```

--------------------------------

### Get Pools

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Retrieves a list of all available trading pools and their details.

```APIDOC
## GET /get_pools

### Description
Retrieves a list of all available trading pools and their details.

### Method
GET

### Endpoint
/get_pools

### Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **pool_id** (string) - Unique identifier for the trading pool.
- **pool_name** (string) - Name of the trading pool.
- **base_asset_id** (string) - Identifier for the base asset in the pool.
- **base_asset_decimals** (integer) - Number of decimal places for the base asset.
- **base_asset_symbol** (string) - Symbol of the base asset.
- **base_asset_name** (string) - Name of the base asset.
- **quote_asset_id** (string) - Identifier for the quote asset in the pool.
- **quote_asset_decimals** (integer) - Number of decimal places for the quote asset.
- **quote_asset_symbol** (string) - Symbol of the quote asset.
- **quote_asset_name** (string) - Name of the quote asset.
- **min_size** (integer) - Minimum trade size for the pool.
- **lot_size** (integer) - Lot size for trading in the pool.
- **tick_size** (integer) - Tick size for price fluctuations in the pool.

#### Response Example
```json
[
	{
		"pool_id": "0xb663828d6217467c8a1838a03793da896cbe745b150ebd57d82f814ca579fc22",
		"pool_name": "DEEP_SUI",
		"base_asset_id": "0xdeeb7a4662eec9f2f3def03fb937a663dddaa2e215b8078a284d026b7946c270::deep::DEEP",
		"base_asset_decimals": 6,
		"base_asset_symbol": "DEEP",
		"base_asset_name": "DeepBook Token",
		"quote_asset_id": "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI",
		"quote_asset_decimals": 9,
		"quote_asset_symbol": "SUI",
		"quote_asset_name": "Sui",
		"min_size": 100000000,
		"lot_size": 10000000,
		"tick_size": 10000000
	}
]
```
```

--------------------------------

### Complete Balance Manager Setup Workflow

Source: https://docs.sui.io/standards/deepbook/v3-sdk/balance-manager

Executes a comprehensive workflow for setting up a balance manager, including creation with a custom owner, sharing, minting essential capabilities (TradeCap, DepositCap, WithdrawCap), and transferring these capabilities to the owner's address.

```typescript
completeSetup = async (tx: Transaction) => {
	const ownerAddress = '0x123...';

	// Step 1: Create manager with custom owner
	const manager = tx.add(this.balanceManager.createBalanceManagerWithOwner(ownerAddress));

	// Step 2: Share the manager
	tx.add(this.balanceManager.shareBalanceManager(manager));

	// Step 3: Mint capabilities
	const tradeCap = tx.add(this.balanceManager.mintTradeCap('MANAGER_1'));
	const depositCap = tx.add(this.balanceManager.mintDepositCap('MANAGER_1'));
	const withdrawCap = tx.add(this.balanceManager.mintWithdrawalCap('MANAGER_1'));

	// Step 4: Transfer capabilities to owner
	tx.transferObjects([depositCap, withdrawCap, tradeCap], ownerAddress);
};
```

--------------------------------

### GET /assets

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Retrieves asset information for all coins currently being traded on DeepBookV3.

```APIDOC
## GET /assets

### Description
Retrieves asset information for all coins currently being traded on DeepBookV3.

### Method
GET

### Endpoint
/assets

### Parameters
None

### Response
#### Success Response (200)
*The response structure for this endpoint is not detailed in the provided text. It is expected to return information about available assets.*

#### Response Example
*Example response not provided in the source text.*
```

--------------------------------

### Create and Share a New Balance Manager

Source: https://docs.sui.io/standards/deepbook/v3-sdk/balance-manager

Example demonstrating how to create and share a new balance manager using the `createAndShareBalanceManager` function. This function adds the operation to a transaction object.

```typescript
createBalanceManager = (tx: Transaction) => {
  tx.add(this.balanceManager.createAndShareBalanceManager());
};
```

--------------------------------

### Example DeepBook Market Maker Usage

Source: https://docs.sui.io/standards/deepbook/v3-sdk

Demonstrates how to set up and use the DeepBookMarketMaker client. It includes initializing the client, performing read-only calls to check balances and order book ranges, and executing transactions for depositing and withdrawing funds via a balance manager.

```typescript
(async () => {
	const privateKey = ''; // Can encapsulate this in a .env file

	// Initialize with balance managers if created
	const balanceManagers = {
		MANAGER_1: {
			address: '',
			tradeCap: '',
		},
	};
	const mmClient = new DeepBookMarketMaker(privateKey, 'testnet', balanceManagers);

	const tx = new Transaction();

	// Read only call
	console.log(await mmClient.client.deepbook.checkManagerBalance('MANAGER_1', 'SUI'));
	console.log(await mmClient.client.deepbook.getLevel2Range('SUI_DBUSDC', 0.1, 100, true));

	// Balance manager contract call
	mmClient.client.deepbook.balanceManager.depositIntoManager('MANAGER_1', 'DBUSDT', 10000)(tx);
	mmClient.client.deepbook.balanceManager.withdrawAllFromManager(
		'MANAGER_1',
		'DBUSDT',
		mmClient.getActiveAddress(),
	)(tx);

	let res = await mmClient.signAndExecute(tx);

	dir(res, { depth: null });
})();

```

--------------------------------

### Initialize DeepBookClient with Sui gRPC Client

Source: https://docs.sui.io/standards/deepbook/v3-sdk

Demonstrates how to initialize the DeepBookClient by extending a Sui gRPC client. This setup is necessary for interacting with DeepBook V3 functionalities, requiring a private key and environment selection (mainnet or testnet).

```typescript
import { SuiGrpcClient } from '@mysten/sui.js/client';
import { deepbook, DeepBookClient } from '@mysten/deepbook-v3';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { decodeSuiPrivateKey } from '@mysten/sui.js/cryptography';

// Define ClientWithExtensions type for clarity
type ClientWithExtensions<T> = SuiGrpcClient & T;

class DeepBookMarketMaker {
	client: ClientWithExtensions<{ deepbook: DeepBookClient }>;
	keypair: Ed25519Keypair;

	constructor(privateKey: string, env: 'testnet' | 'mainnet') {
		this.keypair = this.getSignerFromPK(privateKey);
		this.client = new SuiGrpcClient({
			network: env,
			baseUrl:
				env === 'mainnet'
					? 'https://fullnode.mainnet.sui.io:443'
					: 'https://fullnode.testnet.sui.io:443',
		}).$extend(
			deepbook({
				address: this.getActiveAddress(),
			}),
		);
	}

	getSignerFromPK = (privateKey: string): Ed25519Keypair => {
		const { scheme, secretKey } = decodeSuiPrivateKey(privateKey);
		if (scheme === 'ED25519') return Ed25519Keypair.fromSecretKey(secretKey);

		throw new Error(`Unsupported scheme: ${scheme}`);
	};

	getActiveAddress() {
		return this.keypair.toSuiAddress();
	}
}

```

--------------------------------

### GET /assets

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Retrieves information about available assets, including their contract addresses and deposit/withdrawal status.

```APIDOC
## GET /assets

### Description
Retrieves information about available assets, including their contract addresses and deposit/withdrawal status.

### Method
GET

### Endpoint
/assets

### Parameters
#### Query Parameters
None

#### Request Body
None

### Response
#### Success Response (200)
- **ASSET_NAME** (object) - An object where keys are asset symbols and values are asset details.
  - **unified_cryptoasset_id** (string) - The unique identifier for the crypto asset.
  - **name** (string) - The name of the crypto asset.
  - **contractAddress** (string) - The contract address of the asset.
  - **contractAddressUrl** (string) - A URL to view the contract address on a block explorer.
  - **can_deposit** (string) - Indicates if deposits are enabled ('true' or 'false').
  - **can_withdraw** (string) - Indicates if withdrawals are enabled ('true' or 'false').

#### Response Example
```json
{
  "NS": {
    "unified_cryptoasset_id": "32942",
    "name": "Sui Name Service",
    "contractAddress": "0x5145494a5f5100e645e4b0aa950fa6b68f614e8c59e17bc5ded3495123a79178",
    "contractAddressUrl": "https://suiscan.xyz/mainnet/object/0x5145494a5f5100e645e4b0aa950fa6b68f614e8c59e17bc5ded3495123a79178",
    "can_deposit": "true",
    "can_withdraw": "true"
  },
  "AUSD": {
    "unified_cryptoasset_id": "32864",
    "name": "AUSD",
    "contractAddress": "0x2053d08c1e2bd02791056171aab0fd12bd7cd7efad2ab8f6b9c8902f14df2ff2",
    "contractAddressUrl": "https://suiscan.xyz/mainnet/object/0x2053d08c1e2bd02791056171aab0fd12bd7cd7efad2ab8f6b9c8902f14df2ff2",
    "can_deposit": "true",
    "can_withdraw": "true"
  }
}
```
```

--------------------------------

### GET /summary

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Returns a summary of all trading pairs in DeepBook V3, including details like last price, 24h price change, and volume.

```APIDOC
## GET /summary

### Description
Returns a summary of all trading pairs in DeepBook V3, including details like last price, 24h price change, and volume.

### Method
GET

### Endpoint
`/summary`

### Parameters
None

### Response
#### Success Response (200)
- **trading_pairs** (string) - The name of the trading pair.
- **quote_currency** (string) - The quote currency of the trading pair.
- **last_price** (float) - The last traded price.
- **lowest_price_24h** (float) - The lowest price in the last 24 hours.
- **highest_bid** (float) - The highest bid price.
- **base_volume** (float) - The trading volume in the base currency for the last 24 hours.
- **price_change_percent_24h** (float) - The percentage change in price over the last 24 hours.
- **quote_volume** (float) - The trading volume in the quote currency for the last 24 hours.
- **lowest_ask** (float) - The lowest ask price.
- **highest_price_24h** (float) - The highest price in the last 24 hours.
- **base_currency** (string) - The base currency of the trading pair.

#### Response Example
```json
[
	{
    "trading_pairs": "AUSD_USDC",
    "quote_currency": "USDC",
    "last_price": 1.0006,
    "lowest_price_24h": 0.99905,
    "highest_bid": 1.0006,
    "base_volume": 1169.2,
    "price_change_percent_24h": 0.07501125168773992,
    "quote_volume": 1168.961637,
    "lowest_ask": 1.0007,
    "highest_price_24h": 1.00145,
    "base_currency": "AUSD"
  },
  {
    "quote_volume": 4063809.55231,
    "lowest_price_24h": 0.9999,
    "highest_price_24h": 1.009,
    "base_volume": 4063883.6,
    "quote_currency": "USDC",
    "price_change_percent_24h": 0.0,
    "base_currency": "WUSDC",
    "trading_pairs": "WUSDC_USDC",
    "last_price": 1.0,
    "highest_bid": 1.0,
    "lowest_ask": 1.0001
  },
  {
		"price_change_percent_24h": 0.0,
		"quote_currency": "USDC",
		"lowest_price_24h": 0.0,
		"quote_volume": 0.0,
		"base_volume": 0.0,
		"highest_price_24h": 0.0,
		"lowest_ask": 1.04,
		"last_price": 1.04,
		"base_currency": "WUSDT",
		"highest_bid": 0.90002,
		"trading_pairs": "WUSDT_USDC"
	},
	...
]
```
```

--------------------------------

### Get Trade Count API Endpoint

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Fetches the total number of trades executed across all pools within a specified time range. Requires start and end times in Unix timestamp format.

```http
/trade_count?start_time=<UNIX_TIMESTAMP_SECONDS>&end_time=<UNIX_TIMESTAMP_SECONDS>
```

--------------------------------

### Get Referral Fee Events API Request (HTTP)

Source: https://docs.sui.io/standards/deepbook/v3-indexer

This HTTP GET request format is used to retrieve referral fee events. It requires 'pool_id' and 'referral_id' as parameters to filter the events.

```http
/referral_fee_events?pool_id=<ID>&referral_id=<ID>
```

--------------------------------

### Get Historical Volume for Specific Pools (HTTP)

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Fetches historical trading volume for specified pools within a given time range. Users can choose to get volume in the base or quote asset. Pool names are comma-delimited, and time is specified using Unix timestamps.

```http
GET /historical_volume/:pool_names?start_time=<UNIX_TIMESTAMP_SECONDS>&end_time=<UNIX_TIMESTAMP_SECONDS>&volume_in_base=<BOOLEAN>

```

--------------------------------

### GET /referral_fee_events

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Returns events for referral fees earned during trading. These events track fees earned by referrals across different pools.

```APIDOC
## GET /referral_fee_events

### Description
Returns events for referral fees earned during trading. These events track fees earned by referrals across different pools.

### Method
GET

### Endpoint
/referral_fee_events

### Parameters
#### Query Parameters
- **pool_id** (ID) - Required - The ID of the pool.
- **referral_id** (ID) - Required - The ID of the referral.

### Response
#### Success Response (200)
- **event_digest** (string) - The digest of the event.
- **digest** (string) - The digest of the transaction.
- **sender** (string) - The sender of the transaction.
- **checkpoint** (integer) - The checkpoint number.
- **checkpoint_timestamp_ms** (integer) - The timestamp of the checkpoint in milliseconds.
- **package** (string) - The package ID.
- **pool_id** (string) - The ID of the pool.
- **referral_id** (string) - The ID of the referral.
- **base_fee** (integer) - The base fee earned.
- **quote_fee** (integer) - The quote fee earned.
- **deep_fee** (integer) - The deep fee earned.

#### Response Example
```json
[
    {
        "event_digest": "0xabc123...",
        "digest": "0xdef456...",
        "sender": "0x1111...",
        "checkpoint": 12345678,
        "checkpoint_timestamp_ms": 1738000000000,
        "package": "0x2222...",
        "pool_id": "0x1234...",
        "referral_id": "0x5678...",
        "base_fee": 1000000,
        "quote_fee": 500000,
        "deep_fee": 250000
    }
]
```
```

--------------------------------

### Get Amount Out

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/swaps

Simulates a swap and returns the exact amount of DEEP tokens required for the swap. This endpoint is useful for estimating the cost of a swap before execution.

```APIDOC
## GET /get_amount_out

### Description
Simulates a swap operation and calculates the exact amount of DEEP tokens required to cover the trading fees for that swap. This is a read-only endpoint useful for estimating swap costs.

### Method
GET

### Endpoint
`/get_amount_out`

### Parameters
#### Query Parameters
- **base_in** (Coin) - Required - The amount of base asset intended for the swap.
- **quote_in** (Coin) - Required - The amount of quote asset intended for the swap.

#### Request Body
None

### Response
#### Success Response (200)
- **deep_required** (Coin) - The `Coin` object representing the calculated DEEP tokens required for the swap fees.

#### Response Example
```json
{
  "deep_required": {
    "value": "10000"
  }
}
```
```

--------------------------------

### Get referral multiplier

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/referral

Get the current multiplier for a pool referral.

```APIDOC
## Get referral multiplier

### Description
Get the current multiplier for a pool referral.

### Method
GET

### Endpoint
/referrals/{referral_id}/multiplier

### Parameters
#### Path Parameters
- **referral_id** (ID) - Required - The ID of the referral to query.

### Response
#### Success Response (200)
- **multiplier** (f64) - The current referral multiplier.

#### Response Example
```json
{
  "multiplier": 0.5
}
```
```

--------------------------------

### GET /status

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Returns the health status of the indexer, including checkpoint lag information for each pipeline.

```APIDOC
## GET /status

### Description
Returns the health status of the indexer, including checkpoint lag information for each pipeline. The optional parameters set thresholds for determining healthy status (defaults: `max_checkpoint_lag=100`, `max_time_lag_seconds=60`).

### Method
GET

### Endpoint
/status

### Parameters
#### Query Parameters
- **max_checkpoint_lag** (integer) - Optional - The maximum allowed checkpoint lag.
- **max_time_lag_seconds** (integer) - Optional - The maximum allowed time lag in seconds.

#### Request Body
None

### Response
#### Success Response (200)
- **Indexer Status Object** - Contains the health status and lag information.
  - **status** (string) - The overall indexer status ('OK' or 'UNHEALTHY').
  - **latest_onchain_checkpoint** (integer) - The latest checkpoint available on the blockchain.
  - **current_time_ms** (integer) - The current time in milliseconds.
  - **earliest_checkpoint** (integer) - The earliest checkpoint indexed by the system.
  - **max_lag_pipeline** (string) - The name of the pipeline with the maximum lag.
  - **max_checkpoint_lag** (integer) - The maximum checkpoint lag observed across all pipelines.
  - **max_time_lag_seconds** (integer) - The maximum time lag in seconds observed across all pipelines.
  - **pipelines** (array) - An array of pipeline status objects.
    - **pipeline** (string) - The name of the pipeline.
    - **indexed_checkpoint** (integer) - The checkpoint currently indexed by this pipeline.
    - **indexed_epoch** (integer) - The epoch currently indexed by this pipeline.
    - **indexed_timestamp_ms** (integer) - The timestamp (in ms) of the indexed checkpoint.
    - **checkpoint_lag** (integer) - The checkpoint lag for this pipeline.
    - **time_lag_seconds** (integer) - The time lag in seconds for this pipeline.
    - **latest_onchain_checkpoint** (integer) - The latest on-chain checkpoint relevant to this pipeline.

#### Response Example
```json
{
    "status": "OK",
    "latest_onchain_checkpoint": 500,
    "current_time_ms": 1678886400000,
    "earliest_checkpoint": 490,
    "max_lag_pipeline": "mainnet_orders",
    "max_checkpoint_lag": 10,
    "max_time_lag_seconds": 5,
    "pipelines": [
        {
            "pipeline": "mainnet_orders",
            "indexed_checkpoint": 495,
            "indexed_epoch": 10,
            "indexed_timestamp_ms": 1678886300000,
            "checkpoint_lag": 5,
            "time_lag_seconds": 2,
            "latest_onchain_checkpoint": 500
        }
    ]
}
```
```

--------------------------------

### GET /get_points

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Returns the total points accumulated for the specified addresses, earned through trading activity on DeepBookV3.

```APIDOC
## GET /get_points

### Description
Returns the total points accumulated for the specified addresses. Points are earned through trading activity on DeepBookV3. Provide addresses as comma-separated values.

### Method
GET

### Endpoint
/get_points

### Parameters
#### Query Parameters
- **addresses** (string) - Required - A comma-separated list of wallet addresses.

#### Request Body
None

### Response
#### Success Response (200)
- **Object of Points** - Keys are wallet addresses and values are their accumulated points.
  - **address1** (integer) - Accumulated points for the first address.
  - **address2** (integer) - Accumulated points for the second address.

#### Response Example
```json
{
    "0x123...": 1500,
    "0x456...": 2200
}
```
```

--------------------------------

### Create and Reinitialize DeepBook Client with New Margin Manager (TypeScript)

Source: https://docs.sui.io/standards/deepbook/-margin-sdk

This example shows how to create a new margin manager on the blockchain and then reinitialize the DeepBook client with this newly created manager. This involves submitting a transaction to create the manager and then updating the client configuration.

```typescript
const MARGIN_MANAGER_KEY = 'MARGIN_MANAGER_1';

class DeepBookMarginTrader {
	client: ClientWithExtensions<{ deepbook: DeepBookClient }>;
	keypair: Ed25519Keypair;
	env: 'testnet' | 'mainnet';

	constructor(privateKey: string, env: 'testnet' | 'mainnet') {
		this.env = env;
		this.keypair = this.getSignerFromPK(privateKey);
		this.client = this.#createClient(env);
	}

	#createClient(env: 'testnet' | 'mainnet', marginManagers?: { [key: string]: MarginManager }) {
		return new SuiGrpcClient({
			network: env,
			baseUrl:
				env === 'mainnet'
					? 'https://fullnode.mainnet.sui.io:443'
					: 'https://fullnode.testnet.sui.io:443',
		}).$extend(
			deepbook({
				address: this.getActiveAddress(),
				marginManagers,
			}),
		);
	}

	getSignerFromPK = (privateKey: string): Ed25519Keypair => {
		const { scheme, secretKey } = decodeSuiPrivateKey(privateKey);
		if (scheme === 'ED25519') return Ed25519Keypair.fromSecretKey(secretKey);

		throw new Error(`Unsupported scheme: ${scheme}`);
	};

	getActiveAddress() {
		return this.keypair.toSuiAddress();
	}

	auto createMarginManagerAndReinitialize() {
		let tx = new Transaction();
		const poolKey = 'SUI_DBUSDC';
		tx.add(this.client.deepbook.marginManager.newMarginManager(poolKey));

		const result = await this.client.core.signAndExecuteTransaction({
			ransaction: tx,
			signer: this.keypair,
			include: { effects: true, objectTypes: true },
		});

		if (result.$kind === 'FailedTransaction') {
			throw new Error('Transaction failed');
		}

		const objectTypes = result.Transaction?.objectTypes ?? {};
		const marginManagerAddress = result.Transaction?.effects?.changedObjects?.find(
			(obj) =>
				obj.idOperation === 'Created' && objectTypes[obj.objectId]?.includes('MarginManager'),
		)?.objectId;

		if (!marginManagerAddress) {
			throw new Error('Failed to create margin manager');
		}

		const marginManagers: { [key: string]: MarginManager } = {
			[MARGIN_MANAGER_KEY]: {
				address: marginManagerAddress,
				poolKey: poolKey,
			},
		};

		this.client = this.#createClient(this.env, marginManagers);
	}
}

```

--------------------------------

### GET /ticker

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Returns ticker information for all trading pairs, including base and quote volume, last price, and pool status (active or inactive).

```APIDOC
## GET /ticker

### Description
Returns ticker information for all trading pairs, including base and quote volume, last price, and pool status (active or inactive).

### Method
GET

### Endpoint
`/ticker`

### Parameters
None

### Response
#### Success Response (200)
- **[TRADING_PAIR]** (object) - An object where keys are trading pair names.
  - **base_volume** (float) - The trading volume in the base currency.
  - **quote_volume** (float) - The trading volume in the quote currency.
  - **last_price** (float) - The last traded price.
  - **isFrozen** (integer) - The status of the pool: 0 for active, 1 for inactive.

#### Response Example
```json
{
	"DEEP_USDC": {
		"last_price": 0.07055,
		"base_volume": 43760440.0,
		"quote_volume": 3096546.9161,
		"isFrozen": 0
	},
	"NS_SUI": {
		"last_price": 0.08323,
		"base_volume": 280820.8,
		"quote_volume": 23636.83837,
		"isFrozen": 0
	},
	...
}
```
```

--------------------------------

### Get referral owner

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/referral

Get the owner address of a pool referral object.

```APIDOC
## Get referral owner

### Description
Get the owner address of a pool referral object.

### Method
GET

### Endpoint
/referrals/{referral_id}/owner

### Parameters
#### Path Parameters
- **referral_id** (ID) - Required - The ID of the referral.

### Response
#### Success Response (200)
- **owner_address** (Address) - The address of the referral owner.

#### Response Example
```json
{
  "owner_address": "0x1234567890abcdef1234567890abcdef1234567890"
}
```
```

--------------------------------

### GET /asset_supplied

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves events for when assets are supplied to margin pools. Requires margin_pool_id and supplier address.

```APIDOC
## GET /asset_supplied

### Description
Returns events for when assets are supplied to margin pools.

### Method
GET

### Endpoint
/asset_supplied?margin_pool_id=<ID>&supplier=<ADDRESS>

### Parameters
#### Query Parameters
- **margin_pool_id** (string) - Required - The ID of the margin pool.
- **supplier** (string) - Required - The address of the supplier.

### Response
#### Success Response (200)
- **event_digest** (string) - The digest of the event.
- **digest** (string) - The transaction digest.
- **sender** (string) - The sender address.
- **checkpoint** (integer) - The checkpoint number.
- **checkpoint_timestamp_ms** (integer) - The timestamp of the checkpoint in milliseconds.
- **package** (string) - The package ID.
- **margin_pool_id** (string) - The ID of the margin pool.
- **asset_type** (string) - The type of the asset.
- **supplier** (string) - The address of the supplier.
- **amount** (string) - The amount of asset supplied.
- **shares** (string) - The number of shares received.
- **onchain_timestamp** (integer) - The on-chain timestamp in milliseconds.

#### Response Example
```json
[
    {
        "event_digest": "0xabc123...",
        "digest": "0xdef456...",
        "sender": "0x1111...",
        "checkpoint": 12345678,
        "checkpoint_timestamp_ms": 1738000000000,
        "package": "0x2222...",
        "margin_pool_id": "0x1234...",
        "asset_type": "0x2::sui::SUI",
        "supplier": "0xabcd...",
        "amount": 1000000000,
        "shares": 1000000000,
        "onchain_timestamp": 1738000000000
    }
]
```
```

--------------------------------

### GET /deep_supply

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Retrieves the total supply of DEEP tokens.

```APIDOC
## GET /deep_supply

### Description
Returns the total supply of DEEP tokens.

### Method
GET

### Endpoint
/deep_supply

### Parameters
#### Query Parameters
None

#### Request Body
None

### Response
#### Success Response (200)
- **total_supply** (string) - The total supply of DEEP tokens.

#### Response Example
```json
{
    "total_supply": "1000000000"
}
```
```

--------------------------------

### Get Historical Volume for All Pools

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Retrieves historical trading volume for all pools within a specified time range.

```APIDOC
## GET /all_historical_volume

### Description
Retrieves historical trading volume for all pools. By default, retrieves the last 24-hour trading volume in the quote asset. Set `volume_in_base` to `true` to query the base asset instead.

### Method
GET

### Endpoint
/all_historical_volume

### Parameters
#### Query Parameters
- **start_time** (integer) - Optional - Unix timestamp in seconds for the start of the time range.
- **end_time** (integer) - Optional - Unix timestamp in seconds for the end of the time range.
- **volume_in_base** (boolean) - Optional - If true, returns volume in the base asset; otherwise, in the quote asset. Defaults to false.

### Request Example
```http
/all_historical_volume?start_time=<UNIX_TIMESTAMP_SECONDS>&end_time=<UNIX_TIMESTAMP_SECONDS>&volume_in_base=<BOOLEAN>
```

### Response
#### Success Response (200)
- **pool_name** (number) - Total trading volume for the specified pool within the given time range.

#### Response Example
```json
{
	"DEEP_SUI": 22557460000000,
	"WUSDT_USDC": 10265000000,
	"NS_USDC": 4399650900000,
	"NS_SUI": 6975475200000,
	"SUI_USDC": 19430171000000000,
	"WUSDC_USDC": 23349574900000,
	"DEEP_USDC": 130000590000000
}
```
```

--------------------------------

### GET /margin_pool_created

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves events for when margin pools are created. Requires margin_pool_id.

```APIDOC
## GET /margin_pool_created

### Description
Returns events for when margin pools are created.

### Method
GET

### Endpoint
/margin_pool_created?margin_pool_id=<ID>

### Parameters
#### Query Parameters
- **margin_pool_id** (string) - Required - The ID of the margin pool.

### Response
#### Success Response (200)
- **event_digest** (string) - The digest of the event.
- **digest** (string) - The transaction digest.
- **sender** (string) - The sender address.
- **checkpoint** (integer) - The checkpoint number.
- **checkpoint_timestamp_ms** (integer) - The timestamp of the checkpoint in milliseconds.
- **package** (string) - The package ID.
- **margin_pool_id** (string) - The ID of the margin pool.
- **maintainer_cap_id** (string) - The ID of the maintainer capability.
- **asset_type** (string) - The type of the asset.
- **config_json** (object) - The configuration details of the margin pool.
  - **margin_pool_config** (object) - Margin pool specific configurations.
    - **supply_cap** (string) - The supply cap of the pool.
    - **max_utilization_rate** (string) - The maximum utilization rate.
    - **protocol_spread** (string) - The protocol spread.
    - **min_borrow** (string) - The minimum borrow amount.
  - **interest_config** (object) - Interest rate configurations.
    - **base_rate** (string) - The base interest rate.
    - **base_slope** (string) - The base slope for interest calculation.
    - **optimal_utilization** (string) - The optimal utilization rate for interest.
    - **excess_slope** (string) - The slope for interest above optimal utilization.
- **onchain_timestamp** (integer) - The on-chain timestamp in milliseconds.

#### Response Example
```json
[
    {
        "event_digest": "0xabc123...",
        "digest": "0xdef456...",
        "sender": "0x1111...",
        "checkpoint": 12345678,
        "checkpoint_timestamp_ms": 1738000000000,
        "package": "0x2222...",
        "margin_pool_id": "0x1234...",
        "maintainer_cap_id": "0x5678...",
        "asset_type": "0x2::sui::SUI",
        "config_json": {
            "margin_pool_config": {
                "supply_cap": "10000000000000",
                "max_utilization_rate": "950000000",
                "protocol_spread": "50000000",
                "min_borrow": "1000000"
            },
            "interest_config": {
                "base_rate": "100000",
                "base_slope": "200000",
                "optimal_utilization": "800000000",
                "excess_slope": "500000"
            }
        },
        "onchain_timestamp": 1738000000000
    }
]
```
```

--------------------------------

### Get referral pool ID

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/referral

Get the pool ID associated with a pool referral object.

```APIDOC
## Get referral pool ID

### Description
Get the pool ID associated with a pool referral object.

### Method
GET

### Endpoint
/referrals/{referral_id}/pool

### Parameters
#### Path Parameters
- **referral_id** (ID) - Required - The ID of the referral.

### Response
#### Success Response (200)
- **pool_id** (ID) - The ID of the pool associated with the referral.

#### Response Example
```json
{
  "pool_id": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
}
```
```

--------------------------------

### Get Owner Address of a Pool Referral

Source: https://docs.sui.io/standards/deepbook/v3-sdk/balance-manager

Use `balanceManagerReferralOwner` to get the owner address of a pool referral (DeepBookPoolReferral). This read-only function requires the referral ID and returns a transaction object.

```typescript
balanceManagerReferralOwner = (tx: Transaction, referralId: string) => {
  tx.add(this.balanceManager.balanceManagerReferralOwner(referralId));
};
```

--------------------------------

### Get All Pool Information

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Retrieves a list of all available trading pools on DeepBookV3. Each pool entry includes detailed metadata such as asset IDs, symbols, decimals, and trading parameters like minimum size, lot size, and tick size.

```APIDOC
## GET /get_pools

### Description
Returns a list of all available pools, each containing detailed information about the base and quote assets, as well as pool parameters like minimum size, lot size, and tick size.

### Method
GET

### Endpoint
/get_pools

### Parameters
#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **pool_id** (string) - ID for the pool.
- **pool_name** (string) - Name of the pool.
- **base_asset_id** (string) - ID for the base asset.
- **base_asset_decimals** (integer) - Number of decimals for the base asset.
- **base_asset_symbol** (string) - Symbol for the base asset.
- **base_asset_name** (string) - Name of the base asset.
- **quote_asset_id** (string) - ID for the quote asset.
- **quote_asset_decimals** (integer) - Number of decimals for the quote asset.
- **quote_asset_symbol** (string) - Symbol for the quote asset.
- **quote_asset_name** (string) - Name of the quote asset.
- **min_size** (integer) - Minimum trade size for the pool, in smallest units of the base asset.
- **lot_size** (integer) - Minimum increment for trades in this pool, in smallest units of the base asset.
- **tick_size** (integer) - Minimum price increment for trades in this pool.

#### Response Example
```json
[
	{
	  "pool_id": "string",
	  "pool_name": "string",
	  "base_asset_id": "string",
	  "base_asset_decimals": 123,
	  "base_asset_symbol": "string",
	  "base_asset_name": "string",
	  "quote_asset_id": "string",
	  "quote_asset_decimals": 123,
	  "quote_asset_symbol": "string",
	  "quote_asset_name": "string",
	  "min_size": 123,
	  "lot_size": 123,
	  "tick_size": 123
	}
	...
]
```
```

--------------------------------

### Place Limit Order in TypeScript

Source: https://docs.sui.io/standards/deepbook/v3-sdk/orders

Demonstrates how to place a limit order using the DeepBookV3 SDK in TypeScript. It includes the interface for order parameters and an example of its usage within a class. This function requires a `Transaction` object and specific swap parameters.

```tsx
// Params for limit order
interface PlaceLimitOrderParams {
	poolKey: string;
	balanceManagerKey: string;
	clientOrderId: string;
	price: number;
	quantity: number;
	isBid: boolean;
	expiration?: number | bigint; // Default no expiration
	orderType?: OrderType; // Default no restrictions
	selfMatchingOption?: SelfMatchingOptions; // Default self matching allowed
	payWithDeep?: boolean; // Default true
}

/**
 * @description Place a limit order
 * @param {PlaceLimitOrderParams} params Parameters for placing a limit order
 * @returns A function that takes a Transaction object
 */
placeLimitOrder = (params: PlaceLimitOrderParams) => (tx: Transaction) => {};

// Example usage in DeepBookMarketMaker class
// Place a bid of 10 DEEP at $0.1
customPlaceLimitOrder = (tx: Transaction) => {
	const poolKey = 'DEEP_DBUSDC'; // Pool key, check constants.ts for more
	const managerKey = 'MANAGER_1'; // Balance manager key, initialized during client creation by user
	tx.add(
		this.deepBook.placeLimitOrder({
			poolKey: poolKey,
			balanceManagerKey: managerKey,
			clientOrderId: '1',
			price: 0.1,
			quantity: 10,
			isBid: true,
			payWithDeep: true,
		}),
	);
};

```

--------------------------------

### Get Pool ID Associated with a Pool Referral

Source: https://docs.sui.io/standards/deepbook/v3-sdk/balance-manager

Use `balanceManagerReferralPoolId` to get the pool ID associated with a pool referral (DeepBookPoolReferral). This read-only function requires the referral ID and returns a transaction object.

```typescript
balanceManagerReferralPoolId = (tx: Transaction, referralId: string) => {
  tx.add(this.balanceManager.balanceManagerReferralPoolId(referralId));
};
```

--------------------------------

### GET /get_points

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Retrieves the total points for a given list of addresses. This endpoint is useful for querying user point balances.

```APIDOC
## GET /get_points

### Description
Retrieves the total points for a given list of addresses. This endpoint is useful for querying user point balances.

### Method
GET

### Endpoint
/get_points

### Parameters
#### Query Parameters
- **addresses** (string) - Required - A comma-separated list of addresses to query.

### Request Example
```http
/get_points?addresses=0x344c2734b1d211bd15212bfb7847c66a3b18803f3f5ab00f5ff6f87b6fe6d27d,0x47dcbbc8561fe3d52198336855f0983878152a12524749e054357ac2e3573d58
```

### Response
#### Success Response (200)
- **address** (string) - The address of the user.
- **total_points** (integer) - The total points accumulated by the user.

#### Response Example
```json
[
    {
        "address": "0x344c2734b1d211bd15212bfb7847c66a3b18803f3f5ab00f5ff6f87b6fe6d27d",
        "total_points": 1250000
    },
    {
        "address": "0x47dcbbc8561fe3d52198336855f0983878152a12524749e054357ac2e3573d58",
        "total_points": 750000
    }
]
```
```

--------------------------------

### GET /orderbook/{pool_name}

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Retrieves the order book (bids and asks) for a specified trading pool, with options to control the level of detail and depth.

```APIDOC
## GET /orderbook/{pool_name}

### Description
Retrieves the order book (bids and asks) for a specified trading pool, with options to control the level of detail and depth.

### Method
GET

### Endpoint
/orderbook/{pool_name}

### Parameters
#### Query Parameters
- **level** (integer) - Optional - The level of detail for the order book. `1` for best bid/ask, `2` (default) for arranged bids/asks.
- **depth** (integer) - Optional - The number of bids and asks to return. `0` returns the entire order book. Defaults to all orders.

### Response
#### Success Response (200)
- **timestamp** (string) - A string representing the Unix timestamp in milliseconds.
- **bids** (array) - An array of bid orders, where each element is a two-element array: `[price, quantity]`.
- **asks** (array) - An array of ask orders, where each element is a two-element array: `[price, quantity]`.

#### Response Example
```json
{
	"timestamp": "1733874965431",
	"bids": [
		[
			"3.715",
			"2.7"
		],
		[
			"3.713",
			"2294.8"
		]
	],
	"asks": [
		[
			"3.717",
			"0.9"
		],
		[
			"3.718",
			"1000"
		]
	]
}
```
```

--------------------------------

### Get Historical Volume for Pool

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Retrieves historical trading volume for specified pools within a given time range.

```APIDOC
## GET /historical_volume/:pool_names

### Description
Retrieves historical trading volume for specified pools within a given time range. Delimit `pool_names` with commas. By default, retrieves the last 24-hour trading volume in the quote asset. Set `volume_in_base` to `true` to query the base asset instead.

### Method
GET

### Endpoint
/historical_volume/:pool_names

### Parameters
#### Path Parameters
- **pool_names** (string) - Required - Comma-separated list of pool names.

#### Query Parameters
- **start_time** (integer) - Optional - Unix timestamp in seconds for the start of the time range.
- **end_time** (integer) - Optional - Unix timestamp in seconds for the end of the time range.
- **volume_in_base** (boolean) - Optional - If true, returns volume in the base asset; otherwise, in the quote asset. Defaults to false.

### Request Example
```http
/historical_volume/DEEP_SUI,SUI_USDC?start_time=1731260703&end_time=1731692703&volume_in_base=true
```

### Response
#### Success Response (200)
- **pool_name** (number) - Total trading volume for the specified pool within the given time range.

#### Response Example
```json
{
	"DEEP_SUI": 22557460000000,
	"SUI_USDC": 19430171000000000
}
```
```

--------------------------------

### GET /margin_pool_config_updated

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves events for when margin pool configuration is updated. Requires margin_pool_id.

```APIDOC
## GET /margin_pool_config_updated

### Description
Returns events for when margin pool configuration is updated.

### Method
GET

### Endpoint
/margin_pool_config_updated?margin_pool_id=<ID>

### Parameters
#### Query Parameters
- **margin_pool_id** (string) - Required - The ID of the margin pool.

### Response
#### Success Response (200)
- **event_digest** (string) - The digest of the event.
- **digest** (string) - The transaction digest.
- **sender** (string) - The sender address.
- **checkpoint** (integer) - The checkpoint number.
- **checkpoint_timestamp_ms** (integer) - The timestamp of the checkpoint in milliseconds.
- **package** (string) - The package ID.
- **margin_pool_id** (string) - The ID of the margin pool.
- **pool_cap_id** (string) - The ID of the pool capability.
- **config_json** (object) - The updated margin pool configuration.
  - **margin_pool_config** (object) - Margin pool specific configurations.
    - **supply_cap** (string) - The updated supply cap of the pool.
    - **max_utilization_rate** (string) - The updated maximum utilization rate.
    - **protocol_spread** (string) - The updated protocol spread.
    - **min_borrow** (string) - The updated minimum borrow amount.
- **onchain_timestamp** (integer) - The on-chain timestamp in milliseconds.

#### Response Example
```json
[
    {
        "event_digest": "0xabc123...",
        "digest": "0xdef456...",
        "sender": "0x1111...",
        "checkpoint": 12345678,
        "checkpoint_timestamp_ms": 1738000000000,
        "package": "0x2222...",
        "margin_pool_id": "0x1234...",
        "pool_cap_id": "0x5678...",
        "config_json": {
            "margin_pool_config": {
                "supply_cap": "10000000000000",
                "max_utilization_rate": "950000000",
                "protocol_spread": "50000000",
                "min_borrow": "1000000"
            }
        },
        "onchain_timestamp": 1738000000000
    }
]
```
```

--------------------------------

### GET /deposited_assets/:balance_manager_ids

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Returns the list of assets that have been deposited into the specified balance managers.

```APIDOC
## GET /deposited_assets/:balance_manager_ids

### Description
Returns the list of assets that have been deposited into the specified balance managers. Balance manager IDs should be comma-separated.

### Method
GET

### Endpoint
/deposited_assets/:balance_manager_ids

### Parameters
#### Path Parameters
- **balance_manager_ids** (string) - Required - A comma-separated list of balance manager IDs.

#### Query Parameters
None

#### Request Body
None

### Response
#### Success Response (200)
- **Array of Balance Manager Asset Objects** - Each object details deposited assets for a balance manager.
  - **balance_manager_id** (string) - The ID of the balance manager.
  - **assets** (array of strings) - A list of asset symbols deposited into the balance manager.

#### Response Example
```json
[
    {
        "balance_manager_id": "bm_id_1",
        "assets": ["SUI", "USDC"]
    },
    {
        "balance_manager_id": "bm_id_2",
        "assets": ["ETH"]
    }
]
```
```

--------------------------------

### Place Limit Order on Sui IO Deepbook

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/orders

Demonstrates how to place a limit order using the `placeLimitOrder` function. It requires pool and margin manager keys, client order ID, price, quantity, and order direction (bid/ask). Optional parameters include expiration, order type, self-matching options, and whether to pay with DEEP.

```tsx
// Params for limit order
interface PlaceMarginLimitOrderParams {
	poolKey: string;
	marginManagerKey: string;
	clientOrderId: string;
	price: number;
	quantity: number;
	isBid: boolean;
	expiration?: number | bigint;
	orderType?: OrderType;
	selfMatchingOption?: SelfMatchingOptions;
	payWithDeep?: boolean;
}

// Example: Place a buy limit order for 10 SUI at $2.50
placeLimitOrder = (tx: Transaction) => {
	const poolKey = 'SUI_DBUSDC';
	const managerKey = 'MARGIN_MANAGER_1';
	tx.add(
		this.poolProxyContract.placeLimitOrder({
			poolKey,
			marginManagerKey: managerKey,
			clientOrderId: '12345',
			price: 2.5,
			quantity: 10,
			isBid: true,
			payWithDeep: true,
		}),
	);
};

```

--------------------------------

### GET /referral_fees_claimed

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves events for when referral fees are claimed. This endpoint allows filtering by referral ID and owner address.

```APIDOC
## GET /referral_fees_claimed

### Description
Returns events for when referral fees are claimed.

### Method
GET

### Endpoint
/referral_fees_claimed?referral_id=<ID>&owner=<ADDRESS>

### Parameters
#### Query Parameters
- **referral_id** (string) - Required - The ID of the referral to filter events by.
- **owner** (string) - Required - The address of the owner to filter events by.

### Response
#### Success Response (200)
- **event_digest** (string) - The digest of the event.
- **digest** (string) - The transaction digest.
- **sender** (string) - The address of the sender.
- **checkpoint** (integer) - The checkpoint number.
- **checkpoint_timestamp_ms** (integer) - The timestamp of the checkpoint in milliseconds.
- **package** (string) - The package ID where the event occurred.
- **referral_id** (string) - The ID of the referral.
- **owner** (string) - The address of the owner.
- **fees** (integer) - The amount of fees claimed.
- **onchain_timestamp** (integer) - The timestamp of the event on-chain in milliseconds.

#### Response Example
```json
[
    {
        "event_digest": "0xabc123...",
        "digest": "0xdef456...",
        "sender": "0x1111...",
        "checkpoint": 12345678,
        "checkpoint_timestamp_ms": 1738000000000,
        "package": "0x2222...",
        "referral_id": "0x1234...",
        "owner": "0xabcd...",
        "fees": 1000000,
        "onchain_timestamp": 1738000000000
    }
]
```
```

--------------------------------

### Get Points API Endpoint

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Retrieves the total accumulated points for specified addresses, earned through trading activity on DeepBookV3. Addresses should be provided as a comma-separated string.

```http
/get_points?addresses=<ADDRESS1>,<ADDRESS2>,...
```

--------------------------------

### Get Asset Information (HTTP)

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Retrieves comprehensive asset information for all coins actively traded on DeepBookV3. This endpoint provides a list of tradable assets, which is useful for understanding the platform's market offerings.

```http
/assets
```

--------------------------------

### GET /supply_referral_minted

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves events for when supply referrals are minted. This endpoint allows filtering by margin pool ID and owner address.

```APIDOC
## GET /supply_referral_minted

### Description
Returns events for when supply referrals are minted.

### Method
GET

### Endpoint
/supply_referral_minted?margin_pool_id=<ID>&owner=<ADDRESS>

### Parameters
#### Query Parameters
- **margin_pool_id** (string) - Required - The ID of the margin pool to filter events by.
- **owner** (string) - Required - The address of the owner to filter events by.

### Response
#### Success Response (200)
- **event_digest** (string) - The digest of the event.
- **digest** (string) - The transaction digest.
- **sender** (string) - The address of the sender.
- **checkpoint** (integer) - The checkpoint number.
- **checkpoint_timestamp_ms** (integer) - The timestamp of the checkpoint in milliseconds.
- **package** (string) - The package ID where the event occurred.
- **margin_pool_id** (string) - The ID of the margin pool.
- **supply_referral_id** (string) - The ID of the supply referral.
- **owner** (string) - The address of the owner.
- **onchain_timestamp** (integer) - The timestamp of the event on-chain in milliseconds.

#### Response Example
```json
[
    {
        "event_digest": "0xabc123...",
        "digest": "0xdef456...",
        "sender": "0x1111...",
        "checkpoint": 12345678,
        "checkpoint_timestamp_ms": 1738000000000,
        "package": "0x2222...",
        "margin_pool_id": "0x5678...",
        "supply_referral_id": "0x1234...",
        "owner": "0xabcd...",
        "onchain_timestamp": 1738000000000
    }
]
```
```

--------------------------------

### Get Pool Information (HTTP)

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Retrieves a list of all available trading pools. Each pool object contains detailed information about the base and quote assets, including IDs, symbols, decimals, and pool-specific parameters like min_size, lot_size, and tick_size.

```http
GET /get_pools

```

--------------------------------

### GET /interest_params_updated

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves events for when interest rate parameters are updated for a margin pool. Requires margin_pool_id.

```APIDOC
## GET /interest_params_updated

### Description
Returns events for when interest rate parameters are updated.

### Method
GET

### Endpoint
/interest_params_updated?margin_pool_id=<ID>

### Parameters
#### Query Parameters
- **margin_pool_id** (string) - Required - The ID of the margin pool.

### Response
#### Success Response (200)
- **event_digest** (string) - The digest of the event.
- **digest** (string) - The transaction digest.
- **sender** (string) - The sender address.
- **checkpoint** (integer) - The checkpoint number.
- **checkpoint_timestamp_ms** (integer) - The timestamp of the checkpoint in milliseconds.
- **package** (string) - The package ID.
- **margin_pool_id** (string) - The ID of the margin pool.
- **pool_cap_id** (string) - The ID of the pool capability.
- **config_json** (object) - The updated interest rate configuration.
  - **base_rate** (string) - The updated base interest rate.
  - **base_slope** (string) - The updated base slope.
  - **optimal_utilization** (string) - The updated optimal utilization rate.
  - **excess_slope** (string) - The updated excess slope.
- **onchain_timestamp** (integer) - The on-chain timestamp in milliseconds.

#### Response Example
```json
[
    {
        "event_digest": "0xabc123...",
        "digest": "0xdef456...",
        "sender": "0x1111...",
        "checkpoint": 12345678,
        "checkpoint_timestamp_ms": 1738000000000,
        "package": "0x2222...",
        "margin_pool_id": "0x1234...",
        "pool_cap_id": "0x5678...",
        "config_json": {
            "base_rate": "100000",
            "base_slope": "200000",
            "optimal_utilization": "800000000",
            "excess_slope": "500000"
        },
        "onchain_timestamp": 1738000000000
    }
]
```
```

--------------------------------

### GET /trade_count

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Retrieves the total number of trades across all pools within a specified time range.

```APIDOC
## GET /trade_count

### Description
Retrieves the total number of trades across all pools within the specified time range.

### Method
GET

### Endpoint
/trade_count

### Parameters
#### Query Parameters
- **start_time** (UNIX_TIMESTAMP_SECONDS) - Required - The start of the time range (Unix timestamp in seconds).
- **end_time** (UNIX_TIMESTAMP_SECONDS) - Required - The end of the time range (Unix timestamp in seconds).

#### Request Body
None

### Response
#### Success Response (200)
- **integer** - The total number of trades.

#### Response Example
```json
15000
```
```

--------------------------------

### Create Protocol Configuration

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/maintainer

Creates a new protocol configuration object, combining margin pool settings and interest rate parameters. Returns a transaction object for further processing.

```APIDOC
## POST /maintainer/newProtocolConfig

### Description
Use `newProtocolConfig` to create a new protocol configuration object combining margin pool settings and interest parameters. The call returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/maintainer/newProtocolConfig

### Parameters
#### Query Parameters
- **coinKey** (String) - Required - Identifies the asset type.
- **marginPoolConfig** (MarginPoolConfigParams) - Required - Object with margin pool settings.
- **interestConfig** (InterestConfigParams) - Required - Object with interest rate parameters.

### Request Example
```json
{
  "coinKey": "USDC",
  "marginPoolConfig": {
    "supplyCap": 1000000,
    "maxUtilizationRate": 0.8,
    "referralSpread": 0.01,
    "minBorrow": 10
  },
  "interestConfig": {
    "baseRate": 0.02,
    "baseSlope": 0.05,
    "optimalUtilization": 0.8,
    "excessSlope": 0.2
  }
}
```

### Response
#### Success Response (200)
- **transaction** (Function) - A function that takes a `Transaction` object to finalize the configuration.

#### Response Example
```json
{
  "transaction": "<function_reference>"
}
```
```

--------------------------------

### GET /asset_withdrawn

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves events for when assets are withdrawn from margin pools. Requires margin_pool_id and supplier address.

```APIDOC
## GET /asset_withdrawn

### Description
Returns events for when assets are withdrawn from margin pools.

### Method
GET

### Endpoint
/asset_withdrawn?margin_pool_id=<ID>&supplier=<ADDRESS>

### Parameters
#### Query Parameters
- **margin_pool_id** (string) - Required - The ID of the margin pool.
- **supplier** (string) - Required - The address of the supplier.

### Response
#### Success Response (200)
- **event_digest** (string) - The digest of the event.
- **digest** (string) - The transaction digest.
- **sender** (string) - The sender address.
- **checkpoint** (integer) - The checkpoint number.
- **checkpoint_timestamp_ms** (integer) - The timestamp of the checkpoint in milliseconds.
- **package** (string) - The package ID.
- **margin_pool_id** (string) - The ID of the margin pool.
- **asset_type** (string) - The type of the asset.
- **supplier** (string) - The address of the supplier.
- **amount** (string) - The amount of asset withdrawn.
- **shares** (string) - The number of shares redeemed.
- **onchain_timestamp** (integer) - The on-chain timestamp in milliseconds.

#### Response Example
```json
[
    {
        "event_digest": "0xabc123...",
        "digest": "0xdef456...",
        "sender": "0x1111...",
        "checkpoint": 12345678,
        "checkpoint_timestamp_ms": 1738000000000,
        "package": "0x2222...",
        "margin_pool_id": "0x1234...",
        "asset_type": "0x2::sui::SUI",
        "supplier": "0xabcd...",
        "amount": 1000000000,
        "shares": 1000000000,
        "onchain_timestamp": 1738000000000
    }
]
```
```

--------------------------------

### Initialize DeepBook Market Maker Client

Source: https://docs.sui.io/standards/deepbook/v3-sdk

Initializes the DeepBookMarketMaker client with a keypair and network environment. It allows for overriding default pools with a custom PoolMap and supports optional balance managers and admin capabilities. The client is extended with DeepBookClient functionalities.

```typescript
export class DeepBookMarketMaker {
	keypair: Keypair;
	client: ClientWithExtensions<{ deepbook: DeepBookClient }>;

	constructor(
		keypair: string | Keypair,
		env: 'testnet' | 'mainnet',
		balanceManagers?: { [key: string]: BalanceManager },
		adminCap?: string,
	) {
		if (typeof keypair === 'string') {
			this.keypair = DeepBookMarketMaker.#getSignerFromPK(keypair);
		} else {
			this.keypair = keypair;
		}

		this.client = new SuiGrpcClient({
			network: env,
			baseUrl:
				env === 'mainnet'
					? 'https://fullnode.mainnet.sui.io:443'
					: 'https://fullnode.testnet.sui.io:443',
		}).$extend(
			deepbook({
				address: this.getActiveAddress(),
				balanceManagers,
				adminCap,
			}),
		);
	}

	static #getSignerFromPK = (privateKey: string) => {
		const { schema, secretKey } = decodeSuiPrivateKey(privateKey);
		if (schema === 'ED25519') return Ed25519Keypair.fromSecretKey(secretKey);

		throw new Error(`Unsupported schema: ${schema}`);
	};

	signAndExecute = async (tx: Transaction) => {
		const result = await this.client.core.signAndExecuteTransaction({
			ransaction: tx,
		signer: this.keypair,
			include: { effects: true },
		});
		if (result.$kind === 'FailedTransaction') {
			throw new Error('Transaction failed');
		}
		return result.Transaction;
	};

	getActiveAddress() {
		return this.keypair.getPublicKey().toSuiAddress();
	}
}

```

--------------------------------

### Get All Pool Information - DeepBookV3 Indexer API

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Retrieves a list of all available trading pools from the DeepBookV3 Indexer. Each pool entry includes detailed metadata such as asset IDs, symbols, decimals, and trading parameters like minimum size, lot size, and tick size. This endpoint is crucial for understanding the available trading pairs and their configurations.

```HTTP
GET /get_pools
```

--------------------------------

### Get referral balances

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/referral

View the current accumulated balances for a pool referral without claiming them. Returns the amounts in base, quote, and DEEP tokens.

```APIDOC
## Get referral balances

### Description
View the current accumulated balances for a pool referral without claiming them. Returns the amounts in base, quote, and DEEP tokens.

### Method
GET

### Endpoint
/referrals/{referral_id}/balances

### Parameters
#### Path Parameters
- **referral_id** (ID) - Required - The ID of the referral to query.

### Response
#### Success Response (200)
- **base_amount** (u64) - The accumulated amount in the base asset.
- **quote_amount** (u64) - The accumulated amount in the quote asset.
- **deep_amount** (u64) - The accumulated amount in DEEP tokens.

#### Response Example
```json
{
  "base_amount": "1000",
  "quote_amount": "500",
  "deep_amount": "200"
}
```
```

--------------------------------

### GET /protocol_fees_increased

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves events for when protocol fees are increased. This endpoint allows filtering by margin pool ID.

```APIDOC
## GET /protocol_fees_increased

### Description
Returns events for when protocol fees are increased.

### Method
GET

### Endpoint
/protocol_fees_increased?margin_pool_id=<ID>

### Parameters
#### Query Parameters
- **margin_pool_id** (string) - Required - The ID of the margin pool to filter events by.

### Response
#### Success Response (200)
- **event_digest** (string) - The digest of the event.
- **digest** (string) - The transaction digest.
- **sender** (string) - The address of the sender.
- **checkpoint** (integer) - The checkpoint number.
- **checkpoint_timestamp_ms** (integer) - The timestamp of the checkpoint in milliseconds.
- **package** (string) - The package ID where the event occurred.
- **margin_pool_id** (string) - The ID of the margin pool.
- **total_shares** (integer) - The total shares.
- **referral_fees** (integer) - The referral fees.
- **maintainer_fees** (integer) - The maintainer fees.
- **protocol_fees** (integer) - The protocol fees.
- **onchain_timestamp** (integer) - The timestamp of the event on-chain in milliseconds.

#### Response Example
```json
[
    {
        "event_digest": "0xabc123...",
        "digest": "0xdef456...",
        "sender": "0x1111...",
        "checkpoint": 12345678,
        "checkpoint_timestamp_ms": 1738000000000,
        "package": "0x2222...",
        "margin_pool_id": "0x1234...",
        "total_shares": 1000000000,
        "referral_fees": 100000,
        "maintainer_fees": 200000,
        "protocol_fees": 300000,
        "onchain_timestamp": 1738000000000
    }
]
```
```

--------------------------------

### DeepBookClient Initialization with Sui

Source: https://docs.sui.io/standards/deepbook/-margin-sdk

Initializes the DeepBook client by extending a Sui gRPC client with DeepBook functionality. It requires a private key for signing and the network environment (testnet or mainnet). The client is configured with the appropriate network endpoint and DeepBook address.

```tsx
class DeepBookMarginTrader {
	client: ClientWithExtensions<{ deepbook: DeepBookClient }>;
	keypair: Ed25519Keypair;

	constructor(privateKey: string, env: 'testnet' | 'mainnet') {
		this.keypair = this.getSignerFromPK(privateKey);
		this.client = new SuiGrpcClient({
			network: env,
			baseUrl:
				env === 'mainnet'
					? 'https://fullnode.mainnet.sui.io:443'
					: 'https://fullnode.testnet.sui.io:443',
		}).$extend(
			deepbook({
				address: this.getActiveAddress(),
			}),
		);
	}

	getSignerFromPK = (privateKey: string): Ed25519Keypair => {
		const { scheme, secretKey } = decodeSuiPrivateKey(privateKey);
		if (scheme === 'ED25519') return Ed25519Keypair.fromSecretKey(secretKey);

		throw new Error(`Unsupported scheme: ${scheme}`);
	};

	getActiveAddress() {
		return this.keypair.toSuiAddress();
	}
}

```

--------------------------------

### GET /deepbook_pool_updated

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves events for when DeepBook pools are enabled or disabled for a margin pool. Requires margin_pool_id and deepbook_pool_id.

```APIDOC
## GET /deepbook_pool_updated

### Description
Returns events for when DeepBook pools are enabled or disabled for a margin pool.

### Method
GET

### Endpoint
/deepbook_pool_updated?margin_pool_id=<ID>&deepbook_pool_id=<ID>

### Parameters
#### Query Parameters
- **margin_pool_id** (string) - Required - The ID of the margin pool.
- **deepbook_pool_id** (string) - Required - The ID of the DeepBook pool.

### Response
#### Success Response (200)
- **event_digest** (string) - The digest of the event.
- **digest** (string) - The transaction digest.
- **sender** (string) - The sender address.
- **checkpoint** (integer) - The checkpoint number.
- **checkpoint_timestamp_ms** (integer) - The timestamp of the checkpoint in milliseconds.
- **package** (string) - The package ID.
- **margin_pool_id** (string) - The ID of the margin pool.
- **deepbook_pool_id** (string) - The ID of the DeepBook pool.
- **pool_cap_id** (string) - The ID of the pool capability.
- **enabled** (boolean) - Indicates if the DeepBook pool is enabled.
- **onchain_timestamp** (integer) - The on-chain timestamp in milliseconds.

#### Response Example
```json
[
    {
        "event_digest": "0xabc123...",
        "digest": "0xdef456...",
        "sender": "0x1111...",
        "checkpoint": 12345678,
        "checkpoint_timestamp_ms": 1738000000000,
        "package": "0x2222...",
        "margin_pool_id": "0x1234...",
        "deepbook_pool_id": "0x5678...",
        "pool_cap_id": "0x9abc...",
        "enabled": true,
        "onchain_timestamp": 1738000000000
    }
]
```
```

--------------------------------

### GET /supplier_cap_minted

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves events related to when supplier capabilities are minted. This endpoint allows filtering by a specific supplier capability ID.

```APIDOC
## GET /supplier_cap_minted

### Description
Returns events for when supplier capabilities are minted.

### Method
GET

### Endpoint
/supplier_cap_minted?supplier_cap_id=<ID>

### Parameters
#### Query Parameters
- **supplier_cap_id** (string) - Required - The ID of the supplier capability to filter events by.

### Response
#### Success Response (200)
- **event_digest** (string) - The digest of the event.
- **digest** (string) - The transaction digest.
- **sender** (string) - The address of the sender.
- **checkpoint** (integer) - The checkpoint number.
- **checkpoint_timestamp_ms** (integer) - The timestamp of the checkpoint in milliseconds.
- **package** (string) - The package ID where the event occurred.
- **supplier_cap_id** (string) - The ID of the supplier capability.
- **onchain_timestamp** (integer) - The timestamp of the event on-chain in milliseconds.

#### Response Example
```json
[
    {
        "event_digest": "0xabc123...",
        "digest": "0xdef456...",
        "sender": "0x1111...",
        "checkpoint": 12345678,
        "checkpoint_timestamp_ms": 1738000000000,
        "package": "0x2222...",
        "supplier_cap_id": "0x1234...",
        "onchain_timestamp": 1738000000000
    }
]
```
```

--------------------------------

### Get Deposited Assets API Endpoint

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Returns a list of assets that have been deposited into one or more specified balance managers. Balance manager IDs should be provided as a comma-separated string.

```http
/deposited_assets/:balance_manager_ids
```

--------------------------------

### GET /get_net_deposits/:asset_ids/:timestamp

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Returns the net deposits (deposits minus withdrawals) for specified assets up to a given timestamp.

```APIDOC
## GET /get_net_deposits/:asset_ids/:timestamp

### Description
Returns the net deposits (deposits minus withdrawals) for specified assets up to a given timestamp. Asset IDs should be comma-separated.

### Method
GET

### Endpoint
/get_net_deposits/:asset_ids/:timestamp

### Parameters
#### Path Parameters
- **asset_ids** (string) - Required - A comma-separated list of asset IDs.
- **timestamp** (integer) - Required - The Unix timestamp up to which to calculate net deposits.

#### Query Parameters
None

#### Request Body
None

### Response
#### Success Response (200)
- **Object of Net Deposits** - Keys are asset IDs and values are the net deposit amounts.
  - **asset_id_1** (integer) - Net deposit amount for the first asset.
  - **asset_id_2** (integer) - Net deposit amount for the second asset.

#### Response Example
```json
{
    "asset_id_1": 10000,
    "asset_id_2": 5000
}
```
```

--------------------------------

### GET /maintainer_cap_updated

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves events for when maintainer capabilities are updated. This endpoint allows filtering by maintainer capability ID.

```APIDOC
## GET /maintainer_cap_updated

### Description
Returns events for when maintainer capabilities are updated.

### Method
GET

### Endpoint
/maintainer_cap_updated?maintainer_cap_id=<ID>

### Parameters
#### Query Parameters
- **maintainer_cap_id** (string) - Required - The ID of the maintainer capability to filter events by.

### Response
#### Success Response (200)
- **event_digest** (string) - The digest of the event.
- **digest** (string) - The transaction digest.
- **sender** (string) - The address of the sender.
- **checkpoint** (integer) - The checkpoint number.
- **checkpoint_timestamp_ms** (integer) - The timestamp of the checkpoint in milliseconds.
- **package** (string) - The package ID where the event occurred.
- **maintainer_cap_id** (string) - The ID of the maintainer capability.
- **onchain_timestamp** (integer) - The timestamp of the event on-chain in milliseconds.

#### Response Example
```json
[
    {
        "event_digest": "0xabc123...",
        "digest": "0xdef456...",
        "sender": "0x1111...",
        "checkpoint": 12345678,
        "checkpoint_timestamp_ms": 1738000000000,
        "package": "0x2222...",
        "maintainer_cap_id": "0x1234...",
        "onchain_timestamp": 1738000000000
    }
]
```
```

--------------------------------

### GET /trades/{pool_name}

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Retrieves historical trade data for a specified trading pool. Supports filtering by time range and balance manager IDs.

```APIDOC
## GET /trades/{pool_name}

### Description
Retrieves historical trade data for a specified trading pool. Supports filtering by time range and balance manager IDs.

### Method
GET

### Endpoint
/trades/{pool_name}

### Parameters
#### Query Parameters
- **limit** (integer) - Optional - The maximum number of trades to return.
- **start_time** (integer) - Optional - Unix timestamp in seconds to filter trades from.
- **end_time** (integer) - Optional - Unix timestamp in seconds to filter trades until.
- **maker_balance_manager_id** (string) - Optional - Filter trades by maker's balance manager ID.
- **taker_balance_manager_id** (string) - Optional - Filter trades by taker's balance manager ID.

### Response
#### Success Response (200)
- **event_digest** (string) - The digest of the event.
- **digest** (string) - The digest of the trade.
- **trade_id** (string) - The unique identifier for the trade.
- **maker_order_id** (string) - The ID of the maker's order.
- **taker_order_id** (string) - The ID of the taker's order.
- **maker_balance_manager_id** (string) - The ID of the maker's balance manager.
- **taker_balance_manager_id** (string) - The ID of the taker's balance manager.
- **price** (float) - The price at which the trade occurred.
- **base_volume** (float) - The volume of the base asset traded.
- **quote_volume** (float) - The volume of the quote asset traded.
- **timestamp** (integer) - The Unix timestamp in milliseconds when the trade occurred.
- **type** (string) - The type of trade ('buy' or 'sell' based on taker's direction).
- **taker_is_bid** (boolean) - Indicates if the taker's action was a bid.
- **taker_fee** (float) - The fee paid by the taker.
- **maker_fee** (float) - The fee paid by the maker.
- **taker_fee_is_deep** (boolean) - Indicates if the taker's fee was considered 'deep'.
- **maker_fee_is_deep** (boolean) - Indicates if the maker's fee was considered 'deep'.

#### Response Example
```json
[
    {
        "event_digest": "abc123...",
        "digest": "def456...",
        "trade_id": "136321457151457660152049680",
        "maker_order_id": "68160737799100866923792791",
        "taker_order_id": "170141183460537392451039660509112362617",
        "maker_balance_manager_id": "0x344c2734b1d211bd15212bfb7847c66a3b18803f3f5ab00f5ff6f87b6fe6d27d",
        "taker_balance_manager_id": "0x47dcbbc8561fe3d52198336855f0983878152a12524749e054357ac2e3573d58",
        "price": 3.695,
        "base_volume": 405.0,
        "quote_volume": 1499.0,
        "timestamp": 1738096392913,
        "type": "sell",
        "taker_is_bid": false,
        "taker_fee": 0.001,
        "maker_fee": 0.0005,
        "taker_fee_is_deep": true,
        "maker_fee_is_deep": true
    }
]
```
```

--------------------------------

### Get Order Book Information (HTTP)

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Fetches the current order book for a given pool, including bids and asks sorted by price. Users can specify the level of detail (best bid/ask only or arranged) and the depth of orders to retrieve. A depth of 0 returns the entire order book.

```http
/orderbook/:pool_name?level={1|2}&depth={integer}
```

--------------------------------

### Place Market Order on Sui IO Deepbook

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/orders

Shows how to place a market order using `placeMarketOrder`. This function requires pool and margin manager keys, a client order ID, quantity, and order direction. It also supports the `payWithDeep` option.

```tsx
// Example: Place a market sell order for 5 SUI
placeMarketOrder = (tx: Transaction) => {
	const poolKey = 'SUI_DBUSDC';
	const managerKey = 'MARGIN_MANAGER_1';
	tx.add(
		this.poolProxyContract.placeMarketOrder({
			poolKey,
			marginManagerKey: managerKey,
			clientOrderId: '12346',
			quantity: 5,
			isBid: false,
			payWithDeep: true,
		}),
	);
};

```

--------------------------------

### Get Net Deposits API Endpoint

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Calculates the net deposits (total deposits minus total withdrawals) for a specified list of assets up to a given timestamp. Asset IDs must be provided as a comma-separated string.

```http
/get_net_deposits/:asset_ids/:timestamp
```

--------------------------------

### Initialize DeepBook Margin Trader Client (TypeScript)

Source: https://docs.sui.io/standards/deepbook/-margin-sdk

Initializes the DeepBookMarginTrader client with a private key, network environment, and optional margin managers. It sets up the necessary client connections for interacting with DeepBook services on the Sui network. Dependencies include the Sui gRPC client and DeepBook extensions.

```typescript
export class DeepBookMarginTrader {
	keypair: Keypair;
	client: ClientWithExtensions<{ deepbook: DeepBookClient }>;

	constructor(
		keypair: string | Keypair,
		env: 'testnet' | 'mainnet',
		marginManagers?: { [key: string]: MarginManager },
		maintainerCap?: string,
	) {
		if (typeof keypair === 'string') {
			this.keypair = DeepBookMarginTrader.#getSignerFromPK(keypair);
		}

		this.client = new SuiGrpcClient({
			network: env,
			baseUrl:
				env === 'mainnet'
					? 'https://fullnode.mainnet.sui.io:443'
					: 'https://fullnode.testnet.sui.io:443',
		}).$extend(
			deepbook({
				address: this.getActiveAddress(),
				marginManagers,
				marginMaintainerCap: maintainerCap,
			}),
		);
	}

	static #getSignerFromPK = (privateKey: string) => {
		const { scheme, secretKey } = decodeSuiPrivateKey(privateKey);
		if (scheme === 'ED25519') return Ed25519Keypair.fromSecretKey(secretKey);

		throw new Error(`Unsupported scheme: ${scheme}`);
	};

	signAndExecute = async (tx: Transaction) => {
		const result = await this.client.core.signAndExecuteTransaction({
			transaction: tx,
			signer: this.keypair,
			include: { effects: true },
		});
		if (result.$kind === 'FailedTransaction') {
			throw new Error('Transaction failed');
		}
		return result.Transaction;
	};

	getActiveAddress() {
		return this.keypair.getPublicKey().toSuiAddress();
	}
}

```

--------------------------------

### Get DeepBook Pool Registered Events

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Fetches events related to the registration of DeepBook pools within the margin registry. It requires a `pool_id` and returns detailed registration event data.

```http
/deepbook_pool_registered?pool_id=<ID>
```

--------------------------------

### GET /orders/:pool_name/:balance_manager_id

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Retrieves orders for a specific balance manager within a pool, with optional filtering by order status.

```APIDOC
## GET /orders/:pool_name/:balance_manager_id

### Description
Retrieves orders for a specific balance manager within a pool. The `status` parameter can filter by order status (e.g., `Placed`, `Canceled`, `Filled`). Multiple statuses can be provided as comma-separated values.

### Method
GET

### Endpoint
/orders/:pool_name/:balance_manager_id

### Parameters
#### Path Parameters
- **pool_name** (string) - Required - The name of the pool.
- **balance_manager_id** (string) - Required - The ID of the balance manager.

#### Query Parameters
- **limit** (integer) - Optional - The maximum number of orders to return.
- **status** (string) - Optional - Comma-separated order statuses to filter by (e.g., `Placed,Filled`).

#### Request Body
None

### Response
#### Success Response (200)
- **Array of Order Objects** - Each object represents an order.
  - **order_id** (string) - The unique identifier for the order.
  - **balance_manager_id** (string) - The ID of the balance manager associated with the order.
  - **type** (string) - The type of order (e.g., 'buy' or 'sell').
  - **current_status** (string) - The current status of the order.
  - **price** (float) - The price of the order.
  - **placed_at** (integer) - The Unix timestamp when the order was placed.
  - **last_updated_at** (integer) - The Unix timestamp when the order was last updated.
  - **original_quantity** (float) - The original quantity of the order.
  - **filled_quantity** (float) - The quantity of the order that has been filled.
  - **remaining_quantity** (float) - The remaining quantity of the order to be filled.

#### Response Example
```json
[
    {
        "order_id": "string",
        "balance_manager_id": "string",
        "type": "string",
        "current_status": "string",
        "price": 1.23,
        "placed_at": 1678886400,
        "last_updated_at": 1678886400,
        "original_quantity": 100.0,
        "filled_quantity": 50.0,
        "remaining_quantity": 50.0
    }
]
```
```

--------------------------------

### Get Liquidation Events

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Fetches events related to the liquidation of margin managers. Requires `margin_manager_id` and `margin_pool_id`. The response includes liquidation amounts, pool rewards, risk ratios, and remaining asset/debt information.

```http
GET /liquidation?margin_manager_id=<ID>&margin_pool_id=<ID>
```

--------------------------------

### Place Reduce-Only Order on Sui IO Deepbook

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/orders

Illustrates placing a reduce-only limit order with `placeReduceOnlyLimitOrder`. This is useful for closing existing positions without opening new ones. It requires similar parameters to a limit order, including `isBid` to specify if it's reducing a short or long position.

```tsx
// Example: Place a reduce-only limit order to close a position
placeReduceOnly = (tx: Transaction) => {
	const poolKey = 'SUI_DBUSDC';
	const managerKey = 'MARGIN_MANAGER_1';
	tx.add(
		this.poolProxyContract.placeReduceOnlyLimitOrder({
			poolKey,
			marginManagerKey: managerKey,
			clientOrderId: '12347',
			price: 2.6,
			quantity: 10,
			isBid: true, // Buying back to reduce short position
			payWithDeep: true,
		}),
	);
};

```

--------------------------------

### Retrieve Mid Price

Source: https://docs.sui.io/standards/deepbook/v3-sdk/pools

Use `midPrice` to get the current mid-price for a specified pool. It requires the pool key and returns the mid-price as a promise.

```javascript
async midPrice(poolKey: string): Promise<number>
```

--------------------------------

### Initialize DeepBook Client with Existing Margin Manager (TypeScript)

Source: https://docs.sui.io/standards/deepbook/-margin-sdk

This snippet demonstrates how to initialize the DeepBook client with a pre-existing margin manager. It requires the client to be configured with the margin manager's address and pool key, typically loaded from environment variables.

```typescript
config();

const MARGIN_MANAGER_KEY = 'MARGIN_MANAGER_1';

class DeepBookMarginTrader {
	client: ClientWithExtensions<{ deepbook: DeepBookClient }>;
	keypair: Ed25519Keypair;

	constructor(privateKey: string, env: 'testnet' | 'mainnet') {
		this.keypair = this.getSignerFromPK(privateKey);
		this.client = new SuiGrpcClient({
			network: env,
			baseUrl:
				env === 'mainnet'
					? 'https://fullnode.mainnet.sui.io:443'
					: 'https://fullnode.testnet.sui.io:443',
		}).$extend(
			deepbook({
				address: this.getActiveAddress(),
				marginManagers: this.getMarginManagers(),
			}),
		);
	}

	getSignerFromPK = (privateKey: string): Ed25519Keypair => {
		const { scheme, secretKey } = decodeSuiPrivateKey(privateKey);
		if (scheme === 'ED25519') return Ed25519Keypair.fromSecretKey(secretKey);

		throw new Error(`Unsupported scheme: ${scheme}`);
	};

	getActiveAddress() {
		return this.keypair.toSuiAddress();
	}

	getMarginManagers(): { [key: string]: MarginManager } {
		const marginManagerAddress = process.env.MARGIN_MANAGER_ADDRESS;
		const poolKey = process.env.POOL_KEY || 'SUI_DBUSDC';
		if (!marginManagerAddress) {
			throw new Error('No margin manager address found');
		}
		return {
			[MARGIN_MANAGER_KEY]: {
				address: marginManagerAddress,
				poolKey: poolKey,
			},
		};
	}
}

```

--------------------------------

### Get Orders by Balance Manager API Endpoint

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Retrieves orders associated with a specific balance manager within a given pool. Supports filtering by order status and pagination using a limit parameter. The response includes detailed information about each order.

```http
/orders/:pool_name/:balance_manager_id?limit=<INTEGER>&status=<STATUS>
```

--------------------------------

### Get Referral Fee Events API Response (JSON)

Source: https://docs.sui.io/standards/deepbook/v3-indexer

The JSON response structure for the '/referral_fee_events' endpoint. It details individual referral fee events, including transaction digests, sender, pool information, and fee amounts.

```json
[
    {
        "event_digest": "0xabc123...",
        "digest": "0xdef456...",
        "sender": "0x1111...",
        "checkpoint": 12345678,
        "checkpoint_timestamp_ms": 1738000000000,
        "package": "0x2222...",
        "pool_id": "0x1234...",
        "referral_id": "0x5678...",
        "base_fee": 1000000,
        "quote_fee": 500000,
        "deep_fee": 250000
    }
]
```

--------------------------------

### Initialize Deepbook Client with Existing Balance Manager (TypeScript)

Source: https://docs.sui.io/standards/deepbook/v3-sdk

This snippet demonstrates how to initialize the Deepbook client with an existing balance manager. It requires the balance manager address and trade capability to be set in the environment variables. The client is extended with DeepBookClient functionality.

```typescript
config();

const BALANCE_MANAGER_KEY = 'MANAGER_1';

class DeepBookMarketMaker {
	client: ClientWithExtensions<{ deepbook: DeepBookClient }>;
	keypair: Ed25519Keypair;

	constructor(privateKey: string, env: 'testnet' | 'mainnet') {
		this.keypair = this.getSignerFromPK(privateKey);
		this.client = new SuiGrpcClient({
			network: env,
			baseUrl:
				env === 'mainnet'
					? 'https://fullnode.mainnet.sui.io:443'
					: 'https://fullnode.testnet.sui.io:443',
		}).$extend(
			deepbook({
				address: this.getActiveAddress(),
				balanceManagers: this.getBalanceManagers(),
			}),
		);
	}

	getSignerFromPK = (privateKey: string): Ed25519Keypair => {
		const { scheme, secretKey } = decodeSuiPrivateKey(privateKey);
		if (scheme === 'ED25519') return Ed25519Keypair.fromSecretKey(secretKey);

		throw new Error(`Unsupported scheme: ${scheme}`);
	};

	getActiveAddress() {
		return this.keypair.toSuiAddress();
	}

	getBalanceManagers(): { [key: string]: BalanceManager } {
		const balanceManagerAddress = process.env.BALANCE_MANAGER_ADDRESS;
		const balanceManagerTradeCap = process.env.BALANCE_MANAGER_TRADE_CAP;
		if (!balanceManagerAddress) {
			throw new Error('No balance manager address found');
		}
		return {
			[BALANCE_MANAGER_KEY]: {
				address: balanceManagerAddress,
				tradeCap: balanceManagerTradeCap,
			},
		};
	}
}

```

--------------------------------

### Get ID of a Balance Manager

Source: https://docs.sui.io/standards/deepbook/v3-sdk/balance-manager

Use `id` to retrieve the ID of a balance manager. This read-only function requires the manager key and returns a transaction object.

```typescript
id = (tx: Transaction, managerKey: string) => {
  tx.add(this.balanceManager.id(managerKey));
};
```

--------------------------------

### Get Historical Volume by Balance Manager (HTTP)

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Provides historical trading volume for specific pools, filtered by a balance manager ID. This endpoint supports time range selection and the option to retrieve volume in either the base or quote asset. It returns both maker and taker volumes for each pool.

```http
GET /historical_volume_by_balance_manager_id/:pool_names/:balance_manager_id?start_time=<UNIX_TIMESTAMP_SECONDS>&end_time=<UNIX_TIMESTAMP_SECONDS>&volume_in_base=<BOOLEAN>

```

--------------------------------

### GET /collateral_events

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves events for when collateral is deposited or withdrawn from margin managers. This endpoint provides detailed tracking of all collateral movements including Pyth price data at the time of the event.

```APIDOC
## GET /collateral_events

### Description
Returns events for when collateral is deposited or withdrawn from margin managers. This endpoint provides detailed tracking of all collateral movements including Pyth price data at the time of the event.

### Method
GET

### Endpoint
/collateral_events?margin_manager_id=<ID>&type=<"Deposit" | "Withdraw">&is_base=<BOOLEAN>

### Parameters
#### Query Parameters
- **margin_manager_id** (string) - Required - Filter by specific margin manager.
- **type** (string) - Required - Filter by event type (`Deposit` or `Withdraw`).
- **is_base** (boolean) - Required - Filter by whether the collateral is the base asset (`true`) or quote asset (`false`).

### Response
#### Success Response (200)
- **event_digest** (string) - The digest of the event.
- **digest** (string) - The transaction digest.
- **sender** (string) - The address of the sender.
- **checkpoint** (integer) - The checkpoint number.
- **checkpoint_timestamp_ms** (integer) - The timestamp of the checkpoint in milliseconds.
- **package** (string) - The package ID where the event occurred.
- **event_type** (string) - The type of the event (`Deposit` or `Withdraw`).
- **margin_manager_id** (string) - The ID of the margin manager.
- **amount** (string) - The amount of collateral.
- **asset_type** (string) - The type of the asset.
- **pyth_decimals** (integer) - The Pyth decimals for the asset.
- **pyth_price** (string) - The Pyth price for the asset.
- **withdraw_base_asset** (string | null) - The amount of base asset withdrawn, if applicable.
- **base_pyth_decimals** (integer) - The Pyth decimals for the base asset.
- **base_pyth_price** (string) - The Pyth price for the base asset.
- **quote_pyth_decimals** (integer) - The Pyth decimals for the quote asset.
- **quote_pyth_price** (string) - The Pyth price for the quote asset.
- **remaining_base_asset** (string) - The remaining amount of base asset.
- **remaining_quote_asset** (string) - The remaining amount of quote asset.
- **remaining_base_debt** (string) - The remaining base debt.
- **remaining_quote_debt** (string) - The remaining quote debt.
- **onchain_timestamp** (integer) - The timestamp of the event on-chain in milliseconds.

#### Response Example
```json
[
    {
        "event_digest": "0xabc123...",
        "digest": "0xdef456...",
        "sender": "0x1111...",
        "checkpoint": 12345678,
        "checkpoint_timestamp_ms": 1738000000000,
        "package": "0x2222...",
        "event_type": "Deposit",
        "margin_manager_id": "0x1234...",
        "amount": "1000000000",
        "asset_type": "0x2::sui::SUI",
        "pyth_decimals": 8,
        "pyth_price": "100000000",
        "withdraw_base_asset": null,
        "base_pyth_decimals": 8,
        "base_pyth_price": "100000000",
        "quote_pyth_decimals": 8,
        "quote_pyth_price": "100000000",
        "remaining_base_asset": "500000000",
        "remaining_quote_asset": "2000000000",
        "remaining_base_debt": "0",
        "remaining_quote_debt": "0",
        "onchain_timestamp": 1738000000000
    }
]
```
```

--------------------------------

### GET /trades/:pool_name

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Retrieves the most recent trades for a specified trading pool. Filters can be applied based on time range and balance manager IDs.

```APIDOC
## GET /trades/:pool_name

### Description
Retrieves the most recent trades for a specified trading pool. Filters can be applied based on time range and balance manager IDs.

### Method
GET

### Endpoint
`/trades/:pool_name`

### Parameters
#### Path Parameters
- **pool_name** (string) - Required - The name of the trading pool.

#### Query Parameters
- **limit** (integer) - Optional - The maximum number of trades to return.
- **start_time** (integer) - Optional - Unix timestamp in seconds for the start of the time range.
- **end_time** (integer) - Optional - Unix timestamp in seconds for the end of the time range.
- **maker_balance_manager_id** (string) - Optional - Filter trades by maker balance manager ID.
- **taker_balance_manager_id** (string) - Optional - Filter trades by taker balance manager ID.

### Request Example
```http
GET /trades/SUI_USDC?limit=10&start_time=1731260703&end_time=1731692703
```

### Response
#### Success Response (200)
(The exact structure of the trade object is not provided in the source text, but it would typically include details like price, amount, timestamp, maker/taker IDs, etc.)

#### Response Example
(Example response structure would be provided here if available in the source text.)
```

--------------------------------

### Get Owner Address of a Balance Manager

Source: https://docs.sui.io/standards/deepbook/v3-sdk/balance-manager

Use `owner` to retrieve the owner address of a balance manager. This read-only function requires the manager key and returns a transaction object.

```typescript
owner = (tx: Transaction, managerKey: string) => {
  tx.add(this.balanceManager.owner(managerKey));
};
```

--------------------------------

### Create Interest Configuration

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/maintainer

Creates an interest configuration object. Returns a transaction object for further processing.

```APIDOC
## POST /maintainer/newInterestConfig

### Description
Use `newInterestConfig` to create an interest configuration object. The call returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/maintainer/newInterestConfig

### Parameters
#### Query Parameters
- **interestConfig** (InterestConfigParams) - Required - Object containing interest rate parameters:
  - **baseRate** (Number) - Base interest rate.
  - **baseSlope** (Number) - Interest rate slope before kink.
  - **optimalUtilization** (Number) - The kink point (e.g., 0.8).
  - **excessSlope** (Number) - Interest rate slope after kink.

### Request Example
```json
{
  "interestConfig": {
    "baseRate": 0.02,
    "baseSlope": 0.05,
    "optimalUtilization": 0.8,
    "excessSlope": 0.2
  }
}
```

### Response
#### Success Response (200)
- **transaction** (Function) - A function that takes a `Transaction` object to finalize the configuration.

#### Response Example
```json
{
  "transaction": "<function_reference>"
}
```
```

--------------------------------

### Get DeepBook Pool Config Updated Events

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Fetches events detailing changes to DeepBook pool configurations. The `pool_id` is required, and the response includes the updated configuration details in JSON.

```http
/deepbook_pool_config_updated?pool_id=<ID>
```

--------------------------------

### GET /deepbook_pool_registered

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves events for when DeepBook pools are registered in the margin registry. This endpoint provides details about newly created pools, including their IDs and configuration.

```APIDOC
## GET /deepbook_pool_registered

### Description
Returns events for when DeepBook pools are registered in the margin registry.

### Method
GET

### Endpoint
/deepbook_pool_registered?pool_id=<ID>

### Parameters
#### Query Parameters
- **pool_id** (string) - Required - The ID of the DeepBook pool to filter events by.

### Response
#### Success Response (200)
- **event_digest** (string) - The unique digest of the event.
- **digest** (string) - The transaction digest associated with the event.
- **sender** (string) - The address of the account that initiated the event.
- **checkpoint** (integer) - The checkpoint number at which the event occurred.
- **checkpoint_timestamp_ms** (integer) - The timestamp (in milliseconds) of the checkpoint.
- **package** (string) - The package ID where the event originated.
- **pool_id** (string) - The ID of the registered DeepBook pool.
- **config_json** (object) - The configuration details of the pool, including margin pool IDs, risk ratios, rewards, and enabled status.
  - **base_margin_pool_id** (string) - ID of the base margin pool.
  - **quote_margin_pool_id** (string) - ID of the quote margin pool.
  - **risk_ratios** (object) - Risk ratio settings for the pool.
    - **min_withdraw_risk_ratio** (integer) - Minimum risk ratio for withdrawals.
    - **min_borrow_risk_ratio** (integer) - Minimum risk ratio for borrows.
    - **liquidation_risk_ratio** (integer) - Liquidation risk ratio.
    - **target_liquidation_risk_ratio** (integer) - Target liquidation risk ratio.
  - **user_liquidation_reward** (integer) - Reward for user liquidations.
  - **pool_liquidation_reward** (integer) - Reward for pool liquidations.
  - **enabled** (boolean) - Whether the pool is enabled.
- **onchain_timestamp** (integer) - The timestamp (in milliseconds) when the event was recorded on-chain.

#### Response Example
```json
[
    {
        "event_digest": "0xabc123...",
        "digest": "0xdef456...",
        "sender": "0x1111...",
        "checkpoint": 12345678,
        "checkpoint_timestamp_ms": 1738000000000,
        "package": "0x2222...",
        "pool_id": "0x1234...",
        "config_json": {
            "base_margin_pool_id": "0x5678...",
            "quote_margin_pool_id": "0x9abc...",
            "risk_ratios": {
                "min_withdraw_risk_ratio": 1200000000,
                "min_borrow_risk_ratio": 1100000000,
                "liquidation_risk_ratio": 1000000000,
                "target_liquidation_risk_ratio": 1050000000
            },
            "user_liquidation_reward": 50000000,
            "pool_liquidation_reward": 10000000,
            "enabled": true
        },
        "onchain_timestamp": 1738000000000
    }
]
```
```

--------------------------------

### Get Historical Volume by Balance Manager ID

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Retrieves historical trading volume for specific pools attributed to a balance manager within a given time range.

```APIDOC
## GET /historical_volume_by_balance_manager_id/:pool_names/:balance_manager_id

### Description
Retrieves historical trading volume by balance manager for a specific time range. Delimit `pool_names` with commas. By default, retrieves the last 24-hour trading volume in the quote asset. Set `volume_in_base` to `true` to query the base asset instead.

### Method
GET

### Endpoint
/historical_volume_by_balance_manager_id/:pool_names/:balance_manager_id

### Parameters
#### Path Parameters
- **pool_names** (string) - Required - Comma-separated list of pool names.
- **balance_manager_id** (string) - Required - The ID of the balance manager.

#### Query Parameters
- **start_time** (integer) - Optional - Unix timestamp in seconds for the start of the time range.
- **end_time** (integer) - Optional - Unix timestamp in seconds for the end of the time range.
- **volume_in_base** (boolean) - Optional - If true, returns volume in the base asset; otherwise, in the quote asset. Defaults to false.

### Request Example
None provided in the source text.

### Response
#### Success Response (200)
- **pool_name** (array) - An array containing the maker volume and taker volume for the specified pool and balance manager within the given time range.

#### Response Example
```json
{
	"pool_name_1": [maker_volume, taker_volume],
	"pool_name_2": …
}
```
```

--------------------------------

### GET /deepbook_pool_config_updated

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves events for when DeepBook pool configurations are updated. This endpoint allows you to track changes in the configuration parameters of DeepBook pools, such as risk ratios and rewards.

```APIDOC
## GET /deepbook_pool_config_updated

### Description
Returns events for when DeepBook pool configurations are updated.

### Method
GET

### Endpoint
/deepbook_pool_config_updated?pool_id=<ID>

### Parameters
#### Query Parameters
- **pool_id** (string) - Required - The ID of the DeepBook pool to filter events by.

### Response
#### Success Response (200)
- **event_digest** (string) - The unique digest of the event.
- **digest** (string) - The transaction digest associated with the event.
- **sender** (string) - The address of the account that initiated the event.
- **checkpoint** (integer) - The checkpoint number at which the event occurred.
- **checkpoint_timestamp_ms** (integer) - The timestamp (in milliseconds) of the checkpoint.
- **package** (string) - The package ID where the event originated.
- **pool_id** (string) - The ID of the updated DeepBook pool.
- **config_json** (object) - The updated configuration details of the pool.
  - **base_margin_pool_id** (string) - ID of the base margin pool.
  - **quote_margin_pool_id** (string) - ID of the quote margin pool.
  - **risk_ratios** (object) - Risk ratio settings for the pool.
    - **min_withdraw_risk_ratio** (integer) - Minimum risk ratio for withdrawals.
    - **min_borrow_risk_ratio** (integer) - Minimum risk ratio for borrows.
    - **liquidation_risk_ratio** (integer) - Liquidation risk ratio.
    - **target_liquidation_risk_ratio** (integer) - Target liquidation risk ratio.
  - **user_liquidation_reward** (integer) - Reward for user liquidations.
  - **pool_liquidation_reward** (integer) - Reward for pool liquidations.
  - **enabled** (boolean) - Whether the pool is enabled.
- **onchain_timestamp** (integer) - The timestamp (in milliseconds) when the event was recorded on-chain.

#### Response Example
```json
[
    {
        "event_digest": "0xabc123...",
        "digest": "0xdef456...",
        "sender": "0x1111...",
        "checkpoint": 12345678,
        "checkpoint_timestamp_ms": 1738000000000,
        "package": "0x2222...",
        "pool_id": "0x1234...",
        "config_json": {
            "base_margin_pool_id": "0x5678...",
            "quote_margin_pool_id": "0x9abc...",
            "risk_ratios": {
                "min_withdraw_risk_ratio": 1200000000,
                "min_borrow_risk_ratio": 1100000000,
                "liquidation_risk_ratio": 1000000000,
                "target_liquidation_risk_ratio": 1050000000
            },
            "user_liquidation_reward": 50000000,
            "pool_liquidation_reward": 10000000,
            "enabled": true
        },
        "onchain_timestamp": 1738000000000
    }
]
```
```

--------------------------------

### Get Historical Volume for All Pools (HTTP)

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Retrieves historical trading volume for all available pools. This endpoint allows for specifying a time range and choosing between volume in the base or quote asset. By default, it returns the last 24 hours of trading volume in the quote asset.

```http
GET /all_historical_volume?start_time=<UNIX_TIMESTAMP_SECONDS>&end_time=<UNIX_TIMESTAMP_SECONDS>&volume_in_base=<BOOLEAN>

```

--------------------------------

### Get Margin Manager States

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves the current state of margin managers, useful for identifying positions at risk of liquidation. Supports filtering by `max_risk_ratio` and `deepbook_pool_id`.

```http
GET /margin_manager_states?max_risk_ratio=<FLOAT>&deepbook_pool_id=<ID>
```

--------------------------------

### Get DEEP Supply API Endpoint

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Retrieves the total circulating supply of DEEP tokens. The response is a JSON object containing the total supply as a string.

```http
/deep_supply
```

--------------------------------

### Get Points API Response (JSON)

Source: https://docs.sui.io/standards/deepbook/v3-indexer

This JSON structure represents the response from the '/get_points' API endpoint. It lists addresses and their corresponding total points. This is typically used to display user point balances.

```json
[
    {
        "address": "0x1234...",
        "total_points": 1000000
    },
    {
        "address": "0x5678...",
        "total_points": 500000
    }
]
```

--------------------------------

### GET /order_updates/{pool_name}

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Retrieves recent order updates (placed or canceled) for a given pool, with options to filter by status, time range, and balance manager.

```APIDOC
## GET /order_updates/{pool_name}

### Description
Retrieves recent order updates (placed or canceled) for a given pool, with options to filter by status, time range, and balance manager.

### Method
GET

### Endpoint
/order_updates/{pool_name}

### Parameters
#### Query Parameters
- **limit** (integer) - Optional - The maximum number of order updates to return.
- **start_time** (integer) - Optional - Unix timestamp in seconds to filter updates from.
- **end_time** (integer) - Optional - Unix timestamp in seconds to filter updates until.
- **status** (string) - Optional - Filter by order status ('Placed' or 'Canceled').
- **balance_manager_id** (string) - Optional - Filter updates by balance manager ID.

### Response
#### Success Response (200)
- **order_id** (string) - The unique identifier for the order.
- **balance_manager_id** (string) - The ID of the balance manager associated with the order.
- **timestamp** (integer) - The Unix timestamp in milliseconds when the update occurred.
- **original_quantity** (integer) - The initial quantity of the order.
- **remaining_quantity** (integer) - The remaining quantity of the order.
- **filled_quantity** (integer) - The quantity of the order that has been filled.
- **price** (integer) - The price of the order.
- **status** (string) - The current status of the order ('Placed', 'Canceled', etc.).
- **type** (string) - The type of order ('buy' or 'sell').

#### Response Example
```json
[
    {
        "order_id": "170141183464610341308794360958165054983",
        "balance_manager_id": "0xd335e8aa19d6dc04273d77e364c936bad69db4905a4ab3b2733d644dd2b31e0a",
        "timestamp": 1738704071994,
        "original_quantity": 8910,
        "remaining_quantity": 8910,
        "filled_quantity": 0,
        "price": 22449,
        "status": "Placed",
        "type": "sell"
    }
]
```
```

--------------------------------

### Retrieve Pool Book Parameters

Source: https://docs.sui.io/standards/deepbook/v3-sdk/pools

Use `poolBookParams` to get the book parameters for a pool, such as tick size, lot size, and minimum order size. It requires the pool key and returns the parameters.

```javascript
async poolBookParams(poolKey: string): Promise<any>
```

--------------------------------

### Create and Reinitialize Deepbook Client with New Balance Manager (TypeScript)

Source: https://docs.sui.io/standards/deepbook/v3-sdk

This snippet shows how to create a new balance manager and then reinitialize the Deepbook client with it. It involves submitting a transaction to create the balance manager, extracting its address, and then creating a new client instance.

```typescript
const BALANCE_MANAGER_KEY = 'MANAGER_1';

class DeepBookMarketMaker {
	client: ClientWithExtensions<{ deepbook: DeepBookClient }>;
	keypair: Ed25519Keypair;
	env: 'testnet' | 'mainnet';

	constructor(privateKey: string, env: 'testnet' | 'mainnet') {
		this.env = env;
		this.keypair = this.getSignerFromPK(privateKey);
		this.client = this.#createClient(env);
	}

	#createClient(env: 'testnet' | 'mainnet', balanceManagers?: { [key: string]: BalanceManager }) {
		return new SuiGrpcClient({
			network: env,
			baseUrl:
				env === 'mainnet'
					? 'https://fullnode.mainnet.sui.io:443'
					: 'https://fullnode.testnet.sui.io:443',
		}).$extend(
			deepbook({
				address: this.getActiveAddress(),
				balanceManagers,
			}),
		);
	}

	getSignerFromPK = (privateKey: string): Ed25519Keypair => {
		const { scheme, secretKey } = decodeSuiPrivateKey(privateKey);
		if (scheme === 'ED25519') return Ed25519Keypair.fromSecretKey(secretKey);

		throw new Error(`Unsupported scheme: ${scheme}`);
	};

	getActiveAddress() {
		return this.keypair.toSuiAddress();
	}

	async createBalanceManagerAndReinitialize() {
		let tx = new Transaction();
		tx.add(this.client.deepbook.balanceManager.createAndShareBalanceManager());

		const result = await this.client.core.signAndExecuteTransaction({
			transaction: tx,
			signer: this.keypair,
			include: { effects: true, objectTypes: true },
		});

		if (result.$kind === 'FailedTransaction') {
			throw new Error('Transaction failed');
		}

		const objectTypes = result.Transaction?.objectTypes ?? {};
		const balanceManagerAddress = result.Transaction?.effects?.changedObjects?.find(
			(obj) => obj.idOperation === 'Created' && objectTypes[obj.objectId]?.includes('BalanceManager'),
		)?.objectId;

		if (!balanceManagerAddress) {
			throw new Error('Failed to create balance manager');
		}

		const balanceManagers: { [key: string]: BalanceManager } = {
			[BALANCE_MANAGER_KEY]: {
				address: balanceManagerAddress,
				tradeCap: undefined,
			},
		};

		this.client = this.#createClient(this.env, balanceManagers);
	}
}

```

--------------------------------

### Get Balance Manager Referral ID for a Pool

Source: https://docs.sui.io/standards/deepbook/v3-sdk/balance-manager

Use `getBalanceManagerReferralId` to retrieve the referral ID associated with a balance manager for a specific pool. The function returns a transaction object.

```typescript
getBalanceManagerReferralId = (tx: Transaction, managerKey: string, poolKey: string) => {
  tx.add(this.balanceManager.getBalanceManagerReferralId(managerKey, poolKey));
};
```

--------------------------------

### Get Loan Repaid Events

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves events indicating the repayment of borrowed assets from margin pools. Requires `margin_manager_id` and `margin_pool_id`. The response provides information on repayment amounts and shares.

```http
GET /loan_repaid?margin_manager_id=<ID>&margin_pool_id=<ID>
```

--------------------------------

### Create a Margin Pool with Configuration

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/maintainer

Creates a new margin pool for a specified coin, defining its operational parameters and interest rate model. This function requires a Transaction object and configures settings like supply cap, utilization rates, and borrowing minimums.

```typescript
createUsdcMarginPool = (tx: Transaction) => {
	const coinKey = 'USDC';

	// Create pool configuration
	const poolConfig = tx.add(
		this.maintainerContract.newProtocolConfig(
			coinKey,
			{
				supplyCap: 10_000_000, // 10M USDC
				maxUtilizationRate: 0.8, // 80%
				referralSpread: 0.1, // 10% protocol spread
				minBorrow: 100, // 100 USDC minimum
			},
			{
				baseRate: 0.02, // 2% base rate
				baseSlope: 0.1, // 10% slope before kink
				optimalUtilization: 0.8, // 80% kink point
				excessSlope: 1.0, // 100% slope after kink
			},
		),
	);

	// Create the pool
	tx.add(this.maintainerContract.createMarginPool(coinKey, poolConfig));
};
```

--------------------------------

### Get Pool DEEP Price Conversion

Source: https://docs.sui.io/standards/deepbook/v3-sdk/pools

Use `getPoolDeepPrice` to obtain the DEEP price conversion information for a pool. It requires the pool key and returns the DEEP price details.

```javascript
async getPoolDeepPrice(poolKey: string): Promise<any>
```

--------------------------------

### GET /historical_volume_by_balance_manager_id/SUI_USDC,DEEP_SUI/:balance_manager_id

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Retrieves historical trading volume for specified pools and a balance manager within a given time range. The volume can be returned in either the base or quote asset.

```APIDOC
## GET /historical_volume_by_balance_manager_id/:pool_names/:balance_manager_id

### Description
Retrieves historical trading volume for specified pools and a balance manager within a given time range. The volume can be returned in either the base or quote asset.

### Method
GET

### Endpoint
`/historical_volume_by_balance_manager_id/:pool_names/:balance_manager_id`

### Parameters
#### Path Parameters
- **pool_names** (string) - Required - Comma-separated list of pool names.
- **balance_manager_id** (string) - Required - The ID of the balance manager.

#### Query Parameters
- **start_time** (integer) - Optional - Unix timestamp in seconds for the start of the time range.
- **end_time** (integer) - Optional - Unix timestamp in seconds for the end of the time range.
- **volume_in_base** (boolean) - Optional - If true, returns volume in the base asset; otherwise, returns volume in the quote asset. Defaults to false.

### Request Example
```http
GET /historical_volume_by_balance_manager_id/SUI_USDC,DEEP_SUI/0x344c2734b1d211bd15212bfb7847c66a3b18803f3f5ab00f5ff6f87b6fe6d27d?start_time=1731260703&end_time=1731692703&volume_in_base=true
```

### Response
#### Success Response (200)
- **[pool_name]** (array) - An array containing two elements: [maker_volume, taker_volume].

#### Response Example
```json
{
	"DEEP_SUI": [
		14207960000000,
		3690000000
	],
	"SUI_USDC": [
		2089300100000000,
		17349400000000
	]
}
```
```

--------------------------------

### Get Margin Managers Information

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Provides an aggregated view of all margin managers, including their associated pool and asset details. This endpoint does not require any query parameters and returns a list of margin manager configurations.

```http
GET /margin_managers_info
```

--------------------------------

### Get Order Book Information Response Structure (JSON)

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Defines the JSON structure for order book data. It includes a timestamp (Unix milliseconds as a string) and two arrays, 'bids' and 'asks'. Each element within these arrays represents a price-quantity pair, with both values as strings.

```json
{
	"timestamp": "string",
	"bids": [
		[
			"string",
			"string"
		],
		[
			"string",
			"string"
		]
	],
	"asks": [
		[
			"string",
			"string"
		],
		[
			"string",
			"string"
		]
	]
}
```

--------------------------------

### GET /ohclv/:pool_name

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Retrieves OHLCV (Open, High, Low, Close, Volume) candlestick data for a specified pool within a given time range and interval.

```APIDOC
## GET /ohclv/:pool_name

### Description
Retrieves OHLCV (Open, High, Low, Close, Volume) candlestick data for a pool. Valid intervals are: `1m`, `5m`, `15m`, `30m`, `1h`, `4h`, `1d`, `1w`.

### Method
GET

### Endpoint
/ohclv/:pool_name

### Parameters
#### Path Parameters
- **pool_name** (string) - Required - The name of the pool (e.g., 'SUI_USDC').

#### Query Parameters
- **interval** (string) - Required - The time interval for the candlesticks (e.g., `1m`, `5m`, `1h`, `1d`).
- **start_time** (UNIX_TIMESTAMP_SECONDS) - Optional - The start of the time range (Unix timestamp in seconds).
- **end_time** (UNIX_TIMESTAMP_SECONDS) - Optional - The end of the time range (Unix timestamp in seconds).
- **limit** (integer) - Optional - The maximum number of candles to return.

#### Request Body
None

### Response
#### Success Response (200)
- **candles** (array) - An array of candlestick data.
  - Each element is an array containing: `[timestamp, open, high, low, close, volume]`.

#### Response Example
```json
{
    "candles": [
        [1738000000, 3.5, 3.6, 3.4, 3.55, 1000000],
        [1738003600, 3.55, 3.7, 3.5, 3.65, 1500000]
    ]
}
```
```

--------------------------------

### Create and Claim Referral Fees (TypeScript)

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/margin-pool

Functions for managing supply referrals and withdrawing accumulated referral fees. `mintSupplyReferral` creates a referral for earning fees, while `withdrawReferralFees` claims earned fees. Both return transaction builders.

```typescript
// Example: Create a supply referral
createReferral = (tx: Transaction) => {
	const coinKey = 'USDC';
	tx.add(this.marginPoolContract.mintSupplyReferral(coinKey));
};

// Example: Withdraw referral fees
claimReferralFees = (tx: Transaction) => {
	const coinKey = 'USDC';
	const referralId = '0x...'; // Your referral object ID
	tx.add(this.marginPoolContract.withdrawReferralFees(coinKey, referralId));
};
```

--------------------------------

### Get Loan Borrowed Events

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Fetches events for when assets are borrowed from margin pools. Requires `margin_manager_id` and `margin_pool_id`. The response details include loan amounts and shares, along with standard event metadata.

```http
GET /loan_borrowed?margin_manager_id=<ID>&margin_pool_id=<ID>
```

--------------------------------

### GET /deepbook_pool_updated_registry

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves events for when DeepBook pool registry entries are updated. This endpoint tracks modifications to the registry status of existing pools, including their enablement status.

```APIDOC
## GET /deepbook_pool_updated_registry

### Description
Returns events for when DeepBook pool registry entries are updated.

### Method
GET

### Endpoint
/deepbook_pool_updated?pool_id=<ID>

### Parameters
#### Query Parameters
- **pool_id** (string) - Required - The ID of the DeepBook pool to filter events by.

### Response
#### Success Response (200)
- **event_digest** (string) - The unique digest of the event.
- **digest** (string) - The transaction digest associated with the event.
- **sender** (string) - The address of the account that initiated the event.
- **checkpoint** (integer) - The checkpoint number at which the event occurred.
- **checkpoint_timestamp_ms** (integer) - The timestamp (in milliseconds) of the checkpoint.
- **package** (string) - The package ID where the event originated.
- **pool_id** (string) - The ID of the updated DeepBook pool.
- **enabled** (boolean) - The new enabled status of the pool.
- **onchain_timestamp** (integer) - The timestamp (in milliseconds) when the event was recorded on-chain.

#### Response Example
```json
[
    {
        "event_digest": "0xabc123...",
        "digest": "0xdef456...",
        "sender": "0x1111...",
        "checkpoint": 12345678,
        "checkpoint_timestamp_ms": 1738000000000,
        "package": "0x2222...",
        "pool_id": "0x1234...",
        "enabled": true,
        "onchain_timestamp": 1738000000000
    }
]
```
```

--------------------------------

### Margin Managers Information

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves an aggregate view of all margin managers, including their associated pool and asset information. This endpoint provides a high-level overview of active margin trading setups.

```APIDOC
## GET /margin_managers_info

### Description
Returns an aggregate view of all margin managers with their associated pool and asset information.

### Method
GET

### Endpoint
/margin_managers_info

#### Query Parameters
- **start_time** (integer) - Optional - Start of time range in Unix timestamp seconds (defaults to 24 hours ago).
- **end_time** (integer) - Optional - End of time range in Unix timestamp seconds (defaults to current time).
- **limit** (integer) - Optional - Maximum number of results to return (defaults to 1).

### Response
#### Success Response (200)
- **margin_manager_id** (string) - The ID of the margin manager.
- **deepbook_pool_id** (string) - The ID of the associated DeepBook pool.
- **base_asset_id** (string) - The ID of the base asset.
- **base_asset_symbol** (string) - The symbol of the base asset (e.g., SUI).
- **quote_asset_id** (string) - The ID of the quote asset.
- **quote_asset_symbol** (string) - The symbol of the quote asset (e.g., USDC).
- **base_margin_pool_id** (string) - The ID of the base asset margin pool.
- **quote_margin_pool_id** (string) - The ID of the quote asset margin pool.

#### Response Example
```json
[
    {
        "margin_manager_id": "0x1234...",
        "deepbook_pool_id": "0x5678...",
        "base_asset_id": "0xabcd...",
        "base_asset_symbol": "SUI",
        "quote_asset_id": "0xefgh...",
        "quote_asset_symbol": "USDC",
        "base_margin_pool_id": "0x1111...",
        "quote_margin_pool_id": "0x2222..."
    }
]
```
```

--------------------------------

### Get Pause Cap Updated Events

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves events indicating updates to pause capabilities. The endpoint requires a `pause_cap_id` and returns event data in a JSON array.

```http
/pause_cap_updated?pause_cap_id=<ID>
```

--------------------------------

### Get Margin Manager Creation Events

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves events related to the creation of margin managers. Requires a `margin_manager_id` as a query parameter. The response includes details such as event digest, sender, checkpoint, and margin manager specific IDs.

```http
GET /margin_manager_created?margin_manager_id=<ID>
```

--------------------------------

### Get Protocol Fees Withdrawn Events

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Fetches events signifying the withdrawal of protocol fees. This endpoint requires a `margin_pool_id` and returns a list of withdrawal events in JSON format.

```http
/protocol_fees_withdrawn?margin_pool_id=<ID>
```

--------------------------------

### Stake and Govern on Sui IO Deepbook

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/orders

Demonstrates how to interact with the staking and governance features. `stakeDeep` allows users to stake DEEP tokens, `submitProposal` enables creating new governance proposals, `voteOnProposal` lets users vote on existing proposals, and `claimTradingRebate` allows claiming trading fee rebates.

```tsx
// Example: Stake DEEP tokens
stakeDeep = (tx: Transaction) => {
	const managerKey = 'MARGIN_MANAGER_1';
	const stakeAmount = 1000; // Stake 1000 DEEP
	tx.add(this.poolProxyContract.stake(managerKey, stakeAmount));
};

// Example: Submit a governance proposal
submitGovernanceProposal = (tx: Transaction) => {
	const managerKey = 'MARGIN_MANAGER_1';
	tx.add(
		this.poolProxyContract.submitProposal(managerKey, {
			takerFee: 0.0005, // 5 bps
			makerFee: 0.0002, // 2 bps
			stakeRequired: 1000,
		}),
	);
};

// Example: Vote on a proposal
voteOnProposal = (tx: Transaction) => {
	const managerKey = 'MARGIN_MANAGER_1';
	const proposalId = '0x...';
	tx.add(this.poolProxyContract.vote(managerKey, proposalId));
};

// Example: Claim trading rebates
claimTradingRebate = (tx: Transaction) => {
	const managerKey = 'MARGIN_MANAGER_1';
	tx.add(this.poolProxyContract.claimRebate(managerKey));
};

```

--------------------------------

### Get Indexer Status API Endpoint

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Checks the health status of the indexer, including checkpoint lag information for each pipeline. Optional parameters can be used to set thresholds for determining healthy status.

```http
/status?max_checkpoint_lag=<INTEGER>&max_time_lag_seconds=<INTEGER>
```

--------------------------------

### Get Balance Manager IDs (Admin)

Source: https://docs.sui.io/standards/deepbook/v3-sdk/pools

Use `getBalanceManagerIds` to retrieve all balance manager IDs associated with a specific owner. It requires the owner's address and returns an array of IDs.

```javascript
async getBalanceManagerIds(owner: string): Promise<Array<string>>
```

--------------------------------

### Get Maintainer Fees Withdrawn Events

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves events related to the withdrawal of maintainer fees. It requires a `margin_pool_id` as a query parameter and returns a JSON array of event objects.

```http
/maintainer_fees_withdrawn?margin_pool_id=<ID>
```

--------------------------------

### Manage Balance Manager Referrals with Sui DeepBook SDK

Source: https://docs.sui.io/standards/deepbook/v3-sdk

Details functions for associating referrals with balance managers in the Sui DeepBook SDK. This includes generating trade caps, setting and unsetting referrals for specific pools, and querying referral IDs, owners, and pool associations.

```typescript
// Generate a trade cap first (needed for setting referrals)
const tradeCap = tx.add(client.deepbook.balanceManager.mintTradeCap('MANAGER_1'));

// Set a referral for a balance manager (pool-specific)
// Each balance manager can have different referrals for different pools
client.deepbook.balanceManager.setBalanceManagerReferral('MANAGER_1', referralId, tradeCap)(tx);

// Unset the referral for a specific pool
client.deepbook.balanceManager.unsetBalanceManagerReferral('MANAGER_1', 'SUI_DBUSDC', tradeCap)(tx);

// Get the referral ID associated with a balance manager for a specific pool
client.deepbook.balanceManager.getBalanceManagerReferralId('MANAGER_1', 'SUI_DBUSDC')(tx);

// Get the owner of a referral
client.deepbook.balanceManager.balanceManagerReferralOwner(referralId)(tx);

// Get the pool ID associated with a referral
client.deepbook.balanceManager.balanceManagerReferralPoolId(referralId)(tx);

```

--------------------------------

### Risk Management and Referrals

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/margin-manager

Functions for liquidating undercollateralized accounts and managing referrals.

```APIDOC
## Risk Management and Referrals

### `liquidate`

**Description**: Use `liquidate` to liquidate an undercollateralized margin manager. The call returns a function that takes a `Transaction` object.

**Method**: POST (assumed, as it modifies state)

**Endpoint**: N/A (SDK function)

**Parameters**

#### Path Parameters

None

#### Query Parameters

None

#### Request Body

- **managerAddress** (string) - Required - String representing the address of the margin manager to liquidate.
- **poolKey** (string) - Required - String that identifies the DeepBook pool.
- **debtIsBase** (boolean) - Required - Boolean indicating whether the debt is in the base asset.
- **repayCoin** (`TransactionArgument`) - Required - Represents the coin to use for repayment.

### `setMarginManagerReferral`

**Description**: Use `setMarginManagerReferral` to set a pool-specific referral for the margin manager. The referral must be a `DeepBookPoolReferral` minted for the pool associated with the margin manager. The call returns a function that takes a `Transaction` object.

**Method**: POST (assumed, as it modifies state)

**Endpoint**: N/A (SDK function)

**Parameters**

#### Path Parameters

None

#### Query Parameters

None

#### Request Body

- **managerKey** (string) - Required - String that identifies the margin manager.
- **referral** (string) - Required - String representing the referral ID.

### `unsetMarginManagerReferral`

**Description**: Use `unsetMarginManagerReferral` to remove the referral association from a margin manager for a specific pool. The call returns a function that takes a `Transaction` object.

**Method**: POST (assumed, as it modifies state)

**Endpoint**: N/A (SDK function)

**Parameters**

#### Path Parameters

None

#### Query Parameters

None

#### Request Body

- **managerKey** (string) - Required - String that identifies the margin manager.
- **poolKey** (string) - Required - String that identifies the DeepBook pool.

### Response (Liquidate/Set Referral/Unset Referral)

- **Function** (`Transaction`) - Returns a function that takes a `Transaction` object.
```

--------------------------------

### Retrieve Pool Trade Parameters

Source: https://docs.sui.io/standards/deepbook/v3-sdk/pools

Use `poolTradeParams` to get the trading parameters for a specific pool. It requires the pool key and returns an object containing taker fee, maker fee, and required stake.

```typescript
async poolTradeParams(poolKey: string): Promise<{ takerFee: number, makerFee: number, stakeRequired: number }>
```

--------------------------------

### Place Limit Order

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/orders

Places a limit order on the DeepBookV3. The quantity is specified in base asset terms. For the current version, `pay_with_deep` must be true, meaning the trading fee is paid with DEEP tokens. A `BalanceManager` call to generate a `TradeProof` is required before placing orders.

```APIDOC
## POST /orders/limit

### Description
Places a limit order on the DeepBookV3. Quantity is in base asset terms. Trading fees are paid with DEEP tokens.

### Method
POST

### Endpoint
/orders/limit

### Parameters
#### Query Parameters
- **pay_with_deep** (boolean) - Required - Must be true for the current version, indicating fees are paid with DEEP tokens.

#### Request Body
- **order_data** (object) - Required - Contains the details of the order to be placed.
  - **quantity** (number) - Required - The quantity of the base asset for the order.
  - **price** (number) - Required - The limit price for the order.
  - **order_options** (object) - Optional - Options for the order.
  - **self_matching_options** (object) - Optional - Options for self-matching.

### Request Example
```json
{
  "order_data": {
    "quantity": 100.5,
    "price": 1.25,
    "order_options": {
      "option1": true
    },
    "self_matching_options": {
      "optionA": false
    }
  }
}
```

### Response
#### Success Response (200)
- **order_info** (object) - Information about the placed order.
  - **order_id** (string) - The unique identifier for the order.
  - **status** (string) - The status of the order (e.g., 'placed', 'filled').
  - **filled_quantity** (number) - The quantity of the order that has been filled.

#### Response Example
```json
{
  "order_info": {
    "order_id": "0x123abc",
    "status": "placed",
    "filled_quantity": 0
  }
}
```
```

--------------------------------

### Margin Manager Creation

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/margin-manager

Functions for creating and sharing margin managers.

```APIDOC
## Margin Manager Creation

### `newMarginManager`

**Description**: Use `newMarginManager` to create and share a new margin manager in one transaction. The call returns a function that takes a `Transaction` object.

**Method**: POST (assumed, as it creates a resource)

**Endpoint**: N/A (SDK function)

**Parameters**

#### Path Parameters

None

#### Query Parameters

None

#### Request Body

- **poolKey** (string) - Required - String that identifies the DeepBook pool.

### `newMarginManagerWithInitializer`

**Description**: Use `newMarginManagerWithInitializer` to create a margin manager and return it with an initializer. You must call `shareMarginManager` afterward to share it. The call returns an object with `manager` and `initializer`.

**Method**: POST (assumed, as it creates a resource)

**Endpoint**: N/A (SDK function)

**Parameters**

#### Path Parameters

None

#### Query Parameters

None

#### Request Body

- **poolKey** (string) - Required - String that identifies the DeepBook pool.

### `shareMarginManager`

**Description**: Use `shareMarginManager` to share a margin manager created with `newMarginManagerWithInitializer`. The call returns a function that takes a `Transaction` object.

**Method**: POST (assumed, as it modifies state)

**Endpoint**: N/A (SDK function)

**Parameters**

#### Path Parameters

None

#### Query Parameters

None

#### Request Body

- **poolKey** (string) - Required - String that identifies the DeepBook pool.
- **manager** (`TransactionArgument`) - Required - Represents the margin manager.
- **initializer** (`TransactionArgument`) - Required - Represents the initializer.

### Request Example (newMarginManager)

```typescript
// Assuming 'tx' is a Transaction object and 'marginContract' is an instance of the SDK
const poolKey = 'SUI_DBUSDC';
tx.add(marginContract.newMarginManager(poolKey));
```

### Response (newMarginManager)

- **Function** (`Transaction`) - Returns a function that takes a `Transaction` object.
```

--------------------------------

### GET /historical_volume_by_balance_manager_id_with_interval/:pool_names/:balance_manager_id

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Retrieves historical trading volume by balance manager for a specific time range with intervals. The response is structured by time intervals, with each interval containing volume data for specified pools.

```APIDOC
## GET /historical_volume_by_balance_manager_id_with_interval/:pool_names/:balance_manager_id

### Description
Retrieves historical trading volume by balance manager for a specific time range with intervals. The response is structured by time intervals, with each interval containing volume data for specified pools.

### Method
GET

### Endpoint
`/historical_volume_by_balance_manager_id_with_interval/:pool_names/:balance_manager_id`

### Parameters
#### Path Parameters
- **pool_names** (string) - Required - Comma-separated list of pool names.
- **balance_manager_id** (string) - Required - The ID of the balance manager.

#### Query Parameters
- **start_time** (integer) - Required - Unix timestamp in seconds for the start of the time range.
- **end_time** (integer) - Required - Unix timestamp in seconds for the end of the time range.
- **interval** (integer) - Required - The interval in seconds for grouping the volume data.
- **volume_in_base** (boolean) - Optional - If true, returns volume in the base asset; otherwise, returns volume in the quote asset. Defaults to false.

### Request Example
```http
GET /historical_volume_by_balance_manager_id_with_interval/USDC_DEEP,SUI_USDC/0x344c2734b1d211bd15212bfb7847c66a3b18803f3f5ab00f5ff6f87b6fe6d27d?start_time=1731460703&end_time=1731692703&interval=86400&volume_in_base=true
```

### Response
#### Success Response (200)
- **[time_start, time_end]** (object) - An object where keys represent time intervals and values contain trading pair volumes.
  - **[pool_name]** (array) - An array containing two elements: [maker_volume, taker_volume].

#### Response Example
```json
{
	"[1731460703, 1731547103]": {
		"SUI_USDC": [
			505887400000000,
			2051300000000
		]
	},
	"[1731547103, 1731633503]": {
		"SUI_USDC": [
			336777500000000,
			470600000000
		]
	}
}
```
```

--------------------------------

### Add Conditional Order (Stop Loss) - TypeScript

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/tpsl

Adds a conditional order to the TPSL system. This example demonstrates setting up a stop loss order that triggers when the price falls below a specified threshold. It requires a Transaction object and defines parameters like margin manager key, conditional order ID, trigger price, and the pending order details.

```typescript
const setStopLoss = (tx: Transaction) => {
	const managerKey = 'MARGIN_MANAGER_1';
	traderClient.marginTPSL.addConditionalOrder({
		marginManagerKey: managerKey,
		conditionalOrderId: 1,
		triggerBelowPrice: true, // Trigger when price falls below
		triggerPrice: 2.0,
	
pendingOrder: {
		clientOrderId: 100,
		quantity: 50,
		isBid: false, // Sell order
		payWithDeep: true,
	},
	})(tx);
};
```

--------------------------------

### GET /pause_cap_updated

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves events indicating updates to pause capabilities. This endpoint allows you to track changes in the pause status of system components, including the specific pause capability ID and its new status.

```APIDOC
## GET /pause_cap_updated

### Description
Returns events for when pause capabilities are updated.

### Method
GET

### Endpoint
/pause_cap_updated?pause_cap_id=<ID>

### Parameters
#### Query Parameters
- **pause_cap_id** (string) - Required - The ID of the pause capability to filter events by.

### Response
#### Success Response (200)
- **event_digest** (string) - The unique digest of the event.
- **digest** (string) - The transaction digest associated with the event.
- **sender** (string) - The address of the account that initiated the event.
- **checkpoint** (integer) - The checkpoint number at which the event occurred.
- **checkpoint_timestamp_ms** (integer) - The timestamp (in milliseconds) of the checkpoint.
- **package** (string) - The package ID where the event originated.
- **pause_cap_id** (string) - The ID of the pause capability that was updated.
- **allowed** (boolean) - The new status of the pause capability (true if allowed, false if paused).
- **onchain_timestamp** (integer) - The timestamp (in milliseconds) when the event was recorded on-chain.

#### Response Example
```json
[
    {
        "event_digest": "0xabc123...",
        "digest": "0xdef456...",
        "sender": "0x1111...",
        "checkpoint": 12345678,
        "checkpoint_timestamp_ms": 1738000000000,
        "package": "0x2222...",
        "pause_cap_id": "0x1234...",
        "allowed": true,
        "onchain_timestamp": 1738000000000
    }
]
```
```

--------------------------------

### Get DeepBook Pool Registry Updated Events

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves events for updates to DeepBook pool registry entries. This endpoint uses `pool_id` to filter events and returns a JSON array of update records.

```http
/deepbook_pool_updated_registry?pool_id=<ID>
```

--------------------------------

### Place Market Order

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/orders

Places a market order on the DeepBookV3. This endpoint calls `place_limit_order` internally with `MAX_PRICE` for bids and `MIN_PRICE` for asks. Any unfilled quantity of the order will be automatically canceled by DeepBookV3.

```APIDOC
## POST /orders/market

### Description
Places a market order. Quantity is in base asset terms. Calls `place_limit_order` with a price of `MAX_PRICE` for bids and `MIN_PRICE` for asks. DeepBookV3 cancels the order for any quantity not filled.

### Method
POST

### Endpoint
/orders/market

### Parameters
#### Query Parameters
- **pay_with_deep** (boolean) - Required - Must be true for the current version, indicating fees are paid with DEEP tokens.

#### Request Body
- **order_data** (object) - Required - Contains the details of the order to be placed.
  - **quantity** (number) - Required - The quantity of the base asset for the order.
  - **order_options** (object) - Optional - Options for the order.
  - **self_matching_options** (object) - Optional - Options for self-matching.

### Request Example
```json
{
  "order_data": {
    "quantity": 50.0,
    "order_options": {
      "option1": true
    },
    "self_matching_options": {
      "optionA": false
    }
  }
}
```

### Response
#### Success Response (200)
- **order_info** (object) - Information about the placed order.
  - **order_id** (string) - The unique identifier for the order.
  - **status** (string) - The status of the order (e.g., 'placed', 'filled').
  - **filled_quantity** (number) - The quantity of the order that has been filled.

#### Response Example
```json
{
  "order_info": {
    "order_id": "0x456def",
    "status": "placed",
    "filled_quantity": 0
  }
}
```
```

--------------------------------

### Create Margin Pool Configuration

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/maintainer

Creates a margin pool configuration object. Returns a transaction object for further processing.

```APIDOC
## POST /maintainer/newMarginPoolConfig

### Description
Use `newMarginPoolConfig` to create a margin pool configuration object. The call returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/maintainer/newMarginPoolConfig

### Parameters
#### Query Parameters
- **coinKey** (String) - Required - Identifies the asset type.
- **marginPoolConfig** (MarginPoolConfigParams) - Required - Object containing pool settings:
  - **supplyCap** (Number) - Maximum supply allowed.
  - **maxUtilizationRate** (Number) - Maximum utilization (e.g., 0.8 for 80%).
  - **referralSpread** (Number) - Protocol spread percentage.
  - **minBorrow** (Number) - Minimum borrow amount.

### Request Example
```json
{
  "coinKey": "USDC",
  "marginPoolConfig": {
    "supplyCap": 1000000,
    "maxUtilizationRate": 0.8,
    "referralSpread": 0.01,
    "minBorrow": 10
  }
}
```

### Response
#### Success Response (200)
- **transaction** (Function) - A function that takes a `Transaction` object to finalize the configuration.

#### Response Example
```json
{
  "transaction": "<function_reference>"
}
```
```

--------------------------------

### Get OHLCV Candlestick Data API Endpoint

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Retrieves Open, High, Low, Close, and Volume (OHLCV) data for a specific pool in candlestick format. Supports various time intervals and date range filtering. The response contains an array of candle data.

```http
/ohclv/:pool_name?interval=<INTERVAL>&start_time=<UNIX_TIMESTAMP_SECONDS>&end_time=<UNIX_TIMESTAMP_SECONDS>&limit=<INTEGER>
```

--------------------------------

### GET /protocol_fees_withdrawn

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves events related to the withdrawal of protocol fees. This endpoint allows you to query historical data on when protocol fees were withdrawn, including details like sender, checkpoint, and associated margin pool.

```APIDOC
## GET /protocol_fees_withdrawn

### Description
Returns events for when protocol fees are withdrawn.

### Method
GET

### Endpoint
/protocol_fees_withdrawn?margin_pool_id=<ID>

### Parameters
#### Query Parameters
- **margin_pool_id** (string) - Required - The ID of the margin pool to filter events by.

### Response
#### Success Response (200)
- **event_digest** (string) - The unique digest of the event.
- **digest** (string) - The transaction digest associated with the event.
- **sender** (string) - The address of the account that initiated the event.
- **checkpoint** (integer) - The checkpoint number at which the event occurred.
- **checkpoint_timestamp_ms** (integer) - The timestamp (in milliseconds) of the checkpoint.
- **package** (string) - The package ID where the event originated.
- **margin_pool_id** (string) - The ID of the margin pool involved.
- **protocol_fees** (integer) - The amount of protocol fees withdrawn.
- **onchain_timestamp** (integer) - The timestamp (in milliseconds) when the event was recorded on-chain.

#### Response Example
```json
[
    {
        "event_digest": "0xabc123...",
        "digest": "0xdef456...",
        "sender": "0x1111...",
        "checkpoint": 12345678,
        "checkpoint_timestamp_ms": 1738000000000,
        "package": "0x2222...",
        "margin_pool_id": "0x1234...",
        "protocol_fees": 1000000,
        "onchain_timestamp": 1738000000000
    }
]
```
```

--------------------------------

### Create Margin Manager with DeepBook SDK

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/margin-manager

Demonstrates how to create a new margin manager using the `newMarginManager` function from the DeepBook SDK. This function requires a `poolKey` to identify the relevant DeepBook pool and returns a transaction object for adding to a transaction builder.

```typescript
/**
 * @description Create a new margin manager
 * @param {string} poolKey The key to identify the pool
 * @returns A function that takes a Transaction object
 */
newMarginManager = (poolKey: string) => (tx: Transaction) => {};

// Example usage
createMarginManager = (tx: Transaction) => {
	const poolKey = 'SUI_DBUSDC';
	tx.add(this.marginContract.newMarginManager(poolKey));
};
```

--------------------------------

### Get Order Updates Response Structure (JSON)

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Details the JSON response format for the order updates endpoint. Each order object includes its ID, associated balance manager ID, timestamps, quantities (original, remaining, filled), price, status, and type. The timestamp is provided in Unix milliseconds.

```json
[
    {
        "order_id": "string",
        "balance_manager_id": "string",
        "timestamp": integer,
        "original_quantity": integer,
        "remaining_quantity": integer,
        "filled_quantity": integer,
        "price": integer,
        "status": "string",
        "type": "string"
    }
]
```

--------------------------------

### Generate Trade Proofs for Order Placement

Source: https://docs.sui.io/standards/deepbook/v3-sdk/balance-manager

Generates a trade proof, which can be automatically derived from the owner or TradeCap, and then utilizes this proof to place a limit order on a specified trading pool. This function is crucial for executing trades within the Deepbook.

```typescript
placeOrderWithProof = (tx: Transaction) => {
	const managerKey = 'MANAGER_1';
	const poolKey = 'SUI_DBUSDC';

	// Generate proof automatically (uses owner or tradeCap method)
	const proof = tx.add(this.balanceManager.generateProof(managerKey));

	// Use the proof to place an order
	tx.add(
		this.deepBook.placeLimitOrder({
			poolKey: poolKey,
			balanceManagerKey: managerKey,
			clientOrderId: '12345',
			price: 2.5,
			quantity: 100,
			isBid: true,
			payWithDeep: true,
		}),
	);
};
```

--------------------------------

### Get Recent Trades Data (HTTP)

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Retrieves recent trade data for a specified trading pair. The response includes details such as trade ID, price, volume, and timestamps. The timestamp is in Unix milliseconds, and the trade type ('buy' or 'sell') is determined by the taker's direction. This endpoint is useful for historical analysis and real-time monitoring of trading activity.

```http
trades/SUI_USDC?limit=2&start_time=1738093405&end_time=1738096485&maker_balance_manager_id=0x344c2734b1d211bd15212bfb7847c66a3b18803f3f5ab00f5ff6f87b6fe6d27d&taker_balance_manager_id=0x47dcbbc8561fe3d52198336855f0983878152a12524749e054357ac2e3573d58
```

--------------------------------

### Retrieve Level 2 Order Book Ticks from Mid-Price

Source: https://docs.sui.io/standards/deepbook/v3-sdk/pools

Use `getLevel2TicksFromMid` to get level 2 order book ticks relative to the mid-price for a given pool. It takes the pool key and the number of ticks from the mid-price. Returns bid and ask prices and quantities.

```typescript
async getLevel2TicksFromMid(poolKey: string, ticks: number): Promise<{ bid_prices: Array<number>, bid_quantities: Array<number>, ask_prices: Array<number>, ask_quantities: Array<number> }>
```

--------------------------------

### Mint and Use Balance Manager Capabilities

Source: https://docs.sui.io/standards/deepbook/v3-sdk/balance-manager

Manages the minting and utilization of special capabilities like TradeCap, DepositCap, and WithdrawCap associated with a balance manager. These capabilities grant specific permissions for trading, depositing, and withdrawing assets.

```typescript
// Example: Mint a TradeCap and use it
 mintAndUseTradeCap = async (tx: Transaction) => {
	const managerKey = 'MANAGER_1';

	// Mint the TradeCap
	const tradeCap = tx.add(this.balanceManager.mintTradeCap(managerKey));

	// Transfer to a trader
	const traderAddress = '0x789...';
	tx.transferObjects([tradeCap], traderAddress);
};

// Example: Use DepositCap to deposit funds
depositWithCapability = (tx: Transaction) => {
	const managerKey = 'MANAGER_1';
	const coinKey = 'DBUSDC';
	const amount = 5000; // 5000 USDC

	tx.add(this.balanceManager.depositWithCap(managerKey, coinKey, amount));
};

// Example: Use WithdrawCap to withdraw funds
withdrawWithCapability = (tx: Transaction) => {
	const managerKey = 'MANAGER_1';
	const coinKey = 'SUI';
	const amount = 50; // 50 SUI

	const withdrawnCoin = tx.add(this.balanceManager.withdrawWithCap(managerKey, coinKey, amount));

	// Transfer the withdrawn coin
	tx.transferObjects([withdrawnCoin], '0xabc...');
};
```

--------------------------------

### Get Order Updates (HTTP)

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Retrieves a list of orders that have been recently placed or canceled within a specified pool. This endpoint requires the pool name and can be filtered by time range, limit, status, and balance manager ID. It's essential for tracking order lifecycle events.

```http
/order_updates/:pool_name?limit=<INTEGER>&start_time=<UNIX_TIMESTAMP_SECONDS>&end_time=<UNIX_TIMESTAMP_SECONDS>&status=<"Placed" or "Canceled">&balance_manager_id=<ID>
```

--------------------------------

### Get Pool ID by Assets

Source: https://docs.sui.io/standards/deepbook/v3-sdk/pools

Use `getPoolIdByAssets` to find the pool ID associated with a pair of asset types. It requires the base and quote asset types and returns the pool's address if found.

```javascript
async getPoolIdByAssets(baseType: string, quoteType: string): Promise<string>
```

--------------------------------

### GET /maintainer_fees_withdrawn

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves events related to the withdrawal of maintainer fees. This endpoint allows you to query historical data on when and how maintainer fees were withdrawn from the system, including details like sender, checkpoint, and associated margin pool.

```APIDOC
## GET /maintainer_fees_withdrawn

### Description
Returns events for when maintainer fees are withdrawn.

### Method
GET

### Endpoint
/maintainer_fees_withdrawn?margin_pool_id=<ID>

### Parameters
#### Query Parameters
- **margin_pool_id** (string) - Required - The ID of the margin pool to filter events by.

### Response
#### Success Response (200)
- **event_digest** (string) - The unique digest of the event.
- **digest** (string) - The transaction digest associated with the event.
- **sender** (string) - The address of the account that initiated the event.
- **checkpoint** (integer) - The checkpoint number at which the event occurred.
- **checkpoint_timestamp_ms** (integer) - The timestamp (in milliseconds) of the checkpoint.
- **package** (string) - The package ID where the event originated.
- **margin_pool_id** (string) - The ID of the margin pool involved.
- **margin_pool_cap_id** (string) - The ID of the margin pool capability.
- **maintainer_fees** (integer) - The amount of maintainer fees withdrawn.
- **onchain_timestamp** (integer) - The timestamp (in milliseconds) when the event was recorded on-chain.

#### Response Example
```json
[
    {
        "event_digest": "0xabc123...",
        "digest": "0xdef456...",
        "sender": "0x1111...",
        "checkpoint": 12345678,
        "checkpoint_timestamp_ms": 1738000000000,
        "package": "0x2222...",
        "margin_pool_id": "0x1234...",
        "margin_pool_cap_id": "0x5678...",
        "maintainer_fees": 1000000,
        "onchain_timestamp": 1738000000000
    }
]
```
```

--------------------------------

### Swap Exact Base for Quote with Manager

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/swaps

Performs a swap of an exact base asset quantity for a quote asset quantity using a BalanceManager. Assumes fees are paid in DEEP and the BalanceManager has sufficient DEEP for fees. Returns two Coin objects: BaseAsset and QuoteAsset.

```APIDOC
## POST /swap/exact_base_for_quote/manager

### Description
Swaps an exact amount of base asset for a quote asset using a `BalanceManager`. This function assumes that trading fees are paid in DEEP tokens and that the provided `BalanceManager` has sufficient DEEP for these fees. It returns two `Coin` objects: the `BaseAsset` and the `QuoteAsset`.

### Method
POST

### Endpoint
`/swap/exact_base_for_quote/manager`

### Parameters
#### Query Parameters
- **base_in** (Coin) - Required - The exact amount of base asset to swap.
- **quote_out_min** (Coin) - Required - The minimum amount of quote asset expected.
- **balance_manager** (BalanceManager) - Required - The BalanceManager to use for the swap.

#### Request Body
None

### Response
#### Success Response (200)
- **base_asset_returned** (Coin) - The `Coin` object for the returned base asset.
- **quote_asset_returned** (Coin) - The `Coin` object for the returned quote asset.

#### Response Example
```json
{
  "base_asset_returned": {
    "value": "1000000"
  },
  "quote_asset_returned": {
    "value": "500000"
  }
}
```
```

--------------------------------

### Cancel Single Order in DeepBook

Source: https://docs.sui.io/standards/deepbook/v3-sdk/orders

Provides an example of canceling a specific order within a DeepBook pool for a given balance manager. It requires the pool key, balance manager key, and the order ID to be canceled. The function returns a transaction object for submission.

```typescript
/**
 * @description Cancel an existing order
 * @param {string} poolKey The key to identify the pool
 * @param {string} balanceManagerKey The key to identify the BalanceManager
 * @param {number} orderId Order ID to cancel
 * @returns A function that takes a Transaction object
 */
cancelOrder = 
	(poolKey: string, balanceManagerKey: string, orderId: number) => (tx: Transaction) => {};

// Example usage in DeepBookMarketMaker class
// Cancel order 12345678 in SUI_DBUSDC pool
cancelOrder = (tx: Transaction) => {
	const poolKey = 'SUI_DBUSDC'; // Pool key, check constants.ts for more
	const managerKey = 'MANAGER_1'; // Balance manager key, initialized during client creation by user
	tx.add(this.deepBook.cancelOrder(poolKey, managerKey, 12345678));
};

```

--------------------------------

### Manage Pool Referrals with Sui DeepBook SDK

Source: https://docs.sui.io/standards/deepbook/v3-sdk

Provides functions for managing pool-specific referrals in the Sui DeepBook SDK. These include minting new referrals, updating multipliers, claiming rewards, and querying referral balances and multipliers. Referral multipliers have constraints (0.1 increments, max 2.0).

```typescript
// Mint a new referral for a specific pool
// multiplier determines the portion of fees allocated to the referrer
// Valid values: 0.1, 0.2, 0.3, ... up to 2.0
client.deepbook.mintReferral('SUI_DBUSDC', 0.1)(tx);

// Update the multiplier for an existing referral
client.deepbook.updatePoolReferralMultiplier('SUI_DBUSDC', referralId, 0.2)(tx);

// Claim accumulated referral rewards (returns base, quote, and DEEP coins)
const { baseRewards, quoteRewards, deepRewards } = tx.add(
	client.deepbook.claimPoolReferralRewards('SUI_DBUSDC', referralId)
);

// Get the current balances for a referral
client.deepbook.getPoolReferralBalances('SUI_DBUSDC', referralId)(tx);

// Get the multiplier for a referral
client.deepbook.poolReferralMultiplier('SUI_DBUSDC', referralId)(tx);

```

--------------------------------

### Swap Exact Base for Quote (Direct)

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/swaps

Performs a swap of an exact base asset quantity for a quote asset quantity without using a BalanceManager. The DEEP token quantity for fees can be overestimated and any unused amount will be returned. Returns three Coin objects: BaseAsset, QuoteAsset, and DEEP.

```APIDOC
## POST /swap/exact_base_for_quote

### Description
Swaps an exact amount of base asset for a quote asset. This function does not require a `BalanceManager`. The DEEP token amount for trading fees can be overestimated, and any unused portion will be returned. The function returns three `Coin` objects: the `BaseAsset`, the `QuoteAsset`, and the `DEEP` tokens.

### Method
POST

### Endpoint
`/swap/exact_base_for_quote`

### Parameters
#### Query Parameters
- **base_in** (Coin) - Required - The exact amount of base asset to swap.
- **quote_out_min** (Coin) - Required - The minimum amount of quote asset expected.
- **deep_in** (Coin) - Required - The amount of DEEP tokens to use for fees. Can be overestimated.

#### Request Body
None

### Response
#### Success Response (200)
- **base_asset_returned** (Coin) - The `Coin` object for the returned base asset.
- **quote_asset_returned** (Coin) - The `Coin` object for the returned quote asset.
- **deep_returned** (Coin) - The `Coin` object for the returned DEEP tokens (unused fees).

#### Response Example
```json
{
  "base_asset_returned": {
    "value": "1000000"
  },
  "quote_asset_returned": {
    "value": "500000"
  },
  "deep_returned": {
    "value": "10000"
  }
}
```
```

--------------------------------

### Get Recent Trades Response Structure (JSON)

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Defines the structure of the JSON response when retrieving recent trade data. Each trade object contains comprehensive details including event and trade digests, order IDs, balance manager IDs, price, volumes, timestamp, trade type, and fee information. The timestamp is in Unix milliseconds.

```json
[
    {
        "event_digest": "string",
        "digest": "string",
        "trade_id": "string",
        "maker_order_id": "string",
        "taker_order_id": "string",
        "maker_balance_manager_id": "string",
        "taker_balance_manager_id": "string",
        "price": float,
        "base_volume": float,
        "quote_volume": float,
        "timestamp": integer,
        "type": "string",
        "taker_is_bid": boolean,
        "taker_fee": float,
        "maker_fee": float,
        "taker_fee_is_deep": boolean,
        "maker_fee_is_deep": boolean
    }
]
```

--------------------------------

### Deposit Funds with Deposit Capability

Source: https://docs.sui.io/standards/deepbook/v3-sdk/balance-manager

Use `depositWithCap` to deposit funds into a balance manager using a `depositCap`. This function requires the manager key, coin key, and the amount to deposit. It returns a transaction object.

```typescript
depositWithCap = (tx: Transaction, managerKey: string, coinKey: string, amountToDeposit: number) => {
  tx.add(this.balanceManager.depositWithCap(managerKey, coinKey, amountToDeposit));
};
```

--------------------------------

### Register Balance Manager with Registry

Source: https://docs.sui.io/standards/deepbook/v3-sdk/balance-manager

Use `registerBalanceManager` to register a balance manager with the registry. This function requires the manager key and returns a transaction object.

```typescript
registerBalanceManager = (tx: Transaction, managerKey: string) => {
  tx.add(this.balanceManager.registerBalanceManager(managerKey));
};
```

--------------------------------

### Flash Loan Operations (Base Asset)

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/flash-loans

Endpoints for borrowing and returning flash loans in the base asset from a DeepBookV3 pool. These operations are atomic and require repayment within the same transaction.

```APIDOC
## Borrow Flash Loan Base

### Description
Borrow base assets from the `Pool`. The function returns a hot potato, forcing the borrower to return the assets within the same transaction.

### Method
POST

### Endpoint
`/pool/flash_loan/base`

### Parameters
#### Query Parameters
- **amount** (u64) - Required - The amount of base asset to borrow.

### Request Body
(Not applicable for this endpoint)

### Response
#### Success Response (200)
- **flash_loan_object** (object) - A 'hot potato' struct representing the borrowed base assets that must be returned.

#### Response Example
```json
{
  "flash_loan_object": {}
}
```

## Retrieve Flash Loan Base

### Description
Return the flash loaned base assets to the `Pool`. `FlashLoan` object is unwrapped only if the assets are returned, otherwise the transaction fails.

### Method
POST

### Endpoint
`/pool/flash_loan/base/return`

### Parameters
#### Query Parameters
- **flash_loan_object** (object) - Required - The 'hot potato' struct received from borrowing.

### Request Body
(Not applicable for this endpoint)

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the flash loan was successfully returned.

#### Response Example
```json
{
  "success": true
}
```
```

--------------------------------

### DeepBookV3 Indexer Public Endpoints

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Provides the base URLs for accessing the public DeepBookV3 Indexer service on both Mainnet and Testnet. These endpoints serve as the entry points for querying real-time trading and order book data from the DeepBookV3 protocol.

```HTTP
https://deepbook-indexer.mainnet.mystenlabs.com/
```

```HTTP
https://deepbook-indexer.testnet.mystenlabs.com/
```

--------------------------------

### Placing Limit Orders

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/orders

Functions to place limit orders, including standard limit orders and reduce-only limit orders, through a margin manager.

```APIDOC
## POST /orders/limit

### Description
Places a limit order through a margin manager. Returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/orders/limit

### Parameters
#### Request Body
- **poolKey** (String) - Required - Identifies the DeepBook pool.
- **marginManagerKey** (String) - Required - Identifies the margin manager.
- **clientOrderId** (String) - Required - Client-side order ID.
- **price** (Number) - Required - The order price.
- **quantity** (Number) - Required - The order quantity.
- **isBid** (Boolean) - Required - Indicates if this is a buy order.
- **expiration** (Number) - Optional - Order expiration timestamp.
- **orderType** (OrderType enum) - Optional - Type of order.
- **selfMatchingOption** (SelfMatchingOptions enum) - Optional - Option for self-matching.
- **payWithDeep** (Boolean) - Optional - Whether to pay fees with DEEP tokens.

### Response
#### Success Response (200)
- **transactionFunction** (Function) - A function that accepts a `Transaction` object to finalize the order.

## POST /orders/reduce-only/limit

### Description
Places a reduce-only limit order through a margin manager, which can only reduce an existing debt position. Returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/orders/reduce-only/limit

### Parameters
#### Request Body
- **poolKey** (String) - Required - Identifies the DeepBook pool.
- **marginManagerKey** (String) - Required - Identifies the margin manager.
- **clientOrderId** (String) - Required - Client-side order ID.
- **price** (Number) - Required - The order price.
- **quantity** (Number) - Required - The order quantity.
- **isBid** (Boolean) - Required - Indicates if this is a buy order.
- **expiration** (Number) - Optional - Order expiration timestamp.
- **orderType** (OrderType enum) - Optional - Type of order.
- **selfMatchingOption** (SelfMatchingOptions enum) - Optional - Option for self-matching.
- **payWithDeep** (Boolean) - Optional - Whether to pay fees with DEEP tokens.

### Response
#### Success Response (200)
- **transactionFunction** (Function) - A function that accepts a `Transaction` object to finalize the order.
```

--------------------------------

### Query Pool State Metrics (TypeScript)

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/margin-pool

This TypeScript function demonstrates how to query key metrics from a margin pool contract. It retrieves the total supply, total borrow, current interest rate, and a user's specific supply shares and amounts for a given coin key. Dependencies include the Transaction object and the marginPoolContract instance.

```typescript
checkPoolMetrics = async (tx: Transaction) => {
	const coinKey = 'USDC';

	// Get total supply and borrow
	const totalSupply = tx.add(this.marginPoolContract.totalSupply(coinKey));
	const totalBorrow = tx.add(this.marginPoolContract.totalBorrow(coinKey));

	// Get current interest rate
	const interestRate = tx.add(this.marginPoolContract.interestRate(coinKey));

	// Query user position
	const supplierCapId = '0x...';
	const userShares = tx.add(this.marginPoolContract.userSupplyShares(coinKey, supplierCapId));
	const userAmount = tx.add(this.marginPoolContract.userSupplyAmount(coinKey, supplierCapId));
};
```

--------------------------------

### Registry Functions

Source: https://docs.sui.io/standards/deepbook/v3-sdk/balance-manager

Functions for interacting with the balance manager registry.

```APIDOC
## registerBalanceManager

### Description
Use `registerBalanceManager` to register a balance manager with the registry. The call returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/websites/sui_io_standards_deepbook/registry

### Parameters
#### Query Parameters
- **managerKey** (String) - Required - String that identifies the balance manager.

### Request Example
```json
{
  "managerKey": "string"
}
```

### Response
#### Success Response (200)
- **transactionArgument** (Object) - A transaction argument representing the registration operation.

#### Response Example
```json
{
  "transactionArgument": {}
}
```
```

--------------------------------

### Placing Market Orders

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/orders

Functions to place market orders, including standard market orders and reduce-only market orders, through a margin manager.

```APIDOC
## POST /orders/market

### Description
Places a market order through a margin manager. Returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/orders/market

### Parameters
#### Request Body
- **poolKey** (String) - Required - Identifies the DeepBook pool.
- **marginManagerKey** (String) - Required - Identifies the margin manager.
- **clientOrderId** (String) - Required - Client-side order ID.
- **quantity** (Number) - Required - The order quantity.
- **isBid** (Boolean) - Required - Indicates if this is a buy order.
- **orderType** (OrderType enum) - Optional - Type of order.
- **selfMatchingOption** (SelfMatchingOptions enum) - Optional - Option for self-matching.
- **payWithDeep** (Boolean) - Optional - Whether to pay fees with DEEP tokens.

### Response
#### Success Response (200)
- **transactionFunction** (Function) - A function that accepts a `Transaction` object to finalize the order.

## POST /orders/reduce-only/market

### Description
Places a reduce-only market order through a margin manager, which can only reduce an existing debt position. Returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/orders/reduce-only/market

### Parameters
#### Request Body
- **poolKey** (String) - Required - Identifies the DeepBook pool.
- **marginManagerKey** (String) - Required - Identifies the margin manager.
- **clientOrderId** (String) - Required - Client-side order ID.
- **quantity** (Number) - Required - The order quantity.
- **isBid** (Boolean) - Required - Indicates if this is a buy order.
- **orderType** (OrderType enum) - Optional - Type of order.
- **selfMatchingOption** (SelfMatchingOptions enum) - Optional - Option for self-matching.
- **payWithDeep** (Boolean) - Optional - Whether to pay fees with DEEP tokens.

### Response
#### Success Response (200)
- **transactionFunction** (Function) - A function that accepts a `Transaction` object to finalize the order.
```

--------------------------------

### Swap Exact Quote for Base with Manager

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/swaps

Performs a swap of an exact quote asset quantity for a base asset quantity using a BalanceManager. Assumes fees are paid in DEEP and the BalanceManager has sufficient DEEP for fees. Returns two Coin objects: BaseAsset and QuoteAsset.

```APIDOC
## POST /swap/exact_quote_for_base/manager

### Description
Swaps an exact amount of quote asset for a base asset using a `BalanceManager`. This function assumes that trading fees are paid in DEEP tokens and that the provided `BalanceManager` has sufficient DEEP for these fees. It returns two `Coin` objects: the `BaseAsset` and the `QuoteAsset`.

### Method
POST

### Endpoint
`/swap/exact_quote_for_base/manager`

### Parameters
#### Query Parameters
- **quote_in** (Coin) - Required - The exact amount of quote asset to swap.
- **base_out_min** (Coin) - Required - The minimum amount of base asset expected.
- **balance_manager** (BalanceManager) - Required - The BalanceManager to use for the swap.

#### Request Body
None

### Response
#### Success Response (200)
- **base_asset_returned** (Coin) - The `Coin` object for the returned base asset.
- **quote_asset_returned** (Coin) - The `Coin` object for the returned quote asset.

#### Response Example
```json
{
  "base_asset_returned": {
    "value": "500000"
  },
  "quote_asset_returned": {
    "value": "1000000"
  }
}
```
```

--------------------------------

### Mint a referral

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/referral

Mint a new DeepBookPoolReferral object for a specific pool with a specified multiplier. The multiplier determines the portion of trading fees allocated to the referrer. Returns the ID of the created referral.

```APIDOC
## Mint a referral

### Description
Mint a new `DeepBookPoolReferral` object for a specific pool with a specified multiplier. The multiplier determines the portion of trading fees allocated to the referrer. The multiplier must be a multiple of 0.1 (e.g., 0.1, 0.2, 0.3, ...) and cannot exceed 2.0. Returns the ID of the created referral.

### Method
POST

### Endpoint
/referrals

### Parameters
#### Query Parameters
- **pool_id** (ID) - Required - The ID of the pool for which the referral is being minted.
- **multiplier** (f64) - Required - The referral multiplier, must be a multiple of 0.1 and not exceed 2.0.

### Request Example
```json
{
  "pool_id": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  "multiplier": 0.5
}
```

### Response
#### Success Response (200)
- **referral_id** (ID) - The ID of the newly created referral.

#### Response Example
```json
{
  "referral_id": "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321"
}
```
```

--------------------------------

### Swap Exact Quantity (Direct)

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/swaps

The underlying function for direct swaps. Users can call this directly for base → quote or quote → base swaps as long as one of the input asset quantities is zero. Assumes fees are paid in DEEP.

```APIDOC
## POST /swap/exact_quantity

### Description
This is the core function for direct swaps, handling both base-to-quote and quote-to-base exchanges. It requires that either the base input or the quote input is zero. Trading fees are paid in DEEP tokens.

### Method
POST

### Endpoint
`/swap/exact_quantity`

### Parameters
#### Query Parameters
- **base_in** (Coin) - Optional - The amount of base asset to swap. Must be zero if swapping quote for base.
- **quote_in** (Coin) - Optional - The amount of quote asset to swap. Must be zero if swapping base for quote.
- **base_out_min** (Coin) - Required - The minimum amount of base asset expected.
- **quote_out_min** (Coin) - Required - The minimum amount of quote asset expected.
- **deep_in** (Coin) - Required - The amount of DEEP tokens to use for fees. Can be overestimated.

#### Request Body
None

### Response
#### Success Response (200)
- **base_asset_returned** (Coin) - The `Coin` object for the returned base asset.
- **quote_asset_returned** (Coin) - The `Coin` object for the returned quote asset.
- **deep_returned** (Coin) - The `Coin` object for the returned DEEP tokens (unused fees).

#### Response Example
```json
{
  "base_asset_returned": {
    "value": "500000"
  },
  "quote_asset_returned": {
    "value": "1000000"
  },
  "deep_returned": {
    "value": "10000"
  }
}
```
```

--------------------------------

### Supply Liquidity with Referral (TypeScript)

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/margin-pool

Supplies assets to a margin pool while specifying a referral ID to enable fee sharing with a referrer. This function returns a transaction builder that accepts a Transaction object.

```typescript
// Example: Supply 1000 USDC with a referral
supplyWithReferral = (tx: Transaction) => {
	const coinKey = 'USDC';
	const supplierCapId = '0x...';
	const supplierCap = tx.object(supplierCapId);
	const referralId = '0x...'; // Referral object ID

	tx.add(
		this.marginPoolContract.supplyToMarginPool(
			coinKey,
			supplierCap,
			1000,
			referralId, // Referral will earn fees
		)
	);
};
```

--------------------------------

### Swap Exact Quote for Base (Direct)

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/swaps

Performs a swap of an exact quote asset quantity for a base asset quantity without using a BalanceManager. The DEEP token quantity for fees can be overestimated and any unused amount will be returned. Returns three Coin objects: BaseAsset, QuoteAsset, and DEEP.

```APIDOC
## POST /swap/exact_quote_for_base

### Description
Swaps an exact amount of quote asset for a base asset. This function does not require a `BalanceManager`. The DEEP token amount for trading fees can be overestimated, and any unused portion will be returned. The function returns three `Coin` objects: the `BaseAsset`, the `QuoteAsset`, and the `DEEP` tokens.

### Method
POST

### Endpoint
`/swap/exact_quote_for_base`

### Parameters
#### Query Parameters
- **quote_in** (Coin) - Required - The exact amount of quote asset to swap.
- **base_out_min** (Coin) - Required - The minimum amount of base asset expected.
- **deep_in** (Coin) - Required - The amount of DEEP tokens to use for fees. Can be overestimated.

#### Request Body
None

### Response
#### Success Response (200)
- **base_asset_returned** (Coin) - The `Coin` object for the returned base asset.
- **quote_asset_returned** (Coin) - The `Coin` object for the returned quote asset.
- **deep_returned** (Coin) - The `Coin` object for the returned DEEP tokens (unused fees).

#### Response Example
```json
{
  "base_asset_returned": {
    "value": "500000"
  },
  "quote_asset_returned": {
    "value": "1000000"
  },
  "deep_returned": {
    "value": "10000"
  }
}
```
```

--------------------------------

### Asset Management

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/margin-manager

Functions for depositing, withdrawing, borrowing, and repaying assets in margin accounts.

```APIDOC
## Asset Management

### `depositBase`, `depositQuote`, `depositDeep`

**Description**: Use these functions to deposit assets into a margin manager. The call returns a function that takes a `Transaction` object.

**Method**: POST (assumed, as it modifies state)

**Endpoint**: N/A (SDK function)

**Parameters**

#### Path Parameters

None

#### Query Parameters

None

#### Request Body

- **managerKey** (string) - Required - String that identifies the margin manager.
- **amount** (number) - Required - Number representing the amount to deposit.

### `withdrawBase`, `withdrawQuote`, `withdrawDeep`

**Description**: Use these functions to withdraw assets from a margin manager. Withdrawals are subject to risk ratio limits. The call returns a function that takes a `Transaction` object.

**Method**: POST (assumed, as it modifies state)

**Endpoint**: N/A (SDK function)

**Parameters**

#### Path Parameters

None

#### Query Parameters

None

#### Request Body

- **managerKey** (string) - Required - String that identifies the margin manager.
- **amount** (number) - Required - Number representing the amount to withdraw.

### `borrowBase`, `borrowQuote`

**Description**: Use these functions to borrow assets from margin pools. Borrowing is subject to risk ratio limits. The call returns a function that takes a `Transaction` object.

**Method**: POST (assumed, as it modifies state)

**Endpoint**: N/A (SDK function)

**Parameters**

#### Path Parameters

None

#### Query Parameters

None

#### Request Body

- **managerKey** (string) - Required - String that identifies the margin manager.
- **amount** (number) - Required - Number representing the amount to borrow.

### `repayBase`, `repayQuote`

**Description**: Use these functions to repay borrowed assets. If no amount is specified, it repays the maximum available balance up to the total debt. The call returns a function that takes a `Transaction` object.

**Method**: POST (assumed, as it modifies state)

**Endpoint**: N/A (SDK function)

**Parameters**

#### Path Parameters

None

#### Query Parameters

None

#### Request Body

- **managerKey** (string) - Required - String that identifies the margin manager.
- **amount** (number) - Optional - Number representing the amount to repay.

### Response (Deposit/Withdraw/Borrow/Repay)

- **Function** (`Transaction`) - Returns a function that takes a `Transaction` object.
```

--------------------------------

### Place Market Order in DeepBook

Source: https://docs.sui.io/standards/deepbook/v3-sdk/orders

Demonstrates how to place a market order on DeepBook. It requires pool and balance manager keys, a client order ID, quantity, and bid/ask direction. The `payWithDeep` option can be specified. This function is part of the DeepBookMarketMaker class.

```typescript
interface PlaceMarketOrderParams {
	poolKey: string;
	balanceManagerKey: string;
	clientOrderId: string;
	quantity: number;
	isBid: boolean;
	selfMatchingOption?: SelfMatchingOptions;
	payWithDeep?: boolean;
}

// Example usage in DeepBookMarketMaker class
// Place a market sell of 10 SUI in the SUI_DBUSDC pool
customPlaceMarketOrder = (tx: Transaction) => {
	const poolKey = 'SUI_DBUSDC'; // Pool key, check constants.ts for more
	const managerKey = 'MANAGER_1'; // Balance manager key, initialized during client creation by user
	tx.add(
		this.deepBook.placeMarketOrder({
			poolKey: poolKey,
			balanceManagerKey: managerKey,
			clientOrderId: '2',
			quantity: 10,
			isBid: true,
			payWithDeep: true,
		}),
	);
};

```

--------------------------------

### Create Balance Manager with Custom Owner

Source: https://docs.sui.io/standards/deepbook/v3-sdk/balance-manager

Creates a new balance manager associated with a specific owner address and shares it for further operations. This function initializes the balance manager and makes it accessible for subsequent transactions.

```typescript
createManagerWithOwner = (tx: Transaction) => {
	const ownerAddress = '0x123...';

	// Create the manager with custom owner
	const manager = tx.add(this.balanceManager.createBalanceManagerWithOwner(ownerAddress));

	// Share the manager
	tx.add(this.balanceManager.shareBalanceManager(manager));
};
```

--------------------------------

### Flash Loan Operations (Quote Asset)

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/flash-loans

Endpoints for borrowing and returning flash loans in the quote asset from a DeepBookV3 pool. These operations are atomic and require repayment within the same transaction.

```APIDOC
## Borrow Flash Loan Quote

### Description
Borrow quote assets from the `Pool`. The function returns a hot potato, forcing the borrower to return the assets within the same transaction.

### Method
POST

### Endpoint
`/pool/flash_loan/quote`

### Parameters
#### Query Parameters
- **amount** (u64) - Required - The amount of quote asset to borrow.

### Request Body
(Not applicable for this endpoint)

### Response
#### Success Response (200)
- **flash_loan_object** (object) - A 'hot potato' struct representing the borrowed quote assets that must be returned.

#### Response Example
```json
{
  "flash_loan_object": {}
}
```

## Retrieve Flash Loan Quote

### Description
Return the flash loaned quote assets to the `Pool`. `FlashLoan` object is unwrapped only if the assets are returned, otherwise the transaction fails.

### Method
POST

### Endpoint
`/pool/flash_loan/quote/return`

### Parameters
#### Query Parameters
- **flash_loan_object** (object) - Required - The 'hot potato' struct received from borrowing.

### Request Body
(Not applicable for this endpoint)

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the flash loan was successfully returned.

#### Response Example
```json
{
  "success": true
}
```
```

--------------------------------

### swapExactQuantityWithManager

Source: https://docs.sui.io/standards/deepbook/v3-sdk/swaps

Swaps an exact quantity using a balance manager. Returns a function that takes a Transaction object.

```APIDOC
## POST /swapExactQuantityWithManager

### Description
Swaps an exact quantity of an asset using a balance manager. This function is part of the DeepBookV3 SDK and is designed to be used within a transaction.

### Method
POST

### Endpoint
/swapExactQuantityWithManager

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **params** (SwapWithManagerParams & { isBaseToCoin: boolean }) - Required - An object containing the parameters for the swap operation.
  - **poolKey** (string) - Required - Identifier for the trading pool.
  - **balanceManagerKey** (string) - Required - Identifier for the balance manager.
  - **amount** (number) - Required - The amount to swap.
  - **minOut** (number) - Required - The minimum output amount expected.
  - **isBaseToCoin** (boolean) - Required - Indicates the swap direction. `true` for base to quote, `false` for quote to base.
  - **tradeCap** (TransactionArgument) - Optional - The transaction argument for trade capability.
  - **depositCap** (TransactionArgument) - Optional - The transaction argument for deposit capability.
  - **withdrawCap** (TransactionArgument) - Optional - The transaction argument for withdraw capability.
  - **baseCoin** (TransactionArgument) - Optional - The transaction argument for the base coin input.
  - **quoteCoin** (TransactionArgument) - Optional - The transaction argument for the quote coin input.

### Request Example
```json
{
  "poolKey": "SUI_DBUSDC",
  "balanceManagerKey": "manager123",
  "amount": 50,
  "minOut": 5,
  "isBaseToCoin": false,
  "tradeCap": "tradeCapArg",
  "depositCap": "depositCapArg"
}
```

### Response
#### Success Response (200)
- **TransactionArgument[]** - An array of transaction arguments representing the output coins from the swap (base, quote, and deep).

#### Response Example
```json
[
  "baseOut",
  "quoteOut",
  "deepOut"
]
```
```

--------------------------------

### Create Pool

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/permissionless-pool

Creates a new permissionless liquidity pool for a given asset pair. This function requires specific calculations for tick size, lot size, and minimum size based on asset decimals and desired price precision. A creation fee in DEEP tokens is also required.

```APIDOC
## POST /create_permissionless_pool

### Description
Creates a new permissionless liquidity pool for a given asset pair. This function requires specific calculations for tick size, lot size, and minimum size based on asset decimals and desired price precision. A creation fee in DEEP tokens is also required.

### Method
POST

### Endpoint
/create_permissionless_pool

### Parameters
#### Query Parameters
- **base_decimals** (number) - Required - The number of decimals for the base asset.
- **quote_decimals** (number) - Required - The number of decimals for the quote asset.
- **tick_size** (number) - Required - The tick size for the pool, calculated as 10^(9 - base_decimals + quote_decimals - decimal_desired).
- **lot_size** (number) - Required - The lot size in MIST of the base asset, must be a power of 10 and >= 1000.
- **min_size** (number) - Required - The minimum size in MIST of the base asset, must be a power of 10 and >= lot size.

#### Request Body
This endpoint does not require a request body.

### Response
#### Success Response (200)
- **pool_id** (string) - The unique identifier of the created pool.

#### Response Example
```json
{
  "pool_id": "0x123abc..."
}
```
```

--------------------------------

### Enable DeepBook Pool for Borrowing

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/maintainer

Enables a specific DeepBook pool to borrow assets from a margin pool. This function links a DeepBook pool identifier with a margin pool's capacity ID, allowing for leveraged trading. It requires the DeepBook pool key, the asset's coin key, and the margin pool's capacity ID.

```typescript
enablePoolForBorrowing = (tx: Transaction) => {
	const deepbookPoolKey = 'SUI_DBUSDC';
	const coinKey = 'USDC';
	const marginPoolCapId = '0x...'; // Margin pool cap ID

	tx.add(
		this.maintainerContract.enableDeepbookPoolForLoan(deepbookPoolKey, coinKey, marginPoolCapId),
	);
};
```

--------------------------------

### Swap Exact Quantity with Balance Manager

Source: https://docs.sui.io/standards/deepbook/v3-sdk/swaps

Executes a swap of an exact quantity using a balance manager. This function returns a transaction-ready function and requires parameters such as pool key, balance manager key, amount, minimum output, direction, and optional transaction arguments for capabilities and coins.

```typescript
swapExactQuantityWithManager = (tx: Transaction) => {
  // ... implementation details ...
};
```

--------------------------------

### Manage Margin Manager Referrals (TypeScript)

Source: https://docs.sui.io/standards/deepbook/-margin-sdk

Demonstrates how to set and unset referrals for margin managers using the DeepBook SDK. Referrals are pool-specific and must be minted using the core DeepBook SDK before being associated with a margin manager. This function is crucial for referral programs within the DeepBook ecosystem.

```typescript
// Set a referral for a margin manager (pool-specific)
// The referral must be a DeepBookPoolReferral minted for the pool the margin manager is associated with
traderClient.client.deepbook.marginManager.setMarginManagerReferral(
	'MARGIN_MANAGER_1',
	referralId,
)(tx);

// Unset the referral for a margin manager for a specific pool
traderClient.client.deepbook.marginManager.unsetMarginManagerReferral(
	'MARGIN_MANAGER_1',
	'SUI_DBUSDC',
)(tx);

```

--------------------------------

### Swap Exact Base for Quote using DeepBookV3 SDK

Source: https://docs.sui.io/standards/deepbook/v3-sdk/swaps

Performs a swap of an exact base amount for a quote amount using the DeepBookV3 SDK. It takes SwapParams and returns a function that accepts a Transaction object. Dependencies include the DeepBookV3 SDK and a Transaction object.

```tsx
swapExactBaseForQuote({ params: SwapParams });
```

```typescript
swapExactBaseForQuote = (tx: Transaction) => {
  const [baseOut, quoteOut, deepOut] = this.deepBook.swapExactBaseForQuote({
    poolKey: 'SUI_DBUSDC',
    amount: 1, // amount of SUI to swap
    deepAmount: 1, // amount of DEEP to pay as fees, excess is returned
    minOut: 0.1, // minimum amount of DBUSDC to receive or transaction fails
  })(tx);

  // Transfer received coins to own address
  tx.transferObjects([baseOut, quoteOut, deepOut], this.getActiveAddress());
};
```

--------------------------------

### Return Base Asset with DeepBookV3 SDK

Source: https://docs.sui.io/standards/deepbook/v3-sdk/flash-loans

The `returnBaseAsset` function facilitates returning a borrowed base asset to its corresponding pool. It requires the pool key, the amount to return, the coin object representing the base asset, and the flash loan object. This function is crucial for settling flash loans.

```typescript
returnBaseAsset(
  {
    poolKey: string,
    borrowAmount: number,
    baseCoinInput: TransactionObjectArgument,
    flashLoan: TransactionObjectArgument,
  }
)
```

--------------------------------

### Mint Deposit Capability for Balance Manager

Source: https://docs.sui.io/standards/deepbook/v3-sdk/balance-manager

Use `mintDepositCap` to mint a `depositCap` for the balance manager. This capability is required for depositing funds. The function returns a transaction object that can be added to a transaction.

```typescript
mintDepositCap = (tx: Transaction, managerKey: string) => {
  tx.add(this.balanceManager.mintDepositCap(managerKey));
};
```

--------------------------------

### swapExactBaseForQuote

Source: https://docs.sui.io/standards/deepbook/v3-sdk/swaps

Swaps an exact amount of the base asset for the quote asset. Returns a function that takes a Transaction object.

```APIDOC
## POST /swapExactBaseForQuote

### Description
Swaps an exact amount of the base asset for the quote asset. This function is part of the DeepBookV3 SDK and is designed to be used within a transaction.

### Method
POST

### Endpoint
/swapExactBaseForQuote

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **params** (SwapParams) - Required - An object containing the parameters for the swap operation.
  - **poolKey** (string) - Required - Identifier for the trading pool.
  - **amount** (number) - Required - The exact amount of the base asset to swap.
  - **deepAmount** (number) - Required - The amount of DEEP to pay as fees. Any excess will be returned.
  - **minOut** (number) - Required - The minimum acceptable amount of the quote asset to receive. If less is received, the transaction will fail.

### Request Example
```json
{
  "poolKey": "SUI_DBUSDC",
  "amount": 1,
  "deepAmount": 1,
  "minOut": 0.1
}
```

### Response
#### Success Response (200)
- **TransactionArgument** - An object representing the transaction argument for the swap operation. This typically includes the base asset output, quote asset output, and DEEP fee output.

#### Response Example
```json
[
  "baseOut",
  "quoteOut",
  "deepOut"
]
```
```

--------------------------------

### Staking and Governance API

Source: https://docs.sui.io/standards/deepbook/-margin/contract-information/orders

Manage staking of DEEP tokens and participate in governance through the margin manager.

```APIDOC
## POST /pool_proxy/staking

### Description
Stake DEEP tokens through the margin manager. Note that margin managers for pools with DEEP as base or quote asset cannot stake.

### Method
POST

### Endpoint
/pool_proxy/staking

### Parameters
#### Request Body
- **amount** (number) - Required - The amount of DEEP tokens to stake

### Request Example
```json
{
  "amount": 1000
}
```

### Response
#### Success Response (200)
- **message** (string) - Confirmation message of the staking operation

#### Response Example
```json
{
  "message": "DEEP tokens staked successfully."
}
```

## POST /pool_proxy/governance/proposals

### Description
Submit proposals for governance decisions through the margin manager.

### Method
POST

### Endpoint
/pool_proxy/governance/proposals

### Parameters
#### Request Body
- **proposal_details** (object) - Required - Details of the governance proposal

### Request Example
```json
{
  "proposal_details": {
    "title": "New Feature Request",
    "description": "Add support for X asset."
  }
}
```

### Response
#### Success Response (200)
- **proposal_id** (string) - The unique identifier for the submitted proposal

#### Response Example
```json
{
  "proposal_id": "gov_prop_123"
}
```

## POST /pool_proxy/governance/vote

### Description
Vote on governance decisions through the margin manager.

### Method
POST

### Endpoint
/pool_proxy/governance/vote

### Parameters
#### Request Body
- **proposal_id** (string) - Required - The ID of the proposal to vote on
- **vote_choice** (string) - Required - The choice of vote ('yes' or 'no')

### Request Example
```json
{
  "proposal_id": "gov_prop_123",
  "vote_choice": "yes"
}
```

### Response
#### Success Response (200)
- **message** (string) - Confirmation message of the vote

#### Response Example
```json
{
  "message": "Vote submitted successfully."
}
```
```

--------------------------------

### swapExactQuoteForBase

Source: https://docs.sui.io/standards/deepbook/v3-sdk/swaps

Swaps an exact amount of the quote asset for the base asset. Returns a function that takes a Transaction object.

```APIDOC
## POST /swapExactQuoteForBase

### Description
Swaps an exact amount of the quote asset for the base asset. This function is part of the DeepBookV3 SDK and is designed to be used within a transaction.

### Method
POST

### Endpoint
/swapExactQuoteForBase

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **params** (SwapParams) - Required - An object containing the parameters for the swap operation.
  - **poolKey** (string) - Required - Identifier for the trading pool.
  - **amount** (number) - Required - The exact amount of the quote asset to swap.
  - **deepAmount** (number) - Required - The amount of DEEP to pay as fees. Any excess will be returned.
  - **minOut** (number) - Required - The minimum acceptable amount of the base asset to receive. If less is received, the transaction will fail.

### Request Example
```json
{
  "poolKey": "SUI_DBUSDC",
  "amount": 1,
  "deepAmount": 1,
  "minOut": 0.1
}
```

### Response
#### Success Response (200)
- **TransactionArgument** - An object representing the transaction argument for the swap operation. This typically includes the base asset output, quote asset output, and DEEP fee output.

#### Response Example
```json
[
  "baseOut",
  "quoteOut",
  "deepOut"
]
```
```

--------------------------------

### Swap Exact Quote for Base using DeepBookV3 SDK

Source: https://docs.sui.io/standards/deepbook/v3-sdk/swaps

Performs a swap of an exact quote amount for a base amount using the DeepBookV3 SDK. It accepts SwapParams and returns a function that takes a Transaction object. Requires the DeepBookV3 SDK and a Transaction object.

```tsx
swapExactQuoteForBase({ params: SwapParams });
```

```typescript
swapExactQuoteForBase = (tx: Transaction) => {
  const [baseOut, quoteOut, deepOut] = this.deepBook.swapExactQuoteForBase({
    poolKey: 'SUI_DBUSDC',
    amount: 1, // amount of DBUSDC to swap
    deepAmount: 1, // amount of DEEP to pay as fees, excess is returned
    minOut: 0.1, // minimum amount of SUI to receive or transaction fails
  })(tx);

  // Transfer received coins to own address
  tx.transferObjects([baseOut, quoteOut, deepOut], this.getActiveAddress());
};
```

--------------------------------

### Return Quote Asset with DeepBookV3 SDK

Source: https://docs.sui.io/standards/deepbook/v3-sdk/flash-loans

The `returnQuoteAsset` function is used to return a borrowed quote asset to its pool. It requires the pool key, the amount to be returned, the coin object for the quote asset, and the flash loan object. This function finalizes the quote asset part of a flash loan.

```typescript
returnQuoteAsset(
  poolKey: string,
  borrowAmount: number,
  quoteCoinInput: TransactionObjectArgument,
  flashLoan: TransactionObjectArgument,
);
```

--------------------------------

### Deposit Collateral in Sui IO Standards Deepbook (TypeScript)

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/margin-manager

Deposits a specified amount of SUI as collateral into the margin contract. It requires a transaction object and a manager key. The function adds a depositBase transaction to the provided transaction.

```typescript
// Example: Deposit 100 SUI as collateral
depositCollateral = (tx: Transaction) => {
	const managerKey = 'MARGIN_MANAGER_1';
	tx.add(this.marginContract.depositBase(managerKey, 100));
};
```

--------------------------------

### Claim Rebates API

Source: https://docs.sui.io/standards/deepbook/v3-sdk/staking-governance

Allows users to claim maker/taker rebates for a balance manager in a specific pool. Requires pool and balance manager keys.

```APIDOC
## POST /claimRebates

### Description
Use `claimRebates` to claim maker/taker rebates for a balance manager in a specific pool. The call returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/claimRebates

### Parameters
#### Request Body
- **poolKey** (string) - Required - String that identifies the pool.
- **balanceManagerKey** (string) - Required - String that identifies the balance manager.

### Request Example
```json
{
  "poolKey": "DBUSDT_DBUSDC",
  "balanceManagerKey": "MANAGER_1"
}
```

### Response
#### Success Response (200)
- **transactionFunction** (function) - A function that takes a `Transaction` object to process the rebate claim.

#### Response Example
```json
{
  "transactionFunction": "(tx: Transaction) => void"
}
```
```

--------------------------------

### Supply Liquidity to Margin Pool (TypeScript)

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/margin-pool

Supplies assets to a margin pool to earn interest. This function can optionally include a referral ID to share fees. It returns a transaction builder that accepts a Transaction object and requires coinKey, supplierCap, and amountToDeposit.

```typescript
// Example: Supply 1000 USDC to the margin pool
supplyLiquidity = (tx: Transaction) => {
	const coinKey = 'USDC';
	const supplierCapId = '0x...'; // ID of your supplier cap
	const supplierCap = tx.object(supplierCapId);
	const amountToSupply = 1000;

	tx.add(
		this.marginPoolContract.supplyToMarginPool(
			coinKey,
			supplierCap,
			amountToSupply,
			// Optional: provide referral ID
		)
	);
};
```

--------------------------------

### Set and Unset Balance Manager Referrals

Source: https://docs.sui.io/standards/deepbook/v3-sdk/balance-manager

Configures and removes referral settings for a balance manager on a per-pool basis. This involves associating a referral ID with a balance manager and optionally using a TradeCap for authorization.

```typescript
// Example: Set a pool-specific referral for a balance manager
setManagerReferral = (tx: Transaction) => {
	const managerKey = 'MANAGER_1';
	const referralId = '0xdef...'; // DeepBookPoolReferral ID

	// Get or create the TradeCap
	const tradeCap = tx.object('0x...'); // Assuming tradeCap is already minted

	tx.add(this.balanceManager.setBalanceManagerReferral(managerKey, referralId, tradeCap));
};

// Example: Unset a referral for a specific pool
unsetManagerReferral = (tx: Transaction) => {
	const managerKey = 'MANAGER_1';
	const poolKey = 'SUI_DBUSDC';
	const tradeCap = tx.object('0x...');

	tx.add(this.balanceManager.unsetBalanceManagerReferral(managerKey, poolKey, tradeCap));
};
```

--------------------------------

### Create Supplier Cap for Margin Pool (TypeScript)

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/margin-pool

Mints a new supplier capability that can be used across multiple margin pools for supplying and withdrawing assets. This function returns a transaction builder that accepts a Transaction object.

```typescript
/**
 * @description Mint a supplier cap for margin pool
 * @returns A function that takes a Transaction object
 */
mintSupplierCap = () => (tx: Transaction) => {};

// Example usage
createSupplierCap = (tx: Transaction) => {
	const supplierCap = tx.add(this.marginPoolContract.mintSupplierCap());
	// Transfer to user or store for later use
	tx.transferObjects([supplierCap], tx.pure.address(this.config.address));
};
```

--------------------------------

### Read-only Functions

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/margin-manager

Functions to query margin manager state without modifying it.

```APIDOC
## Read-only Functions

### `riskRatio`

**Description**: Query the risk ratio of the margin manager, which represents the ratio of assets to debt. Higher ratios indicate healthier positions.

**Method**: GET

**Endpoint**: N/A (SDK function)

**Parameters**

#### Path Parameters

None

#### Query Parameters

- **managerKey** (string) - Required - String that identifies the margin manager.

### `owner`, `deepbookPool`, `marginPoolId`

**Description**: Query basic margin manager information.

**Method**: GET

**Endpoint**: N/A (SDK function)

**Parameters**

#### Path Parameters

None

#### Query Parameters

- **managerKey** (string) - Required - String that identifies the margin manager.

### `borrowedShares`, `borrowedBaseShares`, `borrowedQuoteShares`, `hasBaseDebt`

**Description**: Query borrowed position information.

**Method**: GET

**Endpoint**: N/A (SDK function)

**Parameters**

#### Path Parameters

None

#### Query Parameters

- **managerKey** (string) - Required - String that identifies the margin manager.

### `balanceManager`, `calculateAssets`, `calculateDebts`

**Description**: Query balance and debt information.

**Method**: GET

**Endpoint**: N/A (SDK function)

**Parameters**

#### Path Parameters

None

#### Query Parameters

- **managerKey** (string) - Required - String that identifies the margin manager.

### Response (Read-only Functions)

- **Type**: Varies based on the function called (e.g., number for `riskRatio`, string for `owner`).
- **Description**: The queried information about the margin manager.
```

--------------------------------

### Submit Proposal API

Source: https://docs.sui.io/standards/deepbook/v3-sdk/staking-governance

Allows users to submit a new governance proposal. Requires a `ProposalParams` object.

```APIDOC
## POST /submitProposal

### Description
Use `submitProposal` to submit a governance proposal. The call returns a `Transaction` object.

### Method
POST

### Endpoint
/submitProposal

### Parameters
#### Request Body
- **params** (ProposalParams) - Required - An object that defines the proposal.
  - **poolKey** (string) - Required - String that identifies the pool.
  - **balanceManagerKey** (string) - Required - String that identifies the balance manager.
  - **takerFee** (number) - Required - The taker fee for the proposal.
  - **makerFee** (number) - Required - The maker fee for the proposal.
  - **stakeRequired** (number) - Required - The amount of stake required for the proposal.

### Request Example
```json
{
  "params": {
    "poolKey": "DBUSDT_DBUSDC",
    "balanceManagerKey": "MANAGER_1",
    "takerFee": 0.002,
    "makerFee": 0.001,
    "stakeRequired": 100
  }
}
```

### Response
#### Success Response (200)
- **transaction** (Transaction) - The transaction object for submitting the proposal.

#### Response Example
```json
{
  "transaction": "<transaction_object>"
}
```
```

--------------------------------

### Borrow Base Asset with DeepBookV3 SDK

Source: https://docs.sui.io/standards/deepbook/v3-sdk/flash-loans

The `borrowBaseAsset` function allows borrowing a specified amount of the base asset from a given pool. It requires the pool's key and the borrow amount as input. The function returns a transaction object that can be further manipulated.

```typescript
borrowBaseAsset(poolKey: string, borrowAmount: number);
```

--------------------------------

### Submit Proposal API

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/staking-governance

Allows users with a non-zero active stake to submit a governance proposal to change pool parameters like taker fee rate, maker fee rate, and stake required.

```APIDOC
## Submit Proposal

### Description
Allows users with a non-zero active stake to submit a governance proposal to change pool parameters like taker fee rate, maker fee rate, and stake required. Each user can submit one proposal per epoch.

### Method
POST

### Endpoint
/pool/proposals

### Parameters
#### Request Body
- **taker_fee_rate** (number) - Optional - The new taker fee rate.
- **maker_fee_rate** (number) - Optional - The new maker fee rate.
- **stake_required** (number) - Optional - The new stake required amount.

### Request Example
```json
{
  "taker_fee_rate": 0.001,
  "maker_fee_rate": 0.0005,
  "stake_required": 10000
}
```

### Response
#### Success Response (200)
- **proposal_id** (string) - The ID of the submitted proposal.
- **message** (string) - Confirmation message.

#### Response Example
```json
{
  "proposal_id": "prop_12345",
  "message": "Proposal submitted successfully."
}
```
```

--------------------------------

### Update Margin Pool Interest Rate Parameters

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/maintainer

Updates the interest rate parameters for an existing margin pool. This allows for dynamic adjustment of borrowing costs based on market conditions. The function takes the coin key, margin pool capacity ID, and a new set of interest rate parameters.

```typescript
updateInterestRates = (tx: Transaction) => {
	const coinKey = 'USDC';
	const marginPoolCapId = '0x...';

	tx.add(
		this.maintainerContract.updateInterestParams(coinKey, marginPoolCapId, {
			baseRate: 0.03, // Increase to 3% base rate
			baseSlope: 0.12, // Increase slope
			optimalUtilization: 0.75, // Lower kink to 75%
			excessSlope: 1.5, // Steeper excess slope
		}),
	);
};
```

--------------------------------

### Set Take Profit Order

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/tpsl

Allows users to set a take profit order that automatically sells an asset when its price rises above a specified trigger price.

```APIDOC
## POST /api/margin/orders/take-profit

### Description
Sets a take profit order to sell an asset when the price rises above a specified trigger price.

### Method
POST

### Endpoint
/api/margin/orders/take-profit

### Parameters
#### Request Body
- **marginManagerKey** (string) - Required - The key of the margin manager.
- **conditionalOrderId** (integer) - Required - The ID for the conditional order.
- **triggerBelowPrice** (boolean) - Required - Set to `false` to trigger when price rises above.
- **triggerPrice** (number) - Required - The price at which the order should trigger.
- **pendingOrder** (object) - Required - Details of the pending order.
  - **clientOrderId** (integer) - Required - The client-defined order ID.
  - **price** (number) - Required - The limit price for the order.
  - **quantity** (number) - Required - The quantity of the asset to sell.
  - **isBid** (boolean) - Required - Set to `false` for a sell order.
  - **payWithDeep** (boolean) - Required - Whether to pay with DEEP.

### Request Example
```json
{
  "marginManagerKey": "MARGIN_MANAGER_1",
  "conditionalOrderId": 2,
  "triggerBelowPrice": false,
  "triggerPrice": 5.0,
  "pendingOrder": {
    "clientOrderId": 101,
    "price": 5.0,
    "quantity": 50,
    "isBid": false,
    "payWithDeep": true
  }
}
```

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example
```json
{
  "message": "Take profit order set successfully."
}
```
```

--------------------------------

### New Pending Market Order

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/tpsl

Creates a pending market order for use in conditional orders. Returns a function that takes a Transaction object.

```APIDOC
## New Pending Market Order

### Description
Use `newPendingMarketOrder` to create a pending market order for use in conditional orders. The call returns a function that takes a `Transaction` object.

### Method
`newPendingMarketOrder`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **poolKey** (String) - Required - Identifies the pool.
- **params** (Object) - Required - `PendingMarketOrderParams` object containing:
  - **clientOrderId** (Number) - Required - For client tracking.
  - **selfMatchingOption** (String) - Optional - Self-matching option (default: `SELF_MATCHING_ALLOWED`).
  - **quantity** (Number) - Required - The order quantity.
  - **isBid** (Boolean) - Required - Indicates if this is a buy order.
  - **payWithDeep** (Boolean) - Optional - For fee payment (default: `true`).

### Request Example
```tsx
// Example: Create a pending market sell order for 5 units in pool 'POOL_C'
traderClient.marginTPSL.newPendingMarketOrder({
	poolKey: 'POOL_C',
	params: {
		clientOrderId: 300,
		quantity: 5,
		isBid: false,
	},
});
```

### Response
#### Success Response (200)
Returns a function that takes a `Transaction` object.

#### Response Example
`Function`
```

--------------------------------

### Swap Exact Quantity with Manager

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/swaps

The underlying function for manager-based swaps. Assumes fees are paid in DEEP and the BalanceManager has sufficient DEEP for fees. Returns two Coin objects: BaseAsset and QuoteAsset.

```APIDOC
## POST /swap/exact_quantity/manager

### Description
This is the core function for swaps involving a `BalanceManager`. It handles both base-to-quote and quote-to-base exchanges. It assumes that trading fees are paid in DEEP tokens and that the `BalanceManager` has sufficient DEEP for these fees. It returns two `Coin` objects: the `BaseAsset` and the `QuoteAsset`.

### Method
POST

### Endpoint
`/swap/exact_quantity/manager`

### Parameters
#### Query Parameters
- **base_in** (Coin) - Optional - The amount of base asset to swap. Must be zero if swapping quote for base.
- **quote_in** (Coin) - Optional - The amount of quote asset to swap. Must be zero if swapping base for quote.
- **base_out_min** (Coin) - Required - The minimum amount of base asset expected.
- **quote_out_min** (Coin) - Required - The minimum amount of quote asset expected.
- **balance_manager** (BalanceManager) - Required - The BalanceManager to use for the swap.

#### Request Body
None

### Response
#### Success Response (200)
- **base_asset_returned** (Coin) - The `Coin` object for the returned base asset.
- **quote_asset_returned** (Coin) - The `Coin` object for the returned quote asset.

#### Response Example
```json
{
  "base_asset_returned": {
    "value": "500000"
  },
  "quote_asset_returned": {
    "value": "1000000"
  }
}
```
```

--------------------------------

### Read-only Functions

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/tpsl

Provides functions to query information about conditional orders without modifying them.

```APIDOC
## Read-only Functions

### Description
These functions allow querying information about conditional orders.

### Functions
- **`conditionalOrderIds`**: Query all conditional order IDs for a margin manager.
- **`conditionalOrder`**: Query a specific conditional order by ID.
- **`triggerBelowOrders`**: Query the list of conditional orders sorted by trigger price (triggering below).
- **`triggerAboveOrders`**: Query the list of conditional orders sorted by trigger price (triggering above).
- **`numConditionalOrders`**: Query the total number of conditional orders for a margin manager.
- **`lowestTriggerAbovePrice`**: Query the lowest trigger price among orders set to trigger above.
- **`highestTriggerBelowPrice`**: Query the highest trigger price among orders set to trigger below.

### Example Usage (Conceptual)
```tsx
// Get all conditional order IDs for a margin manager
const orderIds = await traderClient.marginTPSL.conditionalOrderIds('MARGIN_MANAGER_1');

// Get details of a specific conditional order
const orderDetails = await traderClient.marginTPSL.conditionalOrder('MARGIN_MANAGER_1', 'order_123');

// Get orders that trigger below a certain price
const belowOrders = await traderClient.marginTPSL.triggerBelowOrders('MARGIN_MANAGER_1');
```
```

--------------------------------

### Deposit and Withdraw Funds from Balance Manager

Source: https://docs.sui.io/standards/deepbook/v3-sdk/balance-manager

Handles the deposit and withdrawal of various digital assets (USDC, SUI, DEEP) into and from a specified balance manager. It supports partial withdrawals by amount and full withdrawals to a designated recipient.

```typescript
depositFunds = (tx: Transaction) => {
	const managerKey = 'MANAGER_1';
	const coinKey = 'DBUSDC';
	const amount = 1000; // 1000 USDC

	tx.add(this.balanceManager.depositIntoManager(managerKey, coinKey, amount));
};

// Example: Withdraw SUI from a balance manager
withdrawFunds = (tx: Transaction) => {
	const managerKey = 'MANAGER_1';
	const coinKey = 'SUI';
	const amount = 100; // 100 SUI
	const recipient = '0x456...';

	tx.add(this.balanceManager.withdrawFromManager(managerKey, coinKey, amount, recipient));
};

// Example: Withdraw all DEEP from a balance manager
withdrawAllDeep = (tx: Transaction) => {
	const managerKey = 'MANAGER_1';
	const coinKey = 'DEEP';
	const recipient = '0x456...';

	tx.add(this.balanceManager.withdrawAllFromManager(managerKey, coinKey, recipient));
};
```

--------------------------------

### swapExactQuantity

Source: https://docs.sui.io/standards/deepbook/v3-sdk/swaps

Swaps an exact quantity in either direction (base to quote or quote to base) without using a balance manager. Returns a function that takes a Transaction object.

```APIDOC
## POST /swapExactQuantity

### Description
Swaps an exact quantity of an asset in either direction (base to quote or quote to base) without utilizing a balance manager. This function is part of the DeepBookV3 SDK and is designed to be used within a transaction.

### Method
POST

### Endpoint
/swapExactQuantity

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **params** (SwapParams & { isBaseToCoin: boolean }) - Required - An object containing the parameters for the swap operation.
  - **poolKey** (string) - Required - Identifier for the trading pool.
  - **amount** (number) - Required - The amount to swap.
  - **deepAmount** (number) - Required - The DEEP amount for fees.
  - **minOut** (number) - Required - The minimum output amount expected.
  - **isBaseToCoin** (boolean) - Required - Indicates the swap direction. `true` for base to quote, `false` for quote to base.
  - **baseCoin** (TransactionArgument) - Optional - The transaction argument for the base coin input.
  - **quoteCoin** (TransactionArgument) - Optional - The transaction argument for the quote coin input.
  - **deepCoin** (TransactionArgument) - Optional - The transaction argument for the DEEP coin input.

### Request Example
```json
{
  "poolKey": "SUI_DBUSDC",
  "amount": 100,
  "deepAmount": 5,
  "minOut": 10,
  "isBaseToCoin": true
}
```

### Response
#### Success Response (200)
- **TransactionArgument[]** - An array of transaction arguments representing the output coins from the swap (base, quote, and deep).

#### Response Example
```json
[
  "baseOut",
  "quoteOut",
  "deepOut"
]
```
```

--------------------------------

### Borrow Assets in Sui IO Standards Deepbook (TypeScript)

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/margin-manager

Borrows a specified amount of quote assets (e.g., USDC) from the margin contract. It takes a transaction object and a manager key as input. The function utilizes the borrowQuote method to add the borrowing transaction.

```typescript
// Example: Borrow 500 USDC
borrowFunds = (tx: Transaction) => {
	const managerKey = 'MARGIN_MANAGER_1';
	tx.add(this.marginContract.borrowQuote(managerKey, 500));
};
```

--------------------------------

### Liquidation Events

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves events for when margin managers are liquidated. This endpoint is essential for monitoring risk and understanding liquidation mechanics.

```APIDOC
## GET /liquidation

### Description
Returns events for when margin managers are liquidated.

### Method
GET

### Endpoint
/liquidation

#### Query Parameters
- **margin_manager_id** (string) - Required - The ID of the margin manager.
- **margin_pool_id** (string) - Required - The ID of the margin pool.
- **start_time** (integer) - Optional - Start of time range in Unix timestamp seconds (defaults to 24 hours ago).
- **end_time** (integer) - Optional - End of time range in Unix timestamp seconds (defaults to current time).
- **limit** (integer) - Optional - Maximum number of results to return (defaults to 1).

### Response
#### Success Response (200)
- **event_digest** (string) - The unique identifier for the event.
- **digest** (string) - The transaction digest associated with the event.
- **sender** (string) - The address of the account that initiated the event.
- **checkpoint** (integer) - The checkpoint number at which the event occurred.
- **checkpoint_timestamp_ms** (integer) - The timestamp in milliseconds when the checkpoint was processed.
- **package** (string) - The package ID where the event originated.
- **margin_manager_id** (string) - The ID of the margin manager.
- **margin_pool_id** (string) - The ID of the margin pool.
- **liquidation_amount** (integer) - The amount liquidated.
- **pool_reward** (integer) - The reward distributed to the pool during liquidation.
- **pool_default** (integer) - The default amount in the pool.
- **risk_ratio** (integer) - The risk ratio of the margin manager at the time of liquidation.
- **onchain_timestamp** (integer) - The timestamp in milliseconds when the event occurred on-chain.
- **remaining_base_asset** (string) - The remaining amount of the base asset.
- **remaining_quote_asset** (string) - The remaining amount of the quote asset.
- **remaining_base_debt** (string) - The remaining base asset debt.
- **remaining_quote_debt** (string) - The remaining quote asset debt.
- **base_pyth_price** (integer) - The Pyth price of the base asset.
- **base_pyth_decimals** (integer) - The number of decimals for the base asset Pyth price.
- **quote_pyth_price** (integer) - The Pyth price of the quote asset.
- **quote_pyth_decimals** (integer) - The number of decimals for the quote asset Pyth price.

#### Response Example
```json
[
    {
        "event_digest": "0xabc123...",
        "digest": "0xdef456...",
        "sender": "0x1111...",
        "checkpoint": 12345678,
        "checkpoint_timestamp_ms": 1738000000000,
        "package": "0x2222...",
        "margin_manager_id": "0x1234...",
        "margin_pool_id": "0x5678...",
        "liquidation_amount": 1000000000,
        "pool_reward": 10000000,
        "pool_default": 0,
        "risk_ratio": 800000000,
        "onchain_timestamp": 1738000000000,
        "remaining_base_asset": "500000000",
        "remaining_quote_asset": "2000000000",
        "remaining_base_debt": "0",
        "remaining_quote_debt": "0",
        "base_pyth_price": 100000000,
        "base_pyth_decimals": 8,
        "quote_pyth_price": 100000000,
        "quote_pyth_decimals": 8
    }
]
```
```

--------------------------------

### Stake API

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/staking-governance

Allows users to stake DEEP tokens into a DeepBook pool. Staked tokens become active in the following epoch, potentially granting reduced taker fees and accumulating trading fee rebates.

```APIDOC
## Stake

### Description
Allows users to stake DEEP tokens into a DeepBook pool. Staked tokens become active in the following epoch, potentially granting reduced taker fees and accumulating trading fee rebates.

### Method
POST

### Endpoint
/pool/stake

### Parameters
#### Query Parameters
- **amount** (number) - Required - The amount of DEEP tokens to stake.

### Request Example
```json
{
  "amount": 1000
}
```

### Response
#### Success Response (200)
- **message** (string) - Confirmation message of successful staking.

#### Response Example
```json
{
  "message": "Successfully staked DEEP tokens."
}
```
```

--------------------------------

### Claim Rebates API

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/staking-governance

Allows users to claim accumulated rewards (rebates) from a DeepBook pool. The balance manager must have rewards available to be claimed.

```APIDOC
## Claim Rebates

### Description
Allows users to claim accumulated rewards (rebates) from a DeepBook pool. The balance manager must have rewards available to be claimed.

### Method
POST

### Endpoint
/pool/claim_rebates

### Parameters
*No parameters required for this endpoint.*

### Request Example
```json
{}
```

### Response
#### Success Response (200)
- **message** (string) - Confirmation message of successful rebate claim.
- **claimed_amount** (number) - The amount of rewards claimed.

#### Response Example
```json
{
  "message": "Rebates claimed successfully.",
  "claimed_amount": 150.75
}
```
```

--------------------------------

### New Pending Limit Order

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/tpsl

Creates a pending limit order for use in conditional orders. Returns a function that takes a Transaction object.

```APIDOC
## New Pending Limit Order

### Description
Use `newPendingLimitOrder` to create a pending limit order for use in conditional orders. The call returns a function that takes a `Transaction` object.

### Method
`newPendingLimitOrder`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **poolKey** (String) - Required - Identifies the pool.
- **params** (Object) - Required - `PendingLimitOrderParams` object containing:
  - **clientOrderId** (Number) - Required - For client tracking.
  - **orderType** (String) - Optional - Order type (default: `NO_RESTRICTION`).
  - **selfMatchingOption** (String) - Optional - Self-matching option (default: `SELF_MATCHING_ALLOWED`).
  - **price** (Number) - Required - The limit price.
  - **quantity** (Number) - Required - The order quantity.
  - **isBid** (Boolean) - Required - Indicates if this is a buy order.
  - **payWithDeep** (Boolean) - Optional - For fee payment (default: `true`).
  - **expireTimestamp** (Number) - Optional - Expiration timestamp.

### Request Example
```tsx
// Example: Create a pending limit buy order for 10 units at price 100.0 in pool 'POOL_B'
traderClient.marginTPSL.newPendingLimitOrder({
	poolKey: 'POOL_B',
	params: {
		clientOrderId: 200,
		price: 100.0,
		quantity: 10,
		isBid: true,
	},
});
```

### Response
#### Success Response (200)
Returns a function that takes a `Transaction` object.

#### Response Example
`Function`
```

--------------------------------

### Calculate Output Quantities for Trade (TypeScript)

Source: https://docs.sui.io/standards/deepbook/v3-sdk/pools

The `getQuantityOut` function calculates the output quantities for a trade, given either a base or quote quantity. It requires `poolKey`, `baseQuantity` (set to 0 if using quote), and `quoteQuantity` (set to 0 if using base). It returns an object with input quantities, output quantities, and `deepRequired` for a dry run.

```typescript
{
  baseQuantity: number,
  quoteQuantity: number,
  baseOut: number,
  quoteOut: number,
  deepRequired: number
}
```

--------------------------------

### Retrieve Multiple Orders

Source: https://docs.sui.io/standards/deepbook/v3-sdk/pools

Use `getOrders` to fetch multiple orders from a pool based on their IDs. It requires the pool key and an array of order IDs. Returns an array of order information.

```javascript
async getOrders(poolKey: string, orderIds: Array<string>): Promise<Array<any>>
```

--------------------------------

### Create Margin Pool

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/maintainer

Creates a new margin pool for a specific asset. This function requires maintainer capabilities and returns a transaction object for further processing.

```APIDOC
## POST /maintainer/createMarginPool

### Description
Use `createMarginPool` to create a new margin pool for a specific asset. Requires the maintainer capability. The call returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/maintainer/createMarginPool

### Parameters
#### Query Parameters
- **coinKey** (String) - Required - Identifies the asset type.
- **poolConfig** (TransactionArgument) - Required - Represents the protocol configuration.

### Request Example
```json
{
  "coinKey": "USDC",
  "poolConfig": "0x123..."
}
```

### Response
#### Success Response (200)
- **transaction** (Function) - A function that takes a `Transaction` object to finalize the creation.

#### Response Example
```json
{
  "transaction": "<function_reference>"
}
```
```

--------------------------------

### Rebates and Withdrawals API

Source: https://docs.sui.io/standards/deepbook/-margin/contract-information/orders

Claim trading rebates and withdraw settled amounts.

```APIDOC
## POST /pool_proxy/rebates

### Description
Claim trading rebates earned through the margin manager.

### Method
POST

### Endpoint
/pool_proxy/rebates

### Parameters
#### Request Body
- **claim_all** (boolean) - Optional - If true, claims all available rebates. Defaults to false.
- **rebate_ids** (array) - Optional - A list of specific rebate IDs to claim.

### Request Example
```json
{
  "claim_all": true
}
```

### Response
#### Success Response (200)
- **message** (string) - Confirmation message of the rebate claim

#### Response Example
```json
{
  "message": "Trading rebates claimed successfully."
}
```

## POST /pool_proxy/withdrawals

### Description
Withdraw settled amounts from completed trades back to the margin manager's balance manager.

### Method
POST

### Endpoint
/pool_proxy/withdrawals

### Parameters
#### Request Body
- **amount** (number) - Required - The amount to withdraw
- **asset** (string) - Required - The asset to withdraw

### Request Example
```json
{
  "amount": 500,
  "asset": "USDC"
}
```

### Response
#### Success Response (200)
- **message** (string) - Confirmation message of the withdrawal

#### Response Example
```json
{
  "message": "Settled amounts withdrawn successfully."
}
```
```

--------------------------------

### Create Permissionless Pool (Admin)

Source: https://docs.sui.io/standards/deepbook/v3-sdk/pools

Use `createPermissionlessPool` to create a new permissionless pool. This administrative function takes pool creation parameters and returns a transaction object.

```typescript
function createPermissionlessPool(params: CreatePermissionlessPoolParams): (tx: Transaction) => Transaction
```

--------------------------------

### Retrieve Open Orders for Balance Manager (TypeScript)

Source: https://docs.sui.io/standards/deepbook/v3-sdk/pools

The `accountOpenOrders` function fetches the open orders associated with a specific balance manager and pool. It takes `poolKey` and `managerKey` as input and returns a Promise that resolves to an array of open order IDs.

```typescript
// Example usage (assuming poolKey and managerKey are defined)
// const openOrderIds = await accountOpenOrders(poolKey, managerKey);

```

--------------------------------

### Capability Functions

Source: https://docs.sui.io/standards/deepbook/v3-sdk/balance-manager

Functions for minting and revoking various types of capability tokens (tradeCap, depositCap, withdrawalCap) for balance managers.

```APIDOC
## mintTradeCap

### Description
Use `mintTradeCap` to mint a `tradeCap` for the balance manager. The call returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/websites/sui_io_standards_deepbook/capability

### Parameters
#### Query Parameters
- **managerKey** (String) - Required - String that identifies the balance manager.

### Request Example
```json
{
  "managerKey": "string"
}
```

### Response
#### Success Response (200)
- **transactionArgument** (Object) - A transaction argument representing the minted trade cap.

#### Response Example
```json
{
  "transactionArgument": {}
}
```

## mintDepositCap

### Description
Use `mintDepositCap` to mint a `depositCap` for the balance manager. The call returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/websites/sui_io_standards_deepbook/capability

### Parameters
#### Query Parameters
- **managerKey** (String) - Required - String that identifies the balance manager.

### Request Example
```json
{
  "managerKey": "string"
}
```

### Response
#### Success Response (200)
- **transactionArgument** (Object) - A transaction argument representing the minted deposit cap.

#### Response Example
```json
{
  "transactionArgument": {}
}
```

## mintWithdrawalCap

### Description
Use `mintWithdrawalCap` to mint a `withdrawCap` for the balance manager. The call returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/websites/sui_io_standards_deepbook/capability

### Parameters
#### Query Parameters
- **managerKey** (String) - Required - String that identifies the balance manager.

### Request Example
```json
{
  "managerKey": "string"
}
```

### Response
#### Success Response (200)
- **transactionArgument** (Object) - A transaction argument representing the minted withdrawal cap.

#### Response Example
```json
{
  "transactionArgument": {}
}
```

## depositWithCap

### Description
Use `depositWithCap` to deposit funds into a balance manager using a `depositCap`. The call returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/websites/sui_io_standards_deepbook/capability

### Parameters
#### Query Parameters
- **managerKey** (String) - Required - String that identifies the balance manager.
- **coinKey** (String) - Required - String that identifies the coin to deposit.
- **amountToDeposit** (Number) - Required - Number representing the amount to deposit.

### Request Example
```json
{
  "managerKey": "string",
  "coinKey": "string",
  "amountToDeposit": 100
}
```

### Response
#### Success Response (200)
- **transactionArgument** (Object) - A transaction argument representing the deposit operation.

#### Response Example
```json
{
  "transactionArgument": {}
}
```

## withdrawWithCap

### Description
Use `withdrawWithCap` to withdraw funds from a balance manager using a `withdrawCap`. The call returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/websites/sui_io_standards_deepbook/capability

### Parameters
#### Query Parameters
- **managerKey** (String) - Required - String that identifies the balance manager.
- **coinKey** (String) - Required - String that identifies the coin to withdraw.
- **amountToWithdraw** (Number) - Required - Number representing the amount to withdraw.

### Request Example
```json
{
  "managerKey": "string",
  "coinKey": "string",
  "amountToWithdraw": 50
}
```

### Response
#### Success Response (200)
- **transactionArgument** (Object) - A transaction argument representing the withdrawal operation.

#### Response Example
```json
{
  "transactionArgument": {}
}
```

## revokeTradeCap

### Description
Use `revokeTradeCap` to revoke a `TradeCap`. This also revokes the associated `DepositCap` and `WithdrawCap`. The call returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/websites/sui_io_standards_deepbook/capability

### Parameters
#### Query Parameters
- **managerKey** (String) - Required - String that identifies the balance manager.
- **tradeCapId** (String) - Required - String representing the ID of the TradeCap to revoke.

### Request Example
```json
{
  "managerKey": "string",
  "tradeCapId": "string"
}
```

### Response
#### Success Response (200)
- **transactionArgument** (Object) - A transaction argument representing the revoke trade cap operation.

#### Response Example
```json
{
  "transactionArgument": {}
}
```
```

--------------------------------

### Submit Proposal Function - TypeScript

Source: https://docs.sui.io/standards/deepbook/v3-sdk/staking-governance

The `submitProposal` function is used to create and submit a new governance proposal. It requires a `ProposalParams` object containing details like pool key, balance manager key, fees, and stake required. The function returns a Transaction object.

```typescript
// Proposal params
export interface ProposalParams {
  poolKey: string;
  balanceManagerKey: string;
  takerFee: number;
  makerFee: number;
  stakeRequired: number;
}

submitProposal = (params: ProposalParams) => (tx: Transaction) => {}

// Custom function to submit proposal in DeepBookMarketMaker class
submitProposal = (tx: Transaction) => {
  const poolKey = 'DBUSDT_DBUSDC';
  const balanceManagerKey = 'MANAGER_1';
  tx.add(
    this.governance.submitProposal({
      poolKey,
      balanceManagerKey,
      takerFee: 0.002,
      makerFee: 0.001,
      stakeRequired: 100,
    }),
  );
};
```

--------------------------------

### Read-only Functions

Source: https://docs.sui.io/standards/deepbook/v3-sdk/balance-manager

Functions for retrieving information about balance managers and their referrals without modifying state.

```APIDOC
## owner

### Description
Use `owner` to get the owner address of a balance manager. The call returns a function that takes a `Transaction` object.

### Method
GET

### Endpoint
/websites/sui_io_standards_deepbook/read-only

### Parameters
#### Query Parameters
- **managerKey** (String) - Required - String that identifies the balance manager.

### Request Example
```json
{
  "managerKey": "string"
}
```

### Response
#### Success Response (200)
- **ownerAddress** (String) - The owner address of the balance manager.

#### Response Example
```json
{
  "ownerAddress": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
}
```

## id

### Description
Use `id` to get the ID of a balance manager. The call returns a function that takes a `Transaction` object.

### Method
GET

### Endpoint
/websites/sui_io_standards_deepbook/read-only

### Parameters
#### Query Parameters
- **managerKey** (String) - Required - String that identifies the balance manager.

### Request Example
```json
{
  "managerKey": "string"
}
```

### Response
#### Success Response (200)
- **balanceManagerId** (String) - The ID of the balance manager.

#### Response Example
```json
{
  "balanceManagerId": "string"
}
```

## balanceManagerReferralOwner

### Description
Use `balanceManagerReferralOwner` to get the owner address of a pool referral (DeepBookPoolReferral). The call returns a function that takes a `Transaction` object.

### Method
GET

### Endpoint
/websites/sui_io_standards_deepbook/read-only

### Parameters
#### Query Parameters
- **referralId** (String) - Required - String representing the ID of the referral.

### Request Example
```json
{
  "referralId": "string"
}
```

### Response
#### Success Response (200)
- **ownerAddress** (String) - The owner address of the pool referral.

#### Response Example
```json
{
  "ownerAddress": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
}
```

## balanceManagerReferralPoolId

### Description
Use `balanceManagerReferralPoolId` to get the pool ID associated with a pool referral (DeepBookPoolReferral). The call returns a function that takes a `Transaction` object.

### Method
GET

### Endpoint
/websites/sui_io_standards_deepbook/read-only

### Parameters
#### Query Parameters
- **referralId** (String) - Required - String representing the ID of the referral.

### Request Example
```json
{
  "referralId": "string"
}
```

### Response
#### Success Response (200)
- **poolId** (String) - The pool ID associated with the pool referral.

#### Response Example
```json
{
  "poolId": "string"
}
```
```

--------------------------------

### Set Take Profit Order (TypeScript)

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/tpsl

Configures a take profit order that automatically sells an asset when its price rises above a specified threshold. This function requires a Transaction object and utilizes the marginTPSL module to define order parameters such as trigger price, order type, and quantity.

```typescript
const setTakeProfit = (tx: Transaction) => {
	const managerKey = 'MARGIN_MANAGER_1';
	traderClient.marginTPSL.addConditionalOrder({
		marginManagerKey: managerKey,
		conditionalOrderId: 2,
		triggerBelowPrice: false, // Trigger when price rises above
		triggerPrice: 5.0,
		pendingOrder: {
			clientOrderId: 101,
			price: 5.0, // Limit order at 5.0
			quantity: 50,
			isBid: false, // Sell order
			payWithDeep: true,
		},
	})(tx);
};
```

--------------------------------

### Update Margin Pool Configuration

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/maintainer

Updates the configuration settings for a margin pool. Returns a transaction object for further processing.

```APIDOC
## POST /maintainer/updateMarginPoolConfig

### Description
Use `updateMarginPoolConfig` to update the configuration settings for a margin pool. The call returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/maintainer/updateMarginPoolConfig

### Parameters
#### Query Parameters
- **coinKey** (String) - Required - Identifies the margin pool asset.
- **marginPoolCap** (String) - Required - Represents the margin pool capability ID.
- **marginPoolConfig** (MarginPoolConfigParams) - Required - Object with new pool settings:
  - **supplyCap** (Number) - Maximum supply allowed.
  - **maxUtilizationRate** (Number) - Maximum utilization (e.g., 0.8 for 80%).
  - **referralSpread** (Number) - Protocol spread percentage.
  - **minBorrow** (Number) - Minimum borrow amount.

### Request Example
```json
{
  "coinKey": "USDC",
  "marginPoolCap": "0xdef...",
  "marginPoolConfig": {
    "supplyCap": 1200000,
    "maxUtilizationRate": 0.85,
    "referralSpread": 0.012,
    "minBorrow": 15
  }
}
```

### Response
#### Success Response (200)
- **transaction** (Function) - A function that takes a `Transaction` object to finalize the update.

#### Response Example
```json
{
  "transaction": "<function_reference>"
}
```
```

--------------------------------

### Unstake API

Source: https://docs.sui.io/standards/deepbook/v3-sdk/staking-governance

Enables users to unstake assets from a specific pool. Requires pool and balance manager keys.

```APIDOC
## POST /unstake

### Description
Use `unstake` to unstake from a particular pool. The call returns a `Transaction` object.

### Method
POST

### Endpoint
/unstake

### Parameters
#### Request Body
- **poolKey** (string) - Required - String that identifies the pool.
- **balanceManagerKey** (string) - Required - String that identifies the balance manager.

### Request Example
```json
{
  "poolKey": "DBUSDT_DBUSDC",
  "balanceManagerKey": "MANAGER_1"
}
```

### Response
#### Success Response (200)
- **transaction** (Transaction) - The transaction object for the unstaking operation.

#### Response Example
```json
{
  "transaction": "<transaction_object>"
}
```
```

--------------------------------

### Borrow Quote Asset with DeepBookV3 SDK

Source: https://docs.sui.io/standards/deepbook/v3-sdk/flash-loans

The `borrowQuoteAsset` function enables borrowing a specified amount of the quote asset from a designated pool. It takes the pool's key and the borrow amount as parameters. The function returns a transaction object for subsequent operations.

```typescript
borrowQuoteAsset(poolKey: string, borrowAmount: number);
```

--------------------------------

### Repay Loan in Sui IO Standards Deepbook (TypeScript)

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/margin-manager

Repays all borrowed quote assets from the margin contract. If no amount is specified, it defaults to repaying the entire borrowed amount. This function adds a repayQuote transaction to the provided transaction object.

```typescript
// Example: Repay all borrowed quote assets
repayLoan = (tx: Transaction) => {
	const managerKey = 'MARGIN_MANAGER_1';
	// No amount specified = repay all
	tx.add(this.marginContract.repayQuote(managerKey));
};
```

--------------------------------

### Modify and Cancel Orders on Sui IO Deepbook

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/orders

Provides functions for managing existing orders. `modifyOrder` allows changing the quantity of an order, while `cancelOrder`, `cancelOrders`, and `cancelAllOrders` are used to remove orders from the book. These operations require the margin manager key and order ID(s).

```tsx
// Example: Modify order quantity
modifyExistingOrder = (tx: Transaction) => {
	const managerKey = 'MARGIN_MANAGER_1';
	const orderId = '123456789'; // Protocol order ID
	const newQuantity = 8; // Reduce from 10 to 8
	tx.add(this.poolProxyContract.modifyOrder(managerKey, orderId, newQuantity));
};

// Example: Cancel a single order
cancelSingleOrder = (tx: Transaction) => {
	const managerKey = 'MARGIN_MANAGER_1';
	const orderId = '123456789';
	tx.add(this.poolProxyContract.cancelOrder(managerKey, orderId));
};

// Example: Cancel multiple orders
cancelMultipleOrders = (tx: Transaction) => {
	const managerKey = 'MARGIN_MANAGER_1';
	const orderIds = ['123456789', '987654321'];
	tx.add(this.poolProxyContract.cancelOrders(managerKey, orderIds));
};

// Example: Cancel all orders
cancelAll = (tx: Transaction) => {
	const managerKey = 'MARGIN_MANAGER_1';
	tx.add(this.poolProxyContract.cancelAllOrders(managerKey));
};

```

--------------------------------

### Update Margin Pool Configuration

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/maintainer

Modifies the configuration settings for a margin pool, such as supply caps and utilization limits. This function allows for adjusting the pool's capacity and risk parameters over time. It requires the coin key, margin pool capacity ID, and updated configuration values.

```typescript
updatePoolConfig = (tx: Transaction) => {
	const coinKey = 'USDC';
	const marginPoolCapId = '0x...';

	tx.add(
		this.maintainerContract.updateMarginPoolConfig(coinKey, marginPoolCapId, {
			supplyCap: 20_000_000, // Increase to 20M USDC
			maxUtilizationRate: 0.85, // Allow 85% utilization
			referralSpread: 0.12, // Increase protocol spread
			minBorrow: 50, // Lower minimum to 50 USDC
		}),
	);
};
```

--------------------------------

### Order Object Structure

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Defines the structure of an order object returned by the /orders endpoint. Includes details such as order ID, type, status, price, timestamps, and quantities.

```json
[
    {
        "order_id": "string",
        "balance_manager_id": "string",
        "type": "string",
        "current_status": "string",
        "price": float,
        "placed_at": integer,
        "last_updated_at": integer,
        "original_quantity": float,
        "filled_quantity": float,
        "remaining_quantity": float
    }
]
```

--------------------------------

### New Condition

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/tpsl

Creates a trigger condition for a conditional order. Returns a function that takes a Transaction object.

```APIDOC
## New Condition

### Description
Use `newCondition` to create a trigger condition for a conditional order. The call returns a function that takes a `Transaction` object.

### Method
`newCondition`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **poolKey** (String) - Required - Identifies the pool.
- **triggerBelowPrice** (Boolean) - Required - Indicates whether to trigger when price falls below the trigger price.
- **triggerPrice** (Number) - Required - The price at which to trigger.

### Request Example
```tsx
// Example: Create a condition to trigger when price drops below 1.5 in pool 'POOL_A'
traderClient.marginTPSL.newCondition({
	poolKey: 'POOL_A',
	triggerBelowPrice: true,
	triggerPrice: 1.5,
});
```

### Response
#### Success Response (200)
Returns a function that takes a `Transaction` object.

#### Response Example
`Function`
```

--------------------------------

### Managing Positions and Stakes

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/orders

Functions for withdrawing settled amounts, staking/unstaking DEEP tokens, and participating in governance.

```APIDOC
## POST /positions/withdraw-settled

### Description
Withdraws settled amounts from completed trades through a margin manager. Returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/positions/withdraw-settled

### Parameters
#### Request Body
- **marginManagerKey** (String) - Required - Identifies the margin manager.

### Response
#### Success Response (200)
- **transactionFunction** (Function) - A function that accepts a `Transaction` object to finalize the withdrawal.

## POST /staking/stake

### Description
Stakes DEEP tokens through the margin manager for trading fee benefits. Returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/staking/stake

### Parameters
#### Request Body
- **marginManagerKey** (String) - Required - Identifies the margin manager.
- **stakeAmount** (Number) - Required - The amount of DEEP tokens to stake.

### Response
#### Success Response (200)
- **transactionFunction** (Function) - A function that accepts a `Transaction` object to finalize the staking.

## POST /staking/unstake

### Description
Unstakes DEEP tokens through the margin manager. Returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/staking/unstake

### Parameters
#### Request Body
- **marginManagerKey** (String) - Required - Identifies the margin manager.

### Response
#### Success Response (200)
- **transactionFunction** (Function) - A function that accepts a `Transaction` object to finalize the unstaking.

## POST /governance/submit-proposal

### Description
Submits a governance proposal through the margin manager. Returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/governance/submit-proposal

### Parameters
#### Request Body
- **marginManagerKey** (String) - Required - Identifies the margin manager.
- **params** (Object) - Required - Proposal parameters.
  - **takerFee** (Number) - Required - The taker fee for the proposal.
  - **makerFee** (Number) - Required - The maker fee for the proposal.
  - **stakeRequired** (Number) - Required - The stake required for the proposal.

### Response
#### Success Response (200)
- **transactionFunction** (Function) - A function that accepts a `Transaction` object to finalize the proposal submission.

## POST /governance/vote

### Description
Votes on a governance proposal through the margin manager. Returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/governance/vote

### Parameters
#### Request Body
- **marginManagerKey** (String) - Required - Identifies the margin manager.
- **proposalId** (String) - Required - The ID of the proposal to vote on.

### Response
#### Success Response (200)
- **transactionFunction** (Function) - A function that accepts a `Transaction` object to finalize the vote.

## POST /rebates/claim

### Description
Claims trading rebates earned through the margin manager. Returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/rebates/claim

### Parameters
#### Request Body
- **marginManagerKey** (String) - Required - Identifies the margin manager.

### Response
#### Success Response (200)
- **transactionFunction** (Function) - A function that accepts a `Transaction` object to finalize the rebate claim.
```

--------------------------------

### Indexer Status Response Format

Source: https://docs.sui.io/standards/deepbook/v3-indexer

The detailed response structure for the indexer status endpoint. It includes overall status, checkpoint information, and a breakdown of status for individual pipelines.

```json
{
    "status": "OK" | "UNHEALTHY",
    "latest_onchain_checkpoint": integer,
    "current_time_ms": integer,
    "earliest_checkpoint": integer,
    "max_lag_pipeline": "string",
    "max_checkpoint_lag": integer,
    "max_time_lag_seconds": integer,
    "pipelines": [
        {
            "pipeline": "string",
            "indexed_checkpoint": integer,
            "indexed_epoch": integer,
            "indexed_timestamp_ms": integer,
            "checkpoint_lag": integer,
            "time_lag_seconds": integer,
            "latest_onchain_checkpoint": integer
        }
    ]
}
```

--------------------------------

### Mint Trade Capability for Balance Manager

Source: https://docs.sui.io/standards/deepbook/v3-sdk/balance-manager

Use `mintTradeCap` to mint a `tradeCap` for the balance manager. This capability is used for permission checking in other operations. The function returns a transaction object that can be added to a transaction.

```typescript
mintTradeCap = (tx: Transaction, managerKey: string) => {
  tx.add(this.balanceManager.mintTradeCap(managerKey));
};
```

--------------------------------

### Loan Borrowed Events

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves events for when assets are borrowed from margin pools. This endpoint is crucial for monitoring leverage and borrowing activity.

```APIDOC
## GET /loan_borrowed

### Description
Returns events for when assets are borrowed from margin pools.

### Method
GET

### Endpoint
/loan_borrowed

#### Query Parameters
- **margin_manager_id** (string) - Required - The ID of the margin manager.
- **margin_pool_id** (string) - Required - The ID of the margin pool.
- **start_time** (integer) - Optional - Start of time range in Unix timestamp seconds (defaults to 24 hours ago).
- **end_time** (integer) - Optional - End of time range in Unix timestamp seconds (defaults to current time).
- **limit** (integer) - Optional - Maximum number of results to return (defaults to 1).

### Response
#### Success Response (200)
- **event_digest** (string) - The unique identifier for the event.
- **digest** (string) - The transaction digest associated with the event.
- **sender** (string) - The address of the account that initiated the event.
- **checkpoint** (integer) - The checkpoint number at which the event occurred.
- **checkpoint_timestamp_ms** (integer) - The timestamp in milliseconds when the checkpoint was processed.
- **package** (string) - The package ID where the event originated.
- **margin_manager_id** (string) - The ID of the margin manager.
- **margin_pool_id** (string) - The ID of the margin pool.
- **loan_amount** (integer) - The amount of the asset borrowed.
- **loan_shares** (integer) - The amount of shares borrowed.
- **onchain_timestamp** (integer) - The timestamp in milliseconds when the event occurred on-chain.

#### Response Example
```json
[
    {
        "event_digest": "0xabc123...",
        "digest": "0xdef456...",
        "sender": "0x1111...",
        "checkpoint": 12345678,
        "checkpoint_timestamp_ms": 1738000000000,
        "package": "0x2222...",
        "margin_manager_id": "0x1234...",
        "margin_pool_id": "0x5678...",
        "loan_amount": 1000000000,
        "loan_shares": 1000000000,
        "onchain_timestamp": 1738000000000
    }
]
```
```

--------------------------------

### Mint Withdrawal Capability for Balance Manager

Source: https://docs.sui.io/standards/deepbook/v3-sdk/balance-manager

Use `mintWithdrawalCap` to mint a `withdrawCap` for the balance manager. This capability is required for withdrawing funds. The function returns a transaction object that can be added to a transaction.

```typescript
mintWithdrawalCap = (tx: Transaction, managerKey: string) => {
  tx.add(this.balanceManager.mintWithdrawalCap(managerKey));
};
```

--------------------------------

### Swap Exact Quantity (Base/Quote) without Balance Manager

Source: https://docs.sui.io/standards/deepbook/v3-sdk/swaps

Swaps an exact quantity in either direction (base to quote or quote to base) without utilizing a balance manager. It returns a function that accepts a Transaction object and requires specific swap parameters including pool key, amount, fee, minimum output, and direction.

```typescript
swapExactQuantity = (tx: Transaction) => {
  // ... implementation details ...
};
```

--------------------------------

### Calculate Borrow Interest Rate (Python)

Source: https://docs.sui.io/standards/deepbook/-margin/contract-information/interest-rates

This Python code implements the kinked interest rate model to calculate the borrow APR based on utilization. It requires defining base rate, slopes, and optimal utilization as inputs.

```python
def calculate_borrow_rate(utilization, base_rate, base_slope, optimal_utilization, excess_slope):
    if utilization < optimal_utilization:
        borrow_rate = base_rate + utilization * base_slope
    else:
        borrow_rate = base_rate + optimal_utilization * base_slope + (utilization - optimal_utilization) * excess_slope
    return borrow_rate
```

--------------------------------

### Loan Repaid Events

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves events for when borrowed assets are repaid to margin pools. This endpoint helps in tracking loan settlements and repayments.

```APIDOC
## GET /loan_repaid

### Description
Returns events for when borrowed assets are repaid.

### Method
GET

### Endpoint
/loan_repaid

#### Query Parameters
- **margin_manager_id** (string) - Required - The ID of the margin manager.
- **margin_pool_id** (string) - Required - The ID of the margin pool.
- **start_time** (integer) - Optional - Start of time range in Unix timestamp seconds (defaults to 24 hours ago).
- **end_time** (integer) - Optional - End of time range in Unix timestamp seconds (defaults to current time).
- **limit** (integer) - Optional - Maximum number of results to return (defaults to 1).

### Response
#### Success Response (200)
- **event_digest** (string) - The unique identifier for the event.
- **digest** (string) - The transaction digest associated with the event.
- **sender** (string) - The address of the account that initiated the event.
- **checkpoint** (integer) - The checkpoint number at which the event occurred.
- **checkpoint_timestamp_ms** (integer) - The timestamp in milliseconds when the checkpoint was processed.
- **package** (string) - The package ID where the event originated.
- **margin_manager_id** (string) - The ID of the margin manager.
- **margin_pool_id** (string) - The ID of the margin pool.
- **repay_amount** (integer) - The amount of the asset repaid.
- **repay_shares** (integer) - The amount of shares repaid.
- **onchain_timestamp** (integer) - The timestamp in milliseconds when the event occurred on-chain.

#### Response Example
```json
[
    {
        "event_digest": "0xabc123...",
        "digest": "0xdef456...",
        "sender": "0x1111...",
        "checkpoint": 12345678,
        "checkpoint_timestamp_ms": 1738000000000,
        "package": "0x2222...",
        "margin_manager_id": "0x1234...",
        "margin_pool_id": "0x5678...",
        "repay_amount": 1000000000,
        "repay_shares": 1000000000,
        "onchain_timestamp": 1738000000000
    }
]
```
```

--------------------------------

### Execute Triggered Orders (Keeper)

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/tpsl

Enables keepers to execute conditional orders that have been triggered based on predefined conditions.

```APIDOC
## POST /api/margin/orders/execute

### Description
Executes triggered conditional orders. This endpoint is intended for keepers to process orders that have met their trigger conditions.

### Method
POST

### Endpoint
/api/margin/orders/execute

### Parameters
#### Query Parameters
- **marginManagerKey** (string) - Required - The key of the margin manager.
- **maxOrdersToExecute** (integer) - Optional - The maximum number of triggered orders to execute in this call. Defaults to 10 if not specified.

### Request Example
(No request body, parameters are in query string)
Example URL: `/api/margin/orders/execute?marginManagerKey=MARGIN_MANAGER_1&maxOrdersToExecute=10`

### Response
#### Success Response (200)
- **executedCount** (integer) - The number of orders successfully executed.
- **message** (string) - Status message regarding the execution.

#### Response Example
```json
{
  "executedCount": 5,
  "message": "5 triggered orders executed."
}
```
```

--------------------------------

### Unstake API

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/staking-governance

Enables users to unstake their active and inactive DEEP tokens from a DeepBook pool. Unstaking forfeits maker rebates for the current epoch and disables reduced taker fees.

```APIDOC
## Unstake

### Description
Enables users to unstake their active and inactive DEEP tokens from a DeepBook pool. Unstaking forfeits maker rebates for the current epoch and disables reduced taker fees.

### Method
POST

### Endpoint
/pool/unstake

### Parameters
#### Query Parameters
- **amount** (number) - Required - The amount of DEEP tokens to unstake.

### Request Example
```json
{
  "amount": 500
}
```

### Response
#### Success Response (200)
- **message** (string) - Confirmation message of successful unstaking.

#### Response Example
```json
{
  "message": "Successfully unstaked DEEP tokens."
}
```
```

--------------------------------

### Referral Functions

Source: https://docs.sui.io/standards/deepbook/v3-sdk/balance-manager

Functions for managing balance manager referrals, including setting, unsetting, and retrieving referral information.

```APIDOC
## setBalanceManagerReferral

### Description
Use `setBalanceManagerReferral` to set a pool-specific referral for the balance manager. Requires a `tradeCap` for permission checking. The call returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/websites/sui_io_standards_deepbook/referral

### Parameters
#### Query Parameters
- **managerKey** (String) - Required - String that identifies the balance manager.
- **referral** (String) - Required - String representing the referral ID (DeepBookPoolReferral).
- **tradeCap** (Object) - Required - `TransactionArgument` representing the trade cap for permission.

### Request Example
```json
{
  "managerKey": "string",
  "referral": "string",
  "tradeCap": {}
}
```

### Response
#### Success Response (200)
- **transactionArgument** (Object) - A transaction argument representing the set referral operation.

#### Response Example
```json
{
  "transactionArgument": {}
}
```

## unsetBalanceManagerReferral

### Description
Use `unsetBalanceManagerReferral` to remove a referral from the balance manager for a specific pool. Requires a `tradeCap` for permission checking. The call returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/websites/sui_io_standards_deepbook/referral

### Parameters
#### Query Parameters
- **managerKey** (String) - Required - String that identifies the balance manager.
- **poolKey** (String) - Required - String that identifies the pool to unset the referral for.
- **tradeCap** (Object) - Required - `TransactionArgument` representing the trade cap for permission.

### Request Example
```json
{
  "managerKey": "string",
  "poolKey": "string",
  "tradeCap": {}
}
```

### Response
#### Success Response (200)
- **transactionArgument** (Object) - A transaction argument representing the unset referral operation.

#### Response Example
```json
{
  "transactionArgument": {}
}
```

## getBalanceManagerReferralId

### Description
Use `getBalanceManagerReferralId` to get the referral ID associated with a balance manager for a specific pool. The call returns a function that takes a `Transaction` object.

### Method
GET

### Endpoint
/websites/sui_io_standards_deepbook/referral

### Parameters
#### Query Parameters
- **managerKey** (String) - Required - String that identifies the balance manager.
- **poolKey** (String) - Required - String that identifies the pool.

### Request Example
```json
{
  "managerKey": "string",
  "poolKey": "string"
}
```

### Response
#### Success Response (200)
- **referralId** (String) - The referral ID associated with the balance manager for the specified pool.

#### Response Example
```json
{
  "referralId": "string"
}
```
```

--------------------------------

### Retrieve Account Information from Pool (TypeScript)

Source: https://docs.sui.io/standards/deepbook/v3-sdk/pools

The `account` function retrieves the account information for a BalanceManager within a specified pool. It requires `poolKey` and `balanceManagerKey` as parameters and returns an object containing details like epoch, open orders, volumes, stakes, and balances.

```typescript
{
  epoch: '511',
  open_orders: {
    constants: [
      '170141211130585342296014727715884105730',
      '18446744092156295689709543266',
      '18446744092156295689709543265'
    ]
  },
  taker_volume: 0,
  maker_volume: 0,
  active_stake: 0,
  inactive_stake: 0,
  created_proposal: false,
  voted_proposal: null,
  unclaimed_rebates: { base: 0, quote: 0, deep: 0 },
  settled_balances: { base: 0, quote: 0, deep: 0 },
  owed_balances: { base: 0, quote: 0, deep: 0 }
}
```

--------------------------------

### Retrieve Order Information (TypeScript)

Source: https://docs.sui.io/standards/deepbook/v3-sdk/pools

The `getOrder` function retrieves detailed information about a specific order within a pool. It requires `poolKey` and `orderId` and returns a Promise that resolves to an `Order` struct containing details like order ID, client order ID, quantities, price, epoch, status, and expiration.

```typescript
{
  balance_manager_id: {
    bytes: '0x6149bfe6808f0d6a9db1c766552b7ae1df477f5885493436214ed4228e842393'
  },
  order_id: '9223372036873222552073709551614',
  client_order_id: '888',
  quantity: '50000000',
  filled_quantity: '0',
  fee_is_deep: true,
  order_deep_price: { asset_is_base: false, deep_per_asset: '0' },
  epoch: '440',
  status: 0,
  expire_timestamp: '1844674407370955161'
}
```

--------------------------------

### Order Management API

Source: https://docs.sui.io/standards/deepbook/-margin/contract-information/orders

Manage trading orders through a margin manager. This includes placing limit and market orders, placing reduce-only orders, modifying existing orders, and canceling orders.

```APIDOC
## POST /pool_proxy/orders

### Description
Place limit and market orders through a margin manager. Orders can only be placed if margin trading is enabled for the pool.

### Method
POST

### Endpoint
/pool_proxy/orders

### Parameters
#### Request Body
- **order_type** (string) - Required - Type of order (e.g., 'limit', 'market')
- **price** (number) - Optional - The price for limit orders
- **quantity** (number) - Required - The quantity of the asset to trade
- **side** (string) - Required - The side of the order ('buy' or 'sell')

### Request Example
```json
{
  "order_type": "limit",
  "price": 1.23,
  "quantity": 100,
  "side": "buy"
}
```

### Response
#### Success Response (200)
- **order_id** (string) - The unique identifier for the placed order

#### Response Example
```json
{
  "order_id": "abc123xyz789"
}
```

## POST /pool_proxy/orders/reduce_only

### Description
Place reduce-only orders that can only decrease your debt position. These orders are useful when margin trading is disabled and you need to close existing positions.

### Method
POST

### Endpoint
/pool_proxy/orders/reduce_only

### Parameters
#### Request Body
- **price** (number) - Optional - The price for limit orders
- **quantity** (number) - Required - The quantity of the asset to trade
- **side** (string) - Required - The side of the order ('buy' or 'sell')

### Request Example
```json
{
  "price": 1.20,
  "quantity": 50,
  "side": "sell"
}
```

### Response
#### Success Response (200)
- **order_id** (string) - The unique identifier for the placed reduce-only order

#### Response Example
```json
{
  "order_id": "def456uvw012"
}
```

## PUT /pool_proxy/orders/{order_id}

### Description
Modify an existing order by changing its quantity.

### Method
PUT

### Endpoint
/pool_proxy/orders/{order_id}

### Parameters
#### Path Parameters
- **order_id** (string) - Required - The ID of the order to modify

#### Request Body
- **new_quantity** (number) - Required - The new quantity for the order

### Request Example
```json
{
  "new_quantity": 75
}
```

### Response
#### Success Response (200)
- **message** (string) - Confirmation message of the modification

#### Response Example
```json
{
  "message": "Order updated successfully."
}
```

## DELETE /pool_proxy/orders

### Description
Cancel one, multiple, or all orders for the margin manager.

### Method
DELETE

### Endpoint
/pool_proxy/orders

### Parameters
#### Query Parameters
- **order_ids** (array) - Optional - A list of order IDs to cancel. If omitted, all orders will be canceled.

### Request Example
```json
{
  "order_ids": ["abc123xyz789", "def456uvw012"]
}
```

### Response
#### Success Response (200)
- **message** (string) - Confirmation message of the cancellation

#### Response Example
```json
{
  "message": "Orders canceled successfully."
}
```
```

--------------------------------

### Withdraw Funds with Withdrawal Capability

Source: https://docs.sui.io/standards/deepbook/v3-sdk/balance-manager

Use `withdrawWithCap` to withdraw funds from a balance manager using a `withdrawCap`. This function requires the manager key, coin key, and the amount to withdraw. It returns a transaction object.

```typescript
withdrawWithCap = (tx: Transaction, managerKey: string, coinKey: string, amountToWithdraw: number) => {
  tx.add(this.balanceManager.withdrawWithCap(managerKey, coinKey, amountToWithdraw));
};
```

--------------------------------

### DEEP Supply Response Format

Source: https://docs.sui.io/standards/deepbook/v3-indexer

The structure of the response for the /deep_supply endpoint, indicating the total supply of DEEP tokens.

```json
{
    "total_supply": "string"
}
```

--------------------------------

### Update Pool Allowed Versions

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/permissionless-pool

Updates the allowed contract versions within a specific pool. This is crucial after contract upgrades to ensure compatibility with the newest contract versions. This is the permissionless equivalent of `update_allowed_versions()`.

```APIDOC
## POST /update_pool_allowed_versions

### Description
Updates the allowed contract versions within a specific pool. This is crucial after contract upgrades to ensure compatibility with the newest contract versions. This is the permissionless equivalent of `update_allowed_versions()`.

### Method
POST

### Endpoint
/update_pool_allowed_versions

### Parameters
#### Query Parameters
- **pool_address** (string) - Required - The address of the pool to update.
- **registry_address** (string) - Required - The address of the registry contract.

#### Request Body
This endpoint does not require a request body.

### Response
#### Success Response (200)
- **message** (string) - A confirmation message indicating the allowed versions were updated successfully.

#### Response Example
```json
{
  "message": "Pool allowed versions updated successfully."
}
```
```

--------------------------------

### Liquidate Position in Sui IO Standards Deepbook (TypeScript)

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/margin-manager

Liquidates an undercollateralized position in the margin contract. It requires the address of the margin manager, the pool key, a boolean indicating if the debt is in base or quote currency, and the amount of coin to repay. The function adds a liquidate transaction.

```typescript
// Example: Liquidate an undercollateralized position
liquidatePosition = (tx: Transaction) => {
	const managerAddress = '0x...'; // Address of margin manager to liquidate
	const poolKey = 'SUI_DBUSDC';
	const debtIsBase = false; // Debt is in USDC (quote)
	const repayCoin = tx.splitCoins(tx.gas, [500 * 1_000_000]); // 500 USDC
	tx.add(this.marginContract.liquidate(managerAddress, poolKey, debtIsBase, repayCoin));
};
```

--------------------------------

### Margin Manager Created Events

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves events for when margin managers are created. This endpoint allows you to track the lifecycle of margin managers within the DeepBook ecosystem.

```APIDOC
## GET /margin_manager_created

### Description
Returns events for when margin managers are created.

### Method
GET

### Endpoint
/margin_manager_created

#### Query Parameters
- **margin_manager_id** (string) - Required - The ID of the margin manager to query events for.
- **start_time** (integer) - Optional - Start of time range in Unix timestamp seconds (defaults to 24 hours ago).
- **end_time** (integer) - Optional - End of time range in Unix timestamp seconds (defaults to current time).
- **limit** (integer) - Optional - Maximum number of results to return (defaults to 1).

### Response
#### Success Response (200)
- **event_digest** (string) - The unique identifier for the event.
- **digest** (string) - The transaction digest associated with the event.
- **sender** (string) - The address of the account that initiated the event.
- **checkpoint** (integer) - The checkpoint number at which the event occurred.
- **checkpoint_timestamp_ms** (integer) - The timestamp in milliseconds when the checkpoint was processed.
- **package** (string) - The package ID where the event originated.
- **margin_manager_id** (string) - The ID of the margin manager.
- **balance_manager_id** (string) - The ID of the associated balance manager.
- **deepbook_pool_id** (string) - The ID of the DeepBook pool associated with the margin manager.
- **owner** (string) - The owner of the margin manager.
- **onchain_timestamp** (integer) - The timestamp in milliseconds when the event occurred on-chain.

#### Response Example
```json
[
    {
        "event_digest": "0xabc123...",
        "digest": "0xdef456...",
        "sender": "0x1111...",
        "checkpoint": 12345678,
        "checkpoint_timestamp_ms": 1738000000000,
        "package": "0x2222...",
        "margin_manager_id": "0x1234...",
        "balance_manager_id": "0x5678...",
        "deepbook_pool_id": "0x9abc...",
        "owner": "0xabcd...",
        "onchain_timestamp": 1738000000000
    }
]
```
```

--------------------------------

### Borrow Interest Rate Formula Explanation

Source: https://docs.sui.io/standards/deepbook/-margin/contract-information/interest-rates

This snippet illustrates the conditional logic for calculating borrow rates in a kinked interest rate model. The rate increases linearly up to optimal utilization and then sharply increases thereafter.

```pseudocode
if utilization < optimalUtilization:
    borrowRate = baseRate + utilization × baseSlope
else:
    borrowRate = baseRate + optimalUtilization × baseSlope + (utilization - optimalUtilization) × excessSlope
```

--------------------------------

### Check Manager Balance for a Specific Coin (TypeScript)

Source: https://docs.sui.io/standards/deepbook/v3-sdk/pools

Use `checkManagerBalance` to query the balance of a specific coin for a given balance manager. This function requires `managerKey` and `coinKey` and returns a Promise containing the `coinType` and its `balance`.

```typescript
{
  coinType: string,
  balance: number
}
```

--------------------------------

### Add DEEP Price Point

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/permissionless-pool

Allows for the calculation of DEEP price and correct collection of fees in DEEP for permissionless pools. This function should be called periodically (every 1-10 minutes) to maintain accurate DEEP fee calculations.

```APIDOC
## POST /add_deep_price_point

### Description
Allows for the calculation of DEEP price and correct collection of fees in DEEP for permissionless pools. This function should be called periodically (every 1-10 minutes) to maintain accurate DEEP fee calculations. This is particularly useful for pools involving USDC or SUI as either the base or quote asset.

### Method
POST

### Endpoint
/add_deep_price_point

### Parameters
#### Query Parameters
- **pool_address** (string) - Required - The address of the pool for which to add the DEEP price point.
- **reference_pool_address** (string) - Required - The address of the reference pool (e.g., DEEP/USDC or DEEP/SUI) used for DEEP fee calculation.

#### Request Body
This endpoint does not require a request body.

### Response
#### Success Response (200)
- **message** (string) - A confirmation message indicating the DEEP price point was added successfully.

#### Response Example
```json
{
  "message": "DEEP price point added successfully."
}
```
```

--------------------------------

### Net Deposits Response Format

Source: https://docs.sui.io/standards/deepbook/v3-indexer

The response format for the get_net_deposits endpoint. It's a JSON object where keys are asset IDs and values are the corresponding net deposit amounts (integer).

```json
{
    "asset_id_1": integer,
    "asset_id_2": integer,
    ...
}
```

--------------------------------

### Enable/Disable DeepBook Pool for Loan

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/maintainer

Controls which DeepBook pools can borrow from the margin pool. Returns a transaction object for further processing.

```APIDOC
## POST /maintainer/enableDeepbookPoolForLoan
## POST /maintainer/disableDeepbookPoolForLoan

### Description
Use these functions to control which DeepBook pools can borrow from the margin pool. The call returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/maintainer/enableDeepbookPoolForLoan
/maintainer/disableDeepbookPoolForLoan

### Parameters
#### Query Parameters
- **deepbookPoolKey** (String) - Required - Identifies the DeepBook pool.
- **coinKey** (String) - Required - Identifies the margin pool asset.
- **marginPoolCap** (String) - Required - Represents the margin pool capability ID.

### Request Example
```json
{
  "deepbookPoolKey": "0xabc...",
  "coinKey": "USDC",
  "marginPoolCap": "0xdef..."
}
```

### Response
#### Success Response (200)
- **transaction** (Function) - A function that takes a `Transaction` object to finalize the action.

#### Response Example
```json
{
  "transaction": "<function_reference>"
}
```
```

--------------------------------

### Retrieve Level 2 Order Book Range

Source: https://docs.sui.io/standards/deepbook/v3-sdk/pools

Use `getLevel2Range` to fetch level 2 order book data within a specified price range. It requires a pool key, price boundaries, and a boolean to indicate bid or ask orders. Returns prices and quantities as arrays.

```javascript
async getLevel2Range(poolKey: string, priceLow: number, priceHigh: number, isBid: boolean): Promise<{ prices: Array<number>, quantities: Array<number> }>
```

--------------------------------

### DeepBook Pool Registered Event Structure

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Details the structure of a DeepBook pool registered event. Includes pool ID, configuration details, and on-chain timestamps.

```json
[
    {
        "event_digest": "0xabc123...",
        "digest": "0xdef456...",
        "sender": "0x1111...",
        "checkpoint": 12345678,
        "checkpoint_timestamp_ms": 1738000000000,
        "package": "0x2222...",
        "pool_id": "0x1234...",
        "config_json": {
            "base_margin_pool_id": "0x5678...",
            "quote_margin_pool_id": "0x9abc...",
            "risk_ratios": {
                "min_withdraw_risk_ratio": 1200000000,
                "min_borrow_risk_ratio": 1100000000,
                "liquidation_risk_ratio": 1000000000,
                "target_liquidation_risk_ratio": 1050000000
            },
            "user_liquidation_reward": 50000000,
            "pool_liquidation_reward": 10000000,
            "enabled": true
        },
        "onchain_timestamp": 1738000000000
    }
]
```

--------------------------------

### Retrieve Vault Balances

Source: https://docs.sui.io/standards/deepbook/v3-sdk/pools

Use `vaultBalances` to fetch the vault balances for a given pool. It requires the pool key and returns the base, quote, and deep balance amounts.

```typescript
async vaultBalances(poolKey: string): Promise<{ base: number, quote: number, deep: number }>
```

--------------------------------

### Stake API

Source: https://docs.sui.io/standards/deepbook/v3-sdk/staking-governance

Allows users to stake a specified amount into a particular pool. This function requires pool and balance manager keys.

```APIDOC
## POST /stake

### Description
Use `stake` to stake an amount you specify into a specific pool. The call returns a `Transaction` object.

### Method
POST

### Endpoint
/stake

### Parameters
#### Request Body
- **poolKey** (string) - Required - String that identifies the pool.
- **balanceManagerKey** (string) - Required - String that identifies the balance manager.
- **stakeAmount** (number) - Required - Number representing the amount to stake.

### Request Example
```json
{
  "poolKey": "DBUSDT_DBUSDC",
  "balanceManagerKey": "MANAGER_1",
  "stakeAmount": 100
}
```

### Response
#### Success Response (200)
- **transaction** (Transaction) - The transaction object for the staking operation.

#### Response Example
```json
{
  "transaction": "<transaction_object>"
}
```
```

--------------------------------

### Vote API

Source: https://docs.sui.io/standards/deepbook/v3-sdk/staking-governance

Enables users to vote on an existing governance proposal. Requires pool, balance manager, and proposal IDs.

```APIDOC
## POST /vote

### Description
Use `vote` to vote on a proposal. The call returns a `Transaction` object.

### Method
POST

### Endpoint
/vote

### Parameters
#### Request Body
- **poolKey** (string) - Required - String that identifies the pool.
- **balanceManagerKey** (string) - Required - String that identifies the balance manager.
- **proposal_id** (string) - Required - String that identifies the proposal to vote on.

### Request Example
```json
{
  "poolKey": "DBUSDT_DBUSDC",
  "balanceManagerKey": "MANAGER_1",
  "proposal_id": "0x123456789"
}
```

### Response
#### Success Response (200)
- **transaction** (Transaction) - The transaction object for the vote.

#### Response Example
```json
{
  "transaction": "<transaction_object>"
}
```
```

--------------------------------

### Set Balance Manager Referral for a Pool

Source: https://docs.sui.io/standards/deepbook/v3-sdk/balance-manager

Use `setBalanceManagerReferral` to set a pool-specific referral for the balance manager. This operation requires a `tradeCap` for permission checking. The function returns a transaction object.

```typescript
setBalanceManagerReferral = (tx: Transaction, managerKey: string, referral: string, tradeCap: TransactionArgument) => {
  tx.add(this.balanceManager.setBalanceManagerReferral(managerKey, referral, tradeCap));
};
```

--------------------------------

### Execute Conditional Orders

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/tpsl

Executes conditional orders that have been triggered. This is a permissionless function. Returns a function that takes a Transaction object.

```APIDOC
## Execute Conditional Orders

### Description
Use `executeConditionalOrders` to execute conditional orders that have been triggered. This is a permissionless function that can be called by anyone. The call returns a function that takes a `Transaction` object.

### Method
`executeConditionalOrders`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **marginManagerKey** (String) - Required - Identifies the margin manager.
- **maxOrdersToExecute** (Number) - Optional - Maximum number of orders to execute in this call.

### Request Example
```tsx
// Example: Execute up to 10 triggered conditional orders for 'MARGIN_MANAGER_1'
traderClient.marginTPSL.executeConditionalOrders({
	marginManagerKey: 'MARGIN_MANAGER_1',
	maxOrdersToExecute: 10,
});
```

### Response
#### Success Response (200)
Returns a function that takes a `Transaction` object.

#### Response Example
`Function`
```

--------------------------------

### Asset Object Structure

Source: https://docs.sui.io/standards/deepbook/v3-indexer

Defines the structure of an asset object returned by the API. Each asset includes its unique ID, name, contract address, URL, and flags for deposit and withdrawal capabilities.

```json
{
	"unified_cryptoasset_id": "string",
	"name": "string",
	"contractAddress": "string",
	"contractAddressUrl": "string",
	"can_deposit": "string (true | false)",
	"can_withdraw": "string (true | false)"
}
```

--------------------------------

### Calculate Base Quantity Out (TypeScript)

Source: https://docs.sui.io/standards/deepbook/v3-sdk/pools

The `getBaseQuantityOut` function calculates the expected base quantity when a given quote quantity is traded. It requires `poolKey` and `quoteQuantity` and returns an object with `quoteQuantity`, `baseOut`, `quoteOut`, and `deepRequired` for a dry run.

```typescript
{
  quoteQuantity: number,
  baseOut: number,
  quoteOut: number,
  deepRequired: number
}
```

--------------------------------

### Margin Manager States

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Retrieves the current state of margin managers, filtered by maximum risk ratio and DeepBook pool ID. This endpoint is valuable for identifying positions close to liquidation.

```APIDOC
## GET /margin_manager_states

### Description
Returns the current state of margin managers. This endpoint is useful for monitoring positions that may be at risk of liquidation.

### Method
GET

### Endpoint
/margin_manager_states

#### Query Parameters
- **max_risk_ratio** (float) - Optional - Filter to return only margin managers with a risk ratio below this threshold; useful for finding liquidation opportunities.
- **deepbook_pool_id** (string) - Optional - Filter by specific DeepBook pool.
- **start_time** (integer) - Optional - Start of time range in Unix timestamp seconds (defaults to 24 hours ago).
- **end_time** (integer) - Optional - End of time range in Unix timestamp seconds (defaults to current time).
- **limit** (integer) - Optional - Maximum number of results to return (defaults to 1).

### Response
#### Success Response (200)
- **margin_manager_id** (string) - The ID of the margin manager.
- **deepbook_pool_id** (string) - The ID of the associated DeepBook pool.
- **base_asset_id** (string) - The ID of the base asset.
- **quote_asset_id** (string) - The ID of the quote asset.
- **risk_ratio** (integer) - The current risk ratio of the margin manager.
- **base_asset_amount** (string) - The current amount of the base asset held by the margin manager.
- **quote_asset_amount** (string) - The current amount of the quote asset held by the margin manager.
- **base_debt** (string) - The current base asset debt of the margin manager.
- **quote_debt** (string) - The current quote asset debt of the margin manager.
- **last_updated_timestamp_ms** (integer) - The timestamp in milliseconds of the last update to the margin manager's state.

#### Response Example
```json
[
    {
        "margin_manager_id": "0x1234...",
        "deepbook_pool_id": "0x5678...",
        "base_asset_id": "0xabcd...",
        "quote_asset_id": "0xefgh...",
        "risk_ratio": 750000000,
        "base_asset_amount": "1000000000",
        "quote_asset_amount": "2000000000",
        "base_debt": "500000000",
        "quote_debt": "1000000000",
        "last_updated_timestamp_ms": 1738000000000
    }
]
```
```

--------------------------------

### Add DEEP Price Point (Admin)

Source: https://docs.sui.io/standards/deepbook/v3-sdk/pools

Use `addDeepPricePoint` to add a DEEP price point for a target pool, using a reference pool. This administrative function returns a transaction object.

```javascript
function addDeepPricePoint(targetPoolKey: string, referencePoolKey: string): (tx: Transaction) => Transaction
```

--------------------------------

### Calculate Quote Quantity Out (TypeScript)

Source: https://docs.sui.io/standards/deepbook/v3-sdk/pools

The `getQuoteQuantityOut` function calculates the expected quote quantity when a given base quantity is traded. It requires `poolKey` and `baseQuantity` and returns an object with `baseQuantity`, `baseOut`, `quoteOut`, and `deepRequired` for a dry run.

```typescript
{
  baseQuantity: number,
  baseOut: number,
  quoteOut: number,
  deepRequired: number
}
```

--------------------------------

### Claim Rebates Function - TypeScript

Source: https://docs.sui.io/standards/deepbook/v3-sdk/staking-governance

The `claimRebates` function is used to claim maker and taker rebates for a given balance manager within a specific pool. It requires the pool key and balance manager key. The function returns a Transaction object.

```typescript
claimRebates = (poolKey: string, balanceManagerKey: string) => (tx: Transaction) => {}
```

--------------------------------

### Cancel Multiple Orders

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/orders

Cancels multiple orders specified in a vector. All orders must be owned by the `balance_manager`. The operation is atomic: if any order fails to cancel, none of the orders will be canceled. Successful cancellations result in orders being removed from the book and the `balance_manager`'s open orders.

```APIDOC
## DELETE /orders/batch

### Description
Cancels multiple orders within a vector. The orders must be owned by the `balance_manager`. If any order fails to cancel, no orders will be cancelled (atomic operation).

### Method
DELETE

### Endpoint
/orders/batch

### Parameters
#### Request Body
- **order_ids** (array) - Required - A list of order IDs to cancel.
  - **order_id** (string) - Required - The unique identifier of an order to cancel.

### Request Example
```json
{
  "order_ids": ["0x123abc", "0x456def", "0x789ghi"]
}
```

### Response
#### Success Response (200)
This endpoint does not return any specific data upon success. If the transaction is successful, all specified orders are canceled. An `OrderCanceled` event is emitted for each successfully canceled order.

#### Response Example
(No response body for success)
```

--------------------------------

### Withdraw Settled Amounts Permissionless

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/orders

Withdraws settled amounts to the `balance_manager` without requiring a `TradeProof`. This is a permissionless version that anyone can call to settle a `balance_manager`'s funds.

```APIDOC
## POST /withdraw/settled/permissionless

### Description
Withdraws settled amounts to the `balance_manager` without requiring a `TradeProof`. This is a permissionless version that anyone can call to settle a balance manager's funds.

### Method
POST

### Endpoint
/withdraw/settled/permissionless

### Parameters
#### Query Parameters
- **balance_manager_address** (string) - Required - The address of the balance manager whose funds are to be settled.

### Request Example
(No request body)

### Response
#### Success Response (200)
This endpoint does not return any specific data upon success. If the transaction is successful, settled amounts for the specified `balance_manager` are transferred.

#### Response Example
(No response body for success)
```

--------------------------------

### Cancel Order

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/orders

Cancels a single order. The order must be owned by the `balance_manager`. Upon successful cancellation, the order is removed from the book and the `balance_manager`'s open orders, and the `balance_manager`'s balance is updated with the order's remaining quantity. This function does not return any value; success is indicated by the emission of an `OrderCanceled` event.

```APIDOC
## DELETE /orders/{order_id}

### Description
Cancels a single order. The order must be owned by the `balance_manager`. The order is removed from the book and the `balance_manager` open orders. The `balance_manager` balance is updated with the order's remaining quantity.

### Method
DELETE

### Endpoint
/orders/{order_id}

### Parameters
#### Path Parameters
- **order_id** (string) - Required - The unique identifier of the order to cancel.

### Request Example
(No request body)

### Response
#### Success Response (200)
This endpoint does not return any specific data upon success. DeepBookV3 emits an `OrderCanceled` event upon successful cancellation.

#### Response Example
(No response body for success)
```

--------------------------------

### BalanceManager referral functions

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/referral

Functions available on the BalanceManager to associate or disassociate a referral.

```APIDOC
## Set referral on BalanceManager

### Description
Associate a `BalanceManager` with a pool-specific referral. Requires a `TradeCap` to authorize the operation. Once set, all trades executed by this balance manager in the referral's pool will generate referral fees according to the referral's multiplier. Any previously set referral for the same pool is replaced.

### Method
POST

### Endpoint
/balance_manager/referral

### Parameters
#### Request Body
- **balance_manager_id** (ID) - Required - The ID of the BalanceManager.
- **pool_id** (ID) - Required - The ID of the pool.
- **referral_id** (ID) - Required - The ID of the referral to associate.
- **trade_cap** (TradeCap) - Required - The TradeCap to authorize the operation.

### Response
#### Success Response (200)
- **message** (string) - Indicates success.

#### Response Example
```json
{
  "message": "Referral set successfully for BalanceManager."
}
```

## Unset referral from BalanceManager

### Description
Remove the referral association from a `BalanceManager` for a specific pool. Requires a `TradeCap` to authorize the operation. After unsetting, trades in that pool will no longer generate referral fees.

### Method
DELETE

### Endpoint
/balance_manager/referral

### Parameters
#### Request Body
- **balance_manager_id** (ID) - Required - The ID of the BalanceManager.
- **pool_id** (ID) - Required - The ID of the pool.
- **trade_cap** (TradeCap) - Required - The TradeCap to authorize the operation.

### Response
#### Success Response (200)
- **message** (string) - Indicates success.

#### Response Example
```json
{
  "message": "Referral unset successfully for BalanceManager."
}
```

## Get referral ID from BalanceManager

### Description
Retrieve the referral ID currently associated with a `BalanceManager` for a specific pool, if any. Returns `Option<ID>` which is `none` if no referral is set for that pool.

### Method
GET

### Endpoint
/balance_manager/{balance_manager_id}/referral/{pool_id}

### Parameters
#### Path Parameters
- **balance_manager_id** (ID) - Required - The ID of the BalanceManager.
- **pool_id** (ID) - Required - The ID of the pool.

### Response
#### Success Response (200)
- **referral_id** (ID | null) - The associated referral ID, or null if none is set.

#### Response Example
```json
{
  "referral_id": "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321"
}
```
```

--------------------------------

### DeepBook Pool Registry Updated Event Structure

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Defines the structure for DeepBook pool registry updated events. It includes event identifiers, pool ID, and the updated 'enabled' status.

```json
[
    {
        "event_digest": "0xabc123...",
        "digest": "0xdef456...",
        "sender": "0x1111...",
        "checkpoint": 12345678,
        "checkpoint_timestamp_ms": 1738000000000,
        "package": "0x2222...",
        "pool_id": "0x1234...",
        "enabled": true,
        "onchain_timestamp": 1738000000000
    }
]
```

--------------------------------

### EWMA Z-Score Calculation and Penalty Trigger (Shell)

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/ewma

This snippet demonstrates the core formula for calculating the z-score of the current gas price relative to the EWMA's mean and standard deviation. It also shows the conditional logic for applying an additional taker fee if the z-score exceeds a predefined threshold.

```shell
z_score = (current_gas_price - mean) / standard_deviation

if z_score > z_score_threshold:
    apply additional_taker_fee
```

--------------------------------

### Protocol Fees Withdrawn Event Structure

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Defines the structure for protocol fees withdrawn events. Contains event identifiers, sender, checkpoint, and specific fee withdrawal details.

```json
[
    {
        "event_digest": "0xabc123...",
        "digest": "0xdef456...",
        "sender": "0x1111...",
        "checkpoint": 12345678,
        "checkpoint_timestamp_ms": 1738000000000,
        "package": "0x2222...",
        "margin_pool_id": "0x1234...",
        "margin_pool_cap_id": "0x5678...",
        "maintainer_fees": 1000000,
        "onchain_timestamp": 1738000000000
    }
]
```

--------------------------------

### Add Conditional Order

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/tpsl

Adds a conditional order that executes when a specified price condition is met. Returns a function that takes a Transaction object.

```APIDOC
## Add Conditional Order

### Description
Use `addConditionalOrder` to add a conditional order that executes when a price condition is met. The call returns a function that takes a `Transaction` object.

### Method
`addConditionalOrder`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **marginManagerKey** (String) - Required - Identifies the margin manager.
- **conditionalOrderId** (Number) - Required - Unique ID for this conditional order.
- **triggerBelowPrice** (Boolean) - Required - Indicates whether to trigger when price falls below the trigger price.
- **triggerPrice** (Number) - Required - The price at which to trigger the order.
- **pendingOrder** (Object) - Required - Contains the order details (either `PendingLimitOrderParams` or `PendingMarketOrderParams`).

### Request Example
```tsx
// Example: Create a stop loss order that sells when price drops below 2.0
traderClient.marginTPSL.addConditionalOrder({
	marginManagerKey: 'MARGIN_MANAGER_1',
	conditionalOrderId: 1,
	triggerBelowPrice: true, // Trigger when price falls below
	triggerPrice: 2.0,
	pendingOrder: {
		clientOrderId: 100,
		quantity: 50,
		isBid: false, // Sell order
		payWithDeep: true,
	},
});
```

### Response
#### Success Response (200)
Returns a function that takes a `Transaction` object.

#### Response Example
`Function`
```

--------------------------------

### Update Interest Parameters

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/maintainer

Updates the interest rate parameters for a margin pool. Returns a transaction object for further processing.

```APIDOC
## POST /maintainer/updateInterestParams

### Description
Use `updateInterestParams` to update the interest rate parameters for a margin pool. The call returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/maintainer/updateInterestParams

### Parameters
#### Query Parameters
- **coinKey** (String) - Required - Identifies the margin pool asset.
- **marginPoolCap** (String) - Required - Represents the margin pool capability ID.
- **interestConfig** (InterestConfigParams) - Required - Object with new interest parameters:
  - **baseRate** (Number) - Base interest rate.
  - **baseSlope** (Number) - Interest rate slope before kink.
  - **optimalUtilization** (Number) - The kink point (e.g., 0.8).
  - **excessSlope** (Number) - Interest rate slope after kink.

### Request Example
```json
{
  "coinKey": "USDC",
  "marginPoolCap": "0xdef...",
  "interestConfig": {
    "baseRate": 0.025,
    "baseSlope": 0.06,
    "optimalUtilization": 0.8,
    "excessSlope": 0.22
  }
}
```

### Response
#### Success Response (200)
- **transaction** (Function) - A function that takes a `Transaction` object to finalize the update.

#### Response Example
```json
{
  "transaction": "<function_reference>"
}
```
```

--------------------------------

### Update Pool Allowed Versions (Admin)

Source: https://docs.sui.io/standards/deepbook/v3-sdk/pools

Use `updatePoolAllowedVersions` to modify the allowed package versions for a pool. This administrative function returns a transaction object.

```javascript
function updatePoolAllowedVersions(poolKey: string): (tx: Transaction) => Transaction
```

--------------------------------

### Check if Pool is Whitelisted

Source: https://docs.sui.io/standards/deepbook/v3-sdk/pools

Use `whitelisted` to determine if a pool is whitelisted. It requires the pool key and returns a boolean indicating its whitelisted status.

```javascript
async whitelisted(poolKey: string): Promise<boolean>
```

--------------------------------

### Pause Cap Updated Event Structure

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Represents the data returned for a pause cap updated event. Includes event metadata and the new 'allowed' status for the pause capability.

```json
[
    {
        "event_digest": "0xabc123...",
        "digest": "0xdef456...",
        "sender": "0x1111...",
        "checkpoint": 12345678,
        "checkpoint_timestamp_ms": 1738000000000,
        "package": "0x2222...",
        "pause_cap_id": "0x1234...",
        "allowed": true,
        "onchain_timestamp": 1738000000000
    }
]
```

--------------------------------

### Deposited Assets Response Format

Source: https://docs.sui.io/standards/deepbook/v3-indexer

The response format for the deposited_assets endpoint. It's an array of objects, where each object contains a balance manager ID and a list of assets deposited into it.

```json
[
    {
        "balance_manager_id": "string",
        "assets": ["string", ...]
    }
]
```

--------------------------------

### Cancel All Orders in DeepBook

Source: https://docs.sui.io/standards/deepbook/v3-sdk/orders

Illustrates how to cancel all open orders for a specific balance manager within a DeepBook pool. This function requires the pool key and balance manager key. It returns a transaction object that can be used to submit the cancellation request.

```typescript
/**
 * @description Cancel all open orders for a balance manager
 * @param {string} poolKey The key to identify the pool
 * @param {string} balanceManagerKey The key to identify the BalanceManager
 * @returns A function that takes a Transaction object
 */
cancelAllOrders = (poolKey: string, balanceManagerKey: string) => (tx: Transaction) => {};

// Example usage in DeepBookMarketMaker class
// Cancel order 12345678 in SUI_DBUSDC pool
cancelOrder = (tx: Transaction) => {
	const poolKey = 'SUI_DBUSDC'; // Pool key, check constants.ts for more
	const managerKey = 'MANAGER_1'; // Balance manager key, initialized during client creation by user
	tx.add(this.deepBook.cancelAllOrders(poolKey, managerKey));
};

```

--------------------------------

### Maintainer Fees Withdrawn Event Structure

Source: https://docs.sui.io/standards/deepbook/-margin-indexer

Represents the data structure for a maintainer fees withdrawn event. Includes details like sender, checkpoint, and package information.

```json
[
    {
        "event_digest": "0xabc123...",
        "digest": "0xdef456...",
        "sender": "0x1111...",
        "checkpoint": 12345678,
        "checkpoint_timestamp_ms": 1738000000000,
        "package": "0x2222...",
        "maintainer_cap_id": "0x1234...",
        "allowed": true,
        "onchain_timestamp": 1738000000000
    }
]
```

--------------------------------

### Execute Triggered Orders as Keeper (TypeScript)

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/tpsl

Enables a keeper to execute pending conditional orders that have met their trigger conditions. This function takes the margin manager key and a limit for the number of orders to execute, processing them within a given Transaction object.

```typescript
const executeOrders = (tx: Transaction) => {
	const managerKey = 'MARGIN_MANAGER_1';
	// Execute up to 10 triggered orders
	traderClient.marginTPSL.executeConditionalOrders(managerKey, 10)(tx);
};
```

--------------------------------

### Claim referral rewards

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/referral

Claim accumulated referral fees for a pool referral. Only the referral owner can claim rewards. Returns three Coin objects representing the accumulated fees in base asset, quote asset, and DEEP tokens.

```APIDOC
## Claim referral rewards

### Description
Claim accumulated referral fees for a pool referral. Only the referral owner can claim rewards. Returns three `Coin` objects representing the accumulated fees in base asset, quote asset, and DEEP tokens.

### Method
POST

### Endpoint
/referrals/{referral_id}/claim

### Parameters
#### Path Parameters
- **referral_id** (ID) - Required - The ID of the referral whose rewards are to be claimed.

### Response
#### Success Response (200)
- **base_asset_coins** (Coin[]) - An array of Coin objects for the base asset rewards.
- **quote_asset_coins** (Coin[]) - An array of Coin objects for the quote asset rewards.
- **deep_token_coins** (Coin[]) - An array of Coin objects for the DEEP token rewards.

#### Response Example
```json
{
  "base_asset_coins": [
    {
      "id": "0x1111...",
      "value": "1000"
    }
  ],
  "quote_asset_coins": [
    {
      "id": "0x2222...",
      "value": "500"
    }
  ],
  "deep_token_coins": [
    {
      "id": "0x3333...",
      "value": "200"
    }
  ]
}
```
```

--------------------------------

### Retrieve Locked Balance

Source: https://docs.sui.io/standards/deepbook/v3-sdk/pools

Use `lockedBalance` to query the locked balance within a pool's `BalanceManager`. It requires the pool key and the balance manager key. Returns an `Order` struct containing base, quote, and deep balance values.

```typescript
async lockedBalance(poolKey: string, balanceManagerKey: string): Promise<{ base: number, quote: number, deep: number }>
```

--------------------------------

### Vote API

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/staking-governance

Enables users with non-zero voting power to cast their vote on a governance proposal. If a user has already voted on a different proposal in the current epoch, their previous vote is removed and recast.

```APIDOC
## Vote

### Description
Enables users with non-zero voting power to cast their vote on a governance proposal. If a user has already voted on a different proposal in the current epoch, their previous vote is removed and recast.

### Method
POST

### Endpoint
/pool/vote

### Parameters
#### Request Body
- **proposal_id** (string) - Required - The ID of the proposal to vote for.
- **voting_power** (number) - Required - The amount of voting power to use for this proposal.

### Request Example
```json
{
  "proposal_id": "prop_12345",
  "voting_power": 5000
}
```

### Response
#### Success Response (200)
- **message** (string) - Confirmation message of successful voting.

#### Response Example
```json
{
  "message": "Vote cast successfully."
}
```
```

--------------------------------

### Stake Function - TypeScript

Source: https://docs.sui.io/standards/deepbook/v3-sdk/staking-governance

The `stake` function allows users to stake a specified amount into a particular pool. It requires the pool key, balance manager key, and the amount to stake. The function returns a Transaction object.

```typescript
stake = (
  poolKey: string, 
  balanceManagerKey: string, 
  stakeAmount: number
) => (tx: Transaction) => {}

// Custom function to stake 100 DEEP in DeepBookMarketMaker class
stake = (tx: Transaction) => {
  const poolKey = 'DBUSDT_DBUSDC';
  const balanceManagerKey = 'MANAGER_1';
  tx.add(this.governance.stake(poolKey, balanceManagerKey, 100));
};
```

--------------------------------

### EWMA Penalty Threshold Calculation (Shell)

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/ewma

This snippet illustrates how the penalty threshold is calculated using the EWMA's mean, standard deviation, and the z-score threshold. This threshold determines the gas price level at which the additional taker fee will be applied.

```shell
Penalty Threshold = Mean + (Z-Score Threshold × Std Dev)
Penalty Threshold = 1,478 + (3.0 × 6,578)
Penalty Threshold = 1,478 + 19,734
Penalty Threshold ≈ 21,212
```

--------------------------------

### Withdraw Protocol Fees

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/maintainer

Withdraws accumulated protocol fees from a margin pool. Returns a transaction object for further processing.

```APIDOC
## POST /maintainer/withdrawProtocolFees

### Description
Use `withdrawProtocolFees` to withdraw accumulated protocol fees from a margin pool. The call returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/maintainer/withdrawProtocolFees

### Parameters
#### Query Parameters
- **coinKey** (String) - Required - Identifies the margin pool asset.

### Request Example
```json
{
  "coinKey": "USDC"
}
```

### Response
#### Success Response (200)
- **transaction** (Function) - A function that takes a `Transaction` object to finalize the withdrawal.

#### Response Example
```json
{
  "transaction": "<function_reference>"
}
```
```

--------------------------------

### Update referral multiplier

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/referral

Update the multiplier for an existing pool referral. Only the referral owner can update the multiplier. The new multiplier must be a multiple of 0.1 and cannot exceed 2.0.

```APIDOC
## Update referral multiplier

### Description
Update the multiplier for an existing pool referral. Only the referral owner can update the multiplier. The new multiplier must be a multiple of 0.1 and cannot exceed 2.0.

### Method
PUT

### Endpoint
/referrals/{referral_id}/multiplier

### Parameters
#### Path Parameters
- **referral_id** (ID) - Required - The ID of the referral to update.

#### Request Body
- **multiplier** (f64) - Required - The new referral multiplier, must be a multiple of 0.1 and not exceed 2.0.

### Request Example
```json
{
  "multiplier": 0.75
}
```

### Response
#### Success Response (200)
- **message** (string) - Indicates success.

#### Response Example
```json
{
  "message": "Referral multiplier updated successfully."
}
```
```

--------------------------------

### Cancel All Orders

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/orders

Cancels all open orders placed by the `balance_manager` in the pool. This is a convenience function that efficiently cancels every order associated with the `balance_manager`.

```APIDOC
## DELETE /orders/all

### Description
Cancels all open orders placed by the balance manager in the pool. This is a convenience function that cancels every order associated with the balance manager.

### Method
DELETE

### Endpoint
/orders/all

### Parameters
(No parameters)

### Request Example
(No request body)

### Response
#### Success Response (200)
This endpoint does not return any specific data upon success. If the transaction is successful, all open orders for the `balance_manager` are canceled. An `OrderCanceled` event is emitted for each successfully canceled order.

#### Response Example
(No response body for success)
```

--------------------------------

### OHLCV Candlestick Data Response Format

Source: https://docs.sui.io/standards/deepbook/v3-indexer

The structure of the response for the OHLCV candlestick data endpoint. It includes a 'candles' array where each element represents a candlestick with timestamp, open, high, low, close, and volume.

```json
{
    "candles": [
        [timestamp, open, high, low, close, volume],
        ...
    ]
}
```

--------------------------------

### Unset Balance Manager Referral for a Pool

Source: https://docs.sui.io/standards/deepbook/v3-sdk/balance-manager

Use `unsetBalanceManagerReferral` to remove a referral from the balance manager for a specific pool. This operation requires a `tradeCap` for permission checking. The function returns a transaction object.

```typescript
unsetBalanceManagerReferral = (tx: Transaction, managerKey: string, poolKey: string, tradeCap: TransactionArgument) => {
  tx.add(this.balanceManager.unsetBalanceManagerReferral(managerKey, poolKey, tradeCap));
};
```

--------------------------------

### Modifying and Canceling Orders

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/orders

Functions to modify the quantity of an existing order or cancel one or more orders.

```APIDOC
## PUT /orders/modify

### Description
Modifies the quantity of an existing order. Returns a function that takes a `Transaction` object.

### Method
PUT

### Endpoint
/orders/modify

### Parameters
#### Request Body
- **marginManagerKey** (String) - Required - Identifies the margin manager.
- **orderId** (String) - Required - The protocol `orderId` generated during order placement.
- **newQuantity** (Number) - Required - The new order quantity.

### Response
#### Success Response (200)
- **transactionFunction** (Function) - A function that accepts a `Transaction` object to finalize the modification.

## DELETE /orders/cancel

### Description
Cancels a specific order for a margin manager. Returns a function that takes a `Transaction` object.

### Method
DELETE

### Endpoint
/orders/cancel

### Parameters
#### Request Body
- **marginManagerKey** (String) - Required - Identifies the margin manager.
- **orderId** (String) - Required - The protocol `orderId` of the order to cancel.

### Response
#### Success Response (200)
- **transactionFunction** (Function) - A function that accepts a `Transaction` object to finalize the cancellation.

## DELETE /orders/cancel-multiple

### Description
Cancels multiple orders for a margin manager. Returns a function that takes a `Transaction` object.

### Method
DELETE

### Endpoint
/orders/cancel-multiple

### Parameters
#### Request Body
- **marginManagerKey** (String) - Required - Identifies the margin manager.
- **orderIds** (Array<String>) - Required - An array of protocol `orderId`s to cancel.

### Response
#### Success Response (200)
- **transactionFunction** (Function) - A function that accepts a `Transaction` object to finalize the cancellation.

## DELETE /orders/cancel-all

### Description
Cancels all open orders for a margin manager. Returns a function that takes a `Transaction` object.

### Method
DELETE

### Endpoint
/orders/cancel-all

### Parameters
#### Request Body
- **marginManagerKey** (String) - Required - Identifies the margin manager.

### Response
#### Success Response (200)
- **transactionFunction** (Function) - A function that accepts a `Transaction` object to finalize the cancellation.
```

--------------------------------

### Withdraw Default Referral Fees

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/maintainer

Withdraws default referral fees from a margin pool. Returns a transaction object for further processing.

```APIDOC
## POST /maintainer/adminWithdrawDefaultReferralFees

### Description
Use `adminWithdrawDefaultReferralFees` to withdraw default referral fees from a margin pool. The call returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/maintainer/adminWithdrawDefaultReferralFees

### Parameters
#### Query Parameters
- **coinKey** (String) - Required - Identifies the margin pool asset.

### Request Example
```json
{
  "coinKey": "USDC"
}
```

### Response
#### Success Response (200)
- **transaction** (Function) - A function that takes a `Transaction` object to finalize the withdrawal.

#### Response Example
```json
{
  "transaction": "<function_reference>"
}
```
```

--------------------------------

### Cancel All Conditional Orders

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/tpsl

Cancels all conditional orders for a given margin manager. Returns a function that takes a Transaction object.

```APIDOC
## Cancel All Conditional Orders

### Description
Use `cancelAllConditionalOrders` to cancel all conditional orders for a margin manager. The call returns a function that takes a `Transaction` object.

### Method
`cancelAllConditionalOrders`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **marginManagerKey** (String) - Required - Identifies the margin manager.

### Request Example
```tsx
// Example: Cancel all conditional orders for 'MARGIN_MANAGER_1'
traderClient.marginTPSL.cancelAllConditionalOrders({
	marginManagerKey: 'MARGIN_MANAGER_1',
});
```

### Response
#### Success Response (200)
Returns a function that takes a `Transaction` object.

#### Response Example
`Function`
```

--------------------------------

### Withdraw Liquidity from Margin Pool (TypeScript)

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/margin-pool

Withdraws supplied assets from a margin pool. If no amount is specified, all available shares are withdrawn. This function returns a transaction builder that accepts a Transaction object.

```typescript
// Example: Withdraw 500 USDC from the margin pool
withdrawLiquidity = (tx: Transaction) => {
	const coinKey = 'USDC';
	const supplierCapId = '0x...';
	const supplierCap = tx.object(supplierCapId);

	tx.add(this.marginPoolContract.withdrawFromMarginPool(coinKey, supplierCap, 500));
};

// Example: Withdraw all available liquidity
withdrawAll = (tx: Transaction) => {
	const coinKey = 'USDC';
	const supplierCapId = '0x...';
	const supplierCap = tx.object(supplierCapId);

	// No amount specified = withdraw all
	tx.add(this.marginPoolContract.withdrawFromMarginPool(coinKey, supplierCap));
};
```

--------------------------------

### Cancel Conditional Order

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/tpsl

Cancels a specific conditional order. Returns a function that takes a Transaction object.

```APIDOC
## Cancel Conditional Order

### Description
Use `cancelConditionalOrder` to cancel a specific conditional order. The call returns a function that takes a `Transaction` object.

### Method
`cancelConditionalOrder`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **marginManagerKey** (String) - Required - Identifies the margin manager.
- **conditionalOrderId** (String) - Required - The ID of the conditional order to cancel.

### Request Example
```tsx
// Example: Cancel a conditional order with ID 'order_123'
traderClient.marginTPSL.cancelConditionalOrder({
	marginManagerKey: 'MARGIN_MANAGER_1',
	conditionalOrderId: 'order_123',
});
```

### Response
#### Success Response (200)
Returns a function that takes a `Transaction` object.

#### Response Example
`Function`
```

--------------------------------

### Withdraw Maintainer Fees

Source: https://docs.sui.io/standards/deepbook/-margin-sdk/maintainer

Withdraws accumulated maintainer fees from a margin pool. Returns a transaction object for further processing.

```APIDOC
## POST /maintainer/withdrawMaintainerFees

### Description
Use `withdrawMaintainerFees` to withdraw accumulated maintainer fees from a margin pool. The call returns a function that takes a `Transaction` object.

### Method
POST

### Endpoint
/maintainer/withdrawMaintainerFees

### Parameters
#### Query Parameters
- **coinKey** (String) - Required - Identifies the margin pool asset.
- **marginPoolCap** (String) - Required - Represents the margin pool capability ID.

### Request Example
```json
{
  "coinKey": "USDC",
  "marginPoolCap": "0xdef..."
}
```

### Response
#### Success Response (200)
- **transaction** (Function) - A function that takes a `Transaction` object to finalize the withdrawal.

#### Response Example
```json
{
  "transaction": "<function_reference>"
}
```
```

--------------------------------

### Unstake Function - TypeScript

Source: https://docs.sui.io/standards/deepbook/v3-sdk/staking-governance

The `unstake` function enables users to withdraw staked assets from a specific pool. It requires the pool key and balance manager key. The function returns a Transaction object.

```typescript
unstake = (
  poolKey: string, 
  balanceManagerKey: string
) => (tx: Transaction) => {}

// Custom function to unstake in DeepBookMarketMaker class
unstake = (tx: Transaction) => {
  const poolKey = 'DBUSDT_DBUSDC';
  const balanceManagerKey = 'MANAGER_1';
  tx.add(this.governance.unstake(poolKey, balanceManagerKey));
};
```

--------------------------------

### Revoke Trade Capability and Associated Capabilities

Source: https://docs.sui.io/standards/deepbook/v3-sdk/balance-manager

Use `revokeTradeCap` to revoke a `TradeCap`. This action also revokes the associated `DepositCap` and `WithdrawCap`. The function requires the manager key and the trade cap ID. It returns a transaction object.

```typescript
revokeTradeCap = (tx: Transaction, managerKey: string, tradeCapId: string) => {
  tx.add(this.balanceManager.revokeTradeCap(managerKey, tradeCapId));
};
```

--------------------------------

### Modify Order

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/orders

Modifies an existing order identified by `order_id`. The `new_quantity` must be less than the original quantity and greater than the filled quantity. The order must not have already expired. This function does not return any value; success is assumed if the transaction is successful.

```APIDOC
## PUT /orders/{order_id}

### Description
Modifies an order given `order_id` and `new_quantity`. New quantity must be less than the original quantity and more than the filled quantity. Order must not have already expired.

### Method
PUT

### Endpoint
/orders/{order_id}

### Parameters
#### Path Parameters
- **order_id** (string) - Required - The unique identifier of the order to modify.

#### Request Body
- **modification_data** (object) - Required - Contains the new details for the order modification.
  - **new_quantity** (number) - Required - The new quantity for the order. Must be less than the original quantity and more than the filled quantity.

### Request Example
```json
{
  "modification_data": {
    "new_quantity": 75.0
  }
}
```

### Response
#### Success Response (200)
This endpoint does not return any specific data upon success. If the transaction is successful, the modification is assumed to be successful.

#### Response Example
(No response body for success)
```

--------------------------------

### Vote Function - TypeScript

Source: https://docs.sui.io/standards/deepbook/v3-sdk/staking-governance

The `vote` function allows users to cast their vote on an existing governance proposal. It requires the pool key, balance manager key, and the proposal ID. The function returns a Transaction object.

```typescript
vote = (
  poolKey: string, 
  balanceManagerKey: string, 
  proposal_id: string
) => (tx: Transaction) => {}

// Custom function to vote in DeepBookMarketMaker class
vote = (tx: Transaction) => {
  const poolKey = 'DBUSDT_DBUSDC';
  const balanceManagerKey = 'MANAGER_1';
  const proposalID = '0x123456789';
  tx.add(this.governance.vote(poolKey, balanceManagerKey, proposalID));
};
```

--------------------------------

### Withdraw Settled Amounts

Source: https://docs.sui.io/standards/deepbook/v3/contract-information/orders

Withdraws settled amounts to the `balance_manager`. All orders automatically withdraw settled amounts, but this function can be called explicitly to withdraw all available settled funds from the pool.

```APIDOC
## POST /withdraw/settled

### Description
Withdraws settled amounts to the `balance_manager`. All orders automatically withdraw settled amounts. This can be called explicitly to withdraw all settled funds from the pool.

### Method
POST

### Endpoint
/withdraw/settled

### Parameters
(No parameters)

### Request Example
(No request body)

### Response
#### Success Response (200)
This endpoint does not return any specific data upon success. If the transaction is successful, settled amounts are transferred to the `balance_manager`.

#### Response Example
(No response body for success)
```

=== COMPLETE CONTENT === This response contains all available snippets from this library. No additional content exists. Do not make further requests.