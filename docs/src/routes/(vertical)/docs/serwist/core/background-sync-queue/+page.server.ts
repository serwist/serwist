import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "BackgroundSyncQueue - The Serwist API - serwist",
  ogImage: encodeOpenGraphImage({
    title: "BackgroundSyncQueue",
    desc: "The Serwist API - serwist",
  }),
});
