import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "register - Configuring - @serwist/next",
  ogImage: encodeOpenGraphImage({
    title: "register",
    desc: "Configuring - @serwist/next",
  }),
});
