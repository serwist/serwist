/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { StrategyPlugin } from "#lib/types.js";

export const pluginUtils = {
  filter: (plugins: StrategyPlugin[], callbackName: string): StrategyPlugin[] => {
    return plugins.filter((plugin) => callbackName in plugin);
  },
};
