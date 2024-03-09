import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Configuring - InjectManifest - @serwist/build",
  ogImage: encodeOpenGraphImage({
    title: "Configuring",
    desc: "InjectManifest - @serwist/build",
  }),
});
