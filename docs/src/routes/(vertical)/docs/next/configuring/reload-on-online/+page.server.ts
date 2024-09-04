import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "reloadOnOnline - Configuring - @serwist/next",
  ogImage: encodeOpenGraphImage({
    title: "reloadOnOnline",
    desc: "Configuring - @serwist/next",
  }),
});
