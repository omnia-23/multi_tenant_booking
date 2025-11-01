import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repositories/base.repository';
import { eq } from 'drizzle-orm';
import * as schema from '../space.schema';
import { CreateSpaceDto } from '../dto/create-space.dto';
import { UpdateSpaceDto } from '../dto/update-space.dto';
import { SpaceResponseDto } from '../dto/space-response.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class SpaceRepository extends BaseRepository<SpaceResponseDto, CreateSpaceDto, UpdateSpaceDto, typeof schema> {
  constructor(database: NodePgDatabase<typeof schema>) {
    super(database, schema.spaces);
  }

  // Spaces CRUD
  async createSpace(data: typeof schema.spaces.$inferInsert) {
    const [space] = await this.database.insert(schema.spaces).values(data).returning();
    return space;
  }

  async bulkCreateAvailabilities(data: (typeof schema.spaceAvailabilities.$inferInsert)[]) {
    return this.database.insert(schema.spaceAvailabilities).values(data).returning();
  }

  async findAllSpaces(tenantId?: string) {
    const query = this.database.select().from(schema.spaces);

    if (tenantId) {
      query.where(eq(schema.spaces.tenant_id, tenantId));
    }

    return query;
  }

  async findSpaceById(id: string) {
    const [space] = await this.database.select().from(schema.spaces).where(eq(schema.spaces.id, id));
    return space;
  }

  async updateSpace(id: string, data: Partial<typeof schema.spaces.$inferInsert>) {
    const [space] = await this.database.update(schema.spaces).set(data).where(eq(schema.spaces.id, id)).returning();
    return space;
  }

  async deleteSpace(id: string) {
    await this.database.delete(schema.spaces).where(eq(schema.spaces.id, id));
    return true;
  }

  // Availabilities CRUD
  async createAvailability(data: typeof schema.spaceAvailabilities.$inferInsert) {
    const [availability] = await this.database.insert(schema.spaceAvailabilities).values(data).returning();
    return availability;
  }

  async findAvailabilitiesBySpace(spaceId: string) {
    return this.database
      .select()
      .from(schema.spaceAvailabilities)
      .where(eq(schema.spaceAvailabilities.space_id, spaceId));
  }

  async updateAvailability(id: string, data: Partial<typeof schema.spaceAvailabilities.$inferInsert>) {
    const [availability] = await this.database
      .update(schema.spaceAvailabilities)
      .set(data)
      .where(eq(schema.spaceAvailabilities.id, id))
      .returning();
    return availability;
  }

  async deleteAvailability(id: string) {
    await this.database.delete(schema.spaceAvailabilities).where(eq(schema.spaceAvailabilities.id, id));
    return true;
  }
}
