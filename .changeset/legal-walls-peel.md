---
"@serwist/turbopack": minor
---

feat(turbo): added rudimentary Turbopack support

- `@serwist/turbopack` helps developers integrate Serwist into Next.js + Turbopack applications. To get started:

  - Install required packages:

  ```bash
  npm i -D @serwist/turbopack esbuild-wasm serwist
  ```

  - Add `esbuild-wasm` to `serverExternalPackages`:

  ```ts
  /** @type {import("next").NextConfig} */
  const nextConfig = {
    serverExternalPackages: ["esbuild-wasm"],
  };

  export default nextConfig;
  ```

  - Use `@serwist/turbopack`:

  ```ts
  // app/serwist/[path]/route.ts
  import { createSerwistRoute } from "@serwist/turbopack";

  export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({
    swSrc: "app/sw.ts",
    basePath: "/",
  });
  ```

  - Write a service worker!

  ```ts
  // app/sw.ts
  import { defaultCache } from "@serwist/turbopack/worker";
  import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
  import { addEventListeners, createSerwist, RuntimeCache } from "serwist";

  declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
      // Change this attribute's name to your `injectionPoint`.
      // `injectionPoint` is an InjectManifest option.
      // See https://serwist.pages.dev/docs/build/configuring
      __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    }
  }

  declare const self: ServiceWorkerGlobalScope;

  const serwist = createSerwist({
    precache: {
      entries: self.__SW_MANIFEST,
      concurrency: 10,
      cleanupOutdatedCaches: true,
    },
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    extensions: [
      new RuntimeCache(defaultCache, {
        warmEntries: ["/~offline"],
        fallbacks: {
          entries: [
            {
              url: "/~offline",
              matcher({ request }) {
                return request.destination === "document";
              },
            },
          ],
        },
      }),
    ],
  });

  addEventListeners(serwist);
  ```

  - Add a web application manifest:

  ```jsonc
  // app/manifest.json
  {
    "name": "My Awesome PWA app",
    "short_name": "PWA App",
    "icons": [
      {
        "src": "/icons/android-chrome-192x192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "maskable"
      },
      {
        "src": "/icons/icon-512x512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ],
    "theme_color": "#FFFFFF",
    "background_color": "#FFFFFF",
    "start_url": "/",
    "display": "standalone",
    "orientation": "portrait"
  }
  ```

  - Register your service worker!

  ```tsx
  // app/lib/client.ts
  "use client";
  export { SerwistProvider } from "@serwist/turbopack/react";
  // app/layout.tsx
  import type { Metadata, Viewport } from "next";
  import type { ReactNode } from "react";
  import { SerwistProvider } from "./lib/client";

  const APP_NAME = "NJS App";
  const APP_DESCRIPTION = "Next.js + Serwist PWA";

  export const metadata: Metadata = {
    applicationName: APP_NAME,
    title: {
      default: APP_NAME,
      template: "%s - NJS App",
    },
    description: APP_DESCRIPTION,
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: APP_NAME,
    },
    formatDetection: {
      telephone: false,
    },
    icons: {
      shortcut: "/favicon.ico",
      apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
    },
  };

  export const viewport: Viewport = {
    themeColor: "#FFFFFF",
  };

  export default function RootLayout({ children }: { children: ReactNode }) {
    return (
      <html lang="en" dir="ltr">
        <body>
          <SerwistProvider swUrl="/serwist/sw.js">{children}</SerwistProvider>
        </body>
      </html>
    );
  }
  ```

- Quirks:

  - sw.js is completely static in development mode, meaning that you have to restart the dev server to see your edits to the file.

  - Sourcemap is always enabled.

  - Relies on `esbuild-wasm`, which unfortunately has to be externally installed.

  - `SerwistProvider` has to be manually re-exported from `@serwist/turbopack/react` with the `"use client"` directive, as we can't use `"use client"` in Rollup (which is what we use to bundle our packages) yet.
