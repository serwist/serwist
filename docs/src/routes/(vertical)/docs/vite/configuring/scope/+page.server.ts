import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "scope - Configuring - vite-plugin-serwist",
  ogImage: encodeOpenGraphImage({
    title: "scope",
    desc: "Configuring - vite-plugin-serwist",
  }),
});
