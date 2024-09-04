import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "rollupOptions - Configuring - @serwist/vite",
  ogImage: encodeOpenGraphImage({
    title: "rollupOptions",
    desc: "Configuring - @serwist/vite",
  }),
});
