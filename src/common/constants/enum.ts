export enum Agreement {
  REJECT = 0,
  ACCEPT = 1,
}

export enum Sex {
  MALE = 0,
  FEMALE = 1,
}

export enum LoginType {
  EMAIL = 0,
  KAKAO = 1,
  GOOGLE = 2,
  NAVER = 3,
}

export enum BrandCategoryId {
  // 코스메틱 : 0
  COSMETIC = 0,
  // 육아 : 1
  PARENTING = 1,
  // 맛집 : 2
  RESTAURANT = 2,
  // 패션 : 3
  FASHION = 3,
  // 가전 : 4
  HOME_APPLIANCE = 4,
  // 여행 : 5
  TRAVEL = 5,
  // 반려 : 6
  PET = 6,
  // 식품 : 7
  FOOD = 7,
  // 스포츠 : 8
  SPORTS = 8,
  // 문화 : 9
  CULTURE = 9,
  // 생활 : 10
  LIVING = 10,
  // 기타 : 11
  ETC = 11,
}

export enum CampaignTypeId {
  // 배송형 : 0
  DELIVERY = 0,
  // 방문형 : 1
  VISITING = 1,
  // 기자단 : 2
  WRITING = 2,
}

export enum CampaignTypeKorean {
  DELIVERY = '배송형',
  VISITING = '방문형',
  WRITING = '기자단',
}

export enum CampaignChannel {
  // 네이버블로그 : 0
  NAVER_BLOG = 0,
  // 인스타그램 : 1
  INSTAGRAM = 1,
}

export enum CampaignChannelKorean {
  NAVER_BLOG = '네이버 블로그',
  INSTAGRAM = '인스타그램',
}

export enum CampaignRecruitmentCondition {
  NO_CONDITION = 0,
  BETWEEN_0_AND_199 = 1,
  BETWEEN_200_AND_499 = 2,
  BETWEEN_500_AND_999 = 3,
  BETWEEN_1000_AND_1999 = 4,
  BETWEEN_2000_AND_3999 = 5,
  BETWEEN_4000_AND_5999 = 6,
  BETWEEN_6000_AND_7999 = 7,
  BETWEEN_8000_AND_9999 = 8,
  MORE_THAN_10000 = 9,
  BETWEEN_0_AND_999 = 10,
  BETWEEN_1000_AND_2999 = 11,
  BETWEEN_3000_AND_4999 = 12,
  BETWEEN_5000_AND_9999 = 13,
  BETWEEN_10000_AND_29999 = 14,
  BETWEEN_30000_AND_49999 = 15,
  BETWEEN_50000_AND_99999 = 16,
  BETWEEN_100000_AND_299999 = 17,
  BETWEEN_300000_AND_499999 = 18,
  BETWEEN_500000_AND_799999 = 19,
  BETWEEN_800000_AND_999999 = 20,
  BETWEEN_1000000_AND_1999999 = 21,
  BETWEEN_2000000_AND_2999999 = 22,
  BETWEEN_3000000_AND_3999999 = 23,
  BETWEEN_4000000_AND_4999999 = 24,
  MORE_THAN_5000000 = 25,
}

export enum CampaignStatusId {
  TEMP = 0,
  WAITING = 1,
  ONGOING = 2,
  CLOSED = 3,
}

export enum CampaignStatus {
  TEMP = 'temp',
  WAITING = 'waiting',
  ONGOING = 'ongoing',
  CLOSED = 'closed',
}

export enum BrandCategory {
  // 코스메틱
  COSMETIC = 'cosmetic',
  // 육아
  PARENTING = 'parenting',
  // 맛집
  RESTAURANT = 'restaurant',
  // 패션
  FASHION = 'fashion',
  // 가전
  HOME_APPLIANCE = 'homeAppliance',
  // 여행
  TRAVEL = 'travel',
  // 반려
  PET = 'pet',
  // 식품
  FOOD = 'food',
  // 스포츠
  SPORTS = 'sports',
  // 문화
  CULTURE = 'culture',
  // 생활
  LIVING = 'living',
  // 기타
  ETC = 'etc',
}

export enum BrandCategoryKorean {
  // 코스메틱
  COSMETIC = '코스메틱',
  // 육아
  PARENTING = '육아',
  // 맛집
  RESTAURANT = '맛집',
  // 패션
  FASHION = '패션',
  // 가전
  HOME_APPLIANCE = '가전',
  // 여행
  TRAVEL = '여행',
  // 반려
  PET = '반려',
  // 식품
  FOOD = '식품',
  // 스포츠
  SPORTS = '스포츠',
  // 문화
  CULTURE = '문화',
  // 생활
  LIVING = '생활',
  // 기타
  ETC = '기타',
}
