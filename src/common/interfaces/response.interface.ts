export interface SuccessResponse<T> {
  isSuccess: true;
  code: 1000;
  httpStatusCode: 200;
  message: string;
  result: T;
}
