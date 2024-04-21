/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { SerwistError } from "../../utils/SerwistError.js";
import { assert } from "../../utils/assert.js";
import { logger } from "../../utils/logger.js";
import { timeout } from "../../utils/timeout.js";
import type { StrategyOptions } from "./Strategy.js";
import { Strategy } from "./Strategy.js";
import type { StrategyHandler } from "./StrategyHandler.js";
import { messages } from "./utils/messages.js";

export interface NetworkOnlyOptions extends Omit<StrategyOptions, "cacheName" | "matchOptions"> {
  /**
   * If set, any network requests that fail to respond within the timeout will result in a network error.
   */
  networkTimeoutSeconds?: number;
}

/**
 * An implementation of the [network only](https://developer.chrome.com/docs/workbox/caching-strategies-overview/#network_only)
 * request strategy.
 *
 * This class is useful if you require specific requests to only be fulfilled from the network.
 *
 * If the network request fails, this will throw a `SerwistError` exception.
 */
export class NetworkOnly extends Strategy {
  private readonly _networkTimeoutSeconds: number;

  /**
   * @param options
   */
  constructor(options: NetworkOnlyOptions = {}) {
    super(options);

    this._networkTimeoutSeconds = options.networkTimeoutSeconds || 0;
  }

  /**
   * @private
   * @param request A request to run this strategy for.
   * @param handler The event that triggered the request.
   * @returns
   */
  async _handle(request: Request, handler: StrategyHandler): Promise<Response> {
    if (process.env.NODE_ENV !== "production") {
      assert!.isInstance(request, Request, {
        moduleName: "serwist",
        className: this.constructor.name,
        funcName: "_handle",
        paramName: "request",
      });
    }

    let error: Error | undefined = undefined;
    let response: Response | undefined;

    try {
      const promises: Promise<Response | undefined>[] = [handler.fetch(request)];

      if (this._networkTimeoutSeconds) {
        const timeoutPromise = timeout(this._networkTimeoutSeconds * 1000) as Promise<undefined>;
        promises.push(timeoutPromise);
      }

      response = await Promise.race(promises);
      if (!response) {
        throw new Error(`Timed out the network response after ${this._networkTimeoutSeconds} seconds.`);
      }
    } catch (err) {
      if (err instanceof Error) {
        error = err;
      }
    }

    if (process.env.NODE_ENV !== "production") {
      logger.groupCollapsed(messages.strategyStart(this.constructor.name, request));
      if (response) {
        logger.log("Got response from network.");
      } else {
        logger.log("Unable to get a response from the network.");
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
