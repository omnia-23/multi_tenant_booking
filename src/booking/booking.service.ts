import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { eq, and, or, gte, lte, sql } from 'drizzle-orm';
import schema from '../database/database.schema';
import { DATABASE_CONNECTION } from '@/database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly database: NodePgDatabase<typeof schema>) {}

  async createBooking(createBookingDto: CreateBookingDto) {
    const { end_time, space_id, start_time, user_id } = createBookingDto;

    // Convert input ISO strings → Date objects
    const startTime = new Date(start_time);
    const endTime = new Date(end_time);

    // Derive weekday and total minutes since midnight (UTC)
    const dayOfWeek = startTime.getUTCDay();
    const bookingStartMinutes = startTime.getUTCHours() * 60 + startTime.getUTCMinutes();
    const bookingEndMinutes = endTime.getUTCHours() * 60 + endTime.getUTCMinutes();
    console.log({ bookingStartMinutes, bookingEndMinutes });
    // 1️⃣ Find a matching availability for this weekday + time range
    const availability = await this.database.query.spaceAvailabilities.findFirst({
      where: and(
        eq(schema.spaceAvailabilities.space_id, space_id),
        eq(schema.spaceAvailabilities.weekday, dayOfWeek),
        lte(
          sql`EXTRACT(HOUR FROM ${schema.spaceAvailabilities.start_time}) * 60 + EXTRACT(MINUTE FROM ${schema.spaceAvailabilities.start_time})`,
          bookingStartMinutes,
        ),
        gte(
          sql`EXTRACT(HOUR FROM ${schema.spaceAvailabilities.end_time}) * 60 + EXTRACT(MINUTE FROM ${schema.spaceAvailabilities.end_time})`,
          bookingEndMinutes,
        ),
      ),
    });

    console.log({ availability });

    if (!availability) {
      throw new BadRequestException('This space is not available on this day or time');
    }

    // 2️⃣ Normalize availability times to the same booking date
    const bookingDate = startTime;

    const [availStartHour, availStartMinute] = availability.start_time.split(':').map(Number);
    const [availEndHour, availEndMinute] = availability.end_time.split(':').map(Number);

    const availabilityStart = new Date(bookingDate);
    availabilityStart.setUTCHours(availStartHour, availStartMinute, 0, 0);

    const availabilityEnd = new Date(bookingDate);
    availabilityEnd.setUTCHours(availEndHour, availEndMinute, 0, 0);

    // 3️⃣ Ensure booking fits inside availability window
    if (startTime < availabilityStart || endTime > availabilityEnd) {
      throw new BadRequestException('Requested time is outside available hours');
    }

    // 4️⃣ Check overlapping bookings for the same space
    const overlappingBookings = await this.database.query.bookings.findMany({
      where: and(
        eq(schema.bookings.space_id, space_id),
        or(
          and(gte(schema.bookings.start_at, startTime), lte(schema.bookings.start_at, endTime)),
          and(gte(schema.bookings.end_at, startTime), lte(schema.bookings.end_at, endTime)),
          and(lte(schema.bookings.start_at, startTime), gte(schema.bookings.end_at, endTime)),
        ),
      ),
    });

    if (overlappingBookings.length > 0) {
      throw new BadRequestException('This slot is already booked');
    }

    // 5️⃣ Check overlapping bookings for same user
    const userConflicts = await this.database.query.bookings.findMany({
      where: and(
        eq(schema.bookings.user_id, user_id),
        or(
          and(gte(schema.bookings.start_at, startTime), lte(schema.bookings.start_at, endTime)),
          and(gte(schema.bookings.end_at, startTime), lte(schema.bookings.end_at, endTime)),
        ),
      ),
    });

    if (userConflicts.length > 0) {
      throw new BadRequestException('You already have a booking at this time');
    }

    // 6️⃣ Create the booking record
    const [booking] = await this.database
      .insert(schema.bookings)
      .values({
        user_id,
        space_id,
        start_at: startTime,
        end_at: endTime,
        tenant_id: availability.tenant_id,
      })
      .returning();

    return booking;
  }
}
