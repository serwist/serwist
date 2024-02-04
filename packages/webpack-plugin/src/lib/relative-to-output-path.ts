/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import upath from "upath";
import type { Compilation } from "webpack";

/**
 * @param compilation The webpack compilation.
 * @param path The original path value.
 *
 * @returns If path was not absolute, the returns path as-is.
 * Otherwise, returns path relative to the compilation's output path.
 *
 * @private
 */
export const relativeToOutputPath = (compilation: Compilation, path: string): string => {
  // See https://github.com/jantimon/html-webpack-plugin/pull/266/files#diff-168726dbe96b3ce427e7fedce31bb0bcR38
  if (upath.resolve(path) === upath.normalize(path)) {
    return upath.relative(compilation.options.output.path!, path);
  }

  // Otherwise, return swDest as-is.
  return path;
};
