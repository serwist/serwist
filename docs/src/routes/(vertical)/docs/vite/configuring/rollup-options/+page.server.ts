import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "rollupOptions - Configuring - vite-plugin-serwist",
  ogImage: encodeOpenGraphImage({
    title: "rollupOptions",
    desc: "Configuring - vite-plugin-serwist",
  }),
});
