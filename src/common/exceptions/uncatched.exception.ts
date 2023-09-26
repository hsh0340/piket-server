import { BaseException } from '@src/common/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';
import { UncatchedExceptionCodeEnum } from '@src/common/enums/exception.enum';

export class UnCatchedException extends BaseException {
  constructor() {
    super(
      UncatchedExceptionCodeEnum.UnCatched,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
