import path from "node:path";
import { assertType, basePartial, type Equals, globPartial, injectPartial } from "@serwist/build/schema";
import z from "zod";
import { SUPPORTED_ESBUILD_OPTIONS } from "./lib/constants.js";
import { generateGlobPatterns } from "./lib/utils.js";
import type { InjectManifestOptions, InjectManifestOptionsComplete, TurboPartial, TurboResolved } from "./types.js";

export const turboPartial = z.strictObject({
  cwd: z.string().prefault(process.cwd()),
  nextConfig: z.strictObject({
    assetPrefix: z.string().optional(),
    basePath: z.string().prefault("/"),
    distDir: z.string().prefault(".next"),
  }),
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
  .transform((input) => {
    let distDir = input.nextConfig.distDir;
    if (distDir[0] === "/") distDir = distDir.slice(1);
    if (distDir[distDir.length - 1] !== "/") distDir += "/";
    return {
      ...input,
      swSrc: path.isAbsolute(input.swSrc) ? input.swSrc : path.join(input.cwd, input.swSrc),
      globPatterns: input.globPatterns ?? generateGlobPatterns(distDir),
      globDirectory: input.globDirectory ?? input.cwd,
      dontCacheBustURLsMatching: input.dontCacheBustURLsMatching ?? new RegExp(`^${distDir}static/`),
      nextConfig: {
        ...input.nextConfig,
        distDir,
      },
    };
  });

assertType<Equals<TurboPartial, z.input<typeof turboPartial>>>();
assertType<Equals<TurboResolved, z.output<typeof turboPartial>>>();
assertType<Equals<InjectManifestOptions, z.input<typeof injectManifestOptions>>>();
assertType<Equals<InjectManifestOptionsComplete, z.output<typeof injectManifestOptions>>>();
