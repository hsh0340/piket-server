import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from '@src/common/middlewares/logger.middleware';
import { AuthModule } from '@src/modules/auth/auth.module';
import { UserModule } from '@src/modules/user/user.module';
import { HealthModule } from '@src/modules/health/health.module';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { ValidationPipe } from '@src/common/pipes/validation.pipe';
import { CacheModule } from '@nestjs/cache-manager';
import { BrandModule } from '@src/modules/brand/brand.module';
import * as redisStore from 'cache-manager-ioredis';
import { APP_PIPE } from "@nestjs/core";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    CacheModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('CACHE_HOST'),
        // host: '127.0.0.1',
        port: configService.get<number>('CACHE_PORT'),
        ttl: 100000,
      }),
      inject: [ConfigService],
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    HealthModule,
    BrandModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
