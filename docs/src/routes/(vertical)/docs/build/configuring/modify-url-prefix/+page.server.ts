import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "modifyURLPrefix - Configuring - @serwist/build",
  ogImage: encodeOpenGraphImage({
    title: "modifyURLPrefix",
    desc: "Configuring - @serwist/build",
  }),
});
