import { assert } from "#utils/assert.js";
import { logger } from "#utils/logger.js";
import { SerwistError } from "#utils/SerwistError.js";
import { createStrategy, type StrategyOptions } from "./core.js";
import { cacheMatch } from "./handler.js";
import { messages } from "./utils/messages.js";

/**
 * An implementation of the [cache only](https://developer.chrome.com/docs/workbox/caching-strategies-overview/#cache_only)
 * request strategy.
 *
 * This class is useful if you already have your own precaching step.
 *
 * If there is no cache match, this will throw a {@linkcode SerwistError} exception.
 */
export const cacheOnly = (options: StrategyOptions = {}) =>
  createStrategy(options, async (request, handler) => {
    if (process.env.NODE_ENV !== "production") {
      assert!.isInstance(request, Request, {
        moduleName: "serwist",
        className: "CacheOnly",
        funcName: "makeRequest",
        paramName: "request",
      });
    }

    const response = await cacheMatch(handler, request);

    if (process.env.NODE_ENV !== "production") {
      logger.groupCollapsed(messages.strategyStart("CacheOnly", request));
      if (response) {
        logger.log(`Found a cached response in the '${handler.strategy.cacheName}' cache.`);
        messages.printFinalResponse(response);
      } else {
        logger.log(`No response found in the '${handler.strategy.cacheName}' cache.`);
      }
      logger.groupEnd();
    }

    if (!response) {
      throw new SerwistError("no-response", { url: request.url });
    }
    return response;
  });
