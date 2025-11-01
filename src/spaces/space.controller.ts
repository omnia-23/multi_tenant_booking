import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateSpaceDto, UpdateSpaceDto, CreateAvailabilityDto, UpdateAvailabilityDto } from './dto';
import { SpacesService } from './space.service';

@Controller('spaces')
export class SpaceController {
  constructor(private readonly service: SpacesService) {}

  @Post()
  createSpace(@Body() dto: CreateSpaceDto) {
    return this.service.createSpace(dto);
  }

  @Get()
  findAllSpaces(@Query('tenant_id') tenantId: string) {
    return this.service.findAllSpaces(tenantId);
  }

  @Get(':id')
  findSpace(@Param('id') id: string) {
    return this.service.findSpaceById(id);
  }

  @Patch(':id')
  updateSpace(@Param('id') id: string, @Body() dto: UpdateSpaceDto) {
    return this.service.updateSpace(id, dto);
  }

  @Delete(':id')
  deleteSpace(@Param('id') id: string) {
    return this.service.deleteSpace(id);
  }

  // Availability routes
  @Post('availability')
  createAvailability(@Body() dto: CreateAvailabilityDto) {
    return this.service.createAvailability(dto);
  }

  @Get(':spaceId/availability')
  getAvailabilities(@Param('spaceId') spaceId: string) {
    return this.service.findAvailabilitiesBySpace(spaceId);
  }

  @Patch('availability/:id')
  updateAvailability(@Param('id') id: string, @Body() dto: UpdateAvailabilityDto) {
    return this.service.updateAvailability(id, dto);
  }

  @Delete('availability/:id')
  deleteAvailability(@Param('id') id: string) {
    return this.service.deleteAvailability(id);
  }
}
