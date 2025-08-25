# @serwist/turbopack

## 10.0.0-preview.13
### Patch Changes



- [`86fd2ff`](https://github.com/serwist/serwist/commit/86fd2ff9f05dbfa69d9e65ab57da784336b5fe5a) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(turbo/preview): removed `esbuild-wasm` from `dependencies`
  
  - This caused problems with adding newer `esbuild-wasm` versions to `serverExternalPackages`.
- Updated dependencies []:
  - @serwist/build@10.0.0-preview.13
  - @serwist/window@10.0.0-preview.13
  - serwist@10.0.0-preview.13

## 10.0.0-preview.12
### Minor Changes



- [`e3dbb24`](https://github.com/serwist/serwist/commit/e3dbb24b6c70205058eb8f6eb777146c86e7ae43) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - feat(turbo/preview): allow configuring `esbuild` instance
  
  - You can now configure `@serwist/turbopack`'s `esbuild` instance. For example, to output the service worker in the `iife` format and disable sourcemaps:
  
  ```tsx
  // app/serwist/[path]/route.ts
  export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({
    swSrc: "app/sw.ts",
    basePath: "/",
    esbuildOptions: {
      sourcemaps: false,
      format: "iife",
      define: {
        "import.meta": "{}",
      },
    },
  });
  
  // app/layout.tsx
  export default function RootLayout({ children }: { children: ReactNode }) {
    return (
      <html lang="en" dir="ltr">
        <body>
          <SerwistProvider swUrl="/serwist/sw.js" options={{ type: "classic" }}>{children}</SerwistProvider>
        </body>
      </html>
    );
  }
  ```

### Patch Changes

- Updated dependencies []:
  - @serwist/build@10.0.0-preview.12
  - @serwist/window@10.0.0-preview.12
  - serwist@10.0.0-preview.12

## 10.0.0-preview.11
### Patch Changes

- Updated dependencies []:
  - @serwist/build@10.0.0-preview.11
  - @serwist/window@10.0.0-preview.11
  - serwist@10.0.0-preview.11

## 10.0.0-preview.10
### Minor Changes



- [`935c16f`](https://github.com/serwist/serwist/commit/935c16f28ac9344bdf9e7b34fbcbcef90f160cda) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - feat(turbo): added rudimentary Turbopack support
  
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
    // app/layout.tsx
    import type { Metadata, Viewport } from "next";
    import type { ReactNode } from "react";
    import { SerwistProvider } from "$lib/client";
  
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

### Patch Changes

- Updated dependencies []:
  - @serwist/build@10.0.0-preview.10
  - @serwist/window@10.0.0-preview.10
  - serwist@10.0.0-preview.10

## 10.0.0-preview.9
### Patch Changes

- Updated dependencies [[`3a59648`](https://github.com/serwist/serwist/commit/3a596489ba94b5ea01df9606d6e1bc8b9a3d5afe)]:
  - serwist@10.0.0-preview.9
  - @serwist/window@10.0.0-preview.9
  - @serwist/build@10.0.0-preview.9

## 9.1.0

### Patch Changes

- Updated dependencies [[`852df26`](https://github.com/serwist/serwist/commit/852df2609f700d28de6433e0cb6669ade13c5b95), [`852df26`](https://github.com/serwist/serwist/commit/852df2609f700d28de6433e0cb6669ade13c5b95)]:
  - @serwist/window@9.1.0
  - @serwist/build@9.1.0
  - serwist@9.1.0
