# Avancement : skills backend

État au **2026-10-06**. Ce document permet de reprendre le travail dans une nouvelle session, sur n'importe quelle machine.

## Objectif

Ce dépôt est un **laboratoire d'architecture**, pas une application de production. Il sert de code de référence pour écrire des **skills Claude** qui apprennent à bien concevoir une application. On commence par les skills **backend**.

Principes retenus pour les skills :
- **Réutilisables** sur d'autres projets : elles embarquent leurs règles et leurs exemples dans `references/`, et ce dépôt sert de terrain de test.
- Rangées dans **ce dépôt**, sous `.claude/skills/<nom>/`, et rédigées **en français**.
- Testées avec le **flux complet de skill-creator** : agents avec et sans skill en parallèle, notation automatique, page de revue.

## Source de vérité

Toutes les décisions d'architecture sont dans **`docs/architecture/conventions.md`**. Il se termine par un journal daté des décisions. Une règle évolue d'abord dans ce fichier, puis dans le code, puis dans les skills.

En résumé :

| Sujet | Décision |
|---|---|
| Couches | `src/core/{domain,application,infrastructure,presentation}`, découpées par feature (la présentation par catégorie) |
| Règle de dépendance | Vers l'intérieur, vérifiée par ESLint (`import/no-restricted-paths`) |
| Composition root | `src/lib/container/` ; seuls les points d'entrée (actions, routers, middlewares) importent `@/lib` |
| Factories | `make()` = construction technique (mappers) ; `create()` = factory métier propre à l'entité |
| Identifiants | Un VO par entité, préfixé (`post-<uuid>`) ; exception : `UserId` = `z.string()`, géré par better-auth, non personnalisé |
| Erreurs | Exceptions typées par catégorie (`NotFound`, `Conflict`, `Forbidden`, `BusinessRule`, `Validation`) avec un `code` ; traduction à un seul endroit par point d'entrée |
| Ports | Nommés selon leur nature : `repositories/` (domaine), `services/` et `read-models/` (application) ; implémentations préfixées par leur techno |
| CQRS | Écriture : use case → entités → repository. Lecture : read model → DTO |
| Nommage | Singulier pour ce qui nomme l'entité ; pluriel pour les dossiers de catégorie, les tables SQL, les URLs REST et les collections |
| Injection | Par constructeur, avec un objet `deps` typé `XxxDeps` ; pas de classe de base vide |
| Contrôle d'accès | Rôle global dans la présentation ; règles qui dépendent des données dans le domaine (`ForbiddenError`) |
| Zod | Autorisé dans le domaine ; le schéma d'un VO est réutilisé par les commandes, les DTO et les routes |

## Ce qui est fait

### 1. Audit et remise à niveau du code de référence

- Un audit initial de `src/core` est dans `audit.md`, à la racine. Une partie des constats a été traitée depuis.
- **Domaine** :
  - ids typés `UserId` et `PostId` (le VO `UUID` générique est supprimé) ;
  - VO `UserName` ;
  - `Entity.equals` compare les ids, et `ValueObject.equals` fait une comparaison profonde ;
  - catégories d'erreurs avec `code` ;
  - `Post.userId` renommé `authorId: UserId`.
- **Application et infrastructure** :
  - les query services sont renommés en **read models** (`*.read-model.ts`) ;
  - tout ce qui nomme une entité est passé au singulier (`UserRepository`, `postTable`…).
- **Présentation et câblage** :
  - les classes de base `UseCase` et `Controller` sont supprimées ;
  - chaque use case n'est instancié qu'une seule fois par module ;
  - la règle ESLint de dépendance entre couches est en place.

### 2. Skill `domain-modeling` (`.claude/skills/domain-modeling/`)

- Elle couvre les entités, les VO, les ids, les erreurs, les enums, les ports de repository et une règle de périmètre (signaler les écarts existants sans les corriger).
- `references/base-classes.md` contient le code exact de `domain/common/`. `references/examples.md` déroule une feature `Invoice` complète.
- **Évaluée (itération 1)** : 97 % avec la skill, contre 72 % sans. Le gain se voit surtout sur projet vierge : 12/12 contre 4/12.

### 3. Skill `backend-architecture` (`.claude/skills/backend-architecture/`)

- Elle couvre les couches, la règle de dépendance, l'arborescence, les suffixes de fichiers, les ports et adaptateurs, le CQRS, l'injection, le composition root, les erreurs, le contrôle d'accès, un tableau « Où va quoi ? », la marche à suivre pour ajouter une feature, la règle de périmètre et une checklist.
- `references/stack-nextjs-hono-drizzle.md` déroule une feature de bout en bout avec la stack. `references/eslint-boundaries.md` contient la config ESLint.
- **Itération 1** (3 demandes dans ce dépôt) : 100 % contre 100 %. Le code de référence et ESLint guident déjà l'agent, donc ces demandes ne mesurent pas la skill.
- **Itération 2** (2 projets hors de ce dépôt) : **100 % contre 69 %**.
  - Projet vierge : 18/18 contre 10/18. Sans la skill, l'architecture est saine, mais l'agent ne suit pas les conventions et n'utilise pas de read model.
  - Projet mal structuré : 11/11 contre 9/11.

