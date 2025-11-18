export type WSSpotPublicTopic =
  | 'ticker'
  | 'book'
  | 'ohlc'
  | 'trade'
  | 'instrument'; // Note: Adin topics (Status, Heartbeat & Ping are automatically used internally and can't be subscribed to manually).

export type WSSpotPrivateTopic = 'executions' | 'balances' | 'level3';

export type WSSpotTopic = WSSpotPublicTopic | WSSpotPrivateTopic;

export type WSDerivativesPublicTopic =
  | 'ticker'
  | 'ticker_lite'
  | 'book'
  | 'trade';

export type WSDerivativesPrivateTopic =
  | 'open_orders'
  | 'open_orders_verbose'
  | 'fills'
  | 'balances'
  | 'open_positions'
  | 'account_log'
  | 'notifications_auth';

export type WSDerivativesTopic =
  | WSDerivativesPublicTopic
  | WSDerivativesPrivateTopic;

export type WSTopic = WSSpotTopic | WSDerivativesTopic;
