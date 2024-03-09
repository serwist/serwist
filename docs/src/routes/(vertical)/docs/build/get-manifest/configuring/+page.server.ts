import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Configuring - GetManifest - @serwist/build",
  ogImage: encodeOpenGraphImage({
    title: "Configuring",
    desc: "GetManifest - @serwist/build",
  }),
});
