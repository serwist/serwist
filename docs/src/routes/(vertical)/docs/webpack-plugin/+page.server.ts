import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "@serwist/webpack-plugin",
  ogImage: encodeOpenGraphImage("@serwist/webpack-plugin"),
});
