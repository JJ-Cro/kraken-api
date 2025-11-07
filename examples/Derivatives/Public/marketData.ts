import { DerivativesClient } from '../../../src/index.js';

// This example shows how to call Kraken API endpoint with either node.js,
// javascript (js) or typescript (ts) with the npm module "@siebly/kraken-api" for Kraken exchange
// for FUTURES PUBLIC MARKET DATA that requires no authentication

/**
 * import { DerivativesClient } from '@siebly/kraken-api';
 */

// you can initialise public client without api keys as public calls do not require auth
const client = new DerivativesClient({});

async function getAllTickers() {
  try {
    // Get all tickers (all Futures contracts and indices)
    const allTickers = await client.getTickers();
    console.log('All Tickers: ', JSON.stringify(allTickers, null, 2));

    // Response includes for each ticker:
    // - symbol: Market symbol (e.g., PF_BTCUSD)
    // - last: Last fill price
    // - markPrice: Current mark price for margining
    // - bid/ask: Best bid/ask prices
    // - vol24h: 24h volume
    // - openInterest: Current open interest
    // - fundingRate: Current funding rate (perpetuals only)
  } catch (e) {
    console.error('Get all tickers error: ', e);
  }
}

async function getTickerBySymbol() {
  try {
    // Get ticker for specific Futures symbol
    const ticker = await client.getTicker({
      symbol: 'PF_ETHUSD', // Perpetual BTC/USD
    });
    console.log('Ticker: ', JSON.stringify(ticker, null, 2));
  } catch (e) {
    console.error('Get ticker by symbol error: ', e);
  }
}

async function getOrderBook() {
  try {
    // Get order book for specific Futures contract
    const orderBook = await client.getOrderbook({
      symbol: 'PF_ETHUSD',
    });
    console.log('Order Book: ', JSON.stringify(orderBook, null, 2));

    // Response includes:
    // - bids: Array of [price, size] sorted descending by price
    // - asks: Array of [price, size] sorted ascending by price
  } catch (e) {
    console.error('Get order book error: ', e);
  }
}

async function getTradeHistory() {
  try {
    // Get recent trade history (last 100 trades)
    const tradeHistory = await client.getPublicExecutionEvents({
      tradeable: 'PF_ETHUSD',
    });
    console.log('Trade History: ', JSON.stringify(tradeHistory, null, 2));

    // Response includes:
    // - price: Fill price
    // - side: Taker side (buy/sell)
    // - size: Fill size
    // - time: Trade timestamp
    // - type: Trade type (fill, liquidation, assignment, etc.)
  } catch (e) {
    console.error('Get trade history error: ', e);
  }
}

async function getTradeHistoryWithTime() {
  try {
    // Get trades before specific time (last 100 trades before specified time)
    const tradeHistoryTime = await client.getPublicExecutionEvents({
      tradeable: 'PF_ETHUSD',
      before: Date.now() - 3600000, // 1 hour ago
    });
    console.log(
      'Trade History (1h ago): ',
      JSON.stringify(tradeHistoryTime, null, 2),
    );

    // Returns up to 100 trades prior to before time (max 7 days back)
  } catch (e) {
    console.error('Get trade history with time error: ', e);
  }
}

async function getInstruments() {
  try {
    // Get all available Futures instruments
    const instruments = await client.getInstruments();
    console.log('Instruments: ', JSON.stringify(instruments, null, 2));

    // Response includes for each instrument:
    // - symbol: Market symbol
    // - type: Instrument type (flexible_futures, futures_inverse, etc.)
    // - underlying: Underlying asset
    // - tickSize: Minimum price increment
    // - contractSize: Contract size
    // - tradeable: Whether instrument is tradeable
  } catch (e) {
    console.error('Get instruments error: ', e);
  }
}

async function getFeeSchedules() {
  try {
    // Get fee schedules for Futures trading
    const feeSchedules = await client.getFeeSchedules();
    console.log('Fee Schedules: ', JSON.stringify(feeSchedules, null, 2));

    // Response includes maker and taker fees by tier
  } catch (e) {
    console.error('Get fee schedules error: ', e);
  }
}

// Uncomment the function you want to test:

// getAllTickers();
// getTickerBySymbol();
// getOrderBook();
// getTradeHistory();
// getTradeHistoryWithTime();
// getInstruments();
// getFeeSchedules();
