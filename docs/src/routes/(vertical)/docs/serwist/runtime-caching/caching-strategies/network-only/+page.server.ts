import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "NetworkOnly - Caching strategies - Runtime caching - serwist",
  ogImage: encodeOpenGraphImage({
    title: "NetworkOnly",
    desc: "Caching strategies - Runtime caching - serwist",
  }),
});
