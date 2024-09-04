import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Getting started - @serwist/vite",
  ogImage: encodeOpenGraphImage({
    title: "Getting started",
    desc: "@serwist/vite",
  }),
});
