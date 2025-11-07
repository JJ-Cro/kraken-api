import {
  BaseWebsocketClient,
  EmittableEvent,
  MidflightWsRequestEvent,
} from './lib/BaseWSClient.js';
import { neverGuard } from './lib/misc-util.js';
import { RestClientOptions } from './lib/requestUtils.js';
import {
  SignAlgorithm,
  SignEncodeMethod,
  signMessage,
} from './lib/webCryptoAPI.js';
import { DefaultLogger } from './lib/websocket/logger.js';
import { RestClientCache } from './lib/websocket/rest-client-cache.js';
import {
  WS_KEY_MAP,
  WsKey,
  WsOperation,
  WsRequestOperationKraken,
  WsTopicRequest,
} from './lib/websocket/websocket-util.js';
import { WSConnectedResult } from './lib/websocket/WsStore.types.js';
import {
  WSAPIAuthenticationRequestFromServer,
  WsAPITopicRequestParamMap,
  WsAPITopicResponseMap,
  WsAPIWsKeyTopicMap,
} from './types/websockets/ws-api.js';
import { MessageEventLike } from './types/websockets/ws-events.js';
import {
  WSClientConfigurableOptions,
  WsMarket,
} from './types/websockets/ws-general.js';
import { WSSpotTopic, WSTopic } from './types/websockets/ws-subscriptions.js';

const WS_LOGGER_CATEGORY_ID = 'kraken-ws';
const WS_LOGGER_CATEGORY = {
  category: WS_LOGGER_CATEGORY_ID,
};

type WSAPIRequest<Tany = any> = any;
type WSAPIWsKey = any;

export interface WSAPIRequestFlags {
  /** If true, will skip auth requirement for WS API connection */
  authIsOptional?: boolean | undefined;
}

export class WebsocketClient extends BaseWebsocketClient<WsKey, any> {
  private restClientCache: RestClientCache = new RestClientCache();

  constructor(options?: WSClientConfigurableOptions, logger?: DefaultLogger) {
    super({ ...options, wsLoggerCategory: WS_LOGGER_CATEGORY_ID }, logger);

    this.restClientCache.setLogger(this.logger, WS_LOGGER_CATEGORY);
  }

  /**
   * Request connection of all dependent (public & private) websockets, instead of waiting for automatic connection by library.
   *
   * Returns array of promises that individually resolve when each connection is successfully opened.
   */
  public connectAll(): Promise<WSConnectedResult | undefined>[] {
    return [this.connect(WS_KEY_MAP.spotPrivateV2)];
  }

  /**
   * Ensures the WS API connection is active and ready.
   *
   * You do not need to call this, but if you call this before making any WS API requests,
   * it can accelerate the first request (by preparing the connection in advance).
   */
  public connectWSAPI(wsKey: WSAPIWsKey, skipAuth?: boolean): Promise<unknown> {
    if (skipAuth) {
      return this.assertIsConnected(wsKey);
    }

    /** This call automatically ensures the connection is active AND authenticated before resolving */
    return this.assertIsAuthenticated(wsKey);
  }

  /**
   * Request subscription to one or more topics. Pass topics as either an array of strings, or array of objects (if the topic has parameters).
   * Objects should be formatted as {topic: string, params: object}.
   *
   * - Subscriptions are automatically routed to the correct websocket connection.
   * - Authentication/connection is automatic.
   * - Resubscribe after network issues is automatic.
   *
   * Call `unsubscribe(topics)` to remove topics
   */
  // TODO: auto resolve public vs private wsKey based on topic name!
  public subscribe(
    requests:
      | (WsTopicRequest<WSTopic> | WSTopic)
      | (WsTopicRequest<WSTopic> | WSTopic)[],
    wsKey: WsKey,
  ) {
    if (!Array.isArray(requests)) {
      this.subscribeTopicsForWsKey([requests], wsKey);
      return;
    }

    if (requests.length) {
      this.subscribeTopicsForWsKey(requests, wsKey);
    }
  }

