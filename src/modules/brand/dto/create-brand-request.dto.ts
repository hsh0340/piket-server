import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
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
   * @member name [브랜드 네임] 1자 이상 10자 이하, 한글/영문 기입 가능, 특수문자 불가능
   * @member description [브랜드 한 줄 설명] 필수 값 아님, 30자 이하, 띄어쓰기 외 엔터 및 특수문자 불가
   */
  @IsNotEmpty()
  @IsEnum(BrandCategory)
  categoryId: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  name: string;

  @IsOptional()
  @MaxLength(30)
  description?: string;
}
