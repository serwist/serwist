import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Configuring - @serwist/vite",
  ogImage: encodeOpenGraphImage({
    title: "Configuring",
    desc: "@serwist/vite",
  }),
  toc: [
    {
      title: "Configuring",
      id: "configuring",
      children: [
        {
          title: "Available options",
          id: "available-options",
        },
      ],
    },
  ],
});
