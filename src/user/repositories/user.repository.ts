import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repositories/base.repository';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, desc, eq, getTableColumns, isNull, sql } from 'drizzle-orm';
import * as schema from '../user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { PaginatedResponseDto, PaginationQueryDto } from '../../common/dto/pagination.dto';
import { withPagination } from '../../common/utils/pagination.helper';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserRepository extends BaseRepository<UserResponseDto, CreateUserDto, UpdateUserDto, typeof schema> {
  constructor(database: NodePgDatabase<typeof schema>) {
    super(database, schema.users);
  }

  private getPublicUserColumns() {
    const { ...columns } = getTableColumns(schema.users);
    return columns;
  }

  override async findAll(query: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>> {
    const { page, limit, search } = query;
    const baseQuery = this.database
      .select({
        ...this.getPublicUserColumns(),
      })
      .from(schema.users)
      .where(isNull(schema.users.deleted_at))
      .orderBy(desc(schema.users.created_at))
      .$dynamic();

    const data = await withPagination(baseQuery, this.database, page, limit, search);
    return {
      ...data,
      data: data.data.map(row => plainToInstance(UserResponseDto, row)),
    };
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    const [user] = await this.database
      .select()
      .from(schema.users)
      .where(and(eq(sql`lower(${schema.users.email})`, email.toLowerCase()), isNull(schema.users.deleted_at)));
    return plainToInstance(UserResponseDto, user);
  }
}
