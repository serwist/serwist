import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "RegExpRoute - Routing - Runtime caching - serwist",
  ogImage: encodeOpenGraphImage({
    title: "RegExpRoute",
    desc: "Routing - Runtime caching - serwist",
  }),
});
