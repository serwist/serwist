import { getSerwist } from "@serwist/vite/browser";
import type { Serwist } from "@serwist/window";

import { defineNuxtPlugin } from "#imports";

const plugin = defineNuxtPlugin<{ serwist: Serwist | undefined }>(async () => {
  const serwist = await getSerwist();
  return {
    provide: {
      serwist,
    },
  };
});

export default plugin;
