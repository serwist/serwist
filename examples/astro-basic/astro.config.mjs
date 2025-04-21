// @ts-check
import { serwist } from "@serwist/astro";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [serwist()],
});
