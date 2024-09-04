import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "PrecacheRoute - Routing - Runtime caching - serwist",
  ogImage: encodeOpenGraphImage({
    title: "PrecacheRoute",
    desc: "Routing - Runtime caching - serwist",
  }),
});
