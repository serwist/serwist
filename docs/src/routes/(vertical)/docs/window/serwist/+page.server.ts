import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Serwist - @serwist/window",
  ogImage: encodeOpenGraphImage({
    title: "Serwist",
    desc: "@serwist/window",
  }),
});
