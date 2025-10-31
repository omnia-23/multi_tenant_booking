import { Role } from '@/user/enums/role.enum';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface User {
  email: string;
  userId: string;
  role: Role;
  role_id?: string;
}

export const GetUser = createParamDecorator((data: keyof User | undefined, ctx: ExecutionContext): User | string => {
  const request = ctx.switchToHttp().getRequest();
  const user: User = request.user;

  if (data) {
    return user?.[data];
  }

  return user;
});
