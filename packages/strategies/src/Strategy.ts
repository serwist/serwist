/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { HandlerCallbackOptions, RouteHandlerObject, SerwistPlugin } from "@serwist/core";
import { getFriendlyURL, logger, privateCacheNames, SerwistError } from "@serwist/core/internal";

import { StrategyHandler } from "./StrategyHandler.js";

export interface StrategyOptions {
  /**
   * Cache name to store and retrieve requests. Defaults to cache names provided by `@serwist/core`.
   */
  cacheName?: string;
  /**
   * [Plugins](https://developers.google.com/web/tools/workbox/guides/using-plugins)
   * to use in conjunction with this caching strategy.
   */
  plugins?: SerwistPlugin[];
  /**
   * Values passed along to the [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796) `fetch()` requests made by this strategy.
   */
  fetchOptions?: RequestInit;
  /**
   * The [`CacheQueryOptions`](https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions)
   * for any `cache.match()` or `cache.put()` calls made by this strategy.
   */
  matchOptions?: CacheQueryOptions;
}

/**
 * Classes extending the `Strategy` based class should implement this method,
 * and leverage `@serwist/strategies`'s `StrategyHandler` arg to perform all
 * fetching and cache logic, which will ensure all relevant cache, cache options,
 * fetch options and plugins are used (per the current strategy instance).
 */
abstract class Strategy implements RouteHandlerObject {
  cacheName: string;
  plugins: SerwistPlugin[];
  fetchOptions?: RequestInit;
  matchOptions?: CacheQueryOptions;

  protected abstract _handle(request: Request, handler: StrategyHandler): Promise<Response | undefined>;

  /**
   * Creates a new instance of the strategy and sets all documented option
   * properties as public instance properties.
   *
   * Note: if a custom strategy class extends the base Strategy class and does
   * not need more than these properties, it does not need to define its own
   * constructor.
   *
   * @param options
   */
  constructor(options: StrategyOptions = {}) {
    this.cacheName = privateCacheNames.getRuntimeName(options.cacheName);
    this.plugins = options.plugins || [];
    this.fetchOptions = options.fetchOptions;
    this.matchOptions = options.matchOptions;
  }

  /**
   * Perform a request strategy and returns a `Promise` that will resolve with
   * a `Response`, invoking all relevant plugin callbacks.
   *
   * When a strategy instance is registered with a `@serwist/routing` Route, this method is automatically
   * called when the route matches.
   *
   * Alternatively, this method can be used in a standalone `FetchEvent`
   * listener by passing it to `event.respondWith()`.
   *
   * @param options A `FetchEvent` or an object with the properties listed below.
   * @param options.request A request to run this strategy for.
   * @param options.event The event associated with the request.
   * @param options.url
   * @param options.params
   */
  handle(options: FetchEvent | HandlerCallbackOptions): Promise<Response> {
    const [responseDone] = this.handleAll(options);
    return responseDone;
  }

  /**
   * Similar to `@serwist/strategies`'s `Strategy.handle`, but
   * instead of just returning a `Promise` that resolves to a `Response` it
   * it will return an tuple of `[response, done]` promises, where the former
   * (`response`) is equivalent to what `handle()` returns, and the latter is a
   * Promise that will resolve once any promises that were added to
   * `event.waitUntil()` as part of performing the strategy have completed.
   *
   * You can await the `done` promise to ensure any extra work performed by
   * the strategy (usually caching responses) completes successfully.
   *
   * @param options A `FetchEvent` or `HandlerCallbackOptions` object.
   * @returns A tuple of [response, done] promises that can be used to determine when the response resolves as
   * well as when the handler has completed all its work.
   */
  handleAll(options: FetchEvent | HandlerCallbackOptions): [Promise<Response>, Promise<void>] {
    // Allow for flexible options to be passed.
    if (options instanceof FetchEvent) {
      options = {
        event: options,
        request: options.request,
      };
    }

    const event = options.event;
    const request = typeof options.request === "string" ? new Request(options.request) : options.request;
    const params = "params" in options ? options.params : undefined;

    const handler = new StrategyHandler(this, { event, request, params });

    const responseDone = this._getResponse(handler, request, event);
    const handlerDone = this._awaitComplete(responseDone, handler, request, event);

    // Return an array of promises, suitable for use with Promise.all().
    return [responseDone, handlerDone];
  }

  async _getResponse(handler: StrategyHandler, request: Request, event: ExtendableEvent): Promise<Response> {
    await handler.runCallbacks("handlerWillStart", { event, request });

    let response: Response | undefined = undefined;
    try {
      response = await this._handle(request, handler);
      // The "official" Strategy subclasses all throw this error automatically,
      // but in case a third-party Strategy doesn't, ensure that we have a
      // consistent failure when there's no response or an error response.
      if (response === undefined || response.type === "error") {
        throw new SerwistError("no-response", { url: request.url });
      }
    } catch (error) {
      if (error instanceof Error) {
        for (const callback of handler.iterateCallbacks("handlerDidError")) {
          response = await callback({ error, event, request });
          if (response !== undefined) {
            break;
          }
        }
      }

      if (!response) {
        throw error;
      }if (process.env.NODE_ENV !== "production") {
        throw logger.log(
          `While responding to '${getFriendlyURL(request.url)}', an ${error instanceof Error ? error.toString() : ""} error occurred. Using a fallback response provided by a handlerDidError plugin.`,
        );
      }
    }

    for (const callback of handler.iterateCallbacks("handlerWillRespond")) {
      response = (await callback({ event, request, response })) as Response;
    }

    return response;
  }

  async _awaitComplete(responseDone: Promise<Response>, handler: StrategyHandler, request: Request, event: ExtendableEvent): Promise<void> {
    let response: Response | undefined = undefined;
    let error: Error | undefined = undefined;

    try {
      response = await responseDone;
    } catch (error) {
      // Ignore errors, as response errors should be caught via the `response`
      // promise above. The `done` promise will only throw for errors in
      // promises passed to `handler.waitUntil()`.
    }

    try {
      await handler.runCallbacks("handlerDidRespond", {
        event,
        request,
        response,
      });
      await handler.doneWaiting();
    } catch (waitUntilError) {
      if (waitUntilError instanceof Error) {
        error = waitUntilError;
      }
    }

    await handler.runCallbacks("handlerDidComplete", {
      event,
      request,
      response,
      error,
    });
    handler.destroy();

    if (error) {
      throw error;
    }
  }
}

export { Strategy };
