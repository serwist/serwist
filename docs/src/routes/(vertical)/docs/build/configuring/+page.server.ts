import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Configuring - @serwist/build",
  ogImage: {
    title: "Configuring",
    desc: "@serwist/build",
  },
});
