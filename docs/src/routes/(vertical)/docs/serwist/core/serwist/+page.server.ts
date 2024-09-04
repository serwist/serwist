import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Serwist - The Serwist API - serwist",
  ogImage: encodeOpenGraphImage({
    title: "Serwist",
    desc: "The Serwist API - serwist",
  }),
});
