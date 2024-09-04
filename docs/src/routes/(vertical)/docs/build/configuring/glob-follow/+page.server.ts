import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "globFollow - Configuring - @serwist/build",
  ogImage: encodeOpenGraphImage({
    title: "globFollow",
    desc: "Configuring - @serwist/build",
  }),
});
