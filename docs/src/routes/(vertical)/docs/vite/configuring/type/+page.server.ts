import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "type - Configuring - @serwist/vite",
  ogImage: encodeOpenGraphImage({
    title: "type",
    desc: "Configuring - @serwist/vite",
  }),
});
