/**
 * Market Data
 */

export interface FuturesGetTradeHistoryParams {
  symbol: string;
  lastTime?: string; // Returns the last 100 trades from the specified lastTime value
}

export interface FuturesGetOrderbookParams {
  symbol: string;
}

/**
 * Order Management
 */

export interface FuturesBatchOrderSend {
  order: 'send';
  order_tag: string;
  orderType:
    | 'lmt'
    | 'post'
    | 'ioc'
    | 'mkt'
    | 'stp'
    | 'take_profit'
    | 'trailing_stop'
    | 'fok';
  symbol: string;
  side: 'buy' | 'sell';
  size: number;
  limitPrice?: number;
  stopPrice?: number;
  cliOrdId?: string;
  triggerSignal?: 'mark' | 'index' | 'last';
  reduceOnly?: boolean;
  trailingStopMaxDeviation?: number;
  trailingStopDeviationUnit?: 'PERCENT' | 'QUOTE_CURRENCY';
}

export interface FuturesBatchOrderEdit {
  order: 'edit';
  order_id: string;
  cliOrdId?: string | null;
  size?: number;
  limitPrice?: number;
  stopPrice?: number;
  trailingStopMaxDeviation?: number;
  trailingStopDeviationUnit?: 'PERCENT' | 'QUOTE_CURRENCY';
  qtyMode?: 'ABSOLUTE' | 'RELATIVE';
}

export interface FuturesBatchOrderCancel {
  order: 'cancel';
  order_id?: string;
  cliOrdId?: string;
}

export interface FuturesBatchOrderParams {
  ProcessBefore?: string;
  json: {
    batchOrder: (
      | FuturesBatchOrderSend
      | FuturesBatchOrderEdit
      | FuturesBatchOrderCancel
    )[];
  };
}

export interface FuturesCancelAllOrdersParams {
  symbol?: string;
}

export interface FuturesDeadMansSwitchParams {
  timeout: number;
}

export interface FuturesCancelOrderParams {
  processBefore?: string;
  order_id?: string;
  cliOrdId?: string;
}

export interface FuturesEditOrderParams {
  processBefore?: string;
  orderId?: string;
  cliOrdId?: string;
  size?: number;
  limitPrice?: number;
  stopPrice?: number;
  trailingStopMaxDeviation?: number;
  trailingStopDeviationUnit?: 'PERCENT' | 'QUOTE_CURRENCY';
  qtyMode?: 'ABSOLUTE' | 'RELATIVE';
}

export interface FuturesSendOrderParams {
  processBefore?: string;
  orderType:
    | 'lmt'
    | 'post'
    | 'ioc'
    | 'mkt'
    | 'stp'
    | 'take_profit'
    | 'trailing_stop'
    | 'fok';
  symbol: string;
  side: 'buy' | 'sell';
  size: number;
  limitPrice?: number;
  stopPrice?: number;
  cliOrdId?: string;
  triggerSignal?: 'mark' | 'index' | 'last';
  reduceOnly?: boolean;
  trailingStopMaxDeviation?: number;
  trailingStopDeviationUnit?: 'PERCENT' | 'QUOTE_CURRENCY';
  limitPriceOffsetValue?: number;
  limitPriceOffsetUnit?: 'QUOTE_CURRENCY' | 'PERCENT';
  broker?: string;
}

export interface FuturesGetSpecificOrdersStatusParams {
  orderIds?: string[];
  cliOrdIds?: string[];
}

/**
 * Multi-Collateral
 */

export interface FuturesSetPnlPreferenceParams {
  symbol: string;
  pnlPreference: string;
}

export interface FuturesSetLeveragePreferenceParams {
  symbol: string;
  maxLeverage?: number;
}

/**
 * Account Information
 */

export interface FuturesSimulatePortfolioParams {
  json: any; // Complex structure for portfolio simulation
}

/**
 * Assignment Program
 */

export interface FuturesAddAssignmentPreferenceParams {
  contractType: string;
  contract?: string;
  maxSize?: number;
  maxPosition?: number;
  acceptLong: boolean;
  acceptShort: boolean;
  timeFrame: 'all' | 'weekdays' | 'weekends';
  enabled: boolean;
}

/**
 * Historical Data
 */

export interface FuturesGetFillsParams {
  lastFillTime?: string;
}

/**
 * Historical Funding Rates
 */

export interface FuturesGetHistoricalFundingRatesParams {
  symbol: string;
}

/**
 * Trading Settings
 */

export interface FuturesUpdateSelfTradeStrategyParams {
  strategy:
    | 'REJECT_TAKER'
    | 'CANCEL_MAKER_SELF'
    | 'CANCEL_MAKER_CHILD'
    | 'CANCEL_MAKER_ANY';
}

/**
 * Subaccounts
 */

export interface FuturesUpdateSubaccountTradingStatusParams {
  tradingEnabled: boolean;
}

/**
 * Transfers
 */

export interface FuturesInitiateWalletTransferParams {
  fromAccount: string;
  toAccount: string;
  unit: string;
  amount: string;
}

export interface FuturesInitiateSubaccountTransferParams {
  fromUser: string;
  toUser: string;
  fromAccount: string;
  toAccount: string;
  unit: string;
  amount: string;
}

export interface FuturesInitiateWithdrawalParams {
  currency: string;
  amount: string;
  sourceWallet?: string;
}

/**
 * RFQs
 */

export interface FuturesPlaceOfferParams {
  bid?: number;
  ask?: number;
}

export interface FuturesReplaceOfferParams {
  bid?: number;
  ask?: number;
}
