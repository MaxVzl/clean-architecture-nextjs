---
name: backend-architecture
description: Architecture backend TypeScript en Clean Architecture / hexagonale avec CQRS léger — couches (domain, application, infrastructure, presentation), règle de dépendance, arborescence par feature, nommage des fichiers et des ports, injection de dépendances et composition root, flux lecture/écriture, gestion des erreurs entre couches. Utilise cette skill dès que l'utilisateur démarre un backend, ajoute une feature qui traverse plusieurs couches (« ajoute la gestion des commandes », « expose une API pour… », « crée le use case et la route »), se demande où placer un fichier ou une classe, câble une dépendance dans le container, met en place la structure d'un projet, ou demande une revue d'architecture — même s'il ne prononce pas les mots « clean architecture » ou « couche ». Pour le détail des entités, value objects et erreurs métier, combine-la avec la skill domain-modeling.
---

# Architecture backend

Cette skill est le **socle** : elle dit comment le backend est découpé, qui a le droit de dépendre de qui, où va chaque fichier et comment le tout est assemblé. Les skills spécialisées (comme `domain-modeling` pour la couche domaine) détaillent ensuite chaque couche.

Les règles ci-dessous sont **indépendantes des frameworks**. Pour leur application concrète avec Next.js + Hono + Drizzle + zod + better-auth, lis [references/stack-nextjs-hono-drizzle.md](references/stack-nextjs-hono-drizzle.md).

## Avant de commencer

1. **Repère la structure existante** : la racine du backend (souvent `src/core/`), le composition root (souvent `src/lib/container/`), l'alias d'import (`@/…`). Si le projet a un document de conventions (par exemple `docs/architecture/conventions.md`), lis-le : il prime sur cette skill en cas de divergence.
2. **Lis une feature complète** déjà en place, de la route jusqu'au repository, pour reprendre le style local.
3. **Reste dans le périmètre de la demande**, pour que l'utilisateur garde des changements prévisibles et décide lui-même du reste :
   - si tu repères du code existant qui enfreint ces règles et qui ne fait pas partie de la demande, ne le modifie pas : signale-le dans ton compte rendu (fichier + règle) ;
   - n'ajoute pas de point d'entrée ou de fonctionnalité non demandés (une server action alors qu'on a demandé une API, un endpoint de suppression alors qu'on a demandé la création…) : propose-les en fin de compte rendu ;
   - si la demande ne peut pas fonctionner sans toucher à du code partagé (par exemple, ajouter le handler d'erreurs global pour qu'une 409 existe), fais-le, et signale clairement l'effet sur le reste de l'application.

## Les 4 couches

```
src/core/
├── domain/          ← le métier : entités, value objects, erreurs, ports de repository
├── application/     ← les cas d'usage : use cases, commandes, requêtes, DTO, ports (services, read models)
├── infrastructure/  ← les adaptateurs techniques : base de données, email, cache, API externes
└── presentation/    ← les points d'entrée : routes HTTP, controllers, server actions, middlewares
```

| Couche | Responsabilité | Ne fait jamais |
|---|---|---|
| `domain` | Porter les règles métier et les invariants | Accéder à une base, lire l'heure ou l'environnement, connaître HTTP |
| `application` | Orchestrer un cas d'usage : charger, appeler le domaine, sauvegarder, notifier. Déclarer les ports dont il a besoin. | Contenir une règle métier qui appartient à une entité ; connaître une technologie (SQL, Resend…) |
| `infrastructure` | Implémenter les ports avec une technologie concrète, traduire entre le monde technique et le domaine (mappers) | Décider d'une règle métier ; être appelée directement par la présentation |
| `presentation` | Recevoir une requête, valider l'entrée, appeler un use case ou un read model, traduire le résultat et les erreurs en réponse | Contenir de la logique métier ; parler à la base de données |

## Règle de dépendance

Les dépendances vont **toujours vers l'intérieur** :

```
presentation ──► application ──► domain
infrastructure ─┘      ▲
       └───────────────┘   (l'infrastructure implémente les ports de l'application et du domaine)
```

| Couche | Peut importer |
|---|---|
| `domain` | `domain` uniquement (+ `zod`, `uuid`) |
| `application` | `domain`, `application` |
| `infrastructure` | `domain`, `application`, `infrastructure` |
| `presentation` | `domain`, `application`, `presentation` |

