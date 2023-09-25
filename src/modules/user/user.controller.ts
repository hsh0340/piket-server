import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '@src/modules/user/user.service';
import { EmailJoinRequestDto } from '@src/modules/user/dto/email-join-request.dto';
import { EmailLoginRequestDto } from '@src/modules/user/dto/email-login-request.dto';

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

  // 이메일로그인 API
  @Post('email-login')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  login(@Body() emailLoginRequestDto: EmailLoginRequestDto) {
    return this.userService.emailLogin(emailLoginRequestDto);
  }

  // 카카오로그인 API

  // 네이버로그인 API

  // 구글로그인 API

  // 프로필조회 API

  // 프로필수정 API
}
