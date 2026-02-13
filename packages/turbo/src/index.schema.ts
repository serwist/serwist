import path from "node:path";
import { assertType, basePartial, type Equals, globPartial, injectPartial } from "@serwist/build/schema";
import semver from "semver";
import z from "zod";
import { SUPPORTED_ESBUILD_OPTIONS } from "./lib/constants.js";
import { NEXT_VERSION } from "./lib/logger.js";
import { generateGlobPatterns, loadNextConfig } from "./lib/utils.js";
import type { InjectManifestOptions, InjectManifestOptionsComplete, TurboPartial, TurboResolved } from "./types.js";

export const turboPartial = z.strictObject({
  cwd: z.string().prefault(process.cwd()),
  nextConfig: z
    .object({
      assetPrefix: z.string().optional(),
      basePath: z.string().optional(),
      distDir: z.string().optional(),
    })
    .optional(),
  useNativeEsbuild: z.boolean().prefault(process.platform === "win32"),
  esbuildOptions: z.partialRecord(z.literal(SUPPORTED_ESBUILD_OPTIONS), z.any()).prefault({}),
});

export const injectManifestOptions = z
  .strictObject({
    ...basePartial.shape,
    ...globPartial.shape,
    ...injectPartial.shape,
    ...turboPartial.shape,
    globPatterns: z.array(z.string()).optional(),
    globDirectory: z.string().optional(),
  })
  .omit({ disablePrecacheManifest: true })
  .transform(async (input) => {
    // TODO: remove in semver check in Serwist 10
    // webpackIgnore is only supported by Next.js 15 and above, but it is necessary
    // for loading `next/dist/server/config.js`.
    const nextConfig = semver.gte(NEXT_VERSION, "15.0.0")
      ? {
          ...(await loadNextConfig(input.cwd, process.env.NODE_ENV === "development")),
          ...input.nextConfig,
        }
      : {
          distDir: input.nextConfig?.distDir ?? ".next",
          basePath: input.nextConfig?.basePath ?? "/",
          assetPrefix: input.nextConfig?.assetPrefix ?? input.nextConfig?.basePath ?? "",
        };
    let distDir = nextConfig.distDir;
    if (distDir[0] === "/") distDir = distDir.slice(1);
    if (distDir[distDir.length - 1] !== "/") distDir += "/";
    return {
      ...input,
      swSrc: path.isAbsolute(input.swSrc) ? input.swSrc : path.join(input.cwd, input.swSrc),
      globPatterns: input.globPatterns ?? generateGlobPatterns(distDir),
      globDirectory: input.globDirectory ?? input.cwd,
      dontCacheBustURLsMatching: input.dontCacheBustURLsMatching ?? new RegExp(`^${distDir}static/`),
      nextConfig: {
        ...nextConfig,
        distDir,
        // Next.js, by default, set `basePath` to an empty string.
        basePath: nextConfig.basePath || "/",
      },
    };
  });

assertType<Equals<TurboPartial, z.input<typeof turboPartial>>>();
assertType<Equals<TurboResolved, z.output<typeof turboPartial>>>();
assertType<Equals<InjectManifestOptions, z.input<typeof injectManifestOptions>>>();
assertType<Equals<InjectManifestOptionsComplete, z.output<typeof injectManifestOptions>>>();
