import { encodeOpenGraphImage } from "$lib/og";
import type { SidebarLink } from "$lib/types";
import { BLOG_ENTRIES } from "./$layout.constants";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ url }) => {
  const metadata = BLOG_ENTRIES.find((entry) => entry.href === url.pathname);
  return {
    sidebar: BLOG_ENTRIES.map(({ title, href }) => ({ title: title.content, href }) satisfies SidebarLink),
    ...(metadata && {
      title: `${metadata.title.content} - Blog`,
      ogImage: encodeOpenGraphImage({
        title: metadata.title.content,
        desc: "Blog",
      }),
      metadata: {
        title: metadata.title,
        date: metadata.date,
      },
    }),
  };
};
