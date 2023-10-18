# Linting

The `next-pwa` repository runs [ESLint](https://eslint.org), [Prettier](https://prettier.io) to lint and format the codebase.

To lint the codebase (except `examples` and `docs`) you can run:

```sh
pnpm lint
```

If you get errors, you can run the ESLint and Prettier auto-fix using:

```sh
pnpm lint -- --fix
```

Not all rules can be auto-fixed, so some manual changes might be required.

## ESLint

We recommend installing the [ESLint plugin for VS Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

You can find the enabled rules in the [ESLint config](../../.eslintrc.cjs).

## Prettier

We recommend installing the [Prettier plugin for VS Code](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

You can find the format configuration in the [Prettier config](../../.prettierrc.json).
