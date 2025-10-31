import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { TokenService } from './token.service';
import { UserResponseDto } from '@/user/dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.validateUserPassword(email, password);
    if (user) {
      return user;
    }
    return null;
  }

  async login(user: UserResponseDto) {
    const accessToken = this.tokenService.createAccessToken({
      user_id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = this.tokenService.createRefreshToken({
      user_id: user.id,
      email: user.email,
    });

    const foundUser = await this.userService.findByEmail(user.email);

    await this.userService.update(foundUser.id, { refresh_token: refreshToken });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: { ...foundUser },
    };
  }
}
