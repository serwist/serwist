import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "base - Configuring - @serwist/vite",
  ogImage: encodeOpenGraphImage({
    title: "base",
    desc: "Configuring - @serwist/vite",
  }),
});
