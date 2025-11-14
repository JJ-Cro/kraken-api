// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  DefaultLogger,
  LogParams,
  WebsocketClient,
  WS_KEY_MAP,
  WsTopicRequest,
} from '../../../src/index.js';
import {
  WSDerivativesTopic,
  WSSpotTopic,
} from '../../../src/types/websockets/ws-subscriptions.js';
// normally you should install this module via npm: `npm install @siebly/kraken-api` and import the module:
// import { LogParams, WebsocketClient, WsTopicRequest } from '@siebly/kraken-api';

const customLogger: DefaultLogger = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  trace: (...params: LogParams): void => {
    console.log(new Date(), '--> trace', ...params);
  },
  info: (...params: LogParams): void => {
    console.log(new Date(), '--> info', ...params);
  },
  error: (...params: LogParams): void => {
    console.error(new Date(), '--> error', ...params);
  },
};

async function start() {
  const account = {
    key: process.env.API_FUTURES_KEY || 'keyHere',
    secret: process.env.API_FUTURES_SECRET || 'secretHere',
  };

  /**
   * The WebsocketClient is the core class to manage WebSocket subscriptions. Give it the topics you want to subscribe to, and it will handle the rest:
   * - Connection management (connect, disconnect, reconnect)
   * - Authentication for private topics
   * - Subscription management (subscribe, unsubscribe, resubscribe on reconnect)
   * - Message handling (dispatch messages to appropriate handlers)
   *
   * All you need to do is provide the topics you want to subscribe to when calling `subscribe()`, and the client will take care of the rest.
   *
   * Here we create a WebsocketClient instance with API key/secret for private topic subscriptions.
   *
   * In terms of product groups such as Spot, Derivatives, etc., the WebsocketClient understand the product group from the WsKey you provide when subscribing. For example, using `WS_KEY_MAP.spotPrivateV2` indicates that the subscription is for Spot private topics, as shown below.
   *
   * Refer to WS_KEY_MAP in the source code for all available WsKey options.
   */
  const client = new WebsocketClient(
    {
      apiKey: account.key,
      apiSecret: account.secret,
    },
    customLogger,
  );

  client.on('open', (data) => {
    console.log(new Date(), 'connected ', data?.wsKey);
  });

  // Data received
  client.on('message', (data) => {
    console.info(new Date(), 'data received: ', JSON.stringify(data));
  });

  // Something happened, attempting to reconnect
  client.on('reconnecting', (data) => {
    console.log(new Date(), 'reconnect: ', data?.wsKey);
  });

  // Reconnect successful
  client.on('reconnected', (data) => {
    console.log(new Date(), 'reconnected: ', data?.wsKey);
  });

  // Connection closed. If unexpected, expect reconnect -> reconnected.
  client.on('close', (data) => {
    console.error(new Date(), 'close: ', data);
  });

  // Reply to a request, e.g. "subscribe"/"unsubscribe"/"authenticate"
  client.on('response', (data) => {
    console.info(new Date(), 'server reply: ', JSON.stringify(data), '\n');
  });

  client.on('exception', (data) => {
    console.error(new Date(), 'exception: ', data);
  });

  client.on('authenticated', (data) => {
    console.error(new Date(), 'authenticated: ', data);
  });

  /**
   * The below examples demonstrate how you can subscribe to private topics.
   *
   * Note: while the documentation specifies "api_key", "original_challenge" and "signed_challenge" as required parameters, but don't worry about that. The SDK will automatically:
   * - Fetch the challenge using your API key,
   * - Cache the challenge
   * - Include the key, original challenge and signed challenge parameters for you when subscribing to private topics on the derivativesPrivateV1 WebSocket connection.
   *
   * So you do NOT need to manually fetch or provide the token when subscribing to private topics.
   *
   * Do note that all of these include the "derivativesPrivateV1" WsKey reference. This tells the WebsocketClient to use the private "wss://futures.kraken.com/ws/v1" endpoint for these private subscription requests. It will also automatically authenticate the connection when it is established.
   */

  try {
    // Balances, requires auth: https://docs.kraken.com/api/docs/websocket-v2/executions
    const executionsRequestWithParams: WsTopicRequest<WSDerivativesTopic> = {
      topic: 'open_orders',
    };
    client.subscribe(
      executionsRequestWithParams,
      WS_KEY_MAP.derivativesPrivateV1,
    );

    // // Balances, requires auth: https://docs.kraken.com/api/docs/websocket-v2/balances
    // const balancesRequestWithParams: WsTopicRequest<WSSpotTopic> = {
    //   topic: 'balances',
    //   payload: {
    //     // below params are optional:
    //     // snapshot: true, // default: true
    //     // TODO: are these correct? because in the docs these are higher level objects...but only for this topic?
    //     // rebased: false, // default: true
    //     // users: 'all',
    //   },
    // };
    // client.subscribe(
    //   balancesRequestWithParams,
    //   WS_KEY_MAP.derivativesPrivateV1,
    // );

    // // Orders Level 3, requires auth: https://docs.kraken.com/api/docs/websocket-v2/level3
    // const ordersRequestWithParams: WsTopicRequest<WSSpotTopic> = {
    //   // topic: 'level3',
    //   topic: 'level3',
    //   payload: {
    //     symbol: ['ALGO/USD', 'BTC/USD'],
    //     // below params are optional:
    //     // depth: 10, // default: 10, Possible values: [10, 100, 1000]
    //     // snapshot: true, // default: true
    //   },
    // };

    // client.subscribe(ordersRequestWithParams, WS_KEY_MAP.derivativesPrivateV1);
  } catch (e) {
    console.error('Req error: ', e);
  }
}

start();
