// @ts-check
import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  compilerOptions: {
    customElement: true,
  },
  kit: {
    adapter: adapter(),
    alias: {
      $components: "./src/components",
      $images: "./src/images",
    },
    csp: {
      directives: {
        "script-src": ["self", "strict-dynamic", "sha256-DjP3mqXEHW08gJZjCdT8u4O2YkjsRGagw6vMJOyKiN4="],
      },
    },
    inlineStyleThreshold: 2048,
    paths: {
      relative: false,
    },
    prerender: {
      handleHttpError: "warn",
      handleMissingId: "warn",
    },
    serviceWorker: {
      register: false,
    },
  },
};

export default config;
