import { SerwistError } from "../../utils/SerwistError.js";
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import { assert } from "../../utils/assert.js";
import { getFriendlyURL } from "../../utils/getFriendlyURL.js";
import { logger } from "../../utils/logger.js";
import type { BackgroundSyncQueueStoreEntry, UnidentifiedQueueStoreEntry } from "./BackgroundSyncQueueDb.js";
import { BackgroundSyncQueueStore } from "./BackgroundSyncQueueStore.js";
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

// Give TypeScript the correct global.
declare const self: ServiceWorkerGlobalScope;

interface OnSyncCallbackOptions {
  queue: BackgroundSyncQueue;
}

type OnSyncCallback = (options: OnSyncCallbackOptions) => void | Promise<void>;

export interface BackgroundSyncQueueOptions {
  /**
   * If `true`, instead of attempting to use background sync events, always attempt
   * to replay queued request at service worker startup. Most folks will not need
   * this, unless you explicitly target a runtime like Electron that exposes the
   * interfaces for background sync, but does not have a working implementation.
   *
   * @default false
   */
  forceSyncFallback?: boolean;
  /**
   * The amount of time (in minutes) a request may be retried. After this amount
   * of time has passed, the request will be deleted from the queue.
   *
   * @default 60 * 24 * 7
   */
  maxRetentionTime?: number;
  /**
   * A function that gets invoked whenever the 'sync' event fires. The function
   * is invoked with an object containing the `queue` property (referencing this
   * instance), and you can use the callback to customize the replay behavior of
   * the queue. When not set the `replayRequests()` method is called. Note: if the
   * replay fails after a sync event, make sure you throw an error, so the browser
   * knows to retry the sync event later.
   */
  onSync?: OnSyncCallback;
}

export interface BackgroundSyncQueueEntry {
  /**
   * The request to store in the queue.
   */
  request: Request;
  /**
   * The timestamp (Epoch time in milliseconds) when the request was first added
   * to the queue. This is used along with `maxRetentionTime` to remove outdated
   * requests. In general you don't need to set this value, as it's automatically
   * set for you (defaulting to `Date.now()`), but you can update it if you don't
   * want particular requests to expire.
   */
  timestamp?: number;
  /**
   * Any metadata you want associated with the stored request. When requests are
   * replayed you'll have access to this metadata object in case you need to modify
   * the request beforehand.
   */
  metadata?: Record<string, unknown>;
}

const TAG_PREFIX = "serwist-background-sync";
const MAX_RETENTION_TIME = 60 * 24 * 7; // 7 days in minutes

const queueNames = new Set<string>();

/**
 * Converts a QueueStore entry into the format exposed by Queue. This entails
 * converting the request data into a real request and omitting the `id` and
 * `queueName` properties.
 *
 * @param queueStoreEntry
 * @returns
 * @private
 */
const convertEntry = (queueStoreEntry: UnidentifiedQueueStoreEntry): BackgroundSyncQueueEntry => {
  const queueEntry: BackgroundSyncQueueEntry = {
    request: new StorableRequest(queueStoreEntry.requestData).toRequest(),
    timestamp: queueStoreEntry.timestamp,
  };
  if (queueStoreEntry.metadata) {
    queueEntry.metadata = queueStoreEntry.metadata;
  }
  return queueEntry;
};

/**
 * A class to manage storing failed requests in IndexedDB and retrying them
 * later. All parts of the storing and replaying process are observable via
 * callbacks.
 */
export class BackgroundSyncQueue {
  private readonly _name: string;
  private readonly _onSync: OnSyncCallback;
  private readonly _maxRetentionTime: number;
  private readonly _queueStore: BackgroundSyncQueueStore;
  private readonly _forceSyncFallback: boolean;
  private _syncInProgress = false;
  private _requestsAddedDuringSync = false;

  /**
   * Creates an instance of Queue with the given options
   *
   * @param name The unique name for this queue. This name must be
   * unique as it's used to register sync events and store requests
   * in IndexedDB specific to this instance. An error will be thrown if
   * a duplicate name is detected.
   * @param options
   */
  constructor(name: string, { forceSyncFallback, onSync, maxRetentionTime }: BackgroundSyncQueueOptions = {}) {
    // Ensure the store name is not already being used
    if (queueNames.has(name)) {
      throw new SerwistError("duplicate-queue-name", { name });
    }
    queueNames.add(name);

    this._name = name;
    this._onSync = onSync || this.replayRequests;
    this._maxRetentionTime = maxRetentionTime || MAX_RETENTION_TIME;
    this._forceSyncFallback = Boolean(forceSyncFallback);
    this._queueStore = new BackgroundSyncQueueStore(this._name);

    this._addSyncListener();
  }

