import { assert } from "#utils/assert.js";
import { logger } from "#utils/logger.js";
import { SerwistError } from "#utils/SerwistError.js";
import { timeout } from "#utils/timeout.js";
import type { StrategyOptions } from "./core.js";
import { createStrategy } from "./core.js";
import { fetch } from "./handler.js";
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
 * If the network request fails, this will throw a {@linkcode SerwistError} exception.
 */
export const networkOnly = (options: NetworkOnlyOptions = {}) => {
  const networkTimeoutSeconds = options.networkTimeoutSeconds || 0;

  return createStrategy(options, async (request, handler) => {
    if (process.env.NODE_ENV !== "production") {
      assert!.isInstance(request, Request, {
        moduleName: "serwist",
        className: "NetworkOnly",
        funcName: "_handle",
        paramName: "request",
      });
    }

    let error: Error | undefined;
    let response: Response | undefined;

    try {
      const promises: Promise<Response | undefined>[] = [fetch(handler, request)];

      if (networkTimeoutSeconds) {
        const timeoutPromise = timeout(networkTimeoutSeconds * 1000) as Promise<undefined>;
        promises.push(timeoutPromise);
      }

      response = await Promise.race(promises);
      if (!response) {
        throw new Error(`Timed out the network response after ${networkTimeoutSeconds} seconds.`);
      }
    } catch (err) {
      if (err instanceof Error) {
        error = err;
      }
    }

    if (process.env.NODE_ENV !== "production") {
      logger.groupCollapsed(messages.strategyStart("NetworkOnly", request));
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
  });
};
