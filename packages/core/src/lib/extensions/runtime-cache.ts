import { parallel } from "@serwist/utils";
import type { Serwist } from "#lib/core.js";
import type { Extension } from "#lib/extension.js";
import { handleRequest, registerCapture } from "#lib/functions/router.js";
import type { Strategy } from "../strategies/core.js";
import type { RuntimeCaching } from "../types.js";
import { type PrecacheFallbackEntry, PrecacheFallbackPlugin } from "./precache/plugin-fallback.js";

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

export interface RuntimeCacheOptions {
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

export class RuntimeCache implements Extension {
  _entries: RuntimeCaching[];
  _options: RuntimeCacheOptions;
  constructor(entries: RuntimeCaching[], options: RuntimeCacheOptions = {}) {
    this._entries = entries;
    this._options = options;
    this.init = this.init.bind(this);
    this.install = this.install.bind(this);
  }

  init({ serwist }: { serwist: Serwist }): void {
    if (this._options.fallbacks !== undefined) {
      const fallbackPlugin = new PrecacheFallbackPlugin({
        fallbackUrls: this._options.fallbacks.entries,
        serwist,
      });

      this._entries.forEach((cacheEntry) => {
        if (
          "plugins" in cacheEntry.handler &&
          Array.isArray(cacheEntry.handler.plugins) &&
          // This also filters entries with `PrecacheFallbackPlugin` as it also has `handlerDidError`.
          !cacheEntry.handler.plugins.some((plugin) => "handlerDidError" in plugin)
        ) {
          cacheEntry.handler.plugins.push(fallbackPlugin);
        }
      });
    }
    for (const entry of this._entries) {
      registerCapture(serwist, entry.matcher, entry.handler, entry.method);
    }
  }

  async install({ event, serwist }: { event: ExtendableEvent; serwist: Serwist }) {
    const concurrency = this._options.warmOptions?.concurrency ?? 10;
    if (this._options.warmEntries) {
      await parallel(concurrency, this._options.warmEntries, async (entry) => {
        const request =
          entry instanceof Request
            ? entry
            : typeof entry === "string"
              ? new Request(entry, {
                  credentials: "same-origin",
                })
              : new Request(entry.url, {
                  integrity: entry.integrity,
                  credentials: "same-origin",
                });

        await handleRequest(serwist, {
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
