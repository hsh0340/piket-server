import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  CampaignChannel,
  CampaignRecruitmentCondition,
} from '@src/common/constants/enum';

/**
 * 캠페인 진행방식에 상관 없이 공통으로 필요한 데이터 DTO
 * @property brandId {number} 브랜드 고유번호
 * @property title {string} 캠페인 제목
 * @property reward {number} 리워드
 * @property channel {number} 진행채널
 * @property recruitment {number} 모집인원
 * @property recruitmentCondition {number} 모집조건
 * @property recruitmentStartsDate {Date} 모집시작일
 * @property recruitmentEndsDate {Date} 모집마감일
 * @property selectionEndsDate {Date} 선정마감일
 * @property submitStartsDate {Date} 제출시작일
 * @property submitEndsDate {Date} 제출마감일
 * @property postingGuide {string | null} 포스팅 가이드
 * @property caution {string | null} 주의사항
 * @property hashtag {Array<string> | null} 해시태그 배열
 * @property company {string} 회사명
 * @property managerName {string} 담당자명
 * @property managerTel {string} 전화번호
 * @property managerEmail {string | null} 이메일
 * @property thumbnail {string} 썸네일 base64
 * @property images {string[] | null} 세부이미지 base64 배열
 */
export class CreateCampaignRequestDto {
  @IsNotEmpty()
  @IsNumber()
  brandId: number;

  /*
   * 50자 까지 기재 가능, 영문은 2글자 기재시 1자
   * +, -, =, _ 이외의 특수문자 삽입 불가
   */
  @IsNotEmpty()
  @IsString()
  title: string;

  /*
   * 최대 9자리
   */
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(999999999)
  reward: number;

  @IsNotEmpty()
  @IsNumber()
  @IsEnum(CampaignChannel)
  channel: number;

  /*
   * 최대 9자리
   */
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(999999999)
  recruitment: number;

  @IsNotEmpty()
  @IsNumber()
  @IsEnum(CampaignRecruitmentCondition)
  recruitmentCondition: number;

  /*
   * 토요일, 일요일 선택 불가
   */
  @IsNotEmpty()
  recruitmentStartsDate: string;

  /*
   * 모집 시작 이후여야 함
   */
  @IsNotEmpty()
  recruitmentEndsDate: string;

  @IsNotEmpty()
  selectionEndsDate: string;

  @IsNotEmpty()
  submitStartsDate: string;

  @IsNotEmpty()
  submitEndsDate: string;

  /*
   * 한글, 특수문자, 영어 구분 없이 작성 가능
   */
  @IsString()
  @IsOptional()
  postingGuide: string | null;

  /*
   * 한글, 특수문자, 영어 구분 없이 작성 가능
   */
  @IsString()
  @IsOptional()
  caution: string | null;

  /*
   * 옵션 하나당 20자 이내 기입 가능
   */
  @IsArray()
  @IsOptional()
  hashtag: Array<string> | null;

  /*
   * 20자 이상 기재 불가
   */
  @IsString()
  @IsOptional()
  company: string;

  /*
   * 20자 이상 기재 불가
   */
  @IsString()
  @IsNotEmpty()
  managerName: string;

  /*
   * 20자 이상 기재 불가
   */
  @IsString()
  @IsNotEmpty()
  managerTel: string;

  @IsString()
  @IsOptional()
  managerEmail: string | null;

  @IsString()
  @IsNotEmpty()
  thumbnail: string;

  @IsOptional()
  @IsArray()
  images: string[] | null;
}
