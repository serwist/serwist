import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "Getting started - @serwist/nuxt",
  ogImage: encodeOpenGraphImage({
    title: "Getting started",
    desc: "@serwist/nuxt",
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
              title: "Step 1: Add Serwist's Nuxt module and add metadata to <head />",
              id: "adding-module",
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
              title: "Step 6: Register the service worker",
              id: "updating-layout",
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
          code: "npm i -D @serwist/nuxt @serwist/vite serwist",
          lang: "bash",
        },
        yarn: {
          code: "yarn add -D @serwist/nuxt @serwist/vite serwist",
          lang: "bash",
        },
        pnpm: {
          code: "pnpm add -D @serwist/nuxt @serwist/vite serwist",
          lang: "bash",
        },
        bun: {
          code: "bun add -D @serwist/nuxt @serwist/vite serwist",
          lang: "bash",
        },
      },
      { idPrefix: "installing-serwist-nuxt" },
    ),
    basicUsage: {
      wrapConfig: highlightCode(
        locals.highlighter,
        {
          "nuxt.config.ts": {
            code: `// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
        dir: "ltr",
      },
      title: "Home",
      titleTemplate: "%s - PWA App",
      link: [
        {
          rel: "manifest",
          href: "/manifest.json",
        },
        {
          rel: "shortcut icon",
          href: "/favicon.ico",
        },
        {
          rel: "apple-touch-icon",
          href: "/apple-touch-icon.png",
          sizes: "180x180",
        },
      ],
      meta: [
        {
          name: "application-name",
          content: "PWA App",
        },
        {
          name: "description",
          content: "Best PWA app in the world!",
        },
        {
          name: "apple-mobile-web-app-capable",
          content: "yes",
        },
        {
          name: "apple-mobile-web-app-status-bar-style",
          content: "default",
        },
        {
          name: "apple-mobile-web-app-title",
          content: "My Awesome PWA App",
        },
        {
          name: "format-detection",
          content: "telephone=no",
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "og:title",
          content: "My Awesome PWA App",
        },
        {
          property: "og:description",
          content: "Best PWA app in the world!",
        },
        {
          property: "og:site:name",
          content: "PWA App",
        },
        {
          name: "twitter:card",
          content: "website",
        },
        {
          name: "twitter:title",
          content: "My Awesome PWA App",
        },
        {
          name: "twitter:description",
          content: "Best PWA app in the world!",
        },
        {
          name: "theme-color",
          content: "#FFFFFF",
        },
      ],
    },
  },
  devtools: { enabled: true },
  modules: ["@serwist/nuxt"],
  serwist: {},
});`,
            lang: "typescript",
          },
        },
        { idPrefix: "updating-nuxt-config", useTwoslash: false },
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
      metaAndLinkTags: highlightCode(
        locals.highlighter,
        {
          "app.vue": {
            code: `<script setup lang="ts">
// @ts-check
const { $serwist } = useNuxtApp();
$serwist?.addEventListener("installed", () => {
  console.log("Serwist installed!");
});
void $serwist?.register({ immediate: true });
</script>
<template>
  <div>
    <h1>Nuxt + Serwist</h1>
  </div>
</template>`,
            lang: "vue",
          },
        },
        { idPrefix: "updating-layout", useTwoslash: false },
      ),
    },
  },
});
