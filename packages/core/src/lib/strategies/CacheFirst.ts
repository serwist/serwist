/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { SerwistError } from "../../utils/SerwistError.js";
import { assert } from "../../utils/assert.js";
import { logger } from "../../utils/logger.js";
import { Strategy } from "./Strategy.js";
import type { StrategyHandler } from "./StrategyHandler.js";
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
 * a `SerwistError` exception.
 */
export class CacheFirst extends Strategy {
  /**
   * @private
   * @param request A request to run this strategy for.
   * @param handler The event that triggered the request.
   * @returns
   */
  async _handle(request: Request, handler: StrategyHandler): Promise<Response> {
    const logs = [];

    if (process.env.NODE_ENV !== "production") {
      assert!.isInstance(request, Request, {
        moduleName: "serwist",
        className: this.constructor.name,
        funcName: "makeRequest",
        paramName: "request",
      });
    }

    let response = await handler.cacheMatch(request);

    let error: Error | undefined = undefined;
    if (!response) {
      if (process.env.NODE_ENV !== "production") {
        logs.push(`No response found in the '${this.cacheName}' cache. Will respond with a network request.`);
      }
      try {
        response = await handler.fetchAndCachePut(request);
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
        logs.push(`Found a cached response in the '${this.cacheName}' cache.`);
      }
    }

    if (process.env.NODE_ENV !== "production") {
      logger.groupCollapsed(messages.strategyStart(this.constructor.name, request));
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
  }
}
