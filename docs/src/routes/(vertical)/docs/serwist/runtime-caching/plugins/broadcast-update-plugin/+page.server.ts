import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "BroadcastUpdatePlugin - Plugins - serwist",
  ogImage: encodeOpenGraphImage({
    title: "BroadcastUpdatePlugin",
    desc: "Plugins - serwist",
  }),
});
