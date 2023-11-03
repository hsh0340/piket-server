import {
  BrandCategory, BrandCategoryKorean,
  CampaignStatus,
  CampaignStatusId,
  CampaignTypeId
} from "@src/common/constants/enum";

export const BRAND_CATEGORY_KOREAN: { [key: string]: string } = {
  [BrandCategory.COSMETIC]: '코스메틱',
  [BrandCategory.PARENTING]: '육아',
  [BrandCategory.RESTAURANT]: '맛집',
  [BrandCategory.FASHION]: '패션',
  [BrandCategory.HOME_APPLIANCE]: '가전',
  [BrandCategory.TRAVEL]: '여행',
  [BrandCategory.PET]: '반려',
  [BrandCategory.FOOD]: '식품',
  [BrandCategory.SPORTS]: '스포츠',
  [BrandCategory.CULTURE]: '문화',
  [BrandCategory.LIVING]: '생활',
  [BrandCategory.ETC]: '기타',
} as const;

export const BRAND_CATEGORY_ENGLISH: { [key: string]: string } = {
  [BrandCategoryKorean.COSMETIC]: 'cosmetic',
  [BrandCategoryKorean.PARENTING]: 'parenting',
  [BrandCategoryKorean.RESTAURANT]: 'restaurant',
  [BrandCategoryKorean.FASHION]: 'fashion',
  [BrandCategoryKorean.HOME_APPLIANCE]: 'home_appliance',
  [BrandCategoryKorean.TRAVEL]: 'travel',
  [BrandCategoryKorean.PET]: 'pet',
  [BrandCategoryKorean.FOOD]: 'food',
  [BrandCategoryKorean.SPORTS]: 'sports',
  [BrandCategoryKorean.CULTURE]: 'culture',
  [BrandCategoryKorean.LIVING]: 'living',
  [BrandCategoryKorean.ETC]: 'etc',
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
