import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "vite-plugin-serwist",
  ogImage: encodeOpenGraphImage("vite-plugin-serwist"),
});
