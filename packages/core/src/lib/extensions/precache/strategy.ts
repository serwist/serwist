import { getFriendlyURL, logger, privateCacheNames, SerwistError } from "$index.internal";
import { createStrategy, type StrategyOptions } from "$lib/strategies/core.js";
import { cacheMatch, cachePut, fetch, getCacheKey, getPreloadResponse, type StrategyHandler } from "$lib/strategies/handler.js";
import type { StrategyPlugin } from "$lib/types.js";
import { copyResponse } from "$lib/utils.js";

export const defaultPrecacheCacheabilityPlugin: StrategyPlugin = {
  async cacheWillUpdate({ response }) {
    if (!response || response.status >= 400) {
      return null;
    }

    return response;
  },
};

export const copyRedirectedCacheableResponsesPlugin: StrategyPlugin = {
  async cacheWillUpdate({ response }) {
    return response.redirected ? await copyResponse(response) : response;
  },
};

export interface PrecacheStrategyOptions extends StrategyOptions {
  /**
   * Plugins to use when precaching as well as responding to `fetch` events for precached assets.
   */
  plugins?: StrategyOptions["plugins"];
  /**
   * Whether to attempt to get the response from the network
   * if there's a precache miss.
   */
  fallbackToNetwork?: boolean;
}

/**
 * A {@linkcode createStrategy} implementation specifically designed to both cache
 * and fetch precached assets.
 *
 * Note: an instance of this class is created automatically when creating a
 * {@linkcode Serwist} instance; it's generally not necessary to create this yourself.
 */
