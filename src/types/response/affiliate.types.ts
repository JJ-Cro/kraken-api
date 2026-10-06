export interface AffiliateCpaConditionMeasurement {
  current: string;
  target: string;
  unit?: string;
  percentage: string;
}

export interface AffiliateCpaConditionProgress {
  label: string;
  kind: 'amount' | 'count' | 'verification' | 'binary' | (string & {});
  state: 'incomplete' | 'complete' | (string & {});
  measurement?: AffiliateCpaConditionMeasurement;
}

export interface AffiliateCpaBountyProgress {
  bounty_position?: number;
  description?: string;
  reward_amount: string;
  reward_asset: string;
  status:
    | 'in_progress'
    | 'qualified_payment_pending'
    | 'paid'
    | 'expired'
    | 'no_longer_eligible'
    | 'not_tracked'
    | (string & {});
  qualified_at?: string;
  progress_availability: 'available' | 'unavailable' | (string & {});
  conditions?: AffiliateCpaConditionProgress[];
}

export interface AffiliateReferralCpaProgress {
  bounties?: AffiliateCpaBountyProgress[];
}

export interface AffiliateGetCpaProgressResponse {
  progress: AffiliateReferralCpaProgress;
}

export interface AffiliatePayout {
  payout_id: string;
  amount: string;
  asset: string;
  status:
    | 'pending'
    | 'paid'
    | 'action_needed'
    | 'on_hold'
    | 'refunded'
    | 'cancelled'
    | (string & {});
  created_at: string;
  source:
    | 'revshare'
    | 'prop'
    | 'cpa'
    | 'futures_accelerator_bonus'
    | (string & {});
  prop_purchase_id?: string;
}

export interface AffiliatePropPayoutSummary {
  paid: string;
  pending: string;
  order_count: number;
}

export interface AffiliateCpaPayoutSummary {
  paid: string;
  pending: string;
  bounty_count: number;
}

export interface AffiliatePayoutSummary {
  paid: string;
  pending: string;
  prop: AffiliatePropPayoutSummary;
  cpa: AffiliateCpaPayoutSummary;
}

export interface AffiliateGetPayoutHistoryResponse {
  items?: AffiliatePayout[];
  next_cursor?: string;
  summary: AffiliatePayoutSummary;
  limit: number;
}

export interface AffiliateMakerTakerActivity {
  volume: string;
  fees: string;
  commission: string;
  event_count: number;
}

export interface AffiliateGeoBlockedActivity {
  volume?: string;
  fees: string;
  event_count: number;
}

export interface AffiliateProductActivity {
  volume?: string;
  fees: string;
  commission: string;
  event_count: number;
  geo_blocked?: AffiliateGeoBlockedActivity;
  maker?: AffiliateMakerTakerActivity;
  taker?: AffiliateMakerTakerActivity;
}

export interface AffiliateProductActivityMap {
  [product: string]: AffiliateProductActivity;
}

export interface AffiliateReferralPlan {
  referral_code: string;
  campaign?: string;
  referral_level?: number;
  enrolled_at?: string;
  status?: string;
  earning?: boolean;
  expires_at?: string;
  products?: AffiliateProductActivityMap;
}

export interface AffiliateDailyActivityItem {
  activity_date?: string;
  iiban?: string;
  masked_iiban?: string;
  plans: AffiliateReferralPlan[];
  referee_reference: string;
  opted_out?: boolean;
  enrolled_at?: string;
  estimated?: boolean;
}

export interface AffiliateGatedActivitySummary {
  active_participants: number;
  products?: AffiliateProductActivityMap;
}

export type AffiliateGatedActivity =
  | { suppressed: Record<string, unknown> }
  | { summary: AffiliateGatedActivitySummary };

export interface AffiliateGetDailyActivityResponse {
  activity_date?: string;
  currency: string;
  revision?: string;
  generated_at: string;
  active_users?: number;
  totals?: AffiliateProductActivityMap;
  next_cursor?: string;
  items?: AffiliateDailyActivityItem[];
  estimated?: boolean;
  opted_out?: AffiliateGatedActivity;
  limit: number;
}
