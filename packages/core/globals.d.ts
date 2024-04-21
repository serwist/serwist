import type { SerwistGlobalConfig } from "./src/types.js";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {}
}
