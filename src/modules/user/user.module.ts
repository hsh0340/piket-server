import { Module } from '@nestjs/common';
import { UserController } from '@src/modules/user/user.controller';
import { UserService } from '@src/modules/user/user.service';
import { PrismaModule } from '@src/modules/prisma/prisma.module';
import { AuthModule } from '@src/modules/auth/auth.module';

@Module({
  imports: [AuthModule, PrismaModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
