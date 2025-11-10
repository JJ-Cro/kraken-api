/**
 * Used to switch how authentication/requests work under the hood
 */
export const REST_CLIENT_TYPE_ENUM = {
  /** Spot */
  main: 'main',
  /** Futures */
  derivatives: 'derivatives',
  /** Institutional */
  institutional: 'institutional',
  /** Partner */
  partner: 'partner',
} as const;

export type RestClientType =
  (typeof REST_CLIENT_TYPE_ENUM)[keyof typeof REST_CLIENT_TYPE_ENUM];

const krakenURLMap = {
  [REST_CLIENT_TYPE_ENUM.main]: 'https://api.kraken.com',
  [REST_CLIENT_TYPE_ENUM.derivatives]: 'https://futures.kraken.com',
  [REST_CLIENT_TYPE_ENUM.institutional]: 'https://api.kraken.com',
  [REST_CLIENT_TYPE_ENUM.partner]: 'https://embed.kraken.com',
} as const;

export interface RestClientOptions {
  /** Your API key */
  apiKey?: string;

  /** Your API secret */
  apiSecret?: string;

  /** Your API passphrase (can be anything) that you set when creating this API key (NOT your account password) */
  apiPassphrase?: string;

  /**
   * Use access token instead of sign, if this is provided.
   * For guidance refer to: https://github.com/tiagosiebler/kucoin-api/issues/2
   */
  apiAccessToken?: string;

  /** The API key version. Defaults to "2" right now. You can see this in your API management page */
  apiKeyVersion?: number | string;

  /** Default: false. If true, we'll throw errors if any params are undefined */
  strictParamValidation?: boolean;

  /**
   * Optionally override API protocol + domain
   * e.g baseUrl: 'https://api.kucoin.com'
   **/
  baseUrl?: string;

  /** Default: true. whether to try and post-process request exceptions (and throw them). */
  parseExceptions?: boolean;

  customTimestampFn?: () => number;

  /**
   * Enable keep alive for REST API requests (via axios).
   */
  keepAlive?: boolean;

  /**
   * When using HTTP KeepAlive, how often to send TCP KeepAlive packets over sockets being kept alive. Default = 1000.
   * Only relevant if keepAlive is set to true.
   * Default: 1000 (defaults comes from https agent)
   */
  keepAliveMsecs?: number;

  /**
   * Allows you to provide a custom "signMessage" function, e.g. to use node's much faster createHmac method
   *
   * Look in the examples folder for a demonstration on using node's createHmac instead.
   */
  customSignMessageFn?: (message: string, secret: string) => Promise<string>;
}

export function serializeParams<T extends Record<string, any> | undefined = {}>(
  params: T,
  strict_validation: boolean | undefined,
  encodeValues: boolean,
  prefixWith: string,
  repeatArrayValuesAsKVPairs: boolean,
): string {
  if (!params) {
    return '';
  }

  const queryString = Object.keys(params)
    .sort()
    .map((key) => {
      const value = params[key];
      if (strict_validation === true && typeof value === 'undefined') {
        throw new Error(
          'Failed to sign API request due to undefined parameter',
        );
      }

      if (repeatArrayValuesAsKVPairs && Array.isArray(value)) {
        const values = value.map((subValue) => {
          const encodedValue = encodeValues
            ? encodeURIComponent(subValue)
            : subValue;
          return `${key}=${encodedValue}`;
        });

        return values.join('&');
      }
      const encodedValue = encodeValues ? encodeURIComponent(value) : value;
      return `${key}=${encodedValue}`;
    })
    .join('&');

  // Only prefix if there's a value
  return queryString ? prefixWith + queryString : queryString;
}

export const APIIDMainKey = 'broker';
export const APIIDMain = 'AA56 N84G TOOP ELJQ';

export function isEmptyObject(obj: any) {
  if (!obj || typeof obj !== 'object') {
    return true;
  }
  for (const _i in obj) {
    return false;
  }
  return true;
}

export function getRestBaseUrl(
  useTestnet: boolean,
  restInverseOptions: RestClientOptions,
  restClientType: RestClientType,
): string {
  const exchangeBaseUrls = {
    livenet: krakenURLMap[restClientType],
    testnet: 'https://noTestnet',
  };

  if (restInverseOptions.baseUrl) {
    return restInverseOptions.baseUrl;
  }

  if (useTestnet) {
    return exchangeBaseUrls.testnet;
  }

  return exchangeBaseUrls.livenet;
}
