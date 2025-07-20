import path from "node:path";
import { getFileManifestEntries, type BuildResult, type InjectManifestOptions, rebasePath, type InjectManifestOptionsComplete } from "@serwist/build";
import { basePartial, injectPartial, globPartial, requiredGlobDirectoryPartial, SerwistConfigError, validationErrorMap } from "@serwist/build/schema";
import { z } from "zod";
import { NextResponse } from "next/server.js";
import { cyan, dim, yellow } from "kolorist";
import { logger } from "./lib/index.js";

// TODO: doesn't load when in Turbopack production
const esbuild = import("esbuild");
// const esbuild = Promise.resolve({
// 	build: (opts: any) => ({
// 		errors: [],
// 		warnings: [],
// 		outputFiles: [{ path: "", contents: "", hash: "", text: "" }],
// 	}),
// });

const logSerwistResult = (buildResult: Pick<BuildResult, "count" | "size" | "warnings">) => {
  const { count, size, warnings } = buildResult;
  const hasWarnings = warnings && warnings.length > 0;
  if (count > 0 || hasWarnings) {
    logger[hasWarnings ? "warn" : "info"](
      `${cyan(count)} precache entries ${dim(`(${(size / 1024).toFixed(2)} KiB)`)}${
        hasWarnings ? `\n${yellow(["⚠ warnings", ...warnings.map((w) => `  ${w}`), ""].join("\n"))}` : ""
      }`,
    );
  }
};

const injectManifestOptions = z
  .strictObject({
    ...basePartial.shape,
    ...globPartial.shape,
    ...injectPartial.shape,
    ...requiredGlobDirectoryPartial.shape,
  })
  .omit({ disablePrecacheManifest: true });

const validateGetManifestOptions = async (input: unknown): Promise<Omit<InjectManifestOptionsComplete, "swDest" | "disablePrecacheManifest">> => {
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

export type ServiceWorkerOptions = Omit<InjectManifestOptions, "swDest">;

/**
 * Creates a Route Handler that returns the precache manifest.
 * @param options Options for {@linkcode getFileManifestEntries}.
 */
export const createSerwistRoute = (options: ServiceWorkerOptions) => {
  const validation = validateGetManifestOptions(options).then((config) => {
    // Make sure we leave swSrc out of the precache manifest.
    config.globIgnores.push(
      rebasePath({
        file: config.swSrc,
        baseDirectory: config.globDirectory,
      }),
    );
    return config;
  });
  let map: Map<string, string> | null = null;
  const generateStaticParams = () => {
    return [{ path: "sw.js" }, { path: "sw.js.map" }];
  };
  const loadMap = async () => {
    const config = await validation;
    const { count, size, manifestEntries, warnings } = await getFileManifestEntries({
      ...config,
      disablePrecacheManifest: process.env.NODE_ENV === "development",
    });
    // See https://github.com/GoogleChrome/workbox/issues/2230
    const injectionPoint = options.injectionPoint ? options.injectionPoint : "";
    const manifestString = manifestEntries === undefined ? "undefined" : JSON.stringify(manifestEntries);
    logSerwistResult({ count, size, warnings });
    const result = await (await esbuild).build({
      entryPoints: [options.swSrc],
      sourcemap: true,
      bundle: true,
      write: false,
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
    if (!map) map = await loadMap();
    const { path: filePath } = await params;
    return new NextResponse(map.get(path.join(process.cwd(), filePath)), {
      headers: {
        "Content-Type": "application/javascript",
      },
    });
  };
  return { generateStaticParams, GET };
};
