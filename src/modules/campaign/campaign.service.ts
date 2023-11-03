import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@src/modules/prisma/prisma.service';
import { UserEntity } from '@src/entity/user.entity';
import { CreateVisitingCampaignRequestDto } from '@src/modules/campaign/dto/create-visiting-campaign-request.dto';
import { CampaignTypeId } from '@src/common/constants/enum';
import {
  CAMPAIGN_STATUS_ID,
  BRAND_CATEGORY_KOREAN,
  CAMPAIGN_TYPE_KOREAN,
  CAMPAIGN_STATUS_KOREAN,
  BRAND_CATEGORY_ENGLISH,
} from '@src/common/constants/constant';
import { CreateWritingCampaignRequestDto } from '@src/modules/campaign/dto/create-writing-campaign-request.dto';
import { CreateCampaignRequestDto } from '@src/modules/campaign/dto/create-campaign-request.dto';
import { CreateDeliveryCampaignRequestDto } from '@src/modules/campaign/dto/create-delivery-campaign-request.dto';
import {
  CreateCommonCampaignInput,
  CreateDeliveryCampaignInput,
  CreateVisitingCampaignInput,
} from '@src/modules/campaign/interfaces/campaign.interface';
import {
  BrandNotExistsException,
  CampaignNotCreatedException,
  ChannelConditionMismatchException,
  S3NotUploadedException,
} from '@src/common/exceptions/request.exception';
import { GetCampaignsOfAdvertiserQueryDto } from '@src/modules/campaign/dto/get-campaigns-of-advertiser-query.dto';

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
      throw new ChannelConditionMismatchException();
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
      throw new BrandNotExistsException();
    }

    return;
  }

  /**
   * 옵션 배열 내의 value 의 타입을 array 에서 string 으로 변환하는 메서드
   * @param options 옵션 배열
   * @return value 의 타입을 array 에서 string 으로 변환한 배열을 반환합니다.
   */
  async changeOptionValueFromJsonToJson(
    options: { name: string; value: string[] }[],
  ) {
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
      throw new S3NotUploadedException();
    }
  }

  /**
   * 배송형/방문형/기자단 캠페인 create 메서드에서 공통으로 필요한 데이터를 포함한 객체를패 생성하고, 공통적으로 실행해야할 로직을 포함한 메서드
   * @param advertiser 광고주 객체
   * @param campaignType 캠페인 진행 유형
   * @param createCampaignRequestDto 캠페인 생성 DTO
   * @return prisma.campaign.create 메서드 실행시 등록시 공통으로 필요한 데이터를 포함한 객체를 반환합니다.
   */
  async generateCommonCreateCampaignObject(
    advertiser: UserEntity,
    campaignType: number,
    createCampaignRequestDto: CreateCampaignRequestDto,
  ) {
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

    const thumbnailFileName = advertiser.no + this.generateRandomFileName();
    const thumbnailBuffer = this.decodeBase64ImageToBuffer(thumbnail);
    await this.uploadImageToS3(thumbnailFileName, thumbnailBuffer);

    const commonInputObjectForCreateCampaign: CreateCommonCampaignInput = {
      brandId,
      advertiserNo: advertiser.no,
      channelConditionId,
      type: campaignType,
      recruitmentStartsDate: new Date(recruitmentStartsDate),
      recruitmentEndsDate: new Date(recruitmentEndsDate),
      selectionEndsDate: new Date(selectionEndsDate),
      submitStartsDate: new Date(submitStartsDate),
      submitEndsDate: new Date(submitEndsDate),
      hashtag: JSON.stringify(hashtag),
      status: 1,
      campaignThumbnail: {
        create: {
          fileUrl: this.generateS3FileUrl(advertiser.no, thumbnailFileName),
        },
      },
      ...rest,
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

      commonInputObjectForCreateCampaign.campaignImage = {
        createMany: { data: detailedImagesForDBInsertion },
      };
    }

    return commonInputObjectForCreateCampaign;
  }

  async createWritingCampaign(
    advertiser: UserEntity,
    createWritingCampaignRequestDto: CreateWritingCampaignRequestDto,
  ) {
    const inputObjectForCreateWritingCampaign =
      await this.generateCommonCreateCampaignObject(
        advertiser,
        CampaignTypeId.WRITING,
        createWritingCampaignRequestDto,
      );

    try {
      await this.prismaService.campaign.create({
        data: inputObjectForCreateWritingCampaign,
      });
    } catch (err) {
      throw new CampaignNotCreatedException();
    }
  }

  /**
   * 방문형 캠페페인을 등록하는 메서드
   * @param advertiser 유저 객체
   * @param createVisitingCampaignRequestDto 벙뮨형 캠페인 생성 DTO
   */
  async createVisitingCampaign(
    advertiser: UserEntity,
    createVisitingCampaignRequestDto: CreateVisitingCampaignRequestDto,
  ) {
    const {
      visitingAddr,
      visitingTime,
      note,
      visitingEndsDate,
      servicePrice,
      options,
      info,
      ...createCampaignRequestDto
    } = createVisitingCampaignRequestDto;

    const commonCampaignObject = await this.generateCommonCreateCampaignObject(
      advertiser,
      CampaignTypeId.VISITING,
      createCampaignRequestDto,
    );

    const inputObjectForCreateVisitingCampaign: CreateVisitingCampaignInput = {
      ...commonCampaignObject,
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
    };

    if (options) {
      const optionArr = await this.changeOptionValueFromJsonToJson(options);
      inputObjectForCreateVisitingCampaign.campaignOption = {
        createMany: { data: optionArr },
      };
    }

    try {
      await this.prismaService.campaign.create({
        data: inputObjectForCreateVisitingCampaign,
      });
    } catch (err) {
      throw new CampaignNotCreatedException();
    }
  }

  /**
   * 배송형 캠페인을 등록하는 메서드
   * @param advertiser 유저 객체
   * @param createDeliveryCampaignRequestDto 배송형 캠페인 생성 DTO
   */
  async createDeliveryCampaign(
    advertiser: UserEntity,
    createDeliveryCampaignRequestDto: CreateDeliveryCampaignRequestDto,
  ): Promise<void> {
    const {
      experienceEndsDate,
      productPrice,
      options,
      info,
      ...createCampaignRequestDto
    } = createDeliveryCampaignRequestDto;

    const commonCampaignObject = await this.generateCommonCreateCampaignObject(
      advertiser,
      CampaignTypeId.DELIVERY,
      createCampaignRequestDto,
    );

    const inputObjectForCreateDeliveryCampaign: CreateDeliveryCampaignInput = {
      ...commonCampaignObject,
      campaignDeliveryInfo: {
        create: {
          experienceEndsDate: new Date(experienceEndsDate),
          productPrice,
          info,
        },
      },
    };

    if (options) {
      const optionArr = await this.changeOptionValueFromJsonToJson(options);
      inputObjectForCreateDeliveryCampaign.campaignOption = {
        createMany: { data: optionArr },
      };
    }

    try {
      await this.prismaService.campaign.create({
        data: inputObjectForCreateDeliveryCampaign,
      });
    } catch (err) {
      throw new CampaignNotCreatedException();
    }
  }

  /**
   * Date 형식의 데이터를 문자열로 변환하고 'T' 문자 이후의 문자를 제거하는 메서드
   * @param date 날짜 데이터
   * @return 'T' 문자 이후의 문자를 제거한 문자열을 반환합니다.
   */
  removeAfterTFromDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /** 로그인한 광고주가 가지고 있는 캠페인의 리스트 조회 API
   * @param advertiser
   * @param query
   */
  async getCampaignsListOfAdvertiser(
    advertiser: UserEntity,
    query: GetCampaignsOfAdvertiserQueryDto,
  ) {
    const { status, page, searchCategory, searchInput } = query;
    const pageSize = 5;

    // string 으로 받아온 status 의 ID 값을 변수에 저장합니다.
    const statusId = CAMPAIGN_STATUS_ID[status];

    let where;

    // 제목
    if (searchCategory && searchInput) {
      // 제목 검색
      if (searchCategory === 'title') {
        where = {
          advertiserNo: advertiser.no,
          status: statusId,
          [searchCategory]: {
            search: searchInput,
          },
        };
      }
      if (searchCategory === 'brand') {
        // 브랜드 검색
        where = {
          advertiserNo: advertiser.no,
          status: statusId,
          [searchCategory]: {
            name: searchInput,
          },
        };
      }
      if (searchCategory === 'category') {
        // 카테고리 검색

        // 쿼리스트링으로 받은 한글을 영어로 변환합니다.
        const searchInputEnglish = BRAND_CATEGORY_ENGLISH[searchInput];
        where = {
          advertiserNo: advertiser.no,
          status: statusId,
          brand: {
            brandCategory: {
              name: searchInputEnglish,
            },
          },
        };
      }
    }

    const campaignListArr = await this.prismaService.campaign.findMany({
      skip: page * pageSize, // skip 하는 게시물 개수
      take: pageSize, // 한 페이지당 아이템 갯수
      select: {
        id: true,
        brand: {
          select: {
            name: true,
            brandCategory: {
              select: {
                name: true,
              },
            },
          },
        },
        campaignChannelCondition: {
          select: {
            channel: true,
          },
        },
        title: true,
        type: true,
        reward: true,
        recruitment: true,
        selectionEndsDate: true,
        submitEndsDate: true,
        status: true,
      },
      where: {
        ...where,
      },
    });

    const campaignListForReturn = campaignListArr.map((campaign) => {
      // 브랜드 카테고리명을 한글명으로 리턴합니다.
      const brandCategoryNameKorean =
        BRAND_CATEGORY_KOREAN[campaign.brand.brandCategory.name];

      console.log(campaign);

      // 캠페인 타입을 한글명으로 리턴합니다.
      const campaignTypeKorean = CAMPAIGN_TYPE_KOREAN[campaign.type];

      // 캠페인 상태를 한글명으로 리턴합니다.
      const campaignStatusKorean = CAMPAIGN_STATUS_KOREAN[campaign.status];

      return {
        id: campaign.id,
        brandName: campaign.brand.name,
        brandCategory: brandCategoryNameKorean,
        channel: campaign.campaignChannelCondition.channel,
        title: campaign.title,
        type: campaignTypeKorean,
        reward: campaign.reward,
        recruitment: campaign.recruitment,
        numberOfApplicants: 0,
        numberOfPeopleSelected: 0,
        numberOfPeopleSubmitted: 0,
        selectionEndsDate: this.removeAfterTFromDate(
          campaign.selectionEndsDate,
        ),
        submitEndsDate: this.removeAfterTFromDate(campaign.submitEndsDate),
        status: campaignStatusKorean,
      };
    });

    const totalCountQuery = await this.prismaService.campaign.count({
      where: {
        ...where,
      },
    });

    return { campaigns: campaignListForReturn, totalCountQuery };
  }
}
