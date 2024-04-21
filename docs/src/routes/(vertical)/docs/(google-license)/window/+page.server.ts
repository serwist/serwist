import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "@serwist/window",
  ogImage: encodeOpenGraphImage("@serwist/window"),
  toc: [
    {
      title: "@serwist/window",
      id: "serwist-window",
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
          title: "Examples",
          id: "examples",
          children: [
            {
              title: "Notify the user if a service worker has installed but is stuck waiting to activate",
              id: "examples-waiting",
            },
            {
              title: "Notify the user of cache updates",
              id: "examples-broadcast-update",
            },
          ],
        },
        {
          title: "Important service worker lifecycle moments",
          id: "sw-lifecycle",
          children: [
            {
              title: "The installed event",
              id: "sw-installed-event",
            },
            {
              title: "The waiting event",
              id: "sw-waiting-event",
            },
            {
              title: "The controlling event",
              id: "sw-controlling-event",
            },
            {
              title: "The activated event",
              id: "sw-activated-event",
            },
          ],
        },
        {
          title: "When an unexpected version of the service worker is found",
          id: "unexpected-sw-version",
        },
        {
          title: "Communication between the service worker and the window",
          id: "communication",
          children: [
            {
              title: "Managing version incompatibilities",
              id: "sw-version-incompat",
              children: [
                {
                  title: "If you serve your pages network-first",
                  id: "sw-version-incompat-network-first",
                },
                {
                  title: "If you serve your pages cache-first",
                  id: "sw-version-incompat-cache-first",
                },
              ],
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
          code: "npm i -D @serwist/window",
          lang: "bash",
        },
        yarn: {
          code: "yarn add -D @serwist/window",
          lang: "bash",
        },
        pnpm: {
          code: "pnpm add -D @serwist/window",
          lang: "bash",
        },
        bun: {
          code: "bun add -D @serwist/window",
          lang: "bash",
        },
      },
      { idPrefix: "install" },
    ),
    import: highlightCode(
      locals.highlighter,
      {
        "index.ts": {
          code: `import { Serwist } from "@serwist/window";

if ("serviceWorker" in navigator) {
  const serwist = new Serwist("/sw.js", { scope: "/", type: "classic" });

  void serwist.register();
}`,
          lang: "typescript",
        },
      },
      { idPrefix: "install-import" },
    ),
    examples: {
      waiting: highlightCode(
        locals.highlighter,
        {
          "index.ts": {
            code: `import type { Serwist } from "@serwist/window";
declare const serwist: Serwist;
// ---cut-before---
serwist.addEventListener("waiting", () => {
  console.log("A new service worker has installed, but it can't activate until all tabs running the current version have fully unloaded.");
});`,
            lang: "typescript",
          },
        },
        { idPrefix: "examples-waiting" },
      ),
      broadcastUpdate: highlightCode(
        locals.highlighter,
        {
          "index.ts": {
            code: `import type { Serwist } from "@serwist/window";
declare const serwist: Serwist;
// ---cut-before---
import type { BroadcastMessage } from "serwist";

serwist.addEventListener("message", (event) => {
  if (event.data.meta === "serwist-broadcast-update" && event.data.type === "CACHE_UPDATED") {
    const { payload: { updatedURL } }: BroadcastMessage = event.data;
    
    console.log(\`A newer version of \${updatedURL} is available!\`);
  }
});`,
            lang: "typescript",
          },
        },
        { idPrefix: "examples-broadcast-update" },
      ),
      routingCache: highlightCode(
        locals.highlighter,
        {
          "index.ts": {
            code: `import type { Serwist } from "@serwist/window";
declare const serwist: Serwist;
// ---cut-before---
const urlsToCache = [
  location.href,
  ...performance.getEntriesByType("resource").map(r => r.name),
];
serwist.messageSW({
  type: "CACHE_URLS",
  payload: { urlsToCache },
});`,
            lang: "typescript",
          },
        },
        { idPrefix: "examples-routing-cache" },
      ),
      skipWaitingManual: {
        serviceWorker: highlightCode(
          locals.highlighter,
          {
            "sw.ts": {
              code: `declare const self: ServiceWorkerGlobalScope;
// ---cut-before---
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});`,
              lang: "typescript",
            },
          },
          { idPrefix: "examples-skip-waiting-manual-sw" },
        ),
        client: highlightCode(
          locals.highlighter,
          {
            "index.ts": {
              code: `import type { Serwist } from "@serwist/window";
declare const serwist: Serwist;
declare const confirmUpdate: () => boolean;
// ---cut-before---
serwist.addEventListener("waiting", () => {
  serwist.addEventListener("controlling", location.reload);
  // This code assumes your app has a \`confirmUpdate()\` method
  // that returns \`true\` if the user wants to update.
  if (confirmUpdate()) {
    serwist.messageSkipWaiting();
  }
});`,
              lang: "typescript",
            },
          },
          { idPrefix: "examples-skip-waiting-manual-client" },
        ),
      },
      message: {
        serviceWorker: highlightCode(
          locals.highlighter,
          {
            "sw.ts": {
              code: `declare const self: ServiceWorkerGlobalScope;
// ---cut-before---
const SW_VERSION = "1.0.0";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0]?.postMessage(SW_VERSION);
  }
});`,
              lang: "typescript",
            },
          },
          { idPrefix: "examples-skip-waiting-manual-sw" },
        ),
        client: highlightCode(
          locals.highlighter,
          {
            "index.ts": {
              code: `import type { Serwist } from "@serwist/window";
declare const serwist: Serwist;
// ---cut-before---
const swVersion = await serwist.messageSW({ type: "GET_VERSION" });

console.log("Service worker version:", swVersion);`,
              lang: "typescript",
            },
          },
          { idPrefix: "examples-skip-waiting-manual-client" },
        ),
      },
    },
  },
});
