import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "BackgroundSyncPlugin - Background synchronizing - serwist/plugins",
  ogImage: encodeOpenGraphImage({
    title: "BackgroundSyncPlugin",
    desc: "Background synchronizing - serwist/plugins",
  }),
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
  ],
  code: {
    usage: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import { BackgroundSyncPlugin } from "serwist/plugins";
import { registerRoute } from "serwist/legacy";
import { NetworkOnly } from "serwist/strategies";

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
});
