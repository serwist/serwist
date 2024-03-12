import assert from "node:assert";
import fs from "node:fs/promises";
import path from "node:path";

import type * as SerwistBuild from "@serwist/build";

import type { SerwistViteContext } from "./context.js";

export const loadSerwistBuild = async (): Promise<typeof SerwistBuild> => {
  // "@serwist/build" is large and makes config loading slow.
  // Since it is not always used, we only load this when it is needed.
  try {
    return await import("@serwist/build");
  } catch (_) {
    // We don't have a default export, don't worry.
    return require("@serwist/build");
  }
};

interface BuildResult extends SerwistBuild.GetManifestResult {
  manifestString: string;
}

export const injectManifest = async (options: SerwistBuild.GetManifestOptions): Promise<BuildResult> => {
  const { getFileManifestEntries, stringify } = await loadSerwistBuild();
  const { count, size, manifestEntries, warnings } = await getFileManifestEntries(options);
  const manifestString = manifestEntries === undefined ? "undefined" : stringify(manifestEntries);
  return {
    warnings,
    size,
    count,
    manifestEntries,
    manifestString,
  };
};

export const generateServiceWorker = async (ctx: SerwistViteContext) => {
  const { plugins, rollupOptions, rollupFormat } = ctx.options;

  const parsedSwDest = path.parse(ctx.options.injectManifest.swDest);

  let injectManifestResult: BuildResult | undefined = undefined;

  if (ctx.options.injectManifest.injectionPoint) {
    await ctx.options.integration?.beforeBuildServiceWorker?.(ctx.options);
    injectManifestResult = await injectManifest(ctx.options.injectManifest);
  }

  const isProduction = ctx.options.mode === "production";
  const isDev = ctx.options.mode === "development";

  if (isDev && !ctx.options.devOptions.bundle) {
    if (!injectManifestResult) {
      throw new Error("injectManifest failed to generate results. This is likely a bug.");
    }

    const { errors, escapeRegExp, getSourceMapURL, rebasePath, replaceAndUpdateSourceMap, translateURLToSourcemapPaths } = await loadSerwistBuild();

    // Make sure we leave swSrc and swDest out of the precache manifest.
    for (const file of [ctx.options.injectManifest.swSrc, ctx.options.injectManifest.swDest]) {
      ctx.options.injectManifest.globIgnores!.push(
        rebasePath({
          file,
          baseDirectory: ctx.options.injectManifest.globDirectory,
        }),
      );
    }

    const injectionPoint = ctx.options.injectManifest.injectionPoint!;

    const globalRegexp = new RegExp(escapeRegExp(injectionPoint), "g");

    let swFileContents: string;
    try {
      swFileContents = await fs.readFile(ctx.options.injectManifest.swSrc, "utf8");
    } catch (error) {
      throw new Error(`${errors["invalid-sw-src"]} ${error instanceof Error && error.message ? error.message : ""}`);
    }

    const injectionResults = swFileContents.match(globalRegexp);
    // See https://github.com/GoogleChrome/workbox/issues/2230
    if (!injectionResults) {
      throw new Error(`${errors["injection-point-not-found"]} ${injectionPoint}`);
    }

    assert(injectionResults.length === 1, `${errors["multiple-injection-points"]} ${injectionPoint}`);

    const filesToWrite: Record<string, string> = {};

    const url = getSourceMapURL(swFileContents);
    // See https://github.com/GoogleChrome/workbox/issues/2957
    const { destPath, srcPath, warning } = translateURLToSourcemapPaths(url, ctx.options.injectManifest.swSrc, ctx.options.injectManifest.swDest);
    if (warning) {
      injectManifestResult.warnings.push(warning);
    }

    // If our swSrc file contains a sourcemap, we would invalidate that
    // mapping if we just replaced injectionPoint with the stringified manifest.
    // Instead, we need to update the swDest contents as well as the sourcemap
    // (assuming it's a real file, not a data: URL) at the same time.
    // See https://github.com/GoogleChrome/workbox/issues/2235
    // and https://github.com/GoogleChrome/workbox/issues/2648
    if (srcPath && destPath) {
      const { map, source } = await replaceAndUpdateSourceMap({
        originalMap: JSON.parse(await fs.readFile(srcPath, "utf8")),
        jsFilename: path.basename(ctx.options.injectManifest.swDest),
        originalSource: swFileContents,
        replaceString: injectManifestResult.manifestString,
        searchString: injectionPoint,
      });

      filesToWrite[ctx.options.injectManifest.swDest] = source;
      filesToWrite[destPath] = map;
    } else {
      // If there's no sourcemap associated with swSrc, a simple string
      // replacement will suffice.
      filesToWrite[ctx.options.injectManifest.swDest] = swFileContents.replace(globalRegexp, injectManifestResult.manifestString);
    }

    for (const [file, contents] of Object.entries(filesToWrite)) {
      try {
        await fs.mkdir(path.dirname(file), { recursive: true });
      } catch (error: unknown) {
        throw new Error(`${errors["unable-to-make-sw-directory"]} '${error instanceof Error && error.message ? error.message : ""}'`);
      }

      await fs.writeFile(file, contents);
    }
  } else {
    const define: Record<string, any> = {
      // Nuxt does some really weird stuff. During the build, they MANUALLY
      // set browser APIs, such as window, document, location,..., to `undefined`??
      // Probably some Vue or server stuff. Their `define` doesn't seem to have anything
      // particularly useful for the service worker anyway, so we don't extend it.
      ...(ctx.framework === "nuxt" ? undefined : ctx.viteConfig.define),
      "process.env.NODE_ENV": `"${ctx.options.mode}"`,
    };
    if (ctx.options.injectManifest.injectionPoint && injectManifestResult) {
      define[ctx.options.injectManifest.injectionPoint] = injectManifestResult.manifestString;
    }
    const { build } = await import("vite");
    await build({
      logLevel: ctx.viteConfig.isProduction ? "info" : "warn",
      root: ctx.viteConfig.root,
      base: ctx.viteConfig.base,
      resolve: ctx.viteConfig.resolve,
      // Don't copy anything from public folder
      publicDir: false,
      build: {
        sourcemap: ctx.viteConfig.build.sourcemap,
        lib: {
          entry: ctx.options.injectManifest.swSrc,
          name: "app",
          formats: [rollupFormat],
        },
        rollupOptions: {
          ...rollupOptions,
          plugins,
          output: {
            entryFileNames: parsedSwDest.base,
          },
        },
        outDir: parsedSwDest.dir,
        emptyOutDir: false,
        minify: isProduction || ctx.options.devOptions.minify,
      },
      configFile: false,
      define,
    });
  }

  return injectManifestResult;
};
