import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "swUrl - Configuring - vite-plugin-serwist",
  ogImage: encodeOpenGraphImage({
    title: "swUrl",
    desc: "Configuring - vite-plugin-serwist",
  }),
});
