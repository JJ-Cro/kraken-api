export type WsOperation = 'subscribe' | 'unsubscribe';

export interface WsRequestOperation<TWSTopic extends string> {
  id: number;
  type: WsOperation;
  topic: TWSTopic;
  privateChannel: boolean;
  response: boolean;
}

export interface WSAPIAuthenticationRequestFromServer {
  timestamp: number;
  sessionId: string;
}

export interface WSAPIAuthenticationConfirmedFromServer {
  pingInterval: number;
  sessionId: string;
  pingTimeout: number;
  data: 'welcome';
}

export interface WsAPIWsKeyTopicMap {
  [k: string]: never;
}

export interface WsAPITopicRequestParamMap {
  [k: string]: never;
}

export interface WsAPITopicResponseMap {
  [k: string]: never;
}

export interface WsRequestOperationKraken<
  TWSTopic extends string,
  TWSParams extends object = any,
> {
  method: WsOperation;
  params?: (TWSTopic | string | number)[] | TWSParams;
  id: string;
}
