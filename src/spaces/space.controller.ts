import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateSpaceDto, UpdateSpaceDto, CreateAvailabilityDto, UpdateAvailabilityDto } from './dto';
import { SpacesService } from './space.service';
import { AuthorizationDecorator } from '@/common/decorators/auth.decorator';
import { GetUser, User } from '@/common/decorators/get-user.decorator';

@Controller('spaces')
export class SpaceController {
  constructor(private readonly service: SpacesService) {}

  @Post()
  @AuthorizationDecorator(['super_admin', 'admin'])
  createSpace(@Body() dto: CreateSpaceDto, @GetUser() user: User) {
    return this.service.createSpace(dto, user);
  }

  @Get()
  @AuthorizationDecorator(['super_admin', 'admin'])
  findAllSpaces(@Query('tenant_id') tenantId: string) {
    return this.service.findAllSpaces(tenantId);
  }

  @Get(':id')
  @AuthorizationDecorator(['super_admin', 'admin'])
  findSpace(@Param('id') id: string) {
    return this.service.findSpaceById(id);
  }

  @Patch(':id')
  @AuthorizationDecorator(['super_admin', 'admin'])
  updateSpace(@Param('id') id: string, @Body() dto: UpdateSpaceDto) {
    return this.service.updateSpace(id, dto);
  }

  @Delete(':id')
  @AuthorizationDecorator(['super_admin', 'admin'])
  deleteSpace(@Param('id') id: string) {
    return this.service.deleteSpace(id);
  }

  // Availability routes
  @Post('availability')
  @AuthorizationDecorator(['super_admin', 'admin'])
  createAvailability(@Body() dto: CreateAvailabilityDto, @GetUser() user: User) {
    return this.service.createAvailability(dto, user);
  }

  @Get(':spaceId/availability')
  @AuthorizationDecorator(['super_admin', 'admin'])
  getAvailabilities(@Param('spaceId') spaceId: string) {
    return this.service.findAvailabilitiesBySpace(spaceId);
  }

  @Patch('availability/:id')
  @AuthorizationDecorator(['super_admin', 'admin'])
  updateAvailability(@Param('id') id: string, @Body() dto: UpdateAvailabilityDto) {
    return this.service.updateAvailability(id, dto);
  }

  @Delete('availability/:id')
  @AuthorizationDecorator(['super_admin', 'admin'])
  deleteAvailability(@Param('id') id: string) {
    return this.service.deleteAvailability(id);
  }
}
