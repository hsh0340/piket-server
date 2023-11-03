import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CampaignStatus } from '@src/common/constants/enum';
import { pageTransform } from '@src/common/functions/pagination.function';

export enum SortBy {
  LATEST = 'latest',
  DEADLINE = 'deadline',
  POPULAR = 'popular',
}

export enum SearchCategory {
  TITLE = 'title',
  CATEGORY = 'category',
  BRAND = 'brand',
}

export class GetCampaignsOfAdvertiserQueryDto {
  @IsOptional()
  @IsEnum(CampaignStatus)
  status: CampaignStatus;

  @IsOptional()
  @IsEnum(SortBy)
  sortBy: SortBy = SortBy.LATEST;

  @IsOptional()
  @IsEnum(SearchCategory)
  searchCategory: string;

  @IsOptional()
  @IsString()
  searchInput: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Transform(pageTransform)
  page = 0;
}
