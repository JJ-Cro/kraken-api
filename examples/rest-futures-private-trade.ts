import { FuturesClient } from '../src/index.js';
// import { FuturesClient } from 'kraken-api';
// normally you should install this module via npm: `npm install @siebly/kraken-api`

async function start() {
  const account = {
    key: 'keyHere',
    secret: 'secretHere',
  };
  const client = new FuturesClient({
    apiKey: account.key,
    apiSecret: account.secret,
  });

  try {
    /**
     * TODO: update this text:  The trade amount indicates the amount of contract to buy or sell, and contract uses the base currency or lot as the trading unit.
     * The trade amount must be no less than 1 lot for the contract and no larger than the maxOrderQty.
     * It should be a multiple number of the lot, or the system will report an error when you place the order.
     * E.g. 1 lot of XBTUSDTM is 0.001 Bitcoin, while 1 lot of XBTUSDM is 1 USD.
     */

    // TODO: update this text: Submit a futures entry order for 1 lot of XBTUSDTM (0.001 bitcoin)
    const orderRes = await client.sendOrder({
      orderType: 'lmt',
      symbol: 'PF_XBTUSD',
      side: 'buy',
      size: 0.001,
      limitPrice: 50000,
      cliOrdId: 'test',
    });

    console.log('orderRes ', JSON.stringify(orderRes, null, 2));
  } catch (e) {
    console.error(`Req error: `, e);
  }
}

start();
