// Workaround for Next.js + Turbopack, while plugins are still
// not supported. This relies on Next.js Route Handlers and file
// name determinism. This version is for when NOT using `cacheComponents`.
import { type BuildResult, getFileManifestEntries } from "@serwist/build";
import { cyan, dim, yellow } from "kolorist";
import type { NextConfig } from "next";
import { NextResponse } from "next/server.js";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { build } from "./lib/build.js";
import { CONTENT_TYPE_MAP, DEV } from "./lib/constants.js";
import { logger } from "./lib/index.js";
import type { LoggingMethods } from "./lib/logger.js";
import { validateInjectManifestOptions } from "./lib/validate.js";
import type { InjectManifestOptions } from "./types.js";

let esbuildWasm: Promise<typeof import("esbuild-wasm")> | null = null;
let esbuildNative: Promise<typeof import("esbuild")> | null = null;

const logSerwistResult = (
  filePath: string,
  buildResult: Pick<BuildResult, "count" | "size" | "warnings">,
) => {
  const { count, size, warnings } = buildResult;
  const hasWarnings = warnings && warnings.length > 0;
  // The route is reinitiated for each `path` param, so we only log results
  // if we're prerendering for sw.js.
  if (filePath === "sw.js" && (hasWarnings || count > 0)) {
    logger[hasWarnings ? "warn" : "event"](
      `${cyan(count)} precache entries ${dim(`(${(size / 1024).toFixed(2)} KiB)`)}${
        hasWarnings
          ? `\n${yellow(["⚠ warnings", ...warnings.map((w) => `  ${w}`), ""].join("\n"))}`
          : ""
      }`,
    );
  }
};

/**
 * Creates a Route Handler for Serwist files.
 * @param options Options for {@linkcode getFileManifestEntries}.
 */
export const createSerwistRoute = (options: InjectManifestOptions) => {
  const dynamic = "force-static" as const,
    dynamicParams = false as const,
    revalidate = false as const;
  const validation = validateInjectManifestOptions(options);
  let lastHash: string | null = null;
  let map: Map<string, string> | null = null;
  // NOTE: ALL FILES MUST HAVE DETERMINISTIC NAMES. THIS IS BECAUSE
  // THE FOLLOWING MAP IS LOADED SEPARATELY FOR `generateStaticParams`
  // AND EVERY `GET` REQUEST TO EACH OF THE FILES.
  const loadMap = async (filePath: string) => {
    const config = await validation;
    const { count, size, manifestEntries, warnings } =
      await getFileManifestEntries(config);
    // See https://github.com/GoogleChrome/workbox/issues/2230
    const injectionPoint = config.injectionPoint || "";
    const manifestString =
      manifestEntries === undefined
        ? "undefined"
        : JSON.stringify(manifestEntries, null, 2);
    const log = (type: LoggingMethods, ...message: any[]) => {
      if (filePath === "sw.js") {
        logger[type](...message);
      }
    };
    let esbuild: typeof import("esbuild");
    if (config.useNativeEsbuild) {
      log("info", "Using esbuild to bundle the service worker.");
      if (!esbuildNative)
        esbuildNative = import(/* webpackIgnore: true */ "esbuild");
      esbuild = await esbuildNative;
    } else {
      log("info", "Using esbuild-wasm to bundle the service worker.");
      if (!esbuildWasm)
        esbuildWasm = import(/* webpackIgnore: true */ "esbuild-wasm");
      esbuild = await esbuildWasm;
    }
    logSerwistResult(filePath, { count, size, warnings });
    const result = await build(esbuild, config, injectionPoint, manifestString);
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
  const GET = async (
    _: Request,
    { params }: { params: Promise<{ path: string }> },
  ) => {
    const { path: filePath } = await params;
    const config = await validation;
    if (DEV && config.rebuildOnChange) {
      const swContent = fs.readFileSync(config.swSrc, "utf-8");
      const currentHash = crypto
        .createHash("sha256")
        .update(swContent)
        .digest("hex");
      if (!map || lastHash !== currentHash) {
        map = await loadMap(filePath);
        lastHash = currentHash;
      }
    } else if (!map) map = await loadMap(filePath);
    return new NextResponse(map.get(path.join(config.cwd, filePath)), {
      headers: {
        "Content-Type":
          CONTENT_TYPE_MAP[path.extname(filePath)] || "text/plain",
        "Service-Worker-Allowed": "/",
      },
    });
  };
  return { dynamic, dynamicParams, revalidate, generateStaticParams, GET };
};

export const withSerwist = (nextConfig: NextConfig = {}): NextConfig => ({
  ...nextConfig,
  serverExternalPackages: [
    ...(nextConfig.serverExternalPackages ?? []),
    "esbuild",
    "esbuild-wasm",
  ],
});

export type * from "./types.js";
