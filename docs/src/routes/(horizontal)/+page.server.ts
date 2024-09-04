import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Home",
  ogImage: encodeOpenGraphImage("Home"),
});
