// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  DefaultLogger,
  LogParams,
  WebsocketClient,
  WS_KEY_MAP,
  WsTopicRequest,
} from '../src/index.js';
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
  const client = new WebsocketClient({}, customLogger);

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
    // Spot ticker level 1: https://docs.kraken.com/api/docs/websocket-v2/ticker
    // const tickersRequestWithParams: WsTopicRequest = {
    //   topic: 'ticker',
    //   payload: {
    //     symbol: ['ALGO/USD', 'BTC/USD'],
    //     // below params are optional:
    //     // event_trigger: 'bbo', // bbo: on a change in the best-bid-offer price levels.
    //     // event_trigger: 'trades', // trades: on every trade.
    //     // snapshot: true, // default: true
    //   },
    // };

    // client.subscribe(tickersRequestWithParams, WS_KEY_MAP.spotPublicV2);

    // Book level 2: https://docs.kraken.com/api/docs/websocket-v2/book
    // const bookRequestWithParams: WsTopicRequest = {
    //   topic: 'book',
    //   payload: {
    //     symbol: ['BTC/USD', 'BTC/GBP'],
    //     // below params are optional:
    //     // depth: 10, // default: 10, Possible values: [10, 25, 100, 500, 1000]
    //     // snapshot: true, // default: true
    //   },
    // };

    // client.subscribe(bookRequestWithParams, WS_KEY_MAP.spotPublicV2);

    // Candles (OHLC): https://docs.kraken.com/api/docs/websocket-v2/ohlc
    // const candleOhlcRequestWithParams: WsTopicRequest = {
    //   topic: 'ohlc',
    //   payload: {
    //     symbol: ['BTC/USD', 'BTC/GBP'],
    //     interval: 1, // Possible values: [1, 5, 15, 30, 60, 240, 1440, 10080, 21600]

    //     // below params are optional:
    //     // snapshot: true, // default: true
    //   },
    // };

    // client.subscribe(candleOhlcRequestWithParams, WS_KEY_MAP.spotPublicV2);

    // Trades: https://docs.kraken.com/api/docs/websocket-v2/trade
    // const tradesRequestWithParams: WsTopicRequest = {
    //   topic: 'trade',
    //   payload: {
    //     symbol: ['BTC/USD', 'BTC/GBP'],
    //     // below params are optional:
    //     // snapshot: true, // default: true
    //   },
    // };

    // client.subscribe(tradesRequestWithParams, WS_KEY_MAP.spotPublicV2);

    // Instruments: https://docs.kraken.com/api/docs/websocket-v2/instrument
    const instrumentsRequestWithParams: WsTopicRequest = {
      topic: 'instrument',
      payload: {
        symbol: ['BTC/USD', 'BTC/GBP'],
        // below params are optional:
        // If true, include xStocks in the response, otherwise include crypto spot pairs only:
        include_tokenized_assets: true, // default: false
        // snapshot: true, // default: true
      },
    };

    client.subscribe(instrumentsRequestWithParams, WS_KEY_MAP.spotPublicV2);

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    // const topicWithoutParamsAsString = 'spot.balances';

    // This has the same effect as above, it's just a different way of messaging which topic this is for
    // const topicWithoutParamsAsObject: WsTopicRequest = {
    //   topic: 'spot.balances',
    // };

    /**
     * Either send one topic (with optional params) at a time
     */
    // client.subscribe(tickersRequestWithParams, WS_KEY_MAP.spotPublicV2);

    /**
     * Or send multiple topics in a batch (grouped by ws connection (WsKey))
     */
    // client.subscribe(
    //   [tickersRequestWithParams, rawTradesRequestWithParams],
    //   'spotV4',
    // );

    // /**
    //  * You can also use strings for topics that don't have any parameters, even if you mix multiple requests into one function call:
    //  */
    // client.subscribe(
    //   [tickersRequestWithParams, rawTradesRequestWithParams, topicWithoutParamsAsString],
    //   'spotV4',
    // );
  } catch (e) {
    console.error('Req error: ', e);
  }
}

start();
