# Audit de `src/core`

Audit de l'architecture, de la structuration, des design patterns, du DDD, de la Clean Architecture et du CQRS.

Périmètre : les 63 fichiers de `src/core` (environ 1 600 lignes), ainsi que le câblage dans `src/lib/container`, `src/lib/auth.ts`, `src/lib/safe-action.ts` et `src/app/api/[[...route]]/route.ts`.

## Verdict global

Le squelette est sain :

- les 4 couches (`domain`, `application`, `infrastructure`, `presentation`) sont bien séparées ;
- le découpage par feature (`user/`, `post/`) se retrouve dans chaque couche ;
- les dépendances se font par interfaces ;
- l'injection passe par constructeur et la composition est faite à la main (sans magie) ;
- il y a une séparation lecture/écriture de type CQRS « light ».

Pour un projet de démo, la base est bonne.

En revanche, le domaine est anémique : toutes les règles métier vivent dans les schémas zod de la couche application. Il y a aussi quelques bugs concrets, dont une faille de sécurité.

---

## 🔴 Critique : bugs et sécurité

### 1. N'importe qui peut créer un post au nom de n'importe quel utilisateur

- `POST /api/users/:userId/posts` n'a aucune authentification.
- `src/core/presentation/controllers/post.controller.ts:41` construit le `SystemContext` à partir du paramètre d'URL : `userId: c.req.valid("param").userId`.
- `AuthMiddleware` (`src/core/presentation/middlewares/auth.middleware.ts`) existe mais n'est utilisé nulle part.

**Correction :** le contexte doit venir de la session, jamais de l'URL.

### 2. Toutes les données utilisateurs sont publiques

`GET /api/users` liste tous les utilisateurs avec leur email, sans authentification. Côté lecture, aucune règle d'autorisation ne s'applique.

### 3. Les erreurs métier ne sont jamais traduites en codes HTTP

- Il n'y a pas de `app.onError` dans `src/app/api/[[...route]]/route.ts`. Une `ValidationError` ou une `UserNotFoundError` devient donc une erreur 500.
- `getSession()` (`src/lib/auth.ts:44`) lance un `Error("Unauthorized")` générique, qui devient lui aussi une 500 au lieu d'une 401.
- Côté server actions, `handleServerError: (error) => error.message` (`src/lib/safe-action.ts:7`) renvoie au client le message de **n'importe quelle** erreur, y compris les erreurs SQL.

**Correction :** traduire les `DomainError` en codes HTTP dans `onError`, et ne renvoyer au client que les messages des `DomainError` (liste blanche), avec un message générique pour le reste.

### 4. Aucun email n'est envoyé en production

`src/lib/container/container.prod.ts` est identique à `container.dev.ts` et utilise lui aussi `InMemoryEmailService`, qui fait au passage un `console.log(body)` (`in-memory-email.service.ts:21`).

### 5. Un utilisateur créé par l'admin ne peut pas se connecter

`CreateUserUseCase` écrit directement dans la table `user` de better-auth, sans `account` ni mot de passe.

### 6. Le post est enregistré même si l'email échoue

Dans `src/core/application/post/use-cases/create-post.use-case.ts:38-43`, on fait `save()` puis `notifyPostCreated()`. Si l'envoi échoue, le post reste en base mais l'action renvoie une erreur.

**Correction :** c'est le cas typique où il faut un événement de domaine avec un outbox, ou au minimum une notification en fire-and-forget avec un log.

### 7. `test.vo.ts` (fichier non suivi par git) pose plusieurs problèmes

Fichier : `src/core/domain/common/value-objects/test.vo.ts`

- Il contient un `console.log` exécuté à l'import (ligne 52).
- Il ré-exporte un deuxième `UUID` et un deuxième `uuidSchema` en doublon de `uuid.vo.ts`.
- Il révèle un bug de `ValueObject.equals` (`value-object.base.ts:47`) : la comparaison est superficielle (`props.value === other.props.value`). Pour un VO composite comme `MemberId` (un objet), deux instances au contenu identique ne sont donc **jamais égales**.

---

## 🟠 DDD

