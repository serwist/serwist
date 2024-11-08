import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Configuring - vite-plugin-serwist",
  ogImage: encodeOpenGraphImage({
    title: "Configuring",
    desc: "vite-plugin-serwist",
  }),
});
