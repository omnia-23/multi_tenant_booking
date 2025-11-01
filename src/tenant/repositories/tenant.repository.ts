import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repositories/base.repository';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { desc, getTableColumns, isNull } from 'drizzle-orm';
import * as schema from '../tenant.schema';
import { CreateTenantDto } from '../dto/create-tenant.dto';
import { UpdateTenantDto } from '../dto/update-tenant.dto';
import { TenantResponseDto } from '../dto/tenant-response.dto';
import { PaginatedResponseDto, PaginationQueryDto } from '../../common/dto/pagination.dto';
import { withPagination } from '../../common/utils/pagination.helper';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TenantRepository extends BaseRepository<
  TenantResponseDto,
  CreateTenantDto,
  UpdateTenantDto,
  typeof schema
> {
  constructor(database: NodePgDatabase<typeof schema>) {
    super(database, schema.tenants);
  }

  override async findAll(query: PaginationQueryDto): Promise<PaginatedResponseDto<TenantResponseDto>> {
    const { page, limit, search } = query;
    const baseQuery = this.database
      .select({
        ...getTableColumns(schema.tenants),
      })
      .from(schema.tenants)
      .where(isNull(schema.tenants.deleted_at))
      .orderBy(desc(schema.tenants.created_at))
      .$dynamic();

    const data = await withPagination(baseQuery, this.database, page, limit, search);
    return {
      ...data,
      data: data.data.map(row => plainToInstance(TenantResponseDto, row)),
    };
  }
}
