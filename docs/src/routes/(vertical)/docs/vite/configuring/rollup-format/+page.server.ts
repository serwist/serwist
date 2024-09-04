import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "rollupFormat - Configuring - @serwist/vite",
  ogImage: encodeOpenGraphImage({
    title: "rollupFormat",
    desc: "Configuring - @serwist/vite",
  }),
});
