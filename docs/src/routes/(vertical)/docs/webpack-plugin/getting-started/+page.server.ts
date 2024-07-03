import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "Getting started - @serwist/webpack-plugin",
  ogImage: encodeOpenGraphImage({
    title: "Getting started",
    desc: "@serwist/webpack-plugin",
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
              title: "Step 1: Add Serwist's webpack plugin",
              id: "adding-plugin",
            },
            {
              title: "Step 2: Update tsconfig.json",
              id: "updating-tsconfig",
            },
            {
              title: "Step 3: Update .gitignore",
              id: "updating-gitignore",
            },
            {
              title: "Step 4: Create a service worker",
              id: "writing-a-sw",
            },
            {
              title: "Step 5: Add a web application manifest",
              id: "writing-a-webmanifest",
            },
            {
              title: "Step 6: Update your client entrypoint",
              id: "updating-entrypoint",
            },
            {
              title: "Step 7: Add metadata to <head />",
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
          code: "npm i -D @serwist/webpack-plugin @serwist/window serwist",
          lang: "bash",
        },
        yarn: {
          code: "yarn add -D @serwist/webpack-plugin @serwist/window serwist",
          lang: "bash",
        },
        pnpm: {
          code: "pnpm add -D @serwist/webpack-plugin @serwist/window serwist",
          lang: "bash",
        },
        bun: {
          code: "bun add -D @serwist/webpack-plugin serwist",
          lang: "bash",
        },
      },
      { idPrefix: "installing-serwist-webpack-plugin" },
    ),
    basicUsage: {
      wrapConfig: highlightCode(
        locals.highlighter,
        {
          "webpack.config.ts": {
            code: `import fs from "node:fs";
import path from "node:path";

import { InjectManifest } from "@serwist/webpack-plugin";
import type { Configuration } from "webpack";

const dev = process.env.NODE_ENV === "development";
const rootDir = fs.realpathSync(process.cwd());
const srcDir = path.join(rootDir, "src");
const destDir = path.join(rootDir, "dist");

const clientEntry = path.resolve(srcDir, "client.ts");

export default {
  target: "web",
  name: "client",
  module: {
    rules: [
      // Insert rules...
    ],
  },
  entry: clientEntry,
  output: {
    publicPath: "/",
    path: path.resolve(destDir, "public"),
    filename: "static/js/[name]-[contenthash:8].js",
    chunkFilename: "static/js/[name]-[contenthash:8].chunk.js",
    assetModuleFilename: "static/media/[name].[hash][ext]",
  },
  plugins: [
    // swDest is automatically resolved to "$\{output.path}/sw.js"
    new InjectManifest({
      swSrc: path.resolve(srcDir, "sw.ts"),
      disablePrecacheManifest: dev,
      // Insert something...
      additionalPrecacheEntries: !dev ? [] : undefined,
    }),
  ],
} satisfies Configuration;`,
            lang: "typescript",
          },
        },
        { idPrefix: "adding-plugin", useTwoslash: false },
      ),
      tsConfig: highlightCode(
        locals.highlighter,
        {
          "tsconfig.json": {
            code: `{
  // Other stuff...
  "compilerOptions": {
    // Other options...
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
      gitignore: highlightCode(
        locals.highlighter,
        {
          ".gitignore": {
            code: `# Serwist
public/sw*
public/swe-worker*`,
            lang: "sh",
          },
        },
        { idPrefix: "updating-tsconfig" },
      ),
      createEntry: highlightCode(
        locals.highlighter,
        {
          "sw.ts": {
            code: `import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
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
  // We leave this up to you :)
  runtimeCaching: [],
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
            code: `import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    const loadSerwist = async () => {
      if ("serviceWorker" in navigator) {
        const serwist = new (await import("@serwist/window")).Serwist("/sw.js", { scope: "/", type: "classic" });

        serwist.addEventListener("installed", () => {
          console.log("Serwist installed!");
        });

        void serwist.register();
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
  <meta name="twitter:title" content="My awesome PWA app">
  <meta name="twitter:description" content="Best PWA app in the world!">
  <meta name="twitter:image" content="/icons/twitter.png">
  <meta property="og:type" content="website">
  <meta property="og:title" content="My awesome PWA app">
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
