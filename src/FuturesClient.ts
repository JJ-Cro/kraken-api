import { AxiosRequestConfig } from 'axios';
import { nanoid } from 'nanoid';

import { BaseRestClient } from './lib/BaseRestClient.js';
import {
  REST_CLIENT_TYPE_ENUM,
  RestClientOptions,
  RestClientType,
} from './lib/requestUtils.js';
import {
  FuturesAddAssignmentPreferenceParams,
  FuturesBatchOrderParams,
  FuturesCancelAllOrdersParams,
  FuturesCancelOrderParams,
  FuturesDeadMansSwitchParams,
  FuturesEditOrderParams,
  FuturesGetAccountLogCsvParams,
  FuturesGetAccountLogParams,
  FuturesGetAnalyticsParams,
  FuturesGetCandlesParams,
  FuturesGetFillsParams,
  FuturesGetHistoricalFundingRatesParams,
  FuturesGetOrderbookParams,
  FuturesGetOrderEventsParams,
  FuturesGetPositionEventsParams,
  FuturesGetSpecificOrdersStatusParams,
  FuturesGetTradeHistoryParams,
  FuturesGetTriggerEventsParams,
  FuturesHistoryBaseParams,
  FuturesInitiateSubaccountTransferParams,
  FuturesInitiateWalletTransferParams,
  FuturesInitiateWithdrawalParams,
  FuturesMarketHistoryBaseParams,
  FuturesPlaceOfferParams,
  FuturesReplaceOfferParams,
  FuturesSendOrderParams,
  FuturesSetLeveragePreferenceParams,
  FuturesSetPnlPreferenceParams,
  FuturesSimulatePortfolioParams,
  FuturesUpdateSelfTradeStrategyParams,
  FuturesUpdateSubaccountTradingStatusParams,
} from './types/request/futures.types.js';
import {
  FuturesAccountLog,
  FuturesAccounts,
  FuturesAnalyticsResponse,
  FuturesAnalyticsType,
  FuturesApiKeyV3Check,
  FuturesAssignmentProgram,
  FuturesAssignmentProgramHistory,
  FuturesBatchOrderStatus,
  FuturesCancelAllOrdersStatus,
  FuturesCancelOrderStatus,
  FuturesCandles,
  FuturesDeadMansSwitchStatus,
  FuturesEditOrderStatus,
  FuturesFeeSchedule,
  FuturesFill,
  FuturesHistoricalFundingRate,
  FuturesHistoryExecutionEvent,
  FuturesHistoryOrderEvent,
  FuturesHistoryResponse,
  FuturesHistoryTriggerEvent,
  FuturesInstrument,
  FuturesInstrumentStatus,
  FuturesLeveragePreference,
  FuturesMarketHistoryResponse,
  FuturesMarketShare,
  FuturesNotification,
  FuturesOpenOffer,
  FuturesOpenOrder,
  FuturesOpenPosition,
  FuturesOrderBook,
  FuturesOrderStatusInfo,
  FuturesPnlPreference,
  FuturesPortfolioMarginParameters,
  FuturesPortfolioSimulation,
  FuturesPositionUpdateEvent,
  FuturesPublicExecutionEvent,
  FuturesPublicMarkPriceEvent,
  FuturesPublicOrderEvent,
  FuturesResolution,
  FuturesRfq,
  FuturesSendOrderStatus,
  FuturesSubaccountsInfo,
  FuturesTicker,
  FuturesTickType,
  FuturesTradeHistoryItem,
  FuturesUnwindQueuePosition,
} from './types/response/futures.types.js';
import { APISuccessResponse } from './types/response/shared.types.js';

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

  getTradeHistory(
    params: FuturesGetTradeHistoryParams,
  ): Promise<APISuccessResponse<{ history: FuturesTradeHistoryItem[] }>> {
    return this.get('derivatives/api/v3/history', params);
  }

  getOrderbook(
    params: FuturesGetOrderbookParams,
  ): Promise<APISuccessResponse<{ orderBook: FuturesOrderBook }>> {
    return this.get('derivatives/api/v3/orderbook', params);
  }

  getTickers(): Promise<APISuccessResponse<{ tickers: FuturesTicker[] }>> {
    return this.get('derivatives/api/v3/tickers');
  }

  getTickerBySymbol(
    symbol: string,
  ): Promise<APISuccessResponse<{ ticker: FuturesTicker }>> {
    return this.get(`derivatives/api/v3/tickers/${symbol}`);
  }

  /**
   *
   * Futures REST API - Trading - Instrument Details
   *
   */

  getInstruments(): Promise<
    APISuccessResponse<{ instruments: FuturesInstrument[] }>
  > {
    return this.get('derivatives/api/v3/instruments');
  }

  getInstrumentStatusList(): Promise<
    APISuccessResponse<{ instrumentStatus: FuturesInstrumentStatus[] }>
  > {
    return this.get('derivatives/api/v3/instruments/status');
  }

  getInstrumentStatus(
    symbol: string,
  ): Promise<APISuccessResponse<FuturesInstrumentStatus>> {
    return this.get(`derivatives/api/v3/instruments/${symbol}/status`);
  }

  /**
   *
   * Futures REST API - Trading - Order Management
   *
   */

  batchOrderManagement(
    params: FuturesBatchOrderParams,
  ): Promise<APISuccessResponse<{ batchStatus: FuturesBatchOrderStatus[] }>> {
    return this.postPrivate('derivatives/api/v3/batchorder', {
      query: { ProcessBefore: params.ProcessBefore },
      body: params.json,
    });
  }

  cancelAllOrders(
    params?: FuturesCancelAllOrdersParams,
  ): Promise<
    APISuccessResponse<{ cancelStatus: FuturesCancelAllOrdersStatus }>
  > {
    return this.postPrivate('derivatives/api/v3/cancelallorders', {
      query: params,
    });
  }

  cancelAllOrdersAfter(
    params: FuturesDeadMansSwitchParams,
  ): Promise<APISuccessResponse<{ status: FuturesDeadMansSwitchStatus }>> {
    return this.postPrivate('derivatives/api/v3/cancelallordersafter', {
      query: params,
    });
  }

  cancelOrder(
    params: FuturesCancelOrderParams,
  ): Promise<APISuccessResponse<{ cancelStatus: FuturesCancelOrderStatus }>> {
    return this.postPrivate('derivatives/api/v3/cancelorder', {
      query: params,
    });
  }

  editOrder(
    params: FuturesEditOrderParams,
  ): Promise<APISuccessResponse<{ editStatus: FuturesEditOrderStatus }>> {
    return this.postPrivate('derivatives/api/v3/editorder', {
      query: params,
    });
  }

  getOpenOrders(): Promise<
    APISuccessResponse<{ openOrders: FuturesOpenOrder[] }>
  > {
    return this.getPrivate('derivatives/api/v3/openorders');
  }

  sendOrder(
    params: FuturesSendOrderParams,
  ): Promise<APISuccessResponse<{ sendStatus: FuturesSendOrderStatus }>> {
    return this.postPrivate('derivatives/api/v3/sendorder', {
      query: params,
    });
  }

  getSpecificOrdersStatus(
    params: FuturesGetSpecificOrdersStatusParams,
  ): Promise<APISuccessResponse<{ orders: FuturesOrderStatusInfo[] }>> {
    return this.postPrivate('derivatives/api/v3/orders/status', {
      query: params,
    });
  }

  /**
   *
   * Futures REST API - Trading - Multi-Collateral
   *
   */

  getPnlPreferences(): Promise<
    APISuccessResponse<{ preferences: FuturesPnlPreference[] }>
  > {
    return this.getPrivate('derivatives/api/v3/pnlpreferences');
  }

  setPnlPreference(
    params: FuturesSetPnlPreferenceParams,
  ): Promise<APISuccessResponse<Record<string, never>>> {
    return this.putPrivate('derivatives/api/v3/pnlpreferences', {
      query: params,
    });
  }

  getLeveragePreferences(): Promise<
    APISuccessResponse<{ leveragePreferences: FuturesLeveragePreference[] }>
  > {
    return this.getPrivate('derivatives/api/v3/leveragepreferences');
  }

  setLeveragePreference(
    params: FuturesSetLeveragePreferenceParams,
  ): Promise<APISuccessResponse<Record<string, never>>> {
    return this.putPrivate('derivatives/api/v3/leveragepreferences', {
      query: params,
    });
  }

  /**
   *
   * Futures REST API - Trading - Account Information
   *
   */

  getAccounts(): Promise<APISuccessResponse<{ accounts: FuturesAccounts }>> {
    return this.getPrivate('derivatives/api/v3/accounts');
  }

  getOpenPositions(): Promise<
    APISuccessResponse<{ openPositions: FuturesOpenPosition[] }>
  > {
    return this.getPrivate('derivatives/api/v3/openpositions');
  }

  getUnwindQueue(): Promise<
    APISuccessResponse<{ queue: FuturesUnwindQueuePosition[] }>
  > {
    return this.getPrivate('derivatives/api/v3/unwindqueue');
  }

  getPortfolioMarginParameters(): Promise<
    APISuccessResponse<FuturesPortfolioMarginParameters>
  > {
    return this.getPrivate('derivatives/api/v3/portfolio-margining/parameters');
  }

  simulatePortfolio(
    params: FuturesSimulatePortfolioParams,
  ): Promise<APISuccessResponse<FuturesPortfolioSimulation>> {
    return this.postPrivate('derivatives/api/v3/portfolio-margining/simulate', {
      query: params,
    });
  }

  /**
   *
   * Futures REST API - Trading - Assignment Program
   *
   */

  listAssignmentPrograms(): Promise<
    APISuccessResponse<{ participants: FuturesAssignmentProgram[] }>
  > {
    return this.getPrivate('derivatives/api/v3/assignmentprogram/current');
  }

  addAssignmentPreference(
    params: FuturesAddAssignmentPreferenceParams,
  ): Promise<APISuccessResponse<FuturesAssignmentProgram>> {
    return this.postPrivate('derivatives/api/v3/assignmentprogram/add', {
      query: params,
    });
  }

  deleteAssignmentPreference(params: {
    id: number;
  }): Promise<APISuccessResponse<FuturesAssignmentProgram>> {
    return this.postPrivate('derivatives/api/v3/assignmentprogram/delete', {
      query: params,
    });
  }

  listAssignmentPreferencesHistory(): Promise<
    APISuccessResponse<{ participants: FuturesAssignmentProgramHistory[] }>
  > {
    return this.getPrivate('derivatives/api/v3/assignmentprogram/history');
  }

  /**
   *
   * Futures REST API - Trading - Fee Schedules
   *
   */

  getFeeSchedules(): Promise<
    APISuccessResponse<{ feeSchedules: FuturesFeeSchedule[] }>
  > {
    return this.get('derivatives/api/v3/feeschedules');
  }

  getFeeScheduleVolumes(): Promise<
    APISuccessResponse<{ volumesByFeeSchedule: Record<string, number> }>
  > {
    return this.getPrivate('derivatives/api/v3/feeschedules/volumes');
  }

  /**
   *
   * Futures REST API - Trading - General
   *
   */

  getNotifications(): Promise<
    APISuccessResponse<{ notifications: FuturesNotification[] }>
  > {
    return this.getPrivate('derivatives/api/v3/notifications');
  }

  /**
   *
   * Futures REST API - Trading - Historical Data
   *
   */

  getFills(
    params?: FuturesGetFillsParams,
  ): Promise<APISuccessResponse<{ fills: FuturesFill[] }>> {
    return this.getPrivate('derivatives/api/v3/fills', params);
  }

  /**
   *
   * Futures REST API - Trading - Historical Funding Rates
   *
   */

  getHistoricalFundingRates(
    params: FuturesGetHistoricalFundingRatesParams,
  ): Promise<APISuccessResponse<{ rates: FuturesHistoricalFundingRate[] }>> {
    return this.get('derivatives/api/v3/historical-funding-rates', params);
  }

  /**
   *
   * Futures REST API - Trading - Trading Settings
   *
   */

  getSelfTradeStrategy(): Promise<
    APISuccessResponse<{
      strategy:
        | 'REJECT_TAKER'
        | 'CANCEL_MAKER_SELF'
        | 'CANCEL_MAKER_CHILD'
        | 'CANCEL_MAKER_ANY';
    }>
  > {
    return this.getPrivate('derivatives/api/v3/self-trade-strategy');
  }

  updateSelfTradeStrategy(
    params: FuturesUpdateSelfTradeStrategyParams,
  ): Promise<
    APISuccessResponse<{
      strategy:
        | 'REJECT_TAKER'
        | 'CANCEL_MAKER_SELF'
        | 'CANCEL_MAKER_CHILD'
        | 'CANCEL_MAKER_ANY';
    }>
  > {
    return this.putPrivate('derivatives/api/v3/self-trade-strategy', {
      query: params,
    });
  }

  /**
   *
   * Futures REST API - Trading - Subaccounts
   *
   */

  checkSubaccountTradingStatus(
    subaccountUid: string,
  ): Promise<APISuccessResponse<{ tradingEnabled: boolean }>> {
    return this.getPrivate(
      `derivatives/api/v3/subaccount/${subaccountUid}/trading-enabled`,
    );
  }

  updateSubaccountTradingStatus(
    subaccountUid: string,
    params: FuturesUpdateSubaccountTradingStatusParams,
  ): Promise<APISuccessResponse<{ tradingEnabled: boolean }>> {
    return this.putPrivate(
      `derivatives/api/v3/subaccount/${subaccountUid}/trading-enabled`,
      { query: params },
    );
  }

  getSubaccounts(): Promise<APISuccessResponse<FuturesSubaccountsInfo>> {
    return this.getPrivate('derivatives/api/v3/subaccounts');
  }

  /**
   *
   * Futures REST API - Trading - Transfers
   *
   */

  initiateWalletTransfer(
    params: FuturesInitiateWalletTransferParams,
  ): Promise<APISuccessResponse<Record<string, never>>> {
    return this.postPrivate('derivatives/api/v3/transfer', {
      query: params,
    });
  }

  initiateSubaccountTransfer(
    params: FuturesInitiateSubaccountTransferParams,
  ): Promise<APISuccessResponse<Record<string, never>>> {
    return this.postPrivate('derivatives/api/v3/transfer/subaccount', {
      query: params,
    });
  }

  initiateWithdrawal(
    params: FuturesInitiateWithdrawalParams,
  ): Promise<APISuccessResponse<{ uid: string }>> {
    return this.postPrivate('derivatives/api/v3/withdrawal', {
      query: params,
    });
  }

  /**
   *
   * Futures REST API - Trading - RFQs
   *
   */

  listAllOpenRfqs(): Promise<APISuccessResponse<{ rfqs: FuturesRfq[] }>> {
    return this.get('derivatives/api/v3/rfqs');
  }

  getSingleOpenRfq(
    rfqUid: string,
  ): Promise<APISuccessResponse<{ rfq: FuturesRfq }>> {
    return this.get(`derivatives/api/v3/rfqs/${rfqUid}`);
  }

  listOpenOffers(): Promise<
    APISuccessResponse<{ openOffers: FuturesOpenOffer[] }>
  > {
    return this.getPrivate('derivatives/api/v3/rfqs/open-offers');
  }

  placeNewOffer(
    rfqUid: string,
    params: FuturesPlaceOfferParams,
  ): Promise<APISuccessResponse<{ offerUid: string }>> {
    return this.postPrivate(`derivatives/api/v3/rfqs/${rfqUid}/place-offer`, {
      body: params,
    });
  }

  replaceOpenOffer(
    rfqUid: string,
    params: FuturesReplaceOfferParams,
  ): Promise<APISuccessResponse<Record<string, never>>> {
    return this.putPrivate(`derivatives/api/v3/rfqs/${rfqUid}/replace-offer`, {
      body: params,
    });
  }

  cancelOpenOffer(
    rfqUid: string,
  ): Promise<APISuccessResponse<Record<string, never>>> {
    return this.deletePrivate(`derivatives/api/v3/rfqs/${rfqUid}/cancel-offer`);
  }

  /**
   *
   * Futures REST API - History - Account History
   *
   */

  getExecutionEvents(
    params?: FuturesHistoryBaseParams,
  ): Promise<
    APISuccessResponse<FuturesHistoryResponse<FuturesHistoryExecutionEvent>>
  > {
    return this.getPrivate('api/history/v3/executions', { params });
  }

  getOrderEvents(
    params?: FuturesGetOrderEventsParams,
  ): Promise<
    APISuccessResponse<FuturesHistoryResponse<FuturesHistoryOrderEvent>>
  > {
    return this.getPrivate('api/history/v3/orders', { params });
  }

  getTriggerEvents(
    params?: FuturesGetTriggerEventsParams,
  ): Promise<
    APISuccessResponse<FuturesHistoryResponse<FuturesHistoryTriggerEvent>>
  > {
    return this.getPrivate('api/history/v3/triggers', { params });
  }

  getPositionEvents(
    params?: FuturesGetPositionEventsParams,
  ): Promise<
    APISuccessResponse<FuturesHistoryResponse<FuturesPositionUpdateEvent>>
  > {
    return this.getPrivate('api/history/v3/positions', { params });
  }

  getAccountLog(
    params?: FuturesGetAccountLogParams,
  ): Promise<APISuccessResponse<FuturesAccountLog>> {
    return this.getPrivate('api/history/v3/account-log', { params });
  }

  getAccountLogCsv(params?: FuturesGetAccountLogCsvParams): Promise<string> {
    return this.getPrivate('api/history/v3/accountlogcsv', { params });
  }

  /**
   *
   * Futures REST API - History - Market History
   *
   */

  getPublicExecutionEvents(
    tradeable: string,
    params?: FuturesMarketHistoryBaseParams,
  ): Promise<FuturesMarketHistoryResponse<FuturesPublicExecutionEvent>> {
    return this.get(`api/history/v3/market/${tradeable}/executions`, {
      params,
    });
  }

  getPublicOrderEvents(
    tradeable: string,
    params?: FuturesMarketHistoryBaseParams,
  ): Promise<FuturesMarketHistoryResponse<FuturesPublicOrderEvent>> {
    return this.get(`api/history/v3/market/${tradeable}/orders`, { params });
  }

  getPublicMarkPriceEvents(
    tradeable: string,
    params?: FuturesMarketHistoryBaseParams,
  ): Promise<FuturesMarketHistoryResponse<FuturesPublicMarkPriceEvent>> {
    return this.get(`api/history/v3/market/${tradeable}/price`, { params });
  }

  /**
   *
   * Futures REST API - Charts - Candles
   *
   */

  getTickTypes(): Promise<FuturesTickType[]> {
    return this.get('api/charts/v1/');
  }

  getMarketsForTickType(tickType: FuturesTickType): Promise<string[]> {
    return this.get(`api/charts/v1/${tickType}`);
  }

  getResolutions(
    tickType: FuturesTickType,
    symbol: string,
  ): Promise<FuturesResolution[]> {
    return this.get(`api/charts/v1/${tickType}/${symbol}`);
  }

  getCandles(
    tickType: FuturesTickType,
    symbol: string,
    resolution: FuturesResolution,
    params?: FuturesGetCandlesParams,
  ): Promise<FuturesCandles> {
    return this.get(`api/charts/v1/${tickType}/${symbol}/${resolution}`, {
      params,
    });
  }

  /**
   *
   * Futures REST API - Charts - Analytics
   *
   */

  getLiquidityPoolStatistic(
    params: FuturesGetAnalyticsParams,
  ): Promise<FuturesAnalyticsResponse> {
    return this.get('api/charts/v1/analytics/liquidity-pool', { params });
  }

  getMarketAnalytics(
    symbol: string,
    analyticsType: FuturesAnalyticsType,
    params: FuturesGetAnalyticsParams,
  ): Promise<FuturesAnalyticsResponse> {
    return this.get(`api/charts/v1/analytics/${symbol}/${analyticsType}`, {
      params,
    });
  }

  /**
   *
   * Futures REST API - Auth - API Keys
   *
   */

  checkApiKeyV3(): Promise<FuturesApiKeyV3Check> {
    return this.getPrivate('api/auth/v1/api-keys/v3/check');
  }

  /**
   *
   * Futures REST API - Stats - Market Share
   *
   */

  getAccountMarketShare(): Promise<FuturesMarketShare> {
    return this.getPrivate('api/stats/v1/rebates/self-market-share');
  }
}
