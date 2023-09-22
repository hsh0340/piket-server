import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Agreement } from '@src/common/constants/enum';

export class EmailJoinRequestDto {
  @IsNotEmpty()
  @IsString()
  cellPhone: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  password: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(Agreement)
  sex: number;

  @IsNotEmpty()
  @IsEnum(Agreement)
  tosAgree: number;

  @IsNotEmpty()
  personalInfoAgree: number;

  @IsNotEmpty()
  ageLimitAgree: number;

  @IsNotEmpty()
  @IsEnum(Agreement)
  mailAgree: number;

  @IsNotEmpty()
  @IsEnum(Agreement)
  notificationAgree: number;
}