  /**
   * @returns
   */
  get name(): string {
    return this._name;
  }

  /**
   * Stores the passed request in IndexedDB (with its timestamp and any
   * metadata) at the end of the queue.
   *
   * @param entry
   */
  async pushRequest(entry: BackgroundSyncQueueEntry): Promise<void> {
    if (process.env.NODE_ENV !== "production") {
      assert!.isType(entry, "object", {
        moduleName: "serwist",
        className: "BackgroundSyncQueue",
        funcName: "pushRequest",
        paramName: "entry",
      });
      assert!.isInstance(entry.request, Request, {
        moduleName: "serwist",
        className: "BackgroundSyncQueue",
        funcName: "pushRequest",
        paramName: "entry.request",
      });
    }

    await this._addRequest(entry, "push");
  }

  /**
   * Stores the passed request in IndexedDB (with its timestamp and any
   * metadata) at the beginning of the queue.
   *
   * @param entry
   */
  async unshiftRequest(entry: BackgroundSyncQueueEntry): Promise<void> {
    if (process.env.NODE_ENV !== "production") {
      assert!.isType(entry, "object", {
        moduleName: "serwist",
        className: "BackgroundSyncQueue",
        funcName: "unshiftRequest",
        paramName: "entry",
      });
      assert!.isInstance(entry.request, Request, {
        moduleName: "serwist",
        className: "BackgroundSyncQueue",
        funcName: "unshiftRequest",
        paramName: "entry.request",
      });
    }

    await this._addRequest(entry, "unshift");
  }

  /**
   * Removes and returns the last request in the queue (along with its
   * timestamp and any metadata).
   *
   * @returns
   */
  async popRequest(): Promise<BackgroundSyncQueueEntry | undefined> {
    return this._removeRequest("pop");
  }

  /**
   * Removes and returns the first request in the queue (along with its
   * timestamp and any metadata).
   *
   * @returns
   */
  async shiftRequest(): Promise<BackgroundSyncQueueEntry | undefined> {
    return this._removeRequest("shift");
  }

  /**
   * Returns all the entries that have not expired (per `maxRetentionTime`).
   * Any expired entries are removed from the queue.
   *
   * @returns
   */
  async getAll(): Promise<BackgroundSyncQueueEntry[]> {
    const allEntries = await this._queueStore.getAll();
    const now = Date.now();

    const unexpiredEntries = [];
    for (const entry of allEntries) {
      // Ignore requests older than maxRetentionTime. Call this function
      // recursively until an unexpired request is found.
      const maxRetentionTimeInMs = this._maxRetentionTime * 60 * 1000;
      if (now - entry.timestamp > maxRetentionTimeInMs) {
        await this._queueStore.deleteEntry(entry.id);
      } else {
        unexpiredEntries.push(convertEntry(entry));
      }
    }

    return unexpiredEntries;
  }

  /**
   * Returns the number of entries present in the queue.
   * Note that expired entries (per `maxRetentionTime`) are also included in this count.
   *
   * @returns
   */
  async size(): Promise<number> {
    return await this._queueStore.size();
  }

  /**
   * Adds the entry to the QueueStore and registers for a sync event.
   *
   * @param entry
   * @param operation
   * @private
   */
  async _addRequest({ request, metadata, timestamp = Date.now() }: BackgroundSyncQueueEntry, operation: "push" | "unshift"): Promise<void> {
    const storableRequest = await StorableRequest.fromRequest(request.clone());
    const entry: UnidentifiedQueueStoreEntry = {
      requestData: storableRequest.toObject(),
      timestamp,
    };

    // Only include metadata if it's present.
    if (metadata) {
      entry.metadata = metadata;
    }

    switch (operation) {
      case "push":
        await this._queueStore.pushEntry(entry);
        break;
      case "unshift":
        await this._queueStore.unshiftEntry(entry);
        break;
    }

    if (process.env.NODE_ENV !== "production") {
      logger.log(`Request for '${getFriendlyURL(request.url)}' has ` + `been added to background sync queue '${this._name}'.`);
    }

    // Don't register for a sync if we're in the middle of a sync. Instead,
    // we wait until the sync is complete and call register if
    // `this._requestsAddedDuringSync` is true.
    if (this._syncInProgress) {
      this._requestsAddedDuringSync = true;
    } else {
      await this.registerSync();
    }
  }

