declare module "virtual:serwist" {
  import type { Serwist } from "@serwist/window";
  import type { RefObject } from "react";

  export const swUrl: string;
  export const swScope: string;
  export const swType: WorkerType;
  export const useSerwist: () => Serwist | null;
}
