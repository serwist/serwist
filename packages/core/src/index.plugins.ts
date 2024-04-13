import { BackgroundSyncPlugin } from "./plugins/backgroundSync/BackgroundSyncPlugin.js";
import type { BackgroundSyncQueueEntry, BackgroundSyncQueueOptions } from "./plugins/backgroundSync/BackgroundSyncQueue.js";
import { BackgroundSyncQueue } from "./plugins/backgroundSync/BackgroundSyncQueue.js";
import { BackgroundSyncQueueStore } from "./plugins/backgroundSync/BackgroundSyncQueueStore.js";
import { StorableRequest } from "./plugins/backgroundSync/StorableRequest.js";
import { BroadcastCacheUpdate } from "./plugins/broadcastUpdate/BroadcastCacheUpdate.js";
import { BroadcastUpdatePlugin } from "./plugins/broadcastUpdate/BroadcastUpdatePlugin.js";
import {
  BROADCAST_UPDATE_DEFAULT_HEADERS,
  BROADCAST_UPDATE_MESSAGE_META,
  BROADCAST_UPDATE_MESSAGE_TYPE,
} from "./plugins/broadcastUpdate/constants.js";
import { responsesAreSame } from "./plugins/broadcastUpdate/responsesAreSame.js";
import type { BroadcastCacheUpdateOptions, BroadcastMessage, BroadcastPayload, BroadcastPayloadGenerator } from "./plugins/broadcastUpdate/types.js";
import type { CacheableResponseOptions } from "./plugins/cacheableResponse/CacheableResponse.js";
import { CacheableResponse } from "./plugins/cacheableResponse/CacheableResponse.js";
import { CacheableResponsePlugin } from "./plugins/cacheableResponse/CacheableResponsePlugin.js";
import { CacheExpiration } from "./plugins/expiration/CacheExpiration.js";
import type { ExpirationPluginOptions } from "./plugins/expiration/ExpirationPlugin.js";
import { ExpirationPlugin } from "./plugins/expiration/ExpirationPlugin.js";
import type { GoogleAnalyticsInitializeOptions } from "./plugins/googleAnalytics/initializeGoogleAnalytics.js";
import { initializeGoogleAnalytics } from "./plugins/googleAnalytics/initializeGoogleAnalytics.js";
import type { PrecacheFallbackEntry, PrecacheFallbackPluginOptions } from "./plugins/precaching/PrecacheFallbackPlugin.js";
import { PrecacheFallbackPlugin } from "./plugins/precaching/PrecacheFallbackPlugin.js";
import { RangeRequestsPlugin } from "./plugins/rangeRequests/RangeRequestsPlugin.js";
import { createPartialResponse } from "./plugins/rangeRequests/createPartialResponse.js";

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

export {
  // Background synchronization
  BackgroundSyncPlugin,
  BackgroundSyncQueue,
  BackgroundSyncQueueStore,
  StorableRequest,
  // Update broadcasting
  BroadcastCacheUpdate,
  BroadcastUpdatePlugin,
  responsesAreSame,
  BROADCAST_UPDATE_MESSAGE_META,
  BROADCAST_UPDATE_MESSAGE_TYPE,
  BROADCAST_UPDATE_DEFAULT_HEADERS,
  // Cacheable responses
  CacheableResponse,
  CacheableResponsePlugin,
  // Expiration
  CacheExpiration,
  ExpirationPlugin,
  // Precaching
  PrecacheFallbackPlugin,
  // Range requests
  createPartialResponse,
  RangeRequestsPlugin,
  // Google Analytics
  initializeGoogleAnalytics,
};

export type {
  // Background synchronization
  BackgroundSyncQueueOptions,
  BackgroundSyncQueueEntry,
  // Update broadcasting
  BroadcastCacheUpdateOptions,
  BroadcastPayload,
  BroadcastPayloadGenerator,
  BroadcastMessage,
  // Cacheable responses
  CacheableResponseOptions,
  // Expiration
  ExpirationPluginOptions,
  // Precaching
  PrecacheFallbackEntry,
  PrecacheFallbackPluginOptions,
  // Google Analytics
  GoogleAnalyticsInitializeOptions,
};
