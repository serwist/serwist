import path from "node:path";
import { type BuildResult, getFileManifestEntries, rebasePath } from "@serwist/build";
import { SerwistConfigError, validationErrorMap } from "@serwist/build/schema";
import { cyan, dim, yellow } from "kolorist";
import { NextResponse } from "next/server.js";
import { z } from "zod";
import { injectManifestOptions } from "./index.schema.js";
import { logger } from "./lib/index.js";
import type { InjectManifestOptions, InjectManifestOptionsComplete } from "./types.js";

// TODO(workarond): `esbuild` doesn't load when in Turbopack production
const esbuild = import("esbuild-wasm");

const logSerwistResult = (filePath: string, buildResult: Pick<BuildResult, "count" | "size" | "warnings">) => {
  const { count, size, warnings } = buildResult;
  const hasWarnings = warnings && warnings.length > 0;
  // The route is reinitiated for each `path` param, so we only log results
  // if we're prerendering for sw.js.
  if (filePath === "sw.js") {
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
    // Make sure we leave swSrc out of the precache manifest.
    config.globIgnores.push(
      rebasePath({
        file: config.swSrc,
        baseDirectory: config.globDirectory,
      }),
    );
    if (!config.manifestTransforms) {
      config.manifestTransforms = [];
    }
    config.manifestTransforms.push((manifestEntries) => {
      const manifest = manifestEntries.map((m) => {
        // Replace all references to .next/ with "/_next/".
        if (m.url.startsWith(".next/")) m.url = `/_next/${m.url.slice(6)}`;
        // Replace all references to public/ with "$(basePath)/".
        if (m.url.startsWith("public/")) m.url = path.posix.join(config.basePath, m.url.slice(7));
        return m;
      });
      return { manifest, warnings: [] };
    });
    return config;
  });
  const generateStaticParams = () => {
    return [{ path: "sw.js" }, { path: "sw.js.map" }];
  };
  let map: Map<string, string> | null = null;
  const loadMap = async (filePath: string) => {
    const config = await validation;
    const { count, size, manifestEntries, warnings } = await getFileManifestEntries({
      ...config,
      disablePrecacheManifest: process.env.NODE_ENV === "development",
    });
    // See https://github.com/GoogleChrome/workbox/issues/2230
    const injectionPoint = config.injectionPoint ? config.injectionPoint : "";
    const manifestString = manifestEntries === undefined ? "undefined" : JSON.stringify(manifestEntries, null, 2);
    logSerwistResult(filePath, { count, size, warnings });
    const result = await (await esbuild).build({
      entryPoints: [{ in: config.swSrc, out: "sw" }],
      format: "esm",
      sourcemap: true,
      bundle: true,
      write: false,
      minify: !isDev,
      define: injectionPoint
        ? {
            [injectionPoint]: manifestString,
          }
        : undefined,
      outdir: process.cwd(),
      entryNames: "[name]",
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
  const GET = async (_: Request, { params }: { params: Promise<{ path: string }> }) => {
    // TODO: obviously, files get stale in development when we pull this off.
    const { path: filePath } = await params;
    if (!map) map = await loadMap(filePath);
    return new NextResponse(map.get(path.join(process.cwd(), filePath)), {
      headers: {
        "Content-Type": contentTypeMap[path.extname(filePath)] || "text/plain",
        "Service-Worker-Allowed": "/",
      },
    });
  };
  return { dynamic, dynamicParams, revalidate, generateStaticParams, GET };
};
