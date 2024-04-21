/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { RouteHandler, RouteHandlerObject } from "../types.js";
import { assert } from "./assert.js";

/**
 * @param handler Either a function, or an object with a
 * 'handle' method.
 * @returns An object with a handle method.
 *
 * @private
 */
export const normalizeHandler = (handler: RouteHandler): RouteHandlerObject => {
  if (handler && typeof handler === "object") {
    if (process.env.NODE_ENV !== "production") {
      assert!.hasMethod(handler, "handle", {
        moduleName: "serwist",
        className: "Route",
        funcName: "constructor",
        paramName: "handler",
      });
    }
    return handler;
  }
  if (process.env.NODE_ENV !== "production") {
    assert!.isType(handler, "function", {
      moduleName: "serwist",
      className: "Route",
      funcName: "constructor",
      paramName: "handler",
    });
  }
  return { handle: handler };
};
