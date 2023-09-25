export class SuccessResponseDto<T> {
  isSuccess: true;
  code: 200;
  message: string;
  result: T;
}

export class FailureResponseDto<T> {
  isSuccess: false;
  code: number;
  message: string;
  result: T;
}
