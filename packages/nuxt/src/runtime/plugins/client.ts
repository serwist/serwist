import { swUrl, swScope, swType } from "virtual:serwist";
import type { Serwist } from "@serwist/window";

import { defineNuxtPlugin } from "#imports";

const plugin = defineNuxtPlugin<{ serwist: Serwist | undefined }>(async () => {
  const serwist = "serviceWorker" in navigator ? new (await import("@serwist/window")).Serwist(swUrl, { scope: swScope, type: swType }) : undefined;
  return {
    provide: {
      serwist,
    },
  };
});

export default plugin;
