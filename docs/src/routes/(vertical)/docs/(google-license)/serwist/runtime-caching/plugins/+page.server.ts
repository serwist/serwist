import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Plugins - serwist",
  ogImage: encodeOpenGraphImage({
    title: "Plugins",
    desc: "serwist",
  }),
  toc: [
    {
      title: "Using plugins",
      id: "serwist-plugins",
      children: [
        {
          title: "Introduction",
          id: "introduction",
        },
        {
          title: "Built-in plugins",
          id: "built-in-plugins",
        },
        {
          title: "Lifecycle methods",
          id: "lifecycle-methods",
        },
      ],
    },
  ],
});
