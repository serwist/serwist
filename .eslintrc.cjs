// @ts-check
/** @type {import("eslint").Linter.BaseConfig} */
module.exports = {
  ignorePatterns: ["*.*", "!*.svelte", "!*.md"],
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:svelte/recommended", "turbo", "prettier"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "tsconfig.eslint.json",
    ecmaVersion: "latest",
    sourceType: "module",
    warnOnUnsupportedTypeScriptVersion: false,
    extraFileExtensions: [".svelte"],
  },
  plugins: ["@typescript-eslint", "simple-import-sort"],
  rules: {
    "@typescript-eslint/ban-ts-comment": "error",
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
    "no-fallthrough": "off",
    "no-undef": "off",
    "no-unused-vars": "off",
    "no-extra-boolean-cast": "off",
    // Doesn't play nice with using stores...
    "svelte/valid-compile": "off",
    "simple-import-sort/imports": "warn",
    "simple-import-sort/exports": "warn",
    "turbo/no-undeclared-env-vars": "off",
  },
  overrides: [
    {
      files: ["*.svelte"],
      parser: "svelte-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
    },
  ],
};
