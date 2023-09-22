import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger('exception');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }

    const statusCode = (exception as HttpException).getStatus();
    const message = (exception as HttpException).message;

    const errorResponse = {
      status: statusCode,
      timestamp: new Date().toISOString(),
      errors: [
        {
          message: message,
        },
      ],
    };

    const log = {
      name: 'Http Exception',
      method: req.method,
      path: req.url,
      body: req.body,
      stack: exception.stack,
    };

    this.logger.error(log);

    res.status(statusCode).json(errorResponse);
  }
}
