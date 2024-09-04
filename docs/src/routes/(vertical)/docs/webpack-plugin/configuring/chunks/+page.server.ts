import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "chunks - Configuring - @serwist/webpack-plugin",
  ogImage: encodeOpenGraphImage({
    title: "chunks",
    desc: "Configuring - @serwist/webpack-plugin",
  }),
});
