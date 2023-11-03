export class GetCampaignsOfAdvertiserResponseDto {
  id: number;
  brandName: string;
  brandCategory: string;
  channel: string;
  title: string;
  type: string;
  reward: number;
  recruitment: number;
  // numberOfApplicants: number;
  // numberOfPeopleSelected: number;
  // numberOfPeopleSubmitted: number;
  selectionEndsDate: string;
  submitEndsDate: string;
  status: number;
}
