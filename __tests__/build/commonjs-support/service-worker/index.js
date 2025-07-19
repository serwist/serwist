// @ts-check
import { addEventListeners, createSerwist } from "serwist";

const serwist = createSerwist({
  precache: {
    entries: self.__SW_MANIFEST,
  },
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  disableDevLogs: true,
});

addEventListeners(serwist);
