import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Base options - Configuring - @serwist/build",
  ogImage: encodeOpenGraphImage({
    title: "Base options",
    desc: "Configuring - @serwist/build",
  }),
});
