import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "CacheableResponse - The Serwist API - serwist",
  ogImage: encodeOpenGraphImage({
    title: "CacheableResponse",
    desc: "The Serwist API - serwist",
  }),
});
