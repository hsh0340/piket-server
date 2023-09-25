import { HttpException } from '@nestjs/common';

export class BaseException extends HttpException {
  constructor(errorCode: string, statusCode: number) {
    super(errorCode, statusCode);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }

  errorCode: string;
  statusCode: number;
  timestamp: string;
  path: string;
}
