import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "excludeChunks - Configuring - @serwist/webpack-plugin",
  ogImage: encodeOpenGraphImage({
    title: "excludeChunks",
    desc: "Configuring - @serwist/webpack-plugin",
  }),
});
