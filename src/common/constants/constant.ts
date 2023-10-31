import {
  BrandCategoryId,
  CampaignStatus,
  CampaignStatusId,
  CampaignTypeId,
} from '@src/common/constants/enum';

export const BRAND_CATEGORY_KOREAN: { [key: string]: string } = {
  [BrandCategoryId.COSMETIC]: '코스메틱',
  [BrandCategoryId.PARENTING]: '육아',
  [BrandCategoryId.RESTAURANT]: '맛집',
  [BrandCategoryId.FASHION]: '패션',
  [BrandCategoryId.HOME_APPLIANCE]: '가전',
  [BrandCategoryId.TRAVEL]: '여행',
  [BrandCategoryId.PET]: '반려',
  [BrandCategoryId.FOOD]: '식품',
  [BrandCategoryId.SPORTS]: '스포츠',
  [BrandCategoryId.CULTURE]: '문화',
  [BrandCategoryId.LIVING]: '생활',
  [BrandCategoryId.ETC]: '기타',
} as const;

export const CAMPAIGN_STATUS_ID: { [key: string]: number } = {
  [CampaignStatus.TEMP]: 0,
  [CampaignStatus.WAITING]: 1,
  [CampaignStatus.ONGOING]: 2,
  [CampaignStatus.CLOSED]: 3,
} as const;

export const CAMPAIGN_TYPE_KOREAN: { [key: number]: string } = {
  [CampaignTypeId.DELIVERY]: '배송형',
  [CampaignTypeId.VISITING]: '방문형',
  [CampaignTypeId.WRITING]: '기자단',
} as const;

export const CAMPAIGN_STATUS_KOREAN: { [key: number]: string } = {
  [CampaignStatusId.TEMP]: '임시저장',
  [CampaignStatusId.WAITING]: '검수대기',
  [CampaignStatusId.ONGOING]: '진행중',
  [CampaignStatusId.CLOSED]: '진행마감',
} as const;
