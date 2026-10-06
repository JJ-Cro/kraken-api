import { AffiliateClient } from '@siebly/kraken-api';
// or, if require is preferred:
// const { AffiliateClient } = require('@siebly/kraken-api');

// This example shows how to call this Kraken API endpoint with either node.js, javascript (js) or typescript (ts) with the npm module "@siebly/kraken-api" for Kraken exchange
// This Kraken API SDK is available on npm via "npm install @siebly/kraken-api"
// ENDPOINT: affiliate/v1/cpa-progress
// METHOD: GET
// PUBLIC: NO

const client = new AffiliateClient({
  apiKey: 'insert_api_key_here',
  apiSecret: 'insert_api_secret_here',
});

client.getCpaProgress(params)
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });
