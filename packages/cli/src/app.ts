/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import assert from "node:assert";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { InjectManifestOptions } from "@serwist/build";
import chokidar from "chokidar";
import { glob } from "glob";
import type { Result as MeowResult } from "meow";

import type { SupportedFlags } from "./bin.js";
import { runBuildCommand, runInjectManifestCommand } from "./lib/build.js";
import { constants } from "./lib/constants.js";
import { errors } from "./lib/errors.js";
import { logger } from "./lib/logger.js";
import { readConfig } from "./lib/read-config.js";
import { runWizard } from "./lib/run-wizard.js";

export const app = async (params: MeowResult<SupportedFlags>): Promise<void> => {
  // This should not be a user-visible error, unless meow() messes something up.
  assert(params && Array.isArray(params.input), errors["missing-input"]);

  // Default to showing the help message if there's no command provided.
  const [command = "help", option] = params.input;

  process.env.SERWIST_ENV = params.flags.watch ? "watch" : "build";
  process.env.NODE_ENV = params.flags.watch ? "development" : "production";

  switch (command) {
    case "wizard": {
      await runWizard();
      break;
    }

    case "build": {
      const configPath = path.resolve(process.cwd(), option || constants.defaultConfigFile);
      const configUrl = pathToFileURL(configPath).href;

      let config: InjectManifestOptions | null;
      try {
        config = await readConfig(configUrl);
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

      await runBuildCommand({ config, watch: !!params.flags.watch });

      break;
    }

    case "inject-manifest": {
      const configPath = path.resolve(process.cwd(), option || constants.defaultConfigFile);
      const configUrl = pathToFileURL(configPath).href;

      let config: InjectManifestOptions | null;
      try {
        config = await readConfig(configUrl);
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
      if (params.flags.watch) {
        if (config.globPatterns) {
          chokidar
            .watch(
              await glob(config.globPatterns, {
                cwd: config.globDirectory,
                follow: config.globFollow,
                ignore: config.globIgnores,
              }),
              {
                ignoreInitial: true,
                cwd: config.globDirectory,
              },
            )
            .on("all", async () => {
              if (config === null) return;
              await runInjectManifestCommand({
                config,
                watch: true,
              });
            })
            .on("ready", async () => {
              if (config === null) return;
              await runInjectManifestCommand({
                config,
                watch: true,
              });
            })
            .on("error", (err) => {
              logger.error(err instanceof Error ? err.toString() : "Unknown error");
            });
        }
      } else {
        await runInjectManifestCommand({ config, watch: false });
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
