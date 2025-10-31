// Custody API - Response Types

export type VaultStatus = 'pending' | 'created' | 'failed' | 'disabled';

export interface CustodyVault {
  id: string;
  created_at: string;
  updated_at: string;
  count_assets: number;
  status: VaultStatus;
  iiban: string;
  deposit_lock_rekeying_only?: boolean | null;
  name: string;
  description?: string | null;
  balance_fiat?: string | null;
  balance_diff?: string | null;
  available_balance_fiat?: string | null;
  otc_enabled?: boolean;
}

export interface CustodyApiError {
  severity: 'E' | 'W';
  errorClass: string;
  type: string;
  errorMessage?: string | null;
}

export interface ListCustodyVaultsResponse {
  result?: CustodyVault[] | null;
  errors?: CustodyApiError[];
  start?: number;
  total?: number;
}

// Custody API - Get Vault Information by ID
export interface AssetBalance {
  current_usd_value?: string | null;
  quantity: string;
}

export interface VaultAssetDetail {
  asset: string;
  current_usd_price?: string | null;
  available_balance: AssetBalance;
  total_balance: AssetBalance;
}

export interface CustodyVaultWithAssets extends CustodyVault {
  asset_details: VaultAssetDetail[];
}

export interface GetCustodyVaultResponse {
  result?: CustodyVaultWithAssets | null;
  errors: CustodyApiError[];
}

// Custody API - Deposit Methods
export interface DepositMethod {
  method?: string;
  limit?: string | boolean;
  fee?: string;
  'fee-percentage'?: string | null;
  'address-setup-fee'?: string | null;
  'gen-address'?: boolean | null;
  minimum?: string | null;
}

export interface DepositMethodsResponse {
  result?: DepositMethod[] | null;
  error: CustodyApiError[];
}

// Custody API - Deposit Addresses
export interface DepositAddress {
  address: string;
  expiretm?: string;
  memo?: string | null;
  new?: boolean | null;
  tag?: string | null;
}

export interface DepositAddressesResponse {
  error: CustodyApiError[];
  result?: DepositAddress[] | null;
}

// Custody API - Transaction Types (Shared)
export type TransactionType =
  | 'unspecified'
  | 'deposit'
  | 'withdrawal'
  | 'trade'
  | 'margin'
  | 'adjustment'
  | 'rollover'
  | 'interest'
  | 'credit'
  | 'transfer'
  | 'transfer_peer_to_peer'
  | 'settle'
  | 'dividend'
  | 'nft_trade'
  | 'reward'
  | 'nft_creator_fee'
  | 'nft_rebate'
  | 'nft_airdrop'
  | 'simple_order'
  | 'simple_order_with_deposit'
  | 'simple_order_failed'
  | 'custom_simple_order'
  | 'custom_simple_order_with_deposit'
  | 'custom_simple_order_failed'
  | 'recurring_simple_order'
  | 'recurring_simple_order_with_deposit'
  | 'recurring_simple_order_failed'
  | 'simple_order_opposite_side'
  | 'reserved_fee'
  | 'fee_sweep'
  | 'ic_settlement'
  | 'fee_sweep_dlt'
  | 'reward_sweep'
  | 'reward_sweep_old'
  | 'interest_sweep'
  | 'conversion'
  | 'dust_sweep'
  | 'futures_transfer'
  | 'custody_transfer'
  | 'deposit_action'
  | 'withdrawal_action'
  | 'legacy_staking_allocation'
  | 'legacy_staking_deallocation'
  | 'legacy_staking_reward'
  | 'earn_legacy_migration'
  | 'block_trade'
  | 'equity_trade'
  | 'equity_acats'
  | 'earn_staking_allocation'
  | 'earn_staking_deallocation'
  | 'earn_staking_reward'
  | 'earn_staking_auto_allocation'
  | 'earn_oir_allocation'
  | 'earn_oir_deallocation'
  | 'earn_oir_reward'
  | 'earn_oir_auto_allocation'
  | 'earn_base_reward'
  | 'earn_base_auto_allocation'
  | 'earn_base_auto_deallocation'
  | 'custody_staking'
  | 'custody_unstaking'
  | 'custody_staking_reward'
  | 'custody_staking_reward_aggregated'
  | 'credit_rollover'
  | 'airdrop'
  | 'earn_oir_auto_deallocation'
  | 'earn_staking_auto_deallocation'
  | 'bridge_deposit'
  | 'bridge_simple_order'
  | 'simple_order_deposit_action'
  | 'otc_buy'
  | 'otc_sell'
  | 'bundle_trade'
  | 'equity_fee'
  | 'equity_journal'
  | 'corporate_action'
  | 'user_account_transfer'
  | 'earn_restaking'
  | 'subscription'
  | 'custody_otc_loan_pledge'
  | 'custody_otc_collateral_liquidation'
  | 'paytag_transfer'
  | 'paylink_transfer'
  | 'paytag_request_transfer'
  | 'paylink_request_transfer'
  | 'kard_transfer'
  | 'krak_card'
  | 'custody_otc_loan_release'
  | 'fpsl_reward'
  | 'fcm_trade'
  | 'boost'
  | 'fcm_misc';

