import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "include - Configuring - @serwist/webpack-plugin",
  ogImage: encodeOpenGraphImage({
    title: "include",
    desc: "Configuring - @serwist/webpack-plugin",
  }),
});
