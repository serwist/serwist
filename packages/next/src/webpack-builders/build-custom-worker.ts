import fs from "node:fs";
import path from "node:path";

import { CleanWebpackPlugin } from "clean-webpack-plugin";
import type { TsConfigJson as TSConfigJSON } from "type-fest";
import type { Configuration } from "webpack";
import webpack from "webpack";

import { addPathAliasesToSWC, findFirstTruthy, logger } from "$utils/index.js";

import { getContentHash } from "../utils.js";
import { defaultSwcRc } from "./.swcrc.js";
import { nextPWAContext } from "./context.js";
import { getSharedWebpackConfig } from "./utils.js";

export const buildCustomWorker = ({
  isDev,
  baseDir,
  customWorkerSrc,
  customWorkerDest,
  customWorkerPrefix,
  plugins = [],
  tsconfig,
  basePath,
}: {
  isDev: boolean;
  swDest: string;
  baseDir: string;
  customWorkerSrc: string;
  customWorkerDest: string;
  customWorkerPrefix: string;
  plugins: Configuration["plugins"];
  tsconfig: TSConfigJSON | undefined;
  basePath: string;
}) => {
  const customWorkerEntry = findFirstTruthy(
    [customWorkerSrc, path.join("src", customWorkerSrc)],
    (dir) => {
      dir = path.join(baseDir, dir);

      const customWorkerEntries = ["ts", "js"]
        .map((ext) => path.join(dir, `index.${ext}`))
        .filter((entry) => fs.existsSync(entry));

      if (customWorkerEntries.length === 0) {
        return undefined;
      }

      const customWorkerEntry = customWorkerEntries[0];

      if (customWorkerEntries.length > 1) {
        logger.info(
          `More than one custom worker found, ${customWorkerEntry} will be used.`
        );
      }

      return customWorkerEntry;
    }
  );

  if (!customWorkerEntry) {
    return undefined;
  }

  logger.event(`Found a custom worker implementation at ${customWorkerEntry}.`);

  const swcRc = defaultSwcRc;

  if (tsconfig && tsconfig.compilerOptions && tsconfig.compilerOptions.paths) {
    addPathAliasesToSWC(
      swcRc,
      path.join(baseDir, tsconfig.compilerOptions.baseUrl ?? "."),
      tsconfig.compilerOptions.paths
    );
  }

  // We'd like to use webpack's `[hash]`, but we can't determine that hash without
  // Promise (Next doesn't allow Promise in webpack(config, context), but even if we
  // use Promise we will block the build until our stuff is done)
  const name = `${customWorkerPrefix}-${getContentHash(
    customWorkerEntry,
    isDev
  )}.js`;

  logger.event(
    `Building the custom worker to ${path.join(customWorkerDest, name)}...`
  );

  const webpackConfig: Configuration = {
    ...getSharedWebpackConfig({
      swcRc,
    }),
    watch: isDev && nextPWAContext.devWatchWorkers,
    mode: nextPWAContext.shouldMinify ? "production" : "development",
    target: "webworker",
    entry: {
      main: customWorkerEntry,
    },
    output: {
      path: customWorkerDest,
      filename: name,
      chunkFilename: "sw-chunks/[id]-[chunkhash].js",
    },
    plugins: [
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [
          path.join(customWorkerDest, `${customWorkerPrefix}-*.js`),
          path.join(customWorkerDest, `${customWorkerPrefix}-*.js.map`),
        ],
      }),
      ...plugins,
    ],
  };

  webpack(webpackConfig, (error, status) => {
    if (error || status?.hasErrors()) {
      logger.error("Failed to build the custom worker.");
      logger.error(
        status?.toString({ colors: true }) ?? error?.message ?? "Unknown error"
      );
      if (!isDev)
        throw new Error(
          "Failed to build the custom worker due to webpack errors."
        );
    } else {
      logger.event(
        `Built the custom worker successfully! (${
          status?.compilation.modules.size ?? 0
        } modules)`
      );
    }
  });

  return path.posix.join(basePath, name);
};
