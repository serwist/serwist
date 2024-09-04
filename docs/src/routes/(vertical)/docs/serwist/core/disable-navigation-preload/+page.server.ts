import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "disableNavigationPreload - The Serwist API - serwist",
  ogImage: encodeOpenGraphImage({
    title: "disableNavigationPreload",
    desc: "The Serwist API - serwist",
  }),
});
