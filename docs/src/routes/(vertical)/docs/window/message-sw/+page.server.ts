import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "messageSW - @serwist/window",
  ogImage: encodeOpenGraphImage({
    title: "messageSW",
    desc: "@serwist/window",
  }),
});
