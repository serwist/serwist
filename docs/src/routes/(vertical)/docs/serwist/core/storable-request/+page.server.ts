import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "StorableRequest - The Serwist API - serwist",
  ogImage: encodeOpenGraphImage({
    title: "StorableRequest",
    desc: "The Serwist API - serwist",
  }),
});
