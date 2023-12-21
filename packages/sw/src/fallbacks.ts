import type { RuntimeCaching } from "@serwist/build";
import type { HandlerDidErrorCallbackParam } from "@serwist/core";
import type { PrecacheRouteOptions } from "@serwist/precaching";
import { precacheAndRoute } from "@serwist/precaching";

export type FallbackMatcher = (_: HandlerDidErrorCallbackParam) => boolean;

export interface FallbackEntry {
  matcher: FallbackMatcher;
  url: URL | string;
  revision: string;
}

export interface FallbacksOptions {
  runtimeCaching: RuntimeCaching[];
  fallbackEntries: FallbackEntry[];
  fallbackEntriesPrecacheOptions?: PrecacheRouteOptions;
}

export const fallbacks = ({ runtimeCaching, fallbackEntries, fallbackEntriesPrecacheOptions }: FallbacksOptions) => {
  precacheAndRoute(
    fallbackEntries.map(({ url, revision }) => ({ url: typeof url === "string" ? url : url.toString(), revision })),
    fallbackEntriesPrecacheOptions
  );
  runtimeCaching = runtimeCaching.map((cacheEntry) => {
    if (!cacheEntry.options || cacheEntry.options.precacheFallback || cacheEntry.options.plugins?.some((plugin) => "handlerDidError" in plugin)) {
      return cacheEntry;
    }

    if (!cacheEntry.options.plugins) {
      cacheEntry.options.plugins = [];
    }

    cacheEntry.options.plugins.push({
      async handlerDidError(info) {
        for (const { matcher, url } of fallbackEntries) {
          if (matcher(info)) {
            return caches.match(url, {
              ignoreSearch: true,
            });
          }
        }
        return Response.error();
      },
    });

    return cacheEntry;
  });
  return runtimeCaching;
};
