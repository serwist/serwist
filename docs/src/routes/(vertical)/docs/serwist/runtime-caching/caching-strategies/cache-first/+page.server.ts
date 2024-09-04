import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "CacheFirst - Caching strategies - Runtime caching - serwist",
  ogImage: encodeOpenGraphImage({
    title: "CacheFirst",
    desc: "Caching strategies - Runtime caching - serwist",
  }),
});
