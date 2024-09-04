import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "swDest (InjectManifest only) - Configuring - @serwist/build",
  ogImage: encodeOpenGraphImage({
    title: "swDest (InjectManifest only)",
    desc: "Configuring - @serwist/build",
  }),
});
