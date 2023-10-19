import { Strategy } from "@serwist/strategies";

import "./_version.js";

export interface WarmStrategyCacheOptions {
  /**
   * Paths to warm the strategy's cache with.
   */
  urls: string[];
  /**
   * Strategy to use.
   */
  strategy: Strategy;
}

// Give TypeScript the correct global.
declare let self: ServiceWorkerGlobalScope;

/**
 * @param options 
 */
function warmStrategyCache(options: WarmStrategyCacheOptions): void {
  self.addEventListener("install", (event) => {
    const done = options.urls.map(
      (path) =>
        options.strategy.handleAll({
          event,
          request: new Request(path),
        })[1]
    );

    event.waitUntil(Promise.all(done));
  });
}

export { warmStrategyCache };
