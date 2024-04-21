import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "@serwist/vite",
  ogImage: encodeOpenGraphImage("@serwist/vite"),
  toc: [
    {
      title: "@serwist/vite",
      id: "serwist-vite",
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
          code: "npx degit serwist/serwist/examples/vite-react-basic my-app",
          lang: "bash",
        },
        yarn: {
          code: "yarn degit serwist/serwist/examples/vite-react-basic my-app",
          lang: "bash",
        },
        pnpm: {
          code: "pnpx degit serwist/serwist/examples/vite-react-basic my-app",
          lang: "bash",
        },
        bun: {
          code: "bunx degit serwist/serwist/examples/vite-react-basic my-app",
          lang: "bash",
        },
      },
      { idPrefix: "degit" },
    ),
  },
});
