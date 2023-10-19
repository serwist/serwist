/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { googleFontsCache, GoogleFontCacheOptions } from "./googleFontsCache.js";
import { imageCache, ImageCacheOptions } from "./imageCache.js";
import {
  staticResourceCache,
  StaticResourceOptions,
} from "./staticResourceCache.js";
import { pageCache, PageCacheOptions } from "./pageCache.js";
import { offlineFallback, OfflineFallbackOptions } from "./offlineFallback.js";
import {
  warmStrategyCache,
  WarmStrategyCacheOptions,
} from "./warmStrategyCache.js";

import "./_version.js";

export {
  GoogleFontCacheOptions,
  googleFontsCache,
  imageCache,
  ImageCacheOptions,
  offlineFallback,
  OfflineFallbackOptions,
  pageCache,
  PageCacheOptions,
  staticResourceCache,
  StaticResourceOptions,
  warmStrategyCache,
  WarmStrategyCacheOptions,
};
