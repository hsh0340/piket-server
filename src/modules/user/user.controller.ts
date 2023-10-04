import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { UserService } from '@src/modules/user/user.service';
import { EmailJoinRequestDto } from '@src/modules/user/dto/email-join-request.dto';
import { EmailLoginRequestDto } from '@src/modules/user/dto/email-login-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { FindEmailRequestDto } from '@src/modules/user/dto/find-email-request.dto';
import { CellPhoneDto } from '@src/modules/user/dto/cell-phone.dto';
import { EmailDto } from '@src/modules/user/dto/email.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 회원가입 API
  @Post('email-join')
  async emailJoin(@Body() emailJoinRequestDto: EmailJoinRequestDto) {
    return await this.userService.emailJoin(emailJoinRequestDto);
  }

  // 전화번호 중복체크 API
  @Post('phone-check')
  phoneCheck(@Body() cellPhone: CellPhoneDto) {
    return this.userService.phoneCheck(cellPhone);
  }

  // 이메일 중복체크 API
  @Post('email-check')
  emailCheck(@Body() emailDto: EmailDto) {
    return this.userService.emailCheck(emailDto);
  }

  // 이메일로그인 API
  @Post('email-login')
  emailLogin(@Body() emailLoginRequestDto: EmailLoginRequestDto) {
    return this.userService.emailLogin(emailLoginRequestDto);
  }

  // 이메일 찾기 API
  @Post('find-email')
  findEmail(@Body() findEmailRequestDto: FindEmailRequestDto) {
    return this.userService.findEmail(findEmailRequestDto);
  }

  // 비밀번호 찾기
  @Post('find-password')
  verifyEmail(@Body() emailDto: EmailDto) {
    return this.userService.findPassword(emailDto);
  }

  // 비밀번호 재설정 메일 발송 API
  @Post('send-password-reset-email')
  sendPasswordResetEmail(@Body() emailDto: EmailDto) {
    return this.userService.sendPasswordResetEmail(emailDto);
  }

  @Get('reset-password/:token')
  verifyPasswordToken(@Param('token') token: string) {
    return this.userService.verifyPasswordToken(token);
  }

  // 로그인 권한 테스트 API
  @UseGuards(AuthGuard('jwt'))
  @Get('login-test')
  loginAuthTest() {
    return '로그인 된 상태입니다.';
  }

  // 카카오로그인 API

  // 네이버로그인 API

  // 구글로그인 API

  // 프로필조회 API

  // 프로필수정 API
}
