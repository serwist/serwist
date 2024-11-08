import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "rollupFormat - Configuring - vite-plugin-serwist",
  ogImage: encodeOpenGraphImage({
    title: "rollupFormat",
    desc: "Configuring - vite-plugin-serwist",
  }),
});
