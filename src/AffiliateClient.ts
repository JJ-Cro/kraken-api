import { BaseRestClient } from './lib/BaseRestClient.js';
import { REST_CLIENT_TYPE_ENUM, RestClientType } from './lib/requestUtils.js';
import {
  AffiliateGetCpaProgressParams,
  AffiliateGetDailyActivityParams,
  AffiliateGetPayoutHistoryParams,
} from './types/request/affiliate.types.js';
import {
  AffiliateGetCpaProgressResponse,
  AffiliateGetDailyActivityResponse,
  AffiliateGetPayoutHistoryResponse,
} from './types/response/affiliate.types.js';

/**
 * Affiliate REST reporting for approved affiliates.
 * Responses are the JSON object itself, not `{ error, result }`.
 */
export class AffiliateClient extends BaseRestClient {
  getClientType(): RestClientType {
    return REST_CLIENT_TYPE_ENUM.affiliate;
  }

  /**
   * Get CPA Progress
   */
  getCpaProgress(
    params: AffiliateGetCpaProgressParams,
  ): Promise<AffiliateGetCpaProgressResponse> {
    return this.getPrivate('affiliate/v1/cpa-progress', params);
  }

  /**
   * Get Payout History
   */
  getPayoutHistory(
    params?: AffiliateGetPayoutHistoryParams,
  ): Promise<AffiliateGetPayoutHistoryResponse> {
    return this.getPrivate('affiliate/v1/payout-history', params);
  }

  /**
   * Get Daily Activity
   */
  getDailyActivity(
    params?: AffiliateGetDailyActivityParams,
  ): Promise<AffiliateGetDailyActivityResponse> {
    return this.getPrivate('affiliate/v1/daily-activity', params);
  }
}