| Constat | Où | Recommandation |
|---|---|---|
| **Domaine anémique** : `Post` et `User` sont de simples sacs de props, sans aucun comportement. | `post.entity.ts`, `user.entity.ts` | Mettre les invariants dans `create()`. Par exemple, `title.min(1)` n'existe aujourd'hui que dans `createPostSchema`, donc `Post.create({ title: "" })` est accepté. Créer des VO `PostTitle` et `UserName`, et des méthodes métier (`rename()`, `promote()`…). |
| `Entity.equals` compare les références (`this === entity`). | `entity.base.ts:33` | En DDD, une entité se définit par son identité : `this.id.equals(other.id)`. Sinon, deux chargements du même enregistrement donnent deux entités « différentes ». |
| `Entity.make` est public alors que le constructeur est `protected`, ce qui revient à avoir un constructeur public qui contourne `create()`. | `entity.base.ts:14` | Renommer en `reconstitute` / `hydrate` pour marquer l'intention, et le réserver aux mappers. |
| `props` est exposé tel quel, en `Readonly` superficiel. On voit donc `user.props.email.value` dans le use case (violation de la loi de Déméter). | `entity.base.ts:29`, `create-post.use-case.ts:40` | Ajouter des getters explicites (`user.email`) et ne pas exposer `props`. |
| Les identifiants ne sont pas typés : `Post.userId: UUID`, donc on peut passer un `PostId` à la place d'un `UserId`. | `post.entity.ts:5` | `test.vo.ts` va dans la bonne direction (`UserId`, `PostId`). À finaliser, avec un `equals` profond. |
| Pas d'agrégats ni d'événements de domaine. | — | Une `AggregateRoot` avec `pullEvents()` permettrait de sortir la notification du use case (cf. point 6). |
| `UserNotFoundError` est classée « domaine », alors qu'un « not found » relève plutôt de l'application. | `domain/user/errors/` | Détail mineur, c'est un choix défendable. |
| Le domaine dépend de `zod` et `uuid`. | `value-object.base.ts`, `uuid.vo.ts` | C'est un compromis pragmatique et acceptable. Il faut juste l'assumer et le documenter. |
| `DrizzleUserMapper.toRole` remplace silencieusement un rôle inconnu par `USER`. | `drizzle-user.mapper.ts:13` | Mieux vaut lever une erreur : ce cas masque une donnée corrompue. |
| `CreatePostUseCase` appelle `UUID.make(context.userId)` deux fois. | `create-post.use-case.ts:28,34` | Calculer l'identifiant une seule fois, ou réutiliser `user.id`. |

---

## 🟠 Clean Architecture et hexagonal

### `core/presentation` dépend de la composition root

`routers/*.router.ts` et `actions/*.actions.ts` importent `@/lib/container`. Les dépendances doivent aller du point d'entrée vers le noyau, pas l'inverse.

**Correction :** faire en sorte que ce soit `app/api/[[...route]]/route.ts` qui reçoive les controllers, et que les routers soient des fonctions `createUserRouter(controllers)`.

### Des frameworks sont présents dans `core`

`presentation` contient du Hono, du `"use server"` et du `next-safe-action`, et `auth.middleware.ts` importe `@/lib/auth` (better-auth). Si `presentation` est un adaptateur, alors `core/` ne correspond plus vraiment au « cœur ». Deux options :

- séparer `src/core/{domain,application}` d'un côté et `src/adapters/{infrastructure,presentation}` de l'autre ;
- ou bien assumer la structure actuelle, à condition d'**imposer les règles de dépendance** avec `eslint-plugin-boundaries` ou `import/no-restricted-paths`. Aujourd'hui, rien n'empêche le domaine d'importer de l'infrastructure.

### Le nommage des ports est ambigu

`application/*/services/` mélange :

- les ports techniques (`EmailService`, `CacheService`) ;
- les ports métier (`PostNotifierService`, `AuthNotifierService`) ;
- les read models (`PostsQueryService`, `UsersQueryService`).

**Proposition :** un dossier `ports/` séparé de `queries/`.

### L'auth est à cheval sur deux endroits

Le schéma d'auth vit dans `core/infrastructure/auth/schemas`, mais la configuration better-auth est dans `src/lib/auth.ts`, qui importe directement `db`.

Par ailleurs, `User` (domaine) est couplé à la table `user` de better-auth : c'est un bounded context « Identity » qui n'est pas explicité.

### La configuration est lue directement

- `process.env.DB_FILE_NAME!` et `"dotenv/config"` sont dans `infrastructure/database/index.ts`.
- `baseURL: "http://localhost:3000/"` est codé en dur dans `src/lib/auth.ts:17`.

**Correction :** un module de configuration validé par zod.

### Classes de base vides

- `Controller<Deps>` et `Middleware<void>` sont vides et n'apportent rien.
- Même remarque pour `UseCase` (`use-case.base.ts`) : son `context?` est optionnel dans la signature abstraite mais requis dans l'implémentation, ce qui affaiblit le typage.

