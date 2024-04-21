/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { SerwistError } from "../../utils/SerwistError.js";
import { assert } from "../../utils/assert.js";
import { logger } from "../../utils/logger.js";
import type { StrategyOptions } from "./Strategy.js";
import { Strategy } from "./Strategy.js";
import type { StrategyHandler } from "./StrategyHandler.js";
import { cacheOkAndOpaquePlugin } from "./plugins/cacheOkAndOpaquePlugin.js";
import { messages } from "./utils/messages.js";

export interface NetworkFirstOptions extends StrategyOptions {
  /**
   * If set, any network requests that fail to respond within the timeout will fallback to the cache.
   */
  networkTimeoutSeconds?: number;
}

/**
 * An implementation of the [network first](https://developer.chrome.com/docs/workbox/caching-strategies-overview/#network_first_falling_back_to_cache)
 * request strategy.
 *
 * By default, this strategy will cache responses with a 200 status code as
 * well as [opaque responses](https://developer.chrome.com/docs/workbox/caching-resources-during-runtime/#opaque_responses).
 * Opaque responses are are cross-origin requests where the response doesn't
 * support [CORS](https://enable-cors.org/).
 *
 * If the network request fails, and there is no cache match, this will throw
 * a `SerwistError` exception.
 */
export class NetworkFirst extends Strategy {
  private readonly _networkTimeoutSeconds: number;
  /**
   * @param options
   * This option can be used to combat
   * "[lie-fi](https://developers.google.com/web/fundamentals/performance/poor-connectivity/#lie-fi)"
   * scenarios.
   */
  constructor(options: NetworkFirstOptions = {}) {
    super(options);

    // If this instance contains no plugins with a 'cacheWillUpdate' callback,
    // prepend the `cacheOkAndOpaquePlugin` plugin to the plugins list.
    if (!this.plugins.some((p) => "cacheWillUpdate" in p)) {
      this.plugins.unshift(cacheOkAndOpaquePlugin);
    }

    this._networkTimeoutSeconds = options.networkTimeoutSeconds || 0;
    if (process.env.NODE_ENV !== "production") {
      if (this._networkTimeoutSeconds) {
        assert!.isType(this._networkTimeoutSeconds, "number", {
          moduleName: "serwist",
          className: this.constructor.name,
          funcName: "constructor",
          paramName: "networkTimeoutSeconds",
        });
      }
    }
  }

  /**
   * @private
   * @param request A request to run this strategy for.
   * @param handler The event that triggered the request.
   * @returns
   */
  async _handle(request: Request, handler: StrategyHandler): Promise<Response> {
    const logs: any[] = [];

    if (process.env.NODE_ENV !== "production") {
      assert!.isInstance(request, Request, {
        moduleName: "serwist",
        className: this.constructor.name,
        funcName: "handle",
        paramName: "makeRequest",
      });
    }

    const promises: Promise<Response | undefined>[] = [];
    let timeoutId: number | undefined;

    if (this._networkTimeoutSeconds) {
      const { id, promise } = this._getTimeoutPromise({
        request,
        logs,
        handler,
      });
      timeoutId = id;
      promises.push(promise);
    }

    const networkPromise = this._getNetworkPromise({
      timeoutId,
      request,
      logs,
      handler,
    });

    promises.push(networkPromise);

    const response = await handler.waitUntil(
      (async () => {
        // Promise.race() will resolve as soon as the first promise resolves.
        return (
          (await handler.waitUntil(Promise.race(promises))) ||
          // If Promise.race() resolved with null, it might be due to a network
          // timeout + a cache miss. If that were to happen, we'd rather wait until
          // the networkPromise resolves instead of returning null.
          // Note that it's fine to await an already-resolved promise, so we don't
          // have to check to see if it's still "in flight".
          (await networkPromise)
        );
      })(),
    );

    if (process.env.NODE_ENV !== "production") {
      logger.groupCollapsed(messages.strategyStart(this.constructor.name, request));
      for (const log of logs) {
        logger.log(log);
      }
      messages.printFinalResponse(response);
      logger.groupEnd();
    }

    if (!response) {
      throw new SerwistError("no-response", { url: request.url });
    }
    return response;
  }

  /**
   * @param options
   * @returns
   * @private
   */
  private _getTimeoutPromise({
    request,
    logs,
    handler,
  }: {
    request: Request;
    /**
     * A reference to the logs array.
     */
    logs: any[];
    handler: StrategyHandler;
  }): { promise: Promise<Response | undefined>; id?: number } {
    // biome-ignore lint/suspicious/noImplicitAnyLet: setTimeout is typed with Node.js's typings, so we can't use number | undefined here.
    let timeoutId;
    const timeoutPromise: Promise<Response | undefined> = new Promise((resolve) => {
      const onNetworkTimeout = async () => {
        if (process.env.NODE_ENV !== "production") {
          logs.push(`Timing out the network response at ${this._networkTimeoutSeconds} seconds.`);
        }
        resolve(await handler.cacheMatch(request));
      };
      timeoutId = setTimeout(onNetworkTimeout, this._networkTimeoutSeconds * 1000);
    });

    return {
      promise: timeoutPromise,
      id: timeoutId,
    };
  }

  /**
   * @param options
   * @param options.timeoutId
   * @param options.request
   * @param options.logs A reference to the logs Array.
   * @param options.event
   * @returns
   *
   * @private
   */
  async _getNetworkPromise({
    timeoutId,
    request,
    logs,
    handler,
  }: {
    request: Request;
    logs: any[];
    timeoutId?: number;
    handler: StrategyHandler;
  }): Promise<Response | undefined> {
    let error: Error | undefined = undefined;
    let response: Response | undefined = undefined;
    try {
      response = await handler.fetchAndCachePut(request);
    } catch (fetchError) {
      if (fetchError instanceof Error) {
        error = fetchError;
      }
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (process.env.NODE_ENV !== "production") {
      if (response) {
        logs.push("Got response from network.");
      } else {
        logs.push("Unable to get a response from the network. Will respond " + "with a cached response.");
      }
    }

    if (error || !response) {
      response = await handler.cacheMatch(request);

      if (process.env.NODE_ENV !== "production") {
        if (response) {
          logs.push(`Found a cached response in the '${this.cacheName}' cache.`);
        } else {
          logs.push(`No response found in the '${this.cacheName}' cache.`);
        }
      }
    }

    return response;
  }
}
