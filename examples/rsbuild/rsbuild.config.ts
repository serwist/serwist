import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { InjectManifest } from "@serwist/webpack-plugin";

const dev = process.env.NODE_ENV === "development";

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    template: "./index.html",
  },
  tools: {
    rspack: {
      plugins: [
        new InjectManifest({
          swSrc: "./src/sw.ts",
          disablePrecacheManifest: dev,
          additionalPrecacheEntries: !dev ? [] : undefined,
        }),
      ],
    },
  },
});
