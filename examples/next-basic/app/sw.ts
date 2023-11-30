import { defaultCache } from "@serwist/next/browser";
import { installSerwist } from "@serwist/sw";

installSerwist({
  // @ts-expect-error add definition for __WB_MANIFEST later.
  manifestEntries: self.__WB_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});
