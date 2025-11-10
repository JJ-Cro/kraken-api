import WebSocket from 'isomorphic-ws';

import { WSTopic } from '../../types/websockets/ws-subscriptions.js';

/** Should be one WS key per unique URL */
export const WS_KEY_MAP = {
  /** Public WebSocket topics for Spot, via the V2 API: https://docs.kraken.com/api/docs/guides/spot-ws-intro */
  spotPublicV2: 'spotPublicV2',
  spotPrivateV2: 'spotPrivateV2',
  spotBetaPublicV2: 'spotBetaPublicV2',
  spotBetaPrivateV2: 'spotBetaPrivateV2',
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
  method: WsOperation;
  params:
    | {
        channel: (TWSTopic | string | number)[];
        symbol?: string[];
        event_trigger?: string;
        snapshot?: boolean;
      }
    | TWSParams;
  req_id: number;
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
