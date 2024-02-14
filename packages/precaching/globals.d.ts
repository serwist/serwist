import type { SerwistGlobalConfig } from "@serwist/core";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {}
}
