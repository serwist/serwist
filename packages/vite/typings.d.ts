declare module "virtual:serwist" {
  import type { Serwist } from "@serwist/window";
  export declare const swUrl: string;
  export declare const swScope: string;
  export declare const swType: WorkerType;
  export declare const getSerwist: () => Serwist | undefined;
}

declare module "virtual:serwist.svelte" {
  import type { Serwist } from "@serwist/window";
  export declare const useSerwist: () => {
    readonly serwist: Serwist | null;
  };
}

declare module "virtual:serwist/preact" {
  import type { Serwist } from "@serwist/window";
  export declare const useSerwist: () => Serwist | null;
}

declare module "virtual:serwist/react" {
  import type { Serwist } from "@serwist/window";
  export declare const useSerwist: () => Serwist | null;
}

declare module "virtual:serwist/solid" {
  import type { Serwist } from "@serwist/window";
  import type { Accessor } from "solid-js";
  export declare const useSerwist: () => Accessor<Serwist | null>;
}

declare module "virtual:serwist/vue" {
  import type { Serwist } from "@serwist/window";
  import type { ComputedRef } from "vue";
  export declare const useSerwist: () => ComputedRef<Serwist | null>;
}
