import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "Getting started - @serwist/vite",
  ogImage: encodeOpenGraphImage({
    title: "Getting started",
    desc: "@serwist/vite",
  }),
  toc: [
    {
      title: "Getting started",
      id: "getting-started",
      children: [
        { title: "Install", id: "install" },
        {
          title: "Implementation",
          id: "implementation",
          children: [
            {
              title: "Step 1: Add Serwist's Vite plugin",
              id: "adding-plugin",
            },
            {
              title: "Step 2: Update tsconfig.json",
              id: "updating-tsconfig",
            },
            {
              title: "Step 3: Create a service worker",
              id: "writing-a-sw",
            },
            {
              title: "Step 4: Add a web application manifest",
              id: "writing-a-webmanifest",
            },
            {
              title: "Step 5: Update your client entrypoint",
              id: "updating-entrypoint",
            },
            {
              title: "Step 6: Add metadata to <head />",
              id: "updating-html",
            },
          ],
        },
      ],
    },
  ],
  code: {
    install: highlightCode(
      locals.highlighter,
      {
        npm: {
          code: "npm i -D @serwist/vite @serwist/window serwist",
          lang: "bash",
        },
        yarn: {
          code: "yarn add -D @serwist/vite @serwist/window serwist",
          lang: "bash",
        },
        pnpm: {
          code: "pnpm add -D @serwist/vite @serwist/window serwist",
          lang: "bash",
        },
        bun: {
          code: "bun add -D @serwist/vite @serwist/window serwist",
          lang: "bash",
        },
      },
      { idPrefix: "installing-serwist-vite" },
    ),
    basicUsage: {
      wrapConfig: highlightCode(
        locals.highlighter,
        {
          "vite.config.ts": {
            code: `import { serwist } from "@serwist/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    serwist({
      swSrc: "src/sw.ts",
      swDest: "sw.js",
      globDirectory: "dist",
      injectionPoint: "self.__SW_MANIFEST",
      rollupFormat: "iife",
    }),
  ],
});`,
            lang: "javascript",
          },
        },
        { idPrefix: "adding-plugin" },
      ),
      tsConfig: highlightCode(
        locals.highlighter,
        {
          "tsconfig.json": {
            code: `{
  // Other stuff...
  "compilerOptions": {
    // Other options...
    "types": [
      // Other types...
      // This allows Serwist to properly type "virtual:serwist".
      "@serwist/vite/typings"
    ],
    "lib": [
      // Other libs...
      // Add this! Doing so adds WebWorker and ServiceWorker types to the global.
      "webworker"
    ],
  },
}`,
            lang: "json",
          },
        },
        { idPrefix: "updating-tsconfig" },
      ),
      createEntry: highlightCode(
        locals.highlighter,
        {
          "sw.ts": {
            code: `import { defaultCache } from "@serwist/vite/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

// This declares the value of \`injectionPoint\` to TypeScript.
// \`injectionPoint\` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// \`"self.__SW_MANIFEST"\`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();`,
            lang: "typescript",
          },
        },
        { idPrefix: "writing-a-sw" },
      ),
      manifestJson: highlightCode(
        locals.highlighter,
        {
          "manifest.json": {
            code: `{
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
}`,
            lang: "json",
          },
        },
        { idPrefix: "writing-a-webmanifest" },
      ),
      registerSw: highlightCode(
        locals.highlighter,
        {
          "src/App.tsx": {
            code: `// @types: @serwist/vite/typings
// ---cut-before---
import { getSerwist } from "virtual:serwist";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    const loadSerwist = async () => {
      if ("serviceWorker" in navigator) {
        const serwist = await getSerwist();

        serwist?.addEventListener("installed", () => {
          console.log("Serwist installed!");
        });

        void serwist?.register();
      }
    };

    loadSerwist();
  }, []);

  return <></>;
}`,
            lang: "tsx",
          },
        },
        { idPrefix: "updating-entrypoint" },
      ),
      metaAndLinkTags: highlightCode(
        locals.highlighter,
        {
          "index.html": {
            code: `<head>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>My awesome PWA app</title>
  <meta name="description" content="Best PWA app in the world!">
  <link rel="shortcut icon" href="/favicon.ico">
  <link rel="mask-icon" href="/icons/mask-icon.svg" color="#FFFFFF">
  <meta name="theme-color" content="#ffffff">
  <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png">
  <link rel="apple-touch-icon" sizes="152x152" href="/icons/touch-icon-ipad.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/icons/touch-icon-iphone-retina.png">
  <link rel="apple-touch-icon" sizes="167x167" href="/icons/touch-icon-ipad-retina.png">
  <link rel="manifest" href="/manifest.json">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:url" content="https://yourdomain.com">
  <meta name="twitter:title" content="My Awesome PWA app">
  <meta name="twitter:description" content="Best PWA app in the world!">
  <meta name="twitter:image" content="/icons/twitter.png">
  <meta property="og:type" content="website">
  <meta property="og:title" content="My Awesome PWA app">
  <meta property="og:description" content="Best PWA app in the world!">
  <meta property="og:site_name" content="My awesome PWA app">
  <meta property="og:url" content="https://yourdomain.com">
  <meta property="og:image" content="/icons/og.png">
  <link rel="apple-touch-startup-image" href="/images/apple_splash_2048.png" sizes="2048x2732">
  <link rel="apple-touch-startup-image" href="/images/apple_splash_1668.png" sizes="1668x2224">
  <link rel="apple-touch-startup-image" href="/images/apple_splash_1536.png" sizes="1536x2048">
  <link rel="apple-touch-startup-image" href="/images/apple_splash_1125.png" sizes="1125x2436">
  <link rel="apple-touch-startup-image" href="/images/apple_splash_1242.png" sizes="1242x2208">
  <link rel="apple-touch-startup-image" href="/images/apple_splash_750.png" sizes="750x1334">
  <link rel="apple-touch-startup-image" href="/images/apple_splash_640.png" sizes="640x1136">
</head>`,
            lang: "html",
          },
        },
        { idPrefix: "updating-html" },
      ),
    },
  },
});