  /**
   * Unsubscribe from one or more topics. Similar to subscribe() but in reverse.
   *
   * - Requests are automatically routed to the correct websocket connection.
   * - These topics will be removed from the topic cache, so they won't be subscribed to again.
   */
  public unsubscribe(
    requests:
      | (WsTopicRequest<WSTopic> | WSTopic)
      | (WsTopicRequest<WSTopic> | WSTopic)[],
    wsKey: WsKey,
  ) {
    if (!Array.isArray(requests)) {
      this.unsubscribeTopicsForWsKey([requests], wsKey);
      return;
    }

    if (requests.length) {
      this.unsubscribeTopicsForWsKey(requests, wsKey);
    }
  }

  /**
   * WS API Methods - similar to the REST API, but via WebSockets
   */

  /**
   * Send a Websocket API event on a connection. Returns a promise that resolves on reply.
   *
   * Returned promise is rejected if an exception is detected in the reply OR the connection disconnects for any reason (even if automatic reconnect will happen).
   *
   * After a fresh connection, you should always send a login request first.
   *
   * If you authenticated once and you're reconnected later (e.g. connection temporarily lost), the SDK will by default automatically:
   * - Detect you were authenticated to the WS API before
   * - Try to re-authenticate (up to 5 times, in case something (bad timestamp) goes wrong)
   * - If it succeeds, it will emit the 'authenticated' event.
   * - If it fails and gives up, it will emit an 'exception' event (type: 'wsapi.auth', reason: detailed text).
   *
   * You can turn off the automatic re-auth WS API logic using `reauthWSAPIOnReconnect: false` in the WSClient config.
   *
   * @param wsKey - The connection this event is for (e.g. "spotV4" | "perpFuturesUSDTV4" | "perpFuturesBTCV4" | "deliveryFuturesUSDTV4" | "deliveryFuturesBTCV4" | "optionsV4")
   * @param channel - The channel this event is for (e.g. "spot.login" to authenticate)
   * @param params - Any request parameters for the payload (contents of req_param in the docs). Signature generation is automatic, only send parameters such as order ID as per the docs.
   * @returns Promise - tries to resolve with async WS API response. Rejects if disconnected or exception is seen in async WS API response
   */

  // This overload allows the caller to omit the 3rd param, if it isn't required (e.g. for the login call)
  async sendWSAPIRequest<
    TWSKey extends keyof WsAPIWsKeyTopicMap,
    TWSChannel extends WsAPIWsKeyTopicMap[TWSKey] = WsAPIWsKeyTopicMap[TWSKey],
    TWSParams extends
      WsAPITopicRequestParamMap[TWSChannel] = WsAPITopicRequestParamMap[TWSChannel],
    TWSAPIResponse extends
      | WsAPITopicResponseMap[TWSChannel]
      | object = WsAPITopicResponseMap[TWSChannel],
  >(
    wsKey: TWSKey,
    channel: TWSChannel,
    params?: TWSParams extends void | never ? undefined : TWSParams,
    requestFlags?: WSAPIRequestFlags,
  ): Promise<TWSAPIResponse>;

