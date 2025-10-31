import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Role } from '@/user/enums/role.enum';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

export const AuthorizationDecorator = (roles?: Role[]) => {
  return applyDecorators(SetMetadata('roles', roles), UseGuards(JwtAuthGuard, RolesGuard));
};
