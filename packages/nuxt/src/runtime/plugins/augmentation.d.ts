import type { Serwist } from "@serwist/window";

declare module "#app" {
  interface NuxtApp {
    $serwist: Serwist | null;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $serwist: Serwist | null;
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $serwist: Serwist | null;
  }
}
