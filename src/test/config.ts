export type Success<T> = { readonly _tag: "Ok"; readonly value: T };
export type Failure<E> = { readonly _tag: "Err"; readonly error: E };
export type Result<T, E> = Success<T> | Failure<E>;

export const ok = <T>(value: T): Success<T> => ({ _tag: "Ok", value });
export const err = <E>(error: E): Failure<E> => ({ _tag: "Err", error });