  async sendWSAPIRequest<
    TWSKey extends keyof WsAPIWsKeyTopicMap = keyof WsAPIWsKeyTopicMap,
    TWSChannel extends WsAPIWsKeyTopicMap[TWSKey] = WsAPIWsKeyTopicMap[TWSKey],
    TWSParams extends
      WsAPITopicRequestParamMap[TWSChannel] = WsAPITopicRequestParamMap[TWSChannel],
    TWSAPIResponse = object,
  >(
    wsKey: TWSKey,
    channel: TWSChannel,
    params: TWSParams & { signRequest?: boolean },
    requestFlags?: WSAPIRequestFlags,
  ): Promise<any> {
    this.logger.trace(`sendWSAPIRequest(): assert "${wsKey}" is connected`, {
      ...WS_LOGGER_CATEGORY,
    });

    // await this.assertIsConnected(wsKey);

    // // Some commands don't require authentication.
    // if (requestFlags?.authIsOptional !== true) {
    //   // this.logger.trace('sendWSAPIRequest(): assertIsAuthenticated(${wsKey})...');
    //   await this.assertIsAuthenticated(wsKey);
    //   // this.logger.trace('sendWSAPIRequest(): assertIsAuthenticated(${wsKey}) ok');
    // }

    // const timestampBeforeAuth = Date.now();
    // const signTimestamp = Date.now() + this.options.recvWindow;
    // const timeInSeconds = +(signTimestamp / 1000).toFixed(0);

    // const requestEvent: WSAPIRequest<WsAPITopicRequestParamMap[TWSChannel]> = {
    //   time: timeInSeconds,
    //   // id: timeInSeconds,
    //   channel,
    //   event: 'api',
    //   payload: {
    //     req_id: this.getNewRequestId(),
    //     api_key: this.options.apiKey,
    //     req_param: params ? params : '',
    //     timestamp: `${timeInSeconds}`,
    //   },
    // };

    // const timestampAfterAuth = Date.now();

    // /**
    //  * Some WS API requests require a timestamp to be included. assertIsConnected and assertIsAuthenticated
    //  * can introduce a small delay before the actual request is sent, if not connected before that request is
    //  * made. This can lead to a curious race condition, where the request timestamp is before
    //  * the "authorizedSince" timestamp - as such, binance does not recognise the session as already authenticated.
    //  *
    //  * The below mechanism measures any delay introduced from the assert calls, and if the request includes a timestamp,
    //  * it offsets that timestamp by the delay.
    //  */
    // const delayFromAuthAssert = timestampAfterAuth - timestampBeforeAuth;
    // if (delayFromAuthAssert && requestEvent.payload?.timestamp) {
    //   requestEvent.payload.timestamp += delayFromAuthAssert;
    //   this.logger.trace(
    //     `sendWSAPIRequest(): adjust timestamp - delay seen by connect/auth assert and delayed request includes timestamp, adjusting timestamp by ${delayFromAuthAssert}ms`,
    //   );
    // }

    // // Sign request
    // const signedEvent = await this.signWSAPIRequest(requestEvent);

    // // Store deferred promise
    // const promiseRef = getPromiseRefForWSAPIRequest(requestEvent);

    // const deferredPromise = this.getWsStore().createDeferredPromise<
    //   TWSAPIResponse & { request: any }
    // >(wsKey, promiseRef, false);

    // // Enrich returned promise with request context for easier debugging
    // deferredPromise.promise
    //   ?.then((res) => {
    //     if (!Array.isArray(res)) {
    //       res.request = {
    //         wsKey: wsKey,
    //         ...signedEvent,
    //       };
    //     }

    //     return res;
    //   })
    //   .catch((e) => {
    //     if (typeof e === 'string') {
    //       this.logger.error('unexpcted string', { e });
    //       return e;
    //     }
    //     e.request = {
    //       wsKey: wsKey,
    //       channel,
    //       payload: signedEvent.payload,
    //     };
    //     // throw e;
    //     return e;
    //   });

    // // Send event
    // const throwExceptions = true;
    // this.tryWsSend(wsKey, JSON.stringify(signedEvent), throwExceptions);

    // this.logger.trace(
    //   `sendWSAPIRequest(): sent "${channel}" event with promiseRef(${promiseRef})`,
    // );

    // // Return deferred promise, so caller can await this call
    // return deferredPromise.promise!;
  }

  /**
   *
   * Internal methods - not intended for public use
   *
   */

  private getRestClientOptions(): RestClientOptions {
    return {
      ...this.options,
      ...this.options.restOptions,
      apiKey: this.options.apiKey,
      apiSecret: this.options.apiSecret,
    };
  }

  protected isCustomReconnectionNeeded(): boolean {
    return false;
  }

