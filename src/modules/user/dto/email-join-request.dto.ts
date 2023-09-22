import { IsEnum, IsNotEmpty, IsString, Matches } from "class-validator";

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
  sex: number;

  @IsNotEmpty()
  tosAgree: number;

  @IsNotEmpty()
  personalInfoAgree: number;

  @IsNotEmpty()
  ageLimitAgree: number;

  @IsNotEmpty()
  mailAgree: number;

  @IsNotEmpty()
  notificationAgree: number;
}
