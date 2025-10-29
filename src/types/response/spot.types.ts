/**
 * Market Data
 */

export interface SpotServerTime {
  unixtime: number;
  rfc1123: string;
}

export interface SpotSystemStatus {
  status: 'online' | 'maintenance' | 'cancel_only' | 'post_only';
  timestamp: string;
}

export interface SpotAssetInfo {
  aclass: string;
  altname: string;
  decimals: number;
  display_decimals: number;
  collateral_value?: number;
  status?: string;
}

export interface SpotAssetPair {
  altname: string;
  wsname?: string;
  aclass_base: string;
  base: string;
  aclass_quote: string;
  quote: string;
  lot?: string;
  pair_decimals: number;
  cost_decimals: number;
  lot_decimals: number;
  lot_multiplier: number;
  leverage_buy?: number[];
  leverage_sell?: number[];
  fees?: number[][];
  fees_maker?: number[][];
  fee_volume_currency?: string;
  margin_call?: number;
  margin_stop?: number;
  ordermin: string;
  costmin?: string;
  tick_size?: string;
  status?: string;
  long_position_limit?: number;
  short_position_limit?: number;
}

export interface SpotAssetTickerInfo {
  a: string[]; // Ask [price, whole lot volume, lot volume]
  b: string[]; // Bid [price, whole lot volume, lot volume]
  c: string[]; // Last trade closed [price, lot volume]
  v: string[]; // Volume [today, last 24 hours]
  p: string[]; // Volume weighted average price [today, last 24 hours]
  t: number[]; // Number of trades [today, last 24 hours]
  l: string[]; // Low [today, last 24 hours]
  h: string[]; // High [today, last 24 hours]
  o: string; // Today's opening price
}

// [time, open, high, low, close, vwap, volume, count]
export type SpotOHLCData = [
  number,
  string,
  string,
  string,
  string,
  string,
  string,
  number,
];

export interface SpotOHLCResponse {
  last: number;
  [pairName: string]: SpotOHLCData[] | number;
}

// [price, volume, timestamp]
export type SpotOrderBookEntry = [string, string, number];

export interface SpotOrderBook {
  asks: SpotOrderBookEntry[];
  bids: SpotOrderBookEntry[];
}

export interface SpotOrderBookResponse {
  [pairName: string]: SpotOrderBook;
}

// [price, volume, time, buy/sell, market/limit, miscellaneous, trade_id]
export type SpotTradeData = [
  string,
  string,
  number,
  string,
  string,
  string,
  number,
];

export interface SpotRecentTradesResponse {
  last: string;
  [pairName: string]: SpotTradeData[] | string;
}

// [time, bid, ask]
export type SpotSpreadData = [number, string, string];

export interface SpotRecentSpreadsResponse {
  last: number;
  [pairName: string]: SpotSpreadData[] | number;
}
