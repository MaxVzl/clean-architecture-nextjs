# Conventions d'architecture backend

Ce document est la **source de vérité** des conventions backend du projet. Les skills s'appuient dessus : toute évolution d'une règle se fait d'abord ici.

## 1. Couches et règle de dépendance

Tout le backend vit dans `src/core`, découpé en 4 couches :

```
src/core/
├── domain/          ← modèle métier : entités, value objects, erreurs, repositories (ports)
├── application/     ← cas d'usage : use cases, commandes, DTO, ports (services, read-models)
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

**Exception : le composition root.** Le container (`src/lib/container/`) vit hors des couches et les assemble. Seuls les points d'entrée de la présentation (`actions/`, `routers/`, `middlewares/`) ont le droit d'importer `@/lib` : une server action ou un router est une fonction de module, on ne peut pas lui injecter ses dépendances. Les controllers, use cases, le domaine et l'infrastructure ne l'importent jamais.

**La règle est vérifiée par ESLint** (`import/no-restricted-paths` dans `eslint.config.mjs`) : tout import interdit entre couches est une erreur de lint.

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

Chaque entité a **son propre value object d'identifiant** (`UserId`, `PostId`…), qui expose une méthode `generate()`. Par défaut, il est préfixé par le nom de l'entité, grâce aux helpers de `domain/common/value-objects/entity-id.ts`.

```ts
export const POST_ID_PREFIX = "post";

export const postIdSchema = entityIdSchema(POST_ID_PREFIX);

export class PostId extends defineValueObject(postIdSchema) {
  public static generate(): PostId {
    return this.make(generateEntityId(POST_ID_PREFIX));
  }
}
```

**Exception : les entités dont l'id est géré par une librairie externe.** On garde alors le format de la librairie, et le schéma du VO est une simple `z.string()`. C'est le cas de `UserId`, dont l'id est généré par better-auth. better-auth reste configuré par défaut, sans `generateId` personnalisé.

```ts
export const userIdSchema = z.string();

