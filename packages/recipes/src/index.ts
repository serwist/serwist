/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import "./_version.js";

import type { GoogleFontCacheOptions } from "./googleFontsCache.js";
import { googleFontsCache } from "./googleFontsCache.js";
import type { ImageCacheOptions } from "./imageCache.js";
import { imageCache } from "./imageCache.js";
import type { OfflineFallbackOptions } from "./offlineFallback.js";
import { offlineFallback } from "./offlineFallback.js";
import type { PageCacheOptions } from "./pageCache.js";
import { pageCache } from "./pageCache.js";
import type { StaticResourceOptions } from "./staticResourceCache.js";
import { staticResourceCache } from "./staticResourceCache.js";
import type { WarmStrategyCacheOptions } from "./warmStrategyCache.js";
import { warmStrategyCache } from "./warmStrategyCache.js";

export {
  googleFontsCache,
  imageCache,
  offlineFallback,
  pageCache,
  staticResourceCache,
  warmStrategyCache,
};
export type {
  GoogleFontCacheOptions,
  ImageCacheOptions,
  OfflineFallbackOptions,
  PageCacheOptions,
  StaticResourceOptions,
  WarmStrategyCacheOptions,
};
