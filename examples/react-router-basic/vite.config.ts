import { reactRouter } from "@react-router/dev/vite";
import { serwist } from "@serwist/react-router";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    serwist(),
    tsconfigPaths({
      projects: ["./tsconfig.json"],
    }),
  ],
});
