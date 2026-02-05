# **Title: Yume Protocol: A Comprehensive Architectural and Strategic Blueprint for Order Book Lending on the Sui Network**

## **1\. Executive Summary**

The decentralized finance (DeFi) sector stands at a critical juncture, transitioning from the rudimentary pooled liquidity models that defined its inception to more sophisticated, market-driven mechanisms that mirror the efficiency of traditional financial (TradFi) primitives while retaining trustless execution. This research report presents an exhaustive analysis of **Yume**, a proposed Order Book (OB) Lending protocol designed specifically for the Sui blockchain. Yume addresses the inherent capital inefficiencies, risk socialization, and lack of customization present in incumbent Automated Market Maker (AMM) based lending protocols (e.g., Aave, Compound) by introducing a multi-dimensional matching engine that pairs borrowers and lenders based on **Interest Rate**, **Duration**, and **Risk (Loan-to-Value)**.

Drawing upon the conceptual framework of "Bedlam Research" and leveraging the unique architectural capabilities of the Sui network—specifically its object-centric data model, parallel execution engine, and Programmable Transaction Blocks (PTBs)—Yume proposes a hybrid market structure. This structure seamlessly integrates passive liquidity pools with active institutional order flow into a unified Central Limit Order Book (CLOB). This report provides a granular examination of the dApp architecture, economic use cases, user flows, and the strategic imperative for deploying on Sui, fulfilling the rigorous standards of a deep-dive technical and market analysis.

## **2\. The Evolution of On-Chain Credit and the Strategic Necessity of Yume**

### **2.1 The Limitations of the Pooled Liquidity Paradigm**

To appreciate the architectural innovation of Yume, one must first deconstruct the prevailing "peer-to-pool" model that dominates the current landscape. Protocols such as Aave, Compound, and even current Sui-based incumbents like Suilend operate on a pooled basis. In this model, passive lenders deposit assets into a commingled smart contract, receiving a fungible claim token (e.g., cToken, aToken). Borrowers draw from this aggregate liquidity, paying a variable interest rate determined by a deterministic utilization curve—a mathematical function that hikes rates as the pool’s available liquidity diminishes.1

While this mechanism was pivotal in bootstrapping DeFi 1.0 by aggregating fragmented liquidity, it suffers from severe structural inefficiencies that limit its utility for sophisticated financial operations. First, it enforces **Risk Socialization**. A lender supplying USDC to a shared pool implicitly underwrites the risk of every collateral asset accepted by that pool. If a volatile "long-tail" asset (e.g., a meme coin) used as collateral crashes and fails to liquidate efficiently, the insolvency is socialized across all lenders, including those who sought low-risk exposure.3 This prevents the formation of risk-adjusted yield curves where lenders can demand higher premiums for higher risks.

Second, the pooled model creates extreme **Capital Inefficiency via Spread Capture**. The protocol typically mandates a spread between the supply rate and the borrow rate to fund an insurance module or DAO treasury. This artificial wedge ensures that lenders effectively receive less than the market clearing price for their capital, while borrowers pay more. In an order book model, this spread is compressed by competition, as makers and takers interact directly to find the equilibrium price.5

Third, and perhaps most critically for institutional adoption, pooled models are inherently **Duration Mismatch** engines. Deposits are withdrawable on demand (subject to liquidity), necessitating variable interest rates. This prevents the creation of fixed-term, fixed-rate instruments—the backbone of corporate finance. Institutions cannot engage in reliable liability matching or long-term capital planning when their cost of capital fluctuates block-by-block based on the whims of retail utilization.6

### **2.2 The "Bedlam Research" Thesis and the Hybrid Order Book**

The "Bedlam Research" thesis suggests that the future of DeFi lending lies in bringing the precision of order books to credit markets.5 However, a pure peer-to-peer (P2P) order book often suffers from the "cold start" problem—liquidity is fragmented across thousands of individual orders, making it difficult for a large borrower to fill a position instantly.

Yume solves this by implementing the **Hybrid Liquidity Model** visualized in the project's conceptual diagram.

