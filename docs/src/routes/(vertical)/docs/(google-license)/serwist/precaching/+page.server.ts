import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "Precaching assets",
  ogImage: encodeOpenGraphImage({
    title: "Precaching assets",
    desc: "serwist",
  }),
  toc: [
    {
      title: "Precaching assets",
      id: "precaching",
      children: [
        {
          title: "Introduction",
          id: "introduction",
        },
        {
          title: "How precaching works",
          id: "how-precaching-works",
        },
        {
          title: "Explanation of the precache list",
          id: "explanation-of-the-precache-list",
        },
        {
          title: "Incoming requests for precached files",
          id: "incoming-requests-for-precached-files",
          children: [
            { title: "Ignoring URL parameters", id: "ignoring-url-parameters" },
            { title: "Handling directory index", id: "handling-directory-index" },
            { title: "Supporting clean URLs", id: "supporting-clean-urls" },
            { title: "Manipulating URLs", id: "manipulating-urls" },
          ],
        },
        {
          title: "Advanced usage",
          id: "advanced-usage",
          children: [
            { title: "Reading precached assets", id: "reading-precached-assets" },
            { title: "Cleaning up old precaches", id: "cleaning-up-old-precaches" },
            { title: "Using subresource integrity", id: "using-subresource-integrity" },
          ],
        },
      ],
    },
  ],
  code: {
    explainPrecacheList: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;
// ---cut-before---
const serwist = new Serwist();

serwist.addToPrecacheList([
  { url: "/index.html", revision: "383676" },
  { url: "/styles/app.0c9a31.css", revision: null },
  { url: "/scripts/app.0d5770.js", revision: null },
  // Other entries...
]);`,
          lang: "typescript",
        },
      },
      { idPrefix: "explanation-of-the-precache-list" },
    ),
    ignoringUrlsParameter: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;
// ---cut-before---
const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    // Ignore all URL parameters.
    ignoreURLParametersMatching: [/.*/],
  },
});`,
          lang: "typescript",
        },
      },
      { idPrefix: "ignoring-url-parameters" },
    ),
    handlingDirectoryIndex: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;
// ---cut-before---
const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    directoryIndex: null,
  },
});`,
          lang: "typescript",
        },
      },
      { idPrefix: "handling-directory-index" },
    ),
    supportingCleanUrls: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;
// ---cut-before---
const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    cleanURLs: false,
  },
});`,
          lang: "typescript",
        },
      },
      { idPrefix: "supporting-clean-urls" },
    ),
    manipulatingUrls: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;
// ---cut-before---
const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    urlManipulation: ({ url }) => {
      const alteredUrl = new URL(url);
      // Your logic goes here...
      return [alteredUrl];
    },
  },
});`,
          lang: "typescript",
        },
      },
      { idPrefix: "manipulating-urls" },
    ),
    advancedUsage: {
      readingPrecachedAssets: {
        getCacheKeyForUrl: highlightCode(
          locals.highlighter,
          {
            "sw.ts": {
              code: `import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;
// ---cut-before---
const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
});

const cache = await caches.open(serwist.precacheStrategy.cacheName);

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin === location.origin && url.pathname === "/test-precache") {
    const cacheKey = serwist.getPrecacheKeyForUrl("/precached-file.html");
    if (cacheKey) {
      event.respondWith((async () => (await cache.match(cacheKey)) ?? Response.error())());
    }
  }
});

serwist.addEventListeners();`,
              lang: "typescript",
            },
          },
          { idPrefix: "reading-precached-assets-gckfu" },
        ),
        matchPrecache: highlightCode(
          locals.highlighter,
          {
            "sw.ts": {
              code: `import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;
// ---cut-before---
const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin === location.origin && url.pathname === "/test-precache") {
    event.respondWith((async () => (await serwist.matchPrecache("/precached-file.html")) ?? Response.error())());
  }
});

serwist.addEventListeners();`,
              lang: "typescript",
            },
          },
          { idPrefix: "reading-precached-assets-match-precache" },
        ),
      },
      usingSsri: highlightCode(
        locals.highlighter,
        {
          "sw.ts": {
            code: `import type { ManifestTransform } from "@serwist/build";
import { injectManifest } from "@serwist/build";
import ssri from "ssri";

const integrityManifestTransform: ManifestTransform = (originalManifest, compilation) => {
  const warnings: string[] = [];
  const manifest = originalManifest.map((entry) => {
    // If some criteria match:
    if (entry.url.startsWith("...")) {
      const asset = (compilation as any).getAsset(entry.url);
      entry.integrity = ssri.fromData(asset.source.source()).toString();

      // Push a message to warnings if needed.
    }
    return entry;
  });
  return { warnings, manifest };
};

const { count, size, warnings } = await injectManifest({
  swSrc: "app/sw.ts",
  swDest: "dist/sw.js",
  globDirectory: "dist/static",
  manifestTransforms: [integrityManifestTransform],
});
if (warnings.length > 0) {
  console.warn("[@serwist/build] Oopsie, there are warnings from Serwist:", warnings);
}
console.log(\`[@serwist/build] Manifest injected: \${count} files, totaling \${size} bytes.\`);`,
            lang: "typescript",
          },
        },
        {
          idPrefix: "using-subresource-integrity",
        },
      ),
    },
  },
});
