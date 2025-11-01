import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { TenantRepository } from './repositories/tenant.repository';

@Module({
  controllers: [TenantController],
  providers: [TenantService, TenantRepository],
})
export class TenantModule {}