* **The Order Book Core:** The central engine is a CLOB that matches requests based on Interest Rate, Duration, and LTV.  
* **Sophisticated Lenders (Makers):** Institutional players or active users place specific limit orders (e.g., "Lend 100k USDC at 8% for 30 days").  
* **Lending Pools as Makers:** Crucially, Yume retains passive pools (Lending Pool 1, Lending Pool 2), but treating them as **automated market makers** on the order book. These pools hold passive liquidity and algorithmically place orders into the book based on predefined strategies (e.g., Linear Curve or Kinked Curve).

This hybrid design ensures that retail users can still "zap" into a passive pool, while the protocol aggregates that liquidity to fill the order book, providing deep liquidity for borrowers while allowing sophisticated actors to price risk accurately alongside the pools. This synthesis of AMM ease-of-use with Order Book precision represents the next logical step in DeFi market structure evolution.5

### **2.3 Why Sui? The Infrastructure Thesis**

The implementation of such a high-fidelity market structure is theoretically attractive but practically impossible on legacy blockchains like Ethereum. The computational overhead of managing a multi-dimensional order book, where every order placement, cancellation, and match requires a state update, leads to prohibitive gas costs and network congestion on serial execution chains.

Sui is uniquely positioned as the optimal ecosystem for Yume due to three fundamental architectural decisions:

1. **Object-Centric Data Model:** Unlike the account-based model where state is siloed in smart contracts, Sui treats assets and positions as discrete objects. This allows Yume to "tokenize" every loan and order as an NFT with unique properties, enabling a secondary market for debt without complex wrapper contracts.8  
2. **Parallel Execution:** Sui’s consensus engines (Narwhal and Bullshark) allow transactions that touch independent objects to execute in parallel. This means activity in Yume’s "USDC-SUI" market does not compete for block space with activity in its "USDT-ETH" market, nor with unrelated NFT mints on the network. This guarantees the low latency and high throughput required for an order book.10  
3. **DeepBook Primitive:** Sui has enshrined the Central Limit Order Book as a network primitive via **DeepBook**. Yume does not need to build the liquidation infrastructure from scratch; it can composably route collateral to DeepBook for atomic liquidations, leveraging the deepest spot liquidity on the network.12

## ---

**3\. Detailed Architecture of the Yume Protocol**

The architecture of Yume is composed of four interacting layers: the **User Interface/Aggregation Layer**, the **Hybrid Liquidity Layer**, the **Matching Engine (The Core)**, and the **Settlement & Liquidation Layer**.

### **3.1 The Hybrid Liquidity Layer (Interpreting the Diagram)**

The conceptual diagram provided for Yume distinguishes between distinct borrower and lender archetypes. The architecture must explicitly support these divergent behaviors.

#### **3.1.1 Passive Lending Pools (The Automated Makers)**

Yume incorporates multiple passive pools (Pool 1, Pool 2\) that differ by risk appetite.

* **Pool 1 (Conservative):** Configured with a "Linear" interest rate model and a high collateral requirement (e.g., 90% LTV). This pool algorithmically places orders on the book at lower interest rates but demands safer collateral coverage.  
* **Pool 2 (Aggressive):** Configured with a "Kinked" interest rate model (rates spike faster as utilization hits optimal levels) and accepts lower collateral coverage (e.g., 85% LTV).  
* **Mechanism:** These pools act as **Liquidity Providers (LPs)**. Instead of waiting for a borrower to interact with them directly, the Pool Smart Contract effectively runs an on-chain strategy, constantly updating Ask orders in the central Order Book based on its internal supply of funds and utilization targets. This ensures that the Order Book always has a "floor" of liquidity provided by passive retail users.4

#### **3.1.2 Sophisticated Lenders (The Active Makers)**

Institutional Lenders or "Whales" interact directly with the Order Book via API or advanced UI. They bypass the pools to avoid the algorithmic pricing.

* **Strategy:** They place Limit Orders that may undercut the pools (offering cheaper rates) or offer capital for niche assets the pools don't support.  
* **Bespoke Terms:** These lenders can utilize Yume to craft "bespoke strategies," such as offering 0% interest loans on specific assets in exchange for the option value of the collateral (similar to creating synthetic options).

