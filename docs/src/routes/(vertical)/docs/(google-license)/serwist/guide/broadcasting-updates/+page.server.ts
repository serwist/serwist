import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Broadcasting cache updates",
  ogImage: encodeOpenGraphImage({
    title: "Broadcasting cache updates",
    desc: "serwist",
  }),
});
