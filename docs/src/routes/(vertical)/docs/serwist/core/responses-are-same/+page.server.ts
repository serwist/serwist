import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "responsesAreSame - The Serwist API - serwist",
  ogImage: encodeOpenGraphImage({
    title: "responsesAreSame",
    desc: "The Serwist API - serwist",
  }),
});
