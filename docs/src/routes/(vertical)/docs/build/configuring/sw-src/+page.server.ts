import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "swSrc (InjectManifest only) - Configuring - @serwist/build",
  ogImage: encodeOpenGraphImage({
    title: "swSrc (InjectManifest only)",
    desc: "Configuring - @serwist/build",
  }),
});