export const precacheStrategy = (options: PrecacheStrategyOptions = {}) => {
  options.cacheName = privateCacheNames.getPrecacheName(options.cacheName);

  const fallbackToNetwork = options.fallbackToNetwork !== false;

  const strategy = createStrategy(options, async (request, handler) => {
    const preloadResponse = await getPreloadResponse(handler);

    if (preloadResponse) {
      return preloadResponse;
    }

    const response = await cacheMatch(handler, request);

    if (response) {
      return response;
    }

    // If this is an `install` event for an entry that isn't already cached,
    // then populate the cache.
    if (handler.event && handler.event.type === "install") {
      return await handleInstall(request, handler);
    }

    // Getting here means something went wrong. An entry that should have been
    // precached wasn't found in the cache.
    return await handleFetch(request, handler);
  });

  const handleInstall = async (request: Request, handler: StrategyHandler) => {
    useDefaultCacheabilityPluginIfNeeded();

    const response = await fetch(handler, request);

    // Make sure we defer cachePut() until after we know the response
    // should be cached; see https://github.com/GoogleChrome/workbox/issues/2737
    const wasCached = await cachePut(handler, request, response.clone());

    if (!wasCached) {
      // Throwing here will lead to the `install` handler failing, which
      // we want to do if *any* of the responses aren't safe to cache.
      throw new SerwistError("bad-precaching-response", {
        url: request.url,
        status: response.status,
      });
    }

    return response;
  };

  const handleFetch = async (request: Request, handler: StrategyHandler): Promise<Response> => {
    let response: Response | undefined;

    const params = (handler.params || {}) as {
      cacheKey?: string;
      integrity?: string;
    };

    // Fallback to the network if we're configured to do so.
    if (fallbackToNetwork) {
      if (process.env.NODE_ENV !== "production") {
        logger.warn(
          `The precached response for ${getFriendlyURL(request.url)} in ${handler.strategy.cacheName} was not found. Falling back to the network.`,
        );
      }

      const integrityInManifest = params.integrity;
      const integrityInRequest = request.integrity;
      const noIntegrityConflict = !integrityInRequest || integrityInRequest === integrityInManifest;

      // Do not add integrity if the original request is no-cors
      // See https://github.com/GoogleChrome/workbox/issues/3096
      response = await fetch(
        handler,
        new Request(request, {
          integrity: request.mode !== "no-cors" ? integrityInRequest || integrityInManifest : undefined,
        }),
      );

      // It's only "safe" to repair the cache if we're using SRI to guarantee
      // that the response matches the precache manifest's expectations,
      // and there's either a) no integrity property in the incoming request
      // or b) there is an integrity, and it matches the precache manifest.
      // See https://github.com/GoogleChrome/workbox/issues/2858
      // Also if the original request users no-cors we don't use integrity.
      // See https://github.com/GoogleChrome/workbox/issues/3096
      if (integrityInManifest && noIntegrityConflict && request.mode !== "no-cors") {
        useDefaultCacheabilityPluginIfNeeded();
        const wasCached = await cachePut(handler, request, response.clone());
        if (process.env.NODE_ENV !== "production") {
          if (wasCached) {
            logger.log(`A response for ${getFriendlyURL(request.url)} was used to "repair" the precache.`);
          }
        }
      }
    } else {
      // This shouldn't normally happen, but there are edge cases:
      // https://github.com/GoogleChrome/workbox/issues/1441
      throw new SerwistError("missing-precache-entry", {
        cacheName: handler.strategy.cacheName,
        url: request.url,
      });
    }

    if (process.env.NODE_ENV !== "production") {
      const cacheKey = params.cacheKey || (await getCacheKey(handler, request, "read"));

      // Serwist is going to handle the route.
      // print the routing details to the console.
      logger.groupCollapsed(`Precaching is responding to: ${getFriendlyURL(request.url)}`);
      logger.log(`Serving the precached url: ${getFriendlyURL(cacheKey instanceof Request ? cacheKey.url : cacheKey)}`);

      logger.groupCollapsed("View request details here.");
      logger.log(request);
      logger.groupEnd();

      logger.groupCollapsed("View response details here.");
      logger.log(response);
      logger.groupEnd();

      logger.groupEnd();
    }

    return response;
  };

  /**
   * This method is complex, as there a number of things to account for:
   *
   * The `plugins` array can be set at construction, and/or it might be added to
   * to at any time before the strategy is used.
   *
   * At the time the strategy is used (i.e. during an `install` event), there
   * needs to be at least one plugin that implements `cacheWillUpdate` in the
   * array, other than `copyRedirectedCacheableResponsesPlugin`.
   *
   * - If this method is called and there are no suitable `cacheWillUpdate`
   * plugins, we need to add `defaultPrecacheCacheabilityPlugin`.
   *
   * - If this method is called and there is exactly one `cacheWillUpdate`, then
   * we don't have to do anything (this might be a previously added
   * `defaultPrecacheCacheabilityPlugin`, or it might be a custom plugin).
   *
   * - If this method is called and there is more than one `cacheWillUpdate`,
   * then we need to check if one is `defaultPrecacheCacheabilityPlugin`. If so,
   * we need to remove it. (This situation is unlikely, but it could happen if
   * the strategy is used multiple times, the first without a `cacheWillUpdate`,
   * and then later on after manually adding a custom `cacheWillUpdate`.)
   *
   * See https://github.com/GoogleChrome/workbox/issues/2737 for more context.
   *
   * @private
   */
  const useDefaultCacheabilityPluginIfNeeded = (): void => {
    let defaultPluginIndex: number | null = null;
    let cacheWillUpdatePluginCount = 0;

    for (const [index, plugin] of strategy.plugins.entries()) {
      // Ignore the copy redirected plugin when determining what to do.
      if (plugin === copyRedirectedCacheableResponsesPlugin) {
        continue;
      }

      // Save the default plugin's index, in case it needs to be removed.
      if (plugin === defaultPrecacheCacheabilityPlugin) {
        defaultPluginIndex = index;
      }

      if (plugin.cacheWillUpdate) {
        cacheWillUpdatePluginCount++;
      }
    }

    if (cacheWillUpdatePluginCount === 0) {
      strategy.plugins.push(defaultPrecacheCacheabilityPlugin);
    } else if (cacheWillUpdatePluginCount > 1 && defaultPluginIndex !== null) {
      // Only remove the default plugin; multiple custom plugins are allowed.
      strategy.plugins.splice(defaultPluginIndex, 1);
    }
    // Nothing needs to be done if cacheWillUpdatePluginCount is 1
  };

  // Redirected responses cannot be used to satisfy a navigation request, so
  // any redirected response must be "copied" rather than cloned, so the new
  // response doesn't contain the `redirected` flag. See:
  // https://bugs.chromium.org/p/chromium/issues/detail?id=669363&desc=2#c1
  strategy.plugins.push(copyRedirectedCacheableResponsesPlugin);

  return strategy;
};
