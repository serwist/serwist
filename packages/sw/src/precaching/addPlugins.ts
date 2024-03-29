/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { SerwistPlugin } from "@serwist/core";

import { getOrCreatePrecacheController } from "./utils/getOrCreatePrecacheController.js";

/**
 * Adds plugins to the precaching strategy.
 *
 * @param plugins
 */
export const addPlugins = (plugins: SerwistPlugin[]): void => {
  const precacheController = getOrCreatePrecacheController();
  precacheController.strategy.plugins.push(...plugins);
};