**Pourquoi c'est important :** le métier ne change pas quand on remplace Drizzle par Prisma ou Hono par Express. Si le domaine ou l'application importe une technologie, ce remplacement devient une réécriture, et les tests unitaires exigent une base de données.

**Une seule exception, assumée : le composition root.** Le container (`src/lib/container/`) vit **hors** des couches et connaît tout le monde, puisqu'il les assemble. Seuls les **points d'entrée** de la présentation ont le droit de l'importer : server actions, routers et middlewares. Raison : une server action Next.js ou un router de module est une fonction de module, on ne peut pas lui injecter ses dépendances par constructeur. Controllers, use cases, domaine et infrastructure ne l'importent jamais.

**Fais respecter la règle par l'outillage**, pas par la relecture : la config ESLint `import/no-restricted-paths` de [references/eslint-boundaries.md](references/eslint-boundaries.md) transforme tout import interdit en erreur de lint. Si le projet ne l'a pas encore, propose de l'ajouter.

## Arborescence et nommage

### Découpage

`domain`, `application` et `infrastructure` sont découpés **par feature**, puis par catégorie. `presentation` est découpée **par catégorie** (les routes, controllers et actions forment chacun un ensemble cohérent), et chaque fichier y est préfixé par sa feature.

```
domain/<feature>/{entities,value-objects,errors,enums,repositories}/
application/<feature>/{commands,queries,dtos,use-cases,services,read-models}/
infrastructure/<feature>/{repositories,read-models,services,mappers,schemas}/
presentation/{actions,controllers,routes,routers,middlewares,helpers}/
```

Ce qui est partagé entre features va dans `common/` (dans chaque couche) ; les briques techniques transverses de l'infrastructure (connexion à la base, templates d'email) ont leur propre dossier (`infrastructure/database/`, `infrastructure/emails/`).

### Suffixes de fichiers

Le suffixe dit ce que contient le fichier, sans avoir à l'ouvrir :

| Suffixe | Contenu | Couche |
|---|---|---|
| `.entity.ts` | Entité | domain |
| `.vo.ts` | Value object | domain |
| `.error.ts` | Erreur métier | domain |
| `.enum.ts` | Ensemble fermé de valeurs | domain |
| `.repository.ts` | Port de repository (domain) ou son implémentation (infrastructure) | domain / infrastructure |
| `.command.ts` | Schéma + type d'entrée d'une écriture | application |
| `.query.ts` | Schéma + type des paramètres d'une lecture | application |
| `.dto.ts` | Schéma + type d'une donnée renvoyée | application |
| `.use-case.ts` | Cas d'usage d'écriture | application |
| `.service.ts` | Port de service (application) ou son implémentation (infrastructure) | application / infrastructure |
| `.read-model.ts` | Port de lecture (application) ou son implémentation (infrastructure) | application / infrastructure |
| `.mapper.ts` | Traduction ligne de base ↔ entité / DTO | infrastructure |
| `.schema.ts` | Schéma de table | infrastructure |
| `.controller.ts`, `.routes.ts`, `.router.ts`, `.actions.ts`, `.middleware.ts` | Points d'entrée | presentation |

### Singulier ou pluriel

**Singulier** pour tout ce qui nomme l'entité ou la feature : dossiers de feature, fichiers, classes, interfaces, variables de dépendance (`post/`, `post.repository.ts`, `PostRepository`, `postReadModel`).

**Pluriel** uniquement pour : les dossiers de catégorie (`repositories/`, `use-cases/`), les tables SQL (`posts`), les URLs REST (`/api/posts`) et les variables qui contiennent une collection (`posts.map(…)`).

### Ports et adaptateurs

Un port est **nommé selon sa nature** — le suffixe du nom et le dossier disent ce qu'il est :

| Nature | Port | Dossier du port | Implémentation |
|---|---|---|---|
| Repository | `PostRepository` | `domain/<feature>/repositories/` | `DrizzlePostRepository` |
| Service | `EmailService`, `PostNotifierService` | `application/<feature>/services/` | `ResendEmailService`, `EmailPostNotifierService` |
| Read model | `PostReadModel` | `application/<feature>/read-models/` | `DrizzlePostReadModel` |

L'implémentation vit dans `infrastructure/<feature>/<même dossier>/` et est **préfixée par sa technologie** (fichier `drizzle-post.repository.ts`). Ça permet d'avoir plusieurs implémentations d'un même port côte à côte (`InMemoryEmailService`, `ResendEmailService`) et de choisir dans le container.

