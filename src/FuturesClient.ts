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
import { APISuccessResponse } from './types/response/shared.types.js';
import { WsConnectionInfo } from './types/response/ws.js';

/**
 * The FuturesClient provides integration to the Kraken Futures API.
 *
 * Docs:
 * - https://docs.kraken.com/api/docs/guides/futures-introduction
 * - https://docs.kraken.com/api/docs/guides/futures-rest
 * - https://docs.kraken.com/api/docs/futures-api/trading/get-history
 */
export class FuturesClient extends BaseRestClient {
  constructor(
    restClientOptions: RestClientOptions = {},
    requestOptions: AxiosRequestConfig = {},
  ) {
    super(restClientOptions, requestOptions);
    return this;
  }

  getClientType(): RestClientType {
    return REST_CLIENT_TYPE_ENUM.futures;
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
   * Futures REST API - Trading - Market Data
   *
   */

  getTradeHistory(params: {
    symbol: string;
    lastTime?: string;
  }): Promise<APISuccessResponse<{ history: any[] }>> {
    return this.get(`derivatives/api/v3/history`, params);
  }

  /**
   *
   * Futures REST API - Trading - Order Management
   *
   */

  sendOrder(params?: any): Promise<APISuccessResponse<any>> {
    return this.postPrivate('derivatives/api/v3/sendorder', {
      ...params,
    });
  }

  getSpecificOrdersStatus(params?: {
    orderIds?: string[];
    cliOrdIds?: string[];
  }): Promise<APISuccessResponse<any>> {
    return this.postPrivate(`derivatives/api/v3/orders/status`, {
      ...params,
      // orderIds: params?.orderIds ? params.orderIds.join(',') : undefined,
    });
  }

  /**
   *
   * Futures REST API - Trading - Account Information
   *
   */

  getWallets(): Promise<APISuccessResponse<{ accounts: any }>> {
    return this.getPrivate(`derivatives/api/v3/accounts`);
  }

  /**
   *
   * Futures REST API - Trading - Historical Data
   *
   */

  getYourFills(params?: {
    lastFillTime?: string;
  }): Promise<APISuccessResponse<any>> {
    return this.getPrivate(`derivatives/api/v3/fills`, params);
  }
}
