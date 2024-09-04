import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "disable - Configuring - @serwist/vite",
  ogImage: encodeOpenGraphImage({
    title: "disable",
    desc: "Configuring - @serwist/vite",
  }),
});
