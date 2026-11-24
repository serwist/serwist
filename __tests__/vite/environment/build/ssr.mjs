import { build } from "vite";

import { appConfig } from "./shared.mjs";

// An SSR-only build using the legacy `build.ssr` option, where no service worker
// must be generated.
await build({
  ...appConfig,
  build: {
    ...appConfig.build,
    outDir: "dist/server",
    ssr: "src/server.ts",
  },
});
