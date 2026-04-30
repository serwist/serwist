import type { PrecacheEntry } from "serwist";

declare global {
  var __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
}
