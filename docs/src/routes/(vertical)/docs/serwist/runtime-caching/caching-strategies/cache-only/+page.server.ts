import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "CacheOnly - Caching strategies - Runtime caching - serwist",
  ogImage: encodeOpenGraphImage({
    title: "CacheOnly",
    desc: "Caching strategies - Runtime caching - serwist",
  }),
});
