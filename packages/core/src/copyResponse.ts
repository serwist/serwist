/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { SerwistError } from "./utils/SerwistError.js";
import { canConstructResponseFromBodyStream } from "./utils/canConstructResponseFromBodyStream.js";

/**
 * Allows developers to copy a response and modify its `headers`, `status`,
 * or `statusText` values (the [valid options](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response#options)
 * when constructing a `Response` object).
 * To modify these values, pass a function as the second argument. That
 * function will be invoked with the options of the initial `Response` object.
 * The return value of this function will be used as the options for the new `Response` object.
 * To change the values either modify the passed parameter(s) and return it or return a totally
 * new object.
 *
 * This method is intentionally limited to same-origin responses, regardless of
 * whether CORS was used or not.
 *
 * @param response The initial response.
 * @param modifier The function used to modify the options of the `Response` object.
 */
export const copyResponse = async (response: Response, modifier?: (responseInit: ResponseInit) => ResponseInit): Promise<Response> => {
  let origin = null;
  // If response.url isn't set, assume it's cross-origin and keep origin null.
  if (response.url) {
    const responseURL = new URL(response.url);
    origin = responseURL.origin;
  }

  if (origin !== self.location.origin) {
    throw new SerwistError("cross-origin-copy-response", { origin });
  }

  const clonedResponse = response.clone();

  // Create a fresh `ResponseInit` object by cloning the headers.
  const responseInit: ResponseInit = {
    headers: new Headers(clonedResponse.headers),
    status: clonedResponse.status,
    statusText: clonedResponse.statusText,
  };

  // Apply any user modifications.
  const modifiedResponseInit = modifier ? modifier(responseInit) : responseInit;

  // Create the new response from the body stream and `ResponseInit`
  // modifications. Note: not all browsers support the Response.body stream,
  // so fall back to reading the entire body into memory as a blob.
  const body = canConstructResponseFromBodyStream() ? clonedResponse.body : await clonedResponse.blob();

  return new Response(body, modifiedResponseInit);
};
