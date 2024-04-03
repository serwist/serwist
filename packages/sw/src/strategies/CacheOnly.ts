/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { assert, SerwistError, logger } from "@serwist/core/internal";

import { Strategy } from "./Strategy.js";
import type { StrategyHandler } from "./StrategyHandler.js";
import { messages } from "./utils/messages.js";

/**
 * An implementation of the [cache only](https://developer.chrome.com/docs/workbox/caching-strategies-overview/#cache-only)
 * request strategy.
 *
 * This class is useful if you want to take advantage of any Serwist plugin.
 *
 * If there is no cache match, this will throw a `SerwistError` exception.
 */
export class CacheOnly extends Strategy {
  /**
   * @private
   * @param request A request to run this strategy for.
   * @param handler The event that triggered the request.
   * @returns
   */
  async _handle(request: Request, handler: StrategyHandler): Promise<Response> {
    if (process.env.NODE_ENV !== "production") {
      assert!.isInstance(request, Request, {
        moduleName: "@serwist/sw/strategies",
        className: this.constructor.name,
        funcName: "makeRequest",
        paramName: "request",
      });
    }

    const response = await handler.cacheMatch(request);

    if (process.env.NODE_ENV !== "production") {
      logger.groupCollapsed(messages.strategyStart(this.constructor.name, request));
      if (response) {
        logger.log(`Found a cached response in the '${this.cacheName}' cache.`);
        messages.printFinalResponse(response);
      } else {
        logger.log(`No response found in the '${this.cacheName}' cache.`);
      }
      logger.groupEnd();
    }

    if (!response) {
      throw new SerwistError("no-response", { url: request.url });
    }
    return response;
  }
}