  protected async triggerCustomReconnectionWorkflow(): Promise<void> {
    return;
  }

  protected async getWsUrl(wsKey: WsKey): Promise<string> {
    if (this.options.wsUrl) {
      return this.options.wsUrl;
    }

    switch (wsKey) {
      /**
       * https://docs.kraken.com/api/docs/guides/spot-ws-intro/
       *
       * Note: Kraken's v2 WebSockets clean up a number idiosyncrasies and ambiguities from v1 with the overall aim to enable easier integration with applications. It is intended that v1 will be maintained but future enhancements will be developed in v2.
       *
       * Given the above, we are only integrating with V2 for now.
       *
       * V2 SpotWebSocket Reference: https://docs.kraken.com/api/docs/websocket-v2/add_order/
       */
      case WS_KEY_MAP.spotPublicV2: {
        return 'wss://ws.kraken.com/v2';
      }
      case WS_KEY_MAP.spotPrivateV2: {
        return 'wss://ws-auth.kraken.com/v2';
      }
      case WS_KEY_MAP.spotBetaPublicV2: {
        return 'wss://beta-ws.kraken.com/v2';
      }
      case WS_KEY_MAP.spotBetaPrivateV2: {
        return 'wss://beta-ws-auth.kraken.com/v2';
      }
      default: {
        throw neverGuard(wsKey, `Unhandled WsKey "${wsKey}"`);
      }
    }
  }

  protected sendPingEvent(wsKey: WsKey) {
    // let pingChannel: WsRequestPing['channel'];

    // switch (wsKey) {
    //   case 'deliveryFuturesBTCV4':
    //   case 'deliveryFuturesUSDTV4':
    //   case 'perpFuturesBTCV4':
    //   case 'perpFuturesUSDTV4': {
    //     pingChannel = 'futures.ping';
    //     break;
    //   }
    //   case 'announcementsV4': {
    //     pingChannel = 'announcement.ping';
    //     break;
    //   }
    //   case 'optionsV4': {
    //     pingChannel = 'options.ping';
    //     break;
    //   }
    //   case 'spotV4': {
    //     pingChannel = 'spot.ping';
    //     break;
    //   }
    //   default: {
    //     throw neverGuard(wsKey, `Unhandled WsKey "${wsKey}"`);
    //   }
    // }

    // Spot: https://docs.kraken.com/api/docs/websocket-v2/ping
    return this.tryWsSend(
      wsKey,
      `{ "method": "ping", "req_id": ${this.getNewRequestId()} }`,
    );
  }

  protected sendPongEvent(wsKey: WsKey) {
    try {
      this.logger.trace('Sending upstream ws PONG: ', {
        ...WS_LOGGER_CATEGORY,
        wsMessage: 'PONG',
        wsKey,
      });
      if (!wsKey) {
        throw new Error('Cannot send PONG, no wsKey provided');
      }
      const wsState = this.getWsStore().get(wsKey);
      if (!wsState || !wsState?.ws) {
        throw new Error(`Cannot send pong, ${wsKey} socket not connected yet`);
      }

      // Send a protocol layer pong
      wsState.ws.pong();
    } catch (e) {
      this.logger.error('Failed to send WS PONG', {
        ...WS_LOGGER_CATEGORY,
        wsMessage: 'PONG',
        wsKey,
        exception: e,
      });
    }
  }

  // NOT IN USE for kraken
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected isWsPing(_msg: any): boolean {
    return false;
  }

  protected isWsPong(msg: any): boolean {
    // Pre-parsed in resolveEmittableEvents into "pong" eventType:
    if (msg?.eventType) {
      if (msg?.eventType === 'pong') {
        return true;
      }
    }

    return false;
  }

