import type { Serwist } from "@serwist/window";

declare global {
  interface Window {
    serwist: Serwist | undefined;
  }
}
