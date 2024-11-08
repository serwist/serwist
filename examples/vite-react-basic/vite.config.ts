import { serwist } from "vite-plugin-serwist";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { defineConfig } from "vite";

console.log(path.join(import.meta.dirname, "../../"));

// https://vitejs.dev/config/
export default defineConfig({
  envDir: path.join(import.meta.dirname, "../../"),
  envPrefix: "PUBLIC_",
  plugins: [
    react(),
    serwist({
      swSrc: "src/sw.ts",
      swDest: "sw.js",
      globDirectory: "dist",
      injectionPoint: "self.__SW_MANIFEST",
      rollupFormat: "iife",
    }),
  ],
});
