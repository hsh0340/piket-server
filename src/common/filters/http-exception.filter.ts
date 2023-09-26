import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { BaseException } from '@src/common/exceptions/base.exception';
import { UnCatchedException } from '@src/common/exceptions/uncatched.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger('exception');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const res =
      exception instanceof BaseException ? exception : new UnCatchedException();
    // const statusCode = (exception as BaseException).getStatus();
    const message = (exception as BaseException).message;

    let errorResponse;
    if (res.errorCode === '9999') {
      errorResponse = {
        isSuccess: false,
        errorCode: res.errorCode,
        httpStatusCode: res.statusCode,
        message: `[예외처리 되지 않은 에러입니다. 관리자에게 문의해주세요.] ${message}`,
      };
    } else {
      errorResponse = {
        isSuccess: false,
        errorCode: res.errorCode,
        httpStatusCode: res.statusCode,
        message: `${message}`,
      };
    }

    const log = {
      name: 'Http Exception',
      method: request.method,
      path: request.url,
      body: request.body,
      message,
    };

    this.logger.error(log);

    response.status(res.statusCode).json(errorResponse);
  }
}
