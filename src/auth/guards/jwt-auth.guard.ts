// src/auth/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException({
        status: 401,
        message: 'Access token expired',
        code: 'ACCESS_TOKEN_EXPIRED',
        requiresLogin: false,
      });
    }

    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException({
        status: 401,
        message: 'Invalid access token',
        code: 'INVALID_ACCESS_TOKEN',
        requiresLogin: false,
      });
    }

    if (err || !user) {
      throw new UnauthorizedException({
        status: 401,
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
        requiresLogin: false,
      });
    }

    return user;
  }
}
