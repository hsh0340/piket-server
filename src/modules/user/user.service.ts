import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/prisma/prisma.service';
import { EmailJoinRequestDto } from '@src/modules/user/dto/email-join-request.dto';

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
    return this.prismaService.user.create({
      data: {
        email,
        loginType: 0, // login type default 값
      },
    });
  }
}
