export enum RequestExceptionCodeEnum {
  // 유효성 검사에 실패하였습니다.
  InvalidRequest = '2000',

  // 이미 존재하는 전화번호입니다.
  PhoneExist = '3000',
  // 이미 존재하는 이메일입니다.
  EmailExist = '3001',
  // 이 이메일로 가입된 사용자가 없습니다.
  UserNotFound = '3002',
  // 비밀번호가 일치하지 않습니다.
  PasswordMismatch = '3003',
}

export enum UncatchedExceptionCodeEnum {
  // 애플리케이션 레벨에서 처리하지 못한 에러
  UnCatched = '9999',
}
