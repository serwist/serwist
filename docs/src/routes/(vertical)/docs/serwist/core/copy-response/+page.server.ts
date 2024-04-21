import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "copyResponse - The Serwist API - serwist",
  ogImage: encodeOpenGraphImage({
    title: "copyResponse",
    desc: "The Serwist API - serwist",
  }),
  toc: [
    {
      title: "copyResponse",
      id: "copy-response",
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
          code: `declare const response: Response;
// ---cut-before---
import { copyResponse } from "serwist";

const newResponse = copyResponse(response, (init) => {
  if (init.status === 0) {
    const headers = new Headers(init.headers);
    headers.set("X-Is-Opaque", "true");
    init.headers = headers;
  }
  return init;
});`,
          lang: "typescript",
        },
      },
      { idPrefix: "usage-example" },
    ),
  },
});
