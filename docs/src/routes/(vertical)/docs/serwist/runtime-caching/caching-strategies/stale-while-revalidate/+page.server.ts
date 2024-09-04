import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "StaleWhileRevalidate - Caching strategies - Runtime caching - serwist",
  ogImage: encodeOpenGraphImage({
    title: "StaleWhileRevalidate",
    desc: "Caching strategies - Runtime caching - serwist",
  }),
});
