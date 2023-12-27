import { serwist } from "@serwist/vite/integration-svelte";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    enhancedImages(),
    sveltekit(),
    serwist({
      // dev mode is not supported at the moment.
      disable: process.env.NODE_ENV === "development",
    }),
  ],
});
