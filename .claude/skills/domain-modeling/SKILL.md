---
name: domain-modeling
description: Modélise la couche domaine d'un backend TypeScript en DDD / Clean Architecture — entités, value objects, identifiants typés, erreurs métier, enums et interfaces de repository. Utilise cette skill dès que l'utilisateur veut créer ou modifier une entité, un agrégat, un value object, un identifiant, une règle métier, un invariant, une erreur de domaine ou un port de repository, ou quand il décrit un nouveau concept métier (« ajoute une notion de commande », « un post peut être archivé », « un membre appartient à une organisation »), même s'il ne prononce pas les mots « domaine » ou « DDD ». À utiliser aussi pour relire ou corriger du code de domaine existant.
---

# Modélisation du domaine

Cette skill décrit **comment écrire la couche domaine** : le cœur métier, indépendant de la base de données, du framework HTTP et de l'UI. Le domaine ne connaît que TypeScript, `zod` (validation) et `uuid` (génération d'ids).

L'objectif est un domaine **riche** : les règles métier vivent dans les entités et les value objects, pas dans les use cases, les schémas de formulaire ou les controllers. Si une règle peut être contournée en appelant directement l'entité, elle n'est pas au bon endroit.

## Avant de commencer

1. **Repère la racine du domaine** du projet (souvent `src/core/domain/` ou `src/domain/`) et la façon dont il importe (alias `@/…` ou chemins relatifs). Aligne-toi sur l'existant.
2. **Vérifie que les classes de base existent** dans `<domaine>/common/` : `entity.base.ts`, `value-object.base.ts`, `utils/deep-equal.ts`, `value-objects/entity-id.ts` et `errors/*`. Si le projet les a, utilise-les telles quelles. S'il ne les a pas, crée-les à partir de [references/base-classes.md](references/base-classes.md), sans les réinventer : tout le reste de la skill s'appuie sur leur comportement exact.
3. **Lis une feature existante** du projet (une entité et ses VO) pour reprendre le style local.

**Reste dans le périmètre de la demande.** Si tu repères du code existant qui ne respecte pas ces règles (une méthode de présentation dans une entité, un `throw new Error`, un id non typé…) et qu'il ne fait pas partie de ce qu'on t'a demandé, ne le modifie pas : signale-le dans ton compte rendu, avec le fichier et la règle concernée. L'utilisateur garde ainsi des changements prévisibles et décide lui-même des corrections annexes.

## Arborescence

Le domaine est découpé **par feature**, au singulier, avec un dossier par catégorie :

```
<domaine>/
├── common/                         ← classes de base partagées
│   ├── entity.base.ts
│   ├── value-object.base.ts
│   ├── utils/deep-equal.ts
│   ├── value-objects/entity-id.ts
│   └── errors/                     ← DomainError + catégories
└── <feature>/                      ← ex. user/, post/, invoice/
    ├── entities/<feature>.entity.ts
    ├── value-objects/<feature>-id.vo.ts, <concept>.vo.ts
    ├── errors/<nom>.error.ts
    ├── enums/<nom>.enum.ts
    └── repositories/<feature>.repository.ts
```

**Singulier ou pluriel ?** Tout ce qui nomme l'entité est au singulier : dossiers de feature, fichiers, classes, interfaces (`user.repository.ts`, `UserRepository`, `post/`). Le pluriel est réservé aux dossiers de catégorie (`entities/`, `value-objects/`, `repositories/`), parce qu'ils contiennent plusieurs éléments.

## Value objects

Un value object représente une **valeur métier validée et immuable** : un email, un titre, un montant. On l'utilise dès qu'une donnée a une règle (longueur, format, plage) ou un sens métier propre. Un simple `string` laisse passer n'importe quoi ; un VO garantit qu'une valeur invalide ne peut pas exister.

```ts
import { z } from "zod";

import { defineValueObject } from "../../common/value-object.base";

export const postTitleSchema = z.string().trim().min(1).max(200);

export class PostTitle extends defineValueObject(postTitleSchema) {}
```

- Le **schéma zod est exporté** (`postTitleSchema`) : la couche application le réutilise dans ses commandes et DTO, pour qu'il n'y ait qu'une seule définition de la règle.
- On construit toujours avec `PostTitle.make(valeur)`. `make()` valide via le schéma et lève une `ValidationError` si la valeur est invalide.
- On lit avec `.value`. Deux VO sont égaux s'ils sont de la même classe et ont la même valeur (comparaison profonde, donc ça marche aussi pour un VO composite comme `{ userId, organizationId }`).
- Les transformations simples (trim, minuscules) vont dans le schéma : la valeur stockée est la valeur normalisée.

