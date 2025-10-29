import { AxiosRequestConfig } from 'axios';
import { nanoid } from 'nanoid';

import { BaseRestClient } from './lib/BaseRestClient.js';
import {
  APIIDMain,
  APIIDMainKey,
  REST_CLIENT_TYPE_ENUM,
  RestClientOptions,
  RestClientType,
} from './lib/requestUtils.js';
import { AccountFillsRequest } from './types/request/futures.types.js';
import { AccountBalance } from './types/response/futures.types.js';
import { SpotAPISuccessResponse } from './types/response/shared.types.js';
import { WsConnectionInfo } from './types/response/ws.js';

/**
 * The SpotClient provides integration to the Kraken Futures API.
 *
 * Docs:
 * - https://docs.kraken.com/api/docs/guides/spot-rest-intro/
 * - https://docs.kraken.com/api/docs/rest-api/get-server-time
 */
export class SpotClient extends BaseRestClient {
  constructor(
    restClientOptions: RestClientOptions = {},
    requestOptions: AxiosRequestConfig = {},
  ) {
    super(restClientOptions, requestOptions);
    return this;
  }

  getClientType(): RestClientType {
    // Points to api.kraken.com
    return REST_CLIENT_TYPE_ENUM.main;
  }

  /**
   *
   * Misc Utility Methods
   *
   */

  generateNewOrderID(): string {
    return nanoid(32);
  }

  /**
   *
   * Spot REST API - Market Data
   *
   */

  getServerTime(): Promise<SpotAPISuccessResponse<any>> {
    return this.get(`0/public/Time`);
  }

  /**
   *
   * Spot REST API - AccountData
   *
   */

  getOpenOrders(params?: any): Promise<SpotAPISuccessResponse<any>> {
    return this.postPrivate('0/private/OpenOrders', params);
  }

  /**
   *
   * Spot REST API - Trading
   *
   */

  addOrder(params: any): Promise<SpotAPISuccessResponse<any>> {
    return this.postPrivate('0/private/AddOrder', {
      body: params,
    });
  }

  /**
   *
   * Futures REST API - Trading - Account Information
   *
   */

  getAccountBalance(params: any): Promise<SpotAPISuccessResponse<any>> {
    return this.getPrivate(`0/private/Balance`, params);
  }
}
