import type { RouteHandler, RouteMatchCallback } from "@serwist/core";
import type { HTTPMethod } from "../routing/utils/constants.js";

export interface RuntimeCaching {
  /**
   * The HTTP method to match against. The default value of `'GET'` is normally
   * sufficient, unless you explicitly need to match `'POST'`, `'PUT'`, or
   * another type of request.
   * @default "GET"
   */
  method?: HTTPMethod;
  /**
   * This match criteria determines whether the configured handler will
   * generate a response for any requests that don't match one of the precached
   * URLs. If multiple `RuntimeCaching` routes are defined, then the first one
   * whose `matcher` matches will be the one that responds.
   *
   * This value directly maps to the first parameter passed to
   * `@serwist/routing.registerRoute`. It's recommended to use a
   * `@serwist/core.RouteMatchCallback` function for greatest flexibility.
   */
  matcher: RegExp | string | RouteMatchCallback;
  /**
   * This determines how the runtime route will generate a response. It
   * can be a `@serwist/core.RouteHandler` callback function with custom
   * response logic.
   */
  handler: RouteHandler;
}