#### **3.1.3 The Borrowers (Retail vs. Institutional)**

* **Retail Borrowers:** Typically interact via a simplified frontend that routes their request to the best available order (Market Order). They simply want "Cash Now" and prioritize speed.  
* **Institutional Borrowers:** Likely use the protocol for liability management. They might place "Borrow Bids" (e.g., "I need 10M USDC for 1 year at 5% max"). If no lender meets this, the order sits in the book until a pool or sophisticated lender fills it.

### **3.2 The Multi-Dimensional Matching Engine**

The core innovation of Yume is the Move-based matching engine that handles three dimensions: **Price (Rate)**, **Time (Duration)**, and **Risk (LTV)**.

#### **3.2.1 Dimensional Bucketing Strategy**

Matching on three continuous variables is computationally expensive (O(N^3) complexity in worst cases). To optimize for Sui's execution model, Yume utilizes a **Bucketing Strategy** to reduce the matching space to a standard 1-dimensional sort (like a regular price-based order book).

* **Duration Buckets:** Markets are segmented by fixed terms.  
  * Open Term (Variable Rate, callable).  
  * 7-Day Fixed.  
  * 30-Day Fixed.  
  * 90-Day Fixed.  
* **Risk Buckets:** Markets are segmented by LTV Tiers or Collateral Pairs.  
  * Tier A: Blue-chip collateral (SUI, USDC), 90% LTV.  
  * Tier B: Volatile collateral (Meme coins, NFTs), 50% LTV.

Within a specific bucket (e.g., "30-Day Fixed, Tier A"), the matching engine solves purely for **Interest Rate**. This allows Yume to use highly efficient data structures like **Crit-bit trees** or **Red-Black trees** (available in the Sui Move standard library or DeepBook packages) to sort orders by rate in O(log N) time, ensuring scalability.14

### **3.3 The Object Model: Tokenizing Debt**

Sui’s object model allows Yume to reify every position into a transferable object.

#### **3.3.1 The Order Object**

Code snippet

struct Order has key, store {  
    id: UID,  
    owner: address,  
    side: u8, // 0 \= Lend, 1 \= Borrow  
    amount: u64,  
    min\_rate: u64,  
    duration: u64,  
    collateral\_type: TypeName,  
}

When a user places an order, this object is created and transferred to the Shared Object (The Order Book).

#### **3.3.2 The Position NFT (The "Bond")**

When a match occurs, the protocol mints a **Position NFT**.

* **Lender NFT:** Represents the right to claim principal \+ interest at maturity. Because it has the store ability, it can be sold on secondary markets (e.g., TradePort, Hyperspace). This effectively creates a secondary bond market for DeFi debt immediately upon loan creation.  
* **Borrower NFT:** Represents the obligation. Transferring this NFT transfers the collateral lock and the repayment burden. This allows users to sell leveraged positions without unwinding them (e.g., selling a whole wallet profile including debt).

### **3.4 Settlement Layer: The "Hot Potato" Pattern**

To ensure atomic settlement without requiring the protocol to custody vast amounts of idle user funds (which creates a honeypot for hackers), Yume employs the **Hot Potato** pattern.

In Move, a "Hot Potato" is a struct that has no drop, store, or key abilities. It cannot be stored in global state, transferred, or ignored; it *must* be consumed by a specific function in the same transaction block.15

**Implementation Flow:**

1. **Match Execution:** The matching engine identifies a match and returns a MatchReceipt (the Hot Potato).  
2. **Constraint:** This MatchReceipt contains the details of the trade (Amount, Collateral Required).  
3. **Settlement Logic:** The transaction must then call yume::settle, passing the MatchReceipt alongside the actual Coin objects (Collateral from borrower, Principal from Lender).  
4. **Verification:** The settle function verifies the coins match the receipt requirements, performs the transfer (moving collateral to Vault, principal to Borrower), and then destroys the MatchReceipt.  
5. **Atomicity:** If the borrower tries to execute the match without supplying the coins, the MatchReceipt is left undestroyed. The Move bytecode verifier (run at compile/publish time) and the runtime will reject the transaction entirely.

