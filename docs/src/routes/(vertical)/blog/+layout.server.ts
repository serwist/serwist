import { encodeOpenGraphImage } from "$lib/og";
import { BLOG_ENTRIES } from "./$layout.constants";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ url }) => {
  const metadata = BLOG_ENTRIES.find((entry) => entry.href === url.pathname);
  return {
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
