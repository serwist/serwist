import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "CacheableResponsePlugin - Plugins - serwist",
  ogImage: encodeOpenGraphImage({
    title: "CacheableResponsePlugin",
    desc: "Plugins - serwist",
  }),
});
