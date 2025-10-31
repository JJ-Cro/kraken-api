// Custody API - List Vaults

export type OrderDirection = 'asc' | 'desc';
export type CaseMatching = 'insensitive' | 'sensitive';

// Filter types for vault listing
export type VaultFilterBy =
  | 'id'
  | 'name'
  | 'default_approvals'
  | 'created_at'
  | 'updated_at'
  | 'member';

export type VaultOrderBy = 'id' | 'name' | 'created_at' | 'updated_at';

// Individual filter types
export interface VaultFilterIdEquals {
  type: 'equals';
  values: string[];
  by: 'id';
}

export interface VaultFilterNameEquals {
  type: 'equals';
  values: string[];
  case?: CaseMatching;
  by: 'name';
}

export interface VaultFilterNameStartsWith {
  type: 'starts_with';
  values: string[];
  case?: CaseMatching;
  by: 'name';
}

export interface VaultFilterNameContains {
  type: 'contains';
  values: string[];
  case?: CaseMatching;
  by: 'name';
}

export interface VaultFilterDefaultApprovalsEquals {
  type: 'equals';
  values: number[];
  by: 'default_approvals';
}

export interface VaultFilterDefaultApprovalsIn {
  type: 'in';
  left?: number;
  right?: number;
  by: 'default_approvals';
}

export interface VaultFilterCreatedAtEquals {
  type: 'equals';
  values: string[];
  by: 'created_at';
}

export interface VaultFilterCreatedAtIn {
  type: 'in';
  left?: string;
  right?: string;
  by: 'created_at';
}

export interface VaultFilterUpdatedAtEquals {
  type: 'equals';
  values: string[];
  by: 'updated_at';
}

export interface VaultFilterUpdatedAtIn {
  type: 'in';
  left?: string;
  right?: string;
  by: 'updated_at';
}

export interface VaultFilterMemberEquals {
  type: 'equals';
  values: string[];
  by: 'member';
}

export type VaultFilterCondition =
  | VaultFilterIdEquals
  | VaultFilterNameEquals
  | VaultFilterNameStartsWith
  | VaultFilterNameContains
  | VaultFilterDefaultApprovalsEquals
  | VaultFilterDefaultApprovalsIn
  | VaultFilterCreatedAtEquals
  | VaultFilterCreatedAtIn
  | VaultFilterUpdatedAtEquals
  | VaultFilterUpdatedAtIn
  | VaultFilterMemberEquals;

export interface VaultFilterOr {
  or: VaultFilterCondition[];
}

export interface VaultFilters {
  and?: VaultFilterOr[];
}

export interface VaultPagination {
  limit: number;
  offset: number;
}

export interface VaultOrdering {
  by: VaultOrderBy;
  direction?: OrderDirection;
}

export interface ListCustodyVaultsParams {
  nonce?: number;
  resolve_policies?: boolean | null;
  filters?: VaultFilters;
  pagination?: VaultPagination;
  orderings?: VaultOrdering[];
}

// Custody API - Deposit Methods
export type AssetClass =
  | 'currency'
  | 'forex'
  | 'equity'
  | 'equitypair'
  | 'nft'
  | 'volume';

export interface DepositMethodsParams {
  'x-vault-id': string;
  nonce?: number;
  asset?: string;
  category: 'custody';
  aclass?: string;
}

// Custody API - Deposit Addresses
export interface DepositAddressesParams {
  'x-vault-id': string;
  nonce?: number;
  aclass?: AssetClass;
  asset: string;
  method: string;
  new?: boolean;
}

// Custody API - List Custody Transactions
export type TransactionTypeReq =
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

export type RefIdType =
  | 'funding'
  | 'trade'
  | 'adjustment'
  | 'transfer'
  | 'custody_transfer'
  | 'nft_transaction'
  | 'nft_id'
  | 'equity_trade'
  | 'legacy_staking_reward'
  | 'legacy_staking'
  | 'earn_ledger'
  | 'earn_strategy'
  | 'simple_trade'
  | 'simple_order_quote'
  | 'legacy_custody_transaction';