**Proposition :** une simple interface `UseCase<I, O, C>` suffirait.

---

## 🟡 CQRS

### ✅ Bien

- Les écritures passent par des use cases et des repositories qui manipulent des entités.
- Les lectures passent par des `QueryService` qui renvoient directement des DTO, sans hydrater le domaine.

C'est exactement le bon compromis.

### ⚠️ À corriger

- **L'asymétrie entre les deux côtés.** Les commandes ont une classe use case, alors que les requêtes sont appelées directement depuis les pages (`app/users/page.tsx`, `app/me/posts/page.tsx`) et les controllers. Il n'y a donc aucun point central pour l'autorisation, le cache ou les logs côté lecture. Il faudrait des query handlers (`ListUsersQueryHandler`), ou au minimum un garde d'autorisation.
- **La pagination est trompeuse.** Le paramètre `offset` est en réalité un numéro de **page** (`(page - 1) * limit`, dans `drizzle-*-query.service.ts`), et il n'y a **aucun plafond sur `limit`** (`?limit=1000000` passe).
- **Les recherches `LIKE` n'échappent pas `%` et `_`.** Le `.toLowerCase()` est inutile, car le `LIKE` de SQLite ignore déjà la casse en ASCII.
- **`find` et `findByUserId` sont dupliqués** dans `drizzle-posts-query.service.ts`. Il suffit de factoriser avec un filtre optionnel `userId`.
- **Le `CacheService` existe (Redis et mémoire) mais n'est jamais utilisé.**
- **Les dossiers `commands/` et `queries/` ne contiennent que des schémas zod.** Ce sont des DTO d'entrée, pas des commandes au sens CQRS : le nom est correct, mais il n'y a ni bus ni handler. C'est très bien pour ce projet, il ne faut pas en ajouter.

---

## 🟡 Présentation et API

- **`paginatedResponse` déclare `400: unauthorizedResponse`** (`paginated-response.helper.ts:14`). Le code 400 ne correspond pas à la description « Unauthorized » : il faudrait `401` (ou garder `400` avec une description de validation).
- **L'enveloppe paginée est incohérente.** `PaginatedDto` existe, mais l'API renvoie un simple tableau avec un en-tête `X-Total-Count`. Il faut choisir l'un ou l'autre.
- **`createUserPostRoute` est défini dans `user.routes.ts` mais servi par `PostController`.** Ce couplage croisé est déroutant.
- **`post.module.ts` instancie `CreatePostUseCase` deux fois** (lignes 19 et 25). C'est sans conséquence aujourd'hui, mais ça le deviendra dès qu'il y aura de l'état.
- **Les schémas zod de l'application servent directement de contrat OpenAPI.** C'est pragmatique, mais la moindre modification interne change l'API publique. C'est à garder en tête.

---

## 🔵 Qualité et tests

- **Aucun test.** Pourtant l'architecture s'y prête parfaitement : les use cases sont purs grâce aux dépendances injectées. Il manque seulement des `InMemoryUsersRepository` et `InMemoryPostsRepository` (les services email et cache en mémoire existent déjà). Avec Vitest, un premier test de `CreatePostUseCase` prend une dizaine de lignes.
- **Les props des méthodes `send()` sont dupliquées dans les 3 implémentations email** (in-memory, nodemailer, resend). Un type `SendEmailInput` exporté depuis le port réglerait ça.
- **Un lien HTML est construit par interpolation de chaîne** dans `email-auth-notifier.service.ts:15`. Il vaudrait mieux utiliser un template react-email, comme pour les posts.

---

## Plan d'action conseillé (par ordre de priorité)

1. Brancher l'authentification sur les routes Hono, prendre le `userId` dans la session, et ajouter `app.onError` pour traduire les `DomainError` en codes HTTP (avec une liste blanche aussi dans `safe-action`).
2. Supprimer ou terminer `test.vo.ts`, et corriger `Entity.equals` et `ValueObject.equals` (égalité profonde).
3. Enrichir le domaine : invariants dans les factories, VO `PostTitle` et `UserName`, identifiants typés, getters à la place de `props`.
4. Inverser la dépendance entre la présentation et le container, et imposer les frontières entre couches avec ESLint.
5. Corriger la pagination (`page` au lieu de `offset`, plafond sur `limit`) et ajouter une autorisation côté lecture.
6. Ajouter des repositories en mémoire et des tests unitaires des use cases.
7. Plus tard : événements de domaine pour les notifications, et container de prod avec un vrai service d'email.
