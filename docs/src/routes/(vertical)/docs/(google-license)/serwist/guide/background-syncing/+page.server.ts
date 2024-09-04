import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Background synchronizing",
  ogImage: encodeOpenGraphImage({
    title: "Background synchronizing",
    desc: "serwist",
  }),
});
