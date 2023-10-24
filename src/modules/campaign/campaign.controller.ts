import {
  Body,
  Controller,
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
import { CreateWritingCampaignRequestDto } from '@src/modules/campaign/dto/create-writing-campaign-request.dto';
import { CreateDeliveryCampaignRequestDto } from '@src/modules/campaign/dto/create-delivery-campaign-request.dto';

@UseInterceptors(ResponseSerializationInterceptor)
@Controller('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  /*
   * 방문형 캠페인 등록 API
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.ADVERTISER)
  @Post('visiting')
  async createVisitingCampaign(
    @User() advertiser: UserEntity,
    @Body() createVisitingCampaignRequestDto: CreateVisitingCampaignRequestDto,
  ): Promise<string> {
    await this.campaignService.createVisitingCampaign(
      advertiser,
      createVisitingCampaignRequestDto,
    );

    return '캠페인이 등록되었습니다.';
  }

  /*
   * 기자단 캠페인 등록 API
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.ADVERTISER)
  @Post('writing')
  async createWritingCampaign(
    @User() advertiser: UserEntity,
    @Body() createWritingCampaignRequestDto: CreateWritingCampaignRequestDto,
  ): Promise<string> {
    await this.campaignService.createWritingCampaign(
      advertiser,
      createWritingCampaignRequestDto,
    );

    return '캠페인이 등록되었습니다.';
  }

  /*
   * 배송형 캠페인 등록 API
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.ADVERTISER)
  @Post('delivery')
  async createDeliveryCampaign(
    @User() advertiser: UserEntity,
    @Body() createDeliveryCampaignRequestDto: CreateDeliveryCampaignRequestDto,
  ): Promise<string> {
    await this.campaignService.createDeliveryCampaign(
      advertiser,
      createDeliveryCampaignRequestDto,
    );

    return '캠페인이 등록되었습니다.';
  }
}
