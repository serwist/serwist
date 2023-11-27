## Adding examples

When you add an example to the [examples](https://github.com/serwist/serwist/tree/main/examples) directory, please follow these guidelines:

- TypeScript should be leveraged for new examples.
- If API routes aren't used in an example, they should be omitted.
- If an example exists for a certain library and you would like to showcase a specific feature of that library, the existing example should be updated (instead of adding a new example).
- Package manager specific config should not be added (e.g. `resolutions` in `package.json`).
- Dependencies' versions should be up-to-date (you can run `pnpm deps` in this repo's root directory to update everything in it).
- Use `const Page = () => <></>; export default Page;` for page components and `export const GET = () => {}` for API Routes.
- Example directories should not be prefixed with `with-`.
- Make sure linting passes (you can run `pnpm build && pnpm examples:lint` to verify and `pnpm examples:lint -- --fix` for automatic fixes).
- Avoid running `pnpm examples:build` as it is resource-heavy.

Also, don’t forget to add a `README.md` file with the following format:

- Replace `DIRECTORY_NAME` with the directory name you’re adding.
- Fill in `Serwist example - EXAMPLE_NAME` and `DESCRIPTION`.
- To add additional notes, add `## Notes` section at the end.

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

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), or [pnpm](https://pnpm.io) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/serwist/serwist/tree/main/examples/DIRECTORY_NAME DIRECTORY_NAME-app
```

```bash
yarn create next-app --example https://github.com/serwist/serwist/tree/main/examples/DIRECTORY_NAME DIRECTORY_NAME-app
```

```bash
pnpm create next-app --example https://github.com/serwist/serwist/tree/main/examples/DIRECTORY_NAME DIRECTORY_NAME-app
```

## Recommended `.gitignore`

```gitignore
**/public/serwist-*.js
**/public/sw.js
```
````
