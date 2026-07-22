// Workaround for Next.js + Turbopack, while plugins are still
// not supported. This relies on Next.js Route Handlers and file
// name determinism. This version is for when using `cacheComponents`.
import {
    type BuildResult as BaseBuildResult,
    getFileManifestEntries,
} from "@serwist/build";
import type { Message as EsbuildMessage } from "esbuild";
import { cyan, dim, yellow } from "kolorist";
import { NextResponse } from "next/server.js";
import path from "node:path";
import { build } from "./lib/build.js";
import { CONTENT_TYPE_MAP } from "./lib/constants.js";
import { logger } from "./lib/index.js";
import { validateInjectManifestOptions } from "./lib/validate.js";
import type { InjectManifestOptions } from "./types.js";

let esbuildWasm: Promise<typeof import("esbuild-wasm")> | null = null;
let esbuildNative: Promise<typeof import("esbuild")> | null = null;

const logSerwistResult = (
  buildResult: Pick<BaseBuildResult, "count" | "size" | "warnings">,
) => {
  const { count, size, warnings } = buildResult;
  const hasWarnings = warnings && warnings.length > 0;
  if (hasWarnings || count > 0) {
    logger[hasWarnings ? "warn" : "event"](
      `${cyan(count)} precache entries ${dim(`(${(size / 1024).toFixed(2)} KiB)`)}${
        hasWarnings
          ? `\n${yellow(["⚠ warnings", ...warnings.map((w) => `  ${w}`), ""].join("\n"))}`
          : ""
      }`,
    );
  }
};

export interface BuildResult extends Pick<
  BaseBuildResult,
  "count" | "size" | "warnings"
> {
  cwd: string;
  files: Map<string, string>;
  esbuild: {
    errors: EsbuildMessage[];
    warnings: EsbuildMessage[];
  };
}

/**
 * Builds necessary Serwist files to use with `createSerwistRoute`.
 * @param options Options for {@linkcode getFileManifestEntries}.
 */
export const serwist = async (
  options: InjectManifestOptions,
): Promise<BuildResult> => {
  const config = await validateInjectManifestOptions(options);
  const { count, size, manifestEntries, warnings } =
    await getFileManifestEntries(config);
  // See https://github.com/GoogleChrome/workbox/issues/2230
  const injectionPoint = config.injectionPoint || "";
  const manifestString =
    manifestEntries === undefined
      ? "undefined"
      : JSON.stringify(manifestEntries, null, 2);
  let esbuild: typeof import("esbuild");
  if (config.useNativeEsbuild) {
    if (!esbuildNative)
      esbuildNative = import(/* webpackIgnore: true */ "esbuild");
    esbuild = await esbuildNative;
  } else {
    if (!esbuildWasm)
      esbuildWasm = import(/* webpackIgnore: true */ "esbuild-wasm");
    esbuild = await esbuildWasm;
  }
  const result = await build(esbuild, config, injectionPoint, manifestString);
  return {
    cwd: config.cwd,
    files: new Map(result.outputFiles.map((e) => [e.path, e.text])),
    count,
    size,
    warnings,
    esbuild: {
      errors: result.errors,
      warnings: result.warnings,
    },
  };
};

/**
 * Creates a Route Handler for Serwist files.
 * @param serwistBuild A function that builds necessary Serwist files.
 */
export const createSerwistRoute = (
  serwistBuild: () => Promise<BuildResult>,
) => {
  // NOTE: ALL FILES MUST HAVE DETERMINISTIC NAMES. THIS IS BECAUSE
  // THE FOLLOWING MAP IS LOADED SEPARATELY FOR `generateStaticParams`
  // AND EVERY `GET` REQUEST TO EACH OF THE FILES.
  const generateStaticParams = async () => {
    const state = await serwistBuild();
    return [...state.files.keys()].map((e) => ({
      path: path.relative(state.cwd, e),
    }));
  };
  const GET = async (
    _: Request,
    { params }: { params: Promise<{ path: string }> },
  ) => {
    // let hash = "";
    const { path: filePath } = await params;
    const state = await serwistBuild();
    // if (DEV && options.rebuildOnChange) {
    //   const swContent = readFileSync(options.swSrc, "utf-8");
    //   hash = createHash("sha256").update(swContent).digest("hex");
    // }
    // The route is reinitiated for each `path` param, so we only log results
    // if we're prerendering for sw.js.
    if (filePath === "sw.js") {
      logSerwistResult(state);
      if (state.esbuild.warnings.length) {
        console.warn(state.esbuild.warnings);
      }
    }
    return new NextResponse(state.files.get(path.join(state.cwd, filePath)), {
      headers: {
        "Content-Type":
          CONTENT_TYPE_MAP[path.extname(filePath)] || "text/plain",
        "Service-Worker-Allowed": "/",
      },
    });
  };
  return { generateStaticParams, GET };
};

export type * from "./types.js";
