import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "base - Configuring - vite-plugin-serwist",
  ogImage: encodeOpenGraphImage({
    title: "base",
    desc: "Configuring - vite-plugin-serwist",
  }),
});
