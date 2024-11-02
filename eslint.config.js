import js from "@eslint/js";
import ts from "typescript-eslint";
import svelte from "eslint-plugin-svelte";
import prettier from "eslint-config-prettier";
import sort from "eslint-plugin-simple-import-sort";
import turbo from "eslint-plugin-turbo";
import globals from "globals";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  .../** @type {import('eslint').Linter.Config[]} */ (ts.configs.recommended),
  ...svelte.configs["flat/recommended"],
  prettier,
  ...svelte.configs["flat/prettier"],
  {
    ignores: ["**/*.*", "!**/*.svelte", "!**/*.md", "**/build/", "**/.svelte-kit/", "**/dist/"],
  },
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: "tsconfig.eslint.json",
        ecmaVersion: "latest",
        sourceType: "module",
        warnOnUnsupportedTypeScriptVersion: false,
        extraFileExtensions: [".svelte"],
      },
    },
  },
  {
    plugins: {
      turbo: {
        rules: turbo.rules,
      },
      "simple-import-sort": sort,
    },
    rules: {
      "constructor-super": "off", // ts(2335) & ts(2377)
      "getter-return": "off", // ts(2378)
      "no-const-assign": "off", // ts(2588)
      "no-dupe-args": "off", // ts(2300)
      "no-dupe-class-members": "off", // ts(2393) & ts(2300)
      "no-dupe-keys": "off", // ts(1117)
      "no-func-assign": "off", // ts(2630)
      "no-import-assign": "off", // ts(2632) & ts(2540)
      "no-new-native-nonconstructor": "off", // ts(7009)
      "no-obj-calls": "off", // ts(2349)
      "no-redeclare": "off", // ts(2451)
      "no-setter-return": "off", // ts(2408)
      "no-this-before-super": "off", // ts(2376) & ts(17009)
      "no-undef": "off", // ts(2304) & ts(2552)
      "no-unreachable": "off", // ts(7027)
      "no-unsafe-negation": "off", // ts(2365) & ts(2322) & ts(2358)
      "no-var": "error", // ts transpiles let/const to var, so no need for vars any more
      "no-fallthrough": "off",
      "no-unused-vars": "off",
      "no-extra-boolean-cast": "off",
      "prefer-const": "off",
      "prefer-rest-params": "error", // ts provides better types with rest args over arguments
      "prefer-spread": "error", // ts transpiles spread to apply, so no need for manual apply
      "@typescript-eslint/ban-ts-comment": "error",
      "@typescript-eslint/no-unused-expressions": "off", // svelte's `$effect` sometimes needs dangling expressions to track variables
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          ignoreRestSiblings: true,
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],
      // Doesn't play nice with using stores...
      "svelte/valid-compile": "off",
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",
      "turbo/no-undeclared-env-vars": "off",
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
      },
    },
  },
];
