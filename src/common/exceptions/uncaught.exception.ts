import { BaseException } from '@src/common/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';
import { UncaughtExceptionCodeEnum } from '@src/common/enums/exception.enum';

export class UncaughtException extends BaseException {
  constructor() {
    super(UncaughtExceptionCodeEnum.Uncaught, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
