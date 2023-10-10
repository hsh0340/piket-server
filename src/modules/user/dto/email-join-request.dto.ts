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
