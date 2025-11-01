import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, IsInt, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

class WeeklyAvailabilityDto {
  @IsInt()
  start_day: number; // 0=Sunday .. 6=Saturday
  @IsInt()
  end_day: number;

  @IsDateString()
  start_time: string;

  @IsDateString()
  end_time: string;
}

export class CreateSpaceDto {
  @IsUUID()
  tenant_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @Type(() => WeeklyAvailabilityDto)
  weekly_availability?: WeeklyAvailabilityDto;
}
