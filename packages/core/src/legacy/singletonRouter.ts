/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { Router } from "./Router.js";

let defaultRouter: Router | undefined;

/**
 * Creates a new, singleton {@linkcode Router} if one does not exist. If one does
 * already exist, that instance is returned. This instance is used by
 * Serwist's {@linkcode Router}-dependent functions and classes unless you provide
 * a different {@linkcode Router} to them.
 *
 * @returns The singleton {@linkcode Router}.
 * @deprecated
 */
export const getSingletonRouter = (): Router => {
  if (!defaultRouter) {
    defaultRouter = new Router();

    // The helpers that use the default Router assume these listeners exist.
    defaultRouter.addFetchListener();
    defaultRouter.addCacheListener();
  }
  return defaultRouter;
};

/**
 * Changes the singleton {@linkcode Router} to a different instance. This is meant for when you do not
 * want to pass your own {@linkcode Router} to every one of Serwist's {@linkcode Router}-dependent functions and classes.
 * If this or {@linkcode getSingletonRouter} has been called before, it removes the listeners of the
 * previous singleton {@linkcode Router}. It also adds those of the new one, so you need not do that yourself.
 *
 * It is highly recommended that you call this before anything else, if you plan on doing so.
 *
 * @example
 * ```js
 * import { Router, setSingletonRouter } from "serwist/legacy";
 *
 * const router = new Router();
 *
 * setSingletonRouter(router);
 *
 * router.registerRoute(
 *   new Route(
 *     /\/api\/.*\/*.json/,
 *     new NetworkOnly(),
 *     "POST",
 *   ),
 * );
 * ```
 * @param router
 * @returns The new singleton {@linkcode Router}.
 * @deprecated
 */
export const setSingletonRouter = (router: Router): Router => {
  if (defaultRouter) {
    defaultRouter.removeFetchListener();
    defaultRouter.removeCacheListener();
  }
  defaultRouter = router;
  defaultRouter.addFetchListener();
  defaultRouter.addCacheListener();
  return defaultRouter;
};
