import { type z } from "zod";

import { ValidationError } from "./errors/validation.error";

interface ValueProps<TValue> extends Record<string, unknown> {
  value: TValue;
}

type Newable<TProps, TVO> = new (props: TProps) => TVO;

export function defineValueObject<TSchema extends z.ZodType>(schema: TSchema) {
  type TValue = z.infer<TSchema>;

  abstract class DefinedValueObject {
    protected readonly props: ValueProps<TValue>;

    protected constructor(props: ValueProps<TValue>) {
      this.props = Object.freeze(props);
    }

    public static readonly schema: TSchema = schema;

    public static make<TVO extends DefinedValueObject>(
      this: {
        prototype: TVO;
        name: string;
        schema: TSchema;
      },
      input: TValue,
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

      return new (this as unknown as Newable<ValueProps<TValue>, TVO>)({
        value: result.data,
      });
    }

    public get value(): TValue {
      return this.props.value;
    }

    public equals(vo?: DefinedValueObject | null): boolean {
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

  return DefinedValueObject;
}
