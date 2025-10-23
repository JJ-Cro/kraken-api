export type APISuccessResponse<TData> = {
  result: 'success';
  serverTime: string;
} & TData;

export interface APIErrorResponse {
  msg: string;
  code: string;
}

export type APIResponse<TData> = APISuccessResponse<TData> | APIErrorResponse;

export interface ServiceStatus {
  msg: string;
  status: 'cancelonly' | 'close' | 'open';
}
