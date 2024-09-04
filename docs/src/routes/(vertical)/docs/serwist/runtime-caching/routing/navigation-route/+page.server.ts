import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "NavigationRoute - Routing - Runtime caching - serwist",
  ogImage: encodeOpenGraphImage({
    title: "NavigationRoute",
    desc: "Routing - Runtime caching - serwist",
  }),
});
