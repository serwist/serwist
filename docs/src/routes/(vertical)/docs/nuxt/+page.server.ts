import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "@serwist/nuxt",
  ogImage: encodeOpenGraphImage("@serwist/nuxt"),
  toc: [
    {
      title: "@serwist/nuxt",
      id: "serwist-nuxt",
      children: [
        {
          title: "Introduction",
          id: "introduction",
        },
        {
          title: "Getting started",
          id: "getting-started",
        },
        {
          title: "Configuring",
          id: "configuring",
        },
        {
          title: "Alternatives",
          id: "alternatives",
        },
      ],
    },
  ],
  code: {
    degit: highlightCode(
      locals.highlighter,
      {
        npm: {
          code: "npx degit serwist/serwist/examples/nuxt-basic my-app",
          lang: "bash",
        },
        yarn: {
          code: "yarn degit serwist/serwist/examples/nuxt-basic my-app",
          lang: "bash",
        },
        pnpm: {
          code: "pnpx degit serwist/serwist/examples/nuxt-basic my-app",
          lang: "bash",
        },
        bun: {
          code: "bunx degit serwist/serwist/examples/nuxt-basic my-app",
          lang: "bash",
        },
      },
      { idPrefix: "degit" },
    ),
  },
});
