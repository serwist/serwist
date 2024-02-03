import { disableDevLogs } from "./disableDevLogs.js";
import type { FallbackEntry, FallbackMatcher, FallbacksOptions } from "./fallbacks.js";
import { fallbacks } from "./fallbacks.js";
import { type HandlePrecachingOptions, handlePrecaching } from "./handlePrecaching.js";
import { type InstallSerwistOptions, installSerwist } from "./installSerwist.js";
import { registerRuntimeCaching } from "./registerRuntimeCaching.js";
import type { RuntimeCaching } from "./types.js";

export { disableDevLogs, fallbacks, handlePrecaching, installSerwist, registerRuntimeCaching };
export type { FallbackEntry, FallbackMatcher, FallbacksOptions, HandlePrecachingOptions, InstallSerwistOptions as SerwistOptions, RuntimeCaching };