  /**
   * Parse incoming events into categories, before emitting to the user
   */
  protected resolveEmittableEvents(
    wsKey: WsKey,
    event: MessageEventLike,
  ): EmittableEvent[] {
    const results: EmittableEvent[] = [];

    try {
      const parsed = JSON.parse(event.data);

      const responseEvents = ['subscribe', 'unsubscribe'];
      const authenticatedEvents = ['auth'];

      const eventHeaders = parsed?.header;
      const eventChannel = eventHeaders?.channel;
      const eventType = eventHeaders?.event;
      const eventStatusCode = eventHeaders?.status;
      const requestId = parsed?.request_id;

      const promiseRef = [eventChannel, requestId].join('_');

      const eventAction =
        parsed.method || parsed.type || parsed?.header?.data || parsed.channel;

      // WS API
      // if (eventType === 'api') {
      //   const isError = eventStatusCode !== '200';

      //   // WS API Exception
      //   if (isError) {
      //     try {
      //       this.getWsStore().rejectDeferredPromise(
      //         wsKey,
      //         promiseRef,
      //         {
      //           wsKey,
      //           ...parsed,
      //         },
      //         true,
      //       );
      //     } catch (e) {
      //       this.logger.error('Exception trying to reject WSAPI promise', {
      //         wsKey,
      //         promiseRef,
      //         parsedEvent: parsed,
      //         error: e,
      //       });
      //     }

      //     results.push({
      //       eventType: 'exception',
      //       event: parsed,
      //     });
      //     return results;
      //   }

      //   // WS API Success
      //   try {
      //     this.getWsStore().resolveDeferredPromise(
      //       wsKey,
      //       promiseRef,
      //       {
      //         wsKey,
      //         ...parsed,
      //       },
      //       true,
      //     );
      //   } catch (e) {
      //     this.logger.error('Exception trying to resolve WSAPI promise', {
      //       wsKey,
      //       promiseRef,
      //       parsedEvent: parsed,
      //       error: e,
      //     });
      //   }

      //   if (eventChannel.includes('.login')) {
      //     results.push({
      //       eventType: 'authenticated',
      //       event: {
      //         ...parsed,
      //         isWSAPI: true,
      //         WSAPIAuthChannel: eventChannel,
      //       },
      //     });
      //   }

      //   results.push({
      //     eventType: 'response',
      //     event: parsed,
      //   });
      //   return results;
      // }

      if (typeof eventAction === 'string') {
        if (parsed.success === false) {
          results.push({
            eventType: 'exception',
            event: parsed,
          });
          return results;
        }

        // Most events use event: "update" or "snapshot" for topic updates
        if (['update', 'snapshot'].includes(eventAction)) {
          results.push({
            eventType: 'message',
            event: parsed,
          });
          return results;
        }

        // These are request/reply pattern events (e.g. after subscribing to topics or authenticating)
        // e.g. "method":"subscribe"
        if (responseEvents.includes(eventAction)) {
          results.push({
            eventType: 'response',
            event: parsed,
          });
          return results;
        }

        // Request/reply pattern for authentication success
        if (authenticatedEvents.includes(eventAction)) {
          results.push({
            eventType: 'authenticated',
            event: parsed,
          });
          return results;
        }

        if (eventAction === 'heartbeat' || eventAction === 'pong') {
          results.push({
            eventType: 'pong',
            event: parsed,
          });
          return results;
        }

        this.logger.error(
          `!! Unhandled string "eventAction" "${eventAction}". Defaulting to "message" channel...`,
          parsed,
        );
      } else {
        this.logger.error(
          `!! Unhandled non-string "eventAction" "${eventAction}". Defaulting to "message" channel...`,
          parsed,
        );
      }

      results.push({
        eventType: 'message',
        event: parsed,
      });
    } catch (e) {
      results.push({
        event: {
          message: 'Failed to parse event data due to exception',
          exception: e,
          eventData: event.data,
        },
        eventType: 'exception',
      });

      this.logger.error('Failed to parse event data due to exception: ', {
        exception: e,
        eventData: event.data,
      });
    }

    return results;
  }

