import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "manifestTransforms - Configuring - @serwist/build",
  ogImage: encodeOpenGraphImage({
    title: "manifestTransforms",
    desc: "Configuring - @serwist/build",
  }),
});
