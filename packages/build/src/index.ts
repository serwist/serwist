/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { generateSW } from "./generate-sw.js";
import { getManifest } from "./get-manifest.js";
import { injectManifest } from "./inject-manifest.js";
import { getModuleURL } from "./lib/cdn-utils.js";
import { copyWorkboxLibraries as copySerwistLibraries } from "./lib/copy-serwist-libraries.js";

/**
 * @module workbox-build
 */
export {
  copySerwistLibraries,
  generateSW,
  getManifest,
  getModuleURL,
  injectManifest,
};

export * from "./types.js";
