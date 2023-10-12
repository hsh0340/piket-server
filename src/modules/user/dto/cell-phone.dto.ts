import { IsNotEmpty, IsString } from 'class-validator';

/**
 * @property {string} cellPhone 휴대폰 번호
 */
export class CellPhoneDto {
  @IsNotEmpty()
  @IsString()
  cellPhone: string;
}
