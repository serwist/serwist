import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Blog",
  ogImage: "Blog",
});
