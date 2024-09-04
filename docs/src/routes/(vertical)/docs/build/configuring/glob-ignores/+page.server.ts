import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "globIgnores - Configuring - @serwist/build",
  ogImage: encodeOpenGraphImage({
    title: "globIgnores",
    desc: "Configuring - @serwist/build",
  }),
});
