import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "BackgroundSyncPlugin - Plugins - serwist",
  ogImage: encodeOpenGraphImage({
    title: "BackgroundSyncPlugin",
    desc: "Plugins - serwist",
  }),
});
