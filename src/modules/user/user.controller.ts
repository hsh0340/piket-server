import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '@src/modules/user/user.service';
import { EmailJoinRequestDto } from '@src/modules/user/dto/email-join-request.dto';
import { EmailLoginRequestDto } from '@src/modules/user/dto/email-login-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { FindEmailRequestDto } from '@src/modules/user/dto/find-email-request.dto';
import { CellPhoneDto } from '@src/modules/user/dto/cell-phone.dto';
import { EmailDto } from '@src/modules/user/dto/email.dto';
import { RolesGuard } from '@src/modules/auth/guards/roles.guard';
import { Roles } from '@src/modules/auth/decorators/roles.decorator';
import { RoleType } from '@src/modules/auth/types/role-type';
import { User } from '@src/modules/auth/decorators/user.decorator';
import { ResponseSerializationInterceptor } from '@src/common/interceptors/response-serialization.interceptor';
import { UserEntity } from '@src/entity/user.entity';

@UseInterceptors(ResponseSerializationInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /*
   * 이메일 회원가입 API
   */
  @Post('email-join')
  async emailJoin(
    @Body() emailJoinRequestDto: EmailJoinRequestDto,
  ): Promise<{ userNo: number }> {
    const userNo = await this.userService.emailJoin(emailJoinRequestDto);
    return { userNo };
  }

  /*
   * 전화번호 중복체크 API
   */
  @Post('phone-check')
  async phoneCheck(@Body() cellPhone: CellPhoneDto): Promise<string> {
    await this.userService.phoneDuplicateCheck(cellPhone);
    return '사용 가능한 전화번호입니다.';
  }

  /*
   * 이메일 중복체크 API
   */
  @Post('email-check')
  async emailCheck(@Body() emailDto: EmailDto): Promise<string> {
    await this.userService.emailDuplicateCheck(emailDto);
    return '사용 가능한 이메일입니다.';
  }

  /*
   * 이메일로그인 API
   */
  @Post('email-login')
  emailLogin(@Body() emailLoginRequestDto: EmailLoginRequestDto): Promise<{
    accessToken: string;
    refreshToken: string;
    userNo: number;
    userRoleType: number;
    userName: string;
  }> {
    return this.userService.emailLogin(emailLoginRequestDto);
  }

  /*
   * 이메일 찾기 API
   */
  @Post('find-email')
  findEmail(@Body() findEmailRequestDto: FindEmailRequestDto): Promise<{
    userNo: number;
    email: string;
  }> {
    return this.userService.findEmail(findEmailRequestDto);
  }

  /*
   * 비밀번호 찾기 API
   */
  @Post('find-password')
  verifyEmail(
    @Body() emailDto: EmailDto,
  ): Promise<{ userNo: number; cellPhone: string; email: string }> {
    return this.userService.findPassword(emailDto);
  }

  /*
   * 임시 비밀번호 메일 발송 API
   */
  @Post('send-temp-password-email')
  async sendTempPasswordEmail(@Body() emailDto: EmailDto): Promise<string> {
    await this.userService.sendTempPasswordEmail(emailDto);
    return '이메일 발송에 성공하였습니다.';
  }

  /*
   * 비밀번호 재설정 API
   */
  @Post('reset-password/:userNo')
  async resetPassword(
    @Param('userNo', new ParseIntPipe()) userNo: number,
    @Body('tempPassword') tempPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    await this.userService.resetPassword(userNo, tempPassword, newPassword);
    return '비밀번호 변경에 성공하였습니다.';
  }

  /*
   * 로그인 권한 테스트 API
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.UNDEFINED)
  @Get('login-test')
  loginAuthTest(@User() user: UserEntity) {
    return user;
  }

  // 카카오로그인 API

  // 네이버로그인 API

  // 구글로그인 API

  // 프로필조회 API

  // 프로필수정 API
}
