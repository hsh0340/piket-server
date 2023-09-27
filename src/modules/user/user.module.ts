import { Module } from '@nestjs/common';
import { UserController } from '@src/modules/user/user.controller';
import { UserService } from '@src/modules/user/user.service';
import { PrismaModule } from '@src/modules/prisma/prisma.module';
import { AuthModule } from '@src/modules/auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-ioredis';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    CacheModule.register({
      store: redisStore,
      host: '127.0.0.1',
      port: 6379,
      ttl: 100000, // 없는 경우 default 5초
    }),
    // CacheModule.registerAsync({
    //   useFactory: (configService: ConfigService) => ({
    //     store: redisStore,
    //     host: configService.get<string>('CACHE_HOST'),
    //     port: configService.get<number>('CACHE_PORT'),
    //     ttl: 100000,
    //   }),
    //   inject: [ConfigService],
    // }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.example.com',
          port: 587,
          auth: {
            user: 'email address',
            pass: 'password',
          },
        },
        defaults: {
          from: '"no-reply" <email address>',
        },
        preview: true,
      }),
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
