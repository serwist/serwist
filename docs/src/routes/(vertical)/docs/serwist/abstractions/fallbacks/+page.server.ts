import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "fallbacks - Abstracting away the APIs - serwist",
  ogImage: encodeOpenGraphImage({
    title: "fallbacks",
    desc: "Abstracting away the APIs - serwist",
  }),
  code: {
    usage: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { clientsClaim } from "serwist";
import { fallbacks, handlePrecaching, registerRuntimeCaching } from "serwist/legacy";
import { defaultCache } from "@serwist/vite/worker";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    // Change this attribute's name to your \`injectionPoint\`.
    // \`injectionPoint\` is an InjectManifest option.
    // See https://serwist.pages.dev/docs/build/inject-manifest/configuring
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

self.skipWaiting();
clientsClaim();

handlePrecaching({ precacheEntries: self.__SW_MANIFEST });

const revision = crypto.randomUUID();

const runtimeCaching = fallbacks({
  entries: [
    {
      url: "/~offline",
      revision,
      matcher({ request }) {
        return request.destination === "document";
      },
    },
  ],
  precacheOptions: {
    // Ignore all URL parameters.
    ignoreURLParametersMatching: [/.*/],
  },
  runtimeCaching: defaultCache,
});

registerRuntimeCaching(...runtimeCaching);`,
          lang: "typescript",
        },
        "sw.js": {
          code: `// @filename: sw-decl.d.ts
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

// @filename: sw.js
// @types: ./sw-decl.d.ts
// @lib: esnext,webworker
const self = /** @type {ServiceWorkerGlobalScope} */(/** @type {unknown} */(globalThis.self));
// ---cut-before---
import { defaultCache } from "@serwist/vite/worker";
import { clientsClaim } from "serwist";
import { fallbacks, handlePrecaching, registerRuntimeCaching } from "serwist/legacy";

self.skipWaiting();
clientsClaim();

handlePrecaching({ precacheEntries: self.__SW_MANIFEST });

const revision = crypto.randomUUID();

const runtimeCaching = fallbacks({
  entries: [
    {
      url: "/~offline",
      revision,
      matcher({ request }) {
        return request.destination === "document";
      },
    },
  ],
  precacheOptions: {
    // Ignore all URL parameters.
    ignoreURLParametersMatching: [/.*/],
  },
  runtimeCaching: defaultCache,
});

registerRuntimeCaching(...runtimeCaching);`,
          lang: "javascript",
        },
      },
      { idPrefix: "usage-example" },
    ),
  },
});
