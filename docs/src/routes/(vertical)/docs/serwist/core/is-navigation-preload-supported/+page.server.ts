import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "isNavigationPreloadSupported - The Serwist API - serwist",
  ogImage: encodeOpenGraphImage({
    title: "isNavigationPreloadSupported",
    desc: "The Serwist API - serwist",
  }),
});
