import { BaseException } from '@src/common/exceptions/base.exception';
import { RequestExceptionCodeEnum } from '@src/common/enums/exception.enum';
import { HttpStatus } from '@nestjs/common';

export class InvalidRequestException extends BaseException {
  constructor(message: string) {
    super(RequestExceptionCodeEnum.InvalidRequest, HttpStatus.BAD_REQUEST);
    this.message = message;
  }
}

export class PhoneExistException extends BaseException {
  constructor(message: string) {
    super(RequestExceptionCodeEnum.PhoneExist, HttpStatus.BAD_REQUEST);
    this.message = message;
  }
}

export class EmailExistException extends BaseException {
  constructor(message: string) {
    super(RequestExceptionCodeEnum.EmailExist, HttpStatus.BAD_REQUEST);
    this.message = message;
  }
}

export class UserNotFoundException extends BaseException {
  constructor(message: string) {
    super(RequestExceptionCodeEnum.UserNotFound, HttpStatus.BAD_REQUEST);
    this.message = message;
  }
}

export class PasswordMismatchException extends BaseException {
  constructor(message: string) {
    super(RequestExceptionCodeEnum.PasswordMismatch, HttpStatus.BAD_REQUEST);
    this.message = message;
  }
}
