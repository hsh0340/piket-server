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
  constructor() {
    super(RequestExceptionCodeEnum.PhoneExist, HttpStatus.BAD_REQUEST);
    this.message = '이미 존재하는 전화번호입니다.';
  }
}

export class EmailExistException extends BaseException {
  constructor() {
    super(RequestExceptionCodeEnum.EmailExist, HttpStatus.BAD_REQUEST);
    this.message = '이미 존재하는 이메일입니다.';
  }
}

export class UserNotFoundException extends BaseException {
  constructor() {
    super(RequestExceptionCodeEnum.UserNotFound, HttpStatus.BAD_REQUEST);
    this.message = '이 이메일로 가입된 사용자가 없습니다.';
  }
}

export class PasswordMismatchException extends BaseException {
  constructor() {
    super(RequestExceptionCodeEnum.PasswordMismatch, HttpStatus.BAD_REQUEST);
    this.message = '이메일과 비밀번호가 일치하지 않습니다.';
  }
}

export class PasswordNotUpdatedException extends BaseException {
  constructor() {
    super(
      RequestExceptionCodeEnum.PasswordNotUpdated,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    this.message = '이메일과 비밀번호가 일치하지 않습니다.';
  }
}

export class MailNotSentException extends BaseException {
  constructor() {
    super(
      RequestExceptionCodeEnum.MailNotSent,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    this.message = '메일이 전송되지 않았습니다.';
  }
}