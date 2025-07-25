/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

let supportStatus: boolean | undefined;

/**
 * A utility function that determines whether the current browser supports
 * constructing a [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/ReadableStream)
 * object.
 *
 * @returns `true`, if the current browser can successfully construct a `ReadableStream`, `false` otherwise.
 *
 * @private
 */
function canConstructReadableStream(): boolean {
  if (supportStatus === undefined) {
    // See https://github.com/GoogleChrome/workbox/issues/1473
    try {
      new ReadableStream({ start() {} });
      supportStatus = true;
    } catch {
      supportStatus = false;
    }
  }

  return supportStatus;
}

export { canConstructReadableStream };
