# Stack de référence : Next.js + Hono + Drizzle + zod + better-auth

Comment les règles de la skill s'appliquent concrètement avec cette stack. Les exemples suivent une feature `post` (un post a un auteur, un titre et une description) de bout en bout.

## Sommaire

- Vue d'ensemble des fichiers d'une feature
- Application : commande, requête, DTO, use case, ports
- Infrastructure : schéma Drizzle, mapper, repository, read model, services
- Composition root
- Présentation : routes Hono, controller, router, server action
- Traduction des erreurs
- Points d'attention better-auth

## Vue d'ensemble des fichiers d'une feature

```
src/core/
├── domain/post/                      ← voir la skill domain-modeling
│   ├── entities/post.entity.ts
│   ├── value-objects/post-id.vo.ts
│   └── repositories/post.repository.ts
├── application/post/
│   ├── commands/create-post.command.ts
│   ├── queries/list-post.query.ts
│   ├── dtos/post.dto.ts
│   ├── use-cases/create-post.use-case.ts
│   ├── read-models/post.read-model.ts
│   └── services/post-notifier.service.ts
├── infrastructure/post/
│   ├── schemas/drizzle-post.schema.ts
│   ├── mappers/drizzle-post.mapper.ts
│   ├── repositories/drizzle-post.repository.ts
│   ├── read-models/drizzle-post.read-model.ts
│   └── services/email-post-notifier.service.ts
└── presentation/
    ├── routes/post.routes.ts
    ├── controllers/post.controller.ts
    ├── routers/post.router.ts
    └── actions/post.actions.ts
src/lib/container/
├── modules/post.module.ts
├── container.ts, container.dev.ts, container.prod.ts
└── index.ts
src/app/api/[[...route]]/route.ts      ← monte les routers Hono dans Next.js
```

## Application

### Commande : l'entrée d'une écriture

Un schéma zod qui réutilise les schémas des VO, et son type inféré :

```ts
// application/user/commands/create-user.command.ts
import z from "zod";

import { Role } from "@/core/domain/user/enums/role.enum";
import { emailSchema } from "@/core/domain/user/value-objects/email.vo";
import { userNameSchema } from "@/core/domain/user/value-objects/user-name.vo";

export const createUserSchema = z.object({
  name: userNameSchema,
  email: emailSchema,
  role: z.enum(Role),
});

export type CreateUserCommand = z.infer<typeof createUserSchema>;
```

### Requête et DTO : la lecture

```ts
// application/post/queries/list-post.query.ts
export const listPostQuerySchema = z.object({
  titleContains: z.string().optional(),
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
});

export type ListPostQuery = z.infer<typeof listPostQuerySchema>;
```

```ts
// application/post/dtos/post.dto.ts
export const postSchema = z.object({
  id: postIdSchema,
  title: z.string(),
  description: z.string(),
});

export type PostDto = z.infer<typeof postSchema>;
```

Le schéma du DTO sert aussi de contrat de réponse OpenAPI dans les routes Hono.

### Use case

```ts
// application/post/use-cases/create-post.use-case.ts
export interface CreatePostUseCaseDeps {
  postRepository: PostRepository;
  userRepository: UserRepository;
  postNotifierService: PostNotifierService;
}

export class CreatePostUseCase {
  constructor(private readonly deps: CreatePostUseCaseDeps) {}

  async execute(
    command: CreatePostCommand,
    context: SystemContext,
  ): Promise<string> {
    const authorId = UserId.make(context.userId);
    const author = await this.deps.userRepository.findById(authorId);
    if (!author) {
      throw new UserNotFoundError({ identifier: authorId.value });
    }
    const post = Post.create({
      authorId,
      title: command.title,
      description: command.description,
    });
    await this.deps.postRepository.save(post);
    await this.deps.postNotifierService.notifyPostCreated({
      to: author.props.email.value,
      title: command.title,
      description: command.description,
    });
    return post.id.value;
  }
}
```

- `SystemContext` (`application/common/contexts/system.context.ts`) porte l'identité de l'acteur (`userId`). Il est construit par le point d'entrée à partir de la session, **jamais** à partir d'un paramètre d'URL ou du corps de la requête.
- Le use case renvoie l'id ; la présentation relit via un read model si besoin.

### Ports de l'application

```ts
// application/post/read-models/post.read-model.ts
export interface PostReadModel {
  find(query: ListPostQuery): Promise<PaginatedDto<PostDto>>;
  findByUserId(userId: string, query: ListPostQuery): Promise<PaginatedDto<PostDto>>;
  findById(id: string): Promise<PostDto | null>;
}
```

