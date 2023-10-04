import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@src/modules/prisma/prisma.service';
import { UserNotFoundException } from '@src/common/exceptions/request.exception';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: any) {
    // 유효한 유저인지 확인
    const { userNo, exp } = payload;
    const user = await this.prismaService.user.findFirst({
      where: {
        no: userNo,
      },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    // access token 유효시간 지났는지 확인
    const currentTime = Date.now() / 1000;
    console.log(currentTime);
    if (currentTime > exp) {
      throw new UnauthorizedException('유효기간 만료');
    }

    return user;
  }
}
