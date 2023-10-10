import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { BrandCategory } from '@src/common/constants/enum';

export class CreateBrandRequestDto {
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
