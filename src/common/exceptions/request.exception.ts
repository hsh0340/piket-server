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
    this.message = '비밀번호가 업데이트 되지 않았습니다.';
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

export class UserNoNotFoundException extends BaseException {
  constructor() {
    super(RequestExceptionCodeEnum.UserNoNotFound, HttpStatus.BAD_REQUEST);
    this.message = '존재하지 않는 유저 번호입니다.';
  }
}

export class TempPasswordIncorrectException extends BaseException {
  constructor() {
    super(
      RequestExceptionCodeEnum.TempPasswordIncorrect,
      HttpStatus.BAD_REQUEST,
    );
    this.message = '임시 비밀번호가 틀렸습니다.';
  }
}

export class UserNotCreatedException extends BaseException {
  constructor() {
    super(
      RequestExceptionCodeEnum.UserNotCreated,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    this.message = '유저 생성에 실패하였습니다.';
  }
}

export class BrandExistsException extends BaseException {
  constructor() {
    super(RequestExceptionCodeEnum.BrandExists, HttpStatus.BAD_REQUEST);
    this.message = '이미 존재하는 브랜드입니다.';
  }
}

export class CategoryNotFoundException extends BaseException {
  constructor() {
    super(RequestExceptionCodeEnum.CategoryNotFound, HttpStatus.BAD_REQUEST);
    this.message = '존재하지 않는 카테고리입니다.';
  }
}

export class BrandNotCreatedException extends BaseException {
  constructor() {
    super(
      RequestExceptionCodeEnum.BrandNotCreated,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    this.message = '브랜드 생성에 실패하였습니다.';
  }
}

export class BrandsNotFoundException extends BaseException {
  constructor() {
    super(
      RequestExceptionCodeEnum.BrandsNotFound,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    this.message = '브랜드 목록 조회에 실패하였습니다.';
  }
}

export class BrandNotExistsException extends BaseException {
  constructor() {
    super(RequestExceptionCodeEnum.BrandNotExists, HttpStatus.BAD_REQUEST);
    this.message = '브랜드가 존재하지 않습니다.';
  }
}

export class NoBrandInfoUpdatedException extends BaseException {
  constructor() {
    super(RequestExceptionCodeEnum.NoBrandInfoUpdated, HttpStatus.BAD_REQUEST);
    this.message = '업데이트된 브랜드 정보가 없습니다.';
  }
}

export class BrandNotUpdatedException extends BaseException {
  constructor() {
    super(
      RequestExceptionCodeEnum.BrandNotUpdated,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    this.message = '브랜드 업데이트에 실패하였습니다.';
  }
}

export class ChannelConditionMismatchException extends BaseException {
  constructor() {
    super(
      RequestExceptionCodeEnum.ChannelConditionMismatch,
      HttpStatus.BAD_REQUEST,
    );
    this.message = '진행채널과 모집조건이 유효하지 않습니다.';
  }
}

export class CampaignNotCreatedException extends BaseException {
  constructor() {
    super(
      RequestExceptionCodeEnum.CampaignNotCreated,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    this.message = '캠페인 생성에 실패하였습니다.';
  }
}

export class S3NotUploadedException extends BaseException {
  constructor() {
    super(
      RequestExceptionCodeEnum.S3NotUploaded,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    this.message = 'S3에 파일 업로드를 실패하였습니다.';
  }
}
