# Linting

The Serwist repository uses Biome to lint and format the codebase.

To lint the codebase (excluding the "examples" and "docs" directories), you should run:

```sh
pnpm lint
```

If you get errors, you can run Biome's auto-fix using:

```sh
pnpm lint:fix
```

Not all rules can be auto-fixed, so some manual changes might be required.
