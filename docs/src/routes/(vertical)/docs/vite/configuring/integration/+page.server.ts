import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "integration - Configuring - @serwist/vite",
  ogImage: encodeOpenGraphImage({
    title: "integration",
    desc: "Configuring - @serwist/vite",
  }),
  toc: [
    {
      title: "integration",
      id: "integration",
      children: [
        {
          title: "First added",
          id: "first-added",
        },
        {
          title: "About",
          id: "about",
        },
        {
          title: "Usage",
          id: "usage",
        },
      ],
    },
  ],
  code: {
    usage: highlightCode(
      locals.highlighter,
      {
        "vite.config.ts": {
          code: `export default defineConfig({
  plugins: [
    // Other plugins...
    serwist({
      swSrc: "src/sw.ts",
      swDest: "sw.js",
      injectionPoint: "self.__SW_MANIFEST",
      rollupFormat: "iife",
      integration: {
        beforeBuildServiceWorker(options) {
          console.log(\`Building service worker with options:\`, options);
        },
        closeBundleOrder: "pre",
        configureOptions(viteConfig, options) {
          const clientOutDir = path.resolve(viteConfig.root, viteConfig.build.outDir);
          options.globDirectory = clientOutDir;
        },
      },
    }),
  ],
});`,
          lang: "javascript",
        },
      },
      { idPrefix: "usage-example", useTwoslash: false },
    ),
  },
});
