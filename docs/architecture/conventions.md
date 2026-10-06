# Conventions d'architecture backend

Ce document est la **source de vérité** des conventions backend du projet. Les skills s'appuient dessus : toute évolution d'une règle se fait d'abord ici.

## 1. Couches et règle de dépendance

Tout le backend vit dans `src/core`, découpé en 4 couches :

```
src/core/
├── domain/          ← modèle métier : entités, value objects, erreurs, repositories (ports)
├── application/     ← cas d'usage : use cases, commandes, DTO, ports (services, query-services)
├── infrastructure/  ← implémentations des ports : Drizzle, email, cache…
└── presentation/    ← points d'entrée : routes et controllers Hono, server actions
```

Les dépendances vont toujours **vers l'intérieur** :

| Couche | Peut importer |
|---|---|
| `domain` | `domain` uniquement (+ `zod`, `uuid`) |
| `application` | `domain`, `application` |
| `infrastructure` | `domain`, `application`, `infrastructure` |
| `presentation` | `domain`, `application`, `presentation` |

Dans chaque couche, le code est découpé **par feature** (`user/`, `post/`…), avec un dossier `common/` pour ce qui est partagé.

## 2. Dépendances du domaine

`zod` est **autorisé** dans le domaine. Il sert à valider les value objects, et ses schémas sont réutilisés par la couche application (commandes, DTO).

## 3. Factories : `make()` et `create()`

| Méthode | Rôle | Qui l'appelle |
|---|---|---|
| `make()` | Construction **technique**. Elle assemble l'objet à partir de données complètes et valide leur structure (schéma zod pour un VO). | Les mappers (réhydratation depuis la base), `create()`, `generate()` |
| `create()` | Factory **métier**, propre à chaque entité. Elle applique les règles d'une bonne création : valeurs par défaut, génération de l'id, invariants de création. | Les use cases |

```ts
export class User extends Entity<UserProps, UserId> {
  static create(props: Omit<UserProps, "image" | "emailVerified">): User {
    return this.make(
      { ...props, image: null, emailVerified: false },
      UserId.generate(),
    );
  }
}
```

**Règle :** un use case qui crée une nouvelle entité appelle `create()`, jamais `make()`.

## 4. Identifiants

Chaque entité a **son propre value object d'identifiant** (`UserId`, `PostId`…). Il est préfixé et expose une méthode `generate()`.

```ts
export const userIdSchema = z
  .string()
  .regex(/^user-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

export class UserId extends defineValueObject(userIdSchema) {
  public static generate(): UserId {
    return this.make(`user-${uuidv4()}`);
  }
}
```

**Règles :**
- On n'utilise jamais un `UUID` générique comme identifiant d'entité.
- Une référence vers une autre entité utilise l'identifiant de celle-ci : `Post.authorId: UserId`, et non `UUID` ou `string`.
- Le VO d'identifiant vit dans le dossier de sa feature : `domain/<feature>/value-objects/<feature>-id.vo.ts`.

## 5. Gestion des erreurs

### Principe

Les erreurs métier sont des **exceptions typées** (`throw`). Elles sont traduites en réponse **à un seul endroit par point d'entrée** : `onError` pour Hono, `handleServerError` pour next-safe-action.

### Catégories

Toute erreur métier hérite de `DomainError`, qui porte un `code` stable. Elle appartient à l'une des catégories suivantes :

| Classe | Signification | HTTP |
|---|---|---|
| `ValidationError` | Donnée invalide (lancée par les VO) | 422 |
| `NotFoundError` | Ressource introuvable | 404 |
| `ConflictError` | Doublon ou état incompatible | 409 |
| `ForbiddenError` | Action interdite pour cet acteur | 403 |
| `BusinessRuleError` | Règle métier violée | 422 |

Emplacement : `domain/common/errors/`.

### Règles

1. Dans `domain` et `application`, on ne fait **jamais** `throw new Error()` : on lève toujours une sous-classe d'une catégorie.
2. Chaque feature définit ses erreurs spécifiques en héritant d'une catégorie, avec un `code` unique. Exemple : `UserNotFoundError extends NotFoundError`, code `USER_NOT_FOUND`. Ces erreurs vivent dans `domain/<feature>/errors/`.
3. La correspondance entre catégorie et statut HTTP existe **à un seul endroit**, dans `presentation`.
4. Toute erreur qui n'est pas une `DomainError` est un bug. On la logue et on renvoie un message générique (500 côté HTTP, message neutre côté server action). Son message n'est jamais exposé au client.
5. Le type `Result<T, E>` est réservé aux cas où l'appelant **doit** traiter plusieurs issues **attendues** (par exemple un import qui renvoie les lignes valides et les lignes invalides). C'est une exception, pas la règle.

## 6. Ports

Un port est **nommé selon sa nature** : le suffixe du nom et le dossier indiquent toujours de quoi il s'agit.

| Nature | Suffixe | Dossier | Rôle |
|---|---|---|---|
| Repository | `XxxRepository` | `domain/<feature>/repositories/` | Persister et recharger une entité |
| Service | `XxxService` | `application/<feature>/services/` | Capacité technique ou métier externe (email, cache, notification…) |
| Query service | `XxxQueryService` | `application/<feature>/query-services/` | Read model : lecture optimisée qui renvoie des DTO |

Les implémentations vivent dans `infrastructure/<feature>/<même dossier>/` et sont préfixées par leur technologie : `DrizzleUsersRepository`, `ResendEmailService`, `DrizzlePostsQueryService`.

## 7. CQRS

- **Écriture (commandes)** : `presentation` appelle un **use case**, qui charge et sauvegarde des **entités** via des **repositories**. L'entrée est une commande (`application/<feature>/commands/`) décrite par un schéma zod.
- **Lecture (requêtes)** : `presentation` appelle un **query service**, qui renvoie directement des **DTO** sans hydrater le domaine. Les paramètres sont une requête (`application/<feature>/queries/`) décrite par un schéma zod.

Le côté lecture ne passe jamais par les entités. Le côté écriture ne renvoie jamais de DTO de lecture : il renvoie au plus un identifiant.

## 8. Emplacement de la présentation

La présentation reste dans `src/core/presentation`. Elle contient les routes et controllers Hono ainsi que les server actions Next.js.

---

## Décisions

| Date | Décision |
|---|---|
| 2026-10-06 | `make()` = construction technique, `create()` = factory métier propre à l'entité |
| 2026-10-06 | Un VO d'identifiant dédié et préfixé par entité |
| 2026-10-06 | Exceptions typées par catégorie, traduites à un seul endroit par point d'entrée ; `Result` réservé aux cas exceptionnels |
| 2026-10-06 | Zod autorisé dans le domaine |
| 2026-10-06 | Ports nommés selon leur nature : `repositories/`, `services/`, `query-services/` |
| 2026-10-06 | La présentation reste dans `src/core` |
