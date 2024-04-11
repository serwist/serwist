/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { SerwistPlugin } from "../types.js";
import { getSingletonPrecacheController } from "./singletonPrecacheController.js";

/**
 * Adds plugins to the precaching strategy.
 *
 * @param plugins
 * @deprecated
 */
export const addPlugins = (plugins: SerwistPlugin[]): void => {
  const precacheController = getSingletonPrecacheController();
  precacheController.strategy.plugins.push(...plugins);
};
