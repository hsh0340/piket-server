import { BaseException } from '@src/common/exceptions/base.exception';
import { RequestExceptionCodeEnum } from '@src/common/enums/exception.enum';
import { HttpStatus } from '@nestjs/common';

export class InvalidRequestException extends BaseException {
  constructor(message: string) {
    super(RequestExceptionCodeEnum.InvalidRequest, HttpStatus.BAD_REQUEST);
    this.message = message;
  }
}
