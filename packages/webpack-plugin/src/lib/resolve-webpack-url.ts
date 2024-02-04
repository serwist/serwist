/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

/**
 * Resolves a url in the way that webpack would (with string concatenation)
 *
 * Use publicPath + filePath instead of url.resolve(publicPath, filePath) see:
 * https://webpack.js.org/configuration/output/#output-publicpath
 *
 * @param publicPath The publicPath value from webpack's compilation.
 * @param paths File paths to join
 * @returns Joined file path
 * @private
 */
export const resolveWebpackURL = (publicPath: string, ...paths: string[]): string => {
  // This is a change in webpack v5.
  // See https://github.com/jantimon/html-webpack-plugin/pull/1516
  if (publicPath === "auto") {
    return paths.join("");
  }
  return [publicPath, ...paths].join("");
};
