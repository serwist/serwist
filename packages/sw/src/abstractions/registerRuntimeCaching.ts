import { registerRoute } from "../routing/registerRoute.js";

import type { RuntimeCaching } from "./types.js";

/**
 * Registers caching strategies to a singleton Router instance. It is a simple
 * syntatic sugar for `@serwist/sw/routing.registerRoute`.
 *
 * @see https://serwist.pages.dev/docs/sw/register-runtime-caching
 * @param runtimeCachingList
 * @returns
 */
export const registerRuntimeCaching = (...runtimeCachingList: RuntimeCaching[]): void => {
  for (const entry of runtimeCachingList) {
    registerRoute(entry.matcher, entry.handler, entry.method);
  }
};
