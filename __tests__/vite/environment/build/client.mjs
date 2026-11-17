import { build } from "vite";

import { appConfig } from "./shared.mjs";

// A client-only build, its output goes to `dist/client`.
await build({
  ...appConfig,
  build: {
    ...appConfig.build,
    outDir: "dist/client",
  },
});
