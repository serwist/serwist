import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "NetworkFirst - Caching strategies - Runtime caching - serwist",
  ogImage: encodeOpenGraphImage({
    title: "NetworkFirst",
    desc: "Caching strategies - Runtime caching - serwist",
  }),
});
