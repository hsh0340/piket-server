import { BadRequestException, Injectable } from '@nestjs/common';
import { EmailJoinRequestDto } from '@src/modules/user/dto/email-join-request.dto';
import { PrismaService } from '@src/modules/prisma/prisma.service';
import { EmailLoginRequestDto } from '@src/modules/user/dto/email-login-request.dto';
import { AuthService } from '@src/modules/auth/services/auth.service';
import { SuccessResponse } from '@src/common/interfaces/response.interface';

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

        const response: SuccessResponse<{ userNo: number }> = {
          isSuccess: true,
          code: '1000',
          message: '요청에 성공하였습니다.',
          result: { userNo: user.no },
        };

        return response;
      });
      return query;
    } catch (err) {
      throw err;
    }
  }

  async emailCheck(email: string) {
    const isEmailExist = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (isEmailExist) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    return null;
  }

  async emailLogin(emailLoginRequestDto: EmailLoginRequestDto) {
    const { email, password } = emailLoginRequestDto;
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestException('존재하지 않는 유저입니다.');
    }

    const savedAuth = await this.prismaService.userAuthentication.findFirst({
      where: {
        userNo: user.no,
        password,
      },
    });

    if (!savedAuth) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    const accessToken = this.authService.issueAccessToken('hi');
    return { accessToken, user: { ...user, ...savedAuth } };
  }
}
