import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "mode - Configuring - @serwist/vite",
  ogImage: encodeOpenGraphImage({
    title: "mode",
    desc: "Configuring - @serwist/vite",
  }),
});
