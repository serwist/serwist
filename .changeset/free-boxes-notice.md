---
"@serwist/next": patch
---

feat(next): added config mode

- This patch adds config mode to `@serwist/next`, which allows running `@serwist/next` after building the Next.js application. This change allows `@serwist/next` to automatically determine and precache prerendered routes. To migrate:

  - Install `concurrently`, `esbuild`, and `@serwist/cli`:

    ```bash
    npm install -D concurrently esbuild @serwist/cli
    ```

  - Remove `withSerwist` from next.config.js:

    ```js
    // @ts-check
    /** @type {import("next").NextConfig} */
    const nextConfig = {
      reactStrictMode: true,
    };

    export default nextConfig;
    ```

  - Add serwist.config.js:

    ```js
    // @ts-check
    import { serwist } from "@serwist/next/config";

    export default await serwist({
      swSrc: "app/sw.ts",
      swDest: "public/sw.js",
    });
    ```

    If you don't want Serwist to precache prerendered routes, set `precachePrerendered` to `false`.

  - Change your build script:

    ```json
    {
      "scripts": {
        "dev": "concurrently 'serwist build --watch' 'next dev'",
        "build": "next build && serwist build"
      }
    }
    ```

    If you want the Serwist config file to be somewhere else, add `--config path/to/config.js`.

  - Add app/serwist.ts to re-export `SerwistProvider` from `@serwist/next`:

    ```js
    "use client";
    export { SerwistProvider } from "@serwist/next/react";
    ```

  - Wrap your app in `SerwistProvider`:

    ```tsx
    // app/layout.tsx
    import type { ReactNode } from "react";
    import { SerwistProvider } from "./serwist";

    export default function RootLayout({ children }: { children: ReactNode }) {
      return (
        <html lang="en" dir="ltr">
          <body>
            <SerwistProvider swUrl="/sw.js">{children}</SerwistProvider>
          </body>
        </html>
      );
    }
    ```

- The config mode works with Turbopack. You don't have to install `@serwist/turbopack` to use this.
