import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Setting cacheability criteria",
  ogImage: encodeOpenGraphImage({
    title: "Setting cacheability criteria",
    desc: "serwist",
  }),
});
