// Workaround for Next.js + Turbopack, while plugins are still
// not supported. This relies on Next.js Route Handlers and file
// name determinism.
import path from "node:path";
import { type BuildResult, getFileManifestEntries, rebasePath } from "@serwist/build";
import { SerwistConfigError, validationErrorMap } from "@serwist/build/schema";
import { toUnix } from "@serwist/utils";
import { cyan, dim, yellow } from "kolorist";
import { NextResponse } from "next/server.js";
import { z } from "zod";
import { injectManifestOptions } from "./index.schema.js";
import { logger } from "./lib/index.js";
import type { InjectManifestOptions, InjectManifestOptionsComplete } from "./types.js";

// TODO(workaround): `esbuild` doesn't load when in Turbopack production
const esbuild = import("esbuild-wasm");

const logSerwistResult = (filePath: string, buildResult: Pick<BuildResult, "count" | "size" | "warnings">) => {
  const { count, size, warnings } = buildResult;
  const hasWarnings = warnings && warnings.length > 0;
  // The route is reinitiated for each `path` param, so we only log results
  // if we're prerendering for sw.js.
  if (filePath === "sw.js" && (hasWarnings || count > 0)) {
    logger[hasWarnings ? "warn" : "event"](
      `${cyan(count)} precache entries ${dim(`(${(size / 1024).toFixed(2)} KiB)`)}${
        hasWarnings ? `\n${yellow(["⚠ warnings", ...warnings.map((w) => `  ${w}`), ""].join("\n"))}` : ""
      }`,
    );
  }
};

const validateGetManifestOptions = async (input: unknown): Promise<InjectManifestOptionsComplete> => {
  const result = await injectManifestOptions.spa(input, {
    error: validationErrorMap,
  });
  if (!result.success) {
    throw new SerwistConfigError({
      moduleName: "@serwist/turbopack",
      message: z.prettifyError(result.error),
    });
  }
  return result.data;
};

const isDev = process.env.NODE_ENV === "development";

const contentTypeMap: Record<string, string> = {
  ".js": "application/javascript",
  ".map": "application/json; charset=UTF-8",
};

/**
 * Creates a Route Handler for Serwist files.
 * @param options Options for {@linkcode getFileManifestEntries}.
 */
export const createSerwistRoute = (options: InjectManifestOptions) => {
  const dynamic = "force-static" as const,
    dynamicParams = false as const,
    revalidate = false as const;
  const validation = validateGetManifestOptions(options).then((config) => {
    return {
      ...config,
      disablePrecacheManifest: isDev,
      additionalPrecacheEntries: isDev ? [] : config.additionalPrecacheEntries,
      globIgnores: [
        ...config.globIgnores,
        // Make sure we leave swSrc out of the precache manifest.
        rebasePath({
          file: config.swSrc,
          baseDirectory: config.globDirectory,
        }),
      ],
      manifestTransforms: [
        ...(config.manifestTransforms ?? []),
        async (manifestEntries) => {
          const manifest = manifestEntries.map((m) => {
            // Replace all references to "$(distDir)" with "$(assetPrefix)/_next/".
            if (m.url.startsWith(config.nextConfig.distDir)) {
              m.url = `${config.nextConfig.assetPrefix ?? ""}/_next/${m.url.slice(config.nextConfig.distDir.length)}`;
            }
            // Replace all references to public/ with "$(basePath)/".
            if (m.url.startsWith("public/")) {
              m.url = path.posix.join(config.nextConfig.basePath, m.url.slice(7));
            }
            return m;
          });
          return { manifest, warnings: [] };
        },
      ],
    };
  });
  let map: Map<string, string> | null = null;
  // NOTE: ALL FILES MUST HAVE DETERMINISTIC NAMES. THIS IS BECAUSE
  // THE FOLLOWING MAP IS LOADED SEPARATELY FOR `generateStaticParams`
  // AND EVERY `GET` REQUEST TO EACH OF THE FILES.
  const loadMap = async (filePath: string) => {
    const config = await validation;
    const { count, size, manifestEntries, warnings } = await getFileManifestEntries(config);
    // See https://github.com/GoogleChrome/workbox/issues/2230
    const injectionPoint = config.injectionPoint || "";
    const manifestString = manifestEntries === undefined ? "undefined" : JSON.stringify(manifestEntries, null, 2);
    logSerwistResult(filePath, { count, size, warnings });
    const result = await (await esbuild).build({
      sourcemap: true,
      format: "esm",
      target: ["chrome64", "edge79", "firefox67", "opera51", "safari12"],
      treeShaking: true,
      minify: !isDev,
      bundle: true,
      ...config.esbuildOptions,
      platform: "browser",
      define: {
        ...config.esbuildOptions.define,
        ...(injectionPoint ? { [injectionPoint]: manifestString } : {}),
      },
      outdir: toUnix(config.cwd),
      write: false,
      entryNames: "[name]",
      // Asset and chunk names must be at the top, as our path is `/serwist/[path]`,
      // not `/serwist/[...path]`, meaning that we can't resolve paths deeper
      // than one level.
      assetNames: "[name]-[hash]",
      chunkNames: "[name]-[hash]",
      entryPoints: [{ in: toUnix(config.swSrc), out: "sw" }],
    });
    if (result.errors.length) {
      console.error("Failed to build the service worker.", result.errors);
      throw new Error();
    }
    if (result.warnings.length) {
      console.warn(result.warnings);
    }
    return new Map(result.outputFiles.map((e) => [e.path, e.text]));
  };
  const generateStaticParams = async () => {
    const config = await validation;
    if (!map) map = await loadMap("root");
    return [...map.keys()].map((e) => ({ path: path.relative(config.cwd, e) }));
  };
  const GET = async (_: Request, { params }: { params: Promise<{ path: string }> }) => {
    // TODO: obviously, files get stale in development when we pull this off.
    const { path: filePath } = await params;
    const config = await validation;
    if (!map) map = await loadMap(filePath);
    return new NextResponse(map.get(path.join(config.cwd, filePath)), {
      headers: {
        "Content-Type": contentTypeMap[path.extname(filePath)] || "text/plain",
        "Service-Worker-Allowed": "/",
      },
    });
  };
  return { dynamic, dynamicParams, revalidate, generateStaticParams, GET };
};
