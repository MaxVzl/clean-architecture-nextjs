export interface PaginatedProps<T> {
  data: T[];
  total: number;
  offset: number;
  limit: number;
}

export class Paginated<T> {
  private _props: PaginatedProps<T>;

  constructor(props: PaginatedProps<T>) {
    this._props = props;
  }

  get data(): T[] {
    return this._props.data;
  }

  get total(): number {
    return this._props.total;
  }

  get offset(): number {
    return this._props.offset;
  }

  get limit(): number {
    return this._props.limit;
  }

  get pages(): number {
    return Math.ceil(this._props.total / this._props.limit);
  }
}
