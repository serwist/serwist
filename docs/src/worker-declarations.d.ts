import type { SerwistGlobalConfig } from "@serwist/core";
import { PrecacheEntry } from "@serwist/precaching";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {}
}
