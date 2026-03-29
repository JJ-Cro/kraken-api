
## What is `@siebly/kraken-api`?

`@siebly/kraken-api` is a **complete JavaScript and Node.js SDK** for Kraken’s REST APIs and WebSockets. It connects your applications to Kraken the same way an advanced terminal connects via API: you get a **typed, production-oriented layer** to stream data and to **structure, execute, and manage orders**—through REST, through WebSocket **subscriptions**, or through Kraken’s **WebSocket API** (Spot trading over a persistent connection)—without rebuilding signing, connection lifecycle, and wire formats from scratch.

---

## Who is `@siebly/kraken-api` for?

### Active traders

Traders who already work with **limit, stop, and structured order types** and want **fine-grained control** in code—how orders are submitted, amended, batched, and cancelled—while staying aligned with Kraken’s API semantics.

### API traders

Developers who use **API-based workflows on other exchanges** and want to **connect and execute on Kraken** from **Node.js or TypeScript**: one ecosystem of clients, consistent patterns for Spot and Derivatives, and a unified WebSocket story across markets.

### Algorithmic and systematic traders

Teams running **rule-based or automated strategies** that need **dependable connectivity**: promise-driven REST, **configurable WebSocket heartbeats**, **automatic reconnect and resubscribe**, and an emitted **`reconnected`** signal when a dropped connection is restored—so bots can recover without manual rewiring.

---

## What you get

A **complete and robust** JavaScript and Node.js SDK for Kraken REST and WebSockets. In practice that means:

- **Battle-tested in real trading** — Professional, robust, and performant; built for extensive production use in live environments.
- **Full API surface** — Complete integration with Kraken REST APIs and WebSockets.
  - **Dedicated REST clients** for **Spot**, **Derivatives (Futures)**, **Institutional**, and **Partner** flows.
  - **One unified `WebsocketClient`** for public and private streams across markets.
