import WebSocket from 'isomorphic-ws';

import { WSTopic } from '../../types/websockets/ws-subscriptions.js';

/** Should be one WS key per unique URL */
export const WS_KEY_MAP = {
  /**
   * Public WebSocket subscriptions for Kraken Spot products, via the V2 API
   *
   * - Ref: https://docs.kraken.com/api/docs/guides/spot-ws-intro
   * - Channels: https://docs.kraken.com/api/docs/websocket-v2/add_order
   *
   * Note: Use spotPrivateV2 for private channels (requires API keys).
   */
  spotPublicV2: 'spotPublicV2',
  spotPrivateV2: 'spotPrivateV2',
  spotBetaPublicV2: 'spotBetaPublicV2',
  spotBetaPrivateV2: 'spotBetaPrivateV2',
  /**
   * Public WebSocket subscriptions for Kraken Derivatives products, via the V1 API:
   *
   * - Ref: https://docs.kraken.com/api/docs/guides/futures-websockets
   * - Channels: https://docs.kraken.com/api/docs/futures-api/websocket/open_orders
   *
   * Note: While both Public and Private channels use the same WebSocket URL, we will actually maintain separate connections for easier management. Private channels require authentication and the connection is authenticated automatically.
   */
  derivativesPublicV1: 'derivativesPublicV1',
  derivativesPrivateV1: 'derivativesPrivateV1',
} as const;

/** This is used to differentiate between each of the available websocket streams */
export type WsKey = (typeof WS_KEY_MAP)[keyof typeof WS_KEY_MAP];

export type WsOperation = 'subscribe' | 'unsubscribe';

/**
 * Normalised internal format for a request (subscribe/unsubscribe/etc) on a topic, with optional parameters.
 *
 * - Topic: the topic this event is for
 * - Payload: the parameters to include, optional. E.g. auth requires key + sign. Some topics allow configurable parameters.
 */
export interface WsTopicRequest<
  TWSTopic extends WSTopic = WSTopic,
  TWSPayload = any,
> {
  topic: TWSTopic;
  payload?: TWSPayload;
}

/**
 * Conveniently allow users to request a topic either as string topics or objects (containing string topic + params)
 */
export type WsTopicRequestOrStringTopic<
  TWSTopic extends WSTopic,
  TWSPayload = any,
> = WsTopicRequest<TWSTopic, TWSPayload> | string;

export interface WsRequestOperationKraken<
  TWSTopic extends string,
  TWSParams extends object = any,
> {
  // spot
  method?: WsOperation;
  // futures
  event?: WsOperation;
  params:
    | {
        channel: (TWSTopic | string | number)[];
        symbol?: string[];
        event_trigger?: string;
        snapshot?: boolean;
      }
    | TWSParams;
  req_id: number;
  // futures
  feed?: TWSTopic;
  api_key?: string;
  original_challenge?: string;
  signed_challenge?: string;
}

/**
 * #305: ws.terminate() is undefined in browsers.
 * This only works in node.js, not in browsers.
 * Does nothing if `ws` is undefined. Does nothing in browsers.
 */
export function safeTerminateWs(
  ws?: WebSocket | any,
  fallbackToClose?: boolean,
): boolean {
  if (!ws) {
    return false;
  }
  if (typeof ws['terminate'] === 'function') {
    ws.terminate();
    return true;
  } else if (fallbackToClose) {
    ws.close();
  }

  return false;
}
