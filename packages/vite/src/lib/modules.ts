import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

import type { BuildResult, GetManifestResult } from "@serwist/build";
import { VIRTUAL_FRAMEWORKS_MAP, VIRTUAL_PREFIX, VIRTUAL_SERWIST, VIRTUAL_SERWIST_RESOLVED } from "./constants.js";
import type { SerwistViteContext } from "./context.js";
import { logSerwistResult } from "./log.js";

const require = createRequire(import.meta.url);

export const vite = import("vite");

export const serwistBuild = import("@serwist/build");

import type { VirtualFrameworks } from "./types.js";

/** Prevents racing conditions. */
let invokedGsw = false;

export const generateServiceWorker = async (ctx: SerwistViteContext): Promise<GetManifestResult | BuildResult | undefined> => {
  if (invokedGsw) return;

  invokedGsw = true;

  const parsedSwDest = path.parse(ctx.options.injectManifest.swDest);

  await ctx.options.integration?.beforeBuildServiceWorker?.(ctx.options);

  let injectManifestResult: GetManifestResult | BuildResult | undefined;

  if (ctx.options.mode === "development" && !ctx.options.devOptions.bundle) {
    // Classic InjectManifest. This mode is only run in development when `devOptions.bundle` is `false`.
    injectManifestResult = await (await serwistBuild).injectManifest(ctx.options.injectManifest);
  } else {
    // Custom InjectManifest for Vite. This mode also bundles the service worker in addition
    // to injecting the precache manifest into it.
    const { getFileManifestEntries } = await serwistBuild;

    injectManifestResult = await getFileManifestEntries(ctx.options.injectManifest);

    const manifestString = injectManifestResult.manifestEntries === undefined ? "undefined" : JSON.stringify(injectManifestResult.manifestEntries);

    const define: Record<string, any> = {
      // Nuxt is weird: during the build, it manually defines browser APIs, such as `window`,
      // `document`, `location`,..., as `undefined`. `define` doesn't seem to have anything
      // particularly useful for the service worker as well, so we don't extend it.
      ...(ctx.framework === "nuxt" ? undefined : ctx.viteConfig.define),
      "process.env.NODE_ENV": `"${ctx.options.mode}"`,
    };

    if (ctx.options.injectManifest.injectionPoint) define[ctx.options.injectManifest.injectionPoint] = manifestString;

    await (await vite).build({
      ...ctx.userViteConfig,
      // We shouldn't copy anything from public directory.
      publicDir: false,
      define,
      plugins: ctx.options.plugins,
      build: {
        rollupOptions: {
          ...ctx.options.rollupOptions,
          input: {
            [parsedSwDest.name]: ctx.options.injectManifest.swSrc,
          },
          output: {
            entryFileNames: parsedSwDest.base,
            format: ctx.options.rollupFormat,
          },
        },
        outDir: parsedSwDest.dir,
        emptyOutDir: false,
        minify: ctx.options.mode === "production" || ctx.options.devOptions.minify,
      },
      logLevel: ctx.viteConfig.isProduction ? "info" : "warn",
      configFile: false,
    });
  }

  if (injectManifestResult) {
    if (ctx.viteConfig.isProduction) {
      // Log Serwist result
      logSerwistResult(injectManifestResult, ctx);
    } else if (injectManifestResult.warnings && injectManifestResult.warnings.length > 0) {
      ctx.logger.warn(["Warnings", ...injectManifestResult.warnings.map((w) => ` - ${w}`), ""].join("\n"));
    }
  }

  invokedGsw = false;

  return injectManifestResult;
};

export const resolveVirtualId = (id: string) => {
  if (id.startsWith(VIRTUAL_SERWIST)) {
    return `${VIRTUAL_PREFIX}${id}`;
  }
  return undefined;
};

export const loadVirtual = (id: string, ctx: SerwistViteContext) => {
  if (id === VIRTUAL_SERWIST_RESOLVED) {
    return `import { Serwist } from "@serwist/window";
export const swUrl = "${path.posix.join(ctx.options.base, ctx.options.swUrl)}";
export const swScope = "${ctx.options.scope}";
export const swType = "${ctx.devEnvironment ? "module" : ctx.options.type}";
export const getSerwist = () => {
  if ("serviceWorker" in navigator) {
    return new Serwist(swUrl, { scope: swScope, type: swType });
  }
  return undefined;
}`;
  }
  if (Object.hasOwn(VIRTUAL_FRAMEWORKS_MAP, id)) {
    const framework = VIRTUAL_FRAMEWORKS_MAP[id as VirtualFrameworks];
    const content = readFileSync(path.resolve(require.resolve("vite-plugin-serwist"), `../client/index.${framework}.js`), "utf-8");
    return content;
  }
  return undefined;
};
