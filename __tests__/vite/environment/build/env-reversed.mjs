import { createBuilder } from "vite";

import { appConfig, clientEnvironment, ssrEnvironment } from "./shared.mjs";

// A multi-environment build with the server environment declared first: the
// service worker must still end up in the client output directory.
const builder = await createBuilder({
  ...appConfig,
  environments: {
    ssr: ssrEnvironment,
    client: clientEnvironment,
  },
});

await builder.buildApp();
