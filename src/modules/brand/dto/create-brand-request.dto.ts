import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { BrandCategory } from '@src/common/constants/enum';

/**
 * 브랜드 생성 DTO
 * @property {number} categoryId 카테고리 고유 Id
 * @property {string} name 브랜드 네임
 * @property {string} description 브랜드 한 줄 설명
 */
export class CreateBrandRequestDto {
  @IsNotEmpty()
  @IsEnum(BrandCategory)
  categoryId: number;

  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9가-힣 ]*$/)
  @MaxLength(10)
  name: string;

  @IsString()
  @Matches(/^[a-zA-Z0-9가-힣 ]*$/)
  @MaxLength(30)
  description: string;
}
