import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "plugins - Configuring - @serwist/vite",
  ogImage: encodeOpenGraphImage({
    title: "plugins",
    desc: "Configuring - @serwist/vite",
  }),
});
