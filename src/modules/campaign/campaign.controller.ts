import { Controller, UseInterceptors } from '@nestjs/common';
import { CampaignService } from '@src/modules/campaign/campaign.service';
import { ResponseSerializationInterceptor } from '@src/common/interceptors/response-serialization.interceptor';

@UseInterceptors(ResponseSerializationInterceptor)
@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}
}
