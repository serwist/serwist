import type { QueueOptions } from "@serwist/background-sync";
import type { BroadcastCacheUpdateOptions } from "@serwist/broadcast-update";
import type { CacheableResponseOptions } from "@serwist/cacheable-response";
import type { RouteHandler, RouteMatchCallback, SerwistPlugin } from "@serwist/core";
import type { ExpirationPluginOptions } from "@serwist/expiration";
import type { HTTPMethod } from "@serwist/routing";

export type StrategyName = "CacheFirst" | "CacheOnly" | "NetworkFirst" | "NetworkOnly" | "StaleWhileRevalidate";

export interface RuntimeCaching {
  /**
   * This determines how the runtime route will generate a response.
   * To use one of the built-in `@serwist/strategies`, provide its name,
   * like `'NetworkFirst'`.
   * Alternatively, this can be a `@serwist/core.RouteHandler` callback
   * function with custom response logic.
   */
  handler: RouteHandler | StrategyName;
  /**
   * The HTTP method to match against. The default value of `'GET'` is normally
   * sufficient, unless you explicitly need to match `'POST'`, `'PUT'`, or
   * another type of request.
   * @default "GET"
   */
  method?: HTTPMethod;
  options?: {
    /**
     * Configuring this will add a
     * `@serwist/background-sync.BackgroundSyncPlugin` instance to the
     * `@serwist/strategies` configured in `handler`.
     */
    backgroundSync?: {
      name: string;
      options?: QueueOptions;
    };
    /**
     * Configuring this will add a
     * `@serwist/broadcast-update.BroadcastUpdatePlugin` instance to the
     * `@serwist/strategies` configured in `handler`.
     */
    broadcastUpdate?: {
      // TODO: This option is ignored since we switched to using postMessage().
      // Remove it in the next major release.
      channelName?: string;
      options: BroadcastCacheUpdateOptions;
    };
    /**
     * Configuring this will add a
     * `@serwist/cacheable-response.CacheableResponsePlugin` instance to
     * the `@serwist/strategies` configured in `handler`.
     */
    cacheableResponse?: CacheableResponseOptions;
    /**
     * If provided, this will set the `cacheName` property of the
     * `@serwist/strategies` configured in `handler`.
     */
    cacheName?: string | null;
    /**
     * Configuring this will add a
     * `@serwist/expiration.ExpirationPlugin` instance to
     * the `@serwist/strategies` configured in `handler`.
     */
    expiration?: ExpirationPluginOptions;
    /**
     * If provided, this will set the `networkTimeoutSeconds` property of the
     * `@serwist/strategies` configured in `handler`. Note that only
     * `'NetworkFirst'` and `'NetworkOnly'` support `networkTimeoutSeconds`.
     */
    networkTimeoutSeconds?: number;
    /**
     * Configuring this allows the use of one or more Serwist plugins that
     * don't have "shortcut" options (like `expiration` for
     * `@serwist/expiration.ExpirationPlugin`). The plugins provided here
     * will be added to the `@serwist/strategies` configured in `handler`.
     */
    plugins?: SerwistPlugin[];
    /**
     * Configuring this will add a
     * `@serwist/precaching.PrecacheFallbackPlugin` instance to
     * the `@serwist/strategies` configured in `handler`.
     */
    precacheFallback?: {
      fallbackURL: string;
    };
    /**
     * Enabling this will add a
     * `@serwist/range-requests.RangeRequestsPlugin` instance to
     * the `@serwist/strategies` configured in `handler`.
     */
    rangeRequests?: boolean;
    /**
     * Configuring this will pass along the `fetchOptions` value to
     * the `@serwist/strategies` configured in `handler`.
     */
    fetchOptions?: RequestInit;
    /**
     * Configuring this will pass along the `matchOptions` value to
     * the `@serwist/strategies` configured in `handler`.
     */
    matchOptions?: CacheQueryOptions;
  };
  /**
   * This match criteria determines whether the configured handler will
   * generate a response for any requests that don't match one of the precached
   * URLs. If multiple `RuntimeCaching` routes are defined, then the first one
   * whose `urlPattern` matches will be the one that responds.
   *
   * This value directly maps to the first parameter passed to
   * `@serwist/routing.registerRoute`. It's recommended to use a
   * `@serwist/core.RouteMatchCallback` function for greatest flexibility.
   */
  urlPattern: RegExp | string | RouteMatchCallback;
}
