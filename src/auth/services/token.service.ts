// src/auth/token.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  createAccessToken({ user_id, email, role }: { user_id: string; email: string; role: string }): string {
    const payload: JwtPayload = { email, sub: user_id, type: 'access', role };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('NODE_ENV') === 'development' ? '7d' : '15m',
    });
  }

  createRefreshToken({ user_id, email }: { user_id: string; email: string }): string {
    const payload: JwtPayload = { email, sub: user_id, type: 'refresh', role: '' };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: '7d',
    });
  }

  verifyToken(token: string, type: 'access' | 'refresh'): JwtPayload {
    const secret =
      type === 'access'
        ? this.configService.get('ACCESS_TOKEN_SECRET')
        : this.configService.get('REFRESH_TOKEN_SECRET');

    return this.jwtService.verify(token, { secret });
  }
}
