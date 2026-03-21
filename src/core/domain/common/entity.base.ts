type PropsOf<E> = E extends Entity<infer P, infer _I> ? P : never;
type IdOf<E> = E extends Entity<infer _P, infer I> ? I : never;
type Newable<TProps, TId, TEntity> = new (props: TProps, id: TId) => TEntity;

export abstract class Entity<TProps, TId, TDto = unknown> {
  protected _id: TId;
  protected _props: TProps;

  protected constructor(props: TProps, id: TId) {
    this._id = id;
    this._props = props;
  }

  static restore<TEntity extends Entity<PropsOf<TEntity>, IdOf<TEntity>>>(
    this: { prototype: TEntity },
    props: PropsOf<TEntity>,
    id: IdOf<TEntity>,
  ): TEntity {
    return new (this as Newable<PropsOf<TEntity>, IdOf<TEntity>, TEntity>)(
      props,
      id,
    );
  }

  get id() {
    return this._id;
  }

  public equals(entity: Entity<TProps, TId>): boolean {
    return this === entity;
  }

  abstract toDto(): TDto;
}
