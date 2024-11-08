import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "plugins - Configuring - vite-plugin-serwist",
  ogImage: encodeOpenGraphImage({
    title: "plugins",
    desc: "Configuring - vite-plugin-serwist",
  }),
});
