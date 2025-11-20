const { WebsocketAPIClient } = require('kraken-api');

// This example shows how to call this Kraken WebSocket API endpoint with either node.js, javascript (js) or typescript (ts) with the npm module "kraken-api" for Kraken exchange
// This Kraken API SDK is available on npm via "npm install kraken-api"
// WS API ENDPOINT: amend_order
// METHOD: WebSocket API
// PUBLIC: NO

// Create a WebSocket API client instance
const client = new WebsocketAPIClient({
  apiKey: 'insert_api_key_here',
  apiSecret: 'insert_api_secret_here',
});

// The WebSocket connection is established automatically when needed
// You can use the client to make requests immediately

// Example use of the amendSpotOrder method
client.amendSpotOrder(params)
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });

