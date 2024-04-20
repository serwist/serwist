import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
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
      ],
    },
  ],
});
