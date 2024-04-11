/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { PrecacheController } from "./PrecacheController.js";

let defaultPrecacheController: PrecacheController | undefined = undefined;

/**
 * Creates a new, singleton `PrecacheController` if one does not exist. If one does
 * already exist, that instance is returned. This instance is used by Serwist's
 * `PrecacheController`-dependent functions and classes unless you provide a different
 * `Router` to them.
 *
 * @returns The singleton `PrecacheController`.
 * @deprecated
 */
export const getSingletonPrecacheController = (): PrecacheController => {
  if (!defaultPrecacheController) {
    defaultPrecacheController = new PrecacheController();
  }
  return defaultPrecacheController;
};

/**
 * Changes the singleton `PrecacheController` to a different instance. This is meant for when you do not
 * want to pass your own `PrecacheController` to every one of Serwist's `PrecacheController`-dependent
 * functions and classes.
 *
 * It is highly recommended that you call this before anything else, if you plan on doing so.
 *
 * @example
 * ```js
 * import { PrecacheController, setSingletonPrecacheController } from "serwist/legacy";
 *
 * const controller = new PrecacheController();
 *
 * setSingletonPrecacheController(controller);
 *
 * // Do something with your controller...
 * ```
 * @param router
 * @returns The new singleton `PrecacheController`.
 * @deprecated
 */
export const setSingletonPrecacheController = (precacheController: PrecacheController): PrecacheController => {
  defaultPrecacheController = precacheController;
  return defaultPrecacheController;
};