Chaque skill contient ses demandes de test (`evals/evals.json`) et son script de notation (`evals/grade.py`).

**Où sont les commits :** les deux skills sont sur la branche **`feat/backend-skills`**, pas encore fusionnée dans `main`.

## Comment on teste une skill

C'est le processus de skill-creator (`/skill-creator`) :

1. **Cadrer la skill** avec l'utilisateur, puis écrire `SKILL.md` et ses `references/`. Vérifier que les exemples de code compilent dans le projet.
2. **Proposer 2 ou 3 demandes réalistes** et les faire valider.
3. **Préparer une copie isolée du projet par exécution** (`git archive`, puis un lien symbolique vers `node_modules` et un commit de base pour pouvoir faire un diff). Inclure au moins un **projet hors de ce dépôt** (vierge ou mal structuré) : dans ce dépôt, le code de référence guide déjà l'agent.
4. **Lancer en parallèle** un agent avec la skill et un agent sans skill par demande. Enregistrer `timing.json` à partir de chaque notification.
5. **Noter avec `grade.py`**. Séparer les critères d'**architecture** et les critères de **convention** (préfixés « Convention : »). Relire les critères qui échouent : ils ont déjà produit des faux positifs et des faux négatifs.
6. Lancer `aggregate_benchmark`, ajouter les observations dans `benchmark.json`, puis générer la page avec `generate_review.py --static`. Sous WSL, l'ouvrir avec `explorer.exe`.
7. Lire `feedback.json`, corriger la skill et itérer.

Les espaces de travail des tests vivaient dans un dossier temporaire de session : ils ne sont **pas conservés**. Seuls `evals.json` et `grade.py` sont versionnés.

## Ce qu'il reste à faire

### Prochaines skills backend (dans cet ordre)

1. **`application-layer`** : use cases, commandes et requêtes (schémas zod réutilisant les VO), DTO, `SystemContext`, ports de services, orchestration (unicité, notifications).
2. **`read-models`** (ou à fusionner avec la précédente) : read models, pagination, filtres, DTO de lecture.
3. **`infrastructure-adapters`** : schémas Drizzle, mappers (`make()` pour réhydrater), repositories, read models, services externes, plusieurs implémentations d'un même port.
4. **`http-presentation`** : routes Hono et OpenAPI, controllers, routers, server actions, traduction des erreurs, middlewares.
5. **`add-backend-feature`** : workflow qui enchaîne les skills pour livrer une tranche verticale complète.
6. **`architecture-review`** : checklist d'audit (`audit.md` et la demande de test « revue avec fautes plantées » en sont une base).

Optionnel : optimiser la `description` des deux skills existantes (boucle de déclenchement de skill-creator, environ 15 minutes en arrière-plan).

### Écarts connus dans le code de référence

Ces écarts ont été laissés volontairement, à traiter quand on écrira la skill concernée :

- **Traduction des erreurs absente** : pas de `onError` dans `src/app/api/[[...route]]/route.ts`, et `handleServerError` (`src/lib/safe-action.ts`) renvoie `error.message` pour toutes les erreurs. Le code cible, vérifié, est dans la référence de `backend-architecture`.
- **Usurpation possible** : `POST /api/users/:userId/posts` prend l'auteur dans l'URL (`post.controller.ts`) au lieu de la session, sans authentification.
- `AuthMiddleware` n'est utilisé nulle part, et la classe de base vide `Middleware` (`presentation/common/middleware.base.ts`) existe encore.
- `Post.title` et `Post.description` sont de simples `string`, sans VO. `User.infos()` est de la logique de présentation dans une entité.
- Pagination : `offset` est en réalité un numéro de page, et `limit` n'a pas de plafond.
- `CreateUserUseCase` écrit directement dans la table `user` de better-auth : l'utilisateur créé n'a pas de compte et ne peut pas se connecter.
- `container.prod.ts` utilise `InMemoryEmailService`. C'est **accepté** pour ce laboratoire.
- `local.db` : les posts existants ont des ids sans préfixe `post-`, il faut les recréer.
- `pnpm-workspace.yaml` contient une modification locale non committée (bloc `allowBuilds`), sans rapport avec ce travail.

## Pour reprendre dans une nouvelle session

1. Récupérer la branche `feat/backend-skills` (ou la fusionner dans `main`).
2. Démarrer la session avec, par exemple :

> Lis `docs/skills/avancement.md` et `docs/architecture/conventions.md`. On continue l'écriture des skills backend avec `/skill-creator` : on attaque `application-layer`, en suivant la même méthode de test (avec ou sans skill, au moins un projet hors du dépôt).
