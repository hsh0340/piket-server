import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from '@src/common/middlewares/logger.middleware';
import { AuthModule } from '@src/modules/auth/auth.module';
import { PrismaModule } from '@src/modules/prisma/prisma.module';
import { UserModule } from '@src/modules/user/user.module';
import { HealthModule } from '@src/modules/health/health.module';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    AuthModule,
    PrismaModule,
    UserModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
