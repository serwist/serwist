/*
  Copyright 2019 Google LLC
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

/**
 * Returns a promise that resolves and the passed number of milliseconds.
 * This utility is an async/await-friendly version of `setTimeout`.
 *
 * @param ms
 * @returns
 * @private
 */

export function timeout(ms: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
