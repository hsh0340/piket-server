import { Controller, UseInterceptors } from '@nestjs/common';
import { CampaignService } from '@src/modules/campaign/campaign.service';
import { ResponseSerializationInterceptor } from '@src/common/interceptors/response-serialization.interceptor';

@UseInterceptors(ResponseSerializationInterceptor)
@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  /*
   * 캠페인 등록 API
   */
  async createCampaign(createCampaignRequestDto: CreateCampaignRequestDto) {
    await this.campaignService.createCampaign();
    return '캠페인 등록에 성공하였습니다.';
  }
}
