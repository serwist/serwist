/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import { BackgroundSyncPlugin } from "./BackgroundSyncPlugin.js";
import type { QueueOptions } from "./Queue.js";
import { Queue } from "./Queue.js";
import { QueueStore } from "./QueueStore.js";
import { StorableRequest } from "./StorableRequest.js";

// See https://github.com/GoogleChrome/workbox/issues/2946
interface SyncManager {
  getTags(): Promise<string[]>;
  register(tag: string): Promise<void>;
}

declare global {
  interface ServiceWorkerRegistration {
    readonly sync: SyncManager;
  }

  interface SyncEvent extends ExtendableEvent {
    readonly lastChance: boolean;
    readonly tag: string;
  }

  interface ServiceWorkerGlobalScopeEventMap {
    sync: SyncEvent;
  }
}

export { BackgroundSyncPlugin, Queue, QueueStore, StorableRequest };

export type { QueueOptions };
