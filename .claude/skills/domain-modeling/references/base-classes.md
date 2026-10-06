# Classes de base du domaine

Code de référence des briques communes, à placer dans `<racine-domaine>/common/`. Si le projet les a déjà, ne les recrée pas : utilise les siennes. S'il ne les a pas, crée ces fichiers **à l'identique** (adapte seulement les imports à l'alias du projet).

Dépendances npm requises : `zod` (v4) et `uuid`.

## Sommaire

- `common/entity.base.ts`
- `common/value-object.base.ts`
- `common/utils/deep-equal.ts`
- `common/value-objects/entity-id.ts`
- `common/errors/domain.error.ts`
- `common/errors/validation.error.ts`
- `common/errors/not-found.error.ts`
- `common/errors/conflict.error.ts`
- `common/errors/forbidden.error.ts`
- `common/errors/business-rule.error.ts`

## `common/entity.base.ts`

```ts
interface Identifier {
  equals(other?: Identifier | null): boolean;
}

type PropsOf<E> = E extends Entity<infer P, infer _I> ? P : never;
type IdOf<E> = E extends Entity<infer _P, infer I> ? I : never;
type Newable<TProps, TId, TEntity> = new (props: TProps, id: TId) => TEntity;

export abstract class Entity<TProps extends object, TId extends Identifier> {
  protected _id: TId;
  protected _props: TProps;

  protected constructor(props: TProps, id: TId) {
    this._id = id;
    this._props = props;
  }

  static make<TEntity extends Entity<PropsOf<TEntity>, IdOf<TEntity>>>(
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

  get props(): Readonly<TProps> {
    return this._props;
  }

  public equals(entity?: Entity<TProps, TId> | null): boolean {
    if (entity === null || entity === undefined) return false;
    if (entity.constructor !== this.constructor) return false;

    return this._id.equals(entity._id);
  }
}
```

## `common/value-object.base.ts`

```ts
import { type z } from "zod";

import { ValidationError } from "./errors/validation.error";
import { deepEqual } from "./utils/deep-equal";

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
      if (vo.constructor !== this.constructor) return false;

      return deepEqual(this.props.value, vo.props.value);
    }

    public toString(): string {
      return JSON.stringify(this.props);
    }
  }

  return DefinedValueObject;
}
```

## `common/utils/deep-equal.ts`

```ts
export function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    a === null ||
    b === null
  ) {
    return false;
  }

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;

  return aKeys.every(
    (key) =>
      Object.hasOwn(b, key) &&
      deepEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key],
      ),
  );
}
```

## `common/value-objects/entity-id.ts`

```ts
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const UUID_PATTERN =
  "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";

/** Schéma d'un identifiant d'entité préfixé : `<prefix>-<uuid v4>`. */
export const entityIdSchema = (prefix: string) =>
  z.string().regex(new RegExp(`^${prefix}-${UUID_PATTERN}$`, "i"));

/** Génère la valeur brute d'un identifiant d'entité préfixé. */
export const generateEntityId = (prefix: string) => `${prefix}-${uuidv4()}`;
```

## `common/errors/domain.error.ts`

```ts
export interface DomainErrorProps {
  code: string;
  message: string;
}

export abstract class DomainError extends Error {
  public readonly code: string;

  constructor({ code, message }: DomainErrorProps) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

## `common/errors/validation.error.ts`

```ts
import { DomainError } from "./domain.error";

interface ValidationErrorProps {
  message: string;
  field: string;
  code?: string;
}

export class ValidationError extends DomainError {
  public readonly field: string;

  constructor({
    message,
    field,
    code = "VALIDATION_FAILED",
  }: ValidationErrorProps) {
    super({ code, message });
    this.field = field;
  }
}
```

## `common/errors/not-found.error.ts`

```ts
import { DomainError } from "./domain.error";

interface NotFoundErrorProps {
  code: string;
  resource: string;
  identifier: string;
}

export abstract class NotFoundError extends DomainError {
  public readonly resource: string;
  public readonly identifier: string;

  constructor({ code, resource, identifier }: NotFoundErrorProps) {
    super({
      code,
      message: `${resource} with identifier '${identifier}' not found`,
    });
    this.resource = resource;
    this.identifier = identifier;
  }
}
```

## `common/errors/conflict.error.ts`

```ts
import { DomainError } from "./domain.error";

export abstract class ConflictError extends DomainError {}
```

## `common/errors/forbidden.error.ts`

```ts
import { DomainError } from "./domain.error";

export abstract class ForbiddenError extends DomainError {}
```

## `common/errors/business-rule.error.ts`

```ts
import { DomainError } from "./domain.error";

export abstract class BusinessRuleError extends DomainError {}
```
