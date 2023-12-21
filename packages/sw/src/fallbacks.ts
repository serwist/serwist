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
  entries: FallbackEntry[];
  precacheOptions?: PrecacheRouteOptions;
  matchOptions?: MultiCacheQueryOptions;
}

export const fallbacks = ({ runtimeCaching, entries, precacheOptions, matchOptions = { ignoreSearch: true } }: FallbacksOptions) => {
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
        for (const { matcher, url } of entries) {
          if (matcher(info)) {
            return caches.match(url, matchOptions);
          }
        }
        return Response.error();
      },
    });

    return cacheEntry;
  });
  return runtimeCaching;
};
