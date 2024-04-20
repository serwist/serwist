import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "@serwist/next",
  ogImage: encodeOpenGraphImage("@serwist/next"),
  toc: [
    {
      title: "@serwist/next",
      id: "serwist-next",
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