export class UserId extends defineValueObject(userIdSchema) {
  public static generate(): UserId {
    return this.make(uuidv4());
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
| Read model | `XxxReadModel` | `application/<feature>/read-models/` | Lecture optimisée qui renvoie des DTO |

Les implémentations vivent dans `infrastructure/<feature>/<même dossier>/` et sont préfixées par leur technologie : `DrizzleUserRepository`, `ResendEmailService`, `DrizzlePostReadModel`.

Le nom de fichier reprend la nature du port comme extension :

| Nature | Port (`application` / `domain`) | Implémentation (`infrastructure`) |
|---|---|---|
| Repository | `user.repository.ts` | `drizzle-user.repository.ts` |
| Service | `email.service.ts` | `resend-email.service.ts` |
| Read model | `post.read-model.ts` | `drizzle-post.read-model.ts` |

## 7. Singulier et pluriel

**Singulier** pour tout ce qui nomme l'entité ou la feature : dossiers de feature, fichiers, classes, interfaces, variables de dépendance, variables Drizzle.

```ts
// ✅
user.repository.ts · UserRepository · DrizzleUserReadModel · userRepository · postTable
// ❌
users.repository.ts · UsersRepository · DrizzleUsersReadModel · usersRepository · postsTable
```

**Pluriel** uniquement dans ces cas :

| Cas | Exemple | Raison |
|---|---|---|
| Dossiers de catégorie | `repositories/`, `entities/`, `value-objects/` | Ils contiennent plusieurs éléments |
| Tables SQL | `sqliteTable("posts", …)`, index `posts_userId_idx` | Convention SQL du projet |
| URLs REST | `/api/users`, `/:userId/posts` | Une URL désigne une collection |
| Variables qui contiennent une collection | `const { data: users }`, `posts.map(…)` | Vrai pluriel sémantique |

Les tables générées par better-auth (`user`, `session`…) gardent pour l'instant leur nom par défaut, au singulier. On peut les passer au pluriel avec l'option `modelName` de better-auth.

## 8. CQRS

- **Écriture (commandes)** : `presentation` appelle un **use case**, qui charge et sauvegarde des **entités** via des **repositories**. L'entrée est une commande (`application/<feature>/commands/`) décrite par un schéma zod.
- **Lecture (requêtes)** : `presentation` appelle un **read model**, qui renvoie directement des **DTO** sans hydrater le domaine. Les paramètres sont une requête (`application/<feature>/queries/`) décrite par un schéma zod.

Le côté lecture ne passe jamais par les entités. Le côté écriture ne renvoie jamais de DTO de lecture : il renvoie au plus un identifiant.

## 9. Emplacement de la présentation

La présentation reste dans `src/core/presentation`. Elle contient les routes et controllers Hono ainsi que les server actions Next.js.

## 10. Injection de dépendances

Toute classe qui a des dépendances (use case, controller, implémentation d'un port) les reçoit **par constructeur**, dans un objet `deps` typé par une interface `XxxDeps` :

```ts
export interface CreatePostUseCaseDeps {
  postRepository: PostRepository;
  userRepository: UserRepository;
  postNotifierService: PostNotifierService;
}

export class CreatePostUseCase {
  constructor(private readonly deps: CreatePostUseCaseDeps) {}
}
```

- Les dépendances sont typées par des **ports**, jamais par des implémentations.
- **Pas de classe de base vide** (`UseCase<…>`, `Controller<…>`) juste pour stocker `deps` : le constructeur et l'interface `XxxDeps` suffisent, et le typage reste explicite.
- Le câblage se fait dans le composition root (`src/lib/container/`) : un module par feature, qui instancie chaque use case **une seule fois** et réutilise l'instance.

## 11. Contrôle d'accès

| Type de règle | Exemple | Où |
|---|---|---|
| Authentification et rôle global | « il faut être connecté », « seul un admin peut créer un tag » | Point d'entrée de la présentation : `authClient`, `rolesClient([Role.ADMIN])`, middleware HTTP |
| Règle qui dépend des données | « seul l'auteur peut supprimer son post » | Domaine (méthode de l'entité) ou use case, avec une `ForbiddenError` codée |

L'identité de l'acteur arrive au use case via `SystemContext`, construit à partir de la session, jamais à partir de l'URL ou du corps de la requête.

---

## Décisions

| Date | Décision |
|---|---|
| 2026-10-06 | `make()` = construction technique, `create()` = factory métier propre à l'entité |
| 2026-10-06 | Un VO d'identifiant dédié et préfixé par entité |
| 2026-10-06 | Exception : `UserId` garde le format better-auth (`z.string()`, sans préfixe), et better-auth n'est pas personnalisé |
| 2026-10-06 | Exceptions typées par catégorie, traduites à un seul endroit par point d'entrée ; `Result` réservé aux cas exceptionnels |
| 2026-10-06 | Zod autorisé dans le domaine |
| 2026-10-06 | Ports nommés selon leur nature : `repositories/`, `services/`, `read-models/` |
| 2026-10-06 | Les lectures s'appellent des read models (`XxxReadModel`, fichiers `*.read-model.ts`), et non des query services |
| 2026-10-06 | La présentation reste dans `src/core` |
| 2026-10-06 | Singulier pour tout ce qui nomme l'entité ; pluriel pour les dossiers de catégorie, les tables SQL, les URLs REST et les collections |
| 2026-10-06 | Seuls les points d'entrée de la présentation (actions, routers, middlewares) importent le composition root `@/lib` |
| 2026-10-06 | Règle de dépendance vérifiée par ESLint (`import/no-restricted-paths`) |
| 2026-10-06 | Injection par constructeur avec un objet `deps` typé `XxxDeps` ; pas de classe de base vide (`UseCase`, `Controller` supprimées) |
| 2026-10-06 | Contrôle d'accès à deux niveaux : rôle global dans la présentation, règles liées aux données dans le domaine (`ForbiddenError`) |
