/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

// Callbacks to be executed whenever there's a quota error.
// biome-ignore lint/complexity/noBannedTypes: Can't change Function type right now.
const quotaErrorCallbacks: Set<Function> = new Set();

export { quotaErrorCallbacks };
