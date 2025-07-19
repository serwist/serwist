/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import { assert } from "#utils/assert.js";
import { logger } from "#utils/logger.js";
import { normalizeHandler } from "#utils/normalizeHandler.js";
import type { HTTPMethod } from "./constants.js";
import { defaultMethod, validMethods } from "./constants.js";
import type { RouteHandler, RouteHandlerObject, RouteMatchCallback, RouteMatchCallbackOptions } from "./types.js";

/**
 * A `Route` consists of a pair of callback functions, `match` and `handler`.
 * The `match` callback determines if a route should be used to handle a
 * request by returning a truthy value if it can. The `handler` callback
 * is called when the route matches and should return a promise that resolves
 * to a response.
 */
export class Route {
  handler: RouteHandlerObject;
  match: RouteMatchCallback;
  method: HTTPMethod;
  catchHandler?: RouteHandlerObject;

  /**
   * Constructor for Route class.
   *
   * @param match A callback function that determines whether the
   * route matches a given `fetch` event by returning a truthy value.
   * @param handler A callback function that returns a `Promise` resolving
   * to a `Response`.
   * @param method The HTTP method to match the route against. Defaults
   * to `GET`.
   */
  constructor(match: RouteMatchCallback, handler: RouteHandler, method: HTTPMethod = defaultMethod) {
    if (process.env.NODE_ENV !== "production") {
      assert!.isType(match, "function", {
        moduleName: "serwist",
        className: "Route",
        funcName: "constructor",
        paramName: "match",
      });

      if (method) {
        assert!.isOneOf(method, validMethods, { paramName: "method" });
      }
    }

    // These values are referenced directly by Router so cannot be
    // altered by minificaton.
    this.handler = normalizeHandler(handler);
    this.match = match;
    this.method = method;
  }

  /**
   *
   * @param handler A callback function that returns a Promise resolving
   * to a Response.
   */
  setCatchHandler(handler: RouteHandler): void {
    this.catchHandler = normalizeHandler(handler);
  }
}

/**
 * A class that makes it easy to create a {@linkcode Route} object with a regular expression.
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
   * @param method The HTTP method to match the {@linkcode Route} against. Defaults to `GET`.
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
 * A class that makes it easy to create a {@linkcode Route} object that matches navigation requests.
 *
 * It will only match incoming requests whose [`mode`](https://fetch.spec.whatwg.org/#concept-request-mode) is set to `"navigate"`.
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
