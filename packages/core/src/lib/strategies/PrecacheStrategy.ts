/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { copyResponse } from "../../copyResponse.js";
import type { SerwistPlugin } from "../../types.js";
import { SerwistError } from "../../utils/SerwistError.js";
import { cacheNames as privateCacheNames } from "../../utils/cacheNames.js";
import { getFriendlyURL } from "../../utils/getFriendlyURL.js";
import { logger } from "../../utils/logger.js";
import type { StrategyOptions } from "./Strategy.js";
import { Strategy } from "./Strategy.js";
import type { StrategyHandler } from "./StrategyHandler.js";

interface PrecacheStrategyOptions extends StrategyOptions {
  /**
   * Whether to attempt to get the response from the network
   * if there's a precache miss.
   */
  fallbackToNetwork?: boolean;
}

/**
 * A `serwist/strategies.Strategy` implementation
 * specifically designed to both cache and fetch precached assets.
 *
 * Note: an instance of this class is created automatically when creating a
 * `Serwist` instance; it's generally not necessary to create this yourself.
 */
export class PrecacheStrategy extends Strategy {
  private readonly _fallbackToNetwork: boolean;

  static readonly defaultPrecacheCacheabilityPlugin: SerwistPlugin = {
    async cacheWillUpdate({ response }) {
      if (!response || response.status >= 400) {
        return null;
      }

      return response;
    },
  };

  static readonly copyRedirectedCacheableResponsesPlugin: SerwistPlugin = {
    async cacheWillUpdate({ response }) {
      return response.redirected ? await copyResponse(response) : response;
    },
  };

  /**
   * @param options
   */
  constructor(options: PrecacheStrategyOptions = {}) {
    options.cacheName = privateCacheNames.getPrecacheName(options.cacheName);

    super(options);

    this._fallbackToNetwork = options.fallbackToNetwork === false ? false : true;

    // Redirected responses cannot be used to satisfy a navigation request, so
    // any redirected response must be "copied" rather than cloned, so the new
    // response doesn't contain the `redirected` flag. See:
    // https://bugs.chromium.org/p/chromium/issues/detail?id=669363&desc=2#c1
    this.plugins.push(PrecacheStrategy.copyRedirectedCacheableResponsesPlugin);
  }

  /**
   * @private
   * @param request A request to run this strategy for.
   * @param handler The event that triggered the request.
   * @returns
   */
  async _handle(request: Request, handler: StrategyHandler): Promise<Response> {
    const response = await handler.cacheMatch(request);

    if (response) {
      return response;
    }

    // If this is an `install` event for an entry that isn't already cached,
    // then populate the cache.
    if (handler.event && handler.event.type === "install") {
      return await this._handleInstall(request, handler);
    }

    // Getting here means something went wrong. An entry that should have been
    // precached wasn't found in the cache.
    return await this._handleFetch(request, handler);
  }

  async _handleFetch(request: Request, handler: StrategyHandler): Promise<Response> {
    let response: Response | undefined = undefined;

    const params = (handler.params || {}) as {
      cacheKey?: string;
      integrity?: string;
    };

    // Fallback to the network if we're configured to do so.
    if (this._fallbackToNetwork) {
      if (process.env.NODE_ENV !== "production") {
        logger.warn(`The precached response for ${getFriendlyURL(request.url)} in ${this.cacheName} was not found. Falling back to the network.`);
      }

      const integrityInManifest = params.integrity;
      const integrityInRequest = request.integrity;
      const noIntegrityConflict = !integrityInRequest || integrityInRequest === integrityInManifest;

      // Do not add integrity if the original request is no-cors
      // See https://github.com/GoogleChrome/workbox/issues/3096
      response = await handler.fetch(
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
        this._useDefaultCacheabilityPluginIfNeeded();
        const wasCached = await handler.cachePut(request, response.clone());
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
        cacheName: this.cacheName,
        url: request.url,
      });
    }

    if (process.env.NODE_ENV !== "production") {
      const cacheKey = params.cacheKey || (await handler.getCacheKey(request, "read"));

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
  }

  async _handleInstall(request: Request, handler: StrategyHandler): Promise<Response> {
    this._useDefaultCacheabilityPluginIfNeeded();

    const response = await handler.fetch(request);

    // Make sure we defer cachePut() until after we know the response
    // should be cached; see https://github.com/GoogleChrome/workbox/issues/2737
    const wasCached = await handler.cachePut(request, response.clone());

    if (!wasCached) {
      // Throwing here will lead to the `install` handler failing, which
      // we want to do if *any* of the responses aren't safe to cache.
      throw new SerwistError("bad-precaching-response", {
        url: request.url,
        status: response.status,
      });
    }

    return response;
  }

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
  _useDefaultCacheabilityPluginIfNeeded(): void {
    let defaultPluginIndex: number | null = null;
    let cacheWillUpdatePluginCount = 0;

    for (const [index, plugin] of this.plugins.entries()) {
      // Ignore the copy redirected plugin when determining what to do.
      if (plugin === PrecacheStrategy.copyRedirectedCacheableResponsesPlugin) {
        continue;
      }

      // Save the default plugin's index, in case it needs to be removed.
      if (plugin === PrecacheStrategy.defaultPrecacheCacheabilityPlugin) {
        defaultPluginIndex = index;
      }

      if (plugin.cacheWillUpdate) {
        cacheWillUpdatePluginCount++;
      }
    }

    if (cacheWillUpdatePluginCount === 0) {
      this.plugins.push(PrecacheStrategy.defaultPrecacheCacheabilityPlugin);
    } else if (cacheWillUpdatePluginCount > 1 && defaultPluginIndex !== null) {
      // Only remove the default plugin; multiple custom plugins are allowed.
      this.plugins.splice(defaultPluginIndex, 1);
    }
    // Nothing needs to be done if cacheWillUpdatePluginCount is 1
  }
}
