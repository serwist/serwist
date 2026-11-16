import { serwist } from "@serwist/svelte";
import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    sveltekit({
      // Consult https://svelte.dev/docs/kit/integrations
      // for more information about preprocessors
      preprocess: vitePreprocess(),
      adapter: serwist(adapter()),
      serviceWorker: {
        register: false,
      },
    }),
  ],
  // Note: Remove this when cloning this template!
  server: {
    fs: {
      allow: ["../.."],
    },
  },
});