## Identifiants

Chaque entité a **son propre VO d'identifiant** (`UserId`, `PostId`, `InvoiceId`…). Ça empêche de passer un `PostId` là où on attend un `UserId` : l'erreur saute aux yeux à la lecture et à l'exécution (`equals` compare aussi la classe).

**Par défaut, l'id est préfixé** par le nom de l'entité (`post-<uuid v4>`), grâce aux helpers de `common/value-objects/entity-id.ts` :

```ts
import { defineValueObject } from "../../common/value-object.base";
import {
  entityIdSchema,
  generateEntityId,
} from "../../common/value-objects/entity-id";

export const POST_ID_PREFIX = "post";

export const postIdSchema = entityIdSchema(POST_ID_PREFIX);

export class PostId extends defineValueObject(postIdSchema) {
  public static generate(): PostId {
    return this.make(generateEntityId(POST_ID_PREFIX));
  }
}
```

**Exception : l'id est généré par une librairie externe** (auth, paiement…). On garde alors son format, sans le personnaliser, et le schéma est une simple chaîne :

```ts
/** Identifiant géré par better-auth : chaîne simple, sans préfixe. */
export const userIdSchema = z.string();

export class UserId extends defineValueObject(userIdSchema) {
  public static generate(): UserId {
    return this.make(uuidv4());
  }
}
```

Une **référence vers une autre entité** utilise l'id de celle-ci, et le nom de la propriété dit le rôle de la relation : `Post.authorId: UserId` plutôt que `Post.userId: string`.

On n'utilise jamais un `UUID` générique comme identifiant d'entité.

## Entités

Une entité a une **identité** qui persiste dans le temps (deux utilisateurs homonymes restent deux utilisateurs) et un **cycle de vie** gouverné par des règles.

```ts
import { Entity } from "../../common/entity.base";
import { UserId } from "../../user/value-objects/user-id.vo";
import { PostAlreadyArchivedError } from "../errors/post-already-archived.error";
import { PostId } from "../value-objects/post-id.vo";
import { PostTitle } from "../value-objects/post-title.vo";

export type PostProps = {
  authorId: UserId;
  title: PostTitle;
  archivedAt: Date | null;
};

export class Post extends Entity<PostProps, PostId> {
  static create(props: Pick<PostProps, "authorId" | "title">): Post {
    return this.make({ ...props, archivedAt: null }, PostId.generate());
  }

  archive(now: Date): void {
    if (this._props.archivedAt) {
      throw new PostAlreadyArchivedError({ postId: this._id.value });
    }
    this._props.archivedAt = now;
  }
}
```

### `make()` et `create()` : deux rôles distincts

| Méthode | Rôle | Qui l'appelle |
|---|---|---|
| `make(props, id)` | Construction **technique**, héritée de `Entity`. Elle assemble l'entité à partir de données complètes, sans appliquer de règle de création. | Les mappers (réhydratation depuis la base), et `create()` |
| `create(...)` | Factory **métier**, écrite dans chaque entité. Elle applique les règles d'une bonne création : génère l'id, fixe les valeurs par défaut, vérifie les invariants de départ. | Les use cases |

La distinction compte parce qu'une entité rechargée depuis la base ne « naît » pas : elle existe déjà, avec son id et son état. `create()` ne doit donc servir qu'à la vraie naissance, et ses paramètres ne contiennent que ce que l'appelant a le droit de choisir (pas l'id, pas les champs calculés).

### Règles d'écriture

- **Les props sont typées avec des VO** dès qu'une valeur a une règle. Les primitives ne restent que pour ce qui n'a vraiment aucune contrainte (un booléen, une URL d'image optionnelle…).
- **L'état ne change que par des méthodes métier** nommées dans le langage du métier (`archive()`, `rename()`, `promote()`), jamais par des setters génériques. Ces méthodes vérifient les invariants avant de modifier `this._props`, et lèvent une erreur métier si la règle est violée.
- **Les méthodes reçoivent des VO**, pas des primitives : `rename(title: PostTitle)`. La validation de format a déjà eu lieu ; la méthode ne vérifie que la règle métier (« un post archivé ne se renomme pas »).
- **Pas de dépendance au temps ni au hasard cachée** : si une méthode a besoin de la date courante, elle la reçoit en paramètre (`archive(now: Date)`). L'entité reste testable et déterministe. La génération d'id dans `create()` est la seule exception admise.
- **L'égalité se fait par identité** : `entity.equals(other)` compare les ids (c'est géré par `Entity`).
- **Pas de logique de présentation** dans l'entité (formatage de texte pour l'UI, sérialisation JSON…) : ce n'est pas une règle métier.

