import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "swUrl - Configuring - @serwist/vite",
  ogImage: encodeOpenGraphImage({
    title: "swUrl",
    desc: "Configuring - @serwist/vite",
  }),
});
