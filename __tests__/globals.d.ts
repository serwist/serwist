import type { PrecacheEntry } from "@serwist/precaching";

declare global {
  var __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
}