This pattern provides mathematical certainty of settlement validity without complex "check-balance-before-and-after" logic common in Solidity.15

## ---

**4\. Why Sui is the Superior Ecosystem for Yume**

The choice of Sui is not incidental; it is a prerequisite for the viability of an on-chain order book lending protocol.

### **4.1 Parallelism and State Contention**

On Ethereum or Solana, a "Global State" model means that high activity in one sector (e.g., a memecoin launch) creates contention for the same computing resources used by a lending protocol. This leads to **state contention**, where transactions must wait in line.

Sui uses a **DAG-based memory pool (Narwhal)** and **consensus engine (Bullshark/Mysticeti)** that detects causal dependencies.17

* **Scenario:** A massive airdrop is happening on Sui.  
* **Impact on Yume:** The airdrop transactions interact with the Token Object and the User Objects. Yume transactions interact with Yume Order Book Objects. Since these sets of objects are disjoint, Sui validators process them **in parallel** on different cores.  
* **Benefit:** Yume maintains low latency and predictable fees even during network congestion, a critical requirement for institutional market makers who rely on timely order updates.10

### **4.2 Programmable Transaction Blocks (PTBs)**

Sui’s PTBs allow up to 1,024 unique operations to be chained in a single atomic transaction.19 This is a game-changer for Yume's user experience.

* **DeFi Looping:** On other chains, "looping" (Deposit \-\> Borrow \-\> Swap \-\> Deposit) requires multiple transactions and approvals, exposing the user to price slippage and gas costs between steps.  
* **Yume Implementation:** A user can execute a "Leverage Zap" in one PTB.  
  1. SplitCoins (SUI).  
  2. MoveCall (Yume: Deposit SUI, Borrow USDC).  
  3. MoveCall (DeepBook: Swap USDC for SUI).  
  4. MoveCall (Yume: Deposit SUI). This executes instantly and atomically. If the swap slippage is too high, the *entire* transaction reverts, protecting the user. This level of native composability enables Yume to offer "one-click" advanced strategies.15

### **4.3 DeepBook Integration for Liquidations**

Liquidation reliability is the killer of lending protocols. Yume integrates with **DeepBook**, Sui’s native central limit order book primitive.12

* **Mechanism:** When a loan reaches the liquidation threshold, a keeper triggers the liquidation. Yume does not need to auction the collateral (slow, inefficient).  
* **Atomic Liquidation:** Within the liquidation PTB, Yume takes the collateral, executes a Market Sell on DeepBook for the repayment asset, and repays the lender.  
* **Advantage:** This accesses the deepest liquidity on the network instantly. Because DeepBook is also a Sui native contract, this cross-contract interaction is highly optimized and secure.22

## ---

**5\. User Flows and Use Cases**

### **5.1 Use Case: The DAO Treasury (Liability Matching)**

**Problem:** A DAO holds 10M SUI tokens. They need 1M USDC for operational expenses (payroll) for the next 6 months. They don't want to sell SUI at current prices.

**Status Quo:** Using Aave, they borrow USDC at a variable rate. If rates spike to 20% during a bull run, their runway is destroyed.

**Yume Solution:**

1. The DAO places a "Borrow Request" on Yume: *Collateral: 2M SUI, Borrow: 1M USDC, Rate: 6% Fixed, Duration: 6 Months.*  
2. A stablecoin issuer or yield fund (Sophisticated Lender) sees this risk-free 6% yield and fills the order.  
3. **Result:** The DAO locks in a fixed cost of capital. They have perfectly matched their liability (payroll) with their financing, a strategy impossible on variable-rate protocols.6

### **5.2 Use Case: The "Degen" Farmer (Long-Tail Assets)**

**Problem:** A user holds a new ecosystem token (e.g., FUD). Major lending protocols won't list it due to oracle risk and shallow liquidity.

**Yume Solution:**

1. The user places a "Borrow Request" offering a high premium: *Collateral: FUD, LTV: 40%, Rate: 25% APY.*  
2. A risk-tolerant lender (or a niche Lending Pool specialized in high-yield assets) accepts the order.  
3. **Result:** Permissionless markets form naturally. The protocol doesn't gatekeep assets; the market prices the risk.

