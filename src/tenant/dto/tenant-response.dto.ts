import { Expose } from 'class-transformer';

export class TenantResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  deleted_at?: Date;
}