export type TransactionCategory =
  | 'unspecified'
  | 'deposit'
  | 'withdrawal'
  | 'transfer'
  | 'krak_card'
  | 'trade'
  | 'margin_trade'
  | 'margin_rollover'
  | 'margin_settle'
  | 'earn'
  | 'earn_rewards'
  | 'simple_trading'
  | 'nft'
  | 'block_trade'
  | 'credit'
  | 'equity_trade'
  | 'equity_acats'
  | 'equity_dividend'
  | 'reward_bonus'
  | 'conversion'
  | 'reward'
  | 'custody'
  | 'legacy_staking'
  | 'legacy_staking_rewards'
  | 'equity_fee'
  | 'equity_journal'
  | 'corporate_action'
  | 'fpsl_reward'
  | 'subscription'
  | 'other';

export type TransactionArea =
  | 'unspecified'
  | 'funding'
  | 'transfer'
  | 'krak_card'
  | 'spot_margin'
  | 'equity'
  | 'earn'
  | 'simple_trading'
  | 'custody'
  | 'staking'
  | 'nft'
  | 'other';

export type TransactionStatus =
  | 'unspecified'
  | 'in_progress'
  | 'successful'
  | 'failed';

export type TransactionAssetClass =
  | 'currency'
  | 'forex'
  | 'equity'
  | 'equity_pair'
  | 'nft'
  | 'derivatives'
  | 'tokenized_asset'
  | 'futures_contract';

export interface TransactionAmount {
  amount: string;
  asset: string;
  class: TransactionAssetClass;
}

export interface TransactionSide {
  ledger_id?: string | null;
  time?: string | null;
  subtype?: string | null;
  amount: TransactionAmount;
  quoted_amount?: TransactionAmount | null;
  fee?: TransactionAmount | null;
  quoted_fee?: TransactionAmount | null;
  total?: TransactionAmount | null;
  quoted_total?: TransactionAmount | null;
  balance?: TransactionAmount | null;
  wallet?: Record<string, any> | null;
}

export interface CustodyTransaction {
  id: string;
  time: string;
  type: TransactionType;
  category: TransactionCategory;
  area: TransactionArea;
  status?: TransactionStatus | null;
  ref_id: string;
  ref_id2?: string | null;
  spend?: TransactionSide | null;
  receive?: TransactionSide | null;
  details?: Record<string, any> | null;
}

export interface TransactionStats {
  transactions_seen?: number;
}

export interface ListCustodyTransactionsResponse {
  result?: {
    transactions: CustodyTransaction[];
    stats?: TransactionStats | null;
    next_cursor?: string | null;
  } | null;
  errors: CustodyApiError[];
}

// Custody API - Get Transaction by ID
export type TransactionResultType =
  | 'complete'
  | 'incomplete_requires_long_timeout'
  | 'incomplete';

export interface GetCustodyTransactionResponse {
  error: CustodyApiError[];
  result?: {
    transaction: CustodyTransaction;
    result_type: TransactionResultType;
  } | null;
}

// Custody API - Withdraw Methods
export interface WithdrawMethodLimit {
  remaining: string | number;
  maximum: string | number;
}

export interface WithdrawMethodLimitInfo {
  limit_type: string;
  description?: string | null;
  limits: Record<string, WithdrawMethodLimit>;
}

export interface WithdrawMethodFee {
  aclass: string;
  asset: string;
  fee: string;
  fee_percentage?: string | null;
}

export interface WithdrawMethod {
  asset: string;
  method_id?: string | null;
  method?: string | null;
  network_id?: string | null;
  network?: string | null;
  minimum?: string | null;
  limits?: WithdrawMethodLimitInfo[] | null;
  fee?: WithdrawMethodFee | null;
}

export interface WithdrawMethodsResponse {
  error: CustodyApiError[];
  result?: WithdrawMethod[] | null;
}

