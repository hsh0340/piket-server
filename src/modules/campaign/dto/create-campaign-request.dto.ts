/**
 * @property brandId {number} 브랜드 고유번호
 * @property productPrice {number} 제품 가격
 * @property title {string} 캠페인 제목
 * @property info {string} 상품정보
 * @property type {string} 진행방식
 * @property reward {number} 리워드
 * @property channel {number} 진행채널
 * @property recruitment {number} 모집인원
 * @property recruitmentCondition {number} 모집조건
 * @property recruitmentStartsDate {Date} 모집시작일
 * @property recruitmentEndsDate {Date} 모집마감일
 * @property selectionEndsDate {Date} 선정마감일
 * @property experienceEndsDate {Date} 체험마감일
 * @property submitStartsDate {Date} 제출시작일
 * @property submitEndsDate {Date} 제출마감일
 * @property postingGuide {string | null} 포스팅 가이드
 * @property caution {string | null} 주의사항
 * @property hashtag {Array>string | null} 해시태그 배열
 * @property company {string} 회사명
 * @property managerName {string} 담당자명
 * @property managerTel {string} 전화번호
 * @property managerEmail {string | null} 이메일
 * @property options {Array<{ name: string; values: Array<string> }> | null} 옵션 배열
 */
export class CreateCampaignRequestDto {
  brandId: number;
  productPrice: number;
  title: string;
  info: string;
  type: number;
  reward: number;
  channel: number;
  recruitment: number;
  recruitmentCondition: number;
  recruitmentStartsDate: Date;
  recruitmentEndsDate: Date;
  selectionEndsDate: Date;
  experienceEndsDate: Date;
  submitStartsDate: Date;
  submitEndsDate: Date;
  postingGuide: string | null;
  caution: string | null;
  hashtag: Array<string> | null;
  company: string | null;
  managerName: string;
  managerTel: string;
  managerEmail: string | null;
  options: Array<{ name: string; values: Array<string> }> | null;
}
