import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Caching strategies - Runtime caching - serwist",
  ogImage: encodeOpenGraphImage({
    title: "Caching strategies",
    desc: "Runtime caching - serwist",
  }),
});
