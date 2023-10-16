export class CreateCampaignRequestDto {
  brandId: number;
  productPrice: number;
  title: string;
  info: string;
  type: number;
  reward: number;
  channel: number;
  recruitment: number;
  recruitment_condition: number;
  recruitment_starts_date: Date;
  recruitment_ends_date: Date;
  selection_ends_date: Date;
  experience_ends_date: Date;
  submit_starts_date: Date;
  submit_ends_date: Date;
  posting_guide: string | null;
  caution: string | null;
  hashtag: Array<string> | null;
  company: string | null;
  managerName: string;
  managerTel: string;
  managerEmail: string | null;
  options: Array<{ name: string; values: Array<string> }>;
}
