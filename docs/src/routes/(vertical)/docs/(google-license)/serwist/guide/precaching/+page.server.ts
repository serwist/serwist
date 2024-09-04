import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Precaching assets",
  ogImage: encodeOpenGraphImage({
    title: "Precaching assets",
    desc: "serwist",
  }),
});
