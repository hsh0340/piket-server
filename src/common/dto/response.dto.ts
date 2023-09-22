export class ResponseDto<T> {
  isSuccess: boolean;
  code: number;
  message: string;
  result: T;
}
