import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantModule } from './tenant/tenant.module';
import { SpacesModule } from './spaces/spaces.module';
import { BookingModule } from './booking/booking.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: `.env` }),
    DatabaseModule,
    AuthModule,
    UserModule,
    TenantModule,
    SpacesModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

