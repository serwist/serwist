import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "BroadcastCacheUpdate - The Serwist API - serwist",
  ogImage: encodeOpenGraphImage({
    title: "BroadcastCacheUpdate",
    desc: "The Serwist API - serwist",
  }),
});
