import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "StorableRequest - The Serwist API - serwist",
  ogImage: encodeOpenGraphImage({
    title: "StorableRequest",
    desc: "The Serwist API - serwist",
  }),
  toc: [
    {
      title: "StorableRequest",
      id: "storable-request",
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
  ],
  code: {
    usage: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `declare const request: Request;
// ---cut-before---
import { StorableRequest } from "serwist";

const storableRequest = await StorableRequest.fromRequest(request);

// This object can be saved in IndexedDB.
const objectRequest = storableRequest.toObject();

const parsedRequest = new StorableRequest(objectRequest).toRequest();`,
          lang: "typescript",
        },
      },
      { idPrefix: "usage-example" },
    ),
  },
});
