import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "scope - Configuring - @serwist/vite",
  ogImage: encodeOpenGraphImage({
    title: "scope",
    desc: "Configuring - @serwist/vite",
  }),
});
