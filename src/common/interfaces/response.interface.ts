export interface SuccessResponse<T> {
  isSuccess: true;
  code: '1000';
  message: string;
  result: T;
}