### **5.3 User Flow: The Retail Lender ("Earn" Interface)**

1. **Discovery:** User opens Yume and sees "Earn 8% on USDC."  
2. **Action:** User clicks "Deposit."  
3. **Behind the Scenes:** The UI constructs a PTB.  
   * It checks the "Order Book" for the best active bid.  
   * If a matching bid exists (e.g., from an institution), it fills it directly (P2P).  
   * If no match exists, it deposits the USDC into the "Passive Pool," which then algorithmically manages the funds on the book.  
4. **Outcome:** The user gets a blended yield, benefitting from both high-rate P2P matches and consistent pool utilization.

## ---

**6\. Pros, Cons, and Competitive Analysis**

### **6.1 Pros**

* **Capital Efficiency:** Eliminates the spread between supply/borrow rates found in pooled models.  
* **Risk Isolation:** A bad loan only affects the specific lender who matched it, not the whole pool (unless using the passive pool wrapper).  
* **Structural Alpha:** Enables fixed-rate, fixed-term products, unlocking institutional capital.  
* **Sui-Native Speed:** Parallel execution ensures the order book remains responsive even during network stress events.23

### **6.2 Cons and Risks**

* **Liquidity Fragmentation:** By splitting liquidity into duration/risk buckets, total liquidity is less concentrated than in a single Aave pool. Yume mitigates this via the "Hybrid Model" where pools aggregate liquidity across buckets.  
* **User Complexity:** Managing limit orders is harder than simply "depositing." Yume relies on UI abstraction and "Smart Vaults" to hide this complexity from retail users.  
* **Latency Sensitivity:** While Sui is fast (400ms-600ms latency), it is not a centralized exchange. Market makers running high-frequency strategies may face some on-chain latency, though DeepBook has proven this is viable for spot markets.15

### **6.3 Competitive Landscape Table**

| Feature | Yume (Sui) | Aave (Ethereum) | Morpho (Ethereum) | Suilend (Sui) |
| :---- | :---- | :---- | :---- | :---- |
| **Market Structure** | Order Book \+ Pool (Hybrid) | Pooled Liquidity | P2P \+ Pool Fallback | Pooled Liquidity |
| **Interest Model** | Market Driven (Fixed/Var) | Algorithmic (Variable) | Market Driven (Hybrid) | Algorithmic (Variable) |
| **Matching Engine** | Multi-dimensional (Rate, Term, Risk) | None (Pool interaction) | Single Dimension (Rate) | None (Pool interaction) |
| **Settlement** | Atomic (Hot Potato) | Standard Transfer | Standard Transfer | Standard Transfer |
| **Liquidations** | DeepBook Integration | 3rd Party Keepers | 3rd Party Keepers | 3rd Party Keepers |
| **Capital Efficiency** | High (Tight Spreads) | Low (Wide Spreads) | High | Medium |

## ---

**7\. Implementation Roadmap for the Hackathon**

To deliver a winning submission, the development should follow this phased roadmap, prioritizing the unique features of Sui.

### **Phase 1: The Core Primitives (MVP)**

* **Objective:** Functional Matching Engine.  
* **Deliverables:**  
  * yume::orderbook: Move module implementing the shared object storage and sorting logic (using sui::table and sui::priority\_queue).  
  * yume::matching: Module implementing the logic to match Takers against Makers.  
  * yume::position: Module defining the Loan NFT and Order structs.  
* **Tech Stack:** Sui Move, Move.toml configuration.

### **Phase 2: The Settlement & Safety Layer**

* **Objective:** Atomic Settlement.  
* **Deliverables:**  
  * Implement the **Hot Potato** pattern (MatchReceipt struct) to enforce that collateral is locked exactly when a match occurs.  
  * Unit tests in Move proving that it is impossible to "fake" a match without funds.

### **Phase 3: DeepBook & PTB Integration**

