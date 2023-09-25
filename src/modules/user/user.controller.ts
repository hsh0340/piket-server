import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from '@src/modules/user/user.service';
import { EmailJoinRequestDto } from '@src/modules/user/dto/email-join-request.dto';
import { EmailLoginRequestDto } from '@src/modules/user/dto/email-login-request.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 회원가입 API
  @Post('email-join')
  async emailJoin(@Body() emailJoinRequestDto: EmailJoinRequestDto) {
    console.log('start');
    const result = await this.userService.emailJoin(emailJoinRequestDto);
    console.log('end');
    console.log(result);
    return result;
  }

  // 이메일 중복체크 API
  @Post('email-check')
  emailCheck(@Body('email') email: string) {
    return this.userService.emailCheck(email);
  }

  // 이메일로그인 API
  @Post('email-login')
  emailLogin(@Body() emailLoginRequestDto: EmailLoginRequestDto) {
    return this.userService.emailLogin(emailLoginRequestDto);
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
