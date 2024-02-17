import { getHighlighter } from "shiki";

import { highlightCode } from "$lib/highlightCode";
import type { TableOfContents } from "$lib/types";

export const load = async () => {
  const highligher = await getHighlighter({
    themes: ["github-dark", "github-light"],
    langs: ["typescript", "javascript"],
  });
  return {
    title: "BackgroundSyncPlugin - @serwist/background-sync",
    toc: [
      {
        title: "BackgroundSyncPlugin",
        id: "background-sync-plugin",
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
            title: "Usage",
            id: "usage",
          },
        ],
      },
    ] satisfies TableOfContents[],
    code: {
      usage: highlightCode(
        highligher,
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
        { idPrefix: "usage-example" },
      ),
    },
  };
};
