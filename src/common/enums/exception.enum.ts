export enum RequestExceptionCodeEnum {
  // 유효성 검사에 실패하였습니다.
  InvalidRequest = '2000',

  // 이미 존재하는 전화번호입니다. : 3000
  PhoneExist = '3000',
  // 이미 존재하는 이메일입니다. : 3001
  EmailExist = '3001',
  // 이 이메일로 가입된 사용자가 없습니다. : 3002
  UserNotFound = '3002',
  // 비밀번호가 일치하지 않습니다. : 3003
  PasswordMismatch = '3003',
  // 비밀번호가 업데이트 되지 않았습니다. : 3004
  PasswordNotUpdated = '3004',
  // 메일이 전송되지 않았습니다. : 3005
  MailNotSent = '3005',
  // 존재하지 않는 유저 번호입니다. : 3006
  UserNoNotFound = '3006',
  // 임시 비밀번호가 틀렸습니다. : 3007
  TempPasswordIncorrect = '3007',
  // 유저 생성에 실패하였습니다. : 3008
  UserNotCreated = '3008',
  // 이미 존재하는 브랜드입니다. : 3010
  BrandExists = '3010',
  // 존재하지 않는 카테고리입니다. : 3011
  CategoryNotFound = '3011',
  // 브랜드가 생성에 실패하였습니다. : 3012
  BrandNotCreated = '3012',
  // 브랜드 목록 조회에 실패하였습니다. : 3013
  BrandsNotFound = '3013',
  // 브랜드가 존재하지 않습니다. : 3014
  BrandNotExists = '3014',
  // 업데이트된 브랜드 정보가 없습니다. : 3015
  NoBrandInfoUpdated = '3015',
  // 브랜드 업데이트에 실패하였습니다. : 3016
  BrandNotUpdated = '3016',
  // 진행채널과 모집조건이 유효하지 않습니다. : 3020
  ChannelConditionMismatch = '3020',
  // 캠페인 생성에 실패하였습니다. : 3021
  CampaignNotCreated = '3021',
  // S3에 파일 업로드를 실패하였습니다. : 3022
  S3NotUploaded = '3022',
}

export enum UncaughtExceptionCodeEnum {
  // 애플리케이션 레벨에서 처리하지 못한 에러
  Uncaught = '9999',
}