* **Objective:** Composability Showcase.  
* **Deliverables:**  
  * yume::liquidation: A module that accepts a liquidation call, routes the collateral to DeepBook via Cross-Program Invocation (CPI), sells it, and settles the debt.  
  * **Frontend Demo:** A React app using @mysten/dapp-kit that demonstrates a "One-Click Leverage" PTB (Swap \-\> Deposit \-\> Borrow \-\> Loop). This visualizes the power of Sui to judges.25

### **Phase 4: The Hybrid Pools**

* **Objective:** Liquidity Bootstrapping.  
* **Deliverables:**  
  * yume::pool: A simple contract that accepts deposits and algorithmically places orders into the yume::orderbook based on a linear curve. This proves the "Hybrid" concept from the architecture diagram.

## **8\. Conclusion**

**Yume** represents a necessary evolution in the DeFi lending stack. By transitioning from a pool-centric to an order-centric model, it aligns DeFi market structure with the mature standards of traditional finance—offering precise risk pricing, fixed-term yields, and capital efficiency.

Sui is not merely a host for this application; it is the enabler. The combination of **Parallel Execution** to handle order book throughput, **Object Capabilities** to tokenize debt positions, and **Programmable Transaction Blocks** to abstract complexity makes Sui the only viable L1 for this architecture. For the hackathon, Yume offers a compelling narrative: it is a technical tour-de-force of Move's capabilities, a solution to real economic inefficiencies in DeFi, and a cornerstone primitive for the next generation of on-chain finance.

#### **Works cited**

