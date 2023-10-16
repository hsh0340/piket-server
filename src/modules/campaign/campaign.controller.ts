import { Controller } from '@nestjs/common';
import { CampaignService } from '@src/modules/campaign/campaign.service';

@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}
}
