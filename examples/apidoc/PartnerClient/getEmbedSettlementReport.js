const { PartnerClient } = require('kraken-api');

// This example shows how to call this Kraken API endpoint with either node.js, javascript (js) or typescript (ts) with the npm module "kraken-api" for Kraken exchange
// This Kraken API SDK is available on npm via "npm install kraken-api"
// ENDPOINT: b2b/reports/settlement/{id}
// METHOD: GET
// PUBLIC: NO

const client = new PartnerClient({
  apiKey: 'insert_api_key_here',
  apiSecret: 'insert_api_secret_here',
});

client.getEmbedSettlementReport(params)
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });
