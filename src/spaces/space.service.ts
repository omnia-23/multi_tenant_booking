import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { SpaceRepository } from './repositories/space.repository';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { startOfToday } from 'date-fns';
import { User } from '@/common/decorators/get-user.decorator';

@Injectable()
export class SpacesService {
  constructor(private readonly repo: SpaceRepository) {}

  // Spaces
  async createSpace(dto: CreateSpaceDto, user: User) {
    if (user.tenant_id !== dto.tenant_id) {
      throw new ForbiddenException('not allow to add space');
    }

    const space = await this.repo.createSpace({
      tenant_id: dto.tenant_id,
      name: dto.name,
      is_active: dto.is_active ?? true,
    });

    // If weekly availability is defined
    if (dto.weekly_availability) {
      const { start_day, end_day, start_time, end_time } = dto.weekly_availability;
      const availabilities = [];

      for (let day = start_day; day <= end_day; day++) {
        availabilities.push({
          tenant_id: dto.tenant_id,
          space_id: space.id,
          weekday: day,
          start_time: new Date(`${startOfToday().toISOString().split('T')[0]}T${start_time}`),
          end_time: new Date(`${startOfToday().toISOString().split('T')[0]}T${end_time}`),
        });
      }

      await this.repo.bulkCreateAvailabilities(availabilities);
    }

    return space;
  }

  findAllSpaces(tenantId: string) {
    return this.repo.findAllSpaces(tenantId);
  }

  async findSpaceById(id: string) {
    const space = await this.repo.findSpaceById(id);
    if (!space) throw new NotFoundException('Space not found');
    return space;
  }

  async updateSpace(id: string, dto: UpdateSpaceDto) {
    await this.findSpaceById(id);
    return this.repo.updateSpace(id, dto);
  }

  async deleteSpace(id: string) {
    await this.findSpaceById(id);
    return this.repo.deleteSpace(id);
  }

  // Availabilities
  createAvailability(dto: CreateAvailabilityDto, user: User) {
    if (user.tenant_id !== dto.tenant_id) {
      throw new ForbiddenException('not allow to add space');
    }
    return this.repo.createAvailability({
      ...dto,
    });
  }

  findAvailabilitiesBySpace(spaceId: string) {
    return this.repo.findAvailabilitiesBySpace(spaceId);
  }

  async updateAvailability(id: string, dto: UpdateAvailabilityDto) {
    return this.repo.updateAvailability(id, {
      ...dto,
    });
  }

  deleteAvailability(id: string) {
    return this.repo.deleteAvailability(id);
  }
}
