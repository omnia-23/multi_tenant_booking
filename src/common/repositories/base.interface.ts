import { PaginatedResponseDto, PaginationQueryDto } from '../dto/pagination.dto';

export interface IBaseRepository<T, CreateDto, UpdateDto> {
  findAll(query: PaginationQueryDto): Promise<PaginatedResponseDto<T>>;
  findOne(id: string): Promise<T>;
  create(createDto: CreateDto): Promise<T>;
  update(id: string, updateDto: UpdateDto): Promise<T>;
  delete(id: string): Promise<T>;
  softDelete(id: string): Promise<T>;
}
