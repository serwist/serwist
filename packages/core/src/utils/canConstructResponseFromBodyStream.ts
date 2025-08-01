/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

let supportStatus: boolean | undefined;

/**
 * A utility function that determines whether the current browser supports
 * constructing a new response from a `response.body` stream.
 *
 * @returns `true`, if the current browser can successfully construct
 * a response from a `response.body` stream, `false` otherwise.
 * @private
 */
function canConstructResponseFromBodyStream(): boolean {
  if (supportStatus === undefined) {
    const testResponse = new Response("");

    if ("body" in testResponse) {
      try {
        new Response(testResponse.body);
        supportStatus = true;
      } catch {
        supportStatus = false;
      }
    }
    supportStatus = false;
  }

  return supportStatus;
}

export { canConstructResponseFromBodyStream };
