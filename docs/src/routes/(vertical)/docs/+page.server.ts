import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Introduction",
  ogImage: encodeOpenGraphImage("Documentation"),
  toc: [
    {
      title: "Welcome",
      id: "welcome",
    },
  ],
});
