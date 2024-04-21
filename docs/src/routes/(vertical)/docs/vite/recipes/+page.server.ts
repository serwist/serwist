import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Documentation",
  ogImage: encodeOpenGraphImage("Documentation"),
  toc: [
    {
      title: "Recipes",
      id: "recipes",
      children: [
        {
          title: "Introduction",
          id: "introduction",
        },
      ],
    },
  ],
});
