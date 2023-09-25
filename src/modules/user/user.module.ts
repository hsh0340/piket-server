import { Module } from '@nestjs/common';
import { UserController } from '@src/modules/user/user.controller';
import { UserService } from '@src/modules/user/user.service';
import { PrismaService } from '@src/modules/prisma/prisma.service';
import { AuthService } from '@src/modules/auth/auth.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, PrismaService, AuthService],
})
export class UserModule {}
