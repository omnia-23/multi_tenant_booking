import { Module } from '@nestjs/common';
import { SpacesService } from './space.service';
import { SpaceRepository } from './repositories/space.repository';
import { SpaceController } from './space.controller';

@Module({
  controllers: [SpaceController],
  providers: [SpacesService, SpaceRepository],
  exports: [SpacesService],
})
export class SpaceModule {}
