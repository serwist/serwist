import type { BlogMetadata, TocEntry } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "Serwist 9.0.0 - Blog",
  toc: [
    {
      title: "Serwist 9.0.0",
      id: "serwist-v9",
    },
  ] satisfies TocEntry[],
  metadata: {
    title: {
      content: "Serwist 9.0.0",
      id: "serwist-v9",
    },
    date: "2024-03-10",
  } satisfies BlogMetadata,
});
