import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "Background synchronizing",
  ogImage: encodeOpenGraphImage({
    title: "Background synchronizing",
    desc: "@serwist/sw/plugins",
  }),
  toc: [
    {
      title: "Background synchronizing",
      id: "background-syncing",
      children: [
        {
          title: "Introduction",
          id: "introduction",
        },
        {
          title: "Basic usage",
          id: "basic-usage",
        },
        {
          title: "Advanced usage",
          id: "advanced-usage",
          children: [
            {
              title: "Creating a BackgroundSyncQueue",
              id: "creating-a-queue",
            },
            {
              title: "Adding a request to the BackgroundSyncQueue",
              id: "adding-a-request-to-the-queue",
            },
          ],
        },
        {
          title: "Testing",
          id: "testing",
        },
      ],
    },
  ],
  code: {
    basicUsage: {
      setup: highlightCode(
        locals.highlighter,
        {
          "sw.ts": {
            code: `import { BackgroundSyncPlugin } from "@serwist/sw/plugins";
import { registerRoute } from "@serwist/sw/routing";
import { NetworkOnly } from "@serwist/sw/strategies";

const backgroundSync = new BackgroundSyncPlugin("myQueueName", {
  maxRetentionTime: 24 * 60, // Retry for a maximum of 24 Hours (specified in minutes)
});

registerRoute(
  /\\/api\\/.*\\/*.json/,
  new NetworkOnly({
    plugins: [backgroundSync],
  }),
  "POST",
);`,
            lang: "typescript",
          },
        },
        {
          idPrefix: "basic-usage",
        },
      ),
      errorResponse: highlightCode(
        locals.highlighter,
        {
          "sw.ts": {
            code: `import type { SerwistPlugin } from "@serwist/core";
import { BackgroundSyncPlugin } from "@serwist/sw/plugins";
import { registerRoute } from "@serwist/sw/routing";
import { NetworkOnly } from "@serwist/sw/strategies";

const statusPlugin = {
  fetchDidSucceed({ response }) {
    if (response.status >= 500) {
      // Throwing anything here will trigger fetchDidFail.
      throw new Error("Server error.");
    }
    // If it's not 5xx, use the response as-is.
    return response;
  },
} satisfies SerwistPlugin;

const backgroundSync = new BackgroundSyncPlugin("myQueueName", {
  maxRetentionTime: 24 * 60, // Retry for a maximum of 24 Hours (specified in minutes)
});

registerRoute(
  /\\/api\\/.*\\/*.json/,
  new NetworkOnly({
    plugins: [statusPlugin, backgroundSync],
  }),
  "POST",
);`,
            lang: "typescript",
          },
          "sw.js": {
            code: `import { BackgroundSyncPlugin } from "@serwist/sw/plugins";
import { registerRoute } from "@serwist/sw/routing";
import { NetworkOnly } from "@serwist/sw/strategies";

/** @type {import("@serwist/core").SerwistPlugin} */
const statusPlugin = {
  fetchDidSucceed({ response }) {
    if (response.status >= 500) {
      // Throwing anything here will trigger fetchDidFail.
      throw new Error("Server error.");
    }
    // If it's not 5xx, use the response as-is.
    return response;
  },
};

const backgroundSync = new BackgroundSyncPlugin("myQueueName", {
  maxRetentionTime: 24 * 60, // Retry for a maximum of 24 Hours (specified in minutes)
});

registerRoute(
  /\\/api\\/.*\\/*.json/,
  new NetworkOnly({
    plugins: [statusPlugin, backgroundSync],
  }),
  "POST",
);`,
            lang: "javascript",
          },
        },
        {
          idPrefix: "basic-usage-error-response",
        },
      ),
    },
    advancedUsage: {
      setup: highlightCode(
        locals.highlighter,
        {
          "sw.ts": {
            code: `import { BackgroundSyncQueue } from "@serwist/sw/plugins";
  
const queue = new BackgroundSyncQueue("myQueueName");`,
            lang: "typescript",
          },
        },
        {
          idPrefix: "advanced-usage",
        },
      ),
      addingRequest: highlightCode(
        locals.highlighter,
        {
          "sw.ts": {
            code: `import { BackgroundSyncQueue } from "@serwist/sw/plugins";

declare const self: ServiceWorkerGlobalScope;
  
const queue = new BackgroundSyncQueue("myQueueName");

self.addEventListener("fetch", (event) => {
  // Add in your own criteria here to return early if this
  // isn't a request that should use background sync.
  if (event.request.method !== "POST") {
    return;
  }

  const backgroundSync = async () => {
    try {
      const response = await fetch(event.request.clone());
      return response;
    } catch (error) {
      await queue.pushRequest({ request: event.request });
      return Response.error();
    }
  };

  event.respondWith(backgroundSync());
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
