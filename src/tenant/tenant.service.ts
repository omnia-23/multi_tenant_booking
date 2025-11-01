import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantRepository } from './repositories/tenant.repository';
import { PaginationQueryDto } from '@/common/dto/pagination.dto';

@Injectable()
export class TenantService {
  constructor(private readonly repo: TenantRepository) {}
  create(createTenantDto: CreateTenantDto) {
    return this.repo.create(createTenantDto);
  }

  findAll(query: PaginationQueryDto) {
    return this.repo.findAll(query);
  }

  findOne(id: string) {
    return this.repo.findOne(id);
  }

  update(id: string, updateTenantDto: UpdateTenantDto) {
    return this.repo.update(id, updateTenantDto);
  }

  remove(id: string) {
    return this.repo.softDelete(id);
  }
}
