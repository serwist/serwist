import { createBuilder } from "vite";

import { appConfig, clientEnvironment, ssrEnvironment, swEnvironment } from "./shared.mjs";

// A build with 2 client environments and a server environment: the service worker
// must only be generated for the primary client environment.
const builder = await createBuilder({
  ...appConfig,
  environments: {
    client: clientEnvironment,
    sw: swEnvironment,
    ssr: ssrEnvironment,
  },
});

await builder.buildApp();
