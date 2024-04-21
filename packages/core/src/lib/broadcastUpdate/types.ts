import type { CacheDidUpdateCallbackParam } from "../../types.js";
import type { BROADCAST_UPDATE_MESSAGE_META, BROADCAST_UPDATE_MESSAGE_TYPE } from "./constants.js";

export interface BroadcastCacheUpdateOptions {
  /**
   * A list of headers that will be used to determine whether the responses
   * differ.
   *
   * @default ['content-length', 'etag', 'last-modified']
   */
  headersToCheck?: string[];
  /**
   * A function whose return value
   * will be used as the `payload` field in any cache update messages sent
   * to the window clients.
   * @param options
   * @returns
   */
  generatePayload?: (options: CacheDidUpdateCallbackParam) => Record<string, any>;
  /**
   * If `true` (the default) then all open clients will receive a message. If `false`,
   * then only the client that make the original request will be notified of the update.
   *
   * @default true
   */
  notifyAllClients?: boolean;
}

export type BroadcastPayload = Record<string, any>;

export type BroadcastPayloadGenerator = (options: CacheDidUpdateCallbackParam) => BroadcastPayload;

export interface BroadcastMessage {
  type: typeof BROADCAST_UPDATE_MESSAGE_TYPE;
  meta: typeof BROADCAST_UPDATE_MESSAGE_META;
  payload: BroadcastPayload;
}
