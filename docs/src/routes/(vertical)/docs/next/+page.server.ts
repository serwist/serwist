import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "@serwist/next",
  ogImage: encodeOpenGraphImage("@serwist/next"),
});
