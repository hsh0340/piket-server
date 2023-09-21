import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  join() {
    return this.prismaService.user.create({
      data: {
        email: 'test',
        login_type: 0,
      },
    });
  }
}
