import { useSerwist } from "virtual:serwist/vue";
import type { Serwist } from "@serwist/window";
import type { Plugin } from "#app";
import { defineNuxtPlugin } from "#imports";

const plugin: Plugin<{ serwist: Serwist | null }> = defineNuxtPlugin(() => {
  const serwist = useSerwist();
  return {
    provide: {
      get serwist() {
        return serwist.value;
      },
    },
  };
});

export default plugin;
