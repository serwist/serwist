import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Strategy - Caching strategies - Runtime caching - serwist",
  ogImage: encodeOpenGraphImage({
    title: "Strategy",
    desc: "Caching strategies - Runtime caching - serwist",
  }),
});
