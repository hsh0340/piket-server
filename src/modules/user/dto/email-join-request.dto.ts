import {
  Equals,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Agreement, Sex } from '@src/common/constants/enum';

/**
 * @property {string} cellPhone 전화번호
 * @property {string} password 비밀번호
 * @property {string} email 이메일
 * @property {string} name 이름
 * @property {number} sex 성별
 * @property {1} tosAgree 이용약관 동의
 * @property {1} personalInfoAgree 개인정보 수집 동의
 * @property {1} ageLimitAgree 만 14세 이상 동의
 * @property {number} mailAgree 혜택 메일 수신 동의
 * @property {number} notificationAgree 서비스 알림 수신 동의
 */
export class EmailJoinRequestDto {
  @IsNotEmpty()
  @IsString()
  cellPhone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @Matches(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(5)
  name: string;

  @IsNotEmpty()
  @IsInt()
  @IsEnum(Sex)
  sex: number;

  @IsNotEmpty()
  @IsInt()
  @Equals(1)
  tosAgree: Agreement.ACCEPT;

  @IsNotEmpty()
  @IsInt()
  @Equals(1)
  personalInfoAgree: Agreement.ACCEPT;

  @IsNotEmpty()
  @IsInt()
  @Equals(1)
  ageLimitAgree: Agreement.ACCEPT;

  @IsNotEmpty()
  @IsInt()
  @IsEnum(Agreement)
  mailAgree: number;

  @IsNotEmpty()
  @IsInt()
  @IsEnum(Agreement)
  notificationAgree: number;
}
