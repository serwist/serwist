import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Routing - Runtime caching - serwist",
  ogImage: encodeOpenGraphImage({
    title: "Routing",
    desc: "Runtime caching - serwist",
  }),
});
