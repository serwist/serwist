// import { serwist } from "@serwist/vite";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    enhancedImages(),
    sveltekit(),
    // serwist({
    //   swSrc: "src/sw.ts",
    //   swDest: "sw.js",
    //   globDirectory: "",
    // }),
  ],
});
