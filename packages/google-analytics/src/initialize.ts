/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/


import type { Queue } from "@serwist/background-sync";
import { BackgroundSyncPlugin } from "@serwist/background-sync";
import { cacheNames, getFriendlyURL, logger } from "@serwist/core/private";
import type { RouteMatchCallbackOptions } from "@serwist/core/types";
import { Route, Router } from "@serwist/routing";
import { NetworkFirst, NetworkOnly } from "@serwist/strategies";

import {
  ANALYTICS_JS_PATH,
  COLLECT_PATHS_REGEX,
  GOOGLE_ANALYTICS_HOST,
  GTAG_JS_PATH,
  GTM_HOST,
  GTM_JS_PATH,
  MAX_RETENTION_TIME,
  QUEUE_NAME,
} from "./utils/constants.js";

export interface GoogleAnalyticsInitializeOptions {
  /**
   * The cache name to store and retrieve analytics.js. Defaults to the cache names provided by `@serwist/core`.
   */
  cacheName?: string;
  /**
   * [Measurement Protocol parameters](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters),
   * expressed as key/value pairs, to be added to replayed Google Analytics
   * requests. This can be used to, e.g., set a custom dimension indicating
   * that the request was replayed.
   */
  parameterOverrides?: { [paramName: string]: string };
  /**
   * A function that allows you to modify the hit parameters prior to replaying
   * the hit. The function is invoked with the original hit's URLSearchParams
   * object as its only argument.
   */
  hitFilter?: (params: URLSearchParams) => void;
}

/**
 * Creates the requestWillDequeue callback to be used with the background
 * sync plugin. The callback takes the failed request and adds the
 * `qt` param based on the current time, as well as applies any other
 * user-defined hit modifications.
 *
 * @param config
 * @returns The requestWillDequeue callback function.
 * @private
 */
const createOnSyncCallback = (config: GoogleAnalyticsInitializeOptions) => {
  return async ({ queue }: { queue: Queue }) => {
    let entry;
    while ((entry = await queue.shiftRequest())) {
      const { request, timestamp } = entry;
      const url = new URL(request.url);

      try {
        // Measurement protocol requests can set their payload parameters in
        // either the URL query string (for GET requests) or the POST body.
        const params =
          request.method === "POST"
            ? new URLSearchParams(await request.clone().text())
            : url.searchParams;

        // Calculate the qt param, accounting for the fact that an existing
        // qt param may be present and should be updated rather than replaced.
        const originalHitTime = timestamp! - (Number(params.get("qt")) || 0);
        const queueTime = Date.now() - originalHitTime;

        // Set the qt param prior to applying hitFilter or parameterOverrides.
        params.set("qt", String(queueTime));

        // Apply `parameterOverrides`, if set.
        if (config.parameterOverrides) {
          for (const param of Object.keys(config.parameterOverrides)) {
            const value = config.parameterOverrides[param];
            params.set(param, value);
          }
        }

        // Apply `hitFilter`, if set.
        if (typeof config.hitFilter === "function") {
          config.hitFilter.call(null, params);
        }

        // Retry the fetch. Ignore URL search params from the URL as they're
        // now in the post body.
        await fetch(
          new Request(url.origin + url.pathname, {
            body: params.toString(),
            method: "POST",
            mode: "cors",
            credentials: "omit",
            headers: { "Content-Type": "text/plain" },
          })
        );

        if (process.env.NODE_ENV !== "production") {
          logger.log(
            `Request for '${getFriendlyURL(url.href)}' ` + `has been replayed`
          );
        }
      } catch (err) {
        await queue.unshiftRequest(entry);

        if (process.env.NODE_ENV !== "production") {
          logger.log(
            `Request for '${getFriendlyURL(url.href)}' ` +
              `failed to replay, putting it back in the queue.`
          );
        }
        throw err;
      }
    }
    if (process.env.NODE_ENV !== "production") {
      logger.log(
        `All Google Analytics request successfully replayed; ` +
          `the queue is now empty!`
      );
    }
  };
};

/**
 * Creates GET and POST routes to catch failed Measurement Protocol hits.
 *
 * @param bgSyncPlugin
 * @returns The created routes.
 * @private
 */
const createCollectRoutes = (bgSyncPlugin: BackgroundSyncPlugin) => {
  const match = ({ url }: RouteMatchCallbackOptions) =>
    url.hostname === GOOGLE_ANALYTICS_HOST &&
    COLLECT_PATHS_REGEX.test(url.pathname);

  const handler = new NetworkOnly({
    plugins: [bgSyncPlugin],
  });

  return [new Route(match, handler, "GET"), new Route(match, handler, "POST")];
};

/**
 * Creates a route with a network first strategy for the analytics.js script.
 *
 * @param cacheName
 * @returns The created route.
 * @private
 */
const createAnalyticsJsRoute = (cacheName: string) => {
  const match = ({ url }: RouteMatchCallbackOptions) =>
    url.hostname === GOOGLE_ANALYTICS_HOST &&
    url.pathname === ANALYTICS_JS_PATH;

  const handler = new NetworkFirst({ cacheName });

  return new Route(match, handler, "GET");
};

/**
 * Creates a route with a network first strategy for the gtag.js script.
 *
 * @param cacheName
 * @returns The created route.
 * @private
 */
const createGtagJsRoute = (cacheName: string) => {
  const match = ({ url }: RouteMatchCallbackOptions) =>
    url.hostname === GTM_HOST && url.pathname === GTAG_JS_PATH;

  const handler = new NetworkFirst({ cacheName });

  return new Route(match, handler, "GET");
};

/**
 * Creates a route with a network first strategy for the gtm.js script.
 *
 * @param cacheName
 * @return The created route.
 * @private
 */
const createGtmJsRoute = (cacheName: string) => {
  const match = ({ url }: RouteMatchCallbackOptions) =>
    url.hostname === GTM_HOST && url.pathname === GTM_JS_PATH;

  const handler = new NetworkFirst({ cacheName });

  return new Route(match, handler, "GET");
};

/**
 * @param options
 */
const initialize = (options: GoogleAnalyticsInitializeOptions = {}): void => {
  const cacheName = cacheNames.getGoogleAnalyticsName(options.cacheName);

  const bgSyncPlugin = new BackgroundSyncPlugin(QUEUE_NAME, {
    maxRetentionTime: MAX_RETENTION_TIME,
    onSync: createOnSyncCallback(options),
  });

  const routes = [
    createGtmJsRoute(cacheName),
    createAnalyticsJsRoute(cacheName),
    createGtagJsRoute(cacheName),
    ...createCollectRoutes(bgSyncPlugin),
  ];

  const router = new Router();
  for (const route of routes) {
    router.registerRoute(route);
  }

  router.addFetchListener();
};

export { initialize };
