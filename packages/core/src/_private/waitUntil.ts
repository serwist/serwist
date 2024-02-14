/*
  Copyright 2020 Google LLC
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

/**
 * A utility method that makes it easier to use `event.waitUntil` with
 * async functions and return the result.
 *
 * @param event
 * @param asyncFn
 * @returns
 * @private
 */
export const waitUntil = <T = any>(event: ExtendableEvent, asyncFn: () => Promise<T>): Promise<T> => {
  const returnPromise = asyncFn();
  event.waitUntil(returnPromise);
  return returnPromise;
};
