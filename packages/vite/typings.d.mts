declare module "virtual:serwist" {
  import type { Serwist } from "@serwist/window";

  export const swUrl: string;
  export const swScope: string;
  export const swType: WorkerType;
  export const getSerwist: () => Promise<Serwist | undefined>;
}
