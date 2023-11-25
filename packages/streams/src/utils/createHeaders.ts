/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/


/**
 * This is a utility method that determines whether the current browser supports
 * the features required to create streamed responses. Currently, it checks if
 * [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/ReadableStream)
 * is available.
 *
 * @private
 * @param headersInit If there's no `Content-Type` specified, `'text/html'` will be used by default.
 * @returns `true`, if the current browser meets the requirements for
 * streaming responses, and `false` otherwise.
 */
function createHeaders(headersInit = {}): Headers {
  // See https://github.com/GoogleChrome/workbox/issues/1461
  const headers = new Headers(headersInit);
  if (!headers.has("content-type")) {
    headers.set("content-type", "text/html");
  }
  return headers;
}

export { createHeaders };
