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
 * @author seungha
 */
export class CreateBrandRequestDto {
  /**
   * @member categoryId [카테고리 고유 Id] enum 타입 (12개 카테고리 중 하나), 필수 입력
   * @member name [브랜드 네임] 1자 이상 10자 이하, 한글/영문/숫자/공백 기입 가능, 엔터 및 특수문자 불가능
   * @member description [브랜드 한 줄 설명] 필수 값 이지만 빈 문자열 가능, 30자 이하, 한글/영문/숫자/공백 기입 가능, 엔터 및 특수문자 불가능
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