- **TypeScript-first** — Declarations for most requests and responses; strongly typed inputs and outputs; **automated end-to-end tests** for reliability.
- **Modern async API** — Actively maintained, **promise-driven** interface.
- **Production-grade WebSockets** — Configurable heartbeats; **automatic reconnect then resubscribe**; event-driven messaging; smart persistence; **`reconnected`** when the socket is back; **public and private** streams supported.
- **Flexible deployment** — **Browser-friendly HMAC** signing; **ESM and CJS**; **proxy support** via axios.
- **Quality and community** — Heavy **E2E testing** against real APIs; discussion on Telegram: [Node.js Algo Traders](https://t.me/nodetraders).

---

## Before you start: install & API keys

```bash
npm install @siebly/kraken-api
```

Create keys where Kraken documents them:

- Spot: [API Key Management](https://www.kraken.com/u/security/api)
- Futures: [Futures API keys](https://futures.kraken.com/settings/api)

Spot private REST expects **API key + private key (base64)**. Futures use **API key + secret** string. Enable only the permissions you need (trading does **not** require withdrawal).

---

## Lesson 1 — Create REST clients

### Spot — public (no keys)

```typescript
import { SpotClient } from '@siebly/kraken-api';

const client = new SpotClient();
```

### Spot — private

```typescript
import { SpotClient } from '@siebly/kraken-api';

const client = new SpotClient({
  apiKey: process.env.API_SPOT_KEY!,
  apiSecret: process.env.API_SPOT_SECRET!, // base64 private key
});
```

### Derivatives (Futures) — public vs private

```typescript
import { DerivativesClient } from '@siebly/kraken-api';

const publicClient = new DerivativesClient();

const client = new DerivativesClient({
  apiKey: process.env.API_FUTURES_KEY!,
  apiSecret: process.env.API_FUTURES_SECRET!,
});
```

See: [`examples/Spot/Public/marketData.ts`](../examples/Spot/Public/marketData.ts), [`examples/Derivatives/Public/marketData.ts`](../examples/Derivatives/Public/marketData.ts).

---

## Lesson 2 — Public market data (REST)

Typical Spot public calls (from the market data example):

```typescript
const serverTime = await client.getServerTime();
const ticker = await client.getTicker({ pair: 'XBTUSD' });
const orderBook = await client.getOrderBook({ pair: 'XBTUSD', count: 10 });
const candles = await client.getCandles({ pair: 'XBTUSD', interval: 60 });
```

Pair symbols follow Kraken’s REST naming (e.g. `XBTUSD`). Use `getAssetPairs` to discover tradable pairs.

---

## Lesson 3 — `WebsocketClient`: connect & listen

Create the client, attach events, then `subscribe()` with a **topic** and a **`WsKey`** (which endpoint/product to use).

### Events you usually care about

| Event           | Meaning |
|----------------|---------|
| `open`         | Connection up |
| `message`      | Incoming data |
| `response`     | Acknowledgements (subscribe/unsubscribe/auth) |
| `reconnecting` | Connection lost, retrying |
| `reconnected`  | Back online; SDK resubscribes |
| `close`        | Socket closed |
| `authenticated`| Private auth succeeded |
| `exception`    | Errors |

Minimal public Spot example:

```typescript
import { WebsocketClient, WS_KEY_MAP, WSTopicRequest } from '@siebly/kraken-api';

const ws = new WebsocketClient();

ws.on('open', (data) => console.log('connected', data?.wsKey));
ws.on('message', (data) => console.log(JSON.stringify(data)));
ws.on('reconnected', (data) => console.log('reconnected', data));
ws.on('exception', (data) => console.error(data));

const ticker: WSTopicRequest = {
  topic: 'ticker',
  payload: { symbol: ['BTC/USD', 'ETH/USD'] },
};

ws.subscribe(ticker, WS_KEY_MAP.spotPublicV2);
```

**`WS_KEY_MAP`** selects the WebSocket “lane”:

- `spotPublicV2` / `spotPrivateV2` — Spot v2
- `spotL3V2` — Spot Level 3 order book (dedicated URL)
- `derivativesPublicV1` / `derivativesPrivateV1` — Futures

See: [`examples/Spot/WebSockets/publicWs.ts`](../examples/Spot/WebSockets/publicWs.ts), [`examples/Derivatives/WebSockets/publicWs.ts`](../examples/Derivatives/WebSockets/publicWs.ts).

### Batch subscribe (same `WsKey`)

```typescript
ws.subscribe(
  [
    { topic: 'ticker', payload: { symbol: ['BTC/USD'] } },
    { topic: 'trade', payload: { symbol: ['BTC/USD'] } },
    { topic: 'instrument', payload: { symbol: ['BTC/USD'], include_tokenized_assets: true } },
  ],
  WS_KEY_MAP.spotPublicV2,
);
```

---

## Lesson 4 — Private WebSocket streams (Spot)

Pass **the same Spot API key/secret** you use for REST. For private Spot v2 topics, the SDK can **fetch and refresh auth tokens** — you normally **do not** hand-roll token parameters on `subscribe()`.

```typescript
import { WebsocketClient, WS_KEY_MAP, WSTopicRequest } from '@siebly/kraken-api';

const ws = new WebsocketClient({
  apiKey: process.env.API_SPOT_KEY!,
  apiSecret: process.env.API_SPOT_SECRET!,
});

ws.on('message', (data) => console.log(JSON.stringify(data)));
ws.on('authenticated', (data) => console.log('authenticated', data));

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

ws.subscribe({ topic: 'balances', payload: {} }, WS_KEY_MAP.spotPrivateV2);

// Level 3 order book uses the L3 endpoint:
ws.subscribe(
  { topic: 'level3', payload: { symbol: ['BTC/USD'] } },
  WS_KEY_MAP.spotL3V2,
);
```

See: [`examples/Spot/WebSockets/privateWs.ts`](../examples/Spot/WebSockets/privateWs.ts).

---

## Lesson 5 — Spot orders over REST (`SpotClient`)

Use `cl_ord_id` with `client.generateNewOrderID()` for idempotent client IDs.

### Market order

```typescript
await client.submitOrder({
  ordertype: 'market',
  type: 'buy',
  volume: '0.01',
  pair: 'XBTUSD',
  cl_ord_id: client.generateNewOrderID(),
});
```

### Limit order

```typescript
await client.submitOrder({
  ordertype: 'limit',
  type: 'buy',
  volume: '0.0001',
  pair: 'XBTUSD',
  price: '10000',
  cl_ord_id: client.generateNewOrderID(),
});
```

### Post-only limit (maker)

```typescript
await client.submitOrder({
  ordertype: 'limit',
  type: 'buy',
  volume: '0.001',
  pair: 'XBTEUR',
  price: '1000.00',
  oflags: 'post',
  timeinforce: 'GTC',
  cl_ord_id: client.generateNewOrderID(),
});
```

### Batch orders (2–15 orders, same pair)

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
      cl_ord_id: client.generateNewOrderID(),
    },
    // ... more orders
  ],
});
```

Validate without sending:

```typescript
await client.submitBatchOrders({
  pair: 'XBTUSD',
  validate: true,
  orders: [/* ... */],
});
```

See: [`examples/Spot/Private/submitOrder.ts`](../examples/Spot/Private/submitOrder.ts).

---

## Lesson 6 — Futures orders (`DerivativesClient`)

Futures use different field names (`orderType`, `symbol`, `side`, `size`, etc.).

### Limit

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

### Market

```typescript
await client.submitOrder({
  orderType: 'mkt',
  symbol: 'PF_ETHUSD',
  side: 'sell',
  size: 0.01,
});
```

### Post-only & reduce-only

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

### Batch send/edit/cancel

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

See: [`examples/Derivatives/Private/submitOrder.ts`](../examples/Derivatives/Private/submitOrder.ts).

---

## Lesson 7 — Query & manage orders (Spot REST)

Examples: open/closed orders, filters, trades.

```typescript
await client.getTradeBalance();
await client.getOpenOrders();
await client.getOpenOrders({ trades: true });
await client.getClosedOrders({
  trades: true,
  start: Math.floor(Date.now() / 1000) - 86400 * 7,
});
```

See: [`examples/Spot/Private/orderManagement.ts`](../examples/Spot/Private/orderManagement.ts).

---

## Lesson 8 — Spot trading via WebSocket API (`WebsocketAPIClient`)

For **Spot only**, use `WebsocketAPIClient` when you want REST-like methods over one persistent WebSocket (amend, cancel, batch, cancel-all, etc.).

```typescript
import { WebsocketAPIClient } from '@siebly/kraken-api';

