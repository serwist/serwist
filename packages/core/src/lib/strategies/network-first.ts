import { assert } from "#utils/assert.js";
import { logger } from "#utils/logger.js";
import { SerwistError } from "#utils/SerwistError.js";
import type { StrategyOptions } from "./core.js";
import { createStrategy } from "./core.js";
import type { StrategyHandler } from "./handler.js";
import { cacheMatch, fetchAndCachePut, waitUntil } from "./handler.js";
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
 * a {@linkcode SerwistError} exception.
 */
export const networkFirst = (options: NetworkFirstOptions = {}) => {
  const networkTimeoutSeconds = options.networkTimeoutSeconds || 0;
  if (process.env.NODE_ENV !== "production") {
    if (networkTimeoutSeconds) {
      assert!.isType(networkTimeoutSeconds, "number", {
        moduleName: "serwist",
        className: "NetworkFirst",
        funcName: "constructor",
        paramName: "networkTimeoutSeconds",
      });
    }
  }
  const strategy = createStrategy(options, async (request, handler) => {
    const logs: any[] = [];

    if (process.env.NODE_ENV !== "production") {
      assert!.isInstance(request, Request, {
        moduleName: "serwist",
        className: "NetworkFirst",
        funcName: "handle",
        paramName: "makeRequest",
      });
    }

    const promises: Promise<Response | undefined>[] = [];
    let timeoutId: number | undefined;

    if (networkTimeoutSeconds) {
      const { id, promise } = getTimeoutPromise(networkTimeoutSeconds, request, logs, handler);
      timeoutId = id;
      promises.push(promise);
    }

    const networkPromise = getNetworkPromise(request, logs, timeoutId, handler);

    promises.push(networkPromise);

    const response = await waitUntil(
      handler,
      (async () => {
        // Promise.race() will resolve as soon as the first promise resolves.
        return (
          (await waitUntil(handler, Promise.race(promises))) ||
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
      logger.groupCollapsed(messages.strategyStart("NetworkFirst", request));
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
  });

  // If this instance contains no plugins with a 'cacheWillUpdate' callback,
  // prepend the `cacheOkAndOpaquePlugin` plugin to the plugins list.
  if (!strategy.plugins.some((p) => "cacheWillUpdate" in p)) {
    strategy.plugins.unshift(cacheOkAndOpaquePlugin);
  }

  return strategy;
};

const getTimeoutPromise = (
  networkTimeoutSeconds: number,
  request: Request,
  /**
   * A reference to the logs array.
   */
  logs: any[],
  handler: StrategyHandler,
): { promise: Promise<Response | undefined>; id?: number } => {
  // biome-ignore lint/suspicious/noImplicitAnyLet: setTimeout is typed with Node.js's typings, so we can't use number | undefined here.
  let timeoutId;
  const timeoutPromise: Promise<Response | undefined> = new Promise((resolve) => {
    const onNetworkTimeout = async () => {
      if (process.env.NODE_ENV !== "production") {
        logs.push(`Timing out the network response at ${networkTimeoutSeconds} seconds.`);
      }
      resolve(await cacheMatch(handler, request));
    };
    timeoutId = setTimeout(onNetworkTimeout, networkTimeoutSeconds * 1000);
  });

  return {
    promise: timeoutPromise,
    id: timeoutId,
  };
};

const getNetworkPromise = async (
  request: Request,
  logs: any[],
  timeoutId: number | undefined,
  handler: StrategyHandler,
): Promise<Response | undefined> => {
  let error: Error | undefined;
  let response: Response | undefined;
  try {
    response = await fetchAndCachePut(handler, request);
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
    response = await cacheMatch(handler, request);

    if (process.env.NODE_ENV !== "production") {
      if (response) {
        logs.push(`Found a cached response in the '${handler.strategy.cacheName}' cache.`);
      } else {
        logs.push(`No response found in the '${handler.strategy.cacheName}' cache.`);
      }
    }
  }

  return response;
};
