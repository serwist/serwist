import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Introduction",
  ogImage: "Documentation",
  toc: [
    {
      title: "Welcome",
      id: "welcome",
    },
  ],
});
