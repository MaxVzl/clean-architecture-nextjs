import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import unusedImports from "eslint-plugin-unused-imports";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    plugins: {
      prettier,
      import: importPlugin,
      "unused-imports": unusedImports,
    },
    rules: {
      "prettier/prettier": ["error", { endOfLine: "auto" }],
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "no-undef": "error",
      eqeqeq: "error",
      "import/no-duplicates": ["error", { considerQueryString: true }],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  // Règle de dépendance entre couches (docs/architecture/conventions.md)
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
]);

export default eslintConfig;
