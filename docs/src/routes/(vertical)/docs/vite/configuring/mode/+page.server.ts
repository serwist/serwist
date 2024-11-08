import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "mode - Configuring - vite-plugin-serwist",
  ogImage: encodeOpenGraphImage({
    title: "mode",
    desc: "Configuring - vite-plugin-serwist",
  }),
});
