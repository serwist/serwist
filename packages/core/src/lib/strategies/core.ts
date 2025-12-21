import { getFriendlyURL, logger, privateCacheNames, SerwistError } from "#index.internal";
import type { HandlerCallbackOptions, RouteHandlerObject, StrategyPlugin } from "#lib/types.js";
import { createHandler, destroyHandler, doneWaiting, iterateCallbacks, runCallbacks, type StrategyHandler } from "./handler.js";

export interface StrategyOptions {
  /**
   * Cache name to store and retrieve requests. Defaults to Serwist's default cache names.
   */
  cacheName?: string;
  /**
   * [Plugins](https://serwist.pages.dev/docs/serwist/runtime-caching/plugins) to use in conjunction with this caching strategy.
   */
  plugins?: StrategyPlugin[];
  /**
   * Options passed to [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796) `fetch()` calls made by
   * this strategy.
   */
  fetchOptions?: RequestInit;
  /**
   * The [`CacheQueryOptions`](https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions)
   * passed to any `cache.match()` or `cache.put()` call made by this strategy.
   */
  matchOptions?: CacheQueryOptions;
}

export interface Strategy extends RouteHandlerObject {
  cacheName: string;
  plugins: StrategyPlugin[];
  fetchOptions?: RequestInit;
  matchOptions?: CacheQueryOptions;
  /**
   * Performs a request strategy and returns a promise that will resolve to
   * a response, invoking all relevant plugin callbacks.
   *
   * When a strategy instance is registered with a route, this method is automatically
   * called when the route matches.
   *
   * Alternatively, this method can be used in a standalone `fetch` event
   * listener by passing it to `event.respondWith()`.
   *
   * @param options A `FetchEvent` or an object with the properties listed below.
   * @param options.request A request to run this strategy for.
   * @param options.event The event associated with the request.
   * @param options.url
   * @param options.params
   */
  handle(options: FetchEvent | HandlerCallbackOptions): Promise<Response>;
  /**
   * Similar to `handle()`, but instead of just returning a promise that
   * resolves to a response, it will return an tuple of `[response, done]` promises,
   * where `response` is equivalent to what `handle()` returns, and `done` is a
   * promise that will resolve once all promises added to `event.waitUntil()` as a part
   * of performing the strategy have completed.
   *
   * You can await the `done` promise to ensure any extra work performed by
   * the strategy (usually caching responses) completes successfully.
   *
   * @param options A `FetchEvent` or `HandlerCallbackOptions` object.
   * @returns A tuple of [response, done] promises that can be used to determine when the response resolves as
   * well as when the handler has completed all its work.
   */
  handleAll(options: FetchEvent | HandlerCallbackOptions): [Promise<Response>, Promise<void>];
}

/**
 * Abstract class for implementing runtime caching strategies.
 *
 * Custom strategies should extend this class and leverage `StrategyHandler`, which will ensure all relevant cache options,
 * fetch options, and plugins are used (per the current strategy instance), to perform all fetching and caching logic.
 */
export const createStrategy = (
  options: StrategyOptions,
  handle: (request: Request, handler: StrategyHandler) => Promise<Response | undefined>,
): Strategy => {
  const getResponse = async (handler: StrategyHandler, request: Request, event: ExtendableEvent): Promise<Response> => {
    await runCallbacks(handler, "handlerWillStart", { event, request });

    let response: Response | undefined;
    try {
      response = await handle(request, handler);
      // The "official" Strategy subclasses all throw this error automatically,
      // but in case a third-party Strategy doesn't, ensure that we have a
      // consistent failure when there's no response or an error response.
      if (response === undefined || response.type === "error") {
        throw new SerwistError("no-response", { url: request.url });
      }
    } catch (error) {
      if (error instanceof Error) {
        for (const callback of iterateCallbacks(handler, "handlerDidError")) {
          response = await callback({ error, event, request });
          if (response !== undefined) {
            break;
          }
        }
      }

      if (!response) {
        throw error;
      }
      if (process.env.NODE_ENV !== "production") {
        throw logger.log(
          `While responding to '${getFriendlyURL(request.url)}', an ${
            error instanceof Error ? error.toString() : ""
          } error occurred. Using a fallback response provided by a handlerDidError plugin.`,
        );
      }
    }

    for (const callback of iterateCallbacks(handler, "handlerWillRespond")) {
      response = (await callback({ event, request, response })) as Response;
    }

    return response;
  };

  const awaitComplete = async (
    responseDone: Promise<Response>,
    handler: StrategyHandler,
    request: Request,
    event: ExtendableEvent,
  ): Promise<void> => {
    let response: Response | undefined;
    let error: Error | undefined;

    try {
      response = await responseDone;
    } catch {
      // Ignore errors, as response errors should be caught via the `response`
      // promise above. The `done` promise will only throw for errors in
      // promises passed to `handler.waitUntil()`.
    }

    try {
      await runCallbacks(handler, "handlerDidRespond", {
        event,
        request,
        response,
      });
      await doneWaiting(handler);
    } catch (waitUntilError) {
      if (waitUntilError instanceof Error) {
        error = waitUntilError;
      }
    }

    await runCallbacks(handler, "handlerDidComplete", {
      event,
      request,
      response,
      error,
    });

    destroyHandler(handler);

    if (error) {
      throw error;
    }
  };
  return {
    cacheName: privateCacheNames.getRuntimeName(options.cacheName),
    plugins: options.plugins || [],
    fetchOptions: options.fetchOptions,
    matchOptions: options.matchOptions,
    handle(options: FetchEvent | HandlerCallbackOptions) {
      const [responseDone] = this.handleAll(options);
      return responseDone;
    },
    handleAll(options) {
      // Allow for flexible options to be passed.
      if (options instanceof FetchEvent) {
        options = {
          event: options,
          request: options.request,
        };
      }

      const event = options.event;
      const request = typeof options.request === "string" ? new Request(options.request) : options.request;

      const handler = createHandler(this, options.url ? { event, request, url: options.url, params: options.params } : { event, request });

      const responseDone = getResponse(handler, request, event);
      const handlerDone = awaitComplete(responseDone, handler, request, event);

      // Return an array of promises, suitable for use with Promise.all().
      return [responseDone, handlerDone];
    },
  };
};
