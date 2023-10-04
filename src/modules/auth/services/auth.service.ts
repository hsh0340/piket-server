import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // access token 생성 메서드
  issueAccessToken(userNo: number): string {
    const payload = { userNo };
    return this.jwtService.sign(payload);
  }

  async issueRefreshToken(userNo: number): Promise<string> {
    const payload = { userNo };
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION'),
    });
    console.log(refreshToken);
    return refreshToken;
  }

  /**
   * 토큰 유효성 검사 메서드
   */
  async validateToken(tokenPayload): Promise<boolean> {
    const { exp } = tokenPayload;
    // 토큰 만료되면 false
    return exp >= Date.now() / 1000;
  }
}
