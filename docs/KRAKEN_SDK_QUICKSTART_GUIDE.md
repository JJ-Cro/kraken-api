# Kraken API JavaScript Tutorial for Node.js and TypeScript

Build Kraken integrations in JavaScript or TypeScript without hand-rolling raw HTTP requests, Kraken JWTs/request signing for authenticated APIs, WebSocket authentication, heartbeats, reconnects, or exchange-specific payload handling.

This Kraken JavaScript tutorial uses [`@siebly/kraken-api`](https://www.npmjs.com/package/@siebly/kraken-api), the [Kraken JavaScript SDK by Siebly.io](https://siebly.io/sdk/kraken/javascript), to walk through the API surfaces most developers need:

- Kraken Spot REST API
- Kraken Futures REST API
- Public and private Kraken WebSockets
- Spot trading over Kraken's event-driven WebSocket API
- Automatic handling for Kraken JWTs, request signing, and private-channel authentication

Key Links

- Kraken JavaScript & Node.js SDK by Siebly: [`@siebly/kraken-api`](https://www.npmjs.com/package/@siebly/kraken-api)
- GitHub Repository: [`sieblyio/kraken-api`](https://github.com/sieblyio/kraken-api)
- SDK function-endpoint map: [Kraken JavaScript Endpoint Reference](https://siebly.io/sdk/kraken/javascript#endpoint-reference)
- More SDKs: [Siebly.io](https://siebly.io)

Topics covered in this guide

- Why use a Kraken SDK
- Install and API keys
- Start building quickstart
- Spot REST APIs
- Spot WebSockets
- Spot trading over WebSocket API
- Futures REST APIs
- Futures WebSockets
- Production notes
- FAQ and next steps

---

## Why use a Kraken SDK

A stable Kraken API integration is not just "make a few HTTP requests". There's more to it than that.

- Spot REST and Futures REST APIs use different authentication models and request shapes.
- Public & private WebSockets require connection lifecycle handling, authentication, and reconnection handling.
- Spot trading over Kraken's asynchronous WebSocket API can be complicated without JavaScript Promises to glue WebSocket API responses to the requests that triggered them.
- Production bots and trading tools need typed request schemas, consistent async behavior, resilient WebSockets, and a connectivity architecture that works.

The `@siebly/kraken-api` gives you one JavaScript and TypeScript SDK for Kraken API integration in any Node.js or JavaScript-capable environment:

- Complete API coverage with dedicated REST API clients for each product group, including Spot and Derivatives.
- One `WebsocketClient` for public and private streaming across all Kraken products.
- A `WebsocketAPIClient` for Spot trading over a persistent WebSocket connection, with the convenience of awaitable promise-wrapped WebSocket API requests. Each WebSocket API command can be awaited like a REST API request.
- Automatic heartbeats, reconnect and resubscribe handling for WebSockets. Stay connected, stay in sync.
- TypeScript-first request and response definitions for most SDK methods.
- ESM and CJS support.
- Browser-friendly HMAC signing and proxy support.

The package also includes `InstitutionalClient` and `PartnerClient`, but this guide focuses on the flows most developers look for first: Spot, Futures, market data, account data, and order management.

---

## What you can build with the [Kraken JavaScript SDK](https://siebly.io/sdk/kraken/javascript)

This Kraken JavaScript SDK is relevant for any integration with Kraken's APIs and WebSockets, especially if you are building:

- Trading bots and execution services
- Real-time market data dashboards
- Internal trader tooling
- Portfolio and balance monitors
- Alerting and signal pipelines
- Reconciliation or account state services
- AI-assisted engineering workflows that need a reliable & typed Kraken integration layer

---

## Who this guide is for

This guide is written for JavaScript developers (& LLMs) who:

- Want to build with the Kraken API offering
- Want a quick, easy, predictable, up-to-date and heavily used (reliable) way to integrate with Kraken's APIs & WebSockets
- Care about typed requests and responses
- Are working with exchange REST APIs & WebSockets for the first time
- Are already using exchange APIs elsewhere and are looking to integrate Kraken
- Need dependable connectivity for systematic trading
- Are comparing raw Kraken integration against a maintained SDK

---

## What this one-page course covers

- Installing the Kraken JavaScript SDK by Siebly
- Creating Spot and Futures REST API clients
- Making your first public Spot REST API request
- Streaming public Spot market data over WebSockets
- Subscribing to private Spot account streams
- Placing Spot orders over Kraken's REST API
- Managing Spot orders in batches
- Trading Spot over Kraken's WebSocket API
- Pulling Kraken Futures market data
- Submitting Kraken Futures orders via REST API
- Using Kraken Futures WebSockets
- Production patterns for reconnects, idempotency, logging, and safer rollout

---

## How to get started with the Kraken API in JavaScript?

If you don't have Node.js installed yet, refer to the Node.js documentation on getting started with Node.js. The Kraken JavaScript SDK is published to both [GitHub](https://github.com/sieblyio/kraken-api) and [npm](https://www.npmjs.com/package/@siebly/kraken-api).

Install the SDK with npm:

```bash
npm install @siebly/kraken-api
```

Or, if preferred, use your favourite npm-compatible package manager:

```bash
# or pnpm:
pnpm install @siebly/kraken-api
# or yarn:
yarn add @siebly/kraken-api
```

Create API keys where Kraken documents them:

- Spot: [Kraken Spot API key instructions](https://support.kraken.com/articles/360000919966-how-to-create-an-api-key)
- Futures: [Kraken Futures API key instructions](https://pro.kraken.com/app/settings/api)

> Use the minimum permissions needed for your scenario. Trading does not require withdrawal permissions. Analytics does not require trading permissions.

Important auth difference:

- Spot & futures have different API keys.
- Make sure the API keys you have created are for the correct product group.
- API keys for Spot will only work for Spot APIs.
- API keys for Futures will only work for Futures APIs.
- Most market data does not require API keys.

Typical environment variables:

```bash
export API_SPOT_KEY='your-spot-api-key'
export API_SPOT_SECRET='your-spot-api-secret'

export API_FUTURES_KEY='your-futures-api-key'
export API_FUTURES_SECRET='your-futures-api-secret'
```

For local Node.js examples that use a `.env` file, make `.env` loading automatic before reading `process.env`. Prefer Node.js built-in `--env-file` or `--env-file-if-exists` in package scripts when supported; otherwise use `process.loadEnvFile`, `dotenv/config`, or the repo's existing loader. Real process environment variables should override `.env`.

If you are only testing public endpoints, you do not need any keys at all.

---

## Start building: first Kraken API calls in JavaScript

If you only want the fastest path to a working integration, this is the section to start from.

### 1. First Spot REST API request

```typescript
import { SpotClient } from '@siebly/kraken-api';

const client = new SpotClient();

async function main() {
  const serverTime = await client.getServerTime();
  const systemStatus = await client.getSystemStatus();
  const ticker = await client.getTicker({ pair: 'XBTUSD' });
  const orderBook = await client.getOrderBook({ pair: 'XBTUSD', count: 10 });

  console.log({
    serverTime,
    systemStatus,
    ticker,
    orderBook,
  });
}

// Since each of the above API calls is wrapped in an awaited promise, a high level catch will detect any exceptions:
main().catch(console.error);
```

This is the quickest way to verify that your Kraken API JavaScript integration is wired correctly for public REST API calls.

See also: [Kraken JavaScript Example - How to query spot market data](https://siebly.io/examples/Kraken/Spot/Public/marketData)

### 2. First public Spot WebSocket stream

```typescript
import { WebsocketClient, WS_KEY_MAP } from '@siebly/kraken-api';

const ws = new WebsocketClient();

ws.on('open', (data) => console.log('connected', data?.wsKey));
ws.on('response', (data) => console.log('response', JSON.stringify(data)));
ws.on('message', (data) => console.log('message', JSON.stringify(data)));
ws.on('reconnected', (data) => console.log('reconnected', data?.wsKey));
ws.on('exception', console.error);

ws.subscribe(
  {
    topic: 'ticker',
    payload: {
      symbol: ['BTC/USD', 'ETH/USD'],
    },
  },
  WS_KEY_MAP.spotPublicV2,
);
```

This gets a public Kraken Spot WebSocket stream running in JavaScript.

See also: [Kraken JavaScript Example - How to subscribe to spot market data WebSocket stream](https://siebly.io/examples/Kraken/Spot/WebSockets/publicWs)

### 3. First private Spot WebSocket stream

```typescript
import { WebsocketClient, WS_KEY_MAP } from '@siebly/kraken-api';

const ws = new WebsocketClient({
  apiKey: process.env.API_SPOT_KEY!,
  apiSecret: process.env.API_SPOT_SECRET!,
});

ws.on('authenticated', (data) => console.log('authenticated', data?.wsKey));
ws.on('response', (data) => console.log('response', JSON.stringify(data)));
ws.on('message', (data) => console.log('message', JSON.stringify(data)));
ws.on('reconnected', (data) => console.log('reconnected', data?.wsKey));
ws.on('exception', console.error);

ws.subscribe(
  {
    topic: 'executions',
    payload: {
      snap_trades: true,
      snap_orders: true,
      order_status: true,
    },
  },
  WS_KEY_MAP.spotPrivateV2,
);

ws.subscribe(
  {
    topic: 'balances',
    payload: {},
  },
  WS_KEY_MAP.spotPrivateV2,
);
```

For private Spot v2 topics, the SDK can fetch and refresh the token for you. You do not need to manually fetch a token and inject it into every subscribe payload.

See also: [Kraken JavaScript Example - How to subscribe to spot account change WebSocket events](https://siebly.io/examples/Kraken/Spot/WebSockets/privateWs)

### 4. First Spot order over REST API

```typescript
import { SpotClient } from '@siebly/kraken-api';

const client = new SpotClient({
  apiKey: process.env.API_SPOT_KEY!,
  apiSecret: process.env.API_SPOT_SECRET!,
});

async function placeOrder() {
  const result = await client.submitOrder({
    ordertype: 'limit',
    type: 'buy',
    pair: 'XBTUSD',
    volume: '0.0001',
    price: '10000',
    validate: true,
    cl_ord_id: client.generateNewOrderID(),
  });

  console.log(result);
}

placeOrder().catch(console.error);
```

Use `validate: true` when you want to validate the request shape without sending the live order. Remove `validate: true` when you are ready to submit.

See also: [Kraken JavaScript Example - How to submit spot orders](https://siebly.io/examples/Kraken/Spot/Private/submitOrder)

### 5. First Futures order

```typescript
import { DerivativesClient } from '@siebly/kraken-api';

const client = new DerivativesClient({
  apiKey: process.env.API_FUTURES_KEY!,
  apiSecret: process.env.API_FUTURES_SECRET!,
  // testnet: true, // optional: route Derivatives REST calls to Kraken's demo environment
});

async function placeFuturesOrder() {
  const result = await client.submitOrder({
    orderType: 'lmt',
    symbol: 'PF_ETHUSD',
    side: 'buy',
    size: 0.01,
    limitPrice: 1000,
    cliOrdId: client.generateNewOrderID(),
  });

  console.log(result);
}

placeFuturesOrder().catch(console.error);
```

See also: [Kraken JavaScript Example - How to submit futures/derivatives orders](https://siebly.io/examples/Kraken/Derivatives/Private/submitOrder)

---

## Kraken Spot REST API in JavaScript and TypeScript

Most integrations start with Spot REST APIs because it is one of the simplest ways to test basic connectivity, such as querying account state and submitting orders.

### Create a public Spot client

```typescript
import { SpotClient } from '@siebly/kraken-api';

const client = new SpotClient();
```

Public calls do not require keys.

### Create a private Spot client

If you plan on making private API calls, include API keys when creating an instance of the SpotClient class:

```typescript
import { SpotClient } from '@siebly/kraken-api';

const client = new SpotClient({
  apiKey: process.env.API_SPOT_KEY!,
  apiSecret: process.env.API_SPOT_SECRET!,
});
```

### Common public Spot market data calls

```typescript
const serverTime = await client.getServerTime();
const systemStatus = await client.getSystemStatus();
const assetInfo = await client.getAssetInfo({ asset: 'XBT,ETH' });
const assetPairs = await client.getAssetPairs({ pair: 'XBTUSD,ETHUSD' });
const ticker = await client.getTicker({ pair: 'XBTUSD' });
const orderBook = await client.getOrderBook({ pair: 'XBTUSD', count: 10 });
const candles = await client.getCandles({ pair: 'XBTUSD', interval: 60 });
const recentTrades = await client.getRecentTrades({
  pair: 'XBTUSD',
  count: 10,
});
const recentSpreads = await client.getRecentSpreads({ pair: 'XBTUSD' });
```

### Common private Spot account calls

```typescript
const balance = await client.getAccountBalance();
const tradeBalance = await client.getTradeBalance();
const openOrders = await client.getOpenOrders();
const openOrdersWithTrades = await client.getOpenOrders({ trades: true });
const closedOrders = await client.getClosedOrders({
  trades: true,
  start: Math.floor(Date.now() / 1000) - 86400 * 7, // last 7 days
});
```

See also:

- [Kraken JavaScript Example - How to query spot market data](https://siebly.io/examples/Kraken/Spot/Public/marketData)
- [Kraken JavaScript Example - How to query Kraken spot account balances, orders & transactions](https://siebly.io/examples/Kraken/Spot/Private/account)
- [Kraken JavaScript Example - How to query, manage, amend & cancel spot orders](https://siebly.io/examples/Kraken/Spot/Private/orderManagement)

### Spot order examples

Market order:

```typescript
await client.submitOrder({
  ordertype: 'market',
  type: 'buy',
  volume: '0.01',
  pair: 'XBTUSD',
});
```

Limit order:

```typescript
await client.submitOrder({
  ordertype: 'limit',
  type: 'buy',
  volume: '0.0001',
  pair: 'XBTUSD',
  price: '10000',
});
```

Post-only limit order:

```typescript
await client.submitOrder({
  ordertype: 'limit',
  type: 'buy',
  volume: '0.001',
  pair: 'XBTEUR',
  price: '1000.00',
  oflags: 'post',
  timeinforce: 'GTC',
});
```

### Spot batch order management

If you want to stage multiple orders on one pair, batch APIs are a better fit than serially sending single orders.

```typescript
await client.submitBatchOrders({
  pair: 'XBTUSD',
  orders: [
    {
      ordertype: 'limit',
      type: 'buy',
      volume: '0.0001',
      price: '10000.00',
      timeinforce: 'GTC',
      // cl_ord_id: client.generateNewOrderID(), // optional: include a custom order ID before placing your order, for easier tracking
    },
    {
      ordertype: 'limit',
      type: 'sell',
      volume: '0.0001',
      price: '13000.00',
      timeinforce: 'GTC',
      // cl_ord_id: client.generateNewOrderID(), // optional: include a custom order ID before placing your order, for easier tracking
    },
  ],
});
```

Validate the batch without sending:

```typescript
await client.submitBatchOrders({
  pair: 'XBTUSD',
  validate: true,
  orders: [
    {
      ordertype: 'limit',
      type: 'buy',
      volume: '0.0001',
      price: '45000.00',
    },
    {
      ordertype: 'limit',
      type: 'sell',
      volume: '0.0001',
      price: '55000.00',
    },
  ],
});
```

See also: [Kraken JavaScript Example - How to submit spot orders via REST API](https://siebly.io/examples/Kraken/Spot/Private/submitOrder)

---

## Kraken WebSockets in JavaScript: public and private streaming

For long-running processes, WebSockets are key for staying in sync with market data & account state changes. Latency-sensitive systems should subscribe & react to event-driven market & account updates, rather than depending on REST API polling at regular intervals.

> After subscribing to the topics needed by your system, persistent WebSocket connections will provide real-time updates on any changes to your subscribed topics. Stay informed on new market data as it becomes available. Immediately process and react to any account state changes, such as an order state change or fill. Integrating an event-driven design pattern with WebSockets will both reduce your latency and provide much higher capacity for making API calls within the available rate limits.

The Siebly Kraken JavaScript SDK's WebsocketClient handles most of the complexity of working with WebSockets for you. All you need to do is:

- Create an instance of the WebsocketClient.
- Provide read-only API keys, if private topics are required. Market data does not require API keys.
- Ask the WebsocketClient to subscribe to the topics you're interested in.

The SDK handles the connection work for you:

- Open WebSocket connections to the correct domains & endpoints.
- Use your provided proxy, if desired & configured.
- Prepare & dispatch events to authenticate, if needed.
- Prepare & dispatch events to subscribe to the topics you have requested.
- Monitor active WebSocket connections with regular heartbeats. As soon as a potential disconnect is detected (heartbeat timeout), the SDK will automatically:
  - Emit a `reconnecting` event, informing you this process has started.
    - This is a good time to pause any risky commands until the connection is restored (order management).
  - Teardown the stale connection.
  - Open a new WebSocket connection.
    - Re-authenticate if needed.
    - Re-subscribe to the topics you were subscribed to.
  - Emit a `reconnected` event, informing you this process has completed.
    - This is a good time to query the REST API for any changes you might have missed while disconnected.

### `WebsocketClient` events you will actually care about

| Event           | Meaning                                           |
| --------------- | ------------------------------------------------- |
| `open`          | Connection established                            |
| `message`       | Streaming data received                           |
| `response`      | Subscribe, unsubscribe, and auth acknowledgements |
| `reconnecting`  | Connection dropped and retrying                   |
| `reconnected`   | Connection restored and subscriptions resynced    |
| `close`         | Socket closed                                     |
| `authenticated` | Private auth succeeded                            |
| `exception`     | Errors and unexpected conditions                  |

### Understanding `WS_KEY_MAP`

[`WS_KEY_MAP`](/reference/glossary#ws-key) tells the SDK which Kraken WebSocket endpoint family to use:

- `spotPublicV2`
- `spotPrivateV2`
- `spotL3V2`
- `derivativesPublicV1`
- `derivativesPrivateV1`

> This matters because different product groups and topic families do not all live on the same connection endpoint. These keys act as primary keys, similar to a database, to uniquely identify a dedicated connection group.

### Public Spot WebSocket topics

```typescript
ws.subscribe(
  {
    topic: 'ticker',
    payload: { symbol: ['BTC/USD', 'ETH/USD'] },
  },
  WS_KEY_MAP.spotPublicV2,
);

ws.subscribe(
  {
    topic: 'trade',
    payload: { symbol: ['BTC/USD'] },
  },
  WS_KEY_MAP.spotPublicV2,
);

ws.subscribe(
  {
    topic: 'ohlc',
    payload: {
      symbol: ['BTC/USD'],
      interval: 1,
    },
  },
  WS_KEY_MAP.spotPublicV2,
);
```

You can also batch multiple subscriptions that share the same `WsKey`, by sending an array of WebSocket topics:

```typescript
ws.subscribe(
  [
    { topic: 'ticker', payload: { symbol: ['BTC/USD'] } },
    { topic: 'trade', payload: { symbol: ['BTC/USD'] } },
    {
      topic: 'instrument',
      payload: {
        symbol: ['BTC/USD'],
        include_tokenized_assets: true,
      },
    },
  ],
  WS_KEY_MAP.spotPublicV2,
);
```

### Private Spot WebSocket topics

The SDK can authenticate and manage private Spot streams for you:

```typescript
import { WebsocketClient, WS_KEY_MAP } from '@siebly/kraken-api';

const ws = new WebsocketClient({
  apiKey: process.env.API_SPOT_KEY!,
  apiSecret: process.env.API_SPOT_SECRET!,
});

ws.subscribe(
  {
    topic: 'executions',
    payload: {
      snap_trades: true,
      snap_orders: true,
      order_status: true,
      ratecounter: true,
    },
  },
  WS_KEY_MAP.spotPrivateV2,
);

ws.subscribe(
  {
    topic: 'balances',
    payload: {},
  },
  WS_KEY_MAP.spotPrivateV2,
);

ws.subscribe(
  {
    topic: 'level3',
    payload: {
      symbol: ['BTC/USD'],
    },
  },
  WS_KEY_MAP.spotL3V2,
);
```

The Level 3 order book is a special case. It uses the dedicated L3 endpoint, so `spotL3V2` matters.

See also:

- [Kraken JavaScript Example - How to subscribe to & consume spot market data events](https://siebly.io/examples/Kraken/Spot/WebSockets/publicWs)
- [Kraken JavaScript Example - How to subscribe to & consume private spot account events](https://siebly.io/examples/Kraken/Spot/WebSockets/privateWs)

---

## Spot trading over Kraken's WebSocket API with `WebsocketAPIClient`

Kraken supports Spot trading over a persistent WebSocket connection. While each REST API call requires a new connection to be opened & signed per API call, the WebSocket API allows a persistent WebSocket connection to be opened & authenticated once, and then reused for any WS-API commands sent by your system. This can significantly reduce latency for latency-sensitive and higher-frequency trading systems compared with using the REST API alone.

If that model fits your system, `WebsocketAPIClient` gives you REST-like methods over the WebSocket API.

> This utility class is wrapped around the Siebly Kraken JavaScript SDK's WebsocketClient. A persistent WebSocket API connection is automatically opened and managed as needed. Any API calls made via the WebsocketAPIClient are conveniently wrapped in JavaScript promises. This allows for much simpler asynchronous design patterns that feel very much like a REST API, with all the benefits of a persistent WebSocket API connection.

Make a WebSocket API request via a simple function call. Await the result. All of the speed with significantly less complexity.

```typescript
import { WebsocketAPIClient } from '@siebly/kraken-api';

const wsApi = new WebsocketAPIClient({
  apiKey: process.env.API_SPOT_KEY!,
  apiSecret: process.env.API_SPOT_SECRET!,
});

wsApi.getWSClient().on('open', (data) => {
  console.log('ws api open', data?.wsKey);
});

wsApi.getWSClient().on('exception', console.error);

const order = await wsApi.submitSpotOrder({
  order_type: 'limit',
  side: 'buy',
  limit_price: 26500.4,
  order_qty: 1.2,
  symbol: 'BTC/USD',
});

await wsApi.amendSpotOrder({
  order_id: 'TEST-ORDER-ID',
  order_qty: 1.5,
  limit_price: 27000,
});

await wsApi.cancelSpotOrder({
  order_id: ['TEST-ORDER-ID'],
});

await wsApi.cancelAllSpotOrders();
```

Other supported Spot WebSocket API flows include:

- conditional Spot orders
- trigger-style orders
- batch Spot order submission
- batch Spot order cancellation
- cancel-all-after timeout handling

See also: [Kraken JavaScript Example - How to send/manage low-latency spot orders via the WebSocket API](https://siebly.io/examples/Kraken/Spot/WebSockets/wsAPI#L64)

Refer to the Kraken API documentation for a detailed list of available WebSocket API capabilities.

---

## Kraken Futures API in Node.js and TypeScript

While it looks & feels similar, Kraken's Derivatives use a different REST API surface and different request naming conventions than the Kraken Spot APIs. The [`@siebly/kraken-api` JavaScript Kraken SDK](https://www.npmjs.com/package/@siebly/kraken-api) manages this complexity for you, so you can focus on building & integrating your workflows.

Usage is similar to Spot. Create an instance of the utility class dedicated to the Kraken Derivatives API, the DerivativesClient. Provide your API keys if private API calls are desired. Call & await functions corresponding to the REST API endpoint you would like to use.

Detailed request building, routing & authentication are all handled under the hood by the SDK. Below are curated examples for common scenarios.

### Create a public Futures client

```typescript
import { DerivativesClient } from '@siebly/kraken-api';

const client = new DerivativesClient();
```

### Create a private Futures client

```typescript
import { DerivativesClient } from '@siebly/kraken-api';

const client = new DerivativesClient({
  apiKey: process.env.API_FUTURES_KEY!,
  apiSecret: process.env.API_FUTURES_SECRET!,
  // testnet: true, // optional: route Derivatives REST API calls to Kraken's demo environment
});
```

### Common public Futures market data calls

```typescript
const allTickers = await client.getTickers();
const ticker = await client.getTicker({ symbol: 'PF_ETHUSD' });
const orderBook = await client.getOrderbook({ symbol: 'PF_ETHUSD' });
const instruments = await client.getInstruments();
const feeSchedules = await client.getFeeSchedules();
const candles = await client.getCandles({
  tickType: 'trade',
  symbol: 'PF_ETHUSD',
  resolution: '1h',
});
```

You can also query recent public trade-style events:

```typescript
const executions = await client.getPublicExecutionEvents({
  tradeable: 'PF_ETHUSD',
});
```

See also: [Kraken JavaScript Example - How to query derivatives market data](https://siebly.io/examples/Kraken/Derivatives/Public/marketData)

### Futures order examples

Limit order:

```typescript
await client.submitOrder({
  orderType: 'lmt',
  symbol: 'PF_ETHUSD',
  side: 'buy',
  size: 0.01,
  limitPrice: 1000,
  cliOrdId: client.generateNewOrderID(),
});
```

Market order:

```typescript
await client.submitOrder({
  orderType: 'mkt',
  symbol: 'PF_ETHUSD',
  side: 'sell',
  size: 0.01,
});
```

Post-only and reduce-only:

```typescript
await client.submitOrder({
  orderType: 'post',
  symbol: 'PF_ETHUSD',
  side: 'buy',
  size: 0.01,
  limitPrice: 1000,
  cliOrdId: client.generateNewOrderID(),
});

await client.submitOrder({
  orderType: 'lmt',
  symbol: 'PF_ETHUSD',
  side: 'sell',
  size: 1,
  limitPrice: 1000,
  reduceOnly: true,
});
```

Batch order management:

```typescript
await client.batchOrderManagement({
  json: {
    batchOrder: [
      {
        order: 'send',
        order_tag: 'order-1',
        orderType: 'lmt',
        symbol: 'PF_ETHUSD',
        side: 'buy',
        size: 0.01,
        limitPrice: 1000,
        cliOrdId: client.generateNewOrderID(),
      },
    ],
  },
});
```

See also: [Kraken JavaScript Example - How to submit derivatives/futures orders](https://siebly.io/examples/Kraken/Derivatives/Private/submitOrder)

---

## Kraken Futures WebSockets in JavaScript

For subscribing to futures/derivatives market & account data in JavaScript (& Node.js), the SDK automatically handles this as well via the same `WebsocketClient` utility class.

```typescript
import { WebsocketClient, WS_KEY_MAP } from '@siebly/kraken-api';

const ws = new WebsocketClient();

ws.on('open', (data) => console.log('connected', data?.wsKey));
ws.on('message', (data) => console.log('message', JSON.stringify(data)));
ws.on('reconnected', (data) => console.log('reconnected', data?.wsKey));
ws.on('exception', console.error);

ws.subscribe(
  {
    topic: 'trade',
    payload: {
      product_ids: ['PI_XBTUSD', 'PI_ETHUSD'],
    },
  },
  WS_KEY_MAP.derivativesPublicV1,
);
```

See also:

- [Kraken JavaScript Example - How to subscribe to derivatives/futures account change WebSocket events](https://siebly.io/examples/Kraken/Derivatives/WebSockets/privateWs)
- [Kraken JavaScript Example - How to subscribe to derivatives/futures market data WebSocket events](https://siebly.io/examples/Kraken/Derivatives/WebSockets/publicWs)

---

## Production notes for real trading systems

This is where SDKs usually earn their keep.

### 1. Use client-generated order IDs

For Spot, use `cl_ord_id`. For Futures, use `cliOrdId`. This makes retries and reconciliation safer.

```typescript
const orderIdForEntry1 = client.generateNewOrderID();

const result = await client.submitOrder({
  ordertype: 'limit',
  type: 'buy',
  pair: 'XBTUSD',
  volume: '0.0001',
  price: '10000',
  validate: true,
  cl_ord_id: orderIdForEntry1,
});

console.log(result);

// Detect entry 1 has filled, by looking for an order fill with cl_ord_id === orderIdForEntry1 either via REST API or async WebSocket updates.
```

### 2. Treat reconnects as a normal condition

Listen for `reconnecting` and `reconnected`. A dropped connection is not the exceptional case in production. Recovery behavior is part of the design. WebSockets can be unstable, especially during volatility.

The important part is detecting issues early (handled by SDK), promptly reconnecting (handled by SDK), and ensuring your system remains in sync when the SDK emits a `reconnected` event (up to your implementation).

### 3. Start public, then validate private, then trade tiny

The lowest-friction rollout path is:

1. Public REST APIs
2. Public WebSockets
3. Private account streams
4. Small live trading tests

If using WebSockets for updates, integrate a backfill workflow after connecting:

1. Connect and subscribe to WebSocket topics, but pause processing incoming data (drop data as it arrives)
2. Backfill any missing data via REST API (hydrate internal state).
3. Once backfill is complete, enable processing incoming data.

This ensures your system has the full history it needs before it starts processing new market & account updates.

### 4. Keep Spot and Futures credentials separate

Do not blur product boundaries in your code or secrets management. Spot and Futures use different credentials and different request models.

### 5. Watch symbol conventions carefully

Spot & Futures do not use the same symbol formatting. Treat symbols as product-specific inputs, not one universal string format. If needed, build your own solution to normalise outgoing & incoming symbols into a format your system can consistently work with.

### 6. Protect your API keys

- Treat your API keys like passwords. Keep them safe. Do not share them.
- Rotate API keys regularly.
- Use the minimum permissions on your API keys based on your needs. Active trading does not require withdrawal permissions. Analytics does not require trading permissions.
- Use IP whitelists to prevent API keys from being used outside your environment.

### 7. Inject your own logger if needed

If you want to integrate SDK logs into your own monitoring stack:

```typescript
import { WebsocketClient, DefaultLogger, LogParams } from '@siebly/kraken-api';

const customLogger: DefaultLogger = {
  trace: (..._params: LogParams) => {},
  info: (...params: LogParams) => console.log(...params),
  error: (...params: LogParams) => console.error(...params),
};

const ws = new WebsocketClient({}, customLogger);
```

See also: [Kraken JavaScript Example - How to subscribe to spot market data with WebSockets](https://siebly.io/examples/Kraken/Spot/WebSockets/publicWs)

---

## Why use a JavaScript SDK for Kraken's APIs & WebSockets?

If you are evaluating SDKs rather than just copying a few snippets, these are the practical reasons this SDK tends to matter:

- One Kraken JavaScript SDK for Spot REST APIs, Futures REST APIs, and WebSockets.
- Cleaner onboarding for Node.js and JavaScript developers.
- One snippet now can become hundreds of fragile snippets.
- Less low-value exchange plumbing in your codebase. Less to maintain, less that can break, fewer distractions.
- Stable connectivity with automated integration tests & thousands of daily users.
- Faster integration than building raw API connectivity with correctly crafted request signatures.
- Faster iteration when moving from public data to private trading flows.
- Better fit for bots, dashboards, and internal trading tools than raw request signing examples.
- A maintained SDK with examples, endpoint references, and a wider SDK ecosystem from [Siebly.io](https://siebly.io)

---

## FAQ

**Do I need separate keys for Spot and Futures?**
Yes. Treat Spot and Futures as separate products with separate API credentials. These can be managed within your Kraken account.

**Why both `WebsocketClient` and `WebsocketAPIClient`?**

- `WebsocketClient` is for subscriptions and streaming topics.
- `WebsocketAPIClient` is for Spot trading commands over Kraken's WebSocket API. Think "REST API" but via low-latency WebSockets.

**Does the SDK handle private authentication?**
Yes. All authentication for both REST APIs & WebSockets will be handled automatically using the underlying SDK architecture. Connectivity & authentication are both managed for you, so you can focus on integrating your system and making the API calls that you need.

**What happens if the connection drops?**
The SDK supports reconnect and resubscribe flows. Listen for `reconnecting` and `reconnected`.

The `reconnecting` event is a good trigger to pause any risky actions until the connection is restored & ready (cancel orders and prevent new orders).

The `reconnected` event is a good trigger to query the REST API for any out-of-sync account & market state before resuming normal trading activity (restore cancelled orders, resume order placement as desired).

**Can I use this Kraken API SDK in TypeScript projects?**
Yes. The package is TypeScript-first and publishes type declarations.

**Do I need TypeScript to use this JavaScript Kraken SDK?**
Pure JavaScript projects (including Node.js & Bun) can use this SDK too. TypeScript type declarations are included (and will help while working with the SDK in your IDE), but TypeScript is not required to use this [JavaScript SDK for Kraken](https://siebly.io/sdk/kraken/javascript).

**Can I use this package in both ESM and CommonJS projects?**
Yes. The package supports both. It is built & published to npm as a hybrid project. Your project will automatically import the correct bundle, due to the configuration in the SDK's package.json.

**Does this guide cover every SDK method?**
Yes, complete API coverage is expected across all available product groups in Kraken's API offering, both for REST APIs & WebSockets. We regularly monitor the API for changes & regularly keep the [Siebly JavaScript SDK for Kraken](https://siebly.io/sdk/kraken/javascript) up to date. If any functionality happens to be missing or out of date, please get in touch by [opening an issue on GitHub](https://github.com/sieblyio/kraken-api/issues).

For full method coverage, see:

- [List of all available Kraken APIs and the JavaScript method to call them](https://siebly.io/sdk/kraken/javascript#endpoint-reference)
- [Siebly SDK examples index](https://siebly.io/examples)

---

## Next steps

If you want to learn more about integrating with Kraken's APIs & WebSockets:

- Explore the [Kraken JavaScript examples on GitHub](https://github.com/sieblyio/kraken-api/tree/main/examples)
- Review the full endpoint list: [Kraken JavaScript endpoint reference](https://siebly.io/sdk/kraken/javascript#endpoint-reference)
- Check the Siebly JavaScript SDK for Kraken on npm: [`@siebly/kraken-api`](https://www.npmjs.com/package/@siebly/kraken-api)
- Browse the source code of the Siebly JavaScript SDK for Kraken on GitHub: [`sieblyio/kraken-api`](https://github.com/sieblyio/kraken-api)
- Explore the wider SDK ecosystem: [Siebly.io](https://siebly.io)
