
# Endpoint maps

<p align="center">
  <a href="https://www.npmjs.com/package/kraken-api">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/tiagosiebler/kraken-api/blob/master/docs/images/logoDarkMode2.svg?raw=true#gh-dark-mode-only">
      <img alt="SDK Logo" src="https://github.com/tiagosiebler/kraken-api/blob/master/docs/images/logoBrightMode2.svg?raw=true#gh-light-mode-only">
    </picture>
  </a>
</p>

Each REST client is a JavaScript class, which provides functions individually mapped to each endpoint available in the exchange's API offering. 

The following table shows all methods available in each REST client, whether the method requires authentication (automatically handled if API keys are provided), as well as the exact endpoint each method is connected to.

This can be used to easily find which method to call, once you have [found which endpoint you're looking to use](https://github.com/tiagosiebler/awesome-crypto-examples/wiki/How-to-find-SDK-functions-that-match-API-docs-endpoint).

All REST clients are in the [src](/src) folder. For usage examples, make sure to check the [examples](/examples) folder.

List of clients:
- [SpotClient](#spotclientts)
- [DerivativesClient](#derivativesclientts)
- [InstitutionalClient](#institutionalclientts)
- [PartnerClient](#partnerclientts)
- [WebsocketAPIClient](#websocketapiclientts)


If anything is missing or wrong, please open an issue or let us know in our [Node.js Traders](https://t.me/nodetraders) telegram group!

## How to use table

Table consists of 4 parts:

- Function name
- AUTH
- HTTP Method
- Endpoint

**Function name** is the name of the function that can be called through the SDK. Check examples folder in the repo for more help on how to use them!

**AUTH** is a boolean value that indicates if the function requires authentication - which means you need to pass your API key and secret to the SDK.

**HTTP Method** shows HTTP method that the function uses to call the endpoint. Sometimes endpoints can have same URL, but different HTTP method so you can use this column to differentiate between them.

**Endpoint** is the URL that the function uses to call the endpoint. Best way to find exact function you need for the endpoint is to search for URL in this table and find corresponding function name.


# SpotClient.ts

This table includes all endpoints from the official Exchange API docs and corresponding SDK functions for each endpoint that are found in [SpotClient.ts](/src/SpotClient.ts). 

| Function | AUTH | HTTP Method | Endpoint |
| -------- | :------: | :------: | -------- |
| [getSystemStatus()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L147) |  | GET | `0/public/SystemStatus` |
| [getAssetInfo()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L156) |  | GET | `0/public/Assets` |
| [getAssetPairs()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L168) |  | GET | `0/public/AssetPairs` |
| [getTicker()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L181) |  | GET | `0/public/Ticker` |
| [getCandles()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L195) |  | GET | `0/public/OHLC` |
| [getOrderBook()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L207) |  | GET | `0/public/Depth` |
| [getRecentTrades()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L218) |  | GET | `0/public/Trades` |
| [getRecentSpreads()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L229) |  | GET | `0/public/Spread` |
| [getAccountBalance()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L246) | :closed_lock_with_key:  | POST | `0/private/Balance` |
| [getExtendedBalance()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L258) | :closed_lock_with_key:  | POST | `0/private/BalanceEx` |
| [getCreditLines()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L269) | :closed_lock_with_key:  | POST | `0/private/CreditLines` |
| [getTradeBalance()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L280) | :closed_lock_with_key:  | POST | `0/private/TradeBalance` |
| [getOpenOrders()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L291) | :closed_lock_with_key:  | POST | `0/private/OpenOrders` |
| [getClosedOrders()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L303) | :closed_lock_with_key:  | POST | `0/private/ClosedOrders` |
| [getOrders()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L314) | :closed_lock_with_key:  | POST | `0/private/QueryOrders` |
| [getOrderAmends()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L326) | :closed_lock_with_key:  | POST | `0/private/OrderAmends` |
| [getTradesHistory()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L338) | :closed_lock_with_key:  | POST | `0/private/TradesHistory` |
| [getTrades()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L349) | :closed_lock_with_key:  | POST | `0/private/QueryTrades` |
| [getOpenPositions()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L360) | :closed_lock_with_key:  | POST | `0/private/OpenPositions` |
| [getLedgersInfo()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L371) | :closed_lock_with_key:  | POST | `0/private/Ledgers` |
| [getLedgers()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L382) | :closed_lock_with_key:  | POST | `0/private/QueryLedgers` |
| [getTradingVolume()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L393) | :closed_lock_with_key:  | POST | `0/private/TradeVolume` |
| [requestLedgersExport()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L405) | :closed_lock_with_key:  | POST | `0/private/AddExport` |
| [getLedgersExportStatus()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L416) | :closed_lock_with_key:  | POST | `0/private/ExportStatus` |
| [getLedgersExport()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L427) | :closed_lock_with_key:  | POST | `0/private/RetrieveExport` |
| [deleteLedgersExport()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L436) | :closed_lock_with_key:  | POST | `0/private/RemoveExport` |
| [submitOrder()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L456) | :closed_lock_with_key:  | POST | `0/private/AddOrder` |
| [amendOrder()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L470) | :closed_lock_with_key:  | POST | `0/private/AmendOrder` |
| [cancelOrder()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L485) | :closed_lock_with_key:  | POST | `0/private/CancelOrder` |
| [cancelAllOrders()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L501) | :closed_lock_with_key:  | POST | `0/private/CancelAll` |
| [cancelAllOrdersAfter()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L517) | :closed_lock_with_key:  | POST | `0/private/CancelAllOrdersAfter` |
| [getWebSocketsToken()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L534) | :closed_lock_with_key:  | POST | `0/private/GetWebSocketsToken` |
| [submitBatchOrders()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L546) | :closed_lock_with_key:  | POST | `0/private/AddOrderBatch` |
| [cancelBatchOrders()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L561) | :closed_lock_with_key:  | POST | `0/private/CancelOrderBatch` |
| [getDepositMethods()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L585) | :closed_lock_with_key:  | POST | `0/private/DepositMethods` |
| [getDepositAddresses()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L596) | :closed_lock_with_key:  | POST | `0/private/DepositAddresses` |
| [getDepositsStatus()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L607) | :closed_lock_with_key:  | POST | `0/private/DepositStatus` |
| [getWithdrawalMethods()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L618) | :closed_lock_with_key:  | POST | `0/private/WithdrawMethods` |
| [getWithdrawalAddresses()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L629) | :closed_lock_with_key:  | POST | `0/private/WithdrawAddresses` |
| [getWithdrawalInfo()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L640) | :closed_lock_with_key:  | POST | `0/private/WithdrawInfo` |
| [submitWithdrawal()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L651) | :closed_lock_with_key:  | POST | `0/private/Withdraw` |
| [getWithdrawalsStatus()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L664) | :closed_lock_with_key:  | POST | `0/private/WithdrawStatus` |
| [cancelWithdrawal()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L675) | :closed_lock_with_key:  | POST | `0/private/WithdrawCancel` |
| [submitTransferToFutures()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L688) | :closed_lock_with_key:  | POST | `0/private/WalletTransfer` |
| [createSubaccount()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L708) | :closed_lock_with_key:  | POST | `0/private/CreateSubaccount` |
| [submitSubaccountTransfer()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L721) | :closed_lock_with_key:  | POST | `0/private/AccountTransfer` |
| [allocateEarnFunds()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L739) | :closed_lock_with_key:  | POST | `0/private/Earn/Allocate` |
| [deallocateEarnFunds()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L752) | :closed_lock_with_key:  | POST | `0/private/Earn/Deallocate` |
| [getEarnAllocationStatus()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L764) | :closed_lock_with_key:  | POST | `0/private/Earn/AllocateStatus` |
| [getEarnDeallocationStatus()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L777) | :closed_lock_with_key:  | POST | `0/private/Earn/DeallocateStatus` |
| [getEarnStrategies()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L793) | :closed_lock_with_key:  | POST | `0/private/Earn/Strategies` |
| [getEarnAllocations()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L808) | :closed_lock_with_key:  | POST | `0/private/Earn/Allocations` |
| [getPreTradeData()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L826) |  | GET | `0/public/PreTrade` |
| [getPostTradeData()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L838) |  | GET | `0/public/PostTrade` |
| [getOAuthAccessToken()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L856) |  | POST | `oauth/token` |
| [getOAuthUserInfo()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L868) | :closed_lock_with_key:  | GET | `oauth/userinfo` |
| [createOAuthFastApiKey()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L878) | :closed_lock_with_key:  | POST | `oauth/fast-api-key` |
| [deleteOAuthFastApiKey()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L890) | :closed_lock_with_key:  | DELETE | `oauth/fast-api-key` |
| [updateOAuthFastApiKey()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L904) | :closed_lock_with_key:  | PUT | `oauth/fast-api-key` |
| [listOAuthFastApiKeys()](https://github.com/tiagosiebler/kraken-api/blob/master/src/SpotClient.ts#L916) | :closed_lock_with_key:  | GET | `oauth/fast-api-keys` |

# DerivativesClient.ts

This table includes all endpoints from the official Exchange API docs and corresponding SDK functions for each endpoint that are found in [DerivativesClient.ts](/src/DerivativesClient.ts). 

| Function | AUTH | HTTP Method | Endpoint |
| -------- | :------: | :------: | -------- |
| [getTradeHistory()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L122) |  | GET | `derivatives/api/v3/history` |
| [getOrderbook()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L136) |  | GET | `derivatives/api/v3/orderbook` |
| [getTickers()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L147) |  | GET | `derivatives/api/v3/tickers` |
| [getTicker()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L158) |  | GET | `derivatives/api/v3/tickers/{symbol}` |
| [getInstruments()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L175) |  | GET | `derivatives/api/v3/instruments` |
| [getInstrumentStatusList()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L186) |  | GET | `derivatives/api/v3/instruments/status` |
| [getInstrumentStatus()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L199) |  | GET | `derivatives/api/v3/instruments/{symbol}/status` |
| [batchOrderManagement()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L217) | :closed_lock_with_key:  | POST | `derivatives/api/v3/batchorder` |
| [cancelAllOrders()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L236) | :closed_lock_with_key:  | POST | `derivatives/api/v3/cancelallorders` |
| [cancelAllOrdersAfter()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L252) | :closed_lock_with_key:  | POST | `derivatives/api/v3/cancelallordersafter` |
| [cancelOrder()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L267) | :closed_lock_with_key:  | POST | `derivatives/api/v3/cancelorder` |
| [editOrder()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L283) | :closed_lock_with_key:  | POST | `derivatives/api/v3/editorder` |
| [getOpenOrders()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L298) | :closed_lock_with_key:  | GET | `derivatives/api/v3/openorders` |
| [submitOrder()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L309) | :closed_lock_with_key:  | POST | `derivatives/api/v3/sendorder` |
| [getOrderStatus()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L324) | :closed_lock_with_key:  | POST | `derivatives/api/v3/orders/status` |
| [getPnlPreferences()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L346) | :closed_lock_with_key:  | GET | `derivatives/api/v3/pnlpreferences` |
| [setPnlPreference()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L358) | :closed_lock_with_key:  | PUT | `derivatives/api/v3/pnlpreferences` |
| [getLeverageSettings()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L372) | :closed_lock_with_key:  | GET | `derivatives/api/v3/leveragepreferences` |
| [setLeverageSettings()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L386) | :closed_lock_with_key:  | PUT | `derivatives/api/v3/leveragepreferences` |
| [getAccounts()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L408) | :closed_lock_with_key:  | GET | `derivatives/api/v3/accounts` |
| [getOpenPositions()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L420) | :closed_lock_with_key:  | GET | `derivatives/api/v3/openpositions` |
| [getPositionPercentile()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L431) | :closed_lock_with_key:  | GET | `derivatives/api/v3/unwindqueue` |
| [getPortfolioMarginParameters()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L444) | :closed_lock_with_key:  | GET | `derivatives/api/v3/portfolio-margining/parameters` |
| [simulateMarginRequirements()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L456) | :closed_lock_with_key:  | POST | `derivatives/api/v3/portfolio-margining/simulate` |
| [getAssignmentPrograms()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L475) | :closed_lock_with_key:  | GET | `derivatives/api/v3/assignmentprogram/current` |
| [addAssignmentPreference()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L486) | :closed_lock_with_key:  | POST | `derivatives/api/v3/assignmentprogram/add` |
| [deleteAssignmentPreference()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L499) | :closed_lock_with_key:  | POST | `derivatives/api/v3/assignmentprogram/delete` |
| [getAssignmentPreferencesHistory()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L512) | :closed_lock_with_key:  | GET | `derivatives/api/v3/assignmentprogram/history` |
| [getFeeSchedules()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L531) |  | GET | `derivatives/api/v3/feeschedules` |
| [getFeeScheduleVolumes()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L542) | :closed_lock_with_key:  | GET | `derivatives/api/v3/feeschedules/volumes` |
| [getNotifications()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L561) | :closed_lock_with_key:  | GET | `derivatives/api/v3/notifications` |
| [getFills()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L578) | :closed_lock_with_key:  | GET | `derivatives/api/v3/fills` |
| [getHistoricalFundingRates()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L595) |  | GET | `derivatives/api/v3/historical-funding-rates` |
| [getSelfTradeStrategy()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L614) | :closed_lock_with_key:  | GET | `derivatives/api/v3/self-trade-strategy` |
| [updateSelfTradeStrategy()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L627) | :closed_lock_with_key:  | PUT | `derivatives/api/v3/self-trade-strategy` |
| [getSubaccountTradingStatus()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L650) | :closed_lock_with_key:  | GET | `derivatives/api/v3/subaccount/{subaccountUid}/trading-enabled` |
| [updateSubaccountTradingStatus()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L663) | :closed_lock_with_key:  | PUT | `derivatives/api/v3/subaccount/{subaccountUid}/trading-enabled` |
| [getSubaccounts()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L679) | :closed_lock_with_key:  | GET | `derivatives/api/v3/subaccounts` |
| [submitWalletTransfer()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L696) | :closed_lock_with_key:  | POST | `derivatives/api/v3/transfer` |
| [submitSubaccountTransfer()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L709) | :closed_lock_with_key:  | POST | `derivatives/api/v3/transfer/subaccount` |
| [submitTransferToSpot()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L723) | :closed_lock_with_key:  | POST | `derivatives/api/v3/withdrawal` |
| [getOpenRFQs()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L743) |  | GET | `derivatives/api/v3/rfqs` |
| [getOpenRFQ()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L755) |  | GET | `derivatives/api/v3/rfqs/{rfqUid}` |
| [getRFQOpenOffers()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L767) | :closed_lock_with_key:  | GET | `derivatives/api/v3/rfqs/open-offers` |
| [submitRFQNewOffer()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L779) | :closed_lock_with_key:  | POST | `derivatives/api/v3/rfqs/{rfqUid}/place-offer` |
| [updateRFQOpenOffer()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L796) | :closed_lock_with_key:  | PUT | `derivatives/api/v3/rfqs/{rfqUid}/replace-offer` |
| [cancelRFQOffer()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L813) | :closed_lock_with_key:  | DELETE | `derivatives/api/v3/rfqs/{rfqUid}/cancel-offer` |
| [getExecutionEvents()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L832) | :closed_lock_with_key:  | GET | `api/history/v3/executions` |
| [getOrderEvents()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L847) | :closed_lock_with_key:  | GET | `api/history/v3/orders` |
| [getTriggerEvents()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L862) | :closed_lock_with_key:  | GET | `api/history/v3/triggers` |
| [getPositionEvents()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L877) | :closed_lock_with_key:  | GET | `api/history/v3/positions` |
| [getAccountLog()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L893) | :closed_lock_with_key:  | GET | `api/history/v3/account-log` |
| [getAccountLogCsv()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L904) | :closed_lock_with_key:  | GET | `api/history/v3/accountlogcsv` |
| [getPublicExecutionEvents()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L919) |  | GET | `api/history/v3/market/{tradeable}/executions` |
| [getPublicOrderEvents()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L933) |  | GET | `api/history/v3/market/{tradeable}/orders` |
| [getPublicMarkPriceEvents()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L947) |  | GET | `api/history/v3/market/{tradeable}/price` |
| [getTickTypes()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L967) |  | GET | `api/charts/v1/` |
| [getMarketsForTickType()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L977) |  | GET | `api/charts/v1/{tickType}` |
| [getResolutions()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L990) |  | GET | `api/charts/v1/{tickType}/{symbol}` |
| [getCandles()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L1005) |  | GET | `api/charts/v1/{tickType}/{symbol}/{resolution}` |
| [getLiquidityPoolStatistic()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L1023) |  | GET | `api/charts/v1/analytics/liquidity-pool` |
| [getMarketAnalytics()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L1034) |  | GET | `api/charts/v1/analytics/{symbol}/{analyticsType}` |
| [checkApiKeyV3()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L1054) | :closed_lock_with_key:  | GET | `api/auth/v1/api-keys/v3/check` |
| [getAccountMarketShare()](https://github.com/tiagosiebler/kraken-api/blob/master/src/DerivativesClient.ts#L1070) | :closed_lock_with_key:  | GET | `api/stats/v1/rebates/self-market-share` |

# InstitutionalClient.ts

This table includes all endpoints from the official Exchange API docs and corresponding SDK functions for each endpoint that are found in [InstitutionalClient.ts](/src/InstitutionalClient.ts). 

| Function | AUTH | HTTP Method | Endpoint |
| -------- | :------: | :------: | -------- |
| [listCustodyVaults()](https://github.com/tiagosiebler/kraken-api/blob/master/src/InstitutionalClient.ts#L86) | :closed_lock_with_key:  | POST | `0/private/ListCustodyVaults` |
| [getCustodyVaultbyId()](https://github.com/tiagosiebler/kraken-api/blob/master/src/InstitutionalClient.ts#L99) | :closed_lock_with_key:  | POST | `0/private/GetCustodyVault` |
| [getCustodyDepositMethods()](https://github.com/tiagosiebler/kraken-api/blob/master/src/InstitutionalClient.ts#L116) | :closed_lock_with_key:  | POST | `0/private/DepositMethods` |
| [getCustodyDepositAddresses()](https://github.com/tiagosiebler/kraken-api/blob/master/src/InstitutionalClient.ts#L132) | :closed_lock_with_key:  | POST | `0/private/DepositAddresses` |
| [listCustodyTransactions()](https://github.com/tiagosiebler/kraken-api/blob/master/src/InstitutionalClient.ts#L147) | :closed_lock_with_key:  | POST | `0/private/ListCustodyTransactions` |
| [getCustodyTransactionbyId()](https://github.com/tiagosiebler/kraken-api/blob/master/src/InstitutionalClient.ts#L162) | :closed_lock_with_key:  | POST | `0/private/GetCustodyTransaction` |
| [getCustodyWithdrawMethods()](https://github.com/tiagosiebler/kraken-api/blob/master/src/InstitutionalClient.ts#L183) | :closed_lock_with_key:  | POST | `0/private/WithdrawMethods` |
| [getCustodyWithdrawAddresses()](https://github.com/tiagosiebler/kraken-api/blob/master/src/InstitutionalClient.ts#L198) | :closed_lock_with_key:  | POST | `0/private/WithdrawAddresses` |
| [listCustodyTasks()](https://github.com/tiagosiebler/kraken-api/blob/master/src/InstitutionalClient.ts#L224) | :closed_lock_with_key:  | POST | `0/private/ListCustodyTasks` |
| [getCustodyTaskbyId()](https://github.com/tiagosiebler/kraken-api/blob/master/src/InstitutionalClient.ts#L237) | :closed_lock_with_key:  | POST | `0/private/GetCustodyTask` |
| [listCustodyActivities()](https://github.com/tiagosiebler/kraken-api/blob/master/src/InstitutionalClient.ts#L253) | :closed_lock_with_key:  | POST | `0/private/ListCustodyActivities` |
| [getCustodyActivitybyId()](https://github.com/tiagosiebler/kraken-api/blob/master/src/InstitutionalClient.ts#L266) | :closed_lock_with_key:  | POST | `0/private/GetCustodyActivity` |
| [createOtcQuoteRequest()](https://github.com/tiagosiebler/kraken-api/blob/master/src/InstitutionalClient.ts#L289) | :closed_lock_with_key:  | POST | `0/private/CreateOtcQuoteRequest` |
| [updateOtcQuote()](https://github.com/tiagosiebler/kraken-api/blob/master/src/InstitutionalClient.ts#L303) | :closed_lock_with_key:  | POST | `0/private/UpdateOtcQuote` |
| [getOtcPairs()](https://github.com/tiagosiebler/kraken-api/blob/master/src/InstitutionalClient.ts#L317) | :closed_lock_with_key:  | POST | `0/private/GetOtcPairs` |
| [getOtcActiveQuotes()](https://github.com/tiagosiebler/kraken-api/blob/master/src/InstitutionalClient.ts#L329) | :closed_lock_with_key:  | POST | `0/private/GetOtcActiveQuotes` |
| [getOtcHistoricalQuotes()](https://github.com/tiagosiebler/kraken-api/blob/master/src/InstitutionalClient.ts#L344) | :closed_lock_with_key:  | POST | `0/private/GetOtcHistoricalQuotes` |
| [getOtcExposures()](https://github.com/tiagosiebler/kraken-api/blob/master/src/InstitutionalClient.ts#L358) | :closed_lock_with_key:  | POST | `0/private/GetOtcExposures` |
| [checkOtcClient()](https://github.com/tiagosiebler/kraken-api/blob/master/src/InstitutionalClient.ts#L372) | :closed_lock_with_key:  | POST | `0/private/CheckOtcClient` |

# PartnerClient.ts

This table includes all endpoints from the official Exchange API docs and corresponding SDK functions for each endpoint that are found in [PartnerClient.ts](/src/PartnerClient.ts). 

| Function | AUTH | HTTP Method | Endpoint |
| -------- | :------: | :------: | -------- |
| [createEmbedUser()](https://github.com/tiagosiebler/kraken-api/blob/master/src/PartnerClient.ts#L96) | :closed_lock_with_key:  | POST | `b2b/users` |
| [getEmbedUser()](https://github.com/tiagosiebler/kraken-api/blob/master/src/PartnerClient.ts#L109) | :closed_lock_with_key:  | GET | `b2b/users/{user}` |
| [updateEmbedUser()](https://github.com/tiagosiebler/kraken-api/blob/master/src/PartnerClient.ts#L118) | :closed_lock_with_key:  | PATCH | `b2b/users/{user}` |
| [submitEmbedVerification()](https://github.com/tiagosiebler/kraken-api/blob/master/src/PartnerClient.ts#L140) | :closed_lock_with_key:  | POST | `b2b/verifications/{user}` |
| [listEmbedAssets()](https://github.com/tiagosiebler/kraken-api/blob/master/src/PartnerClient.ts#L161) | :closed_lock_with_key:  | GET | `b2b/assets` |
| [getEmbedAsset()](https://github.com/tiagosiebler/kraken-api/blob/master/src/PartnerClient.ts#L172) | :closed_lock_with_key:  | GET | `b2b/assets/{asset}` |
| [listEmbedAssetRates()](https://github.com/tiagosiebler/kraken-api/blob/master/src/PartnerClient.ts#L185) | :closed_lock_with_key:  | GET | `b2b/assets/{asset}/rates` |
| [requestEmbedQuote()](https://github.com/tiagosiebler/kraken-api/blob/master/src/PartnerClient.ts#L203) | :closed_lock_with_key:  | POST | `b2b/quotes` |
| [getEmbedQuote()](https://github.com/tiagosiebler/kraken-api/blob/master/src/PartnerClient.ts#L218) | :closed_lock_with_key:  | GET | `b2b/quotes/{quote_id}` |
| [executeEmbedQuote()](https://github.com/tiagosiebler/kraken-api/blob/master/src/PartnerClient.ts#L230) | :closed_lock_with_key:  | PUT | `b2b/quotes/{quote_id}` |
| [getEmbedPortfolioSummary()](https://github.com/tiagosiebler/kraken-api/blob/master/src/PartnerClient.ts#L250) | :closed_lock_with_key:  | GET | `b2b/portfolio/{user}/summary` |
| [getEmbedPortfolioHistory()](https://github.com/tiagosiebler/kraken-api/blob/master/src/PartnerClient.ts#L263) | :closed_lock_with_key:  | GET | `b2b/portfolio/{user}/history` |
| [listEmbedPortfolioDetails()](https://github.com/tiagosiebler/kraken-api/blob/master/src/PartnerClient.ts#L275) | :closed_lock_with_key:  | GET | `b2b/portfolio/{user}/details` |
| [listEmbedPortfolioTransactions()](https://github.com/tiagosiebler/kraken-api/blob/master/src/PartnerClient.ts#L287) | :closed_lock_with_key:  | GET | `b2b/portfolio/{user}/transactions` |
| [getEmbedEarnSummary()](https://github.com/tiagosiebler/kraken-api/blob/master/src/PartnerClient.ts#L306) | :closed_lock_with_key:  | GET | `b2b/earn/{user}` |
| [listEmbedEarnAssets()](https://github.com/tiagosiebler/kraken-api/blob/master/src/PartnerClient.ts#L319) | :closed_lock_with_key:  | GET | `b2b/earn/assets` |
| [toggleEmbedAutoEarn()](https://github.com/tiagosiebler/kraken-api/blob/master/src/PartnerClient.ts#L332) | :closed_lock_with_key:  | PUT | `b2b/earn/{user}/auto` |
| [withdrawEmbedFunds()](https://github.com/tiagosiebler/kraken-api/blob/master/src/PartnerClient.ts#L353) | :closed_lock_with_key:  | POST | `b2b/funds/withdrawals` |
| [listEmbedFundingTransactions()](https://github.com/tiagosiebler/kraken-api/blob/master/src/PartnerClient.ts#L368) | :closed_lock_with_key:  | GET | `b2b/funds/transactions` |
| [listEmbedSettlementReports()](https://github.com/tiagosiebler/kraken-api/blob/master/src/PartnerClient.ts#L386) | :closed_lock_with_key:  | GET | `b2b/reports/settlement` |
| [getEmbedSettlementReport()](https://github.com/tiagosiebler/kraken-api/blob/master/src/PartnerClient.ts#L397) | :closed_lock_with_key:  | GET | `b2b/reports/settlement/{id}` |
| [listRampBuyCryptoAssets()](https://github.com/tiagosiebler/kraken-api/blob/master/src/PartnerClient.ts#L415) | :closed_lock_with_key:  | GET | `b2b/ramp/buy/crypto` |
| [listRampFiatCurrencies()](https://github.com/tiagosiebler/kraken-api/blob/master/src/PartnerClient.ts#L424) | :closed_lock_with_key:  | GET | `b2b/ramp/fiat-currencies` |
| [listRampPaymentMethods()](https://github.com/tiagosiebler/kraken-api/blob/master/src/PartnerClient.ts#L434) | :closed_lock_with_key:  | GET | `b2b/ramp/payment-methods` |
| [listRampCountries()](https://github.com/tiagosiebler/kraken-api/blob/master/src/PartnerClient.ts#L444) | :closed_lock_with_key:  | GET | `b2b/ramp/countries` |
| [getRampLimits()](https://github.com/tiagosiebler/kraken-api/blob/master/src/PartnerClient.ts#L459) | :closed_lock_with_key:  | GET | `b2b/ramp/limits` |
| [getRampProspectiveQuote()](https://github.com/tiagosiebler/kraken-api/blob/master/src/PartnerClient.ts#L471) | :closed_lock_with_key:  | GET | `b2b/ramp/quotes/prospective` |
| [getRampCheckoutUrl()](https://github.com/tiagosiebler/kraken-api/blob/master/src/PartnerClient.ts#L489) | :closed_lock_with_key:  | GET | `b2b/ramp/checkout` |

# WebsocketAPIClient.ts

This table includes all endpoints from the official Exchange API docs and corresponding SDK functions for each endpoint that are found in [WebsocketAPIClient.ts](/src/WebsocketAPIClient.ts). 

This client provides WebSocket API endpoints which allow for faster interactions with the Kraken API via a WebSocket connection.

| Function | AUTH | HTTP Method | Endpoint |
| -------- | :------: | :------: | -------- |
| [submitSpotOrder()](https://github.com/tiagosiebler/kraken-api/blob/master/src/WebsocketAPIClient.ts#L85) | :closed_lock_with_key:  | WS | `add_order` |
| [amendSpotOrder()](https://github.com/tiagosiebler/kraken-api/blob/master/src/WebsocketAPIClient.ts#L99) | :closed_lock_with_key:  | WS | `amend_order` |
| [cancelSpotOrder()](https://github.com/tiagosiebler/kraken-api/blob/master/src/WebsocketAPIClient.ts#L113) | :closed_lock_with_key:  | WS | `cancel_order` |
| [cancelAllSpotOrders()](https://github.com/tiagosiebler/kraken-api/blob/master/src/WebsocketAPIClient.ts#L127) | :closed_lock_with_key:  | WS | `cancel_all` |
| [cancelAllSpotOrdersAfter()](https://github.com/tiagosiebler/kraken-api/blob/master/src/WebsocketAPIClient.ts#L139) | :closed_lock_with_key:  | WS | `cancel_all_orders_after` |
| [batchSubmitSpotOrders()](https://github.com/tiagosiebler/kraken-api/blob/master/src/WebsocketAPIClient.ts#L158) | :closed_lock_with_key:  | WS | `batch_add` |
| [batchCancelSpotOrders()](https://github.com/tiagosiebler/kraken-api/blob/master/src/WebsocketAPIClient.ts#L172) | :closed_lock_with_key:  | WS | `batch_cancel` |
| [editSpotOrder()](https://github.com/tiagosiebler/kraken-api/blob/master/src/WebsocketAPIClient.ts#L189) | :closed_lock_with_key:  | WS | `edit_order` |