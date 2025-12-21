import { assert } from "#utils/assert.js";
import { logger } from "#utils/logger.js";
import { SerwistError } from "#utils/SerwistError.js";
import type { StrategyOptions } from "./core.js";
import { createStrategy } from "./core.js";
import { cacheMatch, fetchAndCachePut, waitUntil } from "./handler.js";
import { cacheOkAndOpaquePlugin } from "./plugins/cacheOkAndOpaquePlugin.js";
import { messages } from "./utils/messages.js";

/**
 * An implementation of the
 * [stale-while-revalidate](https://developer.chrome.com/docs/workbox/caching-strategies-overview/#stale_while_revalidate)
 * request strategy.
 *
 * Resources are requested from both the cache and the network in parallel.
 * The strategy will respond with the cached version if available, otherwise
 * wait for the network response. The cache is updated with the network response
 * with each successful request.
 *
 * By default, this strategy will cache responses with a 200 status code as
 * well as [opaque responses](https://developer.chrome.com/docs/workbox/caching-resources-during-runtime/#opaque-responses).
 * Opaque responses are cross-origin requests where the response doesn't
 * support [CORS](https://enable-cors.org/).
 *
 * If the network request fails, and there is no cache match, this will throw
 * a {@linkcode SerwistError} exception.
 */

export const staleWhileRevalidate = (options: StrategyOptions = {}) => {
  const strategy = createStrategy(options, async (request, handler) => {
    const logs = [];

    if (process.env.NODE_ENV !== "production") {
      assert!.isInstance(request, Request, {
        moduleName: "serwist",
        className: "StaleWhileRevalidate",
        funcName: "handle",
        paramName: "request",
      });
    }

    const fetchAndCachePromise = fetchAndCachePut(handler, request).catch(() => {
      // Swallow this error because a 'no-response' error will be thrown in
      // main handler return flow. This will be in the `waitUntil()` flow.
    });
    void waitUntil(handler, fetchAndCachePromise);

    let response = await cacheMatch(handler, request);

    let error: Error | undefined;
    if (response) {
      if (process.env.NODE_ENV !== "production") {
        logs.push(`Found a cached response in the '${handler.strategy.cacheName}' cache. Will update with the network response in the background.`);
      }
    } else {
      if (process.env.NODE_ENV !== "production") {
        logs.push(`No response found in the '${handler.strategy.cacheName}' cache. Will wait for the network response.`);
      }
      try {
        // NOTE(philipwalton): Really annoying that we have to type cast here.
        // https://github.com/microsoft/TypeScript/issues/20006
        response = (await fetchAndCachePromise) as Response | undefined;
      } catch (err) {
        if (err instanceof Error) {
          error = err;
        }
      }
    }

    if (process.env.NODE_ENV !== "production") {
      logger.groupCollapsed(messages.strategyStart("StaleWhileRevalidate", request));
      for (const log of logs) {
        logger.log(log);
      }
      messages.printFinalResponse(response);
      logger.groupEnd();
    }

    if (!response) {
      throw new SerwistError("no-response", { url: request.url, error });
    }
    return response;
  });

  // If this instance contains no plugins with a 'cacheWillUpdate' callback,
  // prepend the `cacheOkAndOpaquePlugin` plugin to the plugins list.
  if (!strategy.plugins.some((p) => "cacheWillUpdate" in p)) {
    strategy.plugins.unshift(cacheOkAndOpaquePlugin);
  }

  return strategy;
};