```ts
// application/common/services/email.service.ts
export interface EmailService {
  send(params: { to: string; subject: string; body: string }): Promise<void>;
}
```

Le côté lecture manipule des primitives et des DTO : il n'y a pas d'entité à protéger.

## Infrastructure

### Schéma Drizzle

La table est au pluriel, la variable au singulier :

```ts
// infrastructure/post/schemas/drizzle-post.schema.ts
export const postTable = sqliteTable(
  "posts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    // createdAt, updatedAt…
  },
  (table) => [index("posts_userId_idx").on(table.userId)],
);
```

### Mapper

Le mapper est le seul endroit qui connaît à la fois les lignes de la base et le domaine. Il réhydrate avec `make()` (jamais `create()`), et les noms de colonnes n'ont pas à suivre les noms du domaine :

```ts
// infrastructure/post/mappers/drizzle-post.mapper.ts
export class DrizzlePostMapper {
  static toDto(row: typeof postTable.$inferSelect): PostDto {
    return { id: row.id, title: row.title, description: row.description };
  }

  static toDomain(row: typeof postTable.$inferSelect): Post {
    return Post.make(
      {
        authorId: UserId.make(row.userId),
        title: row.title,
        description: row.description,
      },
      PostId.make(row.id),
    );
  }

  static toPersistence(post: Post): typeof postTable.$inferInsert {
    return {
      id: post.id.value,
      userId: post.props.authorId.value,
      title: post.props.title,
      description: post.props.description,
    };
  }
}
```

### Repository et read model

```ts
// infrastructure/post/repositories/drizzle-post.repository.ts
export interface DrizzlePostRepositoryDeps {
  db: Database;
}

export class DrizzlePostRepository implements PostRepository {
  constructor(private readonly deps: DrizzlePostRepositoryDeps) {}

  async save(post: Post): Promise<void> {
    const row = DrizzlePostMapper.toPersistence(post);
    await this.deps.db.insert(postTable).values(row);
  }
}
```

```ts
// infrastructure/post/read-models/drizzle-post.read-model.ts
export class DrizzlePostReadModel implements PostReadModel {
  constructor(private readonly deps: DrizzlePostReadModelDeps) {}

  async findById(id: string): Promise<PostDto | null> {
    const rows = await this.deps.db
      .select()
      .from(postTable)
      .where(eq(postTable.id, id))
      .limit(1);
    const row = rows[0];
    return row ? DrizzlePostMapper.toDto(row) : null;
  }
  // find, findByUserId : select + where + limit/offset + count, mappés en DTO
}
```

### Services

Plusieurs implémentations d'un même port cohabitent, préfixées par leur technologie, et le container choisit :

```
infrastructure/common/services/email/
├── in-memory-email.service.ts    ← InMemoryEmailService (dev, tests)
├── nodemailer-email.service.ts   ← NodemailerEmailService
└── resend-email.service.ts       ← ResendEmailService
```

Un service métier (`PostNotifierService`) peut s'appuyer sur un service technique (`EmailService`) : l'implémentation `EmailPostNotifierService` reçoit `emailService` dans ses `deps` et rend le template (`infrastructure/emails/post-created.email.tsx`, react-email).

## Composition root

Un module par feature, qui ne connaît que des ports. Instancie chaque use case **une seule fois** et réutilise l'instance :

```ts
// lib/container/modules/post.module.ts
export type PostModuleDeps = {
  postRepository: PostRepository;
  postReadModel: PostReadModel;
  userRepository: UserRepository;
  postNotifierService: PostNotifierService;
};

export const createPostModule = (deps: PostModuleDeps) => {
  const createPostUseCase = new CreatePostUseCase({
    postRepository: deps.postRepository,
    userRepository: deps.userRepository,
    postNotifierService: deps.postNotifierService,
  });

  return {
    postReadModel: deps.postReadModel,
    createPostUseCase,
    postController: new PostController({
      postReadModel: deps.postReadModel,
      createPostUseCase,
    }),
  };
};
```

```ts
// lib/container/container.ts
type ContainerDeps = UserModuleDeps & PostModuleDeps & { authNotifierService: AuthNotifierService };

export const createContainer = (deps: ContainerDeps) => ({
  ...createUserModule(deps),
  ...createPostModule(deps),
  authNotifierService: deps.authNotifierService,
});
```

Seuls les containers d'environnement importent l'infrastructure :

