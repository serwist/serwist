import type { SerwistGlobalConfig } from "@serwist/core";
import { PrecacheEntry } from "@serwist/sw/precaching";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {}
}
