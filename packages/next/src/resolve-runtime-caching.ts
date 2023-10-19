import type { RuntimeCaching } from "@serwist/build";

import { logger } from "$utils/index.js";

import defaultCache from "./cache.js";

export const resolveRuntimeCaching = (
  userSpecifiedRuntimeCaching: RuntimeCaching[] | undefined,
  shouldExtendDefaultCache: boolean
) => {
  if (!userSpecifiedRuntimeCaching) {
    return defaultCache;
  }
  if (!shouldExtendDefaultCache) {
    logger.info(
      "Custom runtimeCaching array found, using it instead of the default one."
    );
    return userSpecifiedRuntimeCaching;
  }
  logger.info(
    "Custom runtimeCaching array found, using it to extend the default one."
  );
  const runtimeCaching: RuntimeCaching[] = [];
  const runtimeCachingKeys = new Set<string>();
  for (const entry of userSpecifiedRuntimeCaching) {
    runtimeCaching.push(entry);
    entry.options?.cacheName && runtimeCachingKeys.add(entry.options.cacheName);
  }
  for (const entry of defaultCache) {
    if (
      !entry.options?.cacheName ||
      !runtimeCachingKeys.has(entry.options.cacheName)
    ) {
      runtimeCaching.push(entry);
    }
  }
  return runtimeCaching;
};
