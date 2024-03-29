import { Serwist, type SerwistInstallOptions, type SerwistOptions } from "./abstractions/Serwist.js";
import { disableDevLogs } from "./abstractions/disableDevLogs.js";
import type { FallbackEntry, FallbackMatcher, FallbacksOptions } from "./abstractions/fallbacks.js";
import { fallbacks } from "./abstractions/fallbacks.js";
import { type HandlePrecachingOptions, handlePrecaching } from "./abstractions/handlePrecaching.js";
import { type InstallSerwistOptions, installSerwist } from "./abstractions/installSerwist.js";
import { registerRuntimeCaching } from "./abstractions/registerRuntimeCaching.js";
import type { RuntimeCaching } from "./abstractions/types.js";

export { disableDevLogs, fallbacks, handlePrecaching, installSerwist, Serwist, registerRuntimeCaching };
export type {
  FallbackEntry,
  FallbackMatcher,
  FallbacksOptions,
  HandlePrecachingOptions,
  InstallSerwistOptions,
  SerwistOptions,
  SerwistInstallOptions,
  RuntimeCaching,
};