export type TransactionAssetClassReq =
  | 'currency'
  | 'forex'
  | 'equity'
  | 'equity_pair'
  | 'nft'
  | 'derivatives'
  | 'tokenized_asset'
  | 'futures_contract';

export interface QuoteAsset {
  asset: string;
  class: TransactionAssetClassReq;
}

export interface TransactionAssetFilter {
  asset: string;
  class: TransactionAssetClassReq;
}

export interface TransactionRefIdFilter {
  type: RefIdType;
  ref_id: string;
}

export interface TransactionSorting {
  order?: 'descending' | 'ascending';
}

export interface ListCustodyTransactionsParams {
  id: string;
  nonce?: number;
  page_size?: number;
  quote?: QuoteAsset;
  preferred_asset_name?: string;
  sorting?: TransactionSorting;
  cursor?: string;
  types?: TransactionTypeReq[];
  ids?: string[];
  assets?: TransactionAssetFilter[];
  ref_ids?: TransactionRefIdFilter[];
}

// Custody API - Get Transaction by ID
export interface GetCustodyTransactionParams {
  id: string;
  nonce?: number;
  vault_id: string;
  with_long_timeout?: boolean | null;
  quote?: QuoteAsset;
}

// Custody API - Withdraw Methods
export interface WithdrawMethodsParams {
  'x-vault-id': string;
  nonce?: number;
  asset?: string | null;
  category: 'custody';
  aclass?: string;
  network?: string | null;
}

// Custody API - Withdraw Addresses
export type WithdrawAddressAssetClass =
  | 'currency'
  | 'equity'
  | 'equity-pair'
  | 'forex'
  | 'nft'
  | 'volume';

export interface WithdrawAddressesParams {
  'x-vault-id': string;
  preferred_asset_name?: 'new' | 'alt';
  nonce?: number;
  aclass?: WithdrawAddressAssetClass;
  asset?: string | null;
  method?: string | null;
  key?: string | null;
  verified?: boolean | null;
}

// Custody API - List Tasks
export type TaskScope = 'domain' | 'vault';

export type TaskStateReq =
  | 'pending'
  | 'approved'
  | 'denied'
  | 'canceled'
  | 'expired'
  | 'executed'
  | 'failed';

export type TaskAction =
  | 'update_withdrawal_addresses'
  | 'request_withdrawal'
  | 'create_vault'
  | 'update_group_users'
  | 'update_role_users'
  | 'update_vault_users'
  | 'update_domain_policies'
  | 'update_vault_policies'
  | 'create_users'
  | 'update_vault'
  | 'update_status_users'
  | 'request_transfer_to_spot'
  | 'create_group'
  | 'update_permission_users'
  | 'create_api_users'
  | 'update_api_users'
  | 'update_vaults_users'
  | 'request_allocation'
  | 'request_deallocation';

export type TaskUserDecisionReq = 'approved' | 'denied' | 'undecided';

export type TaskOrderBy =
  | 'id'
  | 'vault_id'
  | 'state'
  | 'created_at'
  | 'updated_at'
  | 'expires_at';

export interface TaskFilterIdEquals {
  type: 'equals';
  values: string[];
  by: 'id';
}

export interface TaskFilterApprovalIdEquals {
  type: 'equals';
  values: string[];
  by: 'approval_id';
}

export interface TaskFilterVaultIdEquals {
  type: 'equals';
  values: string[];
  by: 'vault_id';
}

export interface TaskFilterScopeEquals {
  type: 'equals';
  values: TaskScope[];
  by: 'scope';
}

export interface TaskFilterStateEquals {
  type: 'equals';
  values: TaskStateReq[];
  by: 'state';
}

export interface TaskFilterActionEquals {
  type: 'equals';
  values: TaskAction[];
  by: 'action';
}

export interface TaskFilterCreatedAtEquals {
  type: 'equals';
  values: string[];
  by: 'created_at';
}

export interface TaskFilterUpdatedAtEquals {
  type: 'equals';
  values: string[];
  by: 'updated_at';
}

