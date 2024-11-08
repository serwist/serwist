import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "integration - Configuring - vite-plugin-serwist",
  ogImage: encodeOpenGraphImage({
    title: "integration",
    desc: "Configuring - vite-plugin-serwist",
  }),
});
