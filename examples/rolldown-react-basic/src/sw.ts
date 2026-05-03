import { defaultCache } from "rolldown-plugin-serwist/worker";
import { Serwist } from "serwist";

const serwist = new Serwist({
  skipWaiting: true,
  navigationPreload: true,
  clientsClaim: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();
