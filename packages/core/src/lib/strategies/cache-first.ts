import { assert } from "#utils/assert.js";
import { logger } from "#utils/logger.js";
import { SerwistError } from "#utils/SerwistError.js";
import { createStrategy, type StrategyOptions } from "./core.js";
import { cacheMatch, fetchAndCachePut } from "./handler.js";
import { messages } from "./utils/messages.js";

/**
 * An implementation of the [cache first](https://developer.chrome.com/docs/workbox/caching-strategies-overview/#cache_first_falling_back_to_network)
 * request strategy.
 *
 * A cache first strategy is useful for assets that have been revisioned,
 * such as URLs like "/styles/example.a8f5f1.css", since they
 * can be cached for long periods of time.
 *
 * If the network request fails, and there is no cache match, this will throw
 * a {@linkcode SerwistError} exception.
 */
export const cacheFirst = (options: StrategyOptions = {}) =>
  createStrategy(options, async (request, handler) => {
    const logs = [];

    if (process.env.NODE_ENV !== "production") {
      assert!.isInstance(request, Request, {
        moduleName: "serwist",
        className: "CacheFirst",
        funcName: "makeRequest",
        paramName: "request",
      });
    }

    let response = await cacheMatch(handler, request);

    let error: Error | undefined;
    if (!response) {
      if (process.env.NODE_ENV !== "production") {
        logs.push(`No response found in the '${handler.strategy.cacheName}' cache. Will respond with a network request.`);
      }
      try {
        response = await fetchAndCachePut(handler, request);
      } catch (err) {
        if (err instanceof Error) {
          error = err;
        }
      }

      if (process.env.NODE_ENV !== "production") {
        if (response) {
          logs.push("Got response from network.");
        } else {
          logs.push("Unable to get a response from the network.");
        }
      }
    } else {
      if (process.env.NODE_ENV !== "production") {
        logs.push(`Found a cached response in the '${handler.strategy.cacheName}' cache.`);
      }
    }

    if (process.env.NODE_ENV !== "production") {
      logger.groupCollapsed(messages.strategyStart("CacheFirst", request));
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
