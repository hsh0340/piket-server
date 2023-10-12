import { IsNotEmpty, IsString } from 'class-validator';

/**
 * @property {string} name 이메일 찾으려는 유저의 이름
 * @property {string} cellPhone 이메일 찾으려는 유저의 비밀번호
 */
export class FindEmailRequestDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  cellPhone: string;
}
