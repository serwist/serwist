import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "globStrict - Configuring - @serwist/build",
  ogImage: encodeOpenGraphImage({
    title: "globStrict",
    desc: "Configuring - @serwist/build",
  }),
});
