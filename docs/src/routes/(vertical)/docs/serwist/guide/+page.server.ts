import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Diving deeper - serwist",
  ogImage: encodeOpenGraphImage({
    title: "Diving deeper",
    desc: "serwist",
  }),
});
