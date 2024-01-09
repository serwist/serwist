/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { SerwistEventTarget } from "./SerwistEventTarget.js";

/**
 * A minimal `Event` subclass shim.
 * This doesn't *actually* subclass `Event` because not all browsers support
 * constructable `EventTarget`, and using a real `Event` will error.
 * @private
 */
export class SerwistEvent<K extends keyof SerwistEventMap> {
  target?: SerwistEventTarget;
  sw?: ServiceWorker;
  originalEvent?: Event;
  isExternal?: boolean;

  constructor(
    public type: K,
    props: Omit<SerwistEventMap[K], "target" | "type">,
  ) {
    Object.assign(this, props);
  }
}

export interface SerwistMessageEvent extends SerwistEvent<"message"> {
  data: any;
  originalEvent: Event;
  ports: readonly MessagePort[];
}

export interface SerwistLifecycleEvent extends SerwistEvent<keyof SerwistLifecycleEventMap> {
  isUpdate?: boolean;
}

export interface SerwistLifecycleWaitingEvent extends SerwistLifecycleEvent {
  wasWaitingBeforeRegister?: boolean;
}

export interface SerwistLifecycleEventMap {
  installing: SerwistLifecycleEvent;
  installed: SerwistLifecycleEvent;
  waiting: SerwistLifecycleWaitingEvent;
  activating: SerwistLifecycleEvent;
  activated: SerwistLifecycleEvent;
  controlling: SerwistLifecycleEvent;
  redundant: SerwistLifecycleEvent;
}

export interface SerwistEventMap extends SerwistLifecycleEventMap {
  message: SerwistMessageEvent;
}
