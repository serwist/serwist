import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Getting started - vite-plugin-serwist",
  ogImage: encodeOpenGraphImage({
    title: "Getting started",
    desc: "vite-plugin-serwist",
  }),
});
