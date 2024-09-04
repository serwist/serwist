import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "PrecacheFallbackPlugin - Plugins - serwist",
  ogImage: encodeOpenGraphImage({
    title: "PrecacheFallbackPlugin",
    desc: "Plugins - serwist",
  }),
});