```ts
// lib/container/container.prod.ts
const emailService = new ResendEmailService({ from: "…", apiKey: process.env.RESEND_API_KEY! });

export const prodContainer = createContainer({
  userRepository: new DrizzleUserRepository({ db }),
  postRepository: new DrizzlePostRepository({ db }),
  userReadModel: new DrizzleUserReadModel({ db }),
  postReadModel: new DrizzlePostReadModel({ db }),
  postNotifierService: new EmailPostNotifierService({ emailService }),
  authNotifierService: new EmailAuthNotifierService({ emailService }),
});
```

```ts
// lib/container/index.ts
const container = process.env.NODE_ENV === "production" ? prodContainer : devContainer;

export const {
  userReadModel,
  postReadModel,
  userController,
  postController,
  createUserUseCase,
  createPostUseCase,
} = container;
```

Les pages Server Components de `src/app` peuvent importer les read models depuis `@/lib/container` pour afficher des données : ce sont aussi des points d'entrée.

## Présentation

### Routes Hono (contrat OpenAPI)

```ts
// presentation/routes/post.routes.ts
export const getPostRoute = createRoute({
  method: "get",
  path: "/:postId",
  request: { params: z.object({ postId: postIdSchema }) },
  responses: singleItemResponse(postSchema, "Retrieve the post"),
});
```

### Controller

Un controller reçoit ses dépendances par constructeur et expose des handlers typés par la route. Il ne fait qu'extraire l'entrée validée, appeler l'application et formater la réponse :

```ts
// presentation/controllers/post.controller.ts
interface PostControllerDeps {
  postReadModel: PostReadModel;
  createPostUseCase: CreatePostUseCase;
}

export class PostController {
  constructor(private readonly deps: PostControllerDeps) {}

  show: RouteHandler<typeof getPostRoute> = async (c) => {
    const post = await this.deps.postReadModel.findById(c.req.valid("param").postId);
    return post ? c.json(post, 200) : c.notFound();
  };
}
```

### Router et montage

Le router est un point d'entrée : il importe les controllers depuis le container.

```ts
// presentation/routers/post.router.ts
export const postRouter = new OpenAPIHono()
  .openapi(listPostRoute, postController.index)
  .openapi(getPostRoute, postController.show);
```

```ts
// app/api/[[...route]]/route.ts
const app = new OpenAPIHono()
  .basePath("/api")
  .route("/posts", postRouter)
  .route("/users", userRouter);

export const GET = handle(app);
export const POST = handle(app);
```

### Server action

La server action valide l'entrée avec le schéma de la commande, construit le `SystemContext` à partir de la session et appelle le use case :

```ts
// presentation/actions/post.actions.ts
"use server";

export const createPostAction = authClient
  .inputSchema(createPostSchema)
  .action(async ({ parsedInput, ctx }) => {
    await createPostUseCase.execute(parsedInput, {
      userId: ctx.session.user.id,
    });
  });
```

`authClient` et `rolesClient([Role.ADMIN])` (`src/lib/safe-action.ts`) portent l'authentification et le contrôle de rôle : c'est une préoccupation du point d'entrée, pas du use case.

## Traduction des erreurs

Un seul endroit décide du statut HTTP de chaque catégorie d'erreur :

```ts
// presentation/common/domain-error-status.ts
export function domainErrorStatus(error: DomainError): 403 | 404 | 409 | 422 {
  if (error instanceof NotFoundError) return 404;
  if (error instanceof ConflictError) return 409;
  if (error instanceof ForbiddenError) return 403;
  return 422; // ValidationError, BusinessRuleError
}
```

Puis un handler par point d'entrée :

```ts
// app/api/[[...route]]/route.ts — HTTP
const app = new OpenAPIHono()
  .basePath("/api")
  .onError((error, c) => {
    if (error instanceof DomainError) {
      return c.json({ code: error.code, message: error.message }, domainErrorStatus(error));
    }
    console.error(error);
    return c.json({ code: "INTERNAL_ERROR", message: "Internal error" }, 500);
  });
```

```ts
// lib/safe-action.ts — server actions
export const actionClient = createSafeActionClient({
  handleServerError: (error) => {
    if (error instanceof DomainError) return error.message;
    console.error(error);
    return "Une erreur est survenue";
  },
});
```

## Points d'attention better-auth

- La table `user` (et `session`, `account`, `verification`) appartient à better-auth : son schéma est généré (`pnpm auth:generate`) dans `infrastructure/auth/schemas/drizzle-auth.schema.ts`. Ne le modifie pas à la main.
- better-auth génère les ids des utilisateurs : garde sa configuration par défaut, et `UserId` est un VO à schéma `z.string()`, sans préfixe.
- Les colonnes ajoutées par les plugins (par exemple `role`, `banned`, `banReason` avec le plugin `admin`) sont lisibles et modifiables par le repository et le mapper de la feature `user`.
