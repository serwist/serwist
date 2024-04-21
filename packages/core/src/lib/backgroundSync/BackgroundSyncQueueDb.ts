/*
  Copyright 2021 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { DBSchema, IDBPDatabase } from "idb";
import { openDB } from "idb";

import type { RequestData } from "./StorableRequest.js";

interface BackgroundSyncQueueDBSchema extends DBSchema {
  requests: {
    key: number;
    value: BackgroundSyncQueueStoreEntry;
    indexes: { queueName: string };
  };
}

const BACKGROUND_SYNC_DB_VERSION = 3;
const BACKGROUND_SYNC_DB_NAME = "serwist-background-sync";
const REQUEST_OBJECT_STORE_NAME = "requests";
const QUEUE_NAME_INDEX = "queueName";

export interface UnidentifiedQueueStoreEntry {
  requestData: RequestData;
  timestamp: number;
  id?: number;
  queueName?: string;
  metadata?: Record<string, unknown>;
}

export interface BackgroundSyncQueueStoreEntry extends UnidentifiedQueueStoreEntry {
  id: number;
}

/**
 * A class to interact directly an IndexedDB created specifically to save and
 * retrieve QueueStoreEntries. This class encapsulates all the schema details
 * to store the representation of a Queue.
 *
 * @private
 */

export class BackgroundSyncQueueDb {
  private _db: IDBPDatabase<BackgroundSyncQueueDBSchema> | null = null;

  /**
   * Add QueueStoreEntry to underlying db.
   *
   * @param entry
   */
  async addEntry(entry: UnidentifiedQueueStoreEntry): Promise<void> {
    const db = await this.getDb();
    const tx = db.transaction(REQUEST_OBJECT_STORE_NAME, "readwrite", {
      durability: "relaxed",
    });
    await tx.store.add(entry as BackgroundSyncQueueStoreEntry);
    await tx.done;
  }

  /**
   * Returns the first entry id in the ObjectStore.
   *
   * @returns
   */
  async getFirstEntryId(): Promise<number | undefined> {
    const db = await this.getDb();
    const cursor = await db.transaction(REQUEST_OBJECT_STORE_NAME).store.openCursor();
    return cursor?.value.id;
  }

  /**
   * Get all the entries filtered by index
   *
   * @param queueName
   * @returns
   */
  async getAllEntriesByQueueName(queueName: string): Promise<BackgroundSyncQueueStoreEntry[]> {
    const db = await this.getDb();
    const results = await db.getAllFromIndex(REQUEST_OBJECT_STORE_NAME, QUEUE_NAME_INDEX, IDBKeyRange.only(queueName));
    return results ? results : new Array<BackgroundSyncQueueStoreEntry>();
  }

  /**
   * Returns the number of entries filtered by index
   *
   * @param queueName
   * @returns
   */
  async getEntryCountByQueueName(queueName: string): Promise<number> {
    const db = await this.getDb();
    return db.countFromIndex(REQUEST_OBJECT_STORE_NAME, QUEUE_NAME_INDEX, IDBKeyRange.only(queueName));
  }

  /**
   * Deletes a single entry by id.
   *
   * @param id the id of the entry to be deleted
   */
  async deleteEntry(id: number): Promise<void> {
    const db = await this.getDb();
    await db.delete(REQUEST_OBJECT_STORE_NAME, id);
  }

  /**
   *
   * @param queueName
   * @returns
   */
  async getFirstEntryByQueueName(queueName: string): Promise<BackgroundSyncQueueStoreEntry | undefined> {
    return await this.getEndEntryFromIndex(IDBKeyRange.only(queueName), "next");
  }

  /**
   *
   * @param queueName
   * @returns
   */
  async getLastEntryByQueueName(queueName: string): Promise<BackgroundSyncQueueStoreEntry | undefined> {
    return await this.getEndEntryFromIndex(IDBKeyRange.only(queueName), "prev");
  }

  /**
   * Returns either the first or the last entries, depending on direction.
   * Filtered by index.
   *
   * @param direction
   * @param query
   * @returns
   * @private
   */
  async getEndEntryFromIndex(query: IDBKeyRange, direction: IDBCursorDirection): Promise<BackgroundSyncQueueStoreEntry | undefined> {
    const db = await this.getDb();

    const cursor = await db.transaction(REQUEST_OBJECT_STORE_NAME).store.index(QUEUE_NAME_INDEX).openCursor(query, direction);
    return cursor?.value;
  }

  /**
   * Returns an open connection to the database.
   *
   * @private
   */
  private async getDb() {
    if (!this._db) {
      this._db = await openDB(BACKGROUND_SYNC_DB_NAME, BACKGROUND_SYNC_DB_VERSION, {
        upgrade: this._upgradeDb,
      });
    }
    return this._db;
  }

  /**
   * Upgrades QueueDB
   *
   * @param db
   * @param oldVersion
   * @private
   */
  private _upgradeDb(db: IDBPDatabase<BackgroundSyncQueueDBSchema>, oldVersion: number) {
    if (oldVersion > 0 && oldVersion < BACKGROUND_SYNC_DB_VERSION) {
      if (db.objectStoreNames.contains(REQUEST_OBJECT_STORE_NAME)) {
        db.deleteObjectStore(REQUEST_OBJECT_STORE_NAME);
      }
    }

    const objStore = db.createObjectStore(REQUEST_OBJECT_STORE_NAME, {
      autoIncrement: true,
      keyPath: "id",
    });
    objStore.createIndex(QUEUE_NAME_INDEX, QUEUE_NAME_INDEX, { unique: false });
  }
}
