import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
  title: "@serwist/build",
  ogImage: encodeOpenGraphImage("@serwist/build"),
  toc: [
    {
      title: "@serwist/build",
      id: "serwist-build",
      children: [
        {
          title: "Introduction",
          id: "introduction",
        },
        {
          title: "Available modes",
          id: "available-modes",
        },
        {
          title: "Each mode's use cases",
          id: "each-modes-use-cases",
          children: [
            {
              title: "When to use InjectManifest?",
              id: "when-to-use-injectmanifest",
            },
            {
              title: "When to use GetManifest?",
              id: "when-to-use-getmanifest",
            },
          ],
        },
        {
          title: "Configuring",
          id: "configuring",
        },
      ],
    },
  ],
});
