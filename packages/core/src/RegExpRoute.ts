/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { Route } from "./Route.js";
import type { HTTPMethod } from "./constants.js";
import type { RouteHandler, RouteMatchCallback, RouteMatchCallbackOptions } from "./types.js";
import { assert } from "./utils/assert.js";
import { logger } from "./utils/logger.js";

/**
 * `RegExpRoute` makes it easy to create a `Route` object with a regular expression.
 *
 * For same-origin requests the `RegExp` only needs to match part of the URL. For
 * requests against third-party servers, you must define a `RegExp` that matches
 * the start of the URL.
 */
export class RegExpRoute extends Route {
  /**
   * If the regular expression contains
   * [capture groups](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#grouping-back-references),
   * the captured values will be passed to the `params` argument.
   *
   * @param regExp The regular expression to match against URLs.
   * @param handler A callback function that returns a `Promise` resulting in a `Response`.
   * @param method The HTTP method to match the route against. Defaults to `GET`.
   * against.
   */
  constructor(regExp: RegExp, handler: RouteHandler, method?: HTTPMethod) {
    if (process.env.NODE_ENV !== "production") {
      assert!.isInstance(regExp, RegExp, {
        moduleName: "serwist",
        className: "RegExpRoute",
        funcName: "constructor",
        paramName: "pattern",
      });
    }

    const match: RouteMatchCallback = ({ url }: RouteMatchCallbackOptions) => {
      const result = regExp.exec(url.href);

      // Return immediately if there's no match.
      if (!result) {
        return;
      }

      // Require that the match start at the first character in the URL string
      // if it's a cross-origin request.
      // See https://github.com/GoogleChrome/workbox/issues/281 for the context
      // behind this behavior.
      if (url.origin !== location.origin && result.index !== 0) {
        if (process.env.NODE_ENV !== "production") {
          logger.debug(
            `The regular expression '${regExp.toString()}' only partially matched against the cross-origin URL '${url.toString()}'. RegExpRoute's will only handle cross-origin requests if they match the entire URL.`,
          );
        }

        return;
      }

      // If the route matches, but there aren't any capture groups defined, then
      // this will return [], which is truthy and therefore sufficient to
      // indicate a match.
      // If there are capture groups, then it will return their values.
      return result.slice(1);
    };

    super(match, handler, method);
  }
}
