import { BackgroundSyncPlugin } from "@serwist/background-sync";
import { BroadcastUpdatePlugin } from "@serwist/broadcast-update";
import type { RuntimeCaching, StrategyName } from "@serwist/build";
import { CacheableResponsePlugin } from "@serwist/cacheable-response";
import { nonNullable } from "@serwist/core";
import { ExpirationPlugin } from "@serwist/expiration";
import { PrecacheFallbackPlugin } from "@serwist/precaching";
import { RangeRequestsPlugin } from "@serwist/range-requests";
import { registerRoute } from "@serwist/routing";
import { CacheFirst, CacheOnly, NetworkFirst, NetworkOnly, StaleWhileRevalidate } from "@serwist/strategies";

const HANDLER_NAME_TO_METHOD = {
  CacheFirst,
  CacheOnly,
  NetworkFirst,
  NetworkOnly,
  StaleWhileRevalidate,
} satisfies Record<StrategyName, unknown>;

export const registerRuntimeCaching = (...runtimeCachingList: RuntimeCaching[]) => {
  for (const rcEntry of runtimeCachingList) {
    if (typeof rcEntry.handler === "string") {
      const {
        cacheName,
        networkTimeoutSeconds,
        fetchOptions,
        matchOptions,
        plugins,
        backgroundSync,
        broadcastUpdate,
        cacheableResponse,
        expiration,
        precacheFallback,
        rangeRequests,
      } = rcEntry.options!; // entry.options is always defined when entry.handler is of type 'string'.
      const Handler = HANDLER_NAME_TO_METHOD[rcEntry.handler];
      registerRoute(
        rcEntry.urlPattern,
        new Handler({
          cacheName: cacheName ?? undefined,
          networkTimeoutSeconds,
          fetchOptions,
          matchOptions,
          plugins: [
            ...(plugins ?? []),
            backgroundSync && new BackgroundSyncPlugin(backgroundSync.name, backgroundSync.options),
            broadcastUpdate &&
              new BroadcastUpdatePlugin({
                // @ts-expect-error weird...
                channelName: broadcastUpdate.channelName,
                ...broadcastUpdate.options,
              }),
            cacheableResponse && new CacheableResponsePlugin(cacheableResponse),
            expiration && new ExpirationPlugin(expiration),
            precacheFallback && new PrecacheFallbackPlugin(precacheFallback),
            rangeRequests ? new RangeRequestsPlugin() : undefined,
          ].filter(nonNullable),
        })
      );
    } else {
      registerRoute(rcEntry.urlPattern, rcEntry.handler, rcEntry.method);
    }
  }
};
