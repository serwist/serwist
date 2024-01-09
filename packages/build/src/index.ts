/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import stringify from "fast-json-stable-stringify";

import { getManifest } from "./get-manifest.js";
import { injectManifest } from "./inject-manifest.js";
import { errors } from "./lib/errors.js";
// import { getModuleURL } from "./lib/cdn-utils.js";
// import { copySerwistLibraries as copySerwistLibraries } from "./lib/copy-serwist-libraries.js";
import { escapeRegExp } from "./lib/escape-regexp.js";
import { getFileManifestEntries } from "./lib/get-file-manifest-entries.js";
import { getSourceMapURL } from "./lib/get-source-map-url.js";
import { rebasePath } from "./lib/rebase-path.js";
import { replaceAndUpdateSourceMap } from "./lib/replace-and-update-source-map.js";
import { transformManifest } from "./lib/transform-manifest.js";
import { translateURLToSourcemapPaths } from "./lib/translate-url-to-sourcemap-paths.js";
import { validateInjectManifestOptions, validateViteInjectManifestOptions, validateWebpackInjectManifestOptions } from "./lib/validate-options.js";

export {
  errors,
  // Reintroduce this feature some time soon.
  // copySerwistLibraries,
  escapeRegExp,
  // getModuleURL,
  getFileManifestEntries,
  getManifest,
  getSourceMapURL,
  injectManifest,
  rebasePath,
  replaceAndUpdateSourceMap,
  stringify,
  transformManifest,
  translateURLToSourcemapPaths,
  validateInjectManifestOptions,
  validateViteInjectManifestOptions,
  validateWebpackInjectManifestOptions,
};

export * from "./types.js";
