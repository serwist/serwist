import path from "node:path";
import { fileURLToPath } from "node:url";

import { CleanWebpackPlugin } from "clean-webpack-plugin";
import webpack from "webpack";

import { logger } from "$utils/index.js";

import { getContentHash } from "../utils.js";
import { nextPWAContext } from "./context.js";
import { getSharedWebpackConfig } from "./utils.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export const buildSWEntryWorker = ({
  isDev,
  destDir,
  shouldGenSWEWorker,
  basePath,
}: {
  isDev: boolean;
  destDir: string;
  shouldGenSWEWorker: boolean;
  basePath: string;
}) => {
  if (!shouldGenSWEWorker) {
    return undefined;
  }

  const swEntryWorkerEntry = path.join(__dirname, `sw-entry-worker.js`);

  // We'd like to use webpack's `[hash]`, but we can't determine that hash without
  // Promise (Next doesn't allow Promise in webpack(config, context), but even if we
  // use Promise we will block the build until our stuff is done)
  const name = `swe-worker-${getContentHash(swEntryWorkerEntry, isDev)}.js`;

  webpack({
    ...getSharedWebpackConfig({}),
    mode: nextPWAContext.shouldMinify ? "production" : "development",
    target: "webworker",
    entry: {
      main: swEntryWorkerEntry,
    },
    output: {
      path: destDir,
      filename: name,
      chunkFilename: "sw-chunks/[id]-[chunkhash].js",
    },
    plugins: [
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [
          path.join(destDir, "swe-worker-*.js"),
          path.join(destDir, "swe-worker-*.js.map"),
        ],
      }),
    ],
  }).run((error, status) => {
    if (error || status?.hasErrors()) {
      logger.error("Failed to build Serwist worker.");
      logger.error(
        status?.toString({ colors: true }) ?? error?.message ?? "Unknown error"
      );
      throw new Error(
        "Failed to build Serwist worker due to webpack errors."
      );
    }
  });

  return path.posix.join(basePath, name);
};