  /**
   * Determines if a topic is for a private channel, using a hardcoded list of strings
   */
  protected isPrivateTopicRequest(
    request: WsTopicRequest<WSTopic>,
    wsKey: WsKey,
  ): boolean {
    // TODO: configure this to auto-route requests for private topcis to priate websockets
    const topicName = request?.topic?.toLowerCase();
    if (!topicName) {
      return false;
    }

    return false;
    // switch (wsKey) {
    //   case 'spotV4':
    //     return getPrivateSpotTopics().includes(topicName);

    //   case 'perpFuturesBTCV4':
    //   case 'perpFuturesUSDTV4':
    //   case 'deliveryFuturesBTCV4':
    //   case 'deliveryFuturesUSDTV4':
    //     return getPrivateFuturesTopics().includes(topicName);

    //   case 'optionsV4':
    //     return getPrivateOptionsTopics().includes(topicName);

    //   // No private announcements channels
    //   case 'announcementsV4':
    //     return false;

    //   default:
    //     throw neverGuard(wsKey, `Unhandled WsKey "${wsKey}"`);
    // }
  }

  /**
   * Not in use for Kraken
   */

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getWsMarketForWsKey(_wsKey: WsKey): WsMarket {
    return 'futures';
  }

  /**
   * Whether key represents a private connection. Feeds into automatic auth on connect.
   */
  protected getPrivateWSKeys(): WsKey[] {
    return [WS_KEY_MAP.spotPrivateV2, WS_KEY_MAP.spotBetaPrivateV2];
  }

  protected isAuthOnConnectWsKey(wsKey: WsKey): boolean {
    return this.getPrivateWSKeys().includes(wsKey);
  }

  /** Force subscription requests to be sent in smaller batches, if a number is returned */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getMaxTopicsPerSubscribeEvent(_wsKey: WsKey): number | null {
    return 1;
  }

  /**
   * @returns one or more correctly structured request events for performing a operations over WS. This can vary per exchange spec.
   */
  protected async getWsRequestEvents(
    wsKey: WsKey,
    operation: WsOperation,
    requests: WsTopicRequest<WSTopic>[],
  ): Promise<MidflightWsRequestEvent<WsRequestOperationKraken<string>>[]> {
    const wsRequestEvents: MidflightWsRequestEvent<
      WsRequestOperationKraken<WSTopic>
    >[] = [];
    const wsRequestBuildingErrors: unknown[] = [];

    // Previously used to track topics in a request. Keeping this for subscribe/unsubscribe requests, no need for incremental values

    for (const topicRequest of requests) {
      const req_id = this.getNewRequestId();
      const wsEvent: WsRequestOperationKraken<WSTopic> = {
        method: operation,
        params: {
          channel: topicRequest.topic,
          ...topicRequest.payload,
        },
        req_id: req_id,
      };

      if (this.options.authPrivateRequests) {
        switch (wsKey) {
          case WS_KEY_MAP.spotPrivateV2:
          case WS_KEY_MAP.spotBetaPrivateV2: {
            // Get token from REST client cache
            const tokenResult =
              await this.restClientCache.fetchSpotWebSocketToken(
                this.getRestClientOptions(),
                this.options.requestOptions,
              );

            if (!tokenResult?.token) {
              wsRequestBuildingErrors.push(
                new Error(
                  `No WS auth token could be retrieved for private spot WS request for topic "${topicRequest.topic}"`,
                ),
              );
              continue;
            }

            wsEvent.params.token = tokenResult.token;

            break;
          }
          case WS_KEY_MAP.spotPublicV2:
          case WS_KEY_MAP.spotBetaPublicV2: {
            // Public WS - no auth
            break;
          }

          default: {
            throw neverGuard(wsKey, `Unhandled WsKey "${wsKey}"`);
          }
        }
      }

      // Cache midflight subs on the req ID
      // Enrich response with subs for that req ID

      const midflightWsEvent: MidflightWsRequestEvent<
        WsRequestOperationKraken<WSTopic>
      > = {
        requestKey: wsEvent.req_id,
        requestEvent: wsEvent,
      };

      wsRequestEvents.push({
        ...midflightWsEvent,
      });
    }

    if (wsRequestBuildingErrors.length) {
      const label =
        wsRequestBuildingErrors.length === requests.length ? 'all' : 'some';

      this.logger.error(
        `Failed to build/send ${wsRequestBuildingErrors.length} event(s) for ${label} WS requests due to exceptions`,
        {
          ...WS_LOGGER_CATEGORY,
          wsRequestBuildingErrors,
          wsRequestBuildingErrorsStringified: JSON.stringify(
            wsRequestBuildingErrors,
            null,
            2,
          ),
        },
      );
    }

    return wsRequestEvents;
  }

