import type { TocEntry } from "$lib/types";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Introduction",
  toc: [
    {
      title: "Welcome",
      id: "welcome",
    },
  ] satisfies TocEntry[],
});