## CQRS : deux chemins distincts

**Écriture (commande)** — on passe par le métier :

```
presentation ─► use case ─► repository.findById ─► entité.méthodeMétier() ─► repository.save
   (valide la commande)        (charge des entités)     (applique les règles)     (persiste)
```

- L'entrée est une **commande** (`application/<feature>/commands/xxx.command.ts`) : un schéma zod et son type inféré.
- Le use case renvoie **au plus un identifiant**, jamais un DTO de lecture : après une écriture, la présentation relit via un read model si elle a besoin de données.

**Lecture (requête)** — on court-circuite le métier :

```
presentation ─► read model ─► DTO
   (valide la requête)   (requête optimisée, sans hydrater d'entités)
```

- Les paramètres sont une **requête** (`application/<feature>/queries/xxx.query.ts`), le résultat un **DTO** (`application/<feature>/dtos/xxx.dto.ts`).
- Le côté lecture ne passe **jamais** par les entités : charger des agrégats complets pour afficher une liste coûte cher et n'apporte rien, puisqu'aucune règle ne s'applique à une lecture.
- Recherche, filtres, pagination, jointures pour l'affichage : tout ça va dans le read model, pas dans le repository.

## Injection de dépendances

Chaque classe qui a des dépendances (use case, implémentation d'un port, controller) les reçoit **par constructeur, dans un objet `deps` typé par une interface `XxxDeps`** :

```ts
export interface CreatePostUseCaseDeps {
  postRepository: PostRepository;
  userRepository: UserRepository;
  postNotifierService: PostNotifierService;
}

export class CreatePostUseCase {
  constructor(private readonly deps: CreatePostUseCaseDeps) {}

  async execute(command: CreatePostCommand, context: SystemContext): Promise<string> {
    // …
  }
}
```

- Les dépendances sont typées par les **ports** (interfaces), jamais par les implémentations : le use case ne sait pas qu'il parle à Drizzle.
- L'objet `deps` nommé rend le câblage lisible et l'ajout d'une dépendance non cassant pour l'ordre des paramètres.
- Pas de classe de base vide (`UseCase<…>`, `Controller<…>`) juste pour stocker `deps` : une interface explicite suffit.

**Le composition root assemble tout**, une fois, au démarrage :

```
src/lib/container/
├── modules/<feature>.module.ts   ← instancie les use cases et controllers d'une feature à partir des ports
├── container.ts                  ← fusionne les modules (createContainer(deps))
├── container.dev.ts / .prod.ts   ← choisit les implémentations concrètes par environnement
└── index.ts                      ← sélectionne le container et exporte ce dont les points d'entrée ont besoin
```

Un module ne connaît que des **ports** ; seuls `container.dev.ts` / `container.prod.ts` importent des classes d'infrastructure. Changer de fournisseur d'email = changer une ligne dans un de ces deux fichiers.

## Erreurs entre couches

- Le **domaine** lève des erreurs typées qui héritent d'une catégorie (`NotFoundError`, `ConflictError`, `ForbiddenError`, `BusinessRuleError`, `ValidationError`) et portent un `code` stable (voir la skill `domain-modeling`).
- L'**application** lève aussi ces erreurs quand la règle dépasse une seule entité (ressource introuvable, unicité).
- La **présentation** les traduit en réponse **à un seul endroit par point d'entrée** (handler d'erreurs HTTP global, handler d'erreurs du client de server actions) : catégorie → statut HTTP, `code` → corps de réponse.
- Toute erreur qui n'est pas une erreur de domaine est un bug : on la logue et on renvoie un message générique, sans jamais exposer son message au client.
- On ne fait jamais `throw new Error()` dans `domain` ou `application`.

## Contrôle d'accès

Une règle d'accès se vérifie à l'un de deux niveaux, selon ce dont elle dépend :

| Type de règle | Exemple | Où | Pourquoi |
|---|---|---|---|
| **Authentification et rôle global** de l'utilisateur | « il faut être connecté », « seul un admin peut créer un tag » | **Point d'entrée de la présentation** : client d'actions par rôle, middleware HTTP | Elle ne dépend que de la session : on la vérifie avant tout, et on répond vite par une 401 ou une 403, sans charger de données |
| **Règle qui dépend des données** | « seul l'auteur peut supprimer son post », « seul un owner de l'organisation peut inviter » | **Domaine** (méthode de l'entité), ou use case si plusieurs entités sont en jeu, avec une `ForbiddenError` codée | C'est une règle métier : elle doit tenir quel que soit le point d'entrée (API, server action, script) |

Le use case reçoit l'identité de l'acteur dans un contexte (`SystemContext`) construit par le point d'entrée **à partir de la session**, jamais à partir d'un paramètre d'URL ou du corps de la requête.

## Validation et schémas zod

Une règle de format n'est écrite **qu'une fois**, dans le schéma du value object (`emailSchema`, `postTitleSchema`), puis réutilisée :

```
domain (VO)  ──►  application (commande, DTO)  ──►  presentation (validation d'entrée, OpenAPI)
emailSchema       createUserSchema = z.object({     route.request.body = createUserSchema
                    email: emailSchema, … })
```

La présentation valide l'entrée avec le schéma de la commande ou de la requête **avant** d'appeler l'application ; le domaine revalide quand il construit ses VO. La double validation est voulue : la première donne un message d'erreur propre à l'utilisateur, la seconde garantit qu'aucun appel (script, test, autre point d'entrée) ne contourne la règle.

## Où va quoi ?

| Je dois écrire… | Ça va dans |
|---|---|
| Une règle qui ne dépend que de l'état d'une entité | Méthode de l'entité (`domain`) |
| Une règle qui demande de consulter d'autres données (unicité, existence) | Use case (`application`), via un repository |
| Le format d'une valeur (email, slug, longueur) | Schéma du value object (`domain`) |
| La forme de l'entrée d'un formulaire ou d'un POST | Commande (`application/<feature>/commands/`) |
| Une liste paginée / filtrée pour l'affichage | Read model : port dans `application`, implémentation dans `infrastructure` |
| L'envoi d'un email, un appel à une API externe | Port de service dans `application`, implémentation dans `infrastructure` |
| Une requête SQL, un schéma de table | `infrastructure/<feature>/` |
| La conversion ligne de base ↔ entité | Mapper (`infrastructure/<feature>/mappers/`) |
| La vérification « l'utilisateur est connecté / a le rôle admin » | Point d'entrée de la présentation (middleware, client d'actions par rôle) |
| La vérification « seul l'auteur peut modifier son commentaire » | Domaine (règle métier qui dépend des données), `ForbiddenError` codée |
| Le choix de l'implémentation d'un port | Composition root (`container.dev.ts` / `container.prod.ts`) |

## Ajouter une feature de bout en bout

Travaille **de l'intérieur vers l'extérieur** : chaque couche ne dépend que de ce qui existe déjà.

1. **Domaine** : entité, VO (dont l'id), erreurs, port de repository. → applique la skill `domain-modeling`.
2. **Application** : commandes et requêtes (schémas zod réutilisant les VO), DTO, use cases d'écriture, ports de read model et de services.
3. **Infrastructure** : schéma de table, mapper, implémentations du repository, du read model et des services.
4. **Composition root** : module de la feature, ajout au container, implémentations dans `container.dev.ts` et `container.prod.ts`, exports dans `index.ts`.
5. **Présentation** : routes, controller, router, server actions ; traduction des erreurs si de nouvelles catégories apparaissent.
6. **Vérifie** : compilation TypeScript et lint (la règle de dépendance doit passer).

Si la demande ne porte que sur une partie (« juste le domaine »), arrête-toi à cette partie et indique dans ton compte rendu les étapes restantes.

## Checklist avant de rendre la main

- [ ] Chaque fichier est dans la bonne couche, le bon dossier de feature et de catégorie, avec le bon suffixe.
- [ ] Aucun import ne viole la règle de dépendance (le lint passe) ; seuls actions, routers et middlewares importent le container.
- [ ] Les écritures passent par un use case qui manipule des entités ; les lectures passent par un read model qui renvoie des DTO.
- [ ] Les dépendances sont injectées par constructeur, typées par des ports, dans un objet `deps` avec son interface `XxxDeps`.
- [ ] Les implémentations sont préfixées par leur technologie et branchées dans le composition root uniquement.
- [ ] Les règles de format sont définies une seule fois, dans les schémas des VO, et réutilisées.
- [ ] Les erreurs sont typées et codées ; leur traduction en réponse se fait à un seul endroit par point d'entrée.
- [ ] Nommage au singulier pour ce qui désigne l'entité ; pluriel seulement pour les catégories, tables SQL, URLs et collections.
- [ ] TypeScript compile et le lint passe.
