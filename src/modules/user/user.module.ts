import { Module } from '@nestjs/common';
import { UserController } from '@src/modules/user/user.controller';
import { UserService } from '@src/modules/user/user.service';
import { PrismaModule } from '@src/modules/prisma/prisma.module';
import { AuthModule } from '@src/modules/auth/auth.module';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_HOST'),
          port: 465,
          secure: true,
          auth: {
            user: configService.get<string>('EMAIL_AUTH_USER'),
            pass: configService.get<string>('EMAIL_AUTH_PASSWORD'),
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
