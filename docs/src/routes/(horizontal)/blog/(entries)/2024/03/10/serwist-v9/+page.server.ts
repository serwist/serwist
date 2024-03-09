import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Serwist 9.0.0 - Blog",
  ogImage: encodeOpenGraphImage({
    title: "Serwist 9.0.0",
    desc: "Blog",
  }),
  toc: [
    {
      title: "Serwist 9.0.0",
      id: "serwist-v9",
    },
  ],
  metadata: {
    title: {
      content: "Serwist 9.0.0",
      id: "serwist-v9",
    },
    date: "2024-03-10",
  },
});
