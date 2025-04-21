import { defineConfig } from "vite";
import { serwist } from "vite-plugin-serwist";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [
    solidPlugin(),
    serwist({
      swSrc: "src/sw.ts",
      swDest: "sw.js",
      globDirectory: "dist",
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
});
