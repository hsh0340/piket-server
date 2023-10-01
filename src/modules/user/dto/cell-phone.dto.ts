import { IsNotEmpty, IsString } from 'class-validator';

export class CellPhoneDto {
  @IsNotEmpty()
  @IsString()
  cellPhone: string;
}
