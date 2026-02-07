/// Module: yume::position
///
/// Defines the core position types for the Yume lending protocol:
/// - `LoanPosition`: NFT representing an active loan (held by lender or borrower)
/// - `MatchReceipt`: Hot Potato struct enforcing atomic settlement in PTBs
///
/// # Architecture Notes
/// - LoanPosition has `key` + `store` for ownership and secondary market trading
/// - MatchReceipt has NO abilities (Hot Potato pattern) — must be consumed by settle()
/// - Both lender and borrower receive distinct LoanPosition NFTs upon matching
/// - `loan_id` links both positions to the same loan and the vault's collateral
///
/// # Dependencies
/// - sui::object (UID, ID)
/// - sui::event (event emission for off-chain indexing)
///
/// # Consumers
/// - yume::market (settle function creates LoanPositions)
/// - yume::orderbook (matching engine creates MatchReceipts)
module yume::position;

use sui::object::{Self, UID, ID};
use sui::tx_context::TxContext;
use sui::event;

// ============================================================
// Constants
// ============================================================

/// Order/Position side: Lending (offering capital)
const ORDER_SIDE_LEND: u8 = 0;
/// Order/Position side: Borrowing (requesting capital)
const ORDER_SIDE_BORROW: u8 = 1;

/// Position status: Loan is active and ongoing
const STATUS_ACTIVE: u8 = 0;
/// Position status: Loan has been repaid by borrower
const STATUS_REPAID: u8 = 1;
/// Position status: Collateral was liquidated due to undercollateralization
const _STATUS_LIQUIDATED: u8 = 2;
/// Position status: Loan matured without repayment
const _STATUS_DEFAULTED: u8 = 3;

// ============================================================
// Error Constants
// ============================================================

/// Abort: Invalid position side (must be 0 or 1)
const _EInvalidSide: u64 = 0;
/// Abort: Invalid position status transition
const EInvalidStatus: u64 = 1;

// ============================================================
// Structs
// ============================================================

/// Represents an active loan position (NFT).
///
/// Both lender and borrower receive a LoanPosition upon successful matching.
///
/// **Lender Position (side=0):**
///   Proof of lending. Right to claim principal + interest at maturity.
///   Has `store` ability enabling secondary market trading (e.g., selling the "bond"
///   on TradePort or Hyperspace). This effectively creates a secondary bond market
///   for DeFi debt immediately upon loan creation.
///
/// **Borrower Position (side=1):**
///   Proof of obligation. Transferring this NFT transfers the collateral lock
///   and the repayment burden. Enables selling leveraged positions without unwinding.
///
/// # Abilities
/// - `key`: Top-level object, can be owned by addresses
/// - `store`: Can be stored in other objects and traded on marketplaces
public struct LoanPosition has key, store {
    id: UID,
    /// Unique loan identifier shared between lender and borrower positions.
    /// Equal to the lender's LoanPosition object ID.
    /// Used as the key for collateral lookup in the CollateralVault.
    loan_id: ID,
    /// The side of this position holder: ORDER_SIDE_LEND (0) or ORDER_SIDE_BORROW (1)
    side: u8,
    /// The lender's address
    lender: address,
    /// The borrower's address
    borrower: address,
    /// Principal amount in base asset (e.g., USDC)
    principal: u64,
    /// Interest rate in basis points (1 bp = 0.01%)
    rate: u64,
    /// Loan duration in seconds
    duration: u64,
    /// Collateral amount locked for this loan
    collateral_amount: u64,
    /// Clock timestamp (ms) when the loan started
    start_time: u64,
    /// Clock timestamp (ms) when the loan matures
    maturity_time: u64,
    /// Current status: 0=Active, 1=Repaid, 2=Liquidated, 3=Defaulted
    status: u8,
    /// Reference to the OrderBook where this loan originated
    book_id: ID,
}

