import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "integration - Configuring - @serwist/vite",
  ogImage: encodeOpenGraphImage({
    title: "integration",
    desc: "Configuring - @serwist/vite",
  }),
});
