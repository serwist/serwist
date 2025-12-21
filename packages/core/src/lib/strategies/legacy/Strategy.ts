/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { HandlerCallbackOptions } from "#lib/types.js";
import { createStrategy, type StrategyOptions, type Strategy as StrategyStruct } from "../core.js";
import { StrategyHandler } from "./StrategyHandler.js";

export type { StrategyOptions };

/**
 * Abstract class for implementing runtime caching strategies.
 *
 * Custom strategies should extend this class and leverage `StrategyHandler`, which will ensure all relevant cache options,
 * fetch options, and plugins are used (per the current strategy instance), to perform all fetching and caching logic.
 */
export abstract class Strategy implements StrategyStruct {
  get cacheName() {
    return this.instance.cacheName;
  }
  set cacheName(value) {
    this.instance.cacheName = value;
  }
  get plugins() {
    return this.instance.plugins;
  }
  set plugins(value) {
    this.instance.plugins = value;
  }
  get fetchOptions() {
    return this.instance.fetchOptions;
  }
  set fetchOptions(value) {
    this.instance.fetchOptions = value;
  }
  get matchOptions() {
    return this.instance.matchOptions;
  }
  set matchOptions(value) {
    this.instance.matchOptions = value;
  }

  private instance: StrategyStruct;

  protected abstract _handle(request: Request, handler: StrategyHandler): Promise<Response | undefined>;

  /**
   * Creates a new instance of the strategy and sets all documented option
   * properties as public instance properties.
   *
   * Note: if a custom strategy class extends the base Strategy class and does
   * not need more than these properties, it does not need to define its own
   * constructor.
   *
   * @param options
   */
  constructor(options: StrategyOptions = {}) {
    this.instance = createStrategy(options, (request, handler) => {
      return this._handle(request, new StrategyHandler(handler));
    });
  }

  handle(options: FetchEvent | HandlerCallbackOptions): Promise<Response> {
    return this.instance.handle(options);
  }

  handleAll(options: FetchEvent | HandlerCallbackOptions): [Promise<Response>, Promise<void>] {
    return this.instance.handleAll(options);
  }
}
