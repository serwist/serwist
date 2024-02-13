import { logger } from "@serwist/core/internal";
import { registerRoute } from "@serwist/routing";

import type { RuntimeCaching } from "./types.js";

declare const self: ServiceWorkerGlobalScope;

/**
 * Registers caching strategies to a singleton Router instance. It is a simple
 * syntatic sugar for `@serwist/routing.registerRoute`.
 *
 * @see https://serwist.pages.dev/docs/sw/registerRuntimeCaching
 * @param runtimeCachingList
 * @returns
 */
export const registerRuntimeCaching = (...runtimeCachingList: RuntimeCaching[]): void => {
  if (!("__WB_FORCE_RUNTIME_CACHING" in globalThis)) {
    self.__WB_FORCE_RUNTIME_CACHING = false;
  }

  if (!self.__WB_FORCE_RUNTIME_CACHING && process.env.NODE_ENV !== "production") {
    logger.log("registerRuntimeCaching is disabled in development mode.");
  } else {
    for (const entry of runtimeCachingList) {
      registerRoute(entry.urlPattern, entry.handler, entry.method);
    }
  }
};
