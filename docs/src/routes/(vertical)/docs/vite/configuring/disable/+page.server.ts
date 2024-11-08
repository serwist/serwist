import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "disable - Configuring - vite-plugin-serwist",
  ogImage: encodeOpenGraphImage({
    title: "disable",
    desc: "Configuring - vite-plugin-serwist",
  }),
});