## Erreurs métier

Toute erreur levée par le domaine hérite de `DomainError` et porte un **`code` stable** en `SCREAMING_SNAKE_CASE`. Le code permet aux couches externes de réagir sans dépendre du message, et à la présentation de traduire l'erreur en statut HTTP à un seul endroit.

Chaque erreur appartient à **une catégorie** :

| Catégorie | Quand | HTTP (traduit par la présentation) |
|---|---|---|
| `ValidationError` | Donnée invalide (levée automatiquement par `make()` des VO) | 422 |
| `NotFoundError` | Ressource introuvable | 404 |
| `ConflictError` | Doublon ou état incompatible (email déjà pris) | 409 |
| `ForbiddenError` | Action interdite pour cet acteur | 403 |
| `BusinessRuleError` | Règle métier violée (archiver un post déjà archivé) | 422 |

Seule `ValidationError` est concrète. Les autres catégories sont **abstraites** : chaque feature crée ses propres sous-classes, avec un nom explicite et un code unique.

```ts
import { BusinessRuleError } from "../../common/errors/business-rule.error";

interface PostAlreadyArchivedErrorProps {
  postId: string;
}

export class PostAlreadyArchivedError extends BusinessRuleError {
  constructor({ postId }: PostAlreadyArchivedErrorProps) {
    super({
      code: "POST_ALREADY_ARCHIVED",
      message: `Post '${postId}' is already archived`,
    });
  }
}
```

```ts
import { NotFoundError } from "../../common/errors/not-found.error";

export class UserNotFoundError extends NotFoundError {
  constructor({ identifier }: { identifier: string }) {
    super({ code: "USER_NOT_FOUND", resource: "User", identifier });
  }
}
```

On ne fait **jamais** `throw new Error(...)` dans le domaine : une erreur sans catégorie ni code devient un 500 opaque et ne peut pas être traitée proprement par l'appelant.

## Enums

Un ensemble fermé de valeurs s'écrit en objet `as const` avec un type du même nom. Ça reste compatible avec `z.enum(Role)` côté application.

```ts
export const PostStatus = {
  DRAFT: "draft",
  PUBLISHED: "published",
} as const;

export type PostStatus = (typeof PostStatus)[keyof typeof PostStatus];
```

## Ports de repository

Le domaine déclare **l'interface** du repository de chaque entité persistée ; l'implémentation (Drizzle, Prisma…) vit dans l'infrastructure.

```ts
import { Post } from "../entities/post.entity";
import { PostId } from "../value-objects/post-id.vo";

export interface PostRepository {
  findById(id: PostId): Promise<Post | null>;
  save(post: Post): Promise<void>;
}
```

- Un repository **manipule des entités et des VO**, jamais des lignes de base ou des DTO.
- Il n'expose que ce dont les use cases d'écriture ont besoin (`findById`, `save`, éventuellement `findByEmail`…). Les listes paginées, recherches et filtres pour l'affichage relèvent des **read models** de la couche application, pas du repository.
- `findById` renvoie `null` si l'entité n'existe pas ; c'est le use case qui décide de lever une `XxxNotFoundError`.

## Ce que le domaine n'importe jamais

Le domaine n'importe que du domaine, `zod` et `uuid`. Pas d'ORM, pas de framework HTTP, pas de `process.env`, pas de code de la couche application ou infrastructure. Si tu as besoin d'une capacité externe (envoyer un email, connaître l'heure), c'est le use case qui l'orchestre, ou la méthode qui la reçoit en paramètre.

## Checklist avant de rendre la main

- [ ] Les classes de base de `common/` existent et n'ont pas été modifiées sans raison.
- [ ] Chaque nouvelle entité a son VO d'id (`<feature>-id.vo.ts`), préfixé sauf si l'id est géré par une librairie externe.
- [ ] Les références entre entités utilisent l'id typé de la cible, avec un nom qui dit le rôle (`authorId: UserId`).
- [ ] Toute valeur avec une règle est un VO dont le schéma zod est exporté.
- [ ] `create()` existe pour chaque entité qui peut naître dans l'application ; il génère l'id et ne laisse choisir à l'appelant que ce qui a du sens.
- [ ] Les changements d'état passent par des méthodes métier qui lèvent des erreurs catégorisées avec un `code`.
- [ ] Aucun `throw new Error`, aucun import hors domaine / `zod` / `uuid`.
- [ ] Nommage au singulier pour tout ce qui désigne l'entité ; pluriel seulement pour les dossiers de catégorie.

Pour un exemple complet de feature (entité, VO, erreurs, enum, repository), voir [references/examples.md](references/examples.md).
