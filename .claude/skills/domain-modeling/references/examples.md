# Exemple complet : la feature `invoice`

Une facture naît en brouillon, reçoit des lignes, est émise (elle reçoit alors un numéro et ne peut plus être modifiée), puis est payée. Cet exemple montre toutes les briques du domaine ensemble.

## Sommaire

- Arborescence
- Identifiant
- Value objects (simple, composite)
- Enum
- Erreurs
- Entité
- Repository

## Arborescence

```
domain/invoice/
├── entities/invoice.entity.ts
├── value-objects/
│   ├── invoice-id.vo.ts
│   ├── invoice-number.vo.ts
│   └── invoice-line.vo.ts
├── enums/invoice-status.enum.ts
├── errors/
│   ├── invoice-not-found.error.ts
│   ├── invoice-not-editable.error.ts
│   ├── invoice-empty.error.ts
│   └── invoice-number-already-used.error.ts
└── repositories/invoice.repository.ts
```

## Identifiant

```ts
// value-objects/invoice-id.vo.ts
import { defineValueObject } from "../../common/value-object.base";
import {
  entityIdSchema,
  generateEntityId,
} from "../../common/value-objects/entity-id";

export const INVOICE_ID_PREFIX = "invoice";

export const invoiceIdSchema = entityIdSchema(INVOICE_ID_PREFIX);

export class InvoiceId extends defineValueObject(invoiceIdSchema) {
  public static generate(): InvoiceId {
    return this.make(generateEntityId(INVOICE_ID_PREFIX));
  }
}
```

## Value objects

VO simple, avec normalisation dans le schéma :

```ts
// value-objects/invoice-number.vo.ts
import { z } from "zod";

import { defineValueObject } from "../../common/value-object.base";

export const invoiceNumberSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^INV-\d{4}-\d{5}$/);

export class InvoiceNumber extends defineValueObject(invoiceNumberSchema) {}
```

VO composite : la valeur est un objet, l'égalité est profonde. Un VO peut porter des calculs purs sur sa propre valeur.

```ts
// value-objects/invoice-line.vo.ts
import { z } from "zod";

import { defineValueObject } from "../../common/value-object.base";

export const invoiceLineSchema = z.object({
  label: z.string().trim().min(1).max(200),
  quantity: z.number().int().positive(),
  unitPriceCents: z.number().int().nonnegative(),
});

export class InvoiceLine extends defineValueObject(invoiceLineSchema) {
  get totalCents(): number {
    return this.value.quantity * this.value.unitPriceCents;
  }
}
```

## Enum

```ts
// enums/invoice-status.enum.ts
export const InvoiceStatus = {
  DRAFT: "draft",
  ISSUED: "issued",
  PAID: "paid",
} as const;

export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];
```

## Erreurs

Une erreur par situation, chacune dans sa catégorie, avec un code unique :

```ts
// errors/invoice-not-found.error.ts
import { NotFoundError } from "../../common/errors/not-found.error";

export class InvoiceNotFoundError extends NotFoundError {
  constructor({ identifier }: { identifier: string }) {
    super({ code: "INVOICE_NOT_FOUND", resource: "Invoice", identifier });
  }
}
```

```ts
// errors/invoice-not-editable.error.ts
import { BusinessRuleError } from "../../common/errors/business-rule.error";
import { InvoiceStatus } from "../enums/invoice-status.enum";

export class InvoiceNotEditableError extends BusinessRuleError {
  constructor({
    invoiceId,
    status,
  }: {
    invoiceId: string;
    status: InvoiceStatus;
  }) {
    super({
      code: "INVOICE_NOT_EDITABLE",
      message: `Invoice '${invoiceId}' cannot be modified in status '${status}'`,
    });
  }
}
```

```ts
// errors/invoice-empty.error.ts
import { BusinessRuleError } from "../../common/errors/business-rule.error";
export class InvoiceEmptyError extends BusinessRuleError {
  constructor({ invoiceId }: { invoiceId: string }) {
    super({
      code: "INVOICE_EMPTY",
      message: `Invoice '${invoiceId}' cannot be issued without lines`,
    });
  }
}
```

