import { encodeOpenGraphImage } from "$lib/og";
import { BLOG_ENTRIES } from "$lib/constants";
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
    }),
  };
};
