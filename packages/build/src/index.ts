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
import { escapeRegExp } from "./lib/escape-regexp.js";
import { getFileManifestEntries } from "./lib/get-file-manifest-entries.js";
import { getSourceMapURL } from "./lib/get-source-map-url.js";
import { rebasePath } from "./lib/rebase-path.js";
import { replaceAndUpdateSourceMap } from "./lib/replace-and-update-source-map.js";
import { transformManifest } from "./lib/transform-manifest.js";
import { translateURLToSourcemapPaths } from "./lib/translate-url-to-sourcemap-paths.js";
import { validateGetManifestOptions, validateInjectManifestOptions } from "./lib/validate-options.js";

export {
  errors,
  escapeRegExp,
  getFileManifestEntries,
  getManifest,
  getSourceMapURL,
  injectManifest,
  rebasePath,
  replaceAndUpdateSourceMap,
  stringify,
  transformManifest,
  translateURLToSourcemapPaths,
  validateGetManifestOptions,
  validateInjectManifestOptions,
};

export type * from "./types.js";
