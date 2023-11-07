/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import "./_version.mjs";

/**
 * A `ModulePathCallback` function can be used to modify the modify the where
 * Serwist modules are loaded.
 *
 * @callback ~ModulePathCallback
 * @param moduleName The name of the module to load (i.e.
 * '@serwist/core', '@serwist/recaching' etc.).
 * @param debug When true, `dev` builds should be loaded, otherwise
 * load `prod` builds.
 * @returns This callback should return a path of module. This will
 * be passed to `importScripts()`.
  */
