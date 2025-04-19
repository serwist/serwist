import type { Serwist } from "@serwist/window";
import { getSerwist } from "virtual:serwist";
import type { Plugin } from "#app";
import { defineNuxtPlugin } from "#imports";

const plugin: Plugin<{ serwist: Serwist | undefined }> = defineNuxtPlugin(async () => {
  const serwist = await getSerwist();
  return {
    provide: {
      serwist,
    },
  };
});

export default plugin;
