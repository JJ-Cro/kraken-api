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
