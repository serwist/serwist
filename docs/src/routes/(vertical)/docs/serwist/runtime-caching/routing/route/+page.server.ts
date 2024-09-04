import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Route - Routing - Runtime caching - serwist",
  ogImage: encodeOpenGraphImage({
    title: "Route",
    desc: "Routing - Runtime caching - serwist",
  }),
});
