/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { Route } from "./Route.js";
import type { RouteHandler, RouteMatchCallbackOptions } from "./types.js";
import { assert } from "./utils/assert.js";
import { logger } from "./utils/logger.js";

export interface NavigationRouteMatchOptions {
  /**
   * If any of these patterns
   * match the URL's pathname and search parameter, the route will handle the
   * request (assuming the denylist doesn't match).
   *
   * @default [/./]
   */
  allowlist?: RegExp[];
  /**
   * If any of these patterns match, the route will not handle the request (even if a allowlist RegExp matches).
   */
  denylist?: RegExp[];
}

/**
 * `NavigationRoute` makes it easy to create a `Route` object that matches navigation requests.
 *
 * It will only match incoming Requests whose [`mode`](https://fetch.spec.whatwg.org/#concept-request-mode) is set to `"navigate"`.
 *
 * You can optionally only apply this route to a subset of navigation requests
 * by using one or both of the `denylist` and `allowlist` parameters.
 */
export class NavigationRoute extends Route {
  private readonly _allowlist: RegExp[];
  private readonly _denylist: RegExp[];

  /**
   * If both `denylist` and `allowlist` are provided, `denylist` will
   * take precedence.
   *
   * The regular expressions in `allowlist` and `denylist`
   * are matched against the concatenated
   * [`pathname`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/pathname)
   * and [`search`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/search)
   * portions of the requested URL.
   *
   * *Note*: These RegExps may be evaluated against every destination URL during
   * a navigation. Avoid using
   * [complex RegExps](https://github.com/GoogleChrome/workbox/issues/3077),
   * or else your users may see delays when navigating your site.
   *
   * @param handler A callback function that returns a `Promise` resulting in a `Response`.
   * @param options
   */
  constructor(handler: RouteHandler, { allowlist = [/./], denylist = [] }: NavigationRouteMatchOptions = {}) {
    if (process.env.NODE_ENV !== "production") {
      assert!.isArrayOfClass(allowlist, RegExp, {
        moduleName: "serwist",
        className: "NavigationRoute",
        funcName: "constructor",
        paramName: "options.allowlist",
      });
      assert!.isArrayOfClass(denylist, RegExp, {
        moduleName: "serwist",
        className: "NavigationRoute",
        funcName: "constructor",
        paramName: "options.denylist",
      });
    }

    super((options: RouteMatchCallbackOptions) => this._match(options), handler);

    this._allowlist = allowlist;
    this._denylist = denylist;
  }

  /**
   * Routes match handler.
   *
   * @param options
   * @returns
   * @private
   */
  private _match({ url, request }: RouteMatchCallbackOptions): boolean {
    if (request && request.mode !== "navigate") {
      return false;
    }

    const pathnameAndSearch = url.pathname + url.search;

    for (const regExp of this._denylist) {
      if (regExp.test(pathnameAndSearch)) {
        if (process.env.NODE_ENV !== "production") {
          logger.log(
            `The navigation route ${pathnameAndSearch} is not being used, since the URL matches this denylist pattern: ${regExp.toString()}`,
          );
        }
        return false;
      }
    }

    if (this._allowlist.some((regExp) => regExp.test(pathnameAndSearch))) {
      if (process.env.NODE_ENV !== "production") {
        logger.debug(`The navigation route ${pathnameAndSearch} is being used.`);
      }
      return true;
    }

    if (process.env.NODE_ENV !== "production") {
      logger.log(`The navigation route ${pathnameAndSearch} is not being used, since the URL being navigated to doesn't match the allowlist.`);
    }
    return false;
  }
}
