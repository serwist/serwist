import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "injectionPoint (InjectManifest only) - Configuring - @serwist/build",
  ogImage: encodeOpenGraphImage({
    title: "injectionPoint (InjectManifest only)",
    desc: "Configuring - @serwist/build",
  }),
});
