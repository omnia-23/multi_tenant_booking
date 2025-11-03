import { IsUUID, IsInt, IsNotEmpty, Matches } from 'class-validator';

export class CreateAvailabilityDto {
  @IsUUID()
  tenant_id: string;

  @IsUUID()
  space_id: string;

  @IsInt()
  weekday: number; // 0=Sunday .. 6=Saturday

  @IsNotEmpty()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, { message: 'start_time must be in HH:mm or HH:mm:ss format' })
  start_time: string;

  @IsNotEmpty()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, { message: 'end_time must be in HH:mm or HH:mm:ss format' })
  end_time: string;
}
