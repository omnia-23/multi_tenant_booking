import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingsController } from './booking.controller';

@Module({
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
