import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "@serwist/webpack-plugin",
  ogImage: encodeOpenGraphImage("@serwist/webpack-plugin"),
  toc: [
    {
      title: "@serwist/webpack-plugin",
      id: "serwist-webpack-plugin",
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
          title: "Supported webpack alternatives",
          id: "supported-webpack-alt",
        },
        {
          title: "Alternatives",
          id: "alternatives",
        },
      ],
    },
  ],
});
