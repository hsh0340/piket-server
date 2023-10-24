import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { UserEntity } from '@src/entity/user.entity';
import { CreateVisitingCampaignRequestDto } from '@src/modules/campaign/dto/create-visiting-campaign-request.dto';

import { CampaignType } from '@src/common/constants/enum';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { CreateWritingCampaignRequestDto } from '@src/modules/campaign/dto/create-writing-campaign-request.dto';
import { CreateCampaignRequestDto } from '@src/modules/campaign/dto/create-campaign-request.dto';
import { PrismaService } from '@src/modules/prisma/prisma.service';

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

  /**
   * 랜덤한 파일명을 생성하는 메서드
   * @return 랜덤한 문자열을 반환합니다.
   */
  generateRandomFileName() {
    return Math.random().toString(36).substring(2, 12);
  }

  /**
   * 광고주 고유 번호와 파일명을 조합하여 S3 파일의 URL을 생성하는 메서드
   * @param advertiserNo
   * @param imageFileName
   * @return S3 파일의 URL을 리턴합니다.
   */
  generateS3FileUrl(advertiserNo: number, imageFileName: string): string {
    return `https://${this.bucketName}.s3.ap-northeast-2.amazonaws.com/${
      advertiserNo + imageFileName
    }.jpeg`;
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
   * 옵션 배열 내의 각 객체에 campaign 고유 번호를 추가하는 메서드
   * @param options 옵션 배열
   * @param campaignId 캠페인 고유 번호
   */
  async changeDataFormatOfOptionAndInsert(options) {
    return options.map((obj) => {
      const valueString = JSON.stringify(obj.value);

      return { name: obj.name, value: valueString };
    });
  }

  /**
   * base64 로 인코딩 된 이미지를 Buffer 객체로 디코딩하는 메서드
   * @param base64Image
   * @return Buffer 객체를 반환합니다.
   */
  decodeBase64ImageToBuffer(base64Image: string): Buffer {
    return Buffer.from(
      base64Image.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );
  }

  /**
   * S3에 이미지를 업로드하는 메서드
   * @param fileName 파일명
   * @param imageBuffer 이미지 Buffer 객체
   * @return void
   * @exception
   */
  async uploadImageToS3(fileName: string, imageBuffer: Buffer): Promise<void> {
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: `${fileName}.jpeg`,
          Body: imageBuffer,
          ContentEncoding: 'base64',
          ContentType: 'image/jpeg',
        }),
      );

      return;
    } catch (err) {
      throw new InternalServerErrorException(
        'S3에 파일 업로드를 실패하였습니다.',
      );
    }
  }

  /**
   * 배송형/방문형/기자단 캠페인 등록시 공통으로 실행될 메서드
   * @param advertiser 광고주 객체
   * @param campaignType 캠페인 진행 유형
   * @param createCampaignRequestDto 캠페인 셍성 DTO
   * @return 생성된 캠페인의 고유 번호를 반환합니다.
   */
  async createCommonCampaignObject(
    advertiser: UserEntity,
    campaignType: number,
    createCampaignRequestDto: CreateCampaignRequestDto,
  ): Promise<number> {
    const {
      brandId,
      channel,
      recruitmentCondition,
      recruitmentStartsDate,
      recruitmentEndsDate,
      selectionEndsDate,
      submitStartsDate,
      submitEndsDate,
      hashtag,
      thumbnail,
      images,
      ...rest
    } = createCampaignRequestDto;

    const channelConditionId = await this.getChannelConditionCode(
      channel,
      recruitmentCondition,
    );

    await this.verifyBrandExists(brandId, advertiser);

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
      },
    });

    const thumbnailFileName = advertiser.no + this.generateRandomFileName();
    const thumbnailBuffer = this.decodeBase64ImageToBuffer(thumbnail);

    await this.uploadImageToS3(thumbnailFileName, thumbnailBuffer);

    /*
     * S3에 저장된 이미지 파일들의 객체 url 을 DB에 저장합니다.
     */
    await this.prismaService.campaignThumbnail.create({
      data: {
        campaignId: campaign.id,
        fileUrl: this.generateS3FileUrl(advertiser.no, thumbnailFileName),
      },
    });

    if (images && images.length > 0) {
      const detailedImageFileNamesArr = Array(images.length)
        .fill('')
        .map(() => advertiser.no + this.generateRandomFileName());
      const detailedImagesForDBInsertion: {
        campaignId: number;
        fileUrl: string;
      }[] = [];
      const bufferedDetailedImagesArr: Buffer[] = [];

      images.forEach((detailedImage, index) => {
        /*
         * images 배열의 모든 원소를 디코딩 하여 bufferedDetailedImagesArr 배열에 push 합니다.
         */
        const imageBuffer = this.decodeBase64ImageToBuffer(detailedImage);

        bufferedDetailedImagesArr.push(imageBuffer);

        /*
         * prisma createMany의 data 절에서 사용하기 위한 detailedImagesForInsertion 배열에 키 값이 campaignId, fileUrl 인 객체를 push 합니다.
         */

        detailedImagesForDBInsertion.push({
          campaignId: campaign.id,
          fileUrl: this.generateS3FileUrl(
            advertiser.no,
            detailedImageFileNamesArr[index],
          ),
        });
      }); // end of forEach

      bufferedDetailedImagesArr.map(async (bufferedImage, index) => {
        await this.uploadImageToS3(
          detailedImageFileNamesArr[index],
          bufferedImage,
        );
      });

      await this.prismaService.campaignImage.createMany({
        data: detailedImagesForDBInsertion,
      });
    } // end of if

    return campaign.id;
  }

  createWritingCampaign(
    advertiser: UserEntity,
    createWritingCampaignRequestDto: CreateWritingCampaignRequestDto,
  ) {
    return this.createCommonCampaignObject(
      advertiser,
      CampaignType.WRITING,
      createWritingCampaignRequestDto,
    );
  }

  async createVisitingCampaign(
    advertiser: UserEntity,
    createVisitingCampaignRequestDto: CreateVisitingCampaignRequestDto,
  ): Promise<void> {
    const {
      options,
      visitingAddr,
      visitingTime,
      note,
      visitingEndsDate,
      servicePrice,
      info,
      ...createCampaignRequestDto
    } = createVisitingCampaignRequestDto;

    const campaignId = await this.createCommonCampaignObject(
      advertiser,
      CampaignType.VISITING,
      createCampaignRequestDto,
    );

    if (options) {
      await this.changeDataFormatOfOptionAndInsert(options);
    }

    // 방문형 캠페인 추가정보 insert
    await this.prismaService.campaignVisitingInfo.create({
      data: {
        campaignId: 100,
        visitingAddr,
        visitingTime,
        note,
        visitingEndsDate: new Date(visitingEndsDate),
        servicePrice,
        info,
      },
    });
  }

  async newCreateVisitingCampaign(
    advertiser: UserEntity,
    createVisitingCampaignRequestDto: CreateVisitingCampaignRequestDto,
  ) {
    const {
      brandId,
      title,
      reward,
      channel,
      recruitment,
      recruitmentCondition,
      recruitmentStartsDate,
      recruitmentEndsDate,
      selectionEndsDate,
      submitStartsDate,
      submitEndsDate,
      hashtag,
      thumbnail,
      images,
      visitingAddr,
      visitingTime,
      note,
      visitingEndsDate,
      servicePrice,
      options,
      info,
      postingGuide,
      caution,
      company,
      managerName,
      managerTel,
      managerEmail,
    } = createVisitingCampaignRequestDto;
    const thumbnailFileName = advertiser.no + this.generateRandomFileName();

    const dataForCreateVisitingCampaign2: {
      brandId: number;
      advertiserNo: number;
      title: string;
      reward: number;
      channelConditionId: number;
      postingGuide: string | null;
      caution: string | null;
      type: number;
      recruitment: number;
      recruitmentStartsDate: Date;
      recruitmentEndsDate: Date;
      selectionEndsDate: Date;
      submitStartsDate: Date;
      submitEndsDate: Date;
      hashtag: string;
      company: string;
      managerName: string;
      managerTel: string;
      managerEmail: string | null;
      campaignVisitingInfo: {
        create: {
          note: string;
          visitingAddr: string;
          visitingTime: string;
          visitingEndsDate: Date;
          servicePrice: number;
          info: string;
        };
      };
      campaignThumbnail: { create: { fileUrl: string } };
      campaignImage?: {
        createMany: {
          data: { fileUrl: string }[];
        };
      };
      campaignOption?: {
        createMany: {
          data: { name: string; value: string }[];
        };
      };
    } = {
      brandId,
      advertiserNo: advertiser.no,
      title,
      reward,
      channelConditionId: 3,
      postingGuide,
      caution,
      type: CampaignType.VISITING,
      recruitment,
      recruitmentStartsDate: new Date(recruitmentStartsDate),
      recruitmentEndsDate: new Date(recruitmentEndsDate),
      selectionEndsDate: new Date(selectionEndsDate),
      submitStartsDate: new Date(submitStartsDate),
      submitEndsDate: new Date(submitEndsDate),
      hashtag: JSON.stringify(hashtag),
      company,
      managerName,
      managerTel,
      managerEmail,
      campaignVisitingInfo: {
        create: {
          note,
          visitingAddr,
          visitingTime,
          visitingEndsDate: new Date(visitingEndsDate),
          servicePrice,
          info,
        },
      },
      campaignThumbnail: {
        create: {
          fileUrl: this.generateS3FileUrl(advertiser.no, thumbnailFileName),
        },
      },
    };

    if (images && images.length > 0) {
      const detailedImageFileNamesArr = Array(images.length)
        .fill('')
        .map(() => advertiser.no + this.generateRandomFileName());
      const detailedImagesForDBInsertion: {
        fileUrl: string;
      }[] = [];
      const bufferedDetailedImagesArr: Buffer[] = [];

      images.forEach((detailedImage, index) => {
        /*
         * images 배열의 모든 원소를 디코딩 하여 bufferedDetailedImagesArr 배열에 push 합니다.
         */
        const imageBuffer = this.decodeBase64ImageToBuffer(detailedImage);

        bufferedDetailedImagesArr.push(imageBuffer);

        /*
         * prisma createMany의 data 절에서 사용하기 위한 detailedImagesForInsertion 배열에 키 값이 campaignId, fileUrl 인 객체를 push 합니다.
         */

        detailedImagesForDBInsertion.push({
          fileUrl: this.generateS3FileUrl(
            advertiser.no,
            detailedImageFileNamesArr[index],
          ),
        });
      }); // end of forEach

      bufferedDetailedImagesArr.map(async (bufferedImage, index) => {
        await this.uploadImageToS3(
          detailedImageFileNamesArr[index],
          bufferedImage,
        );
      });

      dataForCreateVisitingCampaign2.campaignImage = {
        createMany: { data: detailedImagesForDBInsertion },
      };
    }

    if (options) {
      const optionArr = await this.changeDataFormatOfOptionAndInsert(options);
      dataForCreateVisitingCampaign2.campaignOption = {
        createMany: { data: optionArr },
      };
    }

    console.log(dataForCreateVisitingCampaign2);

    // 최종적으로
    try {
      await this.prismaService.campaign.create({
        data: dataForCreateVisitingCampaign2,
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestException('캠페인 생성 실패');
    }
  }
}
