import type { Strategy } from "serwist/strategies";

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
export const warmStrategyCache = (options: WarmStrategyCacheOptions): void => {
  self.addEventListener("install", (event) => {
    const done = options.urls.map(
      (path) =>
        options.strategy.handleAll({
          event,
          request: new Request(path),
        })[1],
    );

    event.waitUntil(Promise.all(done));
  });
};
