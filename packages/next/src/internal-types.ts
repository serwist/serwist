export type SerwistNextOptionsKey = "self.serwistNextOptions";

export interface SerwistNextOptions {
  sw: string;
  scope: string;
  cacheOnFrontEndNav: boolean;
  register: boolean;
  reloadOnOnline: boolean;
  swEntryWorker: string | undefined;
}
