import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EmailJoinRequestDto } from '@src/modules/user/dto/email-join-request.dto';
import { PrismaService } from '@src/modules/prisma/prisma.service';
import { ResponseDto } from '@src/common/dto/response.dto';
import { UserEntity } from '@src/entity/user.entity';
import { EmailLoginRequestDto } from '@src/modules/user/dto/email-login-request.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

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

  emailLogin(emailLoginRequestDto: EmailLoginRequestDto) {
    // 1. 이메일을 user에서 찾아서 user id 리턴
    // 2. user id로 user_auth 테이블 들어가서 비밀번호 비교
  }
}
