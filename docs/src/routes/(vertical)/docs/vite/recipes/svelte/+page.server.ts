import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "SvelteKit - Recipes - @serwist/vite",
  ogImage: encodeOpenGraphImage({
    title: "SvelteKit",
    desc: "Recipes - @serwist/vite",
  }),
});
