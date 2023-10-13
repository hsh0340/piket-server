/**
 * 브랜드 목록 조회 DTO
 * @property {number} id 브랜드 고유번호
 * @property {number} categoryId 카테고리 고유번호
 * @property {string} name 브랜드명
 * @property {string} description 브랜드 설명
 */
export class GetAllBrandsDto {
  id: number;
  categoryId: number;
  name: string;
  description: string;
}
