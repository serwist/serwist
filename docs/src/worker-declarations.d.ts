import { type SerwistGlobalConfig, PrecacheEntry } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {}
}
