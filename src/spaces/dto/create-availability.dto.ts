import { IsUUID, IsInt, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateAvailabilityDto {
  @IsUUID()
  tenant_id: string;

  @IsUUID()
  space_id: string;

  @IsInt()
  weekday: number; // 0=Sunday .. 6=Saturday

  @IsDateString()
  @IsNotEmpty()
  start_time: string;

  @IsDateString()
  @IsNotEmpty()
  end_time: string;
}
