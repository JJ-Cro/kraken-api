export interface AffiliateGetCpaProgressParams {
  iiban: string;
}

export interface AffiliateGetPayoutHistoryParams {
  cursor?: string;
  limit?: number;
}

export interface AffiliateGetDailyActivityParams {
  activity_date?: string;
  iiban?: string;
  start_date?: string;
  end_date?: string;
  all_users?: boolean;
  cursor?: string;
  limit?: number;
}
