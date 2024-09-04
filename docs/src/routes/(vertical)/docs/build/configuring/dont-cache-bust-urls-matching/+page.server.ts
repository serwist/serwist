import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "dontCacheBustURLsMatching - Configuring - @serwist/build",
  ogImage: encodeOpenGraphImage({
    title: "dontCacheBustURLsMatching",
    desc: "Configuring - @serwist/build",
  }),
});
