import { Campaign } from '@prisma/client';

export class CampaignEntity implements Campaign {
  advertiserNo: number;
  brandId: number;
  caution: string | null;
  channelConditionId: number;
  company: string;
  createdAt: Date;
  deletedAt: Date | null;
  hashtag: string | null;
  id: number;
  managerEmail: string | null;
  managerName: string;
  managerTel: string;
  postingGuide: string | null;
  recruitment: number;
  recruitmentEndsDate: Date;
  recruitmentStartsDate: Date;
  reward: number;
  selectionEndsDate: Date;
  status: number;
  submitEndsDate: Date;
  submitStartsDate: Date;
  title: string;
  type: number;
  updatedAt: Date;
}
