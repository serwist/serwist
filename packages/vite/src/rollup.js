// @ts-check
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getRollupOptions } from "@serwist/constants/rollup";
import fg from "fast-glob";

import packageJson from "../package.json" assert { type: "json" };

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const clientEntries = /** @type {Record<string, string>} */ ({});

for (const clientPath of await fg("client/*.ts", { cwd: __dirname })) {
  const parsedClientPath = path.parse(clientPath);
  clientEntries[`client/${parsedClientPath.name}`] = path.join("src", clientPath);
}

const integrationEntries = /** @type {Record<string, string>} */ ({});

for (const integrationPath of await fg("integration/*/index.ts", { cwd: __dirname })) {
  const parsedClientPath = path.parse(integrationPath);
  integrationEntries[`${parsedClientPath.dir}/${parsedClientPath.name}`] = path.join("src", integrationPath);
}

export default getRollupOptions({
  packageJson,
  jsFiles: [
    {
      input: {
        index: "src/index.ts",
        "index.browser": "src/index.browser.ts",
        "index.worker": "src/index.worker.ts",
        ...clientEntries,
        ...integrationEntries,
      },
      output: {
        dir: "dist",
        format: "esm",
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
      },
      external: ["virtual:internal-serwist"],
    },
  ],
});
