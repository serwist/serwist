import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "swUrl - Configuring - @serwist/next",
  ogImage: encodeOpenGraphImage({
    title: "swUrl",
    desc: "Configuring - @serwist/next",
  }),
});
