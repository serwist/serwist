import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Runtime caching - serwist",
  ogImage: encodeOpenGraphImage({
    title: "Runtime caching",
    desc: "serwist",
  }),
});
