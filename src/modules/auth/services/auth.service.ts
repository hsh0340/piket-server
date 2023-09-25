import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * JWT token 생성 메서드
   */
  issueAccessToken(adminId: string): string {
    const payload = { adminId };

    return this.jwtService.sign(payload);
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
