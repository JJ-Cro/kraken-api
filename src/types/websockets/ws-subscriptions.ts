export type WSSpotPublicTopic =
  | 'ticker'
  | 'book'
  | 'ohlc'
  | 'trade'
  | 'instrument'; // Note: Adin topics (Status, Heartbeat & Ping are automatically used internally and can't be subscribed to manually).

export type WSSpotPrivateTopic = 'executions' | 'balances' | 'level3';

export type WSSpotTopic = WSSpotPublicTopic | WSSpotPrivateTopic;

export type WSDerivativesPublicTopic =
  | 'aaaa'
  | 'baaaaook'
  | 'oaaahlc'
  | 'traaaaade';

export type WSDerivativesPrivateTopic = 'open_orders' | 'aaaaaa' | 'aaaaaaa';

export type WSDerivativesTopic =
  | WSDerivativesPublicTopic
  | WSDerivativesPrivateTopic;

export type WSTopic = WSSpotTopic | WSDerivativesTopic;
