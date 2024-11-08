import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "devOptions - Configuring - vite-plugin-serwist",
  ogImage: encodeOpenGraphImage({
    title: "devOptions",
    desc: "Configuring - vite-plugin-serwist",
  }),
});
