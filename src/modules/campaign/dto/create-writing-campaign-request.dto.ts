import { PickType } from '@nestjs/swagger';
import { CreateCampaignRequestDto } from '@src/modules/campaign/dto/create-campaign-request.dto';

/**
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
 * @property thumbnail {string} 썸네일 이미지
 * @property images {Array<string>} 세부 이미지 배열
 * @property postingGuide {string | null} 포스팅 가이드
 * @property caution {string | null} 주의사항
 * @property hashtag {Array<string> | null} 해시태그 배열
 * @property company {string} 회사명
 * @property managerName {string} 담당자명
 * @property managerTel {string} 전화번호
 * @property managerEmail {string | null} 이메일
 */
export class CreateWritingCampaignRequestDto extends PickType(
  CreateCampaignRequestDto,
  [
    'brandId',
    'title',
    'reward',
    'channel',
    'recruitment',
    'recruitmentCondition',
    'recruitmentStartsDate',
    'recruitmentEndsDate',
    'selectionEndsDate',
    'submitStartsDate',
    'submitEndsDate',
    'thumbnail',
    'images',
    'postingGuide',
    'caution',
    'hashtag',
    'company',
    'managerName',
    'managerTel',
    'managerEmail',
  ] as const,
) {}
