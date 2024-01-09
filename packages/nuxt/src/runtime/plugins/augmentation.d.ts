import type { Serwist } from "@serwist/window";

declare module "#app" {
  interface NuxtApp {
    $serwist: Serwist | undefined;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $serwist: Serwist | undefined;
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $serwist: Serwist | undefined;
  }
}
