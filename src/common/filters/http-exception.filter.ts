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

    const errorResponse = {
      isSuccess: false,
      errorCode: res.errorCode,
      httpStatusCode: res.statusCode,
      message,
    };

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
