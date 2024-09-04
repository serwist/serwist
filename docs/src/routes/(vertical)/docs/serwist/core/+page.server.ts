import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Using the Serwist API - serwist",
  ogImage: encodeOpenGraphImage({
    title: "Using the Serwist API",
    desc: "serwist",
  }),
});
