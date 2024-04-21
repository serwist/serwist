/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { PrecacheRouteOptions } from "../types.js";
import { removeIgnoredSearchParams } from "./removeIgnoredSearchParams.js";

/**
 * Generator function that yields possible variations on the original URL to
 * check, one at a time.
 *
 * @param url
 * @param options
 *
 * @private
 */
export function* generateURLVariations(
  url: string,
  {
    directoryIndex = "index.html",
    ignoreURLParametersMatching = [/^utm_/, /^fbclid$/],
    cleanURLs = true,
    urlManipulation,
  }: PrecacheRouteOptions = {},
): Generator<string, void, unknown> {
  const urlObject = new URL(url, location.href);
  urlObject.hash = "";
  yield urlObject.href;

  const urlWithoutIgnoredParams = removeIgnoredSearchParams(urlObject, ignoreURLParametersMatching);
  yield urlWithoutIgnoredParams.href;

  if (directoryIndex && urlWithoutIgnoredParams.pathname.endsWith("/")) {
    const directoryURL = new URL(urlWithoutIgnoredParams.href);
    directoryURL.pathname += directoryIndex;
    yield directoryURL.href;
  }

  if (cleanURLs) {
    const cleanURL = new URL(urlWithoutIgnoredParams.href);
    cleanURL.pathname += ".html";
    yield cleanURL.href;
  }

  if (urlManipulation) {
    const additionalURLs = urlManipulation({ url: urlObject });
    for (const urlToAttempt of additionalURLs) {
      yield urlToAttempt.href;
    }
  }
}
