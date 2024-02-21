import { highlightCode } from "$lib/highlightCode";
import type { TocEntry } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "@serwist/background-sync",
  toc: [
    {
      title: "@serwist/background-sync",
      id: "serwist-background-sync",
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
              title: "Creating a Queue",
              id: "creating-a-queue",
            },
            {
              title: "Adding a request to the Queue",
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
  ] satisfies TocEntry[],
  code: {
    basicUsage: {
      setup: highlightCode(
        locals.highlighter,
        {
          "sw.ts": {
            code: `import { BackgroundSyncPlugin } from "@serwist/background-sync";
import { registerRoute } from "@serwist/routing";
import { NetworkOnly } from "@serwist/strategies";

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
import { BackgroundSyncPlugin } from "@serwist/background-sync";
import { registerRoute } from "@serwist/routing";
import { NetworkOnly } from "@serwist/strategies";

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
            code: `import { BackgroundSyncPlugin } from "@serwist/background-sync";
import { registerRoute } from "@serwist/routing";
import { NetworkOnly } from "@serwist/strategies";

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
            code: `import { Queue } from "@serwist/background-sync";
  
new Queue("myQueueName");`,
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
            code: `import { Queue } from "@serwist/background-sync";

declare const self: ServiceWorkerGlobalScope;
  
const queue = new Queue("myQueueName");

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
