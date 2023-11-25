/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { getManifest } from "./get-manifest.js";
import { injectManifest } from "./inject-manifest.js";
import { getModuleURL } from "./lib/cdn-utils.js";
import { copySerwistLibraries as copySerwistLibraries } from "./lib/copy-serwist-libraries.js";
import { escapeRegExp } from "./lib/escape-regexp.js";
import { getSourceMapURL } from "./lib/get-source-map-url.js";
import { replaceAndUpdateSourceMap } from "./lib/replace-and-update-source-map.js";
import { transformManifest } from "./lib/transform-manifest.js";
import { validateWebpackInjectManifestOptions } from "./lib/validate-options.js";

export {
  copySerwistLibraries,
  escapeRegExp,
  getManifest,
  getModuleURL,
  getSourceMapURL,
  injectManifest,
  replaceAndUpdateSourceMap,
  transformManifest,
  validateWebpackInjectManifestOptions,
};

export * from "./types.js";