/// Hot Potato struct for atomic settlement.
///
/// # Hot Potato Pattern
/// MatchReceipt has NO abilities (no drop, store, key, copy).
/// This means it:
/// - Cannot be stored in global storage
/// - Cannot be transferred to any address
/// - Cannot be dropped/discarded
/// - Cannot be copied
///
/// It MUST be consumed by the `settle()` function in the same Programmable
/// Transaction Block (PTB). If a transaction creates a MatchReceipt but doesn't
/// consume it, the Move VM will reject the entire transaction — providing
/// mathematical certainty of settlement.
///
/// # PTB Flow
/// ```
/// Command 1: market::match_orders(book, ...) -> MatchReceipt
/// Command 2: market::settle(receipt, collateral, book, vault, clock, ctx)
///            → transfers Coin<BASE> to borrower, locks Coin<COLLATERAL> in vault
/// ```
///
/// # Security Guarantee
/// The bytecode verifier ensures at compile time that all code paths consuming
/// a MatchReceipt lead to its destruction. At runtime, any unconsumed Hot Potato
/// causes a transaction abort. This replaces Solidity's "check-balance-before-
/// and-after" pattern with compile-time enforcement.
public struct MatchReceipt {
    /// Reference to the OrderBook where the match occurred
    book_id: ID,
    /// The matched lend order ID
    lend_order_id: u64,
    /// The matched borrow order ID
    borrow_order_id: u64,
    /// The matched principal amount in base asset units
    matched_amount: u64,
    /// The agreed interest rate in basis points
    rate: u64,
    /// The loan duration in seconds (from the OrderBook's duration bucket)
    duration: u64,
    /// The required collateral amount (computed from LTV ratio)
    collateral_required: u64,
    /// The lender's address
    lender: address,
    /// The borrower's address
    borrower: address,
}

// ============================================================
// Events
// ============================================================

/// Emitted when a new LoanPosition NFT is created.
/// Used by off-chain indexers to track active loans.
public struct LoanCreated has copy, drop {
    position_id: ID,
    loan_id: ID,
    side: u8,
    lender: address,
    borrower: address,
    principal: u64,
    rate: u64,
    duration: u64,
    start_time: u64,
    maturity_time: u64,
    book_id: ID,
}

// ============================================================
// Package-Internal Functions
// ============================================================

/// Creates a new MatchReceipt (Hot Potato).
///
/// Only callable within the yume package. Used by the matching engine
/// after validating a successful order match.
///
/// # Parameters
/// - `book_id`: ID of the OrderBook where the match occurred
/// - `lend_order_id`: The lend order's sequential ID
/// - `borrow_order_id`: The borrow order's sequential ID
/// - `matched_amount`: Principal amount being matched
/// - `rate`: Agreed interest rate in basis points
/// - `duration`: Loan duration in seconds
/// - `collateral_required`: Required collateral amount
/// - `lender`: Lender's address
/// - `borrower`: Borrower's address
///
/// # Returns
/// A `MatchReceipt` that MUST be consumed by `settle_receipt()`
public(package) fun new_match_receipt(
    book_id: ID,
    lend_order_id: u64,
    borrow_order_id: u64,
    matched_amount: u64,
    rate: u64,
    duration: u64,
    collateral_required: u64,
    lender: address,
    borrower: address,
): MatchReceipt {
    MatchReceipt {
        book_id,
        lend_order_id,
        borrow_order_id,
        matched_amount,
        rate,
        duration,
        collateral_required,
        lender,
        borrower,
    }
}

/// Consumes a MatchReceipt and creates LoanPosition NFTs.
///
/// This is the ONLY function that can destroy a MatchReceipt,
/// enforcing the Hot Potato pattern for atomic settlement.
///
/// Creates linked lender and borrower position NFTs sharing the same `loan_id`.
/// The `loan_id` is the lender position's object ID, used as the key
/// for collateral lookup in the CollateralVault.
///
/// # Parameters
/// - `receipt`: The MatchReceipt to consume (Hot Potato)
/// - `current_time`: Current clock timestamp in milliseconds
/// - `ctx`: Transaction context for UID creation
///
/// # Returns
/// Tuple of (lender_position, borrower_position) LoanPosition NFTs
public(package) fun settle_receipt(
    receipt: MatchReceipt,
    current_time: u64,
    ctx: &mut TxContext,
): (LoanPosition, LoanPosition) {
    // Destructure the Hot Potato — this permanently consumes it.
    // After this line, the MatchReceipt no longer exists.
    let MatchReceipt {
        book_id,
        lend_order_id: _,
        borrow_order_id: _,
        matched_amount,
        rate,
        duration,
        collateral_required,
        lender,
        borrower,
    } = receipt;

    // Calculate maturity timestamp
    // Duration is in seconds, clock timestamps are in milliseconds
    let maturity_time = current_time + (duration * 1000);

    // Create lender UID first to derive the loan_id
    // The loan_id is shared between both positions and used as vault key
    let lender_uid = object::new(ctx);
    let loan_id = object::uid_to_inner(&lender_uid);

    // Create lender position (the "bond")
    let lender_position = LoanPosition {
        id: lender_uid,
        loan_id,
        side: ORDER_SIDE_LEND,
        lender,
        borrower,
        principal: matched_amount,
        rate,
        duration,
        collateral_amount: collateral_required,
        start_time: current_time,
        maturity_time,
        status: STATUS_ACTIVE,
        book_id,
    };

    // Create borrower position (the "obligation")
    let borrower_position = LoanPosition {
        id: object::new(ctx),
        loan_id,
        side: ORDER_SIDE_BORROW,
        lender,
        borrower,
        principal: matched_amount,
        rate,
        duration,
        collateral_amount: collateral_required,
        start_time: current_time,
        maturity_time,
        status: STATUS_ACTIVE,
        book_id,
    };

    // Emit events for off-chain indexing
    event::emit(LoanCreated {
        position_id: object::id(&lender_position),
        loan_id,
        side: ORDER_SIDE_LEND,
        lender,
        borrower,
        principal: matched_amount,
        rate,
        duration,
        start_time: current_time,
        maturity_time,
        book_id,
    });

    event::emit(LoanCreated {
        position_id: object::id(&borrower_position),
        loan_id,
        side: ORDER_SIDE_BORROW,
        lender,
        borrower,
        principal: matched_amount,
        rate,
        duration,
        start_time: current_time,
        maturity_time,
        book_id,
    });

    (lender_position, borrower_position)
}

