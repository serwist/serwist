import type { RuntimeCaching } from "@serwist/build";
import type { HandlerDidErrorCallbackParam } from "@serwist/core";
import type { PrecacheRouteOptions } from "@serwist/precaching";
import { precacheAndRoute } from "@serwist/precaching";

export type FallbackMatcher = (_: HandlerDidErrorCallbackParam) => boolean;

export interface FallbackEntry {
  /**
   * The matcher, which checks whether the fallback entry can be used
   * for a Request.
   */
  matcher: FallbackMatcher;
  /**
   * The fallback URL.
   */
  url: URL | string;
  /**
   * The revision used for precaching.
   */
  revision: string;
  /**
   * How the Response in the cache should be matched.
   *
   * @default
   * { ignoreSearch: true }
   */
  cacheMatchOptions?: MultiCacheQueryOptions;
}

export interface FallbacksOptions {
  runtimeCaching: RuntimeCaching[];
  entries: FallbackEntry[];
  precacheOptions?: PrecacheRouteOptions;
}

export const fallbacks = ({ runtimeCaching, entries, precacheOptions }: FallbacksOptions) => {
  precacheAndRoute(
    entries.map(({ url, revision }) => ({ url: typeof url === "string" ? url : url.toString(), revision })),
    precacheOptions
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
        for (const { matcher, url, cacheMatchOptions = { ignoreSearch: true } } of entries) {
          if (matcher(info)) {
            return caches.match(url, cacheMatchOptions);
          }
        }
        return Response.error();
      },
    });

    return cacheEntry;
  });
  return runtimeCaching;
};
