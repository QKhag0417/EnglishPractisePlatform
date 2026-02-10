export type ApiResult<T> = {
  ok: boolean;
  data: T | null;
  message: string;
  apiStatus?: string;
  httpStatus?: number;
  url: string;
};