/// Updates the status of a LoanPosition.
///
/// Only callable within the yume package. Used by the repay/liquidate
/// functions to transition position status.
///
/// # Valid Transitions
/// - Active (0) → Repaid (1)
/// - Active (0) → Liquidated (2)
/// - Active (0) → Defaulted (3)
///
/// # Abort Conditions
/// - `EInvalidStatus` (1): Position is not currently active
public(package) fun set_status(position: &mut LoanPosition, new_status: u8) {
    assert!(position.status == STATUS_ACTIVE, EInvalidStatus);
    position.status = new_status;
}

// ============================================================
// Accessor Functions — LoanPosition
// ============================================================

/// Returns the loan_id (shared between lender and borrower positions)
public fun loan_id(position: &LoanPosition): ID { position.loan_id }
/// Returns the side of the position (0 = Lend, 1 = Borrow)
public fun side(position: &LoanPosition): u8 { position.side }
/// Returns the lender's address
public fun lender(position: &LoanPosition): address { position.lender }
/// Returns the borrower's address
public fun borrower(position: &LoanPosition): address { position.borrower }
/// Returns the principal amount
public fun principal(position: &LoanPosition): u64 { position.principal }
/// Returns the interest rate in basis points
public fun rate(position: &LoanPosition): u64 { position.rate }
/// Returns the loan duration in seconds
public fun duration(position: &LoanPosition): u64 { position.duration }
/// Returns the collateral amount locked
public fun collateral_amount(position: &LoanPosition): u64 { position.collateral_amount }
/// Returns the loan start time (ms)
public fun start_time(position: &LoanPosition): u64 { position.start_time }
/// Returns the loan maturity time (ms)
public fun maturity_time(position: &LoanPosition): u64 { position.maturity_time }
/// Returns the current status (0=Active, 1=Repaid, 2=Liquidated, 3=Defaulted)
public fun status(position: &LoanPosition): u8 { position.status }
/// Returns the originating OrderBook's ID
public fun book_id(position: &LoanPosition): ID { position.book_id }

// ============================================================
// Accessor Functions — MatchReceipt (Package-Internal)
// ============================================================

/// Returns the lend order ID from the receipt
public(package) fun receipt_lend_order_id(receipt: &MatchReceipt): u64 {
    receipt.lend_order_id
}
/// Returns the matched principal amount from the receipt
public(package) fun receipt_matched_amount(receipt: &MatchReceipt): u64 {
    receipt.matched_amount
}
/// Returns the required collateral amount from the receipt
public(package) fun receipt_collateral_required(receipt: &MatchReceipt): u64 {
    receipt.collateral_required
}
/// Returns the lender's address from the receipt
public(package) fun receipt_lender(receipt: &MatchReceipt): address {
    receipt.lender
}
/// Returns the borrower's address from the receipt
public(package) fun receipt_borrower(receipt: &MatchReceipt): address {
    receipt.borrower
}
/// Returns the rate from the receipt
public(package) fun receipt_rate(receipt: &MatchReceipt): u64 {
    receipt.rate
}
