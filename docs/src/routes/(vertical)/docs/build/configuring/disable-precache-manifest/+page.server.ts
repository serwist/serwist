import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "disablePrecacheManifest - Configuring - @serwist/build",
  ogImage: encodeOpenGraphImage({
    title: "disablePrecacheManifest",
    desc: "Configuring - @serwist/build",
  }),
});
