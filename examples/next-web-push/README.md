# Serwist example - next-web-push

This example demonstrates how to add push notifications to an app using Serwist with Next.js.

## Usage

1. Init the project

   [![Open in Gitpod and run](https://img.shields.io/badge/Open%20In-Gitpod.io-%231966D2?style=for-the-badge&logo=gitpod)](https://gitpod.io/#https://github.com/serwist/serwist/)

   ```bash
   cd examples/next-web-push
   ```

   or

   Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), [pnpm](https://pnpm.io), or [bun](https://bun.sh) to bootstrap the example:

   ```bash
   npx create-next-app --example https://github.com/serwist/serwist/tree/main/examples/next-web-push my-app
   ```

   ```bash
   yarn create next-app --example https://github.com/serwist/serwist/tree/main/examples/next-web-push my-app
   ```

   ```bash
   pnpm create next-app --example https://github.com/serwist/serwist/tree/main/examples/next-web-push my-app
   ```

   ```bash
   bun create next-app --example https://github.com/serwist/serwist/tree/main/examples/next-web-push my-app
   ```

1. Run

   ```bash
   pnpm web-push generate-vapid-keys --json
   ```

1. Create a `.env` file, and put the keys generated from the previous steps

   ```shell
   WEB_PUSH_EMAIL=user@example.com
   WEB_PUSH_PRIVATE_KEY=<vapid-private-key>
   NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY=<vapid-public-key>
   ```

1. Build and start

   ```bash
   pnpm build
   pnpm start
   ```

## Recommended `.gitignore`

```gitignore
**/public/sw**
**/public/swe**
```
