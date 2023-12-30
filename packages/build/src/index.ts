/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import { errors } from "./lib/errors.js";
import { getManifest } from "./get-manifest.js";
import { injectManifest } from "./inject-manifest.js";
// import { getModuleURL } from "./lib/cdn-utils.js";
// import { copySerwistLibraries as copySerwistLibraries } from "./lib/copy-serwist-libraries.js";
import { escapeRegExp } from "./lib/escape-regexp.js";
import { getSourceMapURL } from "./lib/get-source-map-url.js";
import { replaceAndUpdateSourceMap } from "./lib/replace-and-update-source-map.js";
import { transformManifest } from "./lib/transform-manifest.js";
import { validateInjectManifestOptions, validateWebpackInjectManifestOptions } from "./lib/validate-options.js";

export {
  // Reintroduce this feature some time soon.
  // copySerwistLibraries,
  escapeRegExp,
  errors,
  getManifest,
  // getModuleURL,
  getSourceMapURL,
  injectManifest,
  replaceAndUpdateSourceMap,
  transformManifest,
  validateInjectManifestOptions,
  validateWebpackInjectManifestOptions,
};

export * from "./types.js";
