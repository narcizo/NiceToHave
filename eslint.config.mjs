import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import pluginQuery from "@tanstack/eslint-plugin-query";

export default tseslint.config(
  { ignores: ["dist", "coverage", "public", "node_modules"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}", "src/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    },
    plugins: {
      "react-hooks": reactHooks,
      prettier: eslintPluginPrettier,
      "simple-import-sort": simpleImportSort,
      "@tanstack/query": pluginQuery
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "prettier/prettier": [
        "error",
        {
          tabWidth: 2,
          trailingComma: "none"
        }
      ],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@tanstack/query/exhaustive-deps": "error",
      "@tanstack/query/no-rest-destructuring": "error",
      "@tanstack/query/stable-query-client": "error",
      "@tanstack/query/no-unstable-deps": "error",
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true
        }
      ]
    }
  }
);
