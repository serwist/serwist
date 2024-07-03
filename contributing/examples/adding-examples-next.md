## Adding examples

When you add an example to the [examples](https://github.com/serwist/serwist/tree/main/examples) directory, please follow these guidelines (as well as the main guidelines):

- If API routes aren't used in an example, they should be omitted.
- Use function expressions rather than arrow function expressions for pages and API routes.

## Template

````markdown
# Serwist example - EXAMPLE_NAME

This example demonstrates how to use Serwist with DESCRIPTION.

## Usage

[![Open in Gitpod and run](https://img.shields.io/badge/Open%20In-Gitpod.io-%231966D2?style=for-the-badge&logo=gitpod)](https://gitpod.io/#https://github.com/serwist/serwist/)

```bash
cd examples/DIRECTORY_NAME
pnpm build
pnpm start
```

or

Execute [`degit`](https://github.com/Rich-Harris/degit) with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), [pnpm](https://pnpm.io), or [bun](https://bun.sh) to bootstrap the example:

```bash
npx degit serwist/serwist/examples/DIRECTORY_NAME my-app
```

```bash
yarn degit serwist/serwist/examples/DIRECTORY_NAME my-app
```

```bash
pnpx degit serwist/serwist/examples/DIRECTORY_NAME my-app
```

```bash
bunx degit serwist/serwist/examples/DIRECTORY_NAME my-app
```

## Recommended `.gitignore`

```gitignore
public/sw*
public/swe-worker*
```
````
