export interface SuccessResponse<T> {
  isSuccess: true;
  code: 200;
  message: string;
  result: T;
}

interface FailureResponse<T> {
  isSuccess: false;
  code: number;
  message: string;
  result: T;
}
