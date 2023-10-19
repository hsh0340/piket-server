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

  async createVisitingCampaign(
    advertiser: UserEntity,
    createVisitingCampaignRequestDto: CreateVisitingCampaignRequestDto,
  ): Promise<void> {
    const {
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
          Key: `${advertiser.no + this.getRandomFileName()}.jpeg`,
          Body: thumbnailBuffer,
          ContentEncoding: 'base64',
          ContentType: 'image/jpeg',
        }),
      );

      /*
       * images 배열이 null 이 아닌 경우 모든 원소를 디코딩 하여 새로운 배열에 추가합니다.
       */
      if (images && images.length > 0) {
        const imagesBufferArr: Buffer[] = [];

        images.forEach((image) => {
          const imageBuffer = Buffer.from(
            image.replace(/^data:image\/\w+;base64,/, ''),
            'base64',
          );

          imagesBufferArr.push(imageBuffer);
        });

        /*
         * 세부 이미지 파일들을 S3에 업로드 합니다.
         */
        imagesBufferArr.map(async (imageBuffer) => {
          await this.s3Client.send(
            new PutObjectCommand({
              Bucket: this.bucketName,
              Key: `${advertiser.no + this.getRandomFileName()}.jpeg`,
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

    // 채널 모집조건 고유 코드 찾음
    const channelCondition =
      await this.prismaService.campaignChannelCondition.findFirst({
        select: {
          id: true,
        },
        where: {
          channel,
          recruitmentCondition,
        },
      });

    if (!channelCondition) {
      throw new BadRequestException('채널과 모집조건이 유효하지 않습니다.');
    }

    // 캠페인 공통 정보 테이블, 방문형 추가정보 테이블에 insert
    const campaign = await this.prismaService.campaign.create({
      data: {
        advertiserNo: advertiser.no,
        channelConditionId: channelCondition.id,
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
      const output = options.map((obj) => {
        // value 속성을 JSON 문자열로 변환
        const valueString = JSON.stringify(obj.value);

        // 변환된 객체를 반환
        return { name: obj.name, value: valueString, campaignId: campaign.id };
      });

      await this.prismaService.campaignOption.createMany({
        data: output,
      });
    }
  }
}
