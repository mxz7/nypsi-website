type ApiErrorResult = {
  ok: false;
  status: number;
  message: string;
};

type ApiOkResult<T> = {
  ok: true;
} & T;

type ApiResult<T> = ApiErrorResult | ApiOkResult<T>;
