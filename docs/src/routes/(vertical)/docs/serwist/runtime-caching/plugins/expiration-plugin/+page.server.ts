import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "ExpirationPlugin - Plugins - serwist",
  ogImage: encodeOpenGraphImage({
    title: "ExpirationPlugin",
    desc: "Plugins - serwist",
  }),
});
