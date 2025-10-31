import { Expose } from 'class-transformer';
import { Role } from '../enums/role.enum';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  password: string;

  @Expose()
  role: Role;

  @Expose()
  tenant_id: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  deleted_at?: Date;
}
