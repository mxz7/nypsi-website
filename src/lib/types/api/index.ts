export type ApiErrorResult = {
  ok: false;
  status: number;
  message: string;
};

export type ApiOkResult<T> = {
  ok: true;
} & T;

export type ApiResult<T> = ApiErrorResult | ApiOkResult<T>;
