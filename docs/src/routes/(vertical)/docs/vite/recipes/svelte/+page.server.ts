import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "SvelteKit - Recipes - vite-plugin-serwist",
  ogImage: encodeOpenGraphImage({
    title: "SvelteKit",
    desc: "Recipes - vite-plugin-serwist",
  }),
});
