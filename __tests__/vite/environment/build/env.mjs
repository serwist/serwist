import { createBuilder } from "vite";

import { appConfig, clientEnvironment, ssrEnvironment } from "./shared.mjs";

// A multi-environment build with the client environment declared first.
const builder = await createBuilder({
  ...appConfig,
  environments: {
    client: clientEnvironment,
    ssr: ssrEnvironment,
  },
});

await builder.buildApp();
