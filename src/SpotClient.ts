import { AxiosRequestConfig } from 'axios';
import { nanoid } from 'nanoid';

import { BaseRestClient } from './lib/BaseRestClient.js';
import {
  REST_CLIENT_TYPE_ENUM,
  RestClientOptions,
  RestClientType,
} from './lib/requestUtils.js';
import {
  SpotGetAssetInfoParams,
  SpotGetAssetPairsParams,
  SpotGetOHLCParams,
  SpotGetOrderBookParams,
  SpotGetRecentSpreadsParams,
  SpotGetRecentTradesParams,
  SpotGetTickerParams,
} from './types/request/spot.types.js';
import { SpotAPISuccessResponse } from './types/response/shared.types.js';
import {
  SpotAssetInfo,
  SpotAssetPair,
  SpotAssetTickerInfo,
  SpotOHLCResponse,
  SpotOrderBookResponse,
  SpotRecentSpreadsResponse,
  SpotRecentTradesResponse,
  SpotServerTime,
  SpotSystemStatus,
} from './types/response/spot.types.js';

/**
 * The SpotClient provides integration to the Kraken Spot API.
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

  /**
   * Get Server Time
   *
   * Get the server's time.
   */
  getServerTime(): Promise<SpotAPISuccessResponse<SpotServerTime>> {
    return this.get(`0/public/Time`);
  }

  /**
   * Get System Status
   *
   * Get the current system status or trading mode.
   */
  getSystemStatus(): Promise<SpotAPISuccessResponse<SpotSystemStatus>> {
    return this.get('0/public/SystemStatus');
  }

  /**
   * Get Asset Info
   *
   * Get information about the assets that are available for deposit, withdrawal, trading and earn.
   */
  getAssetInfo(
    params?: SpotGetAssetInfoParams,
  ): Promise<SpotAPISuccessResponse<Record<string, SpotAssetInfo>>> {
    return this.get('0/public/Assets', params);
  }

  /**
   * Get Tradable Asset Pairs
   *
   * Get tradable asset pairs
   */
  getAssetPairs(
    params?: SpotGetAssetPairsParams,
  ): Promise<SpotAPISuccessResponse<Record<string, SpotAssetPair>>> {
    return this.get('0/public/AssetPairs', params);
  }

  /**
   * Get Ticker Information
   *
   * Get ticker information for all or requested markets.
   * Note: Today's prices start at midnight UTC.
   * Leaving the pair parameter blank will return tickers for all tradeable assets on Kraken.
   */
  getTicker(
    params?: SpotGetTickerParams,
  ): Promise<SpotAPISuccessResponse<Record<string, SpotAssetTickerInfo>>> {
    return this.get('0/public/Ticker', params);
  }

  /**
   * Get OHLC Data
   *
   * Retrieve OHLC market data. The last entry in the OHLC array is for the current, not-yet-committed timeframe,
   * and will always be present, regardless of the value of since. Returns up to 720 of the most recent entries
   * (older data cannot be retrieved, regardless of the value of since).
   */
  getCandles(
    params: SpotGetOHLCParams,
  ): Promise<SpotAPISuccessResponse<SpotOHLCResponse>> {
    return this.get('0/public/OHLC', params);
  }

  /**
   * Get Order Book
   *
   * Returns level 2 (L2) order book, which describes the individual price levels in the book with aggregated
   * order quantities at each level.
   */
  getOrderBook(
    params: SpotGetOrderBookParams,
  ): Promise<SpotAPISuccessResponse<SpotOrderBookResponse>> {
    return this.get('0/public/Depth', params);
  }

  /**
   * Get Recent Trades
   *
   * Returns the last 1000 trades by default
   */
  getRecentTrades(
    params: SpotGetRecentTradesParams,
  ): Promise<SpotAPISuccessResponse<SpotRecentTradesResponse>> {
    return this.get('0/public/Trades', params);
  }

  /**
   * Get Recent Spreads
   *
   * Returns the last ~200 top-of-book spreads for a given pair
   */
  getRecentSpreads(
    params: SpotGetRecentSpreadsParams,
  ): Promise<SpotAPISuccessResponse<SpotRecentSpreadsResponse>> {
    return this.get('0/public/Spread', params);
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
   * Spot REST API - Account Information
   *
   */

  getAccountBalance(params: any): Promise<SpotAPISuccessResponse<any>> {
    return this.getPrivate(`0/private/Balance`, params);
  }
}
