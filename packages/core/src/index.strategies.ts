import { CacheFirst } from "./strategies/CacheFirst.js";
import { CacheOnly } from "./strategies/CacheOnly.js";
import type { NetworkFirstOptions } from "./strategies/NetworkFirst.js";
import { NetworkFirst } from "./strategies/NetworkFirst.js";
import type { NetworkOnlyOptions } from "./strategies/NetworkOnly.js";
import { NetworkOnly } from "./strategies/NetworkOnly.js";
import { PrecacheOnly } from "./strategies/PrecacheOnly.js";
import { StaleWhileRevalidate } from "./strategies/StaleWhileRevalidate.js";
import type { StrategyOptions } from "./strategies/Strategy.js";
import { Strategy } from "./strategies/Strategy.js";
import { StrategyHandler } from "./strategies/StrategyHandler.js";

// See https://github.com/GoogleChrome/workbox/issues/2946
declare global {
  interface FetchEvent {
    // See https://github.com/GoogleChrome/workbox/issues/2974
    readonly preloadResponse: Promise<any>;
  }
}

/**
 * There are common caching strategies that most service workers will need
 * and use. This module provides simple implementations of these strategies.
 */
export { CacheFirst, CacheOnly, NetworkFirst, NetworkOnly, PrecacheOnly, StaleWhileRevalidate, Strategy, StrategyHandler };

export type { NetworkFirstOptions, NetworkOnlyOptions, StrategyOptions };
