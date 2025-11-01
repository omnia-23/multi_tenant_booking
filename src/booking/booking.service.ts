import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { eq, and, or, gte, lte } from 'drizzle-orm';
import schema from '../database/database.schema';
import { DATABASE_CONNECTION } from '@/database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly database: NodePgDatabase<typeof schema>) {}

  async createBooking(createBookingDto: CreateBookingDto) {
    const { endTime, startTime, spaceId, userId } = createBookingDto;

    // Validate availability
    const dayOfWeek = startTime.getDay();

    const availability = await this.database.query.spaceAvailabilities.findFirst({
      where: and(eq(schema.spaceAvailabilities.space_id, spaceId), eq(schema.spaceAvailabilities.weekday, dayOfWeek)),
    });

    if (!availability) {
      throw new BadRequestException('This space is not available on this day');
    }

    // Step 2️⃣: Normalize availability to the same date as booking
    const bookingDate = new Date(startTime);

    const availabilityStart = new Date(bookingDate);
    availabilityStart.setHours(availability.start_time.getHours(), availability.start_time.getMinutes(), 0, 0);

    const availabilityEnd = new Date(bookingDate);
    availabilityEnd.setHours(availability.end_time.getHours(), availability.end_time.getMinutes(), 0, 0);

    // Step 3️⃣: Ensure requested times are within availability
    if (startTime < availabilityStart || endTime > availabilityEnd) {
      throw new BadRequestException('Requested time is outside available hours');
    }
    // Step 4️⃣: Prevent overlapping bookings for this space
    const overlappingBookings = await this.database.query.bookings.findMany({
      where: and(
        eq(schema.bookings.space_id, spaceId),
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

    // Step 5️⃣: Prevent user from double-booking
    const userConflicts = await this.database.query.bookings.findMany({
      where: and(
        eq(schema.bookings.user_id, userId),
        or(
          and(gte(schema.bookings.start_at, startTime), lte(schema.bookings.start_at, endTime)),
          and(gte(schema.bookings.end_at, startTime), lte(schema.bookings.end_at, endTime)),
        ),
      ),
    });

    if (userConflicts.length > 0) {
      throw new BadRequestException('You already have a booking at this time');
    }

    // Step 6️⃣: Create booking
    const [booking] = await this.database
      .insert(schema.bookings)
      .values({
        user_id: userId,
        space_id: spaceId,
        start_at: startTime,
        end_at: endTime,
        tenant_id: availability.tenant_id,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    return booking;
  }
}
