import { IsNotEmpty, IsString } from 'class-validator';

/**
 * @property {string} email 이메일 로그인 하려는 유저의 이메일
 * @property {string} password 이메일 로그인 하려는 유저의 비밀번호
 */
export class EmailLoginRequestDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
