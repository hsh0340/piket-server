enum BrandCategory {
  // 코스메틱 : 0
  COSMETIC = 'cosmetic',
  // 육아 : 1
  PARENTING = 'parenting',
  // 맛집 : 2
  RESTAURANT = 'restaurant',
  // 패션 : 3
  FASHION = 'fashion',
  // 가전 : 4
  HOME_APPLIANCE = 'home_appliance',
  // 여행 : 5
  TRAVEL = 'travel',
  // 반려 : 6
  PET = 'pet',
  // 식품 : 7
  FOOD = 'food',
  // 스포츠 : 8
  SPORTS = 'sports',
  // 문화 : 9
  CULTURE = 'culture',
  // 생활 : 10
  LIVING = 'living',
  // 기타 : 11
  ETC = 'etc',
}

export const brandCategorySeed = async (prisma) => {
  await prisma.brandCategory.createMany({
    data: [
      {
        id: 0,
        name: BrandCategory.COSMETIC,
      },
      {
        id: 1,
        name: BrandCategory.PARENTING,
      },
      {
        id: 2,
        name: BrandCategory.RESTAURANT,
      },
      {
        id: 3,
        name: BrandCategory.FASHION,
      },
      {
        id: 4,
        name: BrandCategory.HOME_APPLIANCE,
      },
      {
        id: 5,
        name: BrandCategory.TRAVEL,
      },
      {
        id: 6,
        name: BrandCategory.PET,
      },
      {
        id: 7,
        name: BrandCategory.FOOD,
      },
      {
        id: 8,
        name: BrandCategory.SPORTS,
      },
      {
        id: 9,
        name: BrandCategory.CULTURE,
      },
      {
        id: 10,
        name: BrandCategory.LIVING,
      },
      {
        id: 11,
        name: BrandCategory.ETC,
      },
    ],
  });
};
