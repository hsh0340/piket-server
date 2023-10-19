import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CampaignService } from '@src/modules/campaign/campaign.service';
import { ResponseSerializationInterceptor } from '@src/common/interceptors/response-serialization.interceptor';

import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@src/modules/auth/guards/roles.guard';
import { Roles } from '@src/modules/auth/decorators/roles.decorator';
import { RoleType } from '@src/modules/auth/types/role-type';
import { User } from '@src/modules/auth/decorators/user.decorator';
import { UserEntity } from '@src/entity/user.entity';
import { CreateVisitingCampaignRequestDto } from '@src/modules/campaign/dto/create-visiting-campaign-request.dto';

@UseInterceptors(ResponseSerializationInterceptor)
@Controller('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  /*
   * 방문형 캠페인 등록 API
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.ADVERTISER)
  @Post('visitings')
  async createVisitingCampaign(
    @User() advertiser: UserEntity,
    @Body() createVisitingCampaignRequestDto: CreateVisitingCampaignRequestDto,
  ) {
    await this.campaignService.createVisitingCampaign(
      advertiser,
      createVisitingCampaignRequestDto,
    );
    return '캠페인 등록에 성공하였습니다.';
  }
}
