import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Constants - The Serwist API - serwist",
  ogImage: encodeOpenGraphImage({
    title: "Constants",
    desc: "The Serwist API - serwist",
  }),
});
