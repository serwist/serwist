import type { RuntimeCaching } from "../types.js";
import { registerRoute } from "./registerRoute.js";

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
