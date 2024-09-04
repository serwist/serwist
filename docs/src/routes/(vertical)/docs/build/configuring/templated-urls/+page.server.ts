import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "templatedURLs - Configuring - @serwist/build",
  ogImage: encodeOpenGraphImage({
    title: "templatedURLs",
    desc: "Configuring - @serwist/build",
  }),
});
