import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "Precaching",
  ogImage: encodeOpenGraphImage({
    title: "Precaching",
    desc: "serwist",
  }),
  toc: [
    {
      title: "Precaching",
      id: "precaching",
      children: [
        {
          title: "Introduction",
          id: "introduction",
        },
        {
          title: "How precaching works",
          id: "how-precaching-works",
          children: [
            {
              title: "Serving precached responses",
              id: "serving-precached-responses",
            },
          ],
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
            { title: "Using PrecacheController", id: "using-precache-controller" },
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
          code: `import { precacheAndRoute } from "serwist/legacy";

precacheAndRoute([
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
          code: `import { precacheAndRoute } from "serwist/legacy";

precacheAndRoute(
  [
    { url: "/index.html", revision: "383676" },
    { url: "/styles/app.0c9a31.css", revision: null },
    { url: "/scripts/app.0d5770.js", revision: null },
  ],
  {
    // Ignore all URL parameters.
    ignoreURLParametersMatching: [/.*/],
  },
);`,
          lang: "typescript",
        },
      },
      { idPrefix: "ignoring-url-parameters" },
    ),
    handlingDirectoryIndex: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import { precacheAndRoute } from "serwist/legacy";

precacheAndRoute(
  [
    { url: "/index.html", revision: "383676" },
    { url: "/styles/app.0c9a31.css", revision: null },
    { url: "/scripts/app.0d5770.js", revision: null },
  ],
  {
    directoryIndex: null,
  },
);`,
          lang: "typescript",
        },
      },
      { idPrefix: "handling-directory-index" },
    ),
    supportingCleanUrls: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import { precacheAndRoute } from "serwist/legacy";

precacheAndRoute([{ url: "/about.html", revision: "b79cd4" }], {
  cleanURLs: false,
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
          code: `import { precacheAndRoute } from "serwist/legacy";

precacheAndRoute(
  [
    { url: "/index.html", revision: "383676" },
    { url: "/styles/app.0c9a31.css", revision: null },
    { url: "/scripts/app.0d5770.js", revision: null },
  ],
  {
    urlManipulation: ({ url }) => {
      const alteredUrl = new URL(url);
      // Your logic goes here...
      return [alteredUrl];
    },
  },
);`,
          lang: "typescript",
        },
      },
      { idPrefix: "manipulating-urls" },
    ),
    advancedUsage: {
      precacheController: highlightCode(
        locals.highlighter,
        {
          "sw.ts": {
            code: `// @filename: $code.advancedUsage.precacheController.sw.ts
// ---cut-before---
import { PrecacheController } from "serwist/legacy";

declare const self: ServiceWorkerGlobalScope;

const precacheController = new PrecacheController();

precacheController.addToCacheList([
  { url: "/styles/example-1.abcd.css", revision: null },
  { url: "/styles/example-2.1234.css", revision: null },
  { url: "/scripts/example-1.abcd.js", revision: null },
  { url: "/scripts/example-2.1234.js", revision: null },
]);

precacheController.addToCacheList([
  {
    url: "/index.html",
    revision: "abcd",
  },
  {
    url: "/about.html",
    revision: "1234",
  },
]);

self.addEventListener("install", (event) => {
  event.waitUntil(precacheController.install(event));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(precacheController.activate(event));
});

self.addEventListener("fetch", (event) => {
  const cacheKey = precacheController.getCacheKeyForURL(event.request.url);
  if (cacheKey === undefined) {
    return;
  }
  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(cacheKey);
      if (cachedResponse !== undefined) {
        return cachedResponse;
      }
      return Response.error();
    })(),
  );
});`,
            lang: "typescript",
          },
        },
        { idPrefix: "using-precache-controller" },
      ),
      readingPrecachedAssets: {
        getCacheKeyForUrl: highlightCode(
          locals.highlighter,
          {
            "sw.ts": {
              code: `import { cacheNames } from "serwist";
import { getCacheKeyForURL } from "serwist/legacy";

const cache = await caches.open(cacheNames.precache);
const cacheKey = getCacheKeyForURL("/precached-file.html");
if (cacheKey) {
  const response = await cache.match(cacheKey);
}`,
              lang: "typescript",
            },
          },
          { idPrefix: "reading-precached-assets-gckfu" },
        ),
        matchPrecache: highlightCode(
          locals.highlighter,
          {
            "sw.ts": {
              code: `import { matchPrecache } from "serwist/legacy";

const response = await matchPrecache("/precached-file.html");`,
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