```ts
// errors/invoice-number-already-used.error.ts
import { ConflictError } from "../../common/errors/conflict.error";

export class InvoiceNumberAlreadyUsedError extends ConflictError {
  constructor({ number }: { number: string }) {
    super({
      code: "INVOICE_NUMBER_ALREADY_USED",
      message: `Invoice number '${number}' is already used`,
    });
  }
}
```

`InvoiceNumberAlreadyUsedError` est levée par le **use case**, après avoir interrogé le repository : l'unicité d'un numéro parmi toutes les factures n'est pas une règle qu'une facture seule peut vérifier.

## Entité

```ts
// entities/invoice.entity.ts
import { Entity } from "../../common/entity.base";
import { UserId } from "../../user/value-objects/user-id.vo";
import { InvoiceStatus } from "../enums/invoice-status.enum";
import { InvoiceEmptyError } from "../errors/invoice-empty.error";
import { InvoiceNotEditableError } from "../errors/invoice-not-editable.error";
import { InvoiceId } from "../value-objects/invoice-id.vo";
import { InvoiceLine } from "../value-objects/invoice-line.vo";
import { InvoiceNumber } from "../value-objects/invoice-number.vo";

export type InvoiceProps = {
  customerId: UserId;
  status: InvoiceStatus;
  lines: InvoiceLine[];
  number: InvoiceNumber | null;
  issuedAt: Date | null;
  paidAt: Date | null;
};

export class Invoice extends Entity<InvoiceProps, InvoiceId> {
  /** Naissance métier : une facture commence toujours en brouillon, vide. */
  static create(props: Pick<InvoiceProps, "customerId">): Invoice {
    return this.make(
      {
        customerId: props.customerId,
        status: InvoiceStatus.DRAFT,
        lines: [],
        number: null,
        issuedAt: null,
        paidAt: null,
      },
      InvoiceId.generate(),
    );
  }

  get totalCents(): number {
    return this._props.lines.reduce((sum, line) => sum + line.totalCents, 0);
  }

  addLine(line: InvoiceLine): void {
    this.assertEditable();
    this._props.lines = [...this._props.lines, line];
  }

  issue(number: InvoiceNumber, now: Date): void {
    this.assertEditable();
    if (this._props.lines.length === 0) {
      throw new InvoiceEmptyError({ invoiceId: this._id.value });
    }
    this._props.number = number;
    this._props.status = InvoiceStatus.ISSUED;
    this._props.issuedAt = now;
  }

  markAsPaid(now: Date): void {
    if (this._props.status !== InvoiceStatus.ISSUED) {
      throw new InvoiceNotEditableError({
        invoiceId: this._id.value,
        status: this._props.status,
      });
    }
    this._props.status = InvoiceStatus.PAID;
    this._props.paidAt = now;
  }

  private assertEditable(): void {
    if (this._props.status !== InvoiceStatus.DRAFT) {
      throw new InvoiceNotEditableError({
        invoiceId: this._id.value,
        status: this._props.status,
      });
    }
  }
}
```

Points à remarquer :

- `create()` ne laisse choisir que le client : statut, lignes, numéro et dates sont imposés par la règle de naissance.
- Chaque méthode vérifie l'invariant **avant** de modifier l'état, et une garde partagée (`assertEditable`) évite de dupliquer la règle.
- Les dates sont reçues en paramètre, jamais lues avec `new Date()` dans l'entité.
- Le tableau de lignes est remplacé, pas muté (`[...lines, line]`), pour qu'aucune référence extérieure ne voie un état intermédiaire.

## Repository

```ts
// repositories/invoice.repository.ts
import { Invoice } from "../entities/invoice.entity";
import { InvoiceId } from "../value-objects/invoice-id.vo";
import { InvoiceNumber } from "../value-objects/invoice-number.vo";

export interface InvoiceRepository {
  findById(id: InvoiceId): Promise<Invoice | null>;
  existsWithNumber(number: InvoiceNumber): Promise<boolean>;
  save(invoice: Invoice): Promise<void>;
}
```

`existsWithNumber` existe parce qu'un use case d'écriture (émettre une facture) en a besoin pour vérifier l'unicité. Une recherche « factures impayées du mois » pour un tableau de bord irait dans un read model, pas ici.
