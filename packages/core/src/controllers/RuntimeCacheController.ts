import { parallel } from "@serwist/utils";
import { PrecacheFallbackPlugin, type PrecacheFallbackEntry } from "../lib/precaching/PrecacheFallbackPlugin.js";
import { Strategy } from "../lib/strategies/Strategy.js";
import type { Serwist } from "../Serwist.js";
import type { Controller, RuntimeCaching } from "../types.js";

export interface WarmRuntimeCacheEntry {
  integrity?: string;
  url: string;
}

export interface WarmRuntimeCacheOptions {
  concurrency?: number;
}

export interface FallbackEntry extends PrecacheFallbackEntry {}

export interface FallbacksOptions {
  /**
   * A list of fallback entries.
   */
  entries: FallbackEntry[];
}

export interface RuntimeCacheControllerOptions {
  /**
   * URLs that should be cached as the service worker is installed.
   */
  warmEntries?: (WarmRuntimeCacheEntry | string | Request)[];
  /**
   * Options for `warmEntries`.
   */
  warmOptions?: WarmRuntimeCacheOptions;
  /**
   * Precaches routes so that they can be used as a fallback when
   * a {@linkcode Strategy} fails to generate a response.
   *
   * Note: This option mutates `runtimeCaching`. It also expects the URLs
   * defined in `entries` to have been precached beforehand.
   */
  fallbacks?: FallbacksOptions;
}

export class RuntimeCacheController implements Controller {
  _entries: RuntimeCaching[];
  _options: RuntimeCacheControllerOptions;
  constructor(entries: RuntimeCaching[], options: RuntimeCacheControllerOptions = {}) {
    this._entries = entries;
    this._options = options;
    this.init = this.init.bind(this);
    this.install = this.install.bind(this);
  }

  init(serwist: Serwist): void {
    if (this._options.fallbacks !== undefined) {
      const fallbackPlugin = new PrecacheFallbackPlugin({
        fallbackUrls: this._options.fallbacks.entries,
        precacheController: serwist.precache,
      });

      this._entries.forEach((cacheEntry) => {
        if (
          cacheEntry.handler instanceof Strategy &&
          // This also filters entries with `PrecacheFallbackPlugin` as it also has `handlerDidError`.
          !cacheEntry.handler.plugins.some((plugin) => "handlerDidError" in plugin)
        ) {
          cacheEntry.handler.plugins.push(fallbackPlugin);
        }
      });
    }
    for (const entry of this._entries) {
      serwist.registerCapture(entry.matcher, entry.handler, entry.method);
    }
  }

  async install(event: ExtendableEvent, serwist: Serwist) {
    const concurrency = this._options.warmOptions?.concurrency ?? 10;
    if (this._options.warmEntries) {
      await parallel(concurrency, this._options.warmEntries, async (entry) => {
        const request =
          entry instanceof Request
            ? entry
            : new Request(typeof entry === "string" ? entry : entry.url, {
                integrity: typeof entry !== "string" ? entry.integrity : undefined,
                credentials: "same-origin",
              });
        await serwist.handleRequest({
          request,
          event,
        });
      });
    }
  }

  /**
   * Any assets you wish to cache ahead of time which can't be revisioned
   * should be cached with this method. All assets are cached on install
   * regardless of whether an older version of the request is in the cache.
   *
   * The input can be a string or a [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request).
   *
   * @example
   * ```js
   * // For unrevisioned assets that should always be downloaded
   * // with every service worker update, use this method.
   * serwist.warmRuntimeCache([
   *   "/scripts/main.js',
   *   "/images/default-avater.png",
   *   new Request("/images/logo.png"),
   *   new Request("/api/data.json"),
   * ]);
   * ```
   * @param entries A set of urls to cache when the service worker is installed.
   */
  warmRuntimeCache(entries: (WarmRuntimeCacheEntry | string | Request)[]): void {
    if (!this._options.warmEntries) this._options.warmEntries = [];
    this._options.warmEntries.push(...entries);
  }
}
