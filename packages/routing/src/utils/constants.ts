/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

export type HTTPMethod = "DELETE" | "GET" | "HEAD" | "PATCH" | "POST" | "PUT";

/**
 * The default HTTP method, 'GET', used when there's no specific method
 * configured for a route.
 *
 * @private
 */
export const defaultMethod = "GET" satisfies HTTPMethod;

/**
 * The list of valid HTTP methods associated with requests that could be routed.
 *
 * @private
 */
export const validMethods = ["DELETE", "GET", "HEAD", "PATCH", "POST", "PUT"] satisfies HTTPMethod[];
