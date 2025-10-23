import { SpotClient } from '../src/index.ts';
// import { SpotClient } from 'kraken-api';
// normally you should install this module via npm: `npm install kraken-api`

async function start() {
  const client = new SpotClient();

  try {
    // // Fetch all symbols
    // const symbols = await client.getSymbols();
    // console.log('symbols:', JSON.stringify(symbols, null, 2));

    // // Fetch ticker for a specific symbol
    // const ticker = await client.getTicker({ symbol: 'BTC-USDT' });
    // console.log('ticker:', JSON.stringify(ticker, null, 2));

    // // Fetch klines for a specific symbol
    // const klines = await client.getKlines({
    //   symbol: 'BTC-USDT',
    //   type: '1day',
    // });
    // console.log(klines);

    const summary = await client.fetchLatencySummary();

    console.log('summary: ', summary);
  } catch (e) {
    console.error(`Req error: `, e);
  }
}

start();
