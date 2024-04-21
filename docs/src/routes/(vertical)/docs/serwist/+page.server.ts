import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "serwist",
  ogImage: encodeOpenGraphImage("serwist"),
  toc: [
    {
      title: "serwist",
      id: "serwist",
      children: [
        {
          title: "Introduction",
          id: "introduction",
        },
        {
          title: "The Serwist API",
          id: "api",
        },
      ],
    },
  ],
});
