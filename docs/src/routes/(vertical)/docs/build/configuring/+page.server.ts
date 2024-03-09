import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Configuring - @serwist/build",
  ogImage: encodeOpenGraphImage({
    title: "Configuring",
    desc: "@serwist/build",
  }),
});
