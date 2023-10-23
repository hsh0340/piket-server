import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { UserEntity } from '@src/entity/user.entity';
import { CreateVisitingCampaignRequestDto } from '@src/modules/campaign/dto/create-visiting-campaign-request.dto';
import { PrismaService } from '@src/modules/prisma/prisma.service';
import { CampaignType } from '@src/common/constants/enum';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { CreateWritingCampaignRequestDto } from '@src/modules/campaign/dto/create-writing-campaign-request.dto';

@Injectable()
export class CampaignService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('S3_REGION'),
    credentials: {
      accessKeyId: this.configService.getOrThrow('S3_ACCESS_KEY'),
      secretAccessKey: this.configService.getOrThrow('S3_SECRET_ACCESS_KEY'),
    },
  });

  private readonly bucketName = this.configService.getOrThrow('S3_BUCKET');

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  getRandomFileName() {
    return Math.random().toString(36).substring(2, 12);
  }

  /**
   * 모집 채널과 모집 조건을 입력받아 모집 고유 코드를 조회하는 메서드
   * @param channel 모집 채널
   * @param recruitmentCondition 모집 조건
   * @return 모집 고유 코드를 반환합니다.
   */
  async getChannelConditionCode(
    channel: number,
    recruitmentCondition: number,
  ): Promise<number> {
    const channelConditionCode =
      await this.prismaService.campaignChannelCondition.findFirst({
        select: {
          id: true,
        },
        where: {
          channel,
          recruitmentCondition,
        },
      });

    if (!channelConditionCode) {
      throw new BadRequestException('채널과 모집조건이 유효하지 않습니다.');
    }

    return channelConditionCode.id;
  }

  /**
   * 브랜드가 존재하는지 확인하는 메서드
   * @param brandId 브랜드 고유 번호
   * @param advertiser 광고주 정보
   * @return void
   */
  async verifyBrandExists(
    brandId: number,
    advertiser: UserEntity,
  ): Promise<void> {
    const existingBrand = await this.prismaService.brand.findUnique({
      select: {
        id: true,
      },
      where: {
        id: brandId,
        advertiserNo: advertiser.no,
      },
    });

    if (!existingBrand) {
      throw new BadRequestException('존재하지 않는 브랜드입니다.');
    }

    return;
  }

  /**
   * 옵션 배열 내의 각 객체에 campaign 고유 번호를 추가하고, 옵션 DB에 insert 하는 메서드
   * @param options 옵션 배열
   * @param campaign 캠페인 객체
   */
  async changeDataFormatOfOptionAndInsert(options, campaign) {
    const formattedOptionArr = options.map((obj) => {
      const valueString = JSON.stringify(obj.value);

      return { name: obj.name, value: valueString, campaignId: campaign.id };
    });

    await this.prismaService.campaignOption.createMany({
      data: formattedOptionArr,
    });

    return;
  }

  async createVisitingCampaign(
    advertiser: UserEntity,
    createVisitingCampaignRequestDto: CreateVisitingCampaignRequestDto,
  ): Promise<void> {
    const {
      brandId,
      channel,
      recruitmentCondition,
      recruitmentStartsDate,
      recruitmentEndsDate,
      selectionEndsDate,
      submitStartsDate,
      submitEndsDate,
      visitingAddr,
      visitingTime,
      note,
      visitingEndsDate,
      servicePrice,
      hashtag,
      options,
      thumbnail,
      images,
      ...rest
    } = createVisitingCampaignRequestDto;

    const channelConditionId = await this.getChannelConditionCode(
      channel,
      recruitmentCondition,
    );

    await this.verifyBrandExists(brandId, advertiser);

    /*
     * 캠페인 기본정보와, 방문형 캠페인 추가정보를 DB에 insert 합니다.
     */
    const campaign = await this.prismaService.campaign.create({
      data: {
        brandId,
        advertiserNo: advertiser.no,
        channelConditionId,
        type: CampaignType.VISITING,
        recruitmentStartsDate: new Date(recruitmentStartsDate),
        recruitmentEndsDate: new Date(recruitmentEndsDate),
        selectionEndsDate: new Date(selectionEndsDate),
        submitStartsDate: new Date(submitStartsDate),
        submitEndsDate: new Date(submitEndsDate),
        hashtag: JSON.stringify(hashtag),
        ...rest,
        campaignVisitingInfo: {
          create: {
            visitingAddr,
            visitingTime,
            note,
            visitingEndsDate: new Date(visitingEndsDate),
            servicePrice,
          },
        },
      },
    });

    if (options) {
      await this.changeDataFormatOfOptionAndInsert(options, campaign);
    }

    const thumbnailFileName = this.getRandomFileName();
    const imageFileNamesArray = [
      this.getRandomFileName(),
      this.getRandomFileName(),
      this.getRandomFileName(),
      this.getRandomFileName(),
    ];
    const imagesData: { campaignId: number; fileUrl: string }[] = [];

    try {
      /*
       * base64로 받아온 썸네일 이미지 파일을 디코딩합니다.
       */
      const thumbnailBuffer = Buffer.from(
        thumbnail.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      );

      /*
       * 썸네일 파일을 S3에 업로드합니다.
       */
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: `${advertiser.no + thumbnailFileName}.jpeg`,
          Body: thumbnailBuffer,
          ContentEncoding: 'base64',
          ContentType: 'image/jpeg',
        }),
      );

      /*
       * images 배열이 null 이 아닌 경우 모든 원소를 디코딩 하여 imagesBuffer 배열에 추가합니다.
       * images 파일 배열에도 저장합니다.
       */
      if (images && images.length > 0) {
        const imagesBufferArr: Buffer[] = [];

        images.forEach((image, index) => {
          const imageBuffer = Buffer.from(
            image.replace(/^data:image\/\w+;base64,/, ''),
            'base64',
          );

          imagesBufferArr.push(imageBuffer);
          imagesData.push({
            campaignId: campaign.id,
            fileUrl: `https://${
              this.bucketName
            }.s3.ap-northeast-2.amazonaws.com/${
              advertiser.no + imageFileNamesArray[index]
            }.jpeg`,
          });
        });

        /*
         * 세부 이미지 파일들을 S3에 업로드합니다.
         */
        imagesBufferArr.map(async (imageBuffer, index) => {
          await this.s3Client.send(
            new PutObjectCommand({
              Bucket: this.bucketName,
              Key: `${advertiser.no + imageFileNamesArray[index]}.jpeg`,
              Body: imageBuffer,
              ContentEncoding: 'base64',
              ContentType: 'image/jpeg',
            }),
          );
        });
      }
    } catch (err) {
      throw new InternalServerErrorException(
        '사진 파일을 S3에 저장하는 것을 실패하였습니다.',
      );
    }

    /*
     * S3에 저장된 이미지 파일들의 객체 url 을 DB에 저장합니다.
     */
    await this.prismaService.campaignThumbnail.create({
      data: {
        campaignId: campaign.id,
        fileUrl: `https://${this.bucketName}.s3.ap-northeast-2.amazonaws.com/${
          advertiser.no + thumbnailFileName
        }.jpeg`,
      },
    });

    await this.prismaService.campaignImage.createMany({
      data: imagesData,
    });
  }

  async createWritingCampaign(
    advertiser: UserEntity,
    createWritingCampaignRequestDto: CreateWritingCampaignRequestDto,
  ) {}
}
