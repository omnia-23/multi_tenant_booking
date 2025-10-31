// src/auth/guards/refresh-token.guard.ts
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('refresh-token') {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException({
        status: 401,
        message: 'Refresh token expired',
        code: 'REFRESH_TOKEN_EXPIRED',
        requiresLogin: true,
      });
    }

    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException({
        status: 401,
        message: 'Invalid refresh token',
        code: 'INVALID_REFRESH_TOKEN',
        requiresLogin: true,
      });
    }

    if (err || !user) {
      throw new UnauthorizedException({
        status: 401,
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
        requiresLogin: true,
      });
    }

    return user;
  }
}
