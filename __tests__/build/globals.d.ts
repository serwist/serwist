import type { PrecacheEntry } from "@serwist/sw/precaching";

declare global {
  var __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
}
