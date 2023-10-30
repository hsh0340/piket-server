export interface CreateCommonCampaignInput {
  brandId: number;
  advertiserNo: number;
  title: string;
  reward: number;
  channelConditionId: number;
  postingGuide: string | null;
  caution: string | null;
  type: number;
  recruitment: number;
  recruitmentStartsDate: Date;
  recruitmentEndsDate: Date;
  selectionEndsDate: Date;
  submitStartsDate: Date;
  submitEndsDate: Date;
  hashtag: string;
  company: string;
  managerName: string;
  managerTel: string;
  managerEmail: string | null;
  campaignThumbnail: { create: { fileUrl: string } };
  campaignImage?: {
    createMany: {
      data: { fileUrl: string }[];
    };
  };
  status: number;
}

export interface CreateVisitingCampaignInput {
  brandId: number;
  advertiserNo: number;
  title: string;
  reward: number;
  channelConditionId: number;
  postingGuide: string | null;
  caution: string | null;
  type: number;
  recruitment: number;
  recruitmentStartsDate: Date;
  recruitmentEndsDate: Date;
  selectionEndsDate: Date;
  submitStartsDate: Date;
  submitEndsDate: Date;
  hashtag: string;
  company: string;
  managerName: string;
  managerTel: string;
  managerEmail: string | null;
  campaignVisitingInfo: {
    create: {
      note: string;
      visitingAddr: string;
      visitingTime: string;
      visitingEndsDate: Date;
      servicePrice: number;
      info: string;
    };
  };
  campaignThumbnail: { create: { fileUrl: string } };
  campaignImage?: {
    createMany: {
      data: { fileUrl: string }[];
    };
  };
  campaignOption?: {
    createMany: {
      data: { name: string; value: string }[];
    };
  };
}

export interface CreateDeliveryCampaignInput {
  brandId: number;
  advertiserNo: number;
  title: string;
  reward: number;
  channelConditionId: number;
  postingGuide: string | null;
  caution: string | null;
  type: number;
  recruitment: number;
  recruitmentStartsDate: Date;
  recruitmentEndsDate: Date;
  selectionEndsDate: Date;
  submitStartsDate: Date;
  submitEndsDate: Date;
  hashtag: string;
  company: string;
  managerName: string;
  managerTel: string;
  managerEmail: string | null;
  campaignDeliveryInfo: {
    create: {
      experienceEndsDate: Date;
      productPrice: number;
      info: string;
    };
  };
  campaignThumbnail: { create: { fileUrl: string } };
  campaignImage?: {
    createMany: {
      data: { fileUrl: string }[];
    };
  };
  campaignOption?: {
    createMany: {
      data: { name: string; value: string }[];
    };
  };
}
