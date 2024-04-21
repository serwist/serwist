import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "disableDevLogs - The Serwist API - serwist",
  ogImage: encodeOpenGraphImage({
    title: "disableDevLogs",
    desc: "The Serwist API - serwist",
  }),
  code: {
    usage: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import { disableDevLogs } from "serwist";

disableDevLogs();`,
          lang: "typescript",
        },
      },
      { idPrefix: "usage-example" },
    ),
  },
});
