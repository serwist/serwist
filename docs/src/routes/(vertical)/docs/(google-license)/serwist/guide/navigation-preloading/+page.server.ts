import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Preloading navigations",
  ogImage: encodeOpenGraphImage({
    title: "Preloading navigations",
    desc: "serwist",
  }),
});
