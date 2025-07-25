declare module "virtual:serwist" {
  import type { Serwist } from "@serwist/window";
  export const swUrl: string;
  export const swScope: string;
  export const swType: WorkerType;
  export const getSerwist: () => Serwist | undefined;
}

declare module "virtual:serwist/svelte" {
  import type { Serwist } from "@serwist/window";
  export const useSerwist: () => {
    readonly serwist: Serwist | null;
  };
}

declare module "virtual:serwist/preact" {
  import type { Serwist } from "@serwist/window";
  export const useSerwist: () => Serwist | null;
}

declare module "virtual:serwist/react" {
  import type { Serwist } from "@serwist/window";
  export const useSerwist: () => Serwist | null;
}

declare module "virtual:serwist/solid" {
  import type { Serwist } from "@serwist/window";
  import type { Accessor } from "solid-js";
  export const useSerwist: () => Accessor<Serwist | null>;
}

declare module "virtual:serwist/vue" {
  import type { Serwist } from "@serwist/window";
  import type { ComputedRef } from "vue";
  export const useSerwist: () => ComputedRef<Serwist | null>;
}
