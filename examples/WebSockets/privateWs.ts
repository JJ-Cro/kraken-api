// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  DefaultLogger,
  LogParams,
  WebsocketClient,
  WS_KEY_MAP,
  WsTopicRequest,
} from '../../src/index.js';
import { WSSpotTopic } from '../../src/types/websockets/ws-subscriptions.js';
// normally you should install this module via npm: `npm install @siebly/kraken-api` and import the module:
// import { LogParams, WebsocketClient, WsTopicRequest } from '@siebly/kraken-api';

const customLogger: DefaultLogger = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  trace: (...params: LogParams): void => {
    // console.log('trace', ...params);
  },
  info: (...params: LogParams): void => {
    console.log('info', ...params);
  },
  error: (...params: LogParams): void => {
    console.error('error', ...params);
  },
};

async function start() {
  const account = {
    key: process.env.API_KEY || 'keyHere',
    secret: process.env.API_SECRET || 'secretHere',
  };

  const client = new WebsocketClient(
    {
      apiKey: account.key,
      apiSecret: account.secret,
    },
    customLogger,
  );

  // Optional, inject a custom logger
  // const client = new WebsocketClient({}, customLogger);

  client.on('open', (data) => {
    console.log('connected ', data?.wsKey);
  });

  // Data received
  client.on('message', (data) => {
    console.info('data received: ', JSON.stringify(data));
  });

  // Something happened, attempting to reconnect
  client.on('reconnecting', (data) => {
    console.log('reconnect: ', data);
  });

  // Reconnect successful
  client.on('reconnected', (data) => {
    console.log('reconnected: ', data);
  });

  // Connection closed. If unexpected, expect reconnect -> reconnected.
  client.on('close', (data) => {
    console.error('close: ', data);
  });

  // Reply to a request, e.g. "subscribe"/"unsubscribe"/"authenticate"
  client.on('response', (data) => {
    console.info('server reply: ', JSON.stringify(data), '\n');
  });

  client.on('exception', (data) => {
    console.error('exception: ', data);
  });

  client.on('authenticated', (data) => {
    console.error('authenticated: ', data);
  });

  try {
    // Orders Level 3, requires auth: https://docs.kraken.com/api/docs/websocket-v2/level3
    const ordersRequestWithParams: WsTopicRequest<WSSpotTopic> = {
      // topic: 'level3',
      topic: 'level3',
      payload: {
        symbol: ['ALGO/USD', 'BTC/USD'],
        // below params are optional:
        // depth: 10, // default: 10, Possible values: [10, 100, 1000]
        // snapshot: true, // default: true
      },
    };

    client.subscribe(ordersRequestWithParams, WS_KEY_MAP.spotPrivateV2);
  } catch (e) {
    console.error('Req error: ', e);
  }
}

start();
