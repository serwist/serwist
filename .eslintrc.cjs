// @ts-check
const TSCONFIG_SOURCES = /** @type {const} */ ([
  "tsconfig.json",
  "tsconfig.eslint.json",
  "examples/*/tsconfig.json",
  "packages/*/tsconfig.json",
]);

/** @type {import("eslint").Linter.BaseConfig} */
module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "turbo",
    "prettier",
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: TSCONFIG_SOURCES,
    ecmaVersion: "latest",
    sourceType: "module",
    warnOnUnsupportedTypeScriptVersion: false,
  },
  plugins: ["@typescript-eslint", "simple-import-sort"],
  rules: {
    "@typescript-eslint/ban-ts-comment": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/consistent-type-imports": "warn",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        ignoreRestSiblings: true,
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
      },
    ],
    "import/no-extraneous-dependencies": "off",
    // Doesn't really work with VSCode...
    "import/no-unresolved": "off",
    "import/no-named-as-default": "off",
    "import/no-named-as-default-member": "off",
    "no-fallthrough": "off",
    "no-unused-vars": "off",
    "no-extra-boolean-cast": "off",
    "simple-import-sort/imports": "warn",
    "simple-import-sort/exports": "warn",
    "turbo/no-undeclared-env-vars": "off",
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx", ".mjs", ".cjs", ".js"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: TSCONFIG_SOURCES,
      },
    },
    "import/internal-regex": "^@ducanh2912/",
    "import/external-module-folders": [
      "packages/next-pwa",
      "packages/next-sw",
      "packages/utils",
      "packages/constants",
      "node_modules",
    ],
    next: {
      rootDir: ["./docs/", "./examples/*/"],
    },
  },
  overrides: [
    {
      files: ["packages/**"],
      rules: {
        "turbo/no-undeclared-env-vars": [
          "error",
          {
            allowList: ["^__PWA_FALLBACK_(.*)__+$", "^NEXT_PWA_(.*)+$"],
          },
        ],
      },
    },
    {
      files: ["packages/*/__tests__/**"],
      env: {
        jest: true,
      },
      rules: {
        "import/no-extraneous-dependencies": "off",
      },
    },
  ],
};
