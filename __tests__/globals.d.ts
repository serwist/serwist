import type { PrecacheEntry } from "@serwist/precaching";

declare global {
  // biome-ignore lint/style/noVar: Global augmentation.
  var __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
}
