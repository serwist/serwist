import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "CacheExpiration - The Serwist API - serwist",
  ogImage: encodeOpenGraphImage({
    title: "CacheExpiration",
    desc: "The Serwist API - serwist",
  }),
});
