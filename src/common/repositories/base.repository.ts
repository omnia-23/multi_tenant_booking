import { DATABASE_CONNECTION } from '@/database/database-connection';
import { Inject, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IBaseRepository } from './base.interface';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { PaginationQueryDto, PaginatedResponseDto } from '../dto/pagination.dto';
import { eq, getTableColumns, getTableName } from 'drizzle-orm';
import { filterSoftDelete } from '../utils/filterSoftDelete.helper';
import { withPagination } from '../utils/pagination.helper';

export abstract class BaseRepository<T, CreateDto, UpdateDto, Schema extends Record<string, unknown>>
  implements IBaseRepository<T, CreateDto, UpdateDto>
{
  constructor(
    @Inject(DATABASE_CONNECTION) readonly database: NodePgDatabase<Schema>,
    protected readonly tableSchema: PgTableWithColumns<any>,
  ) {}

  protected get entityName(): string {
    return getTableName(this.tableSchema);
  }

  protected get baseQuery() {
    return this.database.select(getTableColumns(this.tableSchema)).from(this.tableSchema).$dynamic();
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResponseDto<T>> {
    let baseQuery = this.baseQuery;
    if (!query.include_deleted) baseQuery = filterSoftDelete(baseQuery, []);
    const result = await withPagination(baseQuery, this.database, query.page, query.limit, query.search);
    return result as PaginatedResponseDto<T>;
  }

  async findOne(id: string): Promise<T> {
    const result = await this.database.select().from(this.tableSchema).where(eq(this.tableSchema.id, id)).limit(1);

    if (!result[0]) {
      throw new NotFoundException(`${this.entityName} with id ${id} not found`);
    }

    return result[0] as T;
  }

  async create(createDto: CreateDto): Promise<T> {
    const [result] = await this.database.insert(this.tableSchema).values(createDto).returning();

    return result as T;
  }

  async update(id: string, updateDto: UpdateDto): Promise<T> {
    const [result] = await this.database
      .update(this.tableSchema)
      .set(updateDto)
      .where(eq(this.tableSchema.id, id))
      .returning();

    if (!result) {
      throw new NotFoundException(`${this.entityName} with id ${id} not found`);
    }

    return result as T;
  }

  async delete(id: string): Promise<T> {
    const [result] = await this.database.delete(this.tableSchema).where(eq(this.tableSchema.id, id)).returning();
    if (!result) {
      throw new NotFoundException(`${this.entityName} with id ${id} not found`);
    }

    return result as T;
  }

  async softDelete(id: string): Promise<T> {
    const [result] = await this.database
      .update(this.tableSchema)
      .set({ deleted_at: new Date() })
      .where(eq(this.tableSchema.id, id))
      .returning();

    if (!result) {
      throw new NotFoundException(`${this.entityName} with id ${id} not found`);
    }
    return result as T;
  }
}
