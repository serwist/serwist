import { z } from "zod";

export const globPartial = z
  .object({
    /**
     * Determines whether or not symlinks are followed when generating the
     * precache manifest. For more information, see the definition of `follow` in
     * [`glob`'s documentation](https://github.com/isaacs/node-glob#options).
     * @default true
     */
    globFollow: z.boolean().default(true),
    /**
     * A set of patterns matching files to always exclude when generating the
     * precache manifest. For more information, see the definition of `ignore` in
     * [`glob`'s documentation](https://github.com/isaacs/node-glob#options).
     * @default
     * ```
     * ["**\/node_modules\/**\/*"]
     * ```
     */
    globIgnores: z.array(z.string()).default(["**/node_modules/**/*"]),
    /**
     * Files matching any of these patterns will be included in the precache
     * manifest. For more information, see
     * [`glob`'s Glob Primer](https://github.com/isaacs/node-glob#glob-primer).
     * @default
     * ```
     * ["**\/*.{js,css,html}"]
     * ```
     */
    globPatterns: z.array(z.string()).default(["**/*.{js,css,html}"]),
    /**
     * If true, an error reading a directory when generating a precache manifest
     * will cause the build to fail. If false, the problematic directory will be
     * skipped. For more information, see the definition of `strict` in
     * [`glob`'s documentation](https://github.com/isaacs/node-glob#options).
     * @default true
     */
    globStrict: z.boolean().default(true),
    /**
     * If a URL is rendered based on some server-side logic, its contents may
     * depend on multiple files or on some other unique string value. The keys in
     * this object are server-rendered URLs. If the values are an array of
     * strings, they will be interpreted as `glob` patterns, and the contents of
     * any files matching the patterns will be used to uniquely version the URL.
     * If used with a single string, it will be interpreted as unique versioning
     * information that you've generated for a given URL.
     */
    templatedURLs: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional(),
  })
  .strict("Do not pass invalid properties to GlobPartial!");

export const optionalGlobDirectoryPartial = z
  .object({
    /**
     * The local directory you wish to match `globPatterns` against. The path is
     * relative to the current directory.
     */
    globDirectory: z.string().optional(),
  })
  .strict("Do not pass invalid properties to OptionalGlobDirectoryPartial!");

// This needs to be set when using GetManifest or InjectManifest. This is
// enforced via runtime validation, and needs to be documented.
export const requiredGlobDirectoryPartial = optionalGlobDirectoryPartial
  .required()
  .strict("Do not pass invalid properties to RequiredGlobDirectoryPartial!");
