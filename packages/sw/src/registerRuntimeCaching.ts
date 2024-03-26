import { registerRoute } from "@serwist/routing";

import type { RuntimeCaching } from "./types.js";

/**
 * Registers caching strategies to a singleton Router instance. It is a simple
 * syntatic sugar for `@serwist/routing.registerRoute`.
 *
 * @see https://serwist.pages.dev/docs/sw/registerRuntimeCaching
 * @param runtimeCachingList
 * @returns
 */
export const registerRuntimeCaching = (...runtimeCachingList: RuntimeCaching[]): void => {
  for (const entry of runtimeCachingList) {
    registerRoute(entry.matcher, entry.handler, entry.method);
  }
};
