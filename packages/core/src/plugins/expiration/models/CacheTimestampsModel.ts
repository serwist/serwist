/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { DBSchema, IDBPDatabase } from "idb";
import { deleteDB, openDB } from "idb";

const DB_NAME = "serwist-expiration";
const CACHE_OBJECT_STORE = "cache-entries";

const normalizeURL = (unNormalizedUrl: string) => {
  const url = new URL(unNormalizedUrl, location.href);
  url.hash = "";

  return url.href;
};

interface CacheTimestampsModelEntry {
  id: string;
  cacheName: string;
  url: string;
  timestamp: number;
}

interface CacheDbSchema extends DBSchema {
  "cache-entries": {
    key: string;
    value: CacheTimestampsModelEntry;
    indexes: { cacheName: string; timestamp: number };
  };
}

/**
 * Returns the timestamp model.
 *
 * @private
 */
export class CacheTimestampsModel {
  private readonly _cacheName: string;
  private _db: IDBPDatabase<CacheDbSchema> | null = null;

  /**
   *
   * @param cacheName
   *
   * @private
   */
  constructor(cacheName: string) {
    this._cacheName = cacheName;
  }

  /**
   * Takes a URL and returns an ID that will be unique in the object store.
   *
   * @param url
   * @returns
   * @private
   */
  private _getId(url: string): string {
    return `${this._cacheName}|${normalizeURL(url)}`;
  }

  /**
   * Performs an upgrade of indexedDB.
   *
   * @param db
   *
   * @private
   */
  private _upgradeDb(db: IDBPDatabase<CacheDbSchema>) {
    const objStore = db.createObjectStore(CACHE_OBJECT_STORE, {
      keyPath: "id",
    });

    // TODO(philipwalton): once we don't have to support EdgeHTML, we can
    // create a single index with the keyPath `['cacheName', 'timestamp']`
    // instead of doing both these indexes.
    objStore.createIndex("cacheName", "cacheName", { unique: false });
    objStore.createIndex("timestamp", "timestamp", { unique: false });
  }

  /**
   * Performs an upgrade of indexedDB and deletes deprecated DBs.
   *
   * @param db
   *
   * @private
   */
  private _upgradeDbAndDeleteOldDbs(db: IDBPDatabase<CacheDbSchema>) {
    this._upgradeDb(db);
    if (this._cacheName) {
      void deleteDB(this._cacheName);
    }
  }

  /**
   * @param url
   * @param timestamp
   *
   * @private
   */
  async setTimestamp(url: string, timestamp: number): Promise<void> {
    url = normalizeURL(url);

    const entry = {
      id: this._getId(url),
      cacheName: this._cacheName,
      url,
      timestamp,
    } satisfies CacheTimestampsModelEntry;
    const db = await this.getDb();
    const tx = db.transaction(CACHE_OBJECT_STORE, "readwrite", {
      durability: "relaxed",
    });
    await tx.store.put(entry);
    await tx.done;
  }

  /**
   * Returns the timestamp stored for a given URL.
   *
   * @param url
   * @returns
   * @private
   */
  async getTimestamp(url: string): Promise<number | undefined> {
    const db = await this.getDb();
    const entry = await db.get(CACHE_OBJECT_STORE, this._getId(url));
    return entry?.timestamp;
  }

  /**
   * Iterates through all the entries in the object store (from newest to
   * oldest) and removes entries once either `maxCount` is reached or the
   * entry's timestamp is less than `minTimestamp`.
   *
   * @param minTimestamp
   * @param maxCount
   * @returns
   * @private
   */
  async expireEntries(minTimestamp: number, maxCount?: number): Promise<string[]> {
    const db = await this.getDb();
    let cursor = await db.transaction(CACHE_OBJECT_STORE, "readwrite").store.index("timestamp").openCursor(null, "prev");
    const urlsDeleted: string[] = [];
    let entriesNotDeletedCount = 0;
    while (cursor) {
      const result = cursor.value;
      // TODO(philipwalton): once we can use a multi-key index, we
      // won't have to check `cacheName` here.
      if (result.cacheName === this._cacheName) {
        // Delete an entry if it's older than the max age or
        // if we already have the max number allowed.
        if ((minTimestamp && result.timestamp < minTimestamp) || (maxCount && entriesNotDeletedCount >= maxCount)) {
          cursor.delete();
          urlsDeleted.push(result.url);
        } else {
          entriesNotDeletedCount++;
        }
      }
      cursor = await cursor.continue();
    }

    return urlsDeleted;
  }

  /**
   * Returns an open connection to the database.
   *
   * @private
   */
  private async getDb() {
    if (!this._db) {
      this._db = await openDB(DB_NAME, 1, {
        upgrade: this._upgradeDbAndDeleteOldDbs.bind(this),
      });
    }
    return this._db;
  }
}
