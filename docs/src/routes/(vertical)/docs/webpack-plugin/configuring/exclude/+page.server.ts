import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "exclude - Configuring - @serwist/webpack-plugin",
  ogImage: encodeOpenGraphImage({
    title: "exclude",
    desc: "Configuring - @serwist/webpack-plugin",
  }),
});
