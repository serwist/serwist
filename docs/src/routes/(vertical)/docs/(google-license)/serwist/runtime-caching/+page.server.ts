import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "Runtime caching - serwist",
  ogImage: encodeOpenGraphImage({
    title: "Runtime caching",
    desc: "serwist",
  }),
  toc: [
    {
      title: "Runtime caching",
      id: "runtime-caching",
      children: [
        {
          title: "Introduction",
          id: "introduction",
        },
        {
          title: "Caching strategies",
          id: "caching-strategies",
        },
        {
          title: "Applying caching strategies with route matching",
          id: "route-matching",
        },
        {
          title: "Using multiple caches",
          id: "using-multiple-caches",
        },
        {
          title: "Cross-origin considerations",
          id: "cors",
          children: [
            {
              title: "Opaque responses",
              id: "opaque-responses",
            },
            {
              title: "Remember to opt into CORS mode",
              id: "reminder-cors",
            },
            {
              title: "Serwist may not cache opaque responses",
              id: "serwist-cautious-opaque",
            },
            {
              title: "Opaque responses' size padding",
              id: "opaque-size-padding",
            },
          ],
        },
      ],
    },
  ],
  code: {
    imageExample: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import { CacheFirst, Serwist } from "serwist";

const serwist = new Serwist();

serwist.registerCapture(({ request, sameOrigin }) => {
  return sameOrigin && request.destination === "image";
}, new CacheFirst());

serwist.addEventListeners();`,
          lang: "typescript",
        },
      },
      { idPrefix: "example-image" },
    ),
    multipleCaches: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import { CacheFirst, StaleWhileRevalidate, Serwist } from "serwist";

const serwist = new Serwist({
  runtimeCaching: [
    // Handle images
    {
      matcher({ request }) {
        return request.destination === "image";
      },
      handler: new StaleWhileRevalidate({
        cacheName: "images",
      }),
    },
    // Handle scripts
    {
      matcher({ request }) {
        return request.destination === "script";
      },
      handler: new CacheFirst({
        cacheName: "scripts",
      }),
    },
    // Handle styles
    {
      matcher({ request }) {
        return request.destination === "style";
      },
      handler: new CacheFirst({
        cacheName: "styles",
      }),
    },
  ],
});

serwist.addEventListeners();`,
          lang: "typescript",
        },
      },
      { idPrefix: "example-multiple-caches" },
    ),
    cors: {
      noCors: highlightCode(
        locals.highlighter,
        {
          "index.html": {
            code: `<link rel="stylesheet" href="https://example.com/path/to/style.css">
<img src="https://example.com/path/to/image.png">`,
            lang: "html",
          },
        },
        { idPrefix: "reminder-cors-no-cors" },
      ),
      cors: highlightCode(
        locals.highlighter,
        {
          "index.html": {
            code: `<link crossorigin="anonymous" rel="stylesheet" href="https://example.com/path/to/style.css">
<img crossorigin="anonymous" src="https://example.com/path/to/image.png">`,
            lang: "html",
          },
        },
        { idPrefix: "reminder-cors-cors" },
      ),
    },
  },
});
