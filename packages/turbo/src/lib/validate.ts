import { rebasePath } from "@serwist/build";
import { SerwistConfigError, validationErrorMap } from "@serwist/build/schema";
import path from "node:path";
import { z } from "zod";
import { injectManifestOptions } from "../index.schema.js";
import type { InjectManifestOptionsComplete } from "../types.js";
import { DEV } from "./constants.js";

export const validateInjectManifestOptions = async (input: unknown): Promise<InjectManifestOptionsComplete> => {
  const result = await injectManifestOptions.spa(input, {
    error: validationErrorMap,
  });
  if (!result.success) {
    throw new SerwistConfigError({
      moduleName: "@serwist/turbopack",
      message: z.prettifyError(result.error),
    });
  }
  const config = result.data;
  return {
    ...config,
    additionalPrecacheEntries: DEV ? [] : config.additionalPrecacheEntries,
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
            m.url = `${config.nextConfig.assetPrefix}/_next/${m.url.slice(config.nextConfig.distDir.length)}`;
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
};
