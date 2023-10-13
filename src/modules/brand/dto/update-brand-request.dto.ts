import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { BrandCategory } from '@src/common/constants/enum';

/**
 * 브랜드 수정 DTO
 * @property {number} categoryId 카테고리 고유번호
 * @property {string} name 브랜드명
 * @property {string} description 브랜드 설명
 */
export class UpdateBrandRequestDto {
  /**
  가능, 엔터 및 특수문자 불가능
   */
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
