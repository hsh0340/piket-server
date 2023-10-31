import { CampaignStatus } from '@src/common/constants/enum';

export const CAMPAIGN_STATUS_ID = {
  [CampaignStatus.temp]: 0,
  [CampaignStatus.waiting]: 1,
  [CampaignStatus.ongoing]: 2,
  [CampaignStatus.closed]: 3,
} as const;
