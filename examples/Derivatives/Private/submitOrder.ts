import { DerivativesClient } from '../../../src/index.js';

// This example shows how to call Kraken API endpoint with either node.js,
// javascript (js) or typescript (ts) with the npm module "@siebly/kraken-api" for Kraken exchange
// for FUTURES ORDER MANAGEMENT

/**
 * import { DerivativesClient } from '@siebly/kraken-api';
 */

// initialise the client
/**
 *
 * Kraken Futures API uses API Key and API Secret
 *
 * Example:
 * {
 *   apiKey: 'your-api-key',
 *   apiSecret: 'your-api-secret',
 * }
 *
 * API Key Permissions Required: Orders and trades - Create & modify orders
 *
 */
const client = new DerivativesClient({
  apiKey: process.env.API_KEY_NAME || 'insertApiKeyHere',
  apiSecret: process.env.API_PRIVATE_KEY || 'insertApiSecretHere',
});

async function submitLimitOrder() {
  try {
    // Submit limit order for Futures
    const limitOrder = await client.submitOrder({
      orderType: 'lmt',
      symbol: 'PF_ETHUSD', // Perpetual ETH/USD
      side: 'buy',
      size: 0.01, // Contract size
      limitPrice: 1000,
      cliOrdId: client.generateNewOrderID(),
    });
    console.log('Limit Order Result: ', JSON.stringify(limitOrder, null, 2));

    // Response includes:
    // - status: placed, partiallyFilled, filled, or rejection reason
    // - order_id: Unique order identifier
    // - orderEvents: Array of order events (PLACE, EXECUTE, etc.)
  } catch (e) {
    console.error('Submit limit order error: ', e);
  }
}

async function submitMarketOrder() {
  try {
    // Submit market order (IOC with 1% price protection)
    const marketOrder = await client.submitOrder({
      orderType: 'mkt',
      symbol: 'PF_ETHUSD',
      side: 'sell', // or "buy"
      size: 0.01,
    });
    console.log('Market Order Result: ', JSON.stringify(marketOrder, null, 2));
  } catch (e) {
    console.error('Submit market order error: ', e);
  }
}

async function submitPostOnlyOrder() {
  try {
    // Submit post-only order (maker-only)
    const postOrder = await client.submitOrder({
      orderType: 'post',
      symbol: 'PF_ETHUSD',
      side: 'buy',
      size: 0.01,
      limitPrice: 1000,
      cliOrdId: client.generateNewOrderID(),
    });
    console.log('Post-Only Order Result: ', JSON.stringify(postOrder, null, 2));
  } catch (e) {
    console.error('Submit post-only order error: ', e);
  }
}

async function submitReduceOnlyOrder() {
  try {
    // Submit reduce-only order (only closes position, won't open new)
    const reduceOnlyOrder = await client.submitOrder({
      orderType: 'lmt',
      symbol: 'PF_ETHUSD',
      side: 'sell',
      size: 1,
      limitPrice: 1000,
      reduceOnly: true, // Only reduce existing position
    });
    console.log(
      'Reduce-Only Order Result: ',
      JSON.stringify(reduceOnlyOrder, null, 2),
    );
  } catch (e) {
    console.error('Submit reduce-only order error: ', e);
  }
}

async function editOrder() {
  try {
    // Edit an existing order
    const editResult = await client.editOrder({
      orderId: 'a04d0f84-36d4-4499-8382-96fcfc3ce7aa', // Or use cliOrdId instead
      limitPrice: 1100, // New limit price
    });
    console.log('Edit Order Result: ', JSON.stringify(editResult, null, 2));

    // Response includes:
    // - status: edited, invalidSize, invalidPrice, etc.
    // - orderEvents: Array of order events
  } catch (e) {
    console.error('Edit order error: ', e);
  }
}

async function cancelOrder() {
  try {
    // Cancel a single order
    const cancelResult = await client.cancelOrder({
      order_id: 'a04d0f84-36d4-4499-8382-96fcfc3ce7aa', // Or use cliOrdId
    });
    console.log('Cancel Order Result: ', JSON.stringify(cancelResult, null, 2));

    // Response status:
    // - cancelled: Successfully cancelled
    // - filled: Order was already filled
    // - notFound: Order not found
  } catch (e) {
    console.error('Cancel order error: ', e);
  }
}

async function cancelAllOrders() {
  try {
    // Cancel all open orders
    const cancelAllResult = await client.cancelAllOrders();
    console.log(
      'Cancel All Orders Result: ',
      JSON.stringify(cancelAllResult, null, 2),
    );

    // Response includes:
    // - status: cancelled or noOrdersToCancel
    // - cancelledOrders: Array of cancelled order IDs
  } catch (e) {
    console.error('Cancel all orders error: ', e);
  }
}

async function cancelAllOrdersBySymbol() {
  try {
    // Cancel all orders for specific symbol
    const cancelBySymbol = await client.cancelAllOrders({
      symbol: 'PF_ETHUSD',
    });
    console.log(
      'Cancel Orders by Symbol Result: ',
      JSON.stringify(cancelBySymbol, null, 2),
    );
  } catch (e) {
    console.error('Cancel orders by symbol error: ', e);
  }
}

async function batchOrderManagement() {
  try {
    // Send, edit, and cancel orders in a single batch request
    const batchResult = await client.batchOrderManagement({
      json: {
        batchOrder: [
          // Send new order
          {
            order: 'send',
            order_tag: 'order-1', // Tag to map responses
            orderType: 'lmt',
            symbol: 'PF_ETHUSD',
            side: 'buy',
            size: 0.01,
            limitPrice: 1000,
            cliOrdId: client.generateNewOrderID(),
          },
          // Send another order
          {
            order: 'send',
            order_tag: 'order-2',
            orderType: 'lmt',
            symbol: 'PF_ETHUSD',
            side: 'buy',
            size: 0.01,
            limitPrice: 1100,
          },
          // Edit existing order
          {
            order: 'edit',
            order_id: 'a04d1143-757a-4dba-a0a7-687303b9c62d',
            limitPrice: 900,
          },
          // Cancel existing order
          {
            order: 'cancel',
            order_id: 'a04d116e-fb9c-4bcf-9eaf-ea90254439b3',
          },
        ],
      },
    });
    console.log('Batch Order Result: ', JSON.stringify(batchResult, null, 2));

    // Response includes batchStatus array with results for each order
    // - status: placed, edited, cancelled, or rejection reason
    // - order_tag: Maps back to your request
  } catch (e) {
    console.error('Batch order management error: ', e);
  }
}

// Uncomment the function you want to test:

// submitLimitOrder();
// submitMarketOrder();
// submitPostOnlyOrder();
// submitReduceOnlyOrder();
// editOrder();
// cancelOrder();
// cancelAllOrders();
// cancelAllOrdersBySymbol();
// batchOrderManagement();
