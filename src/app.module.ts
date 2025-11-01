import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantModule } from './tenant/tenant.module';
import { SpacesModule } from './spaces/spaces.module';
import { BookingModule } from './bookings/bookings.module';

@Module({
  imports: [TenantModule, SpacesModule, BookingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
