/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { SerwistPlugin } from "../../../types.js";

export const cacheOkAndOpaquePlugin: SerwistPlugin = {
  /**
   * Returns a valid response (to allow caching) if the status is 200 (OK) or
   * 0 (opaque).
   *
   * @param options
   * @returns
   * @private
   */
  cacheWillUpdate: async ({ response }) => {
    if (response.status === 200 || response.status === 0) {
      return response;
    }
    return null;
  },
};
