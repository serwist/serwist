import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Worker exports - @serwist/next",
  ogImage: encodeOpenGraphImage({
    title: "Worker exports",
    desc: "@serwist/next",
  }),
});
