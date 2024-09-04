import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "disableDevLogs - The Serwist API - serwist",
  ogImage: encodeOpenGraphImage({
    title: "disableDevLogs",
    desc: "The Serwist API - serwist",
  }),
});
