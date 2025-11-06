import { RestClientOptions } from '../../lib/requestUtils';

export type APISuccessResponse<TData> = {
  result: 'success';
  serverTime: string;
} & TData;

export interface APIErrorResponse {
  // e.g. [{ code: 11; message: 'UUID string too large' }]
  errors: { code: number; message: string }[];
  result: 'error';
  serverTime: string;
  status: 'BAD_REQUEST' | string;
}

export type APIResponse<TData> = APISuccessResponse<TData> | APIErrorResponse;

export type SpotAPISuccessResponse<TData> = {
  error: string[];
  result: TData;
};

export interface SpotAPIErrorResponse {
  // e.g.{ error: [ 'EGeneral:Invalid arguments:ordertype' ] },
  error: string[];
}

export type SpotAPIResponse<TData> =
  | SpotAPISuccessResponse<TData>
  | SpotAPIErrorResponse;

export interface GenericAPIError<TBody = any> {
  code: number;
  message: string;
  body: TBody;
  headers: Record<string, string>;
  requestOptions: RestClientOptions;
  requestParams: Record<string, any>;
}
