/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { SerwistPlugin, SerwistPluginCallbackParam } from "@serwist/core";

/**
 * A plugin, designed to be used with PrecacheController, to determine the
 * of assets that were updated (or not updated) during the install event.
 *
 * @private
 */
class PrecacheInstallReportPlugin implements SerwistPlugin {
  updatedURLs: string[] = [];
  notUpdatedURLs: string[] = [];

  handlerWillStart: SerwistPlugin["handlerWillStart"] = async ({ request, state }: SerwistPluginCallbackParam["handlerWillStart"]) => {
    // TODO: `state` should never be undefined...
    if (state) {
      state.originalRequest = request;
    }
  };

  cachedResponseWillBeUsed: SerwistPlugin["cachedResponseWillBeUsed"] = async ({
    event,
    state,
    cachedResponse,
  }: SerwistPluginCallbackParam["cachedResponseWillBeUsed"]) => {
    if (event.type === "install") {
      if (state && state.originalRequest && state.originalRequest instanceof Request) {
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

export { PrecacheInstallReportPlugin };
