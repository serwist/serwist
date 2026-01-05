// @ts-check
import { serwist } from "@serwist/svelte";
import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  kit: {
    adapter: serwist(adapter()),
    serviceWorker: {
      register: false,
    },
  },
};

export default config;
