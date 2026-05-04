import type { RuntimeCaching } from "$lib/types.js";
import { registerRoute } from "./register-route.js";

/**
 * Registers caching strategies to a singleton Router instance. It is a simple
 * syntatic sugar for {@linkcode registerRoute}.
 *
 * @param runtimeCachingList
 * @returns
 * @deprecated
 */
export const registerRuntimeCaching = (...runtimeCachingList: RuntimeCaching[]): void => {
  for (const entry of runtimeCachingList) {
    registerRoute(entry.matcher, entry.handler, entry.method);
  }
};
