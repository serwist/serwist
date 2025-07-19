import { defaultMethod, type HTTPMethod } from "#lib/constants.js";
import type { Extension, ExtensionParam } from "#lib/extension.js";
import type { Route } from "#lib/route.js";
import type { RouteHandler } from "#lib/types.js";
import { logger } from "#utils/logger.js";
import { normalizeHandler } from "#utils/normalizeHandler.js";
import { waitUntil } from "#utils/waitUntil.js";
import type { Serwist } from "../core.js";
import { handleRequest } from "./router.js";

declare const self: ServiceWorkerGlobalScope;

export type RequestArgs = string | [string, RequestInit?];

export interface CacheURLsMessageData {
  type: string;
  payload: {
    urlsToCache: RequestArgs[];
  };
}

/**
 * Adds Serwist's event listeners. Before calling it, add your own listeners should you need to.
 */
export const addEventListeners = (state: Serwist) => {
  self.addEventListener("install", createInstallHandler(state));
  self.addEventListener("activate", createActivateHandler(state));
  self.addEventListener("fetch", createFetchHandler(state));
  self.addEventListener("message", createCacheHandler(state));
};

export const createInstallHandler = (state: Serwist) => {
  return (event: ExtendableEvent): Promise<void> => {
    return waitUntil(event, async () => {
      for (const callback of iterateExtensions(state, "install")) {
        await callback({ event, serwist: state });
      }
    });
  };
};

export const createActivateHandler = (state: Serwist) => {
  return (event: ExtendableEvent): Promise<void> => {
    return waitUntil(event, async () => {
      for (const callback of iterateExtensions(state, "activate")) {
        await callback({ event, serwist: state });
      }
    });
  };
};

/**
 * Gets a `Response` from an appropriate `Route`'s handler. Call this method
 * from the service worker's `fetch` event.
 * @param event
 */
export const createFetchHandler = (state: Serwist) => {
  return (event: FetchEvent) => {
    const { request } = event;
    const responsePromise = handleRequest(state, { request, event });
    if (responsePromise) {
      event.respondWith(responsePromise);
    }
  };
};

/**
 * Caches new URLs on demand. Call this method from the service worker's
 * `message` event. To trigger the handler, send a message of type `"CACHE_URLS"`
 * alongside a list of URLs that should be cached as `urlsToCache`.
 * @param event
 */
export const createCacheHandler = (state: Serwist) => {
  return (event: ExtendableMessageEvent) => {
    if (event.data && event.data.type === "CACHE_URLS") {
      const { payload }: CacheURLsMessageData = event.data;

      if (process.env.NODE_ENV !== "production") {
        logger.debug("Caching URLs from the window", payload.urlsToCache);
      }

      const requestPromises = Promise.all(
        payload.urlsToCache.map((entry: string | [string, RequestInit?]) => {
          let request: Request;
          if (typeof entry === "string") {
            request = new Request(entry);
          } else {
            request = new Request(...entry);
          }
          return handleRequest(state, { request, event });
        }),
      );

      event.waitUntil(requestPromises);

      // If a MessageChannel was used, reply to the message on success.
      if (event.ports?.[0]) {
        void requestPromises.then(() => event.ports[0].postMessage(true));
      }
    }
  };
};

/**
 * Define a default handler that's called when no routes explicitly
 * match the incoming request.
 *
 * Each HTTP method (`'GET'`, `'POST'`, etc.) gets its own default handler.
 *
 * Without a default handler, unmatched requests will go against the
 * network as if there were no service worker present.
 *
 * @param handler A callback function that returns a `Promise` resulting in a `Response`.
 * @param method The HTTP method to associate with this default handler. Each method
 * has its own default. Defaults to `'GET'`.
 */
export const setDefaultHandler = (state: Serwist, handler: RouteHandler, method: HTTPMethod = defaultMethod): void => {
  state.defaultHandlerMap.set(method, normalizeHandler(handler));
};

/**
 * If a {@linkcode Route} throws an error while handling a request, this handler
 * will be called and given a chance to provide a response.
 *
 * @param handler A callback function that returns a `Promise` resulting
 * in a `Response`.
 */
export const setCatchHandler = (state: Serwist, handler: RouteHandler): void => {
  state.catchHandler = normalizeHandler(handler);
};

/**
 * Accepts a callback name and returns an iterable of matching plugin callbacks.
 *
 * @param name The name fo the callback to run
 * @returns
 */
export function* iterateExtensions<C extends keyof Extension>(state: Serwist, name: C): Generator<NonNullable<Extension[C]>> {
  if (!state.extensions) return;

  for (const controller of state.extensions) {
    if (typeof controller[name] === "function") {
      const callback = (param: ExtensionParam[C]) => {
        controller[name]!(param as any);
      };
      yield callback as NonNullable<Extension[C]>;
    }
  }
}
