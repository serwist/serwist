import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "globDirectory - Configuring - @serwist/build",
  ogImage: encodeOpenGraphImage({
    title: "globDirectory",
    desc: "Configuring - @serwist/build",
  }),
});
