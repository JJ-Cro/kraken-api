/**
 * Market Data
 */

export interface SpotGetAssetInfoParams {
  asset?: string;
  aclass?: 'currency' | 'tokenized_asset';
}

export interface SpotGetAssetPairsParams {
  pair?: string;
  aclass_base?: 'currency' | 'tokenized_asset';
  info?: 'info' | 'leverage' | 'fees' | 'margin';
  country_code?: string;
}

export interface SpotGetTickerParams {
  pair?: string;
  asset_class?: 'tokenized_asset' | 'forex';
}

export interface SpotGetOHLCParams {
  pair: string;
  interval?: 1 | 5 | 15 | 30 | 60 | 240 | 1440 | 10080 | 21600;
  since?: number;
  asset_class?: 'tokenized_asset';
}

export interface SpotGetOrderBookParams {
  pair: string;
  count?: number;
  asset_class?: 'tokenized_asset';
}

export interface SpotGetRecentTradesParams {
  pair: string;
  since?: string;
  count?: number;
  asset_class?: 'tokenized_asset';
}

export interface SpotGetRecentSpreadsParams {
  pair: string;
  since?: number;
  asset_class?: 'tokenized_asset';
}
