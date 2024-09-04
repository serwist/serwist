import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "enableNavigationPreload - The Serwist API - serwist",
  ogImage: encodeOpenGraphImage({
    title: "enableNavigationPreload",
    desc: "The Serwist API - serwist",
  }),
});
