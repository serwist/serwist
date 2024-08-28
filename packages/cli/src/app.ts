/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import assert from "node:assert";
import path from "node:path";
import { type InjectManifestOptions, injectManifest } from "@serwist/build";
import type { WatchOptions } from "chokidar";
import chokidar from "chokidar";
import type { Result as MeowResult } from "meow";
import prettyBytes from "pretty-bytes";

import type { SupportedFlags } from "./bin.js";
import { constants } from "./lib/constants.js";
import { errors } from "./lib/errors.js";
import { logger } from "./lib/logger.js";
import { readConfig } from "./lib/read-config.js";
import { runWizard } from "./lib/run-wizard.js";

type BuildCommand = {
  watch: boolean;
  config: InjectManifestOptions;
};

/**
 * Runs the specified build command with the provided configuration.
 *
 * @param options
 */
const runBuildCommand = async ({ config, watch }: BuildCommand) => {
  const { count, filePaths, size, warnings } = await injectManifest(config);

  for (const warning of warnings) {
    logger.warn(warning);
  }

  if (filePaths.length === 1) {
    logger.log(`The service worker file was written to ${config.swDest}`);
  } else {
    const message = filePaths
      .sort()
      .map((filePath) => `  • ${filePath}`)
      .join("\n");
    logger.log(`The service worker files were written to:\n${message}`);
  }

  logger.log(`The service worker will precache ${count} URLs, ` + `totaling ${prettyBytes(size)}.`);

  if (watch) {
    logger.log("\nWatching for changes...");
  }
};

export const app = async (params: MeowResult<SupportedFlags>): Promise<void> => {
  // This should not be a user-visible error, unless meow() messes something up.
  assert(params && Array.isArray(params.input), errors["missing-input"]);

  // Default to showing the help message if there's no command provided.
  const [command = "help", option] = params.input;

  switch (command) {
    case "wizard": {
      await runWizard();
      break;
    }

    case "inject-manifest": {
      const configPath = path.resolve(process.cwd(), option || constants.defaultConfigFile);

      let config: InjectManifestOptions | null;
      try {
        config = await readConfig(configPath);
      } catch (error) {
        config = null;
        if (error instanceof Error) {
          logger.error(errors["invalid-common-js-module"]);
          throw error;
        }
      }

      if (config === null) {
        throw logger.error(errors["invalid-config-location"]);
      }

      logger.log(`Using configuration from ${configPath}.`);

      // Determine whether we're in --watch mode, or one-off mode.
      if (params?.flags?.watch) {
        const options: WatchOptions = {
          ignoreInitial: true,
        };
        if (config.globIgnores) {
          options.ignored = config.globIgnores;
        }
        if (config.globDirectory) {
          options.cwd = config.globDirectory;
        }

        if (config.globPatterns) {
          chokidar
            .watch(config.globPatterns, options)
            .on("all", async () => {
              if (config === null) return;
              await runBuildCommand({
                config,
                watch: true,
              });
            })
            .on("ready", async () => {
              if (config === null) return;
              await runBuildCommand({
                config,
                watch: true,
              });
            })
            .on("error", (err) => {
              logger.error(err.toString());
            });
        }
      } else {
        await runBuildCommand({ config, watch: false });
      }
      break;
    }

    // biome-ignore lint/suspicious/noFallthroughSwitchClause: Biome.js doesn't handle functions that return `never`... yet.
    case "help": {
      params.showHelp();
    }

    default: {
      throw new Error(`${errors["unknown-command"]} ${command}`);
    }
  }
};