  /**
   * Removes and returns the first or last (depending on `operation`) entry
   * from the QueueStore that's not older than the `maxRetentionTime`.
   *
   * @param operation
   * @returns
   * @private
   */
  async _removeRequest(operation: "pop" | "shift"): Promise<BackgroundSyncQueueEntry | undefined> {
    const now = Date.now();
    let entry: BackgroundSyncQueueStoreEntry | undefined;
    switch (operation) {
      case "pop":
        entry = await this._queueStore.popEntry();
        break;
      case "shift":
        entry = await this._queueStore.shiftEntry();
        break;
    }

    if (entry) {
      // Ignore requests older than maxRetentionTime. Call this function
      // recursively until an unexpired request is found.
      const maxRetentionTimeInMs = this._maxRetentionTime * 60 * 1000;
      if (now - entry.timestamp > maxRetentionTimeInMs) {
        return this._removeRequest(operation);
      }

      return convertEntry(entry);
    }

    return undefined;
  }

  /**
   * Loops through each request in the queue and attempts to re-fetch it.
   * If any request fails to re-fetch, it's put back in the same position in
   * the queue (which registers a retry for the next sync event).
   */
  async replayRequests(): Promise<void> {
    let entry: BackgroundSyncQueueEntry | undefined = undefined;
    while ((entry = await this.shiftRequest())) {
      try {
        await fetch(entry.request.clone());

        if (process.env.NODE_ENV !== "production") {
          logger.log(`Request for '${getFriendlyURL(entry.request.url)}' ` + `has been replayed in queue '${this._name}'`);
        }
      } catch (error) {
        await this.unshiftRequest(entry);

        if (process.env.NODE_ENV !== "production") {
          logger.log(`Request for '${getFriendlyURL(entry.request.url)}' ` + `failed to replay, putting it back in queue '${this._name}'`);
        }
        throw new SerwistError("queue-replay-failed", { name: this._name });
      }
    }
    if (process.env.NODE_ENV !== "production") {
      logger.log(`All requests in queue '${this.name}' have successfully replayed; the queue is now empty!`);
    }
  }

  /**
   * Registers a sync event with a tag unique to this instance.
   */
  async registerSync(): Promise<void> {
    // See https://github.com/GoogleChrome/workbox/issues/2393
    if ("sync" in self.registration && !this._forceSyncFallback) {
      try {
        await self.registration.sync.register(`${TAG_PREFIX}:${this._name}`);
      } catch (err) {
        // This means the registration failed for some reason, possibly due to
        // the user disabling it.
        if (process.env.NODE_ENV !== "production") {
          logger.warn(`Unable to register sync event for '${this._name}'.`, err);
        }
      }
    }
  }

  /**
   * In sync-supporting browsers, this adds a listener for the sync event.
   * In non-sync-supporting browsers, or if _forceSyncFallback is true, this
   * will retry the queue on service worker startup.
   *
   * @private
   */
  private _addSyncListener() {
    // See https://github.com/GoogleChrome/workbox/issues/2393
    if ("sync" in self.registration && !this._forceSyncFallback) {
      self.addEventListener("sync", (event: SyncEvent) => {
        if (event.tag === `${TAG_PREFIX}:${this._name}`) {
          if (process.env.NODE_ENV !== "production") {
            logger.log(`Background sync for tag '${event.tag}' has been received`);
          }

          const syncComplete = async () => {
            this._syncInProgress = true;

            let syncError: Error | undefined = undefined;
            try {
              await this._onSync({ queue: this });
            } catch (error) {
              if (error instanceof Error) {
                syncError = error;

                // Rethrow the error. Note: the logic in the finally clause
                // will run before this gets rethrown.
                throw syncError;
              }
            } finally {
              // New items may have been added to the queue during the sync,
              // so we need to register for a new sync if that's happened...
              // Unless there was an error during the sync, in which
              // case the browser will automatically retry later, as long
              // as `event.lastChance` is not true.
              if (this._requestsAddedDuringSync && !(syncError && !event.lastChance)) {
                await this.registerSync();
              }

              this._syncInProgress = false;
              this._requestsAddedDuringSync = false;
            }
          };
          event.waitUntil(syncComplete());
        }
      });
    } else {
      if (process.env.NODE_ENV !== "production") {
        logger.log("Background sync replaying without background sync event");
      }
      // If the browser doesn't support background sync, or the developer has
      // opted-in to not using it, retry every time the service worker starts up
      // as a fallback.
      void this._onSync({ queue: this });
    }
  }

  /**
   * Returns the set of queue names. This is primarily used to reset the list
   * of queue names in tests.
   *
   * @returns
   * @private
   */
  static get _queueNames(): Set<string> {
    return queueNames;
  }
}
