import { type z } from "zod";

import { ValidationError } from "./errors/validation.error";

type ValueObjectProps = Record<string, unknown>;

interface ValueProps<TValue> extends Record<string, unknown> {
  value: TValue;
}

type PropsOf<V> = V extends ValueObject<infer P> ? P : never;
type ValueOf<V> = PropsOf<V> extends { value: infer TValue } ? TValue : never;
type Newable<TProps, TVO> = new (props: TProps) => TVO;

export abstract class ValueObject<T extends ValueObjectProps> {
  protected readonly props: T;

  protected constructor(props: T) {
    this.props = Object.freeze(props);
  }

  public static create<TVO extends ValueObject<{ value: unknown }>>(
    this: {
      prototype: TVO;
      name: string;
      schema: z.ZodType<ValueOf<TVO>>;
    },
    input: ValueOf<TVO>,
  ): TVO {
    const result = this.schema.safeParse(input);

    if (!result.success) {
      const errorMessage = result.error.issues
        .map((issue) => issue.message)
        .join(", ");
      throw new ValidationError({
        message: `Validation ${this.name} failed: ${errorMessage}`,
        field: this.name,
      });
    }

    return new (this as unknown as Newable<{ value: ValueOf<TVO> }, TVO>)({
      value: result.data,
    });
  }

  public equals(vo?: ValueObject<T> | null): boolean {
    if (vo === null || vo === undefined) return false;

    const thisProps = this.props;
    const otherProps = vo.props;

    const thisKeys = Object.keys(thisProps);
    const otherKeys = Object.keys(otherProps);

    if (thisKeys.length !== otherKeys.length) {
      return false;
    }

    for (const key of thisKeys) {
      if (thisProps[key] !== otherProps[key]) {
        return false;
      }
    }

    return true;
  }

  public toString(): string {
    return JSON.stringify(this.props);
  }
}

export function defineValueObject<TSchema extends z.ZodType>(schema: TSchema) {
  type TValue = z.infer<TSchema>;

  abstract class DefinedValueObject extends ValueObject<ValueProps<TValue>> {
    public static readonly schema: TSchema = schema;

    public get value(): TValue {
      return this.props.value;
    }
  }

  return DefinedValueObject;
}
