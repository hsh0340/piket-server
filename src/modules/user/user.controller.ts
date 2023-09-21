import { Controller, Post } from '@nestjs/common';
import { UserService } from '@src/modules/user/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 회원가입 API
  @Post('email-join')
  join() {
    return this.userService.join();
  }

  // 이메일로그인 API
  @Post('login')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  login() {}

  // 카카오로그인 API

  // 네이버로그인 API

  // 구글로그인 API

  // 프로필조회 API

  // 프로필수정 API
}