const wsApi = new WebsocketAPIClient({
  apiKey: process.env.API_SPOT_KEY!,
  apiSecret: process.env.API_SPOT_SECRET!,
});

wsApi.getWSClient().on('open', (d) => console.log('ws api open', d?.wsKey));
wsApi.getWSClient().on('exception', (e) => console.error(e));

const order = await wsApi.submitSpotOrder({
  order_type: 'limit',
  side: 'buy',
  limit_price: 26500.4,
  order_qty: 1.2,
  symbol: 'BTC/USD',
});

await wsApi.amendSpotOrder({ order_id: 'TEST-ORDER-ID', order_qty: 1.5, limit_price: 27000 });
await wsApi.cancelSpotOrder({ order_id: ['TEST-ORDER-ID'] });
await wsApi.cancelAllSpotOrders();
```

Conditional and trigger-style orders are also shown in the example file.

See: [`examples/Spot/WebSockets/wsAPI.ts`](../examples/Spot/WebSockets/wsAPI.ts).

---

## Lesson 9 — Custom logging (optional)

Pass a logger with `trace`, `info`, and `error` to reduce noise or integrate with your stack:

```typescript
import { WebsocketClient, DefaultLogger, LogParams } from '@siebly/kraken-api';

const customLogger: DefaultLogger = {
  trace: (..._p: LogParams) => {},
  info: (...p: LogParams) => console.log(...p),
  error: (...p: LogParams) => console.error(...p),
};

const ws = new WebsocketClient({ apiKey: '...', apiSecret: '...' }, customLogger);
```

---

## FAQs

**Do I need separate keys for Spot vs Futures?**  
Yes — create and scope permissions per product on Kraken’s side.

**Why both `WebsocketClient` and `WebsocketAPIClient`?**  
`WebsocketClient` = subscribe to **streams** (ticker, book, balances, …). `WebsocketAPIClient` = **Spot trading commands** over WebSocket (add/amend/cancel/batch).

**What if my connection drops?**  
The SDK reconnects and **resubscribes**; listen for `reconnected`.

**Where are all methods listed?**  
See [`docs/endpointFunctionList.md`](./endpointFunctionList.md), TypeScript definitions in `src/`, and [`llms.txt`](../llms.txt) for LLM-friendly summaries.

**Where to get help?**  
[GitHub issues](https://github.com/sieblyio/kraken-api/issues), [Telegram — Node.js Algo Traders](https://t.me/nodetraders).

---

## Next steps

1. Copy an example from [`examples/`](../examples/), set env vars, run it.
2. Read the matching Kraken REST/WebSocket docs for parameters not covered here.
3. For AI-assisted coding, point your tool at the repo’s `llms.txt`.

---

*This guide is for the `@siebly/kraken-api` SDK. It is not financial advice; trading crypto involves risk.*
