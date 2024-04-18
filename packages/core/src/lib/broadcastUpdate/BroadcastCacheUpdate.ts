/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { CacheDidUpdateCallbackParam } from "../../types.js";
import { assert } from "../../utils/assert.js";
import { logger } from "../../utils/logger.js";
import { resultingClientExists } from "../../utils/resultingClientExists.js";
import { timeout } from "../../utils/timeout.js";
import {
  BROADCAST_UPDATE_DEFAULT_HEADERS,
  BROADCAST_UPDATE_DEFAULT_NOTIFY,
  BROADCAST_UPDATE_MESSAGE_META,
  BROADCAST_UPDATE_MESSAGE_TYPE,
} from "./constants.js";
import { responsesAreSame } from "./responsesAreSame.js";
import type { BroadcastCacheUpdateOptions, BroadcastMessage, BroadcastPayload, BroadcastPayloadGenerator } from "./types.js";

// UA-sniff Safari: https://stackoverflow.com/questions/7944460/detect-safari-browser
// TODO(philipwalton): remove once this Safari bug fix has been released.
// https://bugs.webkit.org/show_bug.cgi?id=201169
const isSafari = typeof navigator !== "undefined" && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// Give TypeScript the correct global.
declare const self: ServiceWorkerGlobalScope;
/**
 * Generates the default payload used in update messages. By default the
 * payload includes the `cacheName` and `updatedURL` fields.
 *
 * @returns
 * @private
 */
const defaultPayloadGenerator = (data: CacheDidUpdateCallbackParam): BroadcastPayload => {
  return {
    cacheName: data.cacheName,
    updatedURL: data.request.url,
  };
};

/**
 * A class that uses the `postMessage()` API to inform any open windows/tabs when
 * a cached response has been updated.
 *
 * For efficiency's sake, the underlying response bodies are not compared;
 * only specific response headers are checked.
 */
export class BroadcastCacheUpdate {
  private readonly _headersToCheck: string[];
  private readonly _generatePayload: BroadcastPayloadGenerator;
  private readonly _notifyAllClients: boolean;

  /**
   * Construct a BroadcastCacheUpdate instance with a specific `channelName` to
   * broadcast messages on
   *
   * @param options
   */
  constructor({ generatePayload, headersToCheck, notifyAllClients }: BroadcastCacheUpdateOptions = {}) {
    this._headersToCheck = headersToCheck || BROADCAST_UPDATE_DEFAULT_HEADERS;
    this._generatePayload = generatePayload || defaultPayloadGenerator;
    this._notifyAllClients = notifyAllClients ?? BROADCAST_UPDATE_DEFAULT_NOTIFY;
  }

  /**
   * Compares two responses and sends a message (via `postMessage()`) to all window clients if the
   * responses differ. Neither of the Responses can be opaque.
   *
   * The message that's posted has the following format (where `payload` can
   * be customized via the `generatePayload` option the instance is created
   * with):
   *
   * ```
   * {
   *   type: 'CACHE_UPDATED',
   *   meta: 'workbox-broadcast-update',
   *   payload: {
   *     cacheName: 'the-cache-name',
   *     updatedURL: 'https://example.com/'
   *   }
   * }
   * ```
   *
   * @param options
   * @returns Resolves once the update is sent.
   */
  async notifyIfUpdated(options: CacheDidUpdateCallbackParam): Promise<void> {
    if (process.env.NODE_ENV !== "production") {
      assert!.isType(options.cacheName, "string", {
        moduleName: "serwist",
        className: "BroadcastCacheUpdate",
        funcName: "notifyIfUpdated",
        paramName: "cacheName",
      });
      assert!.isInstance(options.newResponse, Response, {
        moduleName: "serwist",
        className: "BroadcastCacheUpdate",
        funcName: "notifyIfUpdated",
        paramName: "newResponse",
      });
      assert!.isInstance(options.request, Request, {
        moduleName: "serwist",
        className: "BroadcastCacheUpdate",
        funcName: "notifyIfUpdated",
        paramName: "request",
      });
    }

    // Without two responses there is nothing to compare.
    if (!options.oldResponse) {
      return;
    }

    if (!responsesAreSame(options.oldResponse, options.newResponse, this._headersToCheck)) {
      if (process.env.NODE_ENV !== "production") {
        logger.log("Newer response found (and cached) for:", options.request.url);
      }

      const messageData = {
        type: BROADCAST_UPDATE_MESSAGE_TYPE,
        meta: BROADCAST_UPDATE_MESSAGE_META,
        payload: this._generatePayload(options),
      } satisfies BroadcastMessage;

      // For navigation requests, wait until the new window client exists
      // before sending the message
      if (options.request.mode === "navigate") {
        let resultingClientId: string | undefined;
        if (options.event instanceof FetchEvent) {
          resultingClientId = options.event.resultingClientId;
        }

        const resultingWin = await resultingClientExists(resultingClientId);

        // Safari does not currently implement postMessage buffering and
        // there's no good way to feature detect that, so to increase the
        // chances of the message being delivered in Safari, we add a timeout.
        // We also do this if `resultingClientExists()` didn't return a client,
        // which means it timed out, so it's worth waiting a bit longer.
        if (!resultingWin || isSafari) {
          // 3500 is chosen because (according to CrUX data) 80% of mobile
          // websites hit the DOMContentLoaded event in less than 3.5 seconds.
          // And presumably sites implementing service worker are on the
          // higher end of the performance spectrum.
          await timeout(3500);
        }
      }

      if (this._notifyAllClients) {
        const windows = await self.clients.matchAll({ type: "window" });
        for (const win of windows) {
          win.postMessage(messageData);
        }
      } else {
        // See https://github.com/GoogleChrome/workbox/issues/2895
        if (options.event instanceof FetchEvent) {
          const client = await self.clients.get(options.event.clientId);
          client?.postMessage(messageData);
        }
      }
    }
  }
}