1. Comprehensive report on decentralized lending in 2025, accessed February 4, 2026, [https://oakresearch.io/en/reports/sectors/comprehensive-report-decentralized-lending-2025](https://oakresearch.io/en/reports/sectors/comprehensive-report-decentralized-lending-2025)  
2. Orderbook-based Lending Protocols vs Pool-Based ... \- Medium, accessed February 4, 2026, [https://medium.com/@0xParzival/orderbook-based-lending-protocols-vs-pool-based-lending-protocols-fbdfd320cff6](https://medium.com/@0xParzival/orderbook-based-lending-protocols-vs-pool-based-lending-protocols-fbdfd320cff6)  
3. BIS Working Papers No 1171: DeFi Leverage, accessed February 4, 2026, [https://www.bis.org/publ/work1171.pdf](https://www.bis.org/publ/work1171.pdf)  
4. On-chain Lending Rising Star — The Small but Beautiful Butterfly ..., accessed February 4, 2026, [https://www.binance.com/en/square/post/19455955312369](https://www.binance.com/en/square/post/19455955312369)  
5. Order book-based lending | bedlam, accessed February 4, 2026, [https://www.bedlamresear.ch/posts/ob-lending/](https://www.bedlamresear.ch/posts/ob-lending/)  
6. Term Finance Crypto Exposed: How Term Coin And Fixed-Rate ..., accessed February 4, 2026, [https://blog.mexc.com/what-is-term-finance/](https://blog.mexc.com/what-is-term-finance/)  
7. Anatomy of a Multi-Block Attack | HackerNoon, accessed February 4, 2026, [https://hackernoon.com/anatomy-of-a-multi-block-attack](https://hackernoon.com/anatomy-of-a-multi-block-attack)  
8. Exploring Sui: The Layer-1 Ready for Mass Adoption | VanEck, accessed February 4, 2026, [https://www.vaneck.com/li/en/blog/digital-assets/exploring-sui-the-layer-1-ready-for-mass-adoption/](https://www.vaneck.com/li/en/blog/digital-assets/exploring-sui-the-layer-1-ready-for-mass-adoption/)  
9. Move Fast and Build Things: The Sui Suite of Innovations, accessed February 4, 2026, [https://www.node.capital/blog/move-fast-and-build-things-the-sui-suite-of-innovations](https://www.node.capital/blog/move-fast-and-build-things-the-sui-suite-of-innovations)  
10. Sui Advantages \- Blockberry API, accessed February 4, 2026, [https://docs.blockberry.one/docs/sui-advantages](https://docs.blockberry.one/docs/sui-advantages)  
11. All About Parallelization \- The Sui Blog, accessed February 4, 2026, [https://blog.sui.io/parallelization-explained/](https://blog.sui.io/parallelization-explained/)  
12. Discover DeepBook: Sui's Core Liquidity Engine \- Uphold, accessed February 4, 2026, [https://uphold.com/en-us/blog/crypto-basics/what-is-deep](https://uphold.com/en-us/blog/crypto-basics/what-is-deep)  
13. DeepBookV3 \- Sui Documentation, accessed February 4, 2026, [https://docs.sui.io/standards/deepbook](https://docs.sui.io/standards/deepbook)  
14. Orderbook matching engine with order management and market ..., accessed February 4, 2026, [https://github.com/wailo/orderbook-matching-engine](https://github.com/wailo/orderbook-matching-engine)  
15. How Sui Move rethinks flash loan security \- The Trail of Bits Blog, accessed February 4, 2026, [https://blog.trailofbits.com/2025/09/10/how-sui-move-rethinks-flash-loan-security/](https://blog.trailofbits.com/2025/09/10/how-sui-move-rethinks-flash-loan-security/)  
16. Hot Potato \- Move Patterns: Design Patterns for Resource Based ..., accessed February 4, 2026, [http://www.move-patterns.com/hot-potato.html](http://www.move-patterns.com/hot-potato.html)  
17. It's time to Think-Sui : A deep look into the Sui Blockchain, accessed February 4, 2026, [https://boilerblockchain.medium.com/its-time-to-think-sui-a-deep-look-into-the-sui-blockchain-b6490c236e74](https://boilerblockchain.medium.com/its-time-to-think-sui-a-deep-look-into-the-sui-blockchain-b6490c236e74)  
18. Sui Network: Demystifying the Monolithic Contender \- Delphi Digital, accessed February 4, 2026, [https://members.delphidigital.io/reports/sui-network-demystifying-the-monolithic-contender](https://members.delphidigital.io/reports/sui-network-demystifying-the-monolithic-contender)  
19. Programmable Transaction Blocks (PTBs) \- Sui Documentation, accessed February 4, 2026, [https://docs.sui.io/guides/developer/transactions/prog-txn-blocks](https://docs.sui.io/guides/developer/transactions/prog-txn-blocks)  
20. Programmable Transaction Block (PTB) \- Sui Move Intro Course, accessed February 4, 2026, [https://intro.sui-book.com/unit-five/lessons/1\_programmable\_transaction\_block.html](https://intro.sui-book.com/unit-five/lessons/1_programmable_transaction_block.html)  
21. The State of Onchain Yield: From Stablecoins to DeFi and Beyond, accessed February 4, 2026, [https://www.galaxy.com/insights/research/the-state-of-onchain-yield](https://www.galaxy.com/insights/research/the-state-of-onchain-yield)  
22. DeepBook Margin Officially Launches: A New Step Forward For ..., accessed February 4, 2026, [https://blog.mexc.com/news/deepbook-margin-officially-launches-a-new-step-forward-for-defi-on-sui/](https://blog.mexc.com/news/deepbook-margin-officially-launches-a-new-step-forward-for-defi-on-sui/)  
23. Breaking the Mold: Sui, a Revolutionary L1 | Oregon Blockchain Group, accessed February 4, 2026, [https://medium.com/oregon-blockchain-group/breaking-the-mold-sui-a-revolutionary-l1-5f72e625661a](https://medium.com/oregon-blockchain-group/breaking-the-mold-sui-a-revolutionary-l1-5f72e625661a)  
24. Sui Blockchain: Move with Extra Features \- Rango Exchange, accessed February 4, 2026, [https://rango.exchange/learn/market-trends/sui-blockchain-review](https://rango.exchange/learn/market-trends/sui-blockchain-review)  
25. Sui Programmable Transaction Basics, accessed February 4, 2026, [https://sdk.mystenlabs.com/typescript/transaction-building/basics](https://sdk.mystenlabs.com/typescript/transaction-building/basics)  
26. Build Programmable Transaction Blocks with TypeScript SDK, accessed February 4, 2026, [https://docs.iota.org/developer/iota-101/transactions/ptb/building-programmable-transaction-blocks-ts-sdk](https://docs.iota.org/developer/iota-101/transactions/ptb/building-programmable-transaction-blocks-ts-sdk)