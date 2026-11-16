import path from "node:path";

import { serwist } from "@serwist/vite";

export const root = path.join(import.meta.dirname, "..");

export const appConfig = {
  root,
  logLevel: "info",
  build: {
    outDir: "dist",
    sourcemap: false,
  },
  plugins: [
    serwist({
      swSrc: "src/sw.ts",
      swDest: "sw.js",
      globDirectory: "dist/client",
      globPatterns: ["**/*.{html,js}"],
      injectionPoint: "self.__SW_MANIFEST",
      rollupFormat: "iife",
    }),
  ],
};

export const clientEnvironment = {
  build: {
    outDir: "dist/client",
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name]-[hash].js",
      },
    },
  },
};

export const swEnvironment = {
  consumer: "client",
  build: {
    outDir: "dist/sw",
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name]-[hash].js",
      },
    },
  },
};

export const ssrEnvironment = {
  consumer: "server",
  build: {
    outDir: "dist/server",
    rollupOptions: {
      input: "src/server.ts",
    },
  },
};
