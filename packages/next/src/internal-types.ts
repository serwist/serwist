import type { Asset, Compilation } from "webpack";

export type SerwistNextOptionsKey = "self.__SERWIST_SW_ENTRY";

export interface SerwistNextOptions {
  sw: string;
  scope: string;
  cacheOnNavigation: boolean;
  register: boolean;
  reloadOnOnline: boolean;
  swEntryWorker: string | undefined;
}

export interface ExcludeParams {
  asset: Asset;
  compilation: Compilation;
}
