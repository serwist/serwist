import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "devOptions - Configuring - @serwist/vite",
  ogImage: encodeOpenGraphImage({
    title: "devOptions",
    desc: "Configuring - @serwist/vite",
  }),
});
