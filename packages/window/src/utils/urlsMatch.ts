/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

/**
 * Returns true if two URLs have the same `.href` property. The URLs can be
 * relative, and if they are the current location href is used to resolve URLs.
 *
 * @private
 * @param url1
 * @param url2
 * @returns
 */
export function urlsMatch(url1: string, url2: string): boolean {
  const { href } = location;
  return new URL(url1, href).href === new URL(url2, href).href;
}
