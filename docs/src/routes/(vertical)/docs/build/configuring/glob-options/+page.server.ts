import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Glob options - Configuring - @serwist/build",
  ogImage: encodeOpenGraphImage({
    title: "Glob options",
    desc: "Configuring - @serwist/build",
  }),
});
