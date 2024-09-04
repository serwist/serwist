import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "maximumFileSizeToCacheInBytes - Configuring - @serwist/build",
  ogImage: encodeOpenGraphImage({
    title: "maximumFileSizeToCacheInBytes",
    desc: "Configuring - @serwist/build",
  }),
});
