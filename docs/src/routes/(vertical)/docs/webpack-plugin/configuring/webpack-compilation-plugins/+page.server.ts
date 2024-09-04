import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "webpackCompilationPlugins - Configuring - @serwist/webpack-plugin",
  ogImage: encodeOpenGraphImage({
    title: "webpackCompilationPlugins",
    desc: "Configuring - @serwist/webpack-plugin",
  }),
});
