import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import https from 'https';

import { neverGuard } from './misc-util.js';
import {
  APIIDMain,
  APIIDMainKey,
  getRestBaseUrl,
  RestClientOptions,
  RestClientType,
  serializeParams,
} from './requestUtils.js';
import {
  checkWebCryptoAPISupported,
  hashMessage,
  SignAlgorithm,
  SignEncodeMethod,
  signMessage,
} from './webCryptoAPI.js';

const MISSING_API_KEYS_ERROR =
  'API Key & Secret are BOTH required to use the authenticated REST client';

const rawTrace = false;

interface SignedRequest<T extends object | undefined = {}> {
  originalParams: T;
  paramsWithSign?: T & { sign: string };
  requestData?: object;
  serializedParams: string;
  sign: string;
  queryParamsWithSign: string;
  timestamp: number;
  recvWindow: number;
}

interface UnsignedRequest<T extends object | undefined = {}> {
  originalParams: T;
  paramsWithSign: T;
}

type SignMethod = 'kraken';

/**
 * Some requests require some params to be in the query string and some in the body. Some even support passing params via headers.
 * This type anticipates these are possible in any combination.
 *
 * The request builder will automatically handle where parameters should go.
 */
type ParamsInQueryBodyOrHeader = {
  query?: object;
  body?: object;
  headers?: object;
};

const ENABLE_HTTP_TRACE =
  typeof process === 'object' &&
  typeof process.env === 'object' &&
  process.env.KUCOINTRACE;

if (ENABLE_HTTP_TRACE) {
  axios.interceptors.request.use((request) => {
    console.log(
      new Date(),
      'Starting Request',
      JSON.stringify(
        {
          url: request.url,
          method: request.method,
          params: request.params,
          data: request.data,
        },
        null,
        2,
      ),
    );
    return request;
  });
  axios.interceptors.response.use((response) => {
    console.log(new Date(), 'Response:', {
      // request: {
      //   url: response.config.url,
      //   method: response.config.method,
      //   data: response.config.data,
      //   headers: response.config.headers,
      // },
      response: {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: JSON.stringify(response.data, null, 2),
      },
    });
    return response;
  });
}

/**
 * Impure, mutates params to remove any values that have a key but are undefined.
 */
function deleteUndefinedValues(params?: any): void {
  if (!params) {
    return;
  }

  for (const key in params) {
    const value = params[key];
    if (typeof value === 'undefined') {
      delete params[key];
    }
  }
}

export abstract class BaseRestClient {
  private options: RestClientOptions;

  private baseUrl: string;

  private globalRequestOptions: AxiosRequestConfig;

  private apiKey: string | undefined;

  private apiSecret: string | undefined;

  private apiAccessToken: string | undefined;

  // A unique incrementing nonce
  private apiRequestNonce: number = Date.now();

  /** Defines the client type (affecting how requests & signatures behave) */
  abstract getClientType(): RestClientType;

  /**
   * Create an instance of the REST client. Pass API credentials in the object in the first parameter.
   * @param {RestClientOptions} [restClientOptions={}] options to configure REST API connectivity
   * @param {AxiosRequestConfig} [networkOptions={}] HTTP networking options for axios
   */
  constructor(
    restClientOptions: RestClientOptions = {},
    networkOptions: AxiosRequestConfig = {},
  ) {
    this.options = {
      /** Throw errors if any request params are empty */
      strictParamValidation: false,
      apiKeyVersion: 2,
      ...restClientOptions,
    };

    this.globalRequestOptions = {
      /** in ms == 5 minutes by default */
      timeout: 1000 * 60 * 5,
      /** inject custom rquest options based on axios specs - see axios docs for more guidance on AxiosRequestConfig: https://github.com/axios/axios#request-config */
      ...networkOptions,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        UserAgent: '@siebly/kraken-api',
        locale: 'en-US',
      },
    };

