import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Configuring - @serwist/next",
  ogImage: {
    title: "Configuring",
    desc: "@serwist/next",
  },
});
