import { BackgroundSyncPlugin } from "@serwist/background-sync";
import { BroadcastUpdatePlugin } from "@serwist/broadcast-update";
import { CacheableResponsePlugin } from "@serwist/cacheable-response";
import { logger } from "@serwist/core/internal";
import { ExpirationPlugin } from "@serwist/expiration";
import { PrecacheFallbackPlugin } from "@serwist/precaching";
import { RangeRequestsPlugin } from "@serwist/range-requests";
import { registerRoute } from "@serwist/routing";
import { CacheFirst, CacheOnly, NetworkFirst, NetworkOnly, StaleWhileRevalidate } from "@serwist/strategies";
import { nonNullable } from "@serwist/utils";

import type { RuntimeCaching, StrategyName } from "./types.js";

declare const self: ServiceWorkerGlobalScope;

const HANDLER_NAME_TO_METHOD = {
  CacheFirst,
  CacheOnly,
  NetworkFirst,
  NetworkOnly,
  StaleWhileRevalidate,
} satisfies Record<StrategyName, unknown>;

export const registerRuntimeCaching = (...runtimeCachingList: RuntimeCaching[]) => {
  if (!("__WB_FORCE_RUNTIME_CACHING" in globalThis)) {
    self.__WB_FORCE_RUNTIME_CACHING = false;
  }

  if (!self.__WB_FORCE_RUNTIME_CACHING && process.env.NODE_ENV !== "production") {
    logger.info("registerRuntimeCaching is disabled in development mode.");
    return;
  }

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
        }),
        rcEntry.method,
      );
    } else {
      registerRoute(rcEntry.urlPattern, rcEntry.handler, rcEntry.method);
    }
  }
};
