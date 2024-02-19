import { getHighlighter } from "shiki";

import { highlightCode } from "$lib/highlightCode";
import type { TocEntry } from "$lib/types";

export const load = async () => {
  const highligher = await getHighlighter({
    themes: ["github-dark", "github-light"],
    langs: ["typescript", "javascript"],
  });
  return {
    title: "Queue - @serwist/background-sync",
    toc: [
      {
        title: "Queue",
        id: "queue",
        children: [
          {
            title: "First added",
            id: "first-added",
          },
          {
            title: "About",
            id: "about",
          },
          {
            title: "Parameters",
            id: "parameters",
          },
          {
            title: "Methods and fields",
            id: "methods-and-fields",
          },
          {
            title: "Usage",
            id: "usage",
          },
        ],
      },
    ] satisfies TocEntry[],
    code: {
      usage: highlightCode(
        highligher,
        {
          "sw.ts": {
            code: `import { Queue } from "@serwist/background-sync";
  
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
      return error;
    }
  };

  event.respondWith(backgroundSync());
});`,
            lang: "javascript",
          },
        },
        { idPrefix: "usage-example" },
      ),
    },
  };
};
