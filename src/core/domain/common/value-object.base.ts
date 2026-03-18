import { type z } from "zod";
import { ValidationError } from "./errors/validation.error";

type ValueObjectProps = Record<string, unknown>;

export abstract class ValueObject<T extends ValueObjectProps> {
  protected readonly props: T;

  protected constructor(props: T) {
    this.props = Object.freeze(props);
  }

  protected static validate<T>(
    schema: z.ZodType<T>,
    input: unknown,
    valueObjectName: string,
  ): T {
    const result = schema.safeParse(input);

    if (!result.success) {
      const errorMessage = result.error.issues
        .map((issue) => issue.message)
        .join(", ");
      throw new ValidationError({
        message: `Validation ${valueObjectName} failed: ${errorMessage}`,
        field: valueObjectName,
      });
    }

    return result.data;
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
