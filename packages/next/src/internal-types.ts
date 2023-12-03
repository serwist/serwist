export type SerwistNextOptionsKey = "self.__SERWIST_SW_ENTRY";

export interface SerwistNextOptions {
  sw: string;
  scope: string;
  cacheOnFrontEndNav: boolean;
  register: boolean;
  reloadOnOnline: boolean;
  swEntryWorker: string | undefined;
}
