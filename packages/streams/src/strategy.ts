/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { RouteHandlerCallback, RouteHandlerCallbackOptions } from "@serwist/core";
import { logger } from "@serwist/core/internal";

import type { StreamSource } from "./_types.js";
import { concatenateToResponse } from "./concatenateToResponse.js";
import { isSupported } from "./isSupported.js";
import { createHeaders } from "./utils/createHeaders.js";

export interface StreamsHandlerCallback {
  ({ url, request, event, params }: RouteHandlerCallbackOptions): Promise<StreamSource> | StreamSource;
}

/**
 * A shortcut to create a strategy that could be dropped-in to Serwist's router.
 *
 * On browsers that do not support constructing new `ReadableStream`s, this
 * strategy will automatically wait for all the `sourceFunctions` to complete,
 * and create a final response that concatenates their values together.
 *
 * @param sourceFunctions An array of functions similar to `@serwist/routing.handlerCallback`
 * but that instead return a `@serwist/streams.StreamSource` (or a Promise which resolves to one).
 * @param headersInit If there's no `Content-Type` specified, `'text/html'` will be used by default.
 * @returns
 */
export const strategy = (sourceFunctions: StreamsHandlerCallback[], headersInit: HeadersInit): RouteHandlerCallback => {
  return async ({ event, request, url, params }: RouteHandlerCallbackOptions) => {
    const sourcePromises = sourceFunctions.map((fn) => {
      // Ensure the return value of the function is always a promise.
      return Promise.resolve(fn({ event, request, url, params }));
    });

    if (isSupported()) {
      const { done, response } = concatenateToResponse(sourcePromises, headersInit);

      if (event) {
        event.waitUntil(done);
      }
      return response;
    }

    if (process.env.NODE_ENV !== "production") {
      logger.log(`The current browser doesn't support creating response ` + "streams. Falling back to non-streaming response instead.");
    }

    // Fallback to waiting for everything to finish, and concatenating the
    // responses.
    const blobPartsPromises = sourcePromises.map(async (sourcePromise) => {
      const source = await sourcePromise;
      if (source instanceof Response) {
        return source.blob();
      }
      // Technically, a `StreamSource` object can include any valid
      // `BodyInit` type, including `FormData` and `URLSearchParams`, which
      // cannot be passed to the Blob constructor directly, so we have to
      // convert them to actual Blobs first.
      return new Response(source).blob();
    });
    const blobParts = await Promise.all(blobPartsPromises);
    const headers = createHeaders(headersInit);

    // Constructing a new Response from a Blob source is well-supported.
    // So is constructing a new Blob from multiple source Blobs or strings.
    return new Response(new Blob(blobParts), { headers });
  };
};
