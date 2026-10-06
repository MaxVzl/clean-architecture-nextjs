# Faire respecter la règle de dépendance avec ESLint

La règle `import/no-restricted-paths` (plugin `eslint-plugin-import`) transforme tout import entre couches non autorisé en erreur de lint. Elle comprend les alias TypeScript (`@/…`) dès que le resolver TypeScript est configuré (c'est le cas avec `eslint-config-next`).

Prérequis : `eslint-plugin-import` installé et enregistré sous le nom `import` dans la config.

## Config (flat config, `eslint.config.mjs`)

Adapte les chemins si le backend n'est pas dans `src/core` ou le composition root pas dans `src/lib`. Ajoute ces deux blocs **après** la config existante :

```js
  // Règle de dépendance entre couches
  {
    files: ["src/core/**/*.{ts,tsx}"],
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          basePath: import.meta.dirname,
          zones: [
            {
              target: "./src/core/domain",
              from: [
                "./src/core/application",
                "./src/core/infrastructure",
                "./src/core/presentation",
                "./src/lib",
                "./src/app",
              ],
              message: "Le domaine n'importe que du domaine (+ zod, uuid).",
            },
            {
              target: "./src/core/application",
              from: [
                "./src/core/infrastructure",
                "./src/core/presentation",
                "./src/lib",
                "./src/app",
              ],
              message:
                "L'application n'importe que l'application et le domaine.",
            },
            {
              target: "./src/core/infrastructure",
              from: ["./src/core/presentation", "./src/lib", "./src/app"],
              message:
                "L'infrastructure n'importe que le domaine, l'application et l'infrastructure.",
            },
            {
              target: "./src/core/presentation",
              from: ["./src/core/infrastructure", "./src/app"],
              message:
                "La présentation passe par les ports de l'application, jamais par l'infrastructure.",
            },
            {
              target: "./src/core/presentation",
              from: "./src/lib",
              message:
                "Seuls les points d'entrée (actions, routers, middlewares) importent @/lib.",
            },
          ],
        },
      ],
    },
  },
  {
    // Points d'entrée de la présentation : seuls autorisés à importer @/lib
    // (composition root, client d'actions, auth).
    files: [
      "src/core/presentation/actions/**",
      "src/core/presentation/routers/**",
      "src/core/presentation/middlewares/**",
    ],
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          basePath: import.meta.dirname,
          zones: [
            {
              target: "./src/core/presentation",
              from: ["./src/core/infrastructure", "./src/app"],
              message:
                "La présentation passe par les ports de l'application, jamais par l'infrastructure.",
            },
          ],
        },
      ],
    },
  },
```

Le second bloc **remplace** la règle pour les points d'entrée (en flat config, la dernière déclaration d'une règle qui correspond à un fichier l'emporte) : il garde l'interdiction de l'infrastructure mais lève celle de `@/lib`.

## Vérifier que la règle fonctionne

Après l'avoir ajoutée :

1. `npx eslint src` doit passer sur le code existant. S'il échoue, ce sont de vraies violations : signale-les plutôt que d'assouplir la règle.
2. Crée temporairement un fichier `src/core/domain/_check.ts` qui importe depuis `@/core/infrastructure/…`, lance ESLint dessus : une erreur `import/no-restricted-paths` doit apparaître. Supprime le fichier.
