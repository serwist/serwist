/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { Router } from "../Router.js";

let defaultRouter: Router;

/**
 * Creates a new, singleton Router instance if one does not exist. If one
 * does already exist, that instance is returned.
 *
 * @private
 * @returns
 */
export const getOrCreateDefaultRouter = (): Router => {
  if (!defaultRouter) {
    defaultRouter = new Router();

    // The helpers that use the default Router assume these listeners exist.
    defaultRouter.addFetchListener();
    defaultRouter.addCacheListener();
  }
  return defaultRouter;
};
