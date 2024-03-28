import { logger } from "@serwist/core/internal";
import { getOrCreatePrecacheController } from "@serwist/precaching/internal";
import { getOrCreateDefaultRouter } from "@serwist/routing/internal";
import { Serwist, type SerwistInstallOptions } from "./Serwist.js";

/**
 * Options for `installSerwist`.
 *
 * @deprecated
 */
export type InstallSerwistOptions = SerwistInstallOptions;

/**
 * Abstracts away the core APIs of Serwist.
 *
 * @param options - `installSerwist` options.
 * @deprecated
 */
export const installSerwist = (options: InstallSerwistOptions): void => {
  if (process.env.NODE_ENV !== "production") {
    logger.warn("'installSerwist' has been deprecated. Please migrate to 'new Serwist().install()'.");
  }
  const serwist = new Serwist({
    precacheController: getOrCreatePrecacheController(),
    router: getOrCreateDefaultRouter(),
  });
  serwist.install(options);
};
