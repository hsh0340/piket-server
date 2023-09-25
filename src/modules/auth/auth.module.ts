import { Module } from '@nestjs/common';
import { AuthService } from '@src/modules/auth/auth.service';

@Module({
  providers: [AuthService],
})
export class AuthModule {}
