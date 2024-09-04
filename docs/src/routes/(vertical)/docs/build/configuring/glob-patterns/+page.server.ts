import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "globPatterns - Configuring - @serwist/build",
  ogImage: encodeOpenGraphImage({
    title: "globPatterns",
    desc: "Configuring - @serwist/build",
  }),
});
