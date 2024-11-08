import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Worker exports - vite-plugin-serwist",
  ogImage: encodeOpenGraphImage({
    title: "Worker exports",
    desc: "vite-plugin-serwist",
  }),
});
