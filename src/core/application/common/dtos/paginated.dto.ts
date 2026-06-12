export interface PaginatedDto<T> {
  data: T[];
  total: number;
  offset: number;
  limit: number;
}
