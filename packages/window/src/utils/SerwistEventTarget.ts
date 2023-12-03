/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { SerwistEvent, SerwistEventMap } from "./SerwistEvent.js";

export type ListenerCallback = (event: SerwistEvent<any>) => any;

/**
 * A minimal `EventTarget` shim.
 * This is necessary because not all browsers support constructable
 * `EventTarget`, so using a real `EventTarget` will error.
 * @private
 */
export class SerwistEventTarget {
  private readonly _eventListenerRegistry: Map<keyof SerwistEventMap, Set<ListenerCallback>> = new Map();

  /**
   * @param type
   * @param listener
   * @private
   */
  addEventListener<K extends keyof SerwistEventMap>(type: K, listener: (event: SerwistEventMap[K]) => any): void {
    const foo = this._getEventListenersByType(type);
    foo.add(listener as ListenerCallback);
  }

  /**
   * @param type
   * @param listener
   * @private
   */
  removeEventListener<K extends keyof SerwistEventMap>(type: K, listener: (event: SerwistEventMap[K]) => any): void {
    this._getEventListenersByType(type).delete(listener as ListenerCallback);
  }

  /**
   * @param event
   * @private
   */
  dispatchEvent(event: SerwistEvent<any>): void {
    event.target = this;

    const listeners = this._getEventListenersByType(event.type);
    for (const listener of listeners) {
      listener(event);
    }
  }

  /**
   * Returns a Set of listeners associated with the passed event type.
   * If no handlers have been registered, an empty Set is returned.
   *
   * @param type The event type.
   * @returns An array of handler functions.
   * @private
   */
  private _getEventListenersByType(type: keyof SerwistEventMap) {
    if (!this._eventListenerRegistry.has(type)) {
      this._eventListenerRegistry.set(type, new Set());
    }
    return this._eventListenerRegistry.get(type)!;
  }
}