  private async signMessage(
    paramsStr: string,
    secret: string,
    method: 'hex' | 'base64',
    algorithm: SignAlgorithm,
  ): Promise<string> {
    if (typeof this.options.customSignMessageFn === 'function') {
      return this.options.customSignMessageFn(paramsStr, secret);
    }
    return await signMessage(paramsStr, secret, method, algorithm);
  }

  protected async getWsAuthRequestEvent(
    wsKey: WsKey,
    eventToAuth?: WSAPIAuthenticationRequestFromServer,
  ): Promise<object | string | 'waitForEvent' | void> {
    // Send anything for WS API
    const isWSAPIWsKey = false;
    if (isWSAPIWsKey) {
      if (eventToAuth) {
        const eventToAuthAsString = JSON.stringify(eventToAuth);

        this.logger.trace(
          `getWsAuthRequestEvent(${wsKey}): responding to WS API auth handshake...`,
          {
            eventToAuth,
          },
        );

        const sessionInfo = await this.signMessage(
          eventToAuthAsString,
          this.options.apiSecret!,
          'base64',
          'SHA-256',
        );

        return sessionInfo;
      }

      // Don't send anything, don't resolve auth promise. Wait for auth handshake from server
      return 'waitForEvent';
    }

    try {
      switch (wsKey) {
        case WS_KEY_MAP.spotPrivateV2:
        case WS_KEY_MAP.spotBetaPrivateV2: {
          // Not needed here, handled automatically with request during subscribe
          this.logger.trace(
            `getWsAuthRequestEvent(${wsKey}): no auth request required for private WS...`,
          );

          return;
        }

        case WS_KEY_MAP.spotPublicV2:
        case WS_KEY_MAP.spotBetaPublicV2: {
          // Public WS - no auth
          this.logger.trace(
            `getWsAuthRequestEvent(${wsKey}): no auth required for public WS...`,
          );
          return;
        }

        default: {
          throw neverGuard(wsKey, `Unhandled WsKey "${wsKey}"`);
        }
      }
    } catch (e: any) {
      this.logger.error(
        `getWsAuthRequestEvent(${wsKey}): Exception preparing auth request: `,
        {
          wsKey,
          eventToAuth,
          exception: e,
          exceptionBody: e?.body,
          stack: e?.stack,
        },
      );

      throw e;
    }
  }

  /**
   *
   * @param requestEvent
   * @returns A signed updated WS API request object, ready to be sent
   */
  private async signWSAPIRequest<TRequestParams = object>(
    requestEvent: WSAPIRequest<TRequestParams>,
  ): Promise<WSAPIRequest<TRequestParams>> {
    if (!this.options.apiSecret) {
      throw new Error('API Secret missing');
    }

    // const payload = requestEvent.payload;

    // const toSign = [
    //   requestEvent.event,
    //   requestEvent.channel,
    //   JSON.stringify(payload.req_param),
    //   requestEvent.time,
    // ].join('\n');

    // const signEncoding: SignEncodeMethod = 'hex';
    // const signAlgoritm: SignAlgorithm = 'SHA-512';

    return {
      ...requestEvent,
    };
  }
}