export interface TaskFilterExpiresAtEquals {
  type: 'equals';
  values: string[];
  by: 'expires_at';
}

export interface TaskFilterCurrentUserDecisionEquals {
  type: 'equals';
  values: TaskUserDecisionReq[];
  by: 'current_user_decision';
}

export type TaskFilterCondition =
  | TaskFilterIdEquals
  | TaskFilterApprovalIdEquals
  | TaskFilterVaultIdEquals
  | TaskFilterScopeEquals
  | TaskFilterStateEquals
  | TaskFilterActionEquals
  | TaskFilterCreatedAtEquals
  | TaskFilterUpdatedAtEquals
  | TaskFilterExpiresAtEquals
  | TaskFilterCurrentUserDecisionEquals;

export interface TaskFilterOr {
  or: TaskFilterCondition[];
}

export interface TaskFilters {
  and?: TaskFilterOr[];
}

export interface TaskOrdering {
  by: TaskOrderBy;
  direction?: OrderDirection;
}

export interface ListCustodyTasksParams {
  nonce?: number;
  filters?: TaskFilters;
  pagination?: VaultPagination;
  orderings?: TaskOrdering[];
}

// Custody API - List Activities
export type ActivityActionReq =
  | 'created'
  | 'review_approved'
  | 'review_denied'
  | 'canceled'
  | 'executed'
  | 'failed'
  | 'expired';

export type ActivityOrderBy = 'activity_created_at';

export interface ActivityFilterIdEquals {
  type: 'equals';
  values: string[];
  by: 'id';
}

export interface ActivityFilterScopeEquals {
  type: 'equals';
  values: TaskScope[];
  by: 'scope';
}

export interface ActivityFilterVaultIdEquals {
  type: 'equals';
  values: string[];
  by: 'vault_id';
}

export interface ActivityFilterTaskIdEquals {
  type: 'equals';
  values: string[];
  by: 'task_id';
}

export interface ActivityFilterApprovalIdEquals {
  type: 'equals';
  values: string[];
  by: 'approval_id';
}

export interface ActivityFilterTaskActionEquals {
  type: 'equals';
  values: TaskAction[];
  by: 'task_action';
}

export interface ActivityFilterActivityActionEquals {
  type: 'equals';
  values: ActivityActionReq[];
  by: 'activity_action';
}

export interface ActivityFilterCreatedAtEquals {
  type: 'equals';
  values: string[];
  by: 'created_at';
}

export interface ActivityFilterUserEquals {
  type: 'equals';
  values: string[];
  by: 'user';
}

export type ActivityFilterCondition =
  | ActivityFilterIdEquals
  | ActivityFilterScopeEquals
  | ActivityFilterVaultIdEquals
  | ActivityFilterTaskIdEquals
  | ActivityFilterApprovalIdEquals
  | ActivityFilterTaskActionEquals
  | ActivityFilterActivityActionEquals
  | ActivityFilterCreatedAtEquals
  | ActivityFilterUserEquals;

export interface ActivityFilterOr {
  or: ActivityFilterCondition[];
}

export interface ActivityFilters {
  and?: ActivityFilterOr[];
}

export interface ActivityOrdering {
  by: ActivityOrderBy;
  direction?: OrderDirection;
}

export interface ListCustodyActivitiesParams {
  nonce?: number;
  filters?: ActivityFilters;
  pagination?: VaultPagination;
  orderings?: ActivityOrdering[];
}

// OTC REST API - Quotes
export type OtcQuoteType = 'buy' | 'sell';
export type OtcQuoteStatus = 'accepted' | 'rejected';
export type OtcSettlement = 'automated' | 'flexible';

export interface CreateOtcQuoteRequestParams {
  nonce?: number;
  base: string;
  quote: string;
  amount?: string;
  total?: string;
  type: OtcQuoteType;
}

export interface UpdateOtcQuoteParams {
  nonce?: number;
  quote_id: string;
  status: OtcQuoteStatus;
}
