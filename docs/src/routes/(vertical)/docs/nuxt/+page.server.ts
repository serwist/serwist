import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "@serwist/nuxt",
  ogImage: encodeOpenGraphImage("@serwist/nuxt"),
});
