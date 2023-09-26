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

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger('exception');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const res = exception instanceof BaseException ? exception : null;
    // const res = exception;
    const statusCode = (exception as HttpException).getStatus();
    const message = (exception as HttpException).message;

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
      // stack: exception.stack,
    };

    this.logger.error(log);

    response.status(statusCode).json(errorResponse);
  }
}
