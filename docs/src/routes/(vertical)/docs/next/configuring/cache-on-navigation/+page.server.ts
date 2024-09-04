import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "cacheOnNavigation - Configuring - @serwist/next",
  ogImage: encodeOpenGraphImage({
    title: "cacheOnNavigation",
    desc: "Configuring - @serwist/next",
  }),
});
