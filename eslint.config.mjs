import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-next";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_", // Ignore les arguments qui commencent par _
          varsIgnorePattern: "^_", // Ignore les variables qui commencent par _
          caughtErrorsIgnorePattern: "^_", // Ignore les erreurs dans les catch
        },
      ],
      "no-undef": "error",
      eqeqeq: "error",
      "prettier/prettier": "error",
    },
  },
]);

export default eslintConfig;
