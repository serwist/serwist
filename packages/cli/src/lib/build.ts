import path from "node:path";
import { getFileManifestEntries, type InjectManifestOptions, injectManifest } from "@serwist/build";
import chokidar from "chokidar";
import { glob } from "glob";
import prettyBytes from "pretty-bytes";

import type { BuildOptions } from "../types.js";
import { logger } from "./logger.js";
import { validateBuildOptions } from "./validation.js";

export interface InjectManifestCommand {
  watch: boolean;
  config: InjectManifestOptions;
}

/**
 * Runs the specified build command with the provided configuration.
 *
 * @param options
 */
export const runInjectManifestCommand = async ({ config, watch }: InjectManifestCommand) => {
  const { count, filePaths, size, warnings } = await injectManifest(config);

  for (const warning of warnings) {
    logger.warn(warning);
  }

  if (filePaths.length === 1) {
    logger.log(`The service worker file was written to ${config.swDest}.`);
  } else {
    const message = filePaths
      .sort()
      .map((filePath) => `  • ${filePath}`)
      .join("\n");
    logger.log(`The service worker files were written to:\n${message}`);
  }

  if (count > 0) {
    logger.log(`The service worker will precache ${count} URLs, ` + `totaling ${prettyBytes(size)}.`);
  }

  if (watch) {
    logger.log("\nWatching for changes...");
  }
};

export interface BuildCommand {
  config: BuildOptions;
  watch: boolean;
}

export const runBuildCommand = async ({ config, watch }: BuildCommand) => {
  const options = await validateBuildOptions(config);
  const { count, manifestEntries, size, warnings } = await getFileManifestEntries(options);

  for (const warning of warnings) {
    logger.warn(warning);
  }

  const manifestString = manifestEntries === undefined ? "undefined" : JSON.stringify(manifestEntries, null, 2);

  let esbuild: typeof import("esbuild");
  try {
    esbuild = await import("esbuild");
  } catch (err) {
    throw logger.error(`${err}\nThis command needs esbuild. Install it using "npm i esbuild".`);
  }

  const parsedDest = path.parse(config.swDest);

  const esbuildContext = await esbuild.context({
    metafile: true,
    sourcemap: watch,
    format: "esm",
    target: ["chrome64", "edge79", "firefox67", "opera51", "safari12"],
    treeShaking: true,
    // `minify` would also automatically set `NODE_ENV` to `"production"` when true.
    minify: !watch,
    bundle: true,
    ...options.esbuildOptions,
    platform: "browser",
    define: {
      ...options.esbuildOptions.define,
      ...(options.injectionPoint ? { [options.injectionPoint]: manifestString } : {}),
    },
    outdir: parsedDest.dir,
    entryNames: "[name]",
    // Asset and chunk names must be at the top, as our path is `/serwist/[path]`,
    // not `/serwist/[...path]`, meaning that we can't resolve paths deeper
    // than one level.
    assetNames: "[name]-[hash]",
    chunkNames: "[name]-[hash]",
    entryPoints: [{ in: config.swSrc, out: parsedDest.name }],
  });

  const rebuild = async () => {
    const result = await esbuildContext.rebuild();

    const filePaths = Object.keys(result.metafile.outputs);

    if (filePaths.length === 1) {
      logger.log(`The service worker file was written to ${config.swDest}.`);
    } else {
      const message = filePaths
        .sort()
        .map((filePath) => `  • ${filePath}`)
        .join("\n");
      logger.log(`The service worker files were written to:\n${message}`);
    }

    if (count > 0) {
      logger.log(`The service worker will precache ${count} URLs, ` + `totaling ${prettyBytes(size)}.`);
    }

    if (watch) {
      logger.log("\nWatching for changes...");
    }
  };

  if (watch) {
    if (config.globPatterns) {
      chokidar
        .watch(
          [
            config.swSrc,
            ...(config.disablePrecacheManifest
              ? []
              : await glob(config.globPatterns, {
                  cwd: config.globDirectory,
                  follow: config.globFollow,
                  ignore: config.globIgnores,
                })),
          ],
          {
            ignoreInitial: true,
            cwd: config.globDirectory,
          },
        )
        .on("all", async () => {
          if (config === null) return;
          await rebuild();
        })
        .on("ready", async () => {
          if (config === null) return;
          await rebuild();
        })
        .on("error", (err) => {
          logger.error(err instanceof Error ? err.toString() : "Unknown error");
        });
    }
  } else {
    await rebuild();
    await esbuildContext.dispose();
  }
};
