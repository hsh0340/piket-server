import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { EmailJoinRequestDto } from '@src/modules/user/dto/email-join-request.dto';
import { PrismaService } from '@src/modules/prisma/prisma.service';
import { ResponseDto } from '@src/common/dto/response.dto';
import { UserEntity } from '@src/entity/user.entity';
import { EmailLoginRequestDto } from '@src/modules/user/dto/email-login-request.dto';
import { AuthService } from '@src/modules/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async emailJoin(emailJoinRequestDto: EmailJoinRequestDto) {
    const {
      cellPhone,
      password,
      email,
      name,
      sex,
      tosAgree,
      personalInfoAgree,
      ageLimitAgree,
      mailAgree,
      notificationAgree,
    } = emailJoinRequestDto;

    try {
      const query = await this.prismaService.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email,
            loginType: 0,
            role: 0,
          },
        });

        const userAuth = await tx.userAuthentication.create({
          data: {
            userNo: user.no,
            password,
            name,
            cellPhone,
            sex,
            tosAgree,
            personalInfoAgree,
            ageLimitAgree,
            mailAgree,
            notificationAgree,
          },
        });

        const result = {
          isSuccess: true,
          code: 200,
          message: '유저가 생성되었습니다.',
          result: user,
        };

        console.log(`result: ${result.isSuccess}`);
        return result;
      });
      return query;
    } catch (err) {
      throw err;
    }
  }

  async emailLogin(emailLoginRequestDto: EmailLoginRequestDto) {
    // 1. 이메일을 user에서 찾아서 user id 리턴
    const { email, password } = emailLoginRequestDto;
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestException('존재하지 않는 유저입니다.');
    }
    // 2. user id로 user_auth 테이블 들어가서 비밀번호 비교
    const savedAuth = await this.prismaService.userAuthentication.findFirst({
      where: {
        userNo: user.no,
      },
    });

    if (password !== savedAuth.password) {
      throw new BadRequestException('비밀번호가 다릅니다.');
    }

    // 토큰 발급
    // user.no는 payload 자리 : 임시로 넣어둠
    this.authService.issueJwtToken(user.no);
  }
}
