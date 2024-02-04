import { z } from "zod";

import { manifestEntry } from "./manifestEntry.js";
import { manifestTransform } from "./manifestTransform.js";

export const basePartial = z
  .object({
    /**
     * A list of entries to be precached, in addition to any entries that are
     * generated as part of the build configuration.
     */
    additionalPrecacheEntries: z.array(z.union([z.string(), manifestEntry])).optional(),
    /**
     * Whether the precache manifest should be set to `undefined`. Essentially whether `@serwist/build` should
     * be disabled. Mostly useful when you want it to only check if the provided options are valid.
     * @default false
     */
    disablePrecacheManifest: z.boolean().default(false),
    /**
     * Assets that match this will be assumed to be uniquely versioned via their
     * URL, and exempted from the normal HTTP cache-busting that's done when
     * populating the precache. While not required, it's recommended that if your
     * existing build process already inserts a `[hash]` value into each filename,
     * you provide a RegExp that will detect that, as it will reduce the bandwidth
     * consumed when precaching.
     */
    dontCacheBustURLsMatching: z.instanceof(RegExp).optional(),
    /**
     * One or more functions which will be applied sequentially against the
     * generated manifest. If `modifyURLPrefix` or `dontCacheBustURLsMatching` are
     * also specified, their corresponding transformations will be applied first.
     */
    manifestTransforms: z.array(manifestTransform).optional(),
    /**
     * This value can be used to determine the maximum size of files that will be
     * precached. This prevents you from inadvertently precaching very large files
     * that might have accidentally matched one of your patterns.
     * @default 2097152
     */
    maximumFileSizeToCacheInBytes: z.number().default(2097152),
    /**
     * An object mapping string prefixes to replacement string values. This can be
     * used to, e.g., remove or add a path prefix from a manifest entry if your
     * web hosting setup doesn't match your local filesystem setup. As an
     * alternative with more flexibility, you can use the `manifestTransforms`
     * option and provide a function that modifies the entries in the manifest
     * using whatever logic you provide.
     *
     * Example usage:
     *
     * ```
     * // Replace a '/dist/' prefix with '/', and also prepend
     * // '/static' to every URL.
     * modifyURLPrefix: {
     *   '/dist/': '/',
     *   '': '/static',
     * }
     * ```
     */
    modifyURLPrefix: z.record(z.string(), z.string()).optional(),
  })
  .strict("Do not pass invalid properties to BasePartial!");
