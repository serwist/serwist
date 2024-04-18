import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "@serwist/cli",
  ogImage: encodeOpenGraphImage("@serwist/cli"),
  toc: [
    {
      title: "@serwist/cli",
      id: "serwist-cli",
      children: [
        {
          title: "Introduction",
          id: "introduction",
        },
        {
          title: "Install",
          id: "install",
        },
        {
          title: "Commands",
          id: "commands",
          children: [
            {
              title: "wizard",
              id: "command-wizard",
            },
            {
              title: "inject-manifest",
              id: "command-inject",
            },
          ],
        },
        {
          title: "Configuration",
          id: "configuration",
        },
        {
          title: "Is @serwist/cli the right choice for my build process?",
          id: "is-cli-right",
        },
      ],
    },
  ],
  code: {
    install: highlightCode(
      locals.highlighter,
      {
        npm: {
          code: "npm i -D @serwist/cli",
          lang: "bash",
        },
        yarn: {
          code: "yarn add -D @serwist/cli",
          lang: "bash",
        },
        pnpm: {
          code: "pnpm add -D @serwist/cli",
          lang: "bash",
        },
        bun: {
          code: "bun add -D @serwist/cli",
          lang: "bash",
        },
      },
      { idPrefix: "install" },
    ),
    wizard: highlightCode(
      locals.highlighter,
      {
        npm: {
          code: "npx @serwist/cli wizard",
          lang: "bash",
        },
        yarn: {
          code: "yarn serwist wizard",
          lang: "bash",
        },
        pnpm: {
          code: "pnpm serwist wizard",
          lang: "bash",
        },
        bun: {
          code: "bun serwist wizard",
          lang: "bash",
        },
      },
      { idPrefix: "command-wizard" },
    ),
    injectManifest: highlightCode(
      locals.highlighter,
      {
        npm: {
          code: "npx @serwist/cli inject-manifest",
          lang: "bash",
        },
        yarn: {
          code: "yarn serwist inject-manifest",
          lang: "bash",
        },
        pnpm: {
          code: "pnpm serwist inject-manifest",
          lang: "bash",
        },
        bun: {
          code: "bun serwist inject-manifest",
          lang: "bash",
        },
      },
      { idPrefix: "command-inject" },
    ),
    messageFormat: highlightCode(
      locals.highlighter,
      {
        "event.data": {
          code: `import type { BroadcastMessage } from "serwist";

const data = {
  type: "CACHE_UPDATED",
  meta: "serwist-broadcast-update",
  // The two payload values vary depending on the actual update:
  payload: {
    cacheName: "the-cache-name",
    updatedURL: "https://example.com/",
  },
} satisfies BroadcastMessage;`,
          lang: "typescript",
        },
      },
      { idPrefix: "message-format" },
    ),
    basicUsage: {
      setup: highlightCode(
        locals.highlighter,
        {
          "sw.ts": {
            code: `import { BroadcastUpdatePlugin, StaleWhileRevalidate } from "serwist";
import { registerRoute } from "serwist/legacy";

registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new StaleWhileRevalidate({
    plugins: [new BroadcastUpdatePlugin()],
  }),
);`,
            lang: "typescript",
          },
        },
        {
          idPrefix: "basic-usage",
        },
      ),
      eventListener: highlightCode(
        locals.highlighter,
        {
          "message.ts": {
            code: `import { BROADCAST_UPDATE_MESSAGE_META } from "serwist";

navigator.serviceWorker.addEventListener("message", async (event) => {
  // Optional: ensure the message came from Serwist
  if (event.data.meta === BROADCAST_UPDATE_MESSAGE_META) {
    const { cacheName, updatedURL } = event.data.payload;

    // Do something with cacheName and updatedURL.
    // For example, get the cached content and update
    // the content on the page.
    const cache = await caches.open(cacheName);
    const updatedResponse = await cache.match(updatedURL);
    if (updatedResponse) {
      const updatedText = await updatedResponse.text();
      // Do something with the updated content...
    }
  }
});`,
            lang: "typescript",
          },
        },
        {
          idPrefix: "basic-usage-event-listener",
        },
      ),
      customizeHeaders: highlightCode(
        locals.highlighter,
        {
          "sw.ts": {
            code: `import { BroadcastUpdatePlugin, BROADCAST_UPDATE_DEFAULT_HEADERS, StaleWhileRevalidate } from "serwist";
import { registerRoute } from "serwist/legacy";

registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new StaleWhileRevalidate({
    plugins: [
      new BroadcastUpdatePlugin({
        headersToCheck: [...BROADCAST_UPDATE_DEFAULT_HEADERS, "X-My-Custom-Header"],
      }),
    ],
  }),
);`,
            lang: "typescript",
          },
        },
        { idPrefix: "basic-usage-customize-headers" },
      ),
    },
    advancedUsage: {
      notifyIfUpdated: highlightCode(
        locals.highlighter,
        {
          "sw.ts": {
            code: `import { BroadcastCacheUpdate, BROADCAST_UPDATE_DEFAULT_HEADERS } from "serwist";

declare const self: ServiceWorkerGlobalScope;

const broadcastUpdate = new BroadcastCacheUpdate({
  headersToCheck: [...BROADCAST_UPDATE_DEFAULT_HEADERS, "X-My-Custom-Header"],
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const cacheName = "api-cache";
      const request = new Request("https://example.com/api");
      
      const cache = await caches.open(cacheName);
      const oldResponse = await cache.match(request);

      // Is the cached response stale?
      const shouldRevalidate = true;

      if (!shouldRevalidate && oldResponse) {
        return oldResponse;
      }

      const newResponse = await fetch(request);

      broadcastUpdate.notifyIfUpdated({
        cacheName,
        oldResponse,
        newResponse,
        request,
        event,
      });

      return newResponse;
    })(),
  );
});`,
            lang: "typescript",
          },
        },
        {
          idPrefix: "advanced-usage",
        },
      ),
    },
  },
});
