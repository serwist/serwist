/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { StrategyPlugin, StrategyPluginCallbackParam } from "#lib/types.js";

/**
 * A plugin designed to determine the number of assets that were updated (or not updated)
 * during the `install` event.
 *
 * @private
 */
export class PrecacheInstallReportPlugin implements StrategyPlugin {
  updatedURLs: string[] = [];
  notUpdatedURLs: string[] = [];

  handlerWillStart: StrategyPlugin["handlerWillStart"] = async ({ request, state }: StrategyPluginCallbackParam["handlerWillStart"]) => {
    // TODO: `state` should never be undefined...
    if (state) {
      state.originalRequest = request;
    }
  };

  cachedResponseWillBeUsed: StrategyPlugin["cachedResponseWillBeUsed"] = async ({
    event,
    state,
    cachedResponse,
  }: StrategyPluginCallbackParam["cachedResponseWillBeUsed"]) => {
    if (event.type === "install") {
      if (state?.originalRequest && state.originalRequest instanceof Request) {
        // TODO: `state` should never be undefined...
        const url = state.originalRequest.url;

        if (cachedResponse) {
          this.notUpdatedURLs.push(url);
        } else {
          this.updatedURLs.push(url);
        }
      }
    }
    return cachedResponse;
  };
}
