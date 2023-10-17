enum Channel {
  NAVER_BLOG = 0,
  INSTAGRAM = 1,
}

enum Condition {
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

export const channelConditionSeed = async (prisma) => {
  await prisma.campaignChannelCondition.createMany({
    data: [
      {
        id: 0,
        channel: Channel.NAVER_BLOG,
        recruitmentCondition: Condition.NO_CONDITION,
      },
      {
        id: 1,
        channel: Channel.NAVER_BLOG,
        recruitmentCondition: Condition.BETWEEN_0_AND_199,
      },
      {
        id: 2,
        channel: Channel.NAVER_BLOG,
        recruitmentCondition: Condition.BETWEEN_200_AND_499,
      },
      {
        id: 3,
        channel: Channel.NAVER_BLOG,
        recruitmentCondition: Condition.BETWEEN_500_AND_999,
      },
      {
        id: 4,
        channel: Channel.NAVER_BLOG,
        recruitmentCondition: Condition.BETWEEN_1000_AND_1999,
      },
      {
        id: 5,
        channel: Channel.NAVER_BLOG,
        recruitmentCondition: Condition.BETWEEN_2000_AND_3999,
      },
      {
        id: 6,
        channel: Channel.NAVER_BLOG,
        recruitmentCondition: Condition.BETWEEN_4000_AND_5999,
      },
      {
        id: 7,
        channel: Channel.NAVER_BLOG,
        recruitmentCondition: Condition.BETWEEN_6000_AND_7999,
      },
      {
        id: 8,
        channel: Channel.NAVER_BLOG,
        recruitmentCondition: Condition.BETWEEN_8000_AND_9999,
      },
      {
        id: 9,
        channel: Channel.NAVER_BLOG,
        recruitmentCondition: Condition.MORE_THAN_10000,
      },
      {
        id: 10,
        channel: Channel.INSTAGRAM,
        recruitmentCondition: Condition.NO_CONDITION,
      },
      {
        id: 11,
        channel: Channel.INSTAGRAM,
        recruitmentCondition: Condition.BETWEEN_0_AND_999,
      },
      {
        id: 12,
        channel: Channel.INSTAGRAM,
        recruitmentCondition: Condition.BETWEEN_1000_AND_2999,
      },
      {
        id: 13,
        channel: Channel.INSTAGRAM,
        recruitmentCondition: Condition.BETWEEN_3000_AND_4999,
      },
      {
        id: 14,
        channel: Channel.INSTAGRAM,
        recruitmentCondition: Condition.BETWEEN_5000_AND_9999,
      },
      {
        id: 15,
        channel: Channel.INSTAGRAM,
        recruitmentCondition: Condition.BETWEEN_10000_AND_29999,
      },
      {
        id: 16,
        channel: Channel.INSTAGRAM,
        recruitmentCondition: Condition.BETWEEN_30000_AND_49999,
      },
      {
        id: 17,
        channel: Channel.INSTAGRAM,
        recruitmentCondition: Condition.BETWEEN_50000_AND_99999,
      },
      {
        id: 18,
        channel: Channel.INSTAGRAM,
        recruitmentCondition: Condition.BETWEEN_100000_AND_299999,
      },
      {
        id: 19,
        channel: Channel.INSTAGRAM,
        recruitmentCondition: Condition.BETWEEN_300000_AND_499999,
      },
      {
        id: 20,
        channel: Channel.INSTAGRAM,
        recruitmentCondition: Condition.BETWEEN_500000_AND_799999,
      },
      {
        id: 21,
        channel: Channel.INSTAGRAM,
        recruitmentCondition: Condition.BETWEEN_800000_AND_999999,
      },
      {
        id: 22,
        channel: Channel.INSTAGRAM,
        recruitmentCondition: Condition.BETWEEN_1000000_AND_1999999,
      },
      {
        id: 23,
        channel: Channel.INSTAGRAM,
        recruitmentCondition: Condition.BETWEEN_2000000_AND_2999999,
      },
      {
        id: 24,
        channel: Channel.INSTAGRAM,
        recruitmentCondition: Condition.BETWEEN_3000000_AND_3999999,
      },
      {
        id: 25,
        channel: Channel.INSTAGRAM,
        recruitmentCondition: Condition.BETWEEN_4000000_AND_4999999,
      },
      {
        id: 26,
        channel: Channel.INSTAGRAM,
        recruitmentCondition: Condition.MORE_THAN_5000000,
      },
    ],
  });
};
