import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class EmailDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)
  email: string;
}
