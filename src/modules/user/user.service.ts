import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EmailJoinRequestDto } from '@src/modules/user/dto/email-join-request.dto';
import { PrismaService } from '@src/modules/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  join(emailJoinRequestDto: EmailJoinRequestDto) {
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
      this.prismaService.$transaction(async (tx) => {
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
        return { isSuccess: true, code: 200, user, userAuth };
      });
    } catch (err) {
      console.log(err);

      throw new InternalServerErrorException(err);
    }
  }

  // cicd test
}
