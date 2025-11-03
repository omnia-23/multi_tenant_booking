import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsUUID()
  @IsNotEmpty()
  space_id: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  start_time: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  end_time: Date;
}