    // If enabled, configure a https agent with keepAlive enabled
    if (this.options.keepAlive) {
      // Extract existing https agent parameters, if provided, to prevent the keepAlive flag from overwriting an existing https agent completely
      const existingHttpsAgent = this.globalRequestOptions.httpsAgent as
        | https.Agent
        | undefined;
      const existingAgentOptions = existingHttpsAgent?.options || {};

      // For more advanced configuration, raise an issue on GitHub or use the "networkOptions"
      // parameter to define a custom httpsAgent with the desired properties
      this.globalRequestOptions.httpsAgent = new https.Agent({
        ...existingAgentOptions,
        keepAlive: true,
        keepAliveMsecs: this.options.keepAliveMsecs,
      });
    }

    this.baseUrl = getRestBaseUrl(
      false,
      restClientOptions,
      this.getClientType(),
    );

    this.apiKey = this.options.apiKey;
    this.apiSecret = this.options.apiSecret;
    this.apiAccessToken = this.options.apiAccessToken;

    // Check Web Crypto API support when credentials are provided
    if (this.apiKey && this.apiSecret) {
      checkWebCryptoAPISupported();
    }

    // Throw if one of the 3 values is missing, but at least one of them is set
    const credentials = [this.apiKey, this.apiSecret];
    if (
      credentials.includes(undefined) &&
      credentials.some((v) => typeof v === 'string')
    ) {
      throw new Error(MISSING_API_KEYS_ERROR);
    }
  }

  /**
   * Generates a timestamp for signing API requests.
   *
   * This method can be overridden or customized using `customTimestampFn`
   * to implement a custom timestamp synchronization mechanism.
   * If no custom function is provided, it defaults to the current system time.
   */
  private getSignTimestampMs(): number {
    if (typeof this.options.customTimestampFn === 'function') {
      return this.options.customTimestampFn();
    }
    return Date.now();
  }

  private getNextRequestNonce(): string {
    return String(this.apiRequestNonce++);
  }

  private hasValidCredentials() {
    const hasAllAPICredentials = this.apiKey && this.apiSecret;

    return this.hasAccessToken() || hasAllAPICredentials;
  }

  setAccessToken(newAccessToken: string) {
    this.apiAccessToken = newAccessToken;
  }

  hasAccessToken(): boolean {
    return !!this.apiAccessToken;
  }

  protected get(endpoint: string, params?: object) {
    const isPublicAPI = true;
    // GET only supports params in the query string
    return this._call('GET', endpoint, { query: params }, isPublicAPI);
  }

  protected post(endpoint: string, params?: ParamsInQueryBodyOrHeader) {
    const isPublicAPI = true;
    return this._call('POST', endpoint, params, isPublicAPI);
  }

  protected getPrivate(endpoint: string, params?: object) {
    const isPublicAPI = false;
    // GET only supports params in the query string
    return this._call('GET', endpoint, { query: params }, isPublicAPI);
  }

  protected postPrivate(endpoint: string, params?: ParamsInQueryBodyOrHeader) {
    const isPublicAPI = false;
    return this._call('POST', endpoint, params, isPublicAPI);
  }

  protected deletePrivate(
    endpoint: string,
    params?: ParamsInQueryBodyOrHeader,
  ) {
    const isPublicAPI = false;
    return this._call('DELETE', endpoint, params, isPublicAPI);
  }

  protected putPrivate(endpoint: string, params?: ParamsInQueryBodyOrHeader) {
    const isPublicAPI = false;
    return this._call('PUT', endpoint, params, isPublicAPI);
  }

  // protected patchPrivate(endpoint: string, params?: any) {
  protected patchPrivate(endpoint: string, params?: ParamsInQueryBodyOrHeader) {
    const isPublicAPI = false;
    return this._call('PATCH', endpoint, params, isPublicAPI);
  }

  /**
   * @private Make a HTTP request to a specific endpoint. Private endpoint API calls are automatically signed.
   */
  private async _call(
    method: Method,
    endpoint: string,
    params?: ParamsInQueryBodyOrHeader,
    isPublicApi?: boolean,
  ): Promise<any> {
    const path = endpoint.startsWith('/') ? endpoint : '/' + endpoint;

    // Sanity check to make sure it's only ever prefixed by one forward slash
    const requestUrl = this.baseUrl + path;

    // Build a request and handle signature process
    const options = await this.buildRequest(
      method,
      path,
      requestUrl,
      params,
      isPublicApi,
    );

    if (ENABLE_HTTP_TRACE || rawTrace) {
      console.log('full request: ', { options });
    }

    // Dispatch request
    return axios(options)
      .then((response) => {
        if (response.status == 200) {
          // Throw if API returns an error (e.g. insufficient balance)
          if (
            typeof response.data?.code === 'string' &&
            response.data?.code !== '200000'
          ) {
            throw { response };
          }

          return response.data;
        }
        throw { response };
      })
      .catch((e) =>
        this.parseException(e, { method, endpoint, path, requestUrl, params }),
      );
  }

  /**
   * @private generic handler to parse request exceptions
   */
  parseException(e: any, requestParams: any): unknown {
    if (this.options.parseExceptions === false) {
      throw e;
    }

    // Something happened in setting up the request that triggered an error
    if (!e.response) {
      if (!e.request) {
        throw e.message;
      }

      // request made but no response received
      throw e;
    }

    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const response: AxiosResponse = e.response;
    // console.error('err: ', response?.data);

    throw {
      code: response.status,
      message: response.statusText,
      body: response.data,
      headers: response.headers,
      requestOptions: {
        ...this.options,
        // Prevent credentials from leaking into error messages
        apiKey: 'omittedFromError',
        apiSecret: 'omittedFromError',
        apiPassphrase: 'omittedFromError',
      },
      requestParams,
    };
  }

  private async signMessage(
    paramsStr: string,
    secret: string,
    method: SignEncodeMethod,
    algorithm: SignAlgorithm,
  ): Promise<string> {
    if (typeof this.options.customSignMessageFn === 'function') {
      return this.options.customSignMessageFn(paramsStr, secret);
    }
    return await signMessage(paramsStr, secret, method, algorithm);
  }

  /**
   * @private sign request and set recv window
   */
  private async signRequest<
    T extends ParamsInQueryBodyOrHeader | undefined = {},
  >(
    data: T,
    endpoint: string,
    method: Method,
    signMethod: SignMethod,
  ): Promise<SignedRequest<T>> {
    const timestamp = this.getSignTimestampMs();

    const requestBody = data?.body || data?.query || data;
    const res: SignedRequest<T> = {
      originalParams: { ...data },
      requestData: requestBody
        ? Array.isArray(requestBody)
          ? requestBody.map((p) => ({ ...p, [APIIDMainKey]: APIIDMain }))
          : { ...requestBody, [APIIDMainKey]: APIIDMain }
        : undefined,
      sign: '',
      timestamp,
      recvWindow: 0,
      serializedParams: '',
      queryParamsWithSign: '',
    };

    if (!this.hasValidCredentials()) {
      return res;
    }

    const strictParamValidation = this.options.strictParamValidation;
    const encodeQueryStringValues = true;

    if (signMethod === 'kraken') {
      // const signRequestParams =
      //   method === 'GET' || method === 'DELETE'
      //     ? serializeParams(
      //         data,
      //         strictParamValidation,
      //         encodeQueryStringValues,
      //         '', // Don't prefix with ? as part of sign. Prefix after sign
      //       )
      //     : JSON.stringify(data) || '';

      const signRequestParams = serializeParams(
        method === 'POST' ? res.requestData : requestBody,
        strictParamValidation,
        encodeQueryStringValues,
        '', // Don't prefix with ? as part of sign. Prefix after sign
      );

      const clientType = this.getClientType();

      switch (clientType) {
        case 'futures': {
          const signEndpoint = endpoint.replace('/derivatives', '');

          const nonce = this.getNextRequestNonce();
          const signInput = `${signRequestParams}${nonce}${signEndpoint}`;

          // Only sign when no access token is provided
          if (!this.hasAccessToken()) {
            const signMessageInput = await hashMessage(
              signInput,
              'binary',
              'SHA-256',
            );

            // node:crypto equivalent
            // const sign = createHmac(
            //   'sha512',
            //   Buffer.from(this.apiSecret!, 'base64'),
            // )
            //   .update(signMessage, 'binary')
            //   .digest('base64');

            const sign = await signMessage(
              signMessageInput,
              this.apiSecret!,
              'base64',
              'SHA-512',
              {
                isSecretB64Encoded: true,
                isInputBinaryString: true,
              },
            );

            if (rawTrace || true) {
              console.clear();
              console.log('getSignature: ', {
                data,
                signInput,
                privateKey: this.apiSecret,
                method,
                path: endpoint,
                query: data,
                body: data,
              });
            }

            res.sign = sign;
          }

          res.queryParamsWithSign = signRequestParams;

          break;
        }
        case 'main': {
          // todo:
          break;
        }
      }
      return res;
    }

    console.error(
      new Date(),
      neverGuard(signMethod, `Unhandled sign method: "${signMethod}"`),
    );

    return res;
  }

  private async prepareSignParams<TParams extends object | undefined>(
    method: Method,
    endpoint: string,
    signMethod: SignMethod,
    params?: TParams,
    isPublicApi?: true,
  ): Promise<UnsignedRequest<TParams>>;

  private async prepareSignParams<TParams extends object | undefined>(
    method: Method,
    endpoint: string,
    signMethod: SignMethod,
    params?: TParams,
    isPublicApi?: false | undefined,
  ): Promise<SignedRequest<TParams>>;

  private async prepareSignParams<TParams extends object | undefined>(
    method: Method,
    endpoint: string,
    signMethod: SignMethod,
    params?: TParams,
    isPublicApi?: boolean,
  ) {
    if (isPublicApi) {
      return {
        originalParams: params,
        paramsWithSign: params,
      };
    }

    if (!this.hasValidCredentials()) {
      throw new Error(MISSING_API_KEYS_ERROR);
    }

    return this.signRequest(params, endpoint, method, signMethod);
  }

  /** Returns an axios request object. Handles signing process automatically if this is a private API call */
  private async buildRequest(
    method: Method,
    endpoint: string,
    url: string,
    params?: ParamsInQueryBodyOrHeader,
    isPublicApi?: boolean,
  ): Promise<AxiosRequestConfig> {
    const options: AxiosRequestConfig = {
      ...this.globalRequestOptions,
      url: url,
      method: method,
      headers: {
        ...params?.headers,
        ...this.globalRequestOptions.headers,
      },
    };

    deleteUndefinedValues(params);
    deleteUndefinedValues(params?.body);
    deleteUndefinedValues(params?.query);
    deleteUndefinedValues(params?.headers);

    if (isPublicApi || !this.apiKey || !this.apiSecret) {
      return {
        ...options,
        params: params?.query || params?.body || params,
      };
    }

    const signResult = await this.prepareSignParams(
      method,
      endpoint,
      'kraken',
      params,
      isPublicApi,
    );

    // TODO: this is for futures, is this any diff for spot?
    const authHeaders = {
      APIKey: this.apiKey,
      // Nonce: 1,// Optional: enable "useNonce" to enable. TODO:
    };

    let signHeaders: Record<string, string> = {};

    // Support for Authorization header, if provided:
    // https://github.com/tiagosiebler/kucoin-api/issues/2
    // Use restClient.setAccessToken(newToken), if you need to store a new access token
    // Not supported for Kraken at this time
    if (this.apiAccessToken) {
      signHeaders = {
        Authorization: this.apiAccessToken,
      };
    } else {
      signHeaders = {
        Authent: signResult.sign,
      };
    }

    const queryParams = signResult.queryParamsWithSign
      ? '?' + signResult.queryParamsWithSign
      : '';

    const urlWithQueryParams = options.url + queryParams;

    if (rawTrace)
      console.log('merged headers: ', {
        options,
        headers: {
          ...authHeaders,
          ...options.headers,
          ...signHeaders,
        },
        url: urlWithQueryParams,
        data: params,
      });

    if (method === 'GET' || !params?.body) {
      return {
        ...options,
        headers: {
          ...authHeaders,
          ...options.headers,
          ...signHeaders,
        },
        url: urlWithQueryParams,
      };
    }

    return {
      ...options,
      headers: {
        ...authHeaders,
        ...options.headers,
        ...signHeaders,
      },
      url: urlWithQueryParams,
      // data: signResult.requestData,
    };
  }
}
