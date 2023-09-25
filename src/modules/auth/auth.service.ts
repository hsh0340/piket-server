import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  issueJwtToken(payload) {
    // 토큰 발급할 때 토큰에 무슨 정보 넣을건지?
    this.jwtService.sign(payload);
  }
}