// Custody API - Withdraw Addresses
export interface WithdrawAddress {
  address?: string | null;
  asset?: string | null;
  method?: string | null;
  key?: string | null;
  verified: boolean;
  memo?: string | null;
  tag?: string | null;
  networks?: string[] | null;
}

export interface WithdrawAddressesResponse {
  error: CustodyApiError[];
  result?: WithdrawAddress[] | null;
}

// Custody API - Tasks
export type UserRole = 'admin' | 'initiator' | 'reviewer' | 'auditor';

export interface TaskUser {
  full_name?: string | null;
  role?: UserRole | null;
  ip_address?: string | null;
  iiban?: string | null;
}

export interface TaskReviewerStatistics {
  current_count: number;
  approved: number;
  denied: number;
  undecided: number;
}

export type TaskState =
  | 'pending'
  | 'approved'
  | 'denied'
  | 'canceled'
  | 'expired'
  | 'executed'
  | 'failed';

export type TaskUserDecision = 'approved' | 'denied' | 'undecided';

export interface CustodyTask {
  can_review: boolean;
  reviewer_statistics: TaskReviewerStatistics;
  current_user_decision: TaskUserDecision;
  id: string;
  approval_id: string;
  created_at: string;
  updated_at: string;
  expires_at: string;
  initiator: TaskUser;
}

export interface ListCustodyTasksResponse {
  result?: CustodyTask[] | null;
  errors: CustodyApiError[];
  start: number;
  total: number;
}

// Custody API - Get Task by ID
export interface TaskDetails {
  state: TaskState;
  [key: string]: any; // Task details vary based on action type
}

export interface GetCustodyTaskResponse {
  result?: TaskDetails | null;
  errors: CustodyApiError[];
}

// Custody API - Activities
export type ActivityAction =
  | 'created'
  | 'review_approved'
  | 'review_denied'
  | 'canceled'
  | 'executed'
  | 'failed'
  | 'expired';

export interface CustodyActivity {
  task: TaskDetails;
  id: string;
  created_at: string;
}

export interface ListCustodyActivitiesResponse {
  result?: CustodyActivity[] | null;
  errors: CustodyApiError[];
  start: number;
  total: number;
}

// Custody API - Get Activity by ID
export interface ActivityDetails {
  type: ActivityAction;
  comment?: string | null;
  user: TaskUser;
  [key: string]: any; // Activity details vary based on type
}

export interface GetCustodyActivityResponse {
  result?: ActivityDetails | null;
  errors: CustodyApiError[];
}

// OTC REST API - Quotes
export interface OtcQuote {
  [key: string]: any; // Quote details vary
}

export interface CreateOtcQuoteRequestResponse {
  result?: {
    quote: OtcQuote;
  };
  error: string[];
}

export interface UpdateOtcQuoteResponse {
  result?: {
    quote_id?: string;
  };
  error: string[];
}

export interface OtcPair {
  base: string;
  quote: string;
  pair_name: string;
  pair_decimals: number;
  lot_decimals: number;
  cost_decimals: number;
  max_base_amount: string;
  max_notional?: string;
  min_base_amount?: string;
  min_notional?: string;
}

export interface GetOtcPairsResponse {
  result: {
    spot_pairs: OtcPair[];
  };
  error: string[];
}

export interface OtcActiveQuote {
  expires: {
    time: number;
  };
  quote_id: string;
  client_order_id?: string | null;
  base: string;
  quote: string;
  type: string;
  price?: string;
  amount: string;
  total?: string;
  settlement: string;
}

export interface GetOtcActiveQuotesResponse {
  result?: OtcActiveQuote[];
  error: string[];
}

export interface OtcHistoricalQuote {
  trade_id?: string | null;
  status?: string | null;
  acceptance: {
    status: string;
    time: number;
  };
  settlement_status: string;
  quote_id: string;
  client_order_id?: string | null;
  base: string;
  quote: string;
  type: string;
  price: string;
  amount: string;
  total: string;
  settlement: string;
}

export interface GetOtcHistoricalQuotesResponse {
  result?: OtcHistoricalQuote[];
  error: string[];
}

export interface OtcExposures {
  max_otc: string;
  max_rfq: string;
  used_otc: string;
  used_rfq: string;
}

export interface GetOtcExposuresResponse {
  result?: OtcExposures;
  error: string[];
}

export interface CheckOtcClientResponse {
  result?: {
    permissions: string[];
  };
  error: string[];
}
