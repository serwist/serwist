import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "compileSrc - Configuring - @serwist/webpack-plugin",
  ogImage: encodeOpenGraphImage({
    title: "compileSrc",
    desc: "Configuring - @serwist/webpack-plugin",
  }),
});
