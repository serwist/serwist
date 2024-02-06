import { getHighlighter } from "shiki";

import { highlightCode } from "$lib/highlightCode";

export const load = async () => {
  const highligher = await getHighlighter({
    themes: ["github-dark", "github-light"],
    langs: ["typescript", "javascript"],
  });
  return {
    title: "handlePrecaching - @serwist/sw",
    code: {
      usage: highlightCode(
        highligher,
        {
            "sw.ts": {
              code: `import { clientsClaim } from "@serwist/core";
import type { PrecacheEntry } from "@serwist/precaching";
import { fallbacks, handlePrecaching, registerRuntimeCaching } from "@serwist/sw";
import { defaultCache } from "@serwist/vite/worker";

declare const self: ServiceWorkerGlobalScope & {
  // Change this attribute's name to your \`injectionPoint\`.
  // \`injectionPoint\` is an InjectManifest option.
  // See https://serwist.pages.dev/docs/build/inject-manifest/configuring
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
};

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
              code: `import { clientsClaim } from "@serwist/core";
import { fallbacks, handlePrecaching, registerRuntimeCaching } from "@serwist/sw";
import { defaultCache } from "@serwist/vite/worker";

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
  };
};
