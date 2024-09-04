import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "copyResponse - The Serwist API - serwist",
  ogImage: encodeOpenGraphImage({
    title: "copyResponse",
    desc: "The Serwist API - serwist",
  }),
});
