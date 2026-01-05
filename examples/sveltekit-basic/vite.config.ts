import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  // Note: Remove this when cloning this template!
  server: {
    fs: {
      allow: ["../.."],
    },
  },
});
