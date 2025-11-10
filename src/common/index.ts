export class StandardResopnse<T> {
  code: number;
  message: string;
  data: T;
}

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
