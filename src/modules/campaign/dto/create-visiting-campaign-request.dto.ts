import { PartialType, PickType } from '@nestjs/swagger';
import { CreateCampaignRequestDto } from '@src/modules/campaign/dto/create-campaign-request.dto';

export class CreateVisitingCampaignRequestDto extends PickType(
  CreateCampaignRequestDto,
  [
    'brandId',
    'title',
    'info',
    'reward',
    'channel',
    'recruitment',
    'recruitmentCondition',
    'recruitmentStartsDate',
    'recruitmentEndsDate',
    'selectionEndsDate',
    'submitStartsDate',
    'submitEndsDate',
    'postingGuide',
    'caution',
    'hashtag',
    'company',
    'managerName',
    'managerTel',
    'managerEmail',
    'options',
    'thumbnail',
    'images',
  ] as const,
) {
  visitingAddr: string;
  visitingTime: string;
  note: string;
  visitingEndsDate: Date;
  servicePrice: number;
}
